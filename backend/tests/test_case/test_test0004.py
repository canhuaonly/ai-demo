"""Test0004 Test"""

import json
from unittest import mock
from fastapi.testclient import TestClient
import pytest
from pytest_mock import MockFixture
from app.core import config
from app.api.cosmos_api.test0004 import test0004_service
from azure.cosmos.container import ContainerProxy


# 正确返回值：
# [
#     {
#         "id": "loginxxx",
#         "userId": "login",
#         "userCd": "wangtao",
#         "userNm": "Wang",
#         "partitionKey": "user1",
#         "delFlg": "0"
#     }
# ]
cosmos_get_user_params = {
    "正常数据的场合": (
        {"data": "wangtao", "user": "", "chatId": ""},
        [{"id": "loginxxx", "userId": "login", "userCd": "wangtao", "userNm": "Wang"}],
        200
    ),
    "错误数据的场合": (
        {"data": "xxxxx", "user": "yyyyy", "chatId": "zzzzz"},
        [{"id": "", "userId": "", "userCd": "", "userNm": ""}],
        200
    ),
    "空值数据的场合": ({"data": "", "user": "", "chatId": ""}, {"detail": "参数错误1"}, 400),
    "错误实体的场合": ({"aaa": "xxxxx", "bbb": "yyyyy", "ccc": "zzzzz"}, {"detail": "参数错误1"}, 400),
    "空实体类的场合": ({}, {"detail": "参数错误1"}, 400),
}
@pytest.mark.parametrize("param, resp, http_status_code",
                         list(cosmos_get_user_params.values()),
                         ids=list(cosmos_get_user_params.keys()))
def test_cosmos_get_user(app, param, resp, http_status_code):
    """获取当前登录用户信息"""
    print("获取当前登录用户信息")

    # 模拟一个函数的返回值
    test0004_service.select_login_user_list = mock.Mock(return_value = resp)

    # 发起请求
    client = TestClient(app)
    mock_resp = client.post(
        config.settings.API_STR + "/cosmos_api/test0004/get_user",
        json = param,
    )

    print("xxxxxxxxxxxxxxxxxxxxx")
    print(mock_resp)
    assert mock_resp.status_code == http_status_code
    json_resp = mock_resp.json()
    print(json_resp)

    if mock_resp.status_code == 200:
        # 正常数据的情况下，判断响应数据是否符合预期

        # if len(json_resp) > 0 and len(json_resp[0]) > 0:
        # 函数是否被调用
        test0004_service.select_login_user_list.assert_called()
        # 检查函数参数
        test0004_service.select_login_user_list.assert_called_with(param['data'])
        # 返回值是否符合预期
        assert json_resp[0]["id"] == resp[0]["id"]
    else:
        # 错误数据的情况下，检查错误信息

        # 函数没有被调用
        test0004_service.select_login_user_list.assert_not_called()
        # if len(json_resp) > 0:
        #     if len(json_resp["detail"]) > 0:
        assert json_resp["detail"] == resp["detail"]
    print("zzzzzzzzzzzzzzzzzzzzz")


# 正确返回值：
# [
#     {
#         "id": "user01_1",
#         "userId": "user1",
#         "userCd": "wangtao",
#         "userNm": "文心一言",
#         "delFlg": "0",
#         "_rid": "AZN-ANDLSSYBAAAAAAAAAA==",
#         "_self": "dbs/AZN-AA==/colls/AZN-ANDLSSY=/docs/AZN-ANDLSSYBAAAAAAAAAA==/",
#         "_etag": "\"00000000-0000-0000-025b-1c08e5de01db\"",
#         "_attachments": "attachments/",
#         "_ts": 1725846827
#     },
#     {
#         "id": "user01_5",
#         "userId": "user1",
#         "userCd": "user01",
#         "userNm": "Assistant",
#         "delFlg": "0",
#         "_rid": "AZN-ANDLSSYFAAAAAAAAAA==",
#         "_self": "dbs/AZN-AA==/colls/AZN-ANDLSSY=/docs/AZN-ANDLSSYFAAAAAAAAAA==/",
#         "_etag": "\"00000000-0000-0000-001d-dda5551f01db\"",
#         "_attachments": "attachments/",
#         "_ts": 1725600621
#     }
# ]

