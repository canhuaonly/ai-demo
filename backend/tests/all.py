"""Pytest Start"""
# import os
import pytest

if __name__ == "__main__":
    # -s：表示输出测试方法里面的调试信息，包括print()
    # -v：表示输出了详细的模块名、类名、模块名
    # -x：如果有失败的，则停止运行
    # pytest.main(["-sv"])
    # -n: 代表线程并发
    # -m: 通过标记表达式执行
    # -k: 根据测试用例的部分字符串指定测试用例，可以使用and，or
    # =2：两个线程
    # pytest.main(["-sv", "-n=2"])
    # --html=report.html 输出美观的报表
    # pytest.main(["-sv", "--html=report.html"])
    pytest.main(["--html=report.html"])
    # # 覆盖文件
    # os.system("allure generate ./temp --clean allure-results -o report")
    # # 打开服务
    # os.system("allure open -h 127.0.0.1 -p 8883 ./report")
