""" test_example.py """
from unittest import mock
from unittest.mock import MagicMock
from fastapi.testclient import TestClient
import pytest
from app.core import config
from app.api.cosmos_api.test0004 import test0004_api
from app.api.cosmos_api.test0004 import test0004_service


def test_function1(mocker):
    """test"""

    assert test0004_api.temp_func1() == '77'

    # 模拟一个函数的返回值
    mocker.patch('app.api.cosmos_api.test0004.test0004_api.temp_func1', return_value='42')
    assert test0004_api.temp_func1() == '42'
    # result1 = test0004_api.temp_func1()
    # assert result1 == '77'


def test_function2(mocker):
    """test"""

    assert test0004_api.temp_func1() == '77'

    # 模拟一个函数的返回值
    mocker.patch('app.api.cosmos_api.test0004.test0004_api.temp_func1', return_value='44')
    assert test0004_api.temp_func1() == '44'


def test_function3(app):
    """test"""

    mock_res = [
        {
            "id": "loginxxx",
            "userId": "login",
            "userCd": "wangtao",
            "userNm": "Wang",
            "partitionKey": "user1",
            "delFlg": "0"
        }
    ]

    param = {'data': 'wangtao', 'user': '', 'chatId': ''}

    # 模拟一个函数的返回值
    test0004_service.select_login_user_list = mock.Mock(return_value = mock_res)

    # rtn_res = test0004_api.cosmos_get_user(param)

    # assert rtn_res[0]['id'] == 'loginxxx'

    client = TestClient(app)
    resp = client.post(
        config.settings.API_STR + "/cosmos_api/test0004/get_user",
        json = param,
    )

    print(resp)
    print("xxxxxxxxxxxxxxxxxxxxx")
    assert resp.status_code == 200
    json_resp = resp.json()
    print(json_resp)
    assert json_resp[0]['id'] == 'loginxxx'
    print("zzzzzzzzzzzzzzzzzzzzz")


    # # 使用 mocker.patch() 创建一个名为 'test0004_api.temp_func2' 的 MagicMock 实例
    # # 并将该实例链接到 'app.api.cosmos_api.test0004.test0004_api.temp_func2' 变量上
    # temp_func2 = mocker.patch('app.api.cosmos_api.test0004.test0004_api.temp_func2', return_value='99')
    # res = test0004_api.temp_func2(1, 2)
    # temp_func2.assert_called_with(1, 2)
    # assert temp_func2.return_value == '99'
    # # assert res.return_value == '77'

    # mocker.stop()
    # result = test0004_api.temp_func1()
    # assert result == '77'


    # assert temp_func2.return_value == '99'