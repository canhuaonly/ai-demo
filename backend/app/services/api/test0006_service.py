"""Test0006 backend Service"""

from app import cosmos


def get_login_user(user_id):
    """获取当前登录用户"""

    # 查询数据
    user = cosmos.select_one(
        container_name="chat_user",
        query="SELECT * FROM chat_user u WHERE u.user_id = @user_id",
        params=[{"name": "@user_id", "value": user_id}],
    )
    return user


def get_history_thread_list(user_id):
    """获取会话列表"""

    # 查询数据
    history_thread_list = cosmos.select_list(
        container_name="chat_history_thread",
        query="SELECT * FROM chat_history_thread u WHERE u.user_id = @user_id AND u.del_flg = '0' ORDER BY u._ts DESC",
        params=[{"name": "@user_id", "value": user_id}],
    )
    return history_thread_list


def insert_chat_history_thread(thread):
    """插入会话信息"""

    # 插入数据
    cosmos.insert(container_name="chat_history_thread", item=thread)


def select_chat_history_thread(thread_id):
    """获取会话信息"""

    # 查询数据
    history_thread = cosmos.select_one(
        container_name="chat_history_thread",
        query="SELECT * FROM chat_history_thread u WHERE u.thread_id = @thread_id",
        params=[{"name": "@thread_id", "value": thread_id}],
    )
    return history_thread


def update_chat_history_thread(thread):
    """更新会话名称"""

    # 更新数据
    cosmos.update(container_name="chat_history_thread", item=thread)


# 删除会话
def delete_history_thread(thread):
    """删除会话"""

    # 删除会话(逻辑删除)
    cosmos.update(container_name="chat_history_thread", item=thread)


def select_history_messages(thread_id):
    """获取历史消息"""

    # 查询数据
    message_list = cosmos.select_list(
        container_name="chat_history_message",
        query="SELECT * FROM chat_history_message m WHERE m.thread_id = @thread_id ORDER BY m._ts ASC",
        params=[{"name": "@thread_id", "value": thread_id}],
    )
    return message_list


def insert_chat_history_message(history_message):
    """插入历史消息"""

    # 插入数据
    cosmos.insert(container_name="chat_history_message", item=history_message)
