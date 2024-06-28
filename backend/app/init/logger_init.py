# -*- coding: utf-8 -*-
# @author: xiaobai
import os
import sys
import logging
from loguru import logger

from app.core.config import settings
from app.utils.local import g
from app.utils.create_dir import create_dir

# 创建日志文件名
from app.utils.common import get_str_uuid


def logger_file() -> str:
    """创建日志文件名"""
    log_path = create_dir(settings.LOGGER_DIR)

    """ 保留日志文件夹下最大个数(本地调试用) 
    本地调式需要多次重启, 日志轮转片不会生效 """
    file_list = os.listdir(log_path)
    if len(file_list) > 3:
        os.remove(os.path.join(log_path, file_list[0]))

    # 日志输出路径
    return os.path.join(log_path, settings.LOGGER_NAME)


def correlation_id_filter(record):
    if not g.trace_id:
        g.trace_id = get_str_uuid()
    record["trace_id"] = g.trace_id
    return record


# 详见: https://loguru.readthedocs.io/en/stable/overview.html#features
fmt = "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green>| {thread} | <level>{level: <8}</level> | <yellow> {trace_id} </yellow> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | <level>{message}</level>"
logger.remove()
logger.add(
    logger_file(),
    encoding=settings.GLOBAL_ENCODING,
    level=settings.LOGGER_LEVEL,
    rotation=settings.LOGGER_ROTATION,
    retention=settings.LOGGER_RETENTION,
    filter=correlation_id_filter,
    format=fmt,
)

# 添加日志到标准输出
logger.add(
    sys.stdout,
    colorize=True,
    level=settings.LOGGER_LEVEL,
    format=fmt,
    enqueue=True,
)


class InterceptHandler(logging.Handler):
    def emit(self, record):
        # Get corresponding Loguru level if it exists
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        logger_opt = logger.opt(depth=6, exception=record.exc_info)
        logger_opt.log(level, record.getMessage())


def init_logger():
    print("初始化日志成功")

    logger_name_list = [name for name in logging.root.manager.loggerDict]

    for logger_name in logger_name_list:
        """获取所有logger"""
        effective_level = logging.getLogger(logger_name).getEffectiveLevel()
        if effective_level < logging.getLevelName(settings.LOGGER_LEVEL.upper()):
            logging.getLogger(logger_name).setLevel(settings.LOGGER_LEVEL.upper())

        if effective_level < logging.getLevelName("DEBUG"):
            logging.getLogger(logger_name).setLevel("DEBUG")
        if "." not in logger_name:
            logging.getLogger(logger_name).handlers = []
            logging.getLogger(logger_name).addHandler(InterceptHandler())
