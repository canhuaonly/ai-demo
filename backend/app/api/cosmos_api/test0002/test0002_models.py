""" Test0002 model """
from sqlalchemy import Column, Integer, String
from app.core.config import Base


class User(Base):
    """ Table: user """
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, index=True)
    user_cd = Column(String, unique=True, index=True)
    user_nm = Column(String)

    # item表用于存储物品数据，两者关系是一对多
    # items = relationship("Item", back_populates="owner")

    def to_dict(self):
        """ dict """
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Wenxin(Base):
    """ Table: wenxin """
    __tablename__ = "wenxin"

    wenxin_id = Column(Integer, primary_key=True, index=True)
    user_cd = Column(String, unique=True, index=True)
    user_nm = Column(String)
    message_order = Column(Integer)
    message = Column(String)

    def to_dict(self):
        """ dict """
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
