# -*- coding: utf-8 -*-
# @author: xiaobai
import uvicorn

from app.factory import create_app

app = create_app()

if __name__ == "__main__":
    uvicorn.run(app="main:app", host="127.0.0.1", port=8000, reload=True)
