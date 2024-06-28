# -*- coding: utf-8 -*-
# @author: xiaobai

from fastapi import FastAPI
from fastapi.routing import APIRoute
from app.api import app_router
from app.core.config import settings


def init_routers(app: FastAPI) -> None:
    print("路由初始化成功")
    app.include_router(app_router, prefix=settings.API_STR)
    # The following operation needs to be at the end of this function
    use_route_names_as_operation_ids(app)


def use_route_names_as_operation_ids(app: FastAPI) -> None:
    """
    Simplify operation IDs so that generated API clients have simpler function
    names.

    Should be called only after all routes have been added.
    """
    route_names = set()
    for route in app.routes:
        if isinstance(route, APIRoute):
            if route.name in route_names:
                raise Exception("Route function names should be unique : " + route.name)
            route.operation_id = route.name
            route_names.add(route.name)
