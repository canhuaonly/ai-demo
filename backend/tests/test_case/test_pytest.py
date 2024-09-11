"""练习"""
import pytest
import allure
from fastapi.testclient import TestClient
from app.core import config

@pytest.fixture()
def api_login():
    """打开浏览器"""
    print("打开浏览器")
    return "xxxxx"

@pytest.fixture()
def api_logout():
    """关闭浏览器"""
    print("关闭浏览器")
    return "yyyyy"

class TestLogin:
    """打开浏览器"""
    #传入lonin fixture
    def test_001(self, api_login):
        """传入了 login"""
        print("001传入了loging fixture")
        print('login:' + api_login)
        assert api_login == "xxxxx"

    #传入logout fixture
    def test_002(self, api_logout):
        """传入了 logout"""
        print("002传入了logout fixture")
        print('logout:' + api_logout)

    def test_003(self, api_login, api_logout):
        """传入了 login logout"""
        print("003传入了两个fixture")
        print('login:' + api_login + '---logout:' + api_logout)

    def test_004(self):
        """没传"""
        print("004未传入仍何fixture哦")

# 单个参数的情况
@pytest.mark.parametrize("a", ("1", "2", "3", "4"))
def test_add(a):
    """测试"""
    print("\na的值" + a)
    assert a != "5"

@allure.feature("Temp")
class TestCosmosApiTemp:
    """
    测试 画面0004 获取用户信息：/cosmos_api/get_user
    """
    @allure.story("用户信息取得") # 二级标签（每个接口的标签）
    @allure.title("测试 获取当前用户数据") # 标题，每个用例带个标题（报告体现在每个测试用例）(一个接口有几个用例，title用例的标签)
    @allure.description("获取用户数据")
    # @allure.step("步骤1")
    def test_get_user(self, app):
        """测试 获取用户数据1"""
        client = TestClient(app)
        resp = client.post(
            config.settings.API_STR + "/cosmos_api/test0004/get_user",
            json={'data': 'wangtao', 'user': '', 'chatId': ''},
        )
        # pdb.set_trace()
        print("Success!")
        print(resp)
        json_resp = resp.json()
        print(f'-----------{json_resp}')
        assert resp.status_code == 200
        assert len(resp.json()) > 0
