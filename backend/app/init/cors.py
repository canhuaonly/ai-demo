# -*- coding: utf-8 -*-
# @author: gaopengbo
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware


from app.core.config import settings

origins = [
    "http://localhost:8000/api",
    "http://localhost:8080/api",
    "http://localhost:8080",
]


def init_cors(app: FastAPI):
    """跨域请求 -- https://fastapi.tiangolo.com/zh/tutorial/cors/"""
    print("跨域初始化成功")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