cosmos_get_recent_contacts_params = {
    "正常数据的场合": (
        {"data": "", "user": "user1", "chatId": ""},
        [
            {"id": "user01_1", "userId": "user1", "userCd": "wangtao", "userNm": "文心一言"},
            {"id": "user01_5", "userId": "user1", "userCd": "user01", "userNm": "Assistant"}
        ],
        200
    ),
    "错误数据的场合": ({"data": "xxxxx", "user": "yyyyy", "chatId": "zzzzz"}, [], 200),
    "空值数据的场合": ({"data": "", "user": "", "chatId": ""}, {"detail": "参数错误3"}, 400),
    "错误实体的场合": ({"aaa": "xxxxx", "bbb": "yyyyy", "ccc": "zzzzz"},{"detail": "参数错误3"}, 400),
    "空实体类的场合": ({}, {"detail": "参数错误3"}, 400),
}
@pytest.mark.parametrize("param, resp, http_status_code",
                         list(cosmos_get_recent_contacts_params.values()),
                         ids=list(cosmos_get_recent_contacts_params.keys()))
def test_cosmos_get_recent_contacts(app, param, resp, http_status_code):
    """获取最近联系人及最近消息"""
    print("获取最近联系人及最近消息")

    # 模拟一个函数的返回值
    test0004_service.select_recent_contacts_users_list = mock.Mock(return_value = resp)

    # 模拟一个函数的返回值
    message_resp = [
        {"user": "user1", "message_q": "aaa", "message_a": "bbb"},
        {"user": "user1", "message_q": "ccc", "message_a": "ddd"}
    ]
    test0004_service.select_recent_contacts_messages_list = mock.Mock(return_value = message_resp)

    # 发起请求
    client = TestClient(app)
    mock_resp = client.post(
        config.settings.API_STR + "/cosmos_api/test0004/get_recent_contacts",
        json = param,
    )

    assert mock_resp.status_code == http_status_code
    json_resp = mock_resp.json()

    if mock_resp.status_code == 200:
        # 正常数据的情况下，判断响应数据是否符合预期

        if len(json_resp) > 0 and len(json_resp[0]) > 0:
            # 函数是否被调用
            test0004_service.select_recent_contacts_users_list.assert_called()
            # 检查函数参数
            test0004_service.select_recent_contacts_users_list.assert_called_with(param['user'])

            # 返回值是否符合预期
            assert json_resp[0]["userId"] == resp[0]["userId"]
            assert json_resp[0]["lastMsg"] == message_resp[0]["message_a"]

    else:
        # 错误数据的情况下，检查错误信息

        # 函数没有被调用
        test0004_service.select_recent_contacts_users_list.assert_not_called()
        if len(json_resp) > 0:
            if len(json_resp["detail"]) > 0:
                assert json_resp["detail"] == resp["detail"]

# 正确返回值：
# [
#     {
#         "id": "message_user01_1_1",
#         "chatId": "user01_1",
#         "message_q": "你好，你叫什么名字？",
#         "message_a": "你好，我是一个没有固定名称的文本生成模型，你可以称呼我为文心一言或者百度。
#                   我存在的目的是通过机器学习和自然语言处理技术来回答用户的问题和提供相关信息。",
#         "_rid": "AZN-AOSQ+HEBAAAAAAAAAA==",
#         "_self": "dbs/AZN-AA==/colls/AZN-AOSQ+HE=/docs/AZN-AOSQ+HEBAAAAAAAAAA==/",
#         "_etag": "\"00000000-0000-0000-ff6c-553e549501da\"",
#         "_attachments": "attachments/",
#         "_ts": 1725524371
#     }
# ]
recent_contacts_messages_list_params = {
    "正常数据的场合": (
        {"chatId": "user01_1"},
        [
            {"id": "message_user01_1_1", "chatId": "user01_1", "message_q": "a", "message_a": "b"},
            {"id": "message_user01_1_1", "chatId": "user01_1", "message_q": "c", "message_a": "d"},
        ],
        200
    ),
    "错误数据的场合": ({"chatId": "ccc"}, [], 200),
    "空值数据的场合": ({"chatId": ""}, {"detail": "参数错误4"}, 400),
    "错误实体的场合": ({"aaa": "xxxxx"},{"detail": "参数错误4"}, 400),
    "空实体类的场合": ({}, {"detail": "参数错误4"}, 400),
}
@pytest.mark.parametrize("param, resp, http_status_code",
                         list(recent_contacts_messages_list_params.values()),
                         ids=list(recent_contacts_messages_list_params.keys()))
