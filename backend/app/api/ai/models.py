from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship

from app.api.ai.database import Base


class User(Base):
    __tablename__ = "b_user"

    user_id = Column(Integer, primary_key=True, index=True)
    user_cd = Column(String, unique=True, index=True)
    user_nm = Column(String)

    # item表用于存储物品数据，两者关系是一对多
    # items = relationship("Item", back_populates="owner")

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Wenxin(Base):
    __tablename__ = "wenxin"

    wenxin_id = Column(Integer, primary_key=True, index=True)
    user_cd = Column(String, unique=True, index=True)
    user_nm = Column(String)
    order = Column(Integer)
    message = Column(String)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}