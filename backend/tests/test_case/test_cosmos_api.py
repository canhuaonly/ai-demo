# """测试 cosmos_api"""
# # import pdb
# from unittest import mock
# import allure
# from fastapi.testclient import TestClient
# import pytest
# from app.core import config
# from app.api.cosmos_api.test0004 import test0004_api
# from app.api.cosmos_api.test0004 import test0004_service
# from app.api.cosmos_api.test0004 import test0004_entity


# # @allure.feature("Test 0004 01")
# # class TestCosmosApiTemp:
# #     """
# #     测试 画面0004 获取用户信息：/cosmos_api/test0004/get_user
# #     """
# #     @allure.story("用户信息取得") # 二级标签（每个接口的标签）
# #     @allure.title("测试 获取当前用户数据") # 标题，每个用例带个标题（报告体现在每个测试用例）(一个接口有几个用例，title用例的标签)
# #     @allure.description("获取用户数据")
# #     @allure.step("步骤1")
# #     def test_get_user(self, app):
# #         """
# #         测试 获取用户数据1
# #         """
# #         client = TestClient(app)
# #         resp = client.post(
# #             settings.API_STR + "/cosmos_api/test0004/get_user",
# #             json={'data': 'wangtao', 'user': '', 'chatId': ''},
# #         )
# #         # pdb.set_trace()
# #         print("Success!")
# #         print(resp)
# #         assert resp.status_code == 200
# #         assert len(resp.json()) > 0

# @allure.feature("测试 画面0004")
# @pytest.mark.parametrize('pattern, param, http_status_code, con_id', [
#     ('正常数据的场合', {'data': 'wangtao', 'user': '', 'chatId': ''}, 200, 'login'),
#     ('错误数据的场合', {'data': 'xxxxx', 'user': 'yyyyy', 'chatId': 'zzzzz'}, 200, ''),
#     ('空值数据的场合', {'data': '', 'user': '', 'chatId': ''}, 200, ''),
#     ('错误实体的场合', {'aaa': 'xxxxx', 'bbb': 'yyyyy', 'ccc': 'zzzzz'}, 422, ''),
#     ('空实体的场合', {}, 422, ''),
# ])
# @allure.title("获取当前登录用户数据:{pattern}")
# @allure.description("根据传递的参数获取当前登录用户数据")
# def test_get_user(app, pattern, param, http_status_code, con_id):
#     """获取当前登录用户数据"""
#     print(pattern)
#     client = TestClient(app)
#     resp = client.post(
#         config.settings.API_STR + "/cosmos_api/test0004/get_user",
#         json = param,
#     )

#     assert resp.status_code == http_status_code
#     if resp.status_code == 200:
#         json_resp = resp.json()
#         if len(json_resp) > 0:
#             assert json_resp[0]['id'] == con_id

# @allure.feature("测试 画面0004")
# @pytest.mark.parametrize('pattern, param', [
#     ('正常数据的场合', {'data': 'wangtao', 'user': '', 'chatId': ''}),
#     ('错误数据的场合', {'data': 'xxxxx', 'user': 'yyyyy', 'chatId': 'zzzzz'}),
#     ('空值数据的场合', {'data': '', 'user': '', 'chatId': ''}),
# ])
# @allure.title("获取当前登录用户数据:{pattern}")
# @allure.description("根据传递的参数获取当前登录用户数据")
# def test_get_user_02(mocker, pattern, param):
#     """获取当前登录用户数据"""
#     print(pattern)

#     temp_res = [
#         {
#             'id': 'xxx',
#             'userId': 'yyy',
#             'userCd': 'zzz',
#             'userNm': '111',
#             'partitionKey': '222',
#             'delFlg': '333'
#         }
#     ]
#     resq = test0004_entity.HttpParam(data=param['data'], user=param['user'], chatId=param['chatId'])
#     mocker.patch('app.api.cosmos_api.test0004.test0004_service.select_user_list', return_value = temp_res)
#     resp = test0004_api.cosmos_get_user(resq)