def test_select_recent_contacts_messages_list(app, mocker: MockFixture, param, resp, http_status_code):
    """获取最近聊天内容"""
    print("获取最近聊天内容")

    # 模拟一个函数的返回值
    # test0004_service.select_current_user_messages_list = mock.Mock(return_value = resp)
    mock_api = mocker.patch("app.api.cosmos_api.test0004.test0004_service.select_current_user_messages_list", return_value = resp)

    # 发起请求
    client = TestClient(app)
    mock_resp = client.post(
        config.settings.API_STR + "/cosmos_api/test0004/get_message",
        json = param,
    )

    print("xxxxxxxxxxxxxxxxxxxxx")
    print(mock_resp)
    assert mock_resp.status_code == http_status_code
    json_resp = mock_resp.json()
    print(json_resp)

    if mock_resp.status_code == 200:
        # 正常数据的情况下，判断响应数据是否符合预期

        if len(json_resp) > 0 and len(json_resp[0]) > 0:
            # 函数是否被调用
            mock_api.assert_called()
            # 检查函数参数
            mock_api.assert_called_with(param['chatId'])
            # 返回值是否符合预期
            assert json_resp[0]["message_q"] == resp[0]["message_q"]
            assert json_resp[0]["message_a"] == resp[0]["message_a"]
    else:
        # 错误数据的情况下，检查错误信息

        # 函数没有被调用
        mock_api.assert_not_called()
        if len(json_resp) > 0:
            if len(json_resp["detail"]) > 0:
                assert json_resp["detail"] == resp["detail"]

    print("zzzzzzzzzzzzzzzzzzzzz")


