"""实体类"""
from pydantic import BaseModel


class Wenxin(BaseModel):
    """
    聊天内容表
    """
    wenxin_id: int
    user_cd: str
    user_nm: str
    message_order: int
    message: str

    class Config:
        """
        配置
        """
        orm_mode = True


class User(BaseModel):
    """
    用户表
    """
    user_id: int
    user_cd: str
    user_nm: str

    class Config:
        """
        配置
        """
        orm_mode = True


class UserSession(BaseModel):
    """
    用户表
    """
    user_id: int
    user_cd: str
    user_nm: str

    class Config:
        """
        配置
        """
        orm_mode = True


class Select1(BaseModel):
    """
    最近聊天内容
    """
    user_session_aka: str
    message: str

    class Config:
        """
        配置
        """
        orm_mode = True


class Select2():
    """
    最近聊天内容
    """
    def __init__(self, user_session_aka, message):
        self.user_session_aka = user_session_aka
        self.message = message

    class Config:
        """
        配置
        """
        orm_mode = True
