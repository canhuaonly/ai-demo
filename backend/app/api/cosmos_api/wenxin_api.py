"""文心一言共通"""
import json
import requests

API_KEY = "5UIUIdbN8ofYG2P7Lch50Iap"
SECRET_KEY = "53YfiFFRMpJ7uIRv8jBd5ECij0oQcKbl"


def main(messages):
    """获取一个回复"""
    url = """
        https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-speed-128k?access_token=
        """ + get_access_token()

    payload = json.dumps({
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
    })
    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload, timeout=9999)

    return response.text


def get_access_token():
    """
    使用 AK，SK 生成鉴权签名（Access Token）
    :return: access_token，或是None(如果错误)
    """
    url = "https://aip.baidubce.com/oauth/2.0/token"
    params = {"grant_type": "client_credentials", "client_id": API_KEY, "client_secret": SECRET_KEY}
    return str(requests.post(url, params=params, timeout=9999).json().get("access_token"))


# if __name__ == '__main__':
#     main()
