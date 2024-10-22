""" Test0006 backend """

import uuid
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from app.schemas.api import test0006_schemas
from app.services.api import test0006_service
from app.api.cosmos_api import wenxin_api

router = APIRouter()


################################## 👇👇👇 COSMOS DB CRUD API 👇👇👇 ####################################


@router.post("/get_user_info")
def get_user_info(param: dict):
    """获取当前用户"""

    if param is None or "user_id" not in param or param["user_id"] == "":
        raise HTTPException(status_code=400, detail="没有获取到用户信息")

    try:
        # 检索执行
        user = test0006_service.get_login_user(param["user_id"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    # 返回数据
    return user


@router.post("/get_history_thread_list")
def get_history_thread_list(param: dict):
    """获取会话列表"""

    if param is None or "user_id" not in param or param["user_id"] == "":
        raise HTTPException(status_code=400, detail="没有获取到用户信息")

    try:
        # 获取最近联系人
        history_thread_list = test0006_service.get_history_thread_list(param["user_id"])

        # 返回数据
        return history_thread_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/create_thread")
def create_thread(param: dict):
    """创建会话"""

    if param is None or "user_id" not in param or param["user_id"] == "":
        raise HTTPException(status_code=400, detail="没有获取到用户信息")

    try:
        # id倸番
        param["id"] = str(uuid.uuid4())
        param["application_id"] = f"ai_{str(uuid.uuid4())}"
        param["user_application_id"] = f"uai_{str(uuid.uuid4())}"
        param["thread_id"] = f"ti_{str(uuid.uuid4())}"
        # 对象转换
        thread = test0006_schemas.chat_history_thread(**param)
        # 插入操作
        test0006_service.insert_chat_history_thread(thread)
        # 返回数据
        return thread
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/update_thread_title")
def update_thread_title(param: dict):
    """更新会话名称"""

    if param is None:
        raise HTTPException(status_code=400, detail="参数为空")
    if "user_application_id" not in param or param["user_application_id"] == "":
        raise HTTPException(status_code=400, detail="pk为空")

    try:
        # 查询数据
        thread = test0006_service.select_chat_history_thread(param["thread_id"])
        thread["thread_title"] = param["thread_title"]
        # 数据不存在
        if thread is None:
            raise HTTPException(status_code=400, detail="数据不存在")
        # 删除数据
        test0006_service.update_chat_history_thread(thread)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"status": "01"}


# 删除会话
@router.post("/delete_thread")
def delete_thread(param: dict):
    """删除会话"""

    if param is None or "thread_id" not in param or param["thread_id"] == "":
        raise HTTPException(status_code=400, detail="会话ID为空")
    try:
        # 查询会话数据
        thread = test0006_service.select_chat_history_thread(param["thread_id"])
        thread["del_flg"] = "1"
        # 会话不存在
        if thread is None:
            raise HTTPException(status_code=400, detail="会话不存在")
        # 删除数据
        test0006_service.delete_history_thread(thread)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "status": "01",
        "entity": thread,
    }


@router.post("/get_history_message")
def get_history_message(param: dict):
    """获取历史消息"""

    # 参数验证
    if param is None or "thread_id" not in param or param["thread_id"] == "":
        raise HTTPException(status_code=400, detail="会话ID取得失败")

    try:
        # 查询数据
        message_list = test0006_service.select_history_messages(param["thread_id"])
        # 返回数据
        return message_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/add_history_message")
def add_history_message(param: dict):
    """插入历史信息"""

    try:
        # 设置主键
        id = "message_" + str(uuid.uuid4())
        # 历史信息对象
        history_message = test0006_schemas.chat_history_message(
            id,
            param["thread_id"],
            param["message_question"],
            param["message_answer"],
            param["question_timestamp"],
            param["answer_timestamp"],
            "token",
        )
        # 历史信息数据插入
        test0006_service.insert_chat_history_message(history_message)
        # 会话对象查询
        thread = test0006_service.select_chat_history_thread(param["thread_id"])
        # 会话对象更新
        thread["last_question"] = param["message_question"]
        thread["last_question_timestamp"] = param["question_timestamp"]
        # 会话数据更新
        test0006_service.update_chat_history_thread(thread)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/interactive_message_stream")
async def interactive_message_stream(request: Request):
    """流式传输Temp"""

    # 获取请求参数
    body = await request.json()
    # 参数验证
    if body is None or len(body) == 0:
        raise HTTPException(status_code=400, detail="会话上下文为空")

    try:
        # 转化为对话列表
        context = []
        for message in body:
            context.append({"role": "user", "content": message["message_question"]})
            context.append({"role": "assistant", "content": message["message_answer"]})
        # 删除最后一个回答
        context.pop()

        resp = gen_stream_answer(context)
        resp_stream = StreamingResponse(resp)

        return resp_stream
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def gen_stream_answer(context):
    """获取流式回复"""

    response = wenxin_api.call_stream_response(context)
    for chunk in response.iter_lines():
        chunk = chunk.decode("utf8")
        if chunk[:5] == "data:":
            chunk = chunk[5:]
            yield chunk