#     if len(resp) > 0:
#         assert resp[0]['id'] == 'xxx'


# params = {
#     '有参数的场合': {'data': 'user1', 'user': '', 'chatId': ''},
#     '错误参数的场合': {'data': 'xxxxx', 'user': 'yyyyy', 'chatId': 'zzzzz'},
#     '无参数的场合': {},
# }

# @allure.feature("测试 画面0004")
# @allure.title("测试 获取最近联系人:{pattern}")
# @pytest.mark.parametrize('pattern, param', [
#     ('有参数的场合', {'data': 'user1', 'user': '', 'chatId': ''}),
#     ('错误参数的场合', {'data': 'xxxxx', 'user': 'yyyyy', 'chatId': 'zzzzz'}),
#     ('无参数的场合', {})
# ])
# # @pytest.mark.parametrize('param', list(params.values()), ids=list(params.keys()))
# def test_get_recent_contacts(app, pattern, param):
#     """ 获取最近联系人 """
#     print(pattern)

#     client = TestClient(app)
#     resp = client.post(
#         config.settings.API_STR + "/cosmos_api/test0004/get_recent_contacts",
#         # json={'data': 'wangtao', 'user': '', 'chatId': ''},
#         json=param,
#     )
#     if len(param) == 0:
#         assert resp.status_code == 422
#     else:
#         json_resp = resp.json()
#         if param['user'] == 'user1':
#             assert resp.status_code == 200
#             assert len(json_resp) != 0
#         else:
#             assert len(json_resp) == 0


# def test_service_select_user_list(mocker):
#     """ 获取用户信息 """

#     param = test0004_entity.HttpParam(data='wangtao', user='', chatId='')
#     # 不mock直接调用
#     result = test0004_service.select_user_list(param)
#     assert result[0]['id'] == 'login'

#     # 模拟一个函数的返回值
#     temp_res = [
#         {
#             'id': 'xxx', 
#             'userId': 'yyy', 
#             'userCd': 'zzz', 
#             'userNm': '111', 
#             'partitionKey': '222', 
#             'delFlg': '333'
#         }
#     ]
#     mocker.patch('app.api.cosmos_api.test0004.test0004_service.select_user_list', return_value = temp_res)
#     result = test0004_service.select_user_list(param)
#     assert result[0]['id'] == 'xxx'


# # def test_service_select_user_list2():
# #     """ 获取用户信息 """

# #     test0004_service.select_user_list = mock.Mock(return_value=20)
# #     param = test0004_entity.HttpParam(data='wangtao', user='', chatId='')
# #     res = test0004_api.cosmos_get_user(param)
# #     assert res == 20

#     # test0004_service.select_user_list = mock.Mock(return_value=20)
#     # res = test0004_service_service.select_user_list()
#     # assert res[0]['id'] == 'login'

#     # @pytest.mark.parametrize('pattern, param, http_status_code, con_id', [
#     #         ('正常数据的场合', {'data': 'wangtao', 'user': '', 'chatId': ''}, 200, 'login'),
#     #         ('错误数据的场合', {'data': 'xxxxx', 'user': 'yyyyy', 'chatId': 'zzzzz'}, 200, ''),
#     #         ('空值数据的场合', {'data': '', 'user': '', 'chatId': ''}, 200, ''),
#     #         ('错误实体的场合', {'aaa': 'xxxxx', 'bbb': 'yyyyy', 'ccc': 'zzzzz'}, 422, ''),
#     #         ('空实体的场合', {}, 422, ''),
#     #     ])
#     # @allure.title("获取当前登录用户数据:{pattern}")
#     # @allure.description("根据传递的参数获取当前登录用户数据")
#     # @patch('cosmos_api/test0004/get_data_from_db')
#     # def test_temp(self, app, pattern, param, http_status_code, con_id):
#     #     print(pattern)
