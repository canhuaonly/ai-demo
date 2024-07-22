import requests
import json

from typing import Any
from fastapi import APIRouter, HTTPException, Body
from app.utils.response.http_response import partner_success
from app.schemas.api.interface import InterfaceQuery, InterfaceIn, InterfaceId
from app.services.api.interface import InterfaceService

import azure.cosmos.exceptions as exceptions


router = APIRouter()


@router.get("/hello", description="欢迎")
async def project_hello():
    data = "hello"
    return data


@router.post("/list", description="项目列表")
async def project_list(params: InterfaceQuery):
    data = await InterfaceService.list(params)
    return data
