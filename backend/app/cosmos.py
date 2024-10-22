""" Cosmos DB Utils"""

from azure.cosmos.partition_key import PartitionKey
from azure.cosmos import cosmos_client
from azure.cosmos import exceptions
from app.core import config
from app.utils.logger import logger_cosmos


def get_client():
    """Create Cosmos Client"""
    client = cosmos_client.CosmosClient(
        config.settings.AZURE_ACCOUNT_HOST,
        {"masterKey": config.settings.AZURE_ACCOUNT_KEY},
        user_agent="CosmosDBForNoSql",
        user_agent_overwrite=True,
    )
    return client


def get_database():
    """Check for the existence of database, else create"""
    try:
        # 创建数据库
        database = get_client().create_database(id=config.settings.AZURE_DATABASE_ID)
        logger_cosmos.info(f"数据库{config.settings.AZURE_DATABASE_ID}创建成功")
        # 创建容器
        create_container("demo_users", "/id")
        create_container("demo_posts", "/type")
        create_container("users", "/userId")
        create_container("messages", "/chatId")
        create_container("contacts", "/user_id")
        create_container("chat_user", "/user_id")
        create_container("chat_history_file", "/thread_id")
        create_container("chat_history_message", "/thread_id")
        create_container("chat_history_thread", "/user_application_id")
        return database
    except exceptions.CosmosResourceExistsError:
        # 数据库已存在，连接数据库
        print(f"连接数据库：{config.settings.AZURE_DATABASE_ID}")
        return get_client().get_database_client(config.settings.AZURE_DATABASE_ID)


def create_container(container_name, partition_key):
    """创建容器"""
    try:
        container = db.create_container(
            id=container_name, partition_key=PartitionKey(path=partition_key)
        )
        logger_cosmos.info(f"容器{container_name}创建成功")
        return container
    except exceptions.CosmosResourceExistsError:
        logger_cosmos.info(f"容器{container_name}已存在")
        return db.get_container_client(container_name)


def get_container(container_name):
    """获取容器"""
    try:
        container = db.get_container_client(container_name)
        return container
    except exceptions.CosmosResourceExistsError:
        logger_cosmos.info(f"容器{container_name}不存在")
        raise Exception(f"容器{container_name}不存在")


db = get_database()


def select_list(container_name, query, params=None):
    """查询列表数据"""

    # 日志记录
    logger_cosmos.info(f"{container_name}:{__query_format(query, params)}")

    try:
        # 容器取得
        container = get_container(container_name)
        # 查询数据
        items = list(
            container.query_items(
                query=query, parameters=params, enable_cross_partition_query=True
            )
        )
        return items
    except exceptions.CosmosHttpResponseError as e:
        logger_cosmos.error(f"查询列表数据失败：{e}")
        return []


def select_one(container_name, query, params=None):
    """查询单一数据"""

    # 日志记录
    logger_cosmos.info(f"{container_name}:{__query_format(query, params)}")

    try:
        # 容器取得
        container = get_container(container_name)
        # 查询数据
        items = list(
            container.query_items(
                query=query, parameters=params, enable_cross_partition_query=True
            )
        )
        if len(items) > 0:
            return items[0]
        else:
            return None
    except exceptions.CosmosHttpResponseError as e:
        logger_cosmos.error(f"查询单一数据失败：{e}")
        return None


def insert(container_name, item):
    """插入数据"""

    # 日志记录
    logger_cosmos.info(f"{container_name}:{item}")

    try:
        get_container(container_name).create_item(body=item)
        return True
    except exceptions.CosmosHttpResponseError as e:
        logger_cosmos.error(f"插入数据失败：{e}")
        return False


def update(container_name, item):
    """更新数据"""

    # 日志记录
    logger_cosmos.info(f"{container_name}:{item}")

    try:
        get_container(container_name).replace_item(item=item, body=item)
        return True
    except exceptions.CosmosHttpResponseError as e:
        logger_cosmos.error(f"更新数据失败：{e}")
        return False


def delete(container_name, item, partition_key):
    """删除数据"""

    # 日志记录
    logger_cosmos.info(f"{container_name}/{partition_key}:{item}")

    try:
        get_container(container_name).delete_item(
            item=item, partition_key=partition_key
        )
        return True
    except exceptions.CosmosHttpResponseError as e:
        logger_cosmos.error(f"删除数据失败：{e}")
        return False


def __query_format(query: str, params: list = None):
    """查询语句格式化"""

    # 格式化查询语句
    query_f = query
    if params is not None and len(params) > 0:
        for i in range(len(params)):
            query_f = query_f.replace(params[i]["name"], f"'{params[i]["value"]}'")
    return query_f
