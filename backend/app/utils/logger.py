# -*- coding: utf-8 -*-
# @author: gaopb
import os
import sys
from loguru import logger
from app.core.config import settings
from app.utils.local import g
from app.utils.create_dir import create_dir

# 创建日志文件名
from app.utils.common import get_str_uuid


def logger_file(logger_name: str) -> str:
    """创建日志文件名"""
    log_path = create_dir(settings.LOGGER_DIR)

    """ 保留日志文件夹下最大个数(本地调试用) 
    本地调式需要多次重启, 日志轮转片不会生效 """
    file_list = os.listdir(log_path)
    if len(file_list) > 3:
        os.remove(os.path.join(log_path, file_list[0]))

    # 日志输出路径
    return os.path.join(log_path, f"{logger_name}.log")


def correlation_id_filter(record):
    """添加trace_id到日志中"""
    if not g.trace_id:
        g.trace_id = get_str_uuid()
    record["trace_id"] = g.trace_id
    return record


def filter_by_name(name):
    """过滤函数，根据记录中的'name'字段进行过滤"""

    def inner_filter(record):
        return record["extra"].get("name") == name

    return inner_filter


# 详见: https://loguru.readthedocs.io/en/stable/overview.html#features
fmt = "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green>| {thread} | <level>{level: <8}</level> | <yellow> {trace_id} </yellow> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | <level>{message}</level>"
logger.remove()
# 添加日志到文件 ai-demo.log
logger.add(
    logger_file(settings.LOGGER_NAME_AI_DEMO),
    encoding=settings.GLOBAL_ENCODING,
    level=settings.LOGGER_LEVEL,
    rotation=settings.LOGGER_ROTATION,
    retention=settings.LOGGER_RETENTION,
    filter=correlation_id_filter,
    format=fmt,
)
# 添加日志到文件 cosmos.log
logger.add(
    logger_file(settings.LOGGER_NAME_COSMOS),
    encoding=settings.GLOBAL_ENCODING,
    level=settings.LOGGER_LEVEL,
    rotation=settings.LOGGER_ROTATION,
    retention=settings.LOGGER_RETENTION,
    filter=filter_by_name(settings.LOGGER_NAME_COSMOS),
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

# 绑定cosmos
logger_cosmos = logger.bind(name=settings.LOGGER_NAME_COSMOS)
