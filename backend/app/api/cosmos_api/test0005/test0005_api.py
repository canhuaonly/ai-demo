""" Test0005 backend """

import json
import uuid
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse

from app.api.cosmos_api.test0005 import test0005_entity
from app.api.cosmos_api.test0005 import test0005_service
from app.api.cosmos_api import wenxin_api

router = APIRouter()


################################## 👇👇👇 COSMOS DB CRUD API 👇👇👇 ####################################


@router.post("/get_user")
def test0005_cosmos_get_user(param: dict):
    """ 获取当前用户 """

    if param is None or "data" not in param or param['data'] == "":
        raise HTTPException(status_code=400, detail="参数错误1")

    # 检索执行
    current_user = test0005_service.select_login_user_list(param['data'])
    # 返回数据
    return current_user


@router.post("/get_recent_contacts")
def test0005_cosmos_get_recent_contacts(param: dict):
    """ 获取最近联系人 """

    if param is None or "user" not in param or param['user'] == "":
        raise HTTPException(status_code=400, detail="参数错误2")

    # 获取最近联系人
    users = test0005_service.select_recent_contacts_users_list(param['user'])

    # 返回数据
    return users


@router.post("/get_message")
def test0005_cosmos_get_message(param: dict):
    """ 获取最近聊天内容 """

    if param is None or "chat_id" not in param or param['chat_id'] == "":
        raise HTTPException(status_code=400, detail="参数错误3")

    # 检索执行
    message_list = test0005_service.select_current_user_messages_list(param['chat_id'])
    # 返回数据
    return message_list


@router.post("/send_message")
def test0005_cosmos_send_message(param: dict):
    """ 发送消息，获取回答 """

    if param is None or "chat_id" not in param or param['chat_id'] == "":
        raise HTTPException(status_code=400, detail="参数chat_id错误")
    if param is None or "data" not in param or param['data'] == "":
        raise HTTPException(status_code=400, detail="参数data错误")

    # 查询数据
    message_it = test0005_service.select_current_user_messages_list(param['chat_id'])
    # 取得items对象
    message_list: list[test0005_entity.chars_message] = list(message_it)

    messages = []
    for message in message_list:
        messages.append({ "role": "user", "content": message['message_q'] })
        messages.append({ "role": "assistant", "content": message['message_a'] })
    messages.append({ "role": "user", "content": param['data'] })

    # 调用文心一言 API
    text_contact = wenxin_api.main(messages)
    print(text_contact)
    # format
    data = json.loads(text_contact)

    # 取得回答
    result_message = data['result']

    # 设置主键
    message_id = "message_" + param['chat_id'] + "_" + str(len(message_list) + 1)
    # 插入数据
    user = test0005_entity.chars_message(message_id, param['chat_id'],
                                            param['data'], result_message)
    test0005_service.insert_new_message(user)

    print(param)
    return {
        "status": "666",
        "entity": user,
    }


@router.post("/update_contact_nm")
def test0005_cosmos_update_contact_nm(param: dict):
    """ 更新会话名称 """

    if param is None:
        raise HTTPException(status_code=400, detail="参数为空")
    if "chat_id" not in param or param['chat_id'] == "":
        raise HTTPException(status_code=400, detail="参数chat_id为空")
    if "user" not in param or param['user'] == "":
        raise HTTPException(status_code=400, detail="参数user为空")
    if "data" not in param or param['data'] == "":
        raise HTTPException(status_code=400, detail="参数data为空")

    # 查询数据
    current_user = test0005_service.select_contacts_single(param['user'], param['chat_id'])

    if current_user is None or "contact_nm" not in current_user or current_user['contact_nm'] == "":
        # 设置主键
        user_key = str(uuid.uuid4())
        # 插入数据
        user = test0005_entity.chats_user(
                user_key,
                param['user'],
                param['data'],
                "",
                "0"
        )
        response: test0005_entity.chats_user = test0005_service.insert_new_user(user)

        status: str = "666"
    else:
        current_user['contact_nm'] = param['data']
        response: test0005_entity.chats_user = \
            test0005_service.replace_user_item(current_user)

        status: str = "777"

    print(response)
    return {
        "status": status,
        "entity": response,
    }

