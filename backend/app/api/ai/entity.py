from pydantic import BaseModel


class Wenxin(BaseModel):
    wenxin_id: int
    user_cd: str
    user_nm: str
    message_order: int
    message: str

    class Config:
        orm_mode = True


class User(BaseModel):
    user_id: int
    user_cd: str
    user_nm: str

    class Config:
        orm_mode = True


class User_session(BaseModel):
    user_id: int
    user_cd: str
    user_nm: str

    class Config:
        orm_mode = True


class Select1(BaseModel):
    user_session_aka: str
    message: str

    class Config:
        orm_mode = True


class Select2():
    def __init__(self, user_session_aka, message):
        self.user_session_aka = user_session_aka
        self.message = message

    class Config:
        orm_mode = True