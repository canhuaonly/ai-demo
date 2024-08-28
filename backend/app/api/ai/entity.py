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