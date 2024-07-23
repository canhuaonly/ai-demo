from typing import List, Optional

from pydantic import BaseModel


class BUser(BaseModel):
    user_id: int
    user_cd: str
    user_nm: str

    class Config:
        orm_mode = True


class Wenxin(BaseModel):
    wenxin_id: int
    user_cd: str
    user_nm: str
    order: int
    message: str

    class Config:
        orm_mode = True
