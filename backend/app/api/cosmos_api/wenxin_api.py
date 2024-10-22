"""文心一言共通"""

import json
import time
import requests

API_KEY = "5UIUIdbN8ofYG2P7Lch50Iap"
SECRET_KEY = "53YfiFFRMpJ7uIRv8jBd5ECij0oQcKbl"


def get_access_token():
    """
    使用 AK、SK 生成鉴权签名(Access Token)
    :return: access_token,或是None(如果错误)
    """
    url = "https://aip.baidubce.com/oauth/2.0/token"
    params = {
        "grant_type": "client_credentials",
        "client_id": API_KEY,
        "client_secret": SECRET_KEY,
    }
    return str(
        requests.post(url, params=params, timeout=9999).json().get("access_token")
    )


############################### NORMAL ###############################


def main(messages):
    """获取一个回复"""
    url = (
        """
        https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-speed-128k?access_token=
        """
        + get_access_token()
    )

    payload = json.dumps(
        {
            # "messages": [
            #     {
            #         "role": "user",
            #         "content": "你好"
            #     },
            #     {
            #         "role": "assistant",
            #         "content": "你好！有什么我可以帮助你的吗？"
            #     }
            # ]
            "messages": messages
        }
    )
    headers = {"Content-Type": "application/json"}

    response = requests.request(
        "POST", url, headers=headers, data=payload, timeout=9999
    )

    return response.text


############################### 流式回答用 ###############################


def gen_stream(prompt):
    """获取流式回复"""
    response = get_stream_response(prompt)
    for chunk in response.iter_lines():
        chunk = chunk.decode("utf8")
        if chunk[:5] == "data:":
            chunk = chunk[5:]
        yield chunk
        time.sleep(0.01)


def get_stream_response(prompt):
    """调用文心一言接口"""
    source = "&sourceVer=0.0.1&source=app_center&appName=streamDemo"
    # 大模型接口URL
    url = (
        """https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant?access_token="""
        + get_access_token()
        + source
    )
    data = {"messages": [{"role": "user", "content": prompt}], "stream": True}
    payload = json.dumps(data)
    headers = {"Content-Type": "application/json"}
    return requests.post(url, headers=headers, data=payload, timeout=9999, stream=True)


def call_stream_response(messages):
    """调用文心一言接口"""
    source = "&sourceVer=0.0.1&source=app_center&appName=streamDemo"
    # 大模型接口URL
    url = (
        """https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant?access_token="""
        + get_access_token()
        + source
    )
    data = {"messages": messages, "stream": True}
    payload = json.dumps(data)
    headers = {"Content-Type": "application/json"}
    return requests.post(url, headers=headers, data=payload, timeout=9999, stream=True)


# def get_access_token2(ak, sk):
#     """获取Token"""
#     auth_url = "https://aip.baidubce.com/oauth/2.0/token"
#     resp = requests.get(auth_url, params={
#         "grant_type": "client_credentials",
#         "client_id": ak, 'client_secret': sk
#     }, timeout=9999)
#     return resp.json().get("access_token")

# if __name__ == '__main__':
#     main()

############################### OLD ###############################

# def gen_stream(prompt):
#     response = get_stream_response(prompt)
#     for chunk in response.iter_lines():
#         chunk = chunk.decode("utf8")
#         if chunk[:5] == "data:":
#             chunk = chunk[5:]
#         yield chunk
#         time.sleep(0.01)


# def get_stream_response(prompt):
#     """调用文心一言接口"""
#     ak = "5UIUIdbN8ofYG2P7Lch50Iap"
#     sk = "53YfiFFRMpJ7uIRv8jBd5ECij0oQcKbl"
#     source = "&sourceVer=0.0.1&source=app_center&appName=streamDemo"
#     # 大模型接口URL
#     url = """
#     https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant?access_token=
#     """ + get_access_token(ak, sk) + source
#     data = {
#         "messages": [{"role": "user", "content": prompt}],
#         "stream": True
#     }
#     payload = json.dumps(data)
#     headers = {'Content-Type': 'application/json'}
#     return requests.post(url, headers=headers, data=payload, stream=True)


# def get_access_token(ak, sk):
#     """获取Token"""
#     auth_url = "https://aip.baidubce.com/oauth/2.0/token"
#     resp = requests.get(auth_url, params={
#       "grant_type": "client_credentials",
#       "client_id": ak,
#       "client_secret": sk
#     }, timeout=9999)
#     return resp.json().get("access_token")