# 正确返回值：
# {
#     "id": "loginxxx",
#     "userId": "login",
#     "userCd": "wangtao",
#     "userNm": "Wang",
#     "partitionKey": "user1",
#     "delFlg": "0"
# }
# update_contact_nm_params = {
#     "正常数据的场合": ({"chatId": "user01_1", "user": "user1", "data": "new_name"}, "aaa", "bbb", 200),
#     # "错误数据的场合": ({"chatId": "xxx", "user": "yyy", "data": "zzz"}, "", "", 400),
#     "空值数据的场合": ({"chatId": ""}, "", "", 400),
#     "错误实体的场合": ({"aaa": "xxxxx"}, "", "", 400),
#     "空实体类的场合": ({}, "", "", 400),
# }
# @pytest.mark.parametrize("param, old_name, new_name, http_status_code",
#                          list(update_contact_nm_params.values()),
#                          ids=list(update_contact_nm_params.keys()))
# def test_update_contact_nm(app, param, old_name, new_name, http_status_code):
#     """更新会话名称"""
#     print("更新会话名称")

    # 模拟一个函数的返回值
    # old_resp = {
    #     "id": "temp_id",
    #     "userId": "temp_userId",
    #     "userCd": "temp_userCd",
    #     "userNm": old_name,
    #     "delFlg": "0",
    # }
    # test0004_service.select_user_single = mock.Mock(return_value = old_resp)

    # new_resp = {
    #     "id": "temp_id",
    #     "userId": "temp_userId",
    #     "userCd": "temp_userCd",
    #     "userNm": new_name,
    #     "delFlg": "0",
    # }
    # test0004_service.replace_user_item = mock.Mock(return_value = new_resp)

    # # 发起请求
    # client = TestClient(app)
    # mock_resp = client.post(
    #     config.settings.API_STR + "/cosmos_api/test0004/update_contact_nm",
    #     json = param,
    # )

    # print("xxxxxxxxx123xxxxxxxxxxxx")
    # # print(f"param参数{param}---")
    # print(mock_resp)
    # assert mock_resp.status_code == http_status_code
    # json_resp = mock_resp.json()
    # print(json_resp)
    # print("cccccccccc321cccccccccc")

    # if mock_resp.status_code == 200:
    #     # 正常数据的情况下，判断响应数据是否符合预期

    #     if len(json_resp) > 0 and json_resp['status'] == "666":
    #         # 函数是否被调用
    #         test0004_service.select_user_single.assert_called()
    #         test0004_service.replace_user_item.assert_called()
    #         # 检查函数参数
    #         test0004_service.select_user_single.assert_called_with(param['chatId'])
    #         test0004_service.replace_user_item.assert_called_with(old_resp)
    #         # 返回值是否符合预期
    #         assert json_resp['entity']["userNm"] == new_name
    # else:
    #     # 错误数据的情况下，检查错误信息

    #     # 函数没有被调用
    #     # test0004_service.select_user_single.assert_not_called()
    #     test0004_service.replace_user_item.assert_not_called()
    #     if len(json_resp) > 0:
    #         if len(json_resp["detail"]) > 0:
    #             assert str(json_resp["detail"]).find("参数") > -1 \
    #                 or str(json_resp["detail"]).find("数据") > -1
    # print("zzzzzzzzzzzzzzzzzzzzz")


################################## 👇👇👇 TEMP 👇👇👇 ####################################

temp_params = {
    "正常数据的场合": (
        {"data": "wangtao", "user": "", "chatId": ""},
        [{"id": "loginxxx", "userId": "login", "userCd": "wangtao", "userNm": "Wang"}],
        200
    ),
    "错误数据的场合": (
        {"data": "xxxxx", "user": "yyyyy", "chatId": "zzzzz"},
        [{"id": "", "userId": "", "userCd": "", "userNm": ""}],
        200
    ),
    "空值数据的场合": ({"data": "", "user": "", "chatId": ""}, {"detail": "参数错误"}, 400),
    "错误实体的场合": ({"aaa": "xxxxx", "bbb": "yyyyy", "ccc": "zzzzz"}, {"detail": "参数错误"}, 400),
    "空实体类的场合": ({}, {"detail": "参数错误"}, 400),
}
@pytest.mark.parametrize("param, resp, http_status_code",
                         list(temp_params.values()),
                         ids=list(temp_params.keys()))
def test_temp_func(app, param, resp, http_status_code):
    """获取当前登录用户信息"""
    print("获取当前登录用户信息")

    # 模拟一个函数的返回值
    ContainerProxy.query_items = mock.Mock(return_value = resp)

    # 发起请求
    client = TestClient(app)
    mock_resp = client.post(
        config.settings.API_STR + "/cosmos_api/test0004/get_user1",
        json = param,
    )

    print("xxxxxxxxxxxxxxxxxxxxx")
    print(mock_resp)
    assert mock_resp.status_code == http_status_code
    json_resp = mock_resp.json()
    print(param)
    print("daowdanwdawdnl16awDA1W16AWD5A6WD46A1")
    print(f"param rtn_value:{resp}")
    print(f"mock rtn_value:{json_resp}")

    if mock_resp.status_code == 200:
        # 正常数据的情况下，判断响应数据是否符合预期

        if len(json_resp) > 0 and len(json_resp[0]) > 0:
            # print("vvvvvvvvvvvvvvvvvvv")
            # 函数是否被调用
            # ContainerProxy.query_items.assert_called()
            # ContainerProxy.query_items.assert_called()
            # 检查函数参数
            # ContainerProxy.query_items.assert_called_with(param['data'])
            # 返回值是否符合预期
            assert json_resp[0]["id"] == resp[0]["id"]
            # print("wwwwwwwwwwwwwwwwwww")
    else:
        # 错误数据的情况下，检查错误信息

        # 函数没有被调用
        # container.query_items.assert_not_called()
        # if len(json_resp) > 0:
        #     if len(json_resp["detail"]) > 0:
        #         assert json_resp["detail"] == resp["detail"]
        pass
    # print("zzzzzzzzzzzzzzzzzzzzz")

