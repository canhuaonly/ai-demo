"""Test0004 backend Service"""

from app.cosmos import db


def select_login_user_list(data):
    """获取当前登录用户"""

    # 连接到容器
    container = db.get_container_client("users")
    # 查询数据
    return list(container.query_items(
        query="SELECT * FROM users u WHERE u.userId = 'login' AND u.userCd = @userCd",
        parameters=[{"name": "@userCd", "value": data}],
        enable_cross_partition_query=True,
    ))


def select_login_user_list1(data):
    """获取当前登录用户"""

    # 连接到容器
    container = db.get_container_client("users")
    # 查询数据
    return container.query_items(
        query="SELECT * FROM users u WHERE u.userId = 'login' AND u.userCd = @userCd",
        parameters=[{"name": "@userCd", "value": data}],
        enable_cross_partition_query=True,
    )


def select_recent_contacts_users_list(user):
    """获取最近联系人"""

    # 连接到容器
    container = db.get_container_client("contacts")
    # 查询数据
    return list(container.query_items(
        query="""
            SELECT
              *
            FROM
              contacts c
            WHERE
              c.user_id = @user_id
              AND c.del_flg = '0'
            ORDER BY c._ts DESC
            """,
        parameters=[{"name": "@user_id", "value": user}],
        enable_cross_partition_query=True,
    ))


def select_recent_contacts_messages_list(user):
    """获取用户最近聊天列表"""

    # 连接到容器
    container_message = db.get_container_client("messages")
    # 查询数据
    return list(container_message.query_items(
            query="SELECT * FROM messages c WHERE c.chatId = @chat_id ORDER BY c._ts DESC",
            parameters=[{"name": "@chat_id", "value": user}],
            enable_cross_partition_query=True,
    ))


def select_current_user_messages_list(chat_id):
    """获取当前用户的聊天记录"""

    # 连接到容器
    container = db.get_container_client("messages")
    # 查询数据
    return list(container.query_items(
        query="SELECT * FROM messages c WHERE c.chatId = @chat_id ORDER BY c._ts ASC",
        parameters=[{"name": "@chat_id", "value": chat_id}],
        enable_cross_partition_query=True,
    ))


def insert_new_message(user):
    """插入新消息"""

    # 连接到容器
    container = db.get_container_client("messages")
    # 插入数据
    container.create_item(body=user)


def insert_new_user(user):
    """插入新用户"""

    # 连接到容器
    container = db.get_container_client("contacts")
    # 插入数据
    results = container.create_item(body=user)
    return results


def select_user_single(user_id, chat_id):
    """获取当前选择的会话"""

    # 连接到容器
    container = db.get_container_client("contacts")
    # 查询数据
    users_it = container.query_items(
        query="""
          SELECT
            *
          FROM
            contacts c
          WHERE
            c.user_id = @user_id
            AND c.id = @id
            AND c.del_flg = '0'
        """,
        parameters=[
            {"name": "@user_id", "value": user_id},
            {"name": "@id", "value": chat_id}
        ],
        enable_cross_partition_query=True,
    )
    results = list(users_it)

    if len(results) == 0:
        return {}
    else:
        return results[0]


def replace_user_item(current_user):
    """更新用户名"""

    # 连接到容器
    container = db.get_container_client("users")
    # 插入数据
    return container.replace_item(item=current_user, body=current_user)


def select_current_user(user_id, user_key):
    """获取当前登录用户"""

    # 连接到容器
    container = db.get_container_client("users")
    # 查询数据
    current_users = list(container.query_items(
        query="SELECT * FROM users u WHERE u.userId = @userId AND u.id = @id",
        parameters=[{"name": "@userId", "value": user_id},{"name": "@id", "value": user_key}],
        enable_cross_partition_query=True,
    ))

    return current_users[0]
