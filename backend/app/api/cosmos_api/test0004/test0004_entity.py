"""Test0004 实体类"""

from pydantic import BaseModel


def chats_user(item_id, user_id, chat_id, item_cd, item_nm, del_flg):
    """ 获取用户 """
    user = {
        "id": item_id,
        "userId": user_id,
        "chatId": chat_id,
        "userCd": item_cd,
        "userNm": item_nm,
        "delFlg": del_flg,
    }
    return user


def chars_message(message_id, chat_id, message_q, message_a):
    """ 聊天内容 """
    message = {
        "id": message_id,
        "chatId": chat_id,
        "message_q": message_q,
        "message_a": message_a
    }
    return message


class HttpParam(BaseModel):
    """ Param """
    data: str
    user: str
    chatId: str

    class Config:
        """ 配置 """
        orm_mode = True


class Item(BaseModel):
    """ Param """
    param: dict
