"""Test0006 实体类"""

from pydantic import BaseModel


def chat_user(item_id, user_id, user_nm, del_flg):
    """用户"""
    user = {
        "id": item_id,
        "user_id": user_id,
        "user_nm": user_nm,
        "del_flg": del_flg,
    }
    return user


def chat_history_thread(
    id,
    user_id,
    application_id,
    user_application_id,
    thread_id,
    thread_title,
    last_question,
    last_question_timestamp,
    del_flg,
):
    """会话"""
    history_thread = {
        "id": id,
        "user_id": user_id,
        "application_id": application_id,
        "user_application_id": user_application_id,
        "thread_id": thread_id,
        "thread_title": thread_title,
        "last_question": last_question,
        "last_question_timestamp": last_question_timestamp,
        "del_flg": del_flg,
    }
    return history_thread


def chat_history_message(
    id,
    thread_id,
    message_question,
    message_answer,
    question_timestamp,
    answer_timestamp,
    token,
):
    """聊天内容"""
    history_message = {
        "id": id,
        "thread_id": thread_id,
        "message_question": message_question,
        "message_answer": message_answer,
        "question_timestamp": question_timestamp,
        "answer_timestamp": answer_timestamp,
        "token": token,
    }
    return history_message


class HttpParam(BaseModel):
    """Param"""

    data: str
    user: str
    chatId: str

    class Config:
        """配置"""

        orm_mode = True


class Item(BaseModel):
    """Param"""

    param: dict