##############################################################


@router.post("/send_message_stream")
async def test0005_eb_stream(request: Request):
    """流式传输Temp"""

    body = await request.json()
    message_q = body.get("data")
    user_id = body.get("user")
    chat_id = body.get("chat_id")

    if message_q is None or message_q == "":
        raise HTTPException(status_code=400, detail="参数data错误")
    if user_id is None or user_id == "":
        raise HTTPException(status_code=400, detail="参数user错误")
    if chat_id is None or chat_id == "":
        raise HTTPException(status_code=400, detail="参数chat_id错误")

    # 查询数据
    message_it = test0005_service.select_current_user_messages_list(chat_id)
    # 取得items对象
    message_list: list[test0005_entity.chars_message] = list(message_it)

    messages = []
    for message in message_list:
        messages.append({ "role": "user", "content": message['message_q'] })
        messages.append({ "role": "assistant", "content": message['message_a'] })
    messages.append({ "role": "user", "content": message_q })

    resp = gen_stream(message_q, user_id, chat_id)
    resp_stream =  StreamingResponse(resp)

    # response = wenxin_api.get_stream_response(prompt)
    # for chunk in response.iter_lines():
    #     chunk = chunk.decode("utf8")
    #     if chunk[:5] == "data:":
    #         chunk = chunk[5:]
    #     print(f"回复消息：{chunk}")
    #     yield chunk
    # resp_stream =  StreamingResponse(chunk)

    print(resp_stream)
    print("finally----------------------")
    return resp_stream


def gen_stream(message_q, user_id, chat_id):
    """获取流式回复"""

    print(f"问题：{message_q}")
    print("开始生成流式回复")

    message_a = ""
    print(f"param:{user_id}, {chat_id}, {message_a}")

    response = wenxin_api.get_stream_response(message_q)
    for chunk in response.iter_lines():
        chunk = chunk.decode("utf8")
        if chunk[:5] == "data:":
            chunk = chunk[5:]
            # print(f"回复消息1：{chunk}")
            # json_chunk = json.loads(chunk)
            # message_a = message_a + json_chunk['result']
            # if json_chunk['is_end']:
                # insert_message(user_id, chat_id, message_q, message_a)
            # else:
                # print(f"回复消息：{results_str}")
                # print(f"回复消息：{json_chunk['result']}")
            yield chunk
        # time.sleep(0.01)


@router.post("/update_send")
def update_send(param: dict):
    """
    插入message数据
    更新contacts数据
    """

    if param is None:
        raise HTTPException(status_code=400, detail="参数为空")
    if "message_q" not in param or param['message_q'] == "":
        raise HTTPException(status_code=400, detail="参数message_q为空")
    if "message_a" not in param or param['message_a'] == "":
        raise HTTPException(status_code=400, detail="参数message_a为空")
    if "chat_id" not in param or param['chat_id'] == "":
        raise HTTPException(status_code=400, detail="参数chat_id为空")
    if "user_id" not in param or param['user_id'] == "":
        raise HTTPException(status_code=400, detail="参数user_id为空")

    # 设置主键
    message_key = "message_" + str(uuid.uuid4())
    # 插入消息表
    messages = test0005_entity.chars_message(message_key, param['chat_id'], param['message_q'], param['message_a'])
    test0005_service.insert_new_message(messages)

    # 更新会话表
    contacts = test0005_service.select_contacts_single(param['user_id'], param['chat_id'])
    contacts['last_msg'] = param['message_a']
    contacts_entity = test0005_service.replace_contacts_item(contacts)

    print(f"question：{param['message_q']}")
    print(f"answer：{param['message_a']}")
    print("finally~")

    return {
        "status": "666",
        "entity": contacts_entity,
    }
