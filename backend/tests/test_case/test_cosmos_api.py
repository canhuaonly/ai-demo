"""测试 cosmos_api"""
import allure
from fastapi.testclient import TestClient
from app.core.config import settings


@allure.feature("Test 0004")
class TestCosmosApi:
    """
    测试 画面0004 获取用户信息：/cosmos_api/get_user
    """
    @allure.story("用户信息取得") # 二级标签（每个接口的标签）
    @allure.title("测试 获取当前用户数据") # 标题，每个用例带个标题（报告体现在每个测试用例）(一个接口有几个用例，title用例的标签)
    @allure.description("获取用户数据")
    @allure.step("步骤1")
    def test_get_user(self, app):
        """
        测试 获取用户数据
        """
        client = TestClient(app)
        resp = client.post(
            settings.API_STR + "/cosmos_api/get_user",
            json={'data': 'wangtao', 'user': '', 'chatId': ''},
        )
        assert resp.status_code == 200
        assert len(resp.json()) > 0
        print("Success!")
