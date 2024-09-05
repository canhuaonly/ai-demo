"""实体类"""

from pydantic import BaseModel


def chats_user(item_id, item_cd, item_nm):
    """
    获取用户
    """
    user = {
        "id": item_id,
        "chatId": "user",
        "user_cd": item_cd,
        "user_nm": item_nm,
    }
    return user

def chats_message(message_id, user_cd, user_nm, message_order, message):
    """
    获取用户
    """
    message = {
        "id": message_id,
        "user_cd": user_cd,
        "chatId": "message",
        "user_nm": user_nm,
        "message_order": message_order,
        "message": message,
    }
    return message

def create_message(message_id, chat_id, message_q, message_a):
    """
    聊天内容
    """
    message = {
        "id": message_id,
        "chatId": chat_id,
        "message_q": message_q,
        "message_a": message_a
    }
    return message


class HttpParam(BaseModel):
    """
    Param
    """
    data: str
    user: str
    chatId: str

    class Config:
        """
        配置
        """
        orm_mode = True
