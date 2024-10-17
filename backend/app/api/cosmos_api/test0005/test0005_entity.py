"""Test0004 实体类"""

from pydantic import BaseModel


def chats_user(item_id, user_id, contact_nm, last_msg, del_flg):
    """ 获取用户 """
    user = {
        "id": item_id,
        "user_id": user_id,
        "contact_nm": contact_nm,
        "last_msg": last_msg,
        "del_flg": del_flg,
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


def chars_contact(contact_id, user_id, contact_nm, last_msg, del_flg):
    """ 聊天内容 """
    contact = {
        "id": contact_id,
        "user_id": user_id,
        "contact_nm": contact_nm,
        "last_msg": last_msg,
        "del_flg": del_flg
    }
    return contact


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
