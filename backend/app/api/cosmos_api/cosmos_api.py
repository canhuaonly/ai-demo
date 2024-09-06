"""Module providingFunction printing python version."""
import json
from fastapi import APIRouter

from app.api.cosmos_api.entity import create_message, chats_user, chats_message, HttpParam
from app.cosmos import database
from app.api.ai.wenxin import main

router = APIRouter()

################################## 👇👇👇 COSMOS DB 的 CRUD API 👇👇👇 ####################################

@router.post("/insert_chars")
def cosmos_insert_chars():
    """
    插入用户数据
    """
    # 连接到容器
    container = database.get_container_client("chats")
    # 插入数据
    user = chats_user("user_id_2", "wangtao01", "Wang")
    container.create_item(body=user)
    return "用户数据插入成功!"


@router.post("/insert_message")
def cosmos_insert_message():
    """
    插入聊天内容
    """
    # 连接到容器
    container = database.get_container_client("chats")
    # 插入数据
    user = chats_message("message_id_1", "wangtao", "Wang")
    container.create_item(body=user)
    return "聊天内容数据插入成功!"


@router.post("/get_user")
def cosmos_get_user(param: HttpParam):
    """
    获取当前用户
    """
    # 连接到容器
    container = database.get_container_client("users")
    # 查询数据
    users_it = container.query_items(
        query="SELECT * FROM users u WHERE u.userId = 'login' AND u.userCd = @userCd",
        parameters=[{"name": "@userCd", "value": param.data}],
        enable_cross_partition_query=True,
    )
    # 取得items对象
    current_user = [item for item in users_it]
    # 返回数据
    return current_user


@router.post("/get_recent_contacts")
def cosmos_get_recent_contacts(param: HttpParam):
    """
    获取最近联系人
    """
    print(param)
    # 连接到容器
    container = database.get_container_client("users")
    container_message = database.get_container_client("messages")
    # 查询数据
    users_it = container.query_items(
        query="SELECT * FROM users u WHERE u.userId = 'user1' AND u.delFlg = '0'",
        parameters=[],
        enable_cross_partition_query=True,
    )

    users = list(users_it)
    for user in users:
        message_it = container_message.query_items(
            query="SELECT * FROM messages c WHERE c.chatId = @chatId ORDER BY c._ts DESC",
            parameters=[{"name": "@chatId", "value": user['id']}],
            enable_cross_partition_query=True,
        )

        message_list = list(message_it)
        if len(message_list) > 0:
            user["lastMsg"] = message_list[0]['message_a']

    # 返回数据
    results = list(users)
    return results


@router.post("/get_message")
def cosmos_get_message(param: HttpParam):
    """
    获取最近聊天内容
    """
    # 连接到容器
    container = database.get_container_client("messages")
    # 查询数据
    message_it = container.query_items(
        query="SELECT * FROM messages c WHERE c.chatId = @chatId ORDER BY c._ts ASC",
        parameters=[{"name": "@chatId", "value": param.chatId}],
        enable_cross_partition_query=True,
    )
    # 取得items对象
    message_list = list(message_it)
    # 返回数据
    return message_list


@router.post("/send_message")
def cosmos_send_message(param: HttpParam):
    """
    发送消息，获取回答
    """
    try:
        ##### 检索所有聊天内容 #####
        # 连接到容器
        container = database.get_container_client("messages")
        # 查询数据
        message_it = container.query_items(
            query="SELECT * FROM messages c WHERE c.chatId = @chatId ORDER BY c._ts ASC",
            parameters=[{"name": "@chatId", "value": param.chatId}],
            enable_cross_partition_query=True,
        )
        # 取得items对象
        message_list = []
        message_list: list[create_message] = list(message_it)
        print(message_list)

        messages = []
        for message in message_list:
            messages.append({ "role": "user", "content": message['message_q'] })
            messages.append({ "role": "assistant", "content": message['message_a'] })
        messages.append({ "role": "user", "content": param.data })

        # 调用文心一言 API
        text_contact = main(messages)
        # format
        data = json.loads(text_contact)

        # 回答
        result_message = data['result']

        message_id = "message_" + param.chatId + "_" + str(len(message_list) + 1)
        # 插入数据
        user = create_message(message_id, param.chatId, param.data, result_message)
        container.create_item(body=user)

        print(user)
    except Exception as e:
        print(e)

    print(param)
    return {
        "status": "666",
        "entity": user,
    }


@router.post("/update_contact_nm")
def cosmos_update_contact_nm(param: HttpParam):
    """
    更新会话名称
    """

    print(param)

    # 连接到容器
    container = database.get_container_client("users")

    # 查询数据
    current_user = list(container.query_items(
        query="SELECT * FROM users u WHERE u.userId = 'user1' AND u.id = @id",
        parameters=[{"name": "@id", "value": param.chatId}],
        enable_cross_partition_query=True,
    ))[0]

    print(current_user)

    read_item = container.read_item(item=current_user, partition_key=param.user)
    read_item['userNm'] = param.data
    response: chats_user = container.replace_item(item=read_item, body=read_item)

    print(response)
    return {
        "status": "666",
        "entity": response,
    }
