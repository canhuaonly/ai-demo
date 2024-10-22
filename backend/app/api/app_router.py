# -*- coding: utf-8 -*-
# @author: xiaobai


from fastapi import APIRouter

from app.api.routes import interface
from app.api.routes import dialogue_ctx
from app.api.routes import cosmos_learn_v1
from app.api.routes import test0006_api
from app.api.cosmos_api.test0002 import test0002_api
from app.api.cosmos_api.test0004 import test0004_api
from app.api.cosmos_api.test0005 import test0005_api

app_router = APIRouter()

# api
app_router.include_router(interface.router, prefix="/interface", tags=["interface"])
app_router.include_router(
    dialogue_ctx.router, prefix="/dialogue_ctx", tags=["dialogue_ctx"]
)
app_router.include_router(
    cosmos_learn_v1.router, prefix="/cosmos_learn_v1", tags=["cosmos_learn_v1"]
)

app_router.include_router(test0006_api.router, prefix="/test0006", tags=["test0006"])
app_router.include_router(test0002_api.router, prefix="/ai", tags=["ai"])
app_router.include_router(
    test0004_api.router, prefix="/cosmos_api/test0004", tags=["cosmos_api"]
)
app_router.include_router(
    test0005_api.router, prefix="/cosmos_api/test0005", tags=["cosmos_api_test0005"]
)
