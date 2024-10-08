import asyncio
import uuid
from typing import Callable

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from starlette.testclient import TestClient

from app.core.config import settings
from app.db import Base
from app.factory import create_app
from tests.utils import generate_random_string

engine = create_async_engine(
    settings.ASYNC_DATABASE_URI,
)
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


# @pytest.fixture(scope="session", autouse=True)
# async def init_db():
#     async with engine.begin() as conn:
#         await conn.run_sync(Base.metadata.create_all)


@pytest.fixture(scope="session")
async def db():
    async with async_session_maker() as session:
        yield session
        await session.rollback()
        await session.close()


@pytest.fixture(scope="session")
def default_password():
    return generate_random_string(32)


@pytest.fixture(scope="session")
def app():
    return create_app()


@pytest.fixture(scope="session")
async def client(app):
    async with AsyncClient(app=app, base_url="http://127.0.0.1") as ac:
        yield ac


# @pytest.fixture(scope="session")
# def create_user(db: AsyncSession, default_password: str):
#     user_manager = next(get_user_manager())
#     async def inner():
#         user = User(
#             id=uuid.uuid4(),
#             email=f"{generate_random_string(20)}@{generate_random_string(10)}.com",
#             hashed_password=user_manager.password_helper.hash(default_password),
#         )
#         db.add(user)
#         await db.commit()
#         return user
#     return inner
