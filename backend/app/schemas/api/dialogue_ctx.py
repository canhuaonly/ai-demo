# schemas.py
from typing import List, Any
from pydantic import Field, BaseModel


class DialogueCtxIn(BaseModel):
    """数据库序列化"""

    id: int = Field(None, description="id")
    user_id: int = Field(..., description="用户ID")
    session_id: str = Field(..., description="会话ID")
    role: str = Field(..., description="角色")
    content: str = Field(..., description="问答内容", min_length=1)


class DialogueCtxQuery(BaseModel):
    """查询参数序列化"""

    id: int = Field(None, description="id")
    user_id: int = Field(None, description="用户ID")
    session_id: str = Field(..., description="会话ID")
    role: str = Field(None, description="角色")
    content: str = Field(None, description="问答内容", min_length=1)
    qa_list: List[Any] = Field(None, description="上下文")


class DialogueCtxSessionId(BaseModel):
    """删除"""

    session_id: str = Field(..., description="会话ID")
