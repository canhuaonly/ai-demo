""" Cosmos DB Utils"""

from azure.cosmos.partition_key import PartitionKey
from azure.cosmos import cosmos_client
from azure.cosmos import exceptions
from app.core import config


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
        database = get_client().create_database(id=config.settings.AZURE_DATABASE_ID)
        print("数据库创建成功")
        try:
            database.create_container(
                id="demo_users", partition_key=PartitionKey(path="/id")
            )
            print("容器users创建成功")
            database.create_container(
                id="demo_posts", partition_key=PartitionKey(path="/type")
            )
            print("容器posts创建成功")
            database.create_container(
                id="users", partition_key=PartitionKey(path="/userId")
            )
            print("容器users创建成功")
            database.create_container(
                id="messages", partition_key=PartitionKey(path="/chatId")
            )
            print("容器messages创建成功")
            database.create_container(
                id="contacts", partition_key=PartitionKey(path="/user_id")
            )
            print("容器contacts创建成功")
            database.create_container(
                id="chat_user", partition_key=PartitionKey(path="/user_id")
            )
            print("容器chat_user创建成功")
            database.create_container(
                id="chat_history_file", partition_key=PartitionKey(path="/thread_id")
            )
            print("容器chat_history_file创建成功")
            database.create_container(
                id="chat_history_message", partition_key=PartitionKey(path="/thread_id")
            )
            print("容器chat_history_message创建成功")
            database.create_container(
                id="chat_history_thread",
                partition_key=PartitionKey(path="/user_application_id"),
            )
            print("容器chat_history_thread创建成功")
        except exceptions.CosmosResourceExistsError:
            print("容器创建失败")
        return database
    except exceptions.CosmosResourceExistsError:
        print(f"连接数据库：{config.settings.AZURE_DATABASE_ID}")
        return get_client().get_database_client(config.settings.AZURE_DATABASE_ID)

db = get_database()
