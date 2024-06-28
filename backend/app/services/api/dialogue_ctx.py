# curd.py
from typing import List, Any
from app.models import models
from app.schemas.api import dialogue_ctx
from app.deps.db import DatabaseAsyncSession
from sqlalchemy.sql import select, func


class DialogueCtxService:

    @staticmethod
    async def ask_question(
        session: DatabaseAsyncSession, dialogue_ctx: dialogue_ctx.DialogueCtxIn
    ):
        db_dialogue_ctx = models.DialogueCtx(**dialogue_ctx.dict())
        session.add(db_dialogue_ctx)
        await session.commit()
        # await session.refresh(db_dialogue_ctx)
        return db_dialogue_ctx

    @staticmethod
    async def get_context(session: DatabaseAsyncSession, session_id: str) -> List[Any]:
        # 异步写法：select
        # 指定对象：模型.对象属性
        dialogue_ctx_query = (
            select(models.DialogueCtx.role, models.DialogueCtx.content)
            .where(models.DialogueCtx.session_id == session_id)
            .order_by(models.DialogueCtx.id)
        )

        # 异步需要await修饰符
        result = await session.execute(dialogue_ctx_query)
        # fetchall查询全部数据
        dialogue_list = result.fetchall()
        # 类型转换
        return [
            {"role": context.role, "content": context.content}
            for context in dialogue_list
        ]


# def get_user_by_email(db: Session, email: str):
#     return db.query(models.User).filter(models.User.email == email).first()


# def get_users(db: Session, skip: int = 0, limit: int = 100):
#     return db.query(models.User).offset(skip).limit(limit).all()


# def create_user(db: Session, user: dialogue_ctx.UserCreate):
#     fake_hashed_password = user.password + "notreallyhashed"
#     db_user = models.User(email=user.email, hashed_password=fake_hashed_password)
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user


# def get_items(db: Session, skip: int = 0, limit: int = 100):
#     return db.query(models.Item).offset(skip).limit(limit).all()


# def create_user_item(
#     db: Session, dialogue_ctx: dialogue_ctx.DialogueCtxCreate, user_id: int
# ):
#     db_item = models.DialogueCtx(**dialogue_ctx.dict(), owner_id=user_id)
#     db.add(db_item)
#     db.commit()
#     db.refresh(db_item)
#     return db_item
