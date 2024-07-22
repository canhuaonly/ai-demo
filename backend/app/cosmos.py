from app.core.config import settings
from azure.cosmos.partition_key import PartitionKey
import azure.cosmos.documents as documents
import azure.cosmos.cosmos_client as cosmos_client
import azure.cosmos.exceptions as exceptions


def get_client():
    client = cosmos_client.CosmosClient(
        settings.AZURE_ACCOUNT_HOST,
        {"masterKey": settings.AZURE_ACCOUNT_KEY},
        user_agent="CosmosDBForNoSql",
        user_agent_overwrite=True,
    )
    return client


def get_database():
    try:
        database = get_client().create_database(id=settings.AZURE_DATABASE_ID)
        print("数据库创建成功")
        try:
            database.create_container(
                id="users", partition_key=PartitionKey(path="/id")
            )
            print("容器users创建成功")
            database.create_container(
                id="posts", partition_key=PartitionKey(path="/type")
            )
            print("容器posts创建成功")
        except exceptions.CosmosResourceExistsError:
            print("容器创建失败")
        return database
    except exceptions.CosmosResourceExistsError:
        print("打开数据库")
        return get_client().get_database_client(settings.AZURE_DATABASE_ID)


# TODO 数据库未连接
# database = get_database()
database = None
