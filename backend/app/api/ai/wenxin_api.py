import io
import json
import sqlite3
import sys
from typing import Any, List

from fastapi import APIRouter, Depends
from sqlalchemy import Row, Sequence, text
from sqlalchemy.orm import Session

from app.api.ai.database import SessionLocal
from app.api.ai.entity import Wenxin, User, Select1, Select2
from app.api.ai.wenxin import main
from app.api.ai import models

router = APIRouter()


def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


@router.get("/getLyric/{param}")
async def get_lyric(param: str):
    if param == "aaa":
        return {"message": f"百！里！杜！鹃！不！凋！落！"}
    else:
        return {"message": f"error: time out"}


@router.get("/wenxin", response_model=List[Wenxin])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    messages = db.query(models.Wenxin).offset(skip).limit(limit).all()
    return messages


@router.get("/getUser", response_model=List[User])
def get_user(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users


@router.get("/getContactsList", response_model=List[Select1])
def get_contacts_list(db: Session = Depends(get_db)):
    select_sql = text("select * from (SELECT us.user_session_aka, MSG.message FROM user_session us INNER JOIN user u "
                      "ON u.user_id = us.user_id INNER JOIN ( SELECT W.message, W.user_session_id FROM wenxin W ORDER "
                      "BY W.message_order DESC LIMIT 1 ) MSG ON MSG.user_session_id = US.user_session_id) usam")

    select_list = db.execute(select_sql)

    contact_list = select_list.fetchall()

    result2 = [
        {"user_session_aka": context.user_session_aka, "message": context.message}
        for context in contact_list
    ]

    result_list: List[Select1] = []

    for row in contact_list:
        # print(row._mapping.user_session_aka)
        # print(row._data)
        # result = Select1(row._mapping.user_session_aka, row._mapping.message)
        # result.user_session_aka = row._mapping.user_session_aka
        # result.message = row._mapping.message
        # result: Select2 = Select2(row._mapping.user_session_aka, row._mapping.message)
        result_list.append(Select2(row._mapping.user_session_aka, row._mapping.message))

    return result2


@router.post("/sendMessage")
async def send_message(wenxin: Wenxin):
    db: Session = next(get_db())
    me_wenxin = create_wenxin(db=db, wenxin=wenxin)

    all_messages = db.query(models.Wenxin).all()
    return_messages = [me_wenxin]

    messages = []
    for message in all_messages:
        messages.append({
            "role": message.user_cd,
            "content": message.message
        })

    text = main(messages)
    data = json.loads(text)

    result_message = data['result']

    it_wenxin = models.Wenxin(user_cd='assistant', user_nm='文心一言', message=result_message)
    it_wenxin = create_wenxin(db=db, wenxin=it_wenxin)

    return_messages.append(it_wenxin)

    print(me_wenxin.user_cd + ': ' + me_wenxin.message)
    print(it_wenxin.user_cd + ': ' + it_wenxin.message)

    return {
        "status": f"666",
        "entity": return_messages,
    }


def create_wenxin(db: Session, wenxin: Wenxin):
    wenxin.wenxin_id = None

    db_user = db.query(models.Wenxin).order_by(models.Wenxin.wenxin_id.desc()).first()
    if db_user:
        wenxin.message_order = db_user.message_order + 1
    else:
        wenxin.message_order = 1

    db_wenxin = models.Wenxin(user_cd=wenxin.user_cd, user_nm=wenxin.user_nm, message_order=wenxin.message_order, message=wenxin.message)
    # add
    db.add(db_wenxin)
    # commit
    db.commit()
    # 刷新
    db.refresh(db_wenxin)
    return db_wenxin
