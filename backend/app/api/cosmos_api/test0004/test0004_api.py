""" Test0004 backend """

import json
import time
import uuid
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
import requests

from app.api.cosmos_api.test0004 import test0004_entity
from app.cosmos import db
from app.api.cosmos_api.test0004 import test0004_service
from app.api.cosmos_api import wenxin_api

router = APIRouter()

################################## 👇👇👇 COSMOS DB CRUD API 👇👇👇 ####################################

@router.post("/insert_chars")
def cosmos_insert_chars():
    """ 插入用户数据 """
    # 连接到容器
    container = db.get_container_client("chats")
    # 插入数据
    user = test0004_entity.chats_user("user_03_1", "user3", "wangtao01", "Wang")
    container.create_item(body=user)
    return "用户数据插入成功!"


@router.post("/insert_message")
def cosmos_insert_message():
    """ 插入聊天内容 """
    # 连接到容器
    container = db.get_container_client("chats")
    # 插入数据
    user = test0004_entity.chars_message("message_user_03_1_1", "user_03_1", "你好", "你也好")
    container.create_item(body=user)
    return "聊天内容数据插入成功!"


################################## 👇👇👇 COSMOS DB CRUD API 👇👇👇 ####################################


@router.post("/get_user")
def cosmos_get_user(param: dict):
    """ 获取当前用户 """

    if param is None or "data" not in param or param['data'] == "":
        raise HTTPException(status_code=400, detail="参数错误1")

    # 检索执行
    current_user = test0004_service.select_login_user_list(param['data'])
    # 返回数据
    return current_user


@router.post("/get_user1")
def cosmos_get_user1(param: dict):
    """ TEMP获取当前用户 TODO:要删除 """

    if param is None or "data" not in param or param['data'] == "":
        raise HTTPException(status_code=400, detail="参数错误2")

    # 检索执行
    current_user = test0004_service.select_login_user_list1(param['data'])
    # 返回数据
    return list(current_user)


@router.post("/get_recent_contacts")
def cosmos_get_recent_contacts(param: dict):
    """ 获取最近联系人 """

    if param is None or "user" not in param or param['user'] == "":
        raise HTTPException(status_code=400, detail="参数错误3")

    # 获取最近联系人
    users = test0004_service.select_recent_contacts_users_list(param['user'])

    for user in users:
        # 获取用户最近聊天列表
        message_list = test0004_service.select_recent_contacts_messages_list(user['id'])
        if len(message_list) > 0:
            if message_list[0]['message_a'] != "":
                user["lastMsg"] = message_list[0]['message_a']
            else:
                user["lastMsg"] = "点击开始聊天"
        else:
            user["lastMsg"] = "点击开始聊天"

    # 返回数据
    return users


@router.post("/get_message")
def cosmos_get_message(param: dict):
    """ 获取最近聊天内容 """

    if param is None or "chatId" not in param or param['chatId'] == "":
        raise HTTPException(status_code=400, detail="参数错误4")

    # 检索执行
    message_list = test0004_service.select_current_user_messages_list(param['chatId'])
    # 返回数据
    return message_list


@router.post("/send_message")
def cosmos_send_message(param: dict):
    """ 发送消息，获取回答 """

    if param is None or "chatId" not in param or param['chatId'] == "":
        raise HTTPException(status_code=400, detail="参数chatId错误")
    if param is None or "data" not in param or param['data'] == "":
        raise HTTPException(status_code=400, detail="参数data错误")

    # try:
        ##### 检索所有聊天内容 #####
        # 查询数据
    message_it = test0004_service.select_current_user_messages_list(param['chatId'])
    print(param['chatId'])
    print(message_it)
    print('xxxxxxxxxxxxbbbbbxxxxxxxxxxxxxxxx')
    print(list(message_it))
    # 取得items对象
    message_list: list[test0004_entity.chars_message] = list(message_it)

    print('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    print(message_list)
    messages = []
    for message in message_list:
        messages.append({ "role": "user", "content": message['message_q'] })
        messages.append({ "role": "assistant", "content": message['message_a'] })
    messages.append({ "role": "user", "content": param['data'] })

    print('xxxxxxxxxxxxbbbbbbccccxxxxxxxxxxxxxx')
    # 调用文心一言 API
    text_contact = wenxin_api.main(messages)
    print(text_contact)
    print('xxxxxxxxxxxxbbbbbbccccxxxxxxxxxxxxxx')
    # format
    data = json.loads(text_contact)

    # 取得回答
    result_message = data['result']

    # 设置主键
    message_id = "message_" + param['chatId'] + "_" + str(len(message_list) + 1)
    # 插入数据
    user = test0004_entity.chars_message(message_id, param['chatId'],
                                            param['data'], result_message)
    test0004_service.insert_new_message(user)
    # except HTTPException as e:
    #     print("cosmos error")
    #     raise HTTPException(status_code=e.status_code,detail=str(e.detail),headers=e.headers) from e
    # except Exception as e:
    #     raise ValueError(f"Error occurred: {e}") from e

    print(param)
    return {
        "status": "666",
        "entity": user,
    }


@router.post("/update_contact_nm")
def cosmos_update_contact_nm(param: dict):
    """ 更新会话名称 """

    if param is None:
        raise HTTPException(status_code=400, detail="参数为空")
    if "chatId" not in param or param['chatId'] == "":
        raise HTTPException(status_code=400, detail="参数chatId为空")
    if "user" not in param or param['user'] == "":
        raise HTTPException(status_code=400, detail="参数user为空")
    if "data" not in param or param['data'] == "":
        raise HTTPException(status_code=400, detail="参数data为空")

    # 查询数据
    current_user = test0004_service.select_user_single(param['chatId'])

    # if current_user is None or "userNm" not in current_user or current_user['userNm'] == "":
    #     raise HTTPException(status_code=400, detail="没有检索到数据")

    status: str = ""

    if current_user is None or "userNm" not in current_user or current_user['userNm'] == "":
        # 设置主键
        user_key = str(uuid.uuid4())
        # 插入数据
        user = test0004_entity.chats_user(user_key, param['user'],
                                          param['user'], param['user'], param['data'], "0")
        response: test0004_entity.chats_user = test0004_service.insert_new_user(user)

        status: str = "666"
        # response: test0004_entity.chats_user = \
        #     test0004_service.select_current_user(param['user'], user_key)
    else:
        current_user['userNm'] = param['data']
        response: test0004_entity.chats_user = \
            test0004_service.replace_user_item(current_user)

        status: str = "777"

    print(response)
    return {
        "status": status,
        "entity": response,
    }

def temp_func1():
    """ 临时测试用例 """
    return '77'


def temp_func2():
    """ 临时测试用例 """
    return '88'


def temp_func3():
    """ 临时测试用例 """
    return temp_func1()


##############################################################


@router.post("/eb_stream")
async def eb_stream(request: Request):
    """流式聊天Temp"""
    body = await request.json()
    prompt = body.get("prompt")
    return StreamingResponse(wenxin_api.gen_stream(prompt))
