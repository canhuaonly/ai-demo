import time
import pytest
import allure
from fastapi.testclient import TestClient
from httpx import AsyncClient
from app.core.config import settings

# from main import app


# from api.routes import dialogue_ctx

# from schemas.api.dialogue_ctx import (
#     DialogueCtxQuery,
#     DialogueCtxIn,
#     DialogueCtxSessionId,
# )


# @allure.feature("对话接口")
# class TestDialogueCtx:

#     @allure.story("获取上下文数据")
#     @allure.title("获取上下文数据")
#     @allure.description("获取上下文数据")
#     @allure.step("步骤1")
#     def test_get_qa_list(self, app):
#         client = TestClient(app)
#         resp = client.post(
#             settings.API_STR + "/dialogue_ctx/get_qa_list",
#             json={"session_id": "asfkYOIFYUOIyweorhgqqweroir"},
#         )
#         assert resp.status_code == 200
#         assert len(resp.json()) > 0
