""" Test0003画面 API"""
import json
from typing import Any, List
import requests

from fastapi import APIRouter, HTTPException
from app.schemas.api.dialogue_ctx import (
    DialogueCtxQuery,
    DialogueCtxIn,
)
from app.services.api.dialogue_ctx import DialogueCtxService
from app.deps.db import DatabaseAsyncSession

# from sqlalchemy.orm import Session

router = APIRouter()

# api
API_KEY = "YYjNTODytgdJXfIii3SyyVfK"
# 密钥
SECRET_KEY = "27oMLcwjemAeCcQ6kzhS2neB9MYWUOOS"
# url # 示例URL，可能需要调整
# URL = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/yi_34b_chat"
URL = (
    "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-speed-128k"
)


@router.post("/get_qa_list", description="获取历史会话")
async def get_qa_list(dialogue_ctx: DialogueCtxQuery, session: DatabaseAsyncSession):
    """ 获取历史会话 """
    try:
        qa_list = await DialogueCtxService.get_context(session, dialogue_ctx.session_id)
        if 1 == 2:
            print(qa_list)
        return qa_list
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/wenxin_api", description="文心一言问答接口")
async def wenxin_api(dialogue_ctx: DialogueCtxQuery, session: DatabaseAsyncSession):
    """ 文心一言问答接口 """
    try:
        # 获取AI认证信息
        access_token = get_access_token()
        # # 获取上下文信息
        # context = await DialogueCtxService.get_context(db, dialogue_ctx.session_id)
        # 提问
        answer = call_wenxin_yiyan(access_token, dialogue_ctx.qa_list)
        # 问题插入
        await DialogueCtxService.ask_question(
            session,
            DialogueCtxIn(
                user_id=1,
                session_id=dialogue_ctx.session_id,
                role="user",
                content=dialogue_ctx.content,
            ),
        )
        # 回答插入
        await DialogueCtxService.ask_question(
            session,
            DialogueCtxIn(
                user_id=1,
                session_id=dialogue_ctx.session_id,
                role="assistant",
                content=answer,
            ),
        )
        return answer
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
    return str(requests.post(url, params=params, timeout=5000).json().get("access_token"))


def call_wenxin_yiyan(access_token: str, qa_list: List[Any]) -> Any:
    """ 文心一言API的URL（你需要替换成实际的URL和参数） """ 
    url = URL + "?access_token=" + get_access_token()
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
    }
    payload = json.dumps({"messages": qa_list})
    response = requests.request("POST", url, headers=headers, data=payload, timeout=5000)
    return response.json()["result"]


# async def main():
#     # 创建一个异步会话
#     async with async_session_factory() as session:
#         # 创建表（如果它还不存在）
#         await session.run_sync(metadata.create_all)

#         # 插入数据（增）
#         insert_stmt = users.insert().values(name='Alice', email='alice@example.com')
#         await session.execute(insert_stmt)
#         await session.commit()

#         # 查询数据（查）
#         result = await session.execute(users.select())
#         users_list = result.fetchall()
#         for user in users_list:
#             print(user)

#         # 更新数据（改）
#         update_stmt = users.update().where(users.c.id == 1).values(name='Bob')
#         await session.execute(update_stmt)
#         await session.commit()

#         # 删除数据（删）
#         delete_stmt = users.delete().where(users.c.id == 1)
#         await session.execute(delete_stmt)
#         await session.commit()
