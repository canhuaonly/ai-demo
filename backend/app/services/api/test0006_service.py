"""Test0006 backend Service"""

from app.cosmos import db


def get_login_user(user_id):
    """获取当前登录用户"""

    # 连接到容器
    container = db.get_container_client("chat_user")
    # 查询数据
    user = list(
        container.query_items(
            query="SELECT * FROM chat_user u WHERE u.user_id = @user_id",
            parameters=[{"name": "@user_id", "value": user_id}],
            enable_cross_partition_query=True,
        )
    )[0]
    return user


def get_history_thread_list(user_id):
    """获取会话列表"""

    # 连接到容器
    container = db.get_container_client("chat_history_thread")
    # 查询数据
    history_thread_list = list(
        container.query_items(
            query="SELECT * FROM c u WHERE u.user_id = @user_id AND u.del_flg = '0' ORDER BY u._ts DESC",
            parameters=[{"name": "@user_id", "value": user_id}],
            enable_cross_partition_query=True,
        )
    )
    return history_thread_list


def insert_chat_history_thread(thread):
    """插入会话信息"""

    # 连接到容器
    container = db.get_container_client("chat_history_thread")
    # 插入数据
    container.create_item(body=thread)


def select_chat_history_thread(thread_id):
    """获取会话信息"""

    # 连接到容器
    container = db.get_container_client("chat_history_thread")
    # 查询数据
    history_thread_list = list(
        container.query_items(
            query="SELECT * FROM c u WHERE u.thread_id = @thread_id",
            parameters=[{"name": "@thread_id", "value": thread_id}],
            enable_cross_partition_query=True,
        )
    )
    return history_thread_list[0]


def update_chat_history_thread(thread):
    """更新会话名称"""

    # 连接到容器
    container = db.get_container_client("chat_history_thread")
    # 更新数据
    return container.replace_item(item=thread, body=thread)


# 删除会话
def delete_history_thread(thread):
    """删除会话"""

    # 删除会话(逻辑删除)
    # 连接到容器
    thread_container = db.get_container_client("chat_history_thread")
    # 更新删除标志
    thread_container.replace_item(item=thread, body=thread)


def select_history_messages(thread_id):
    """获取历史消息"""

    # 连接到容器
    container_message = db.get_container_client("chat_history_message")
    # 查询数据
    return list(
        container_message.query_items(
            query="SELECT * FROM c m WHERE m.thread_id = @thread_id ORDER BY m._ts ASC",
            parameters=[{"name": "@thread_id", "value": thread_id}],
            enable_cross_partition_query=True,
        )
    )


def insert_chat_history_message(history_message):
    """插入历史消息"""

    # 连接到容器
    container = db.get_container_client("chat_history_message")
    # 插入数据
    container.create_item(body=history_message)
