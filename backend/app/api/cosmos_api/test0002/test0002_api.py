"""Module providingFunction printing python version."""
import json
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.cosmos_api.test0002 import (test0002_entity, test0002_models)
from app.core import config
from app.api.cosmos_api import wenxin_api

router = APIRouter()

################################### 👇👇👇 SQLite3 的 CRUD API 👇👇👇 #####################################

def get_db():
    """
    This is test func
    """
    try:
        db = config.SessionLocal()
        yield db
    finally:
        db.close()


@router.get("/getLyric/{param}")
async def get_lyric(param: str):
    """
    This is test func
    """
    if param == "aaa":
        return {"message": "百！里！杜！鹃！不！凋！落！"}
    else:
        return {"message": "error: time out"}


@router.get("/wenxin", response_model=List[test0002_entity.Wenxin])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    This is test func
    """
    messages = db.query(test0002_models.Wenxin).offset(skip).limit(limit).all()
    return messages


@router.get("/getUser", response_model=List[test0002_entity.User])
def get_user(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    This is test func
    """
    users = db.query(test0002_models.User).offset(skip).limit(limit).all()
    return users


@router.get("/getContactsList", response_model=List[test0002_entity.Select1])
def get_contacts_list(db: Session = Depends(get_db)):
    """
    This is test func
    """
    select_sql = text("""
      SELECT
        * 
      FROM
        ( 
          SELECT
            US.user_session_aka
            , MSG.message 
          FROM
            user_session US 
            INNER JOIN user U 
              ON U.user_id = US.user_id 
            INNER JOIN ( 
              SELECT
                W.message
                , W.user_session_id 
              FROM
                wenxin W 
              ORDER BY
                W.message_order DESC 
              LIMIT
                1
            ) MSG 
              ON MSG.user_session_id = US.user_session_id
        ) usam
    """)

    select_list = db.execute(select_sql)

    contact_list = select_list.fetchall()

    result2 = [
        {"user_session_aka": context.user_session_aka, "message": context.message}
        for context in contact_list
    ]

    # 另一种写法
    # result_list: List[Select1] = []

    # for row in contact_list:
    #     # print(row._mapping.user_session_aka)
    #     # print(row._data)
    #     # result = Select1(row._mapping.user_session_aka, row._mapping.message)
    #     # result.user_session_aka = row._mapping.user_session_aka
    #     # result.message = row._mapping.message
    #     # result: Select2 = Select2(row._mapping.user_session_aka, row._mapping.message)
    #     result_list.append(Select2(row._mapping.user_session_aka, row._mapping.message))

    return result2


@router.post("/sendMessage")
async def send_message(param: test0002_entity.Wenxin):
    """
    This is test func
    """
    db: Session = next(get_db())
    me_wenxin = create_wenxin(db=db, param=param)

    all_messages = db.query(test0002_models.Wenxin).all()
    return_messages = [me_wenxin]

    messages = []
    for message in all_messages:
        messages.append({
            "role": message.user_cd,
            "content": message.message
        })

    text_contact = wenxin_api.main(messages)
    data = json.loads(text_contact)

    result_message = data['result']

    it_wenxin = test0002_models.Wenxin(user_cd='assistant', user_nm='文心一言', message=result_message)
    it_wenxin = create_wenxin(db=db, param=it_wenxin)

    return_messages.append(it_wenxin)

    print(me_wenxin.user_cd + ': ' + me_wenxin.message)
    print(it_wenxin.user_cd + ': ' + it_wenxin.message)

    return {
        "status": "666",
        "entity": return_messages,
    }


def create_wenxin(db: Session, param: test0002_entity.Wenxin):
    """
    This is test func
    """
    param.wenxin_id = None

    db_user = db.query(test0002_models.Wenxin).order_by(test0002_models.Wenxin.wenxin_id.desc()).first()
    if db_user:
        param.message_order = db_user.message_order + 1
    else:
        param.message_order = 1

    db_wenxin = test0002_models.Wenxin(
        user_cd=param.user_cd,
        user_nm=param.user_nm,
        message_order=param.message_order,
        message=param.message
    )
    # add
    db.add(db_wenxin)
    # commit
    db.commit()
    # 刷新
    db.refresh(db_wenxin)
    return db_wenxin
