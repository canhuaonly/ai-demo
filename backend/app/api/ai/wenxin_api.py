import io
import json
import sqlite3
import sys
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.ai.database import SessionLocal
from app.api.ai.entity import Wenxin, User
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


@router.get("/getContactsList", response_model=List[User])
def get_contacts_list(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):

    # db.execute("SELECT U.user_nm FROM USER U")

    sql1 = text("SELECT U.user_nm FROM USER U")

    list = db.execute(sql1)

    for row in list :
      print(row._data)

    return list


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
