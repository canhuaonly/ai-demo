# -*- coding: utf-8 -*-
# @author: xiaobai


from fastapi import APIRouter

from app.api.routes import interface
from app.api.routes import dialogue_ctx
from app.api.routes import cosmos_learn_v1

app_router = APIRouter()

# api
app_router.include_router(interface.router, prefix="/interface", tags=["interface"])
app_router.include_router(
    dialogue_ctx.router, prefix="/dialogue_ctx", tags=["dialogue_ctx"]
)
app_router.include_router(
    cosmos_learn_v1.router, prefix="/cosmos_learn_v1", tags=["cosmos_learn_v1"]
)
