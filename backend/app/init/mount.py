# -*- coding: utf-8 -*-
# @author: xiaobai
import os.path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.core.config import settings


def init_mount(app: FastAPI):
    """挂载静态文件 -- https://fastapi.tiangolo.com/zh/tutorial/static-files/"""
    print("初始化挂载静态文件成功")

    start_dir = os.path.join(settings.PROJECT_ROOT_DIR, settings.STATIC_DIR)
    start_dir = os.path.join(Path(__file__).parent.as_posix(), "static")
    if not os.path.exists(start_dir):
        os.mkdir(start_dir)

    # 第一个参数为url路径参数, 第二参数为静态文件目录的路径, 第三个参数是FastAPI内部使用的名字

    app.mount(
        f"/{settings.STATIC_DIR}",
        StaticFiles(directory=settings.STATIC_DIR),
        name=settings.STATIC_DIR,
    )
