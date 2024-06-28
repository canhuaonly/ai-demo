import click
from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.core.config import settings
from app.init.routers import init_routers
from app.init.middleware import init_middleware
from app.init.cors import init_cors
from app.init.server import init_static_app
from app.init.mount import init_mount
from app.init.exception import init_exception
from app.init.logger_init import init_logger, logger


def create_app():
    app = FastAPI(
        lifespan=lifespan,
        title="TEST API",  # settings.PROJECT_NAME,
        description="TEST API",  # settings.PROJECT_DESC,
        version="TEST API",  # settings.PROJECT_VERSION,
    )
    # 路由初始化
    init_routers(app)
    # 注册中间件
    init_middleware(app)
    # 跨域
    init_cors(app)
    # 服务
    init_static_app(app)
    return app


@asynccontextmanager
async def lifespan(app: FastAPI):
    click.echo(settings.PROJECT_DESC)
    click.echo(settings.PROJECT_BANNER)
    click.echo(settings.PROJECT_VERSION)
    await init_app(app)  # 加载注册中心
    yield


async def init_app(app: FastAPI):
    """注册中心"""
    # init_mount(app)  # 挂载静态文件

    init_exception(app)  # 注册捕获全局异常

    # redis_pool.init_by_config(config=config) # redis连接池

    init_logger()

    logger.info("日志初始化成功！！!")  # 初始化日志
