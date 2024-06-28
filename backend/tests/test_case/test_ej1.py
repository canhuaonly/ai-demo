import time
import pytest
import allure


@allure.feature("测试用例类")
class TestEj01:

    # @pytest.mark.last #最后一个执行
    # @pytest.mark.run(order=n) #n=1则是第一个执行
    @allure.story("测试用例01")  # 二级标签（每个接口的标签）
    @allure.title(
        "测试1"
    )  # 标题，每个用例带个标题（报告体现在每个测试用例）(一个接口有几个用例，title用例的标签)
    @allure.description("这是第1个测试CASE")
    @allure.step("STEP1")
    def test_ej_01(self):
        # time.sleep(5)
        print("测试01")

    @allure.story("测试用例02")  # 二级标签（每个接口的标签）
    @allure.title(
        "测试02"
    )  # 标题，每个用例带个标题（报告体现在每个测试用例）(一个接口有几个用例，title用例的标签)
    @allure.description("这是第2个测试CASE")
    @allure.step("STEP2")
    def test_ej_02(self):
        # time.sleep(5)
        print("测试02")

    @allure.story("测试用例03")  # 二级标签（每个接口的标签）
    @allure.title(
        "测试03"
    )  # 标题，每个用例带个标题（报告体现在每个测试用例）(一个接口有几个用例，title用例的标签)
    @allure.description("这是第2个测试CASE")
    @allure.step("STEP3")
    def test_ej_03(self):
        # time.sleep(5)
        print("测试03")

    # def test_success():
    #     """this test succeeds"""
    #     assert True

    # def test_failure():
    #     """this test fails"""
    #     assert False

    # def test_skip():
    #     """this test is skipped"""
    #     pytest.skip("for a reason!")

    # def test_broken():
    #     raise Exception("oops")
