from loguru import logger
from typing import Any
from sqlalchemy.pool import Pool
from sqlalchemy.event import listen  # 事件监听器
from sqlalchemy.engine import Engine
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base
from app.core.config import settings

async_engine = create_async_engine(str(settings.ASYNC_DATABASE_URI), pool_pre_ping=True)

async_session_maker = async_sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


def engine_before_cursor_execute(
    conn, cursor, statement, parameters, context, executemany
):
    if isinstance(parameters, (list, tuple)):
        # 创建一个占位符和参数的映射
        placeholders = {f"param_{i}": param for i, param in enumerate(parameters)}
        # 替换语句中的?为param_0, param_1等
        formatted_statement = statement
        for i, placeholder in enumerate(placeholders):
            formatted_statement = formatted_statement.replace(f"?", placeholder, 1)
        # 使用实际参数值替换占位符
        for placeholder, value in placeholders.items():
            formatted_statement = formatted_statement.replace(
                placeholder, repr(value), 1
            )
        # 删除换行符和制表符，以及多余的空格
        formatted_statement = (
            formatted_statement.replace("\n", " ")
            .replace("\t", " ")
            .replace("  ", " ")
            .strip()
        )
        # 记录日志
        logger.info(f"[{formatted_statement}]")
    else:
        # 对于更复杂的参数结构，你可能需要实现更复杂的逻辑
        logger.warning("Unsupported parameter type for logging with actual params.")
        logger.info(f"\nSQL statement: \n{statement} \nparameters: {parameters}")


# 注册事件监听器
listen(Engine, "before_cursor_execute", engine_before_cursor_execute)

# def pool_checkout(dbapi_connection, connection_record, connection_proxy):
#     logger.debug(
#         f"Connection {connection_record.driver_connection} checked out into pool"
#     )
# listen(Pool, "checkout", pool_checkout)

Base = declarative_base()