# 正确返回值：
# {
#     "id": "loginxxx",
#     "userId": "login",
#     "userCd": "wangtao",
#     "userNm": "Wang",
#     "partitionKey": "user1",
#     "delFlg": "0"
# }
update_contact_nm_params2 = {
    "更新数据的场合": ({"chatId": "user01_3", "user": "user1", "data": "new_name"}, True),
    "插入数据的场合": ({"chatId": "user01_3", "user": "user1", "data": "new_name"}, False),
    "空值的场合": ({"chatId": "", "user": "", "data": ""}, True),
    "空实体类的场合": ({}, True),
}
@pytest.mark.parametrize("param, upsert_model",
                         list(update_contact_nm_params2.values()),
                         ids=list(update_contact_nm_params2.keys()))
# @mock.patch('ContainerProxy')
def test_update_contact_nm1(app, param, upsert_model):
    """更新会话名称"""
    print("更新会话名称")

    if "data" not in param or param['data'] == "":
        new_name = ""
    else:
        new_name = param["data"]

    with mock.patch('app.cosmos.db.get_container_client') as mock_xxx:
        mock_container = mock.MagicMock()
        mock_xxx.return_value = mock_container

        # TODO
        # mock_container.query_items.side_effect = create_mock_result

        # 检索既存数据
        if upsert_model:
            mock_container.query_items.return_value = [
                {"id": "111", "userId": "222", "userCd": "333", "userNm": "old_name", "delFlg": "0"}
            ]
        else:
            mock_container.query_items.return_value = []

        # 不存在的场合
        mock_container.create_item.return_value = [
            {"id": "222", "userId": "333", "userCd": "444", "userNm": new_name, "delFlg": "0"},
        ]

        # 存在的场合
        mock_container.replace_item.return_value = [
            {"id": "111", "userId": "222", "userCd": "333", "userNm": new_name, "delFlg": "0"},
        ]

        # 调用API
        client = TestClient(app)
        mock_resp = client.post(
            config.settings.API_STR + "/cosmos_api/test0004/update_contact_nm",
            json = param,
        )

    print(mock_resp)
    json_resp = mock_resp.json()
    if mock_resp.status_code == 200:
        if len(json_resp) > 0 :
            mock_container.query_items.assert_called()
            mock_container.query_items.assert_called_once_with(
                query="SELECT * FROM users u WHERE u.userId = 'user1' AND u.id = @id",
                parameters=[{'name': '@id', 'value': param['chatId']}],
                enable_cross_partition_query=True
            )

            if json_resp['status'] == "666":
                print(f"插入成功{json_resp}")
                mock_container.create_item.assert_called()
                # 主键改为自动生成,无法判断参数是否正确
                # mock_container.create_item.assert_called_once_with(body={
                #     'id': '5d6bde7d-d0a9-4a62-8d63-c23d39beb69d',
                #     'userId': 'user1',
                #     'chatId': 'user1',
                #     'userCd': 'user1',
                #     'userNm': 'new_name',
                #     'delFlg': '0'
                # })
            elif json_resp['status'] == "777":
                print(f"更新成功{json_resp}")
                mock_container.replace_item.assert_called()
                mock_container.replace_item.assert_called_once_with(
                    item=mock_container.replace_item.return_value[0],
                    body=mock_container.replace_item.return_value[0],
                )
            else:
                assert False
        else:
            assert False
    else:
        assert str(json_resp["detail"]).find("参数") > -1

    # assert mock_resp.status_code == 800

    # if len(json_resp) > 0 and json_resp['status'] == "666":
    #         # 函数是否被调用
    #         test0004_service.select_user_single.assert_called()
    #         test0004_service.replace_user_item.assert_called()
    #         # 检查函数参数
    #         test0004_service.select_user_single.assert_called_with(param['chatId'])
    #         test0004_service.replace_user_item.assert_called_with(old_resp)
    #         # 返回值是否符合预期
    #         assert json_resp['entity']["userNm"] == new_name


    # mock_xxx.assert_called_with('users')
    # assert current_user == {"a": "b", "userNm": "userNm"}





    # mock_obj = mocker.patch('azure.cosmos.container.ContainerProxy.query_items')
    # mock_obj.return_value = [
    #   {"xxx": "111", "userNm": "userNm"}, {"yyy": "222", "userNm": "userNm"}
    # ]

    # current_user = test0004_service.select_user_single(param['chatId'])
    # print(current_user)
    # mock_obj.assert_called()
    # mock_obj.assert_called_with(
    #     query="SELECT * FROM users u WHERE u.userId = 'user1' AND u.id = @id",
    #     parameters=[{'name': '@id', 'value': '8d8e5ab7-f5ac-4d9a-a0d2-8d3caedf1d88'}],
    #     enable_cross_partition_query=True
    # )
    # assert current_user == {"a": "b", "userNm": "userNm"}

    # client = TestClient(app)
    # mock_resp = client.post(
    #     config.settings.API_STR + "/cosmos_api/test0004/update_contact_nm",
    #     json = param,
    # )

    # print("xxxxawdawdaaxxxxxxxxx")
    # # print(f"param参数{param}---")
    # print(mock_resp)
    # assert mock_resp.status_code == http_status_code
    # json_resp = mock_resp.json()
    # print(json_resp)
    # print("cccccccccc321cccccccccc")


    # old_resp = {
    #     'query_items': 'xxx',
    #     'create_item': 'xxx',
    # }

    # resp = {
    #     'update_items': 'yyy',
    #     'create_item': 'xxx',
    # }
    # db.get_container_client = mock.Mock(return_value = old_resp)
    # ContainerProxy.query_items = mock.Mock(return_value = resp)



    # # 模拟一个函数的返回值
    # old_resp = {
    #     "id": "temp_id",
    #     "userId": "temp_userId",
    #     "userCd": "temp_userCd",
    #     "userNm": old_name,
    #     "delFlg": "0",
    # }
    # test0004_service.select_user_single = mock.Mock(return_value = old_resp)

    # new_resp = {
    #     "id": "temp_id",
    #     "userId": "temp_userId",
    #     "userCd": "temp_userCd",
    #     "userNm": new_name,
    #     "delFlg": "0",
    # }
    # test0004_service.replace_user_item = mock.Mock(return_value = new_resp)

    # 发起请求
    # client = TestClient(app)
    # mock_resp = client.post(
    #     config.settings.API_STR + "/cosmos_api/test0004/update_contact_nm",
    #     json = param,
    # )

    # print("xxxxawdawdaaxxxxxxxxx")
    # # print(f"param参数{param}---")
    # print(mock_resp)
    # assert mock_resp.status_code == http_status_code
    # json_resp = mock_resp.json()
    # print(json_resp)
    # print("cccccccccc321cccccccccc")

    # if mock_resp.status_code == 200:
    #     # 正常数据的情况下，判断响应数据是否符合预期

    #     if len(json_resp) > 0 and json_resp['status'] == "666":
    #         # 函数是否被调用
    #         test0004_service.select_user_single.assert_called()
    #         test0004_service.replace_user_item.assert_called()
    #         # 检查函数参数
    #         test0004_service.select_user_single.assert_called_with(param['chatId'])
    #         test0004_service.replace_user_item.assert_called_with(old_resp)
    #         # 返回值是否符合预期
    #         assert json_resp['entity']["userNm"] == new_name
    # else:
    #     # 错误数据的情况下，检查错误信息

    #     # 函数没有被调用
    #     # test0004_service.select_user_single.assert_not_called()
    #     test0004_service.replace_user_item.assert_not_called()
    #     if len(json_resp) > 0:
    #         if len(json_resp["detail"]) > 0:
    #             assert str(json_resp["detail"]).find("参数") > -1 \
    #                 or str(json_resp["detail"]).find("数据") > -1
    # print("zzzzzzzzzzzzzzzzzzzzz")


