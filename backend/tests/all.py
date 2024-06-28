import pytest
import os

if __name__ == "__main__":
    # -s：表示输出测试方法里面的调试信息，包括print()
    # -v：表示输出了详细的模块名、类名、模块名
    # -x：如果有失败的，则停止运行
    # pytest.main(["-sv"])
    # -n: 代表线程并发
    # =2：两个线程
    # pytest.main(["-sv", "-n=2"])
    # --html=report.html 输出美观的报表
    pytest.main(["-sv"])
    # # 覆盖文件
    os.system("allure generate ./temp --clean allure-results -o report")
    # # 打开服务
    os.system("allure open -h 127.0.0.1 -p 8883 ./report")
