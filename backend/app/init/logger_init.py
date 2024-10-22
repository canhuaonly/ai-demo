# -*- coding: utf-8 -*-
# @author: xiaobai
import logging
from app.core.config import settings
from app.utils.logger import logger


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
    logger.info("初始化日志成功")

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
