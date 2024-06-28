# # -*- coding: utf-8 -*-
# # @author: xiaobai

# from db.session import async_engine
# from models.base import Base
# from models import ui_models


# async def init_db():
#     """
#     初始化数据库
#     :return:
#     """
#     async with async_engine.begin() as conn:
#         await conn.run_sync(Base.metadata.create_all)
