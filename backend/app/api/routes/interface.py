import requests
import json

from typing import Any
from fastapi import APIRouter, HTTPException, Body
from app.utils.response.http_response import partner_success
from app.schemas.api.interface import InterfaceQuery, InterfaceIn, InterfaceId
from app.services.api.interface import InterfaceService

router = APIRouter()


# api
API_KEY = "YYjNTODytgdJXfIii3SyyVfK"
# 密钥
SECRET_KEY = "27oMLcwjemAeCcQ6kzhS2neB9MYWUOOS"
# url # 示例URL，可能需要调整
URL = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/yi_34b_chat"


@router.get("/hello", description="欢迎")
async def project_hello():
    data = "hello"
    return data


@router.post("/list", description="项目列表")
async def project_list(params: InterfaceQuery):
    data = await InterfaceService.list(params)
    return data


@router.post("/wenxin_api_test", description="文心一言测试接口")
async def wenxin_api_test(params: InterfaceQuery):
    try:
        access_token = get_access_token()
        response = call_wenxin_yiyan(access_token, params.content)
        return response
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# @router.post("/getAllProject", description="获取所有项目")
# async def get_all_project():
#     data = await InterfaceService.get_all()
#     return partner_success(data)


# @router.post("/saveOrUpdate", description="更新保存项目")
# async def save_or_update(params: InterfaceIn):
#     data = await InterfaceService.save_or_update(params)
#     return partner_success(data)


# @router.post("/deleted", description="删除")
# async def deleted(params: InterfaceId):
#     data = await InterfaceService.deleted(params)
#     return partner_success(data)


# @router.post("/getProjectTree", description="获取项目树结构")
# async def get_project_tree():
#     """
#     项目树结构
#     :return:
#     """
#     data = await InterfaceService.get_project_tree()
#     return partner_success(data)


# 示例：获取access_token的函数（你可能需要根据文心一言API文档调整）
# def get_access_token() -> str:
#     url = "https://aip.baidubce.com/oauth/2.0/token"
#     payload = {
#         "grant_type": "client_credentials",
#         "client_id": API_KEY,
#         "client_secret": SECRET_KEY,
#     }
#     headers = {"Content-Type": "application/json", "Accept": "application/json"}
#     response = requests.request("POST", url, headers=headers, data=json.dumps(payload))
#     result = response.json()
#     if "access_token" in result:
#         return result["access_token"]
#     else:
#         # raise HTTPException(status_code=500, detail="Failed to get access token")
#         raise HTTPException(status_code=500, detail=result)
def get_access_token():
    """
    使用 AK，SK 生成鉴权签名（Access Token）
    :return: access_token，或是None(如果错误)
    """
    url = "https://aip.baidubce.com/oauth/2.0/token"
    params = {
        "grant_type": "client_credentials",
        "client_id": API_KEY,
        "client_secret": SECRET_KEY,
    }
    return str(requests.post(url, params=params).json().get("access_token"))


def call_wenxin_yiyan(access_token: str, content: str) -> Any:
    # 文心一言API的URL（你需要替换成实际的URL和参数）
    url = URL + "?access_token=" + get_access_token()
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
    }
    payload = json.dumps(
        {
            "messages": [
                {"role": "user", "content": content},
            ]
        }
    )
    response = requests.request("POST", url, headers=headers, data=payload)
    return response.json()