send_message_params = {
    "更新数据的场合": ({"chatId": "xxx", "user": "user1", "data": "message_q3"}),
    # "插入数据的场合": ({"chatId": "user01_3", "user": "user1", "data": "new_name"}, False),
    # "空值的场合": ({"chatId": "", "user": "", "data": ""}, True),
    # "空实体类的场合": ({}, True),
}
@pytest.mark.parametrize("param",
                         list(send_message_params.values()),
                         ids=list(send_message_params.keys()))
def test_send_message(app, mocker: MockFixture, param):
    """发送消息，获取回答"""
    print("测试发送消息，获取回答")

    mock_wenxin_api = mocker.patch("app.api.cosmos_api.wenxin_api.main", return_value = """{
            "id":"as-znn1amcv8g",
            "object":"chat.completion",
            "created":1726207551,
            "result":"message_a3",
            "is_truncated":false,
            "need_clear_history":false,
            "usage":{
                "prompt_tokens":13,
                "completion_tokens":54,
                "total_tokens":67
            }
        }""")

    with mock.patch('app.cosmos.db.get_container_client') as mock_xxx:
        mock_container = mock.MagicMock()
        mock_xxx.return_value = mock_container

        # 检索既存数据
        mock_container.query_items.return_value = [
            {"id": "111", "chatId": param['chatId'], "message_q": "message_q1", "message_a": "message_a1"},
            {"id": "222", "chatId": param['chatId'], "message_q": "message_q2", "message_a": "message_a2"},
        ]

        # 不存在的场合
        json_wenxin_return_value = json.loads(mock_wenxin_api.return_value)
        mock_container.create_item.return_value = [
            {
                "id": "333", 
                "chatId": param['chatId'], 
                "message_q": param['data'], 
                "message_a": json_wenxin_return_value['result']
            },
        ]

        # 调用API
        client = TestClient(app)
        mock_resp = client.post(
            config.settings.API_STR + "/cosmos_api/test0004/send_message",
            json = param,
        )

    print(mock_resp)
    json_resp = mock_resp.json()
    if mock_resp.status_code == 200:
        if len(json_resp) > 0 :
            mock_container.query_items.assert_called()
            mock_container.query_items.assert_called_once_with(
                query='SELECT * FROM messages c WHERE c.chatId = @chatId ORDER BY c._ts ASC',
                parameters=[{'name': '@chatId', 'value': param['chatId']}],
                enable_cross_partition_query=True
            )

            if json_resp['status'] == "666":
                print(f"插入成功{json_resp}")
                mock_container.create_item.assert_called()
                # 主键改为自动生成,无法判断参数是否正确
                # mock_container.create_item.assert_called_once_with(body={
                #     'id': '5d6bde7d-d0a9-4a62-8d63-c23d39beb69d',
                #     'userId': 'user1',
                #     'chatId': 'user1',
                #     'userCd': 'user1',
                #     'userNm': 'new_name',
                #     'delFlg': '0'
                # })
            elif json_resp['status'] == "777":
                print(f"更新成功{json_resp}")
                mock_container.replace_item.assert_called()
                mock_container.replace_item.assert_called_once_with(
                    item=mock_container.replace_item.return_value[0],
                    body=mock_container.replace_item.return_value[0],
                )
            else:
                assert False
        else:
            assert False
    else:
        assert str(json_resp["detail"]).find("参数") > -1
