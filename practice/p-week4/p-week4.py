from fastapi import FastAPI, Request, Form             #client系のデータ取得に必要
from fastapi.staticfiles import StaticFiles    #静的ファイルのインポート(urlで入力するとすぐレスポンスするように)
from fastapi.responses import RedirectResponse     #redirect機能を追加する際に必要
from fastapi.responses import HTMLResponse    # ＃htmlのみの出力(jinja2に必要)   return HTMLResponse(content=html)
#from fastapi.responses import FileResponse   　#html + css +jsの出力　return FileResponse("index.html")
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware  #sessionの導入, secret_keyを追記する必要あり
from urllib.parse import urlencode


app = FastAPI()   # FastAPI = APIのすべての機能を提供するPythonクラス, そのインスタンスを生成。Uvicorn file名:app --reloadで呼び出し
app.mount("/static", StaticFiles(directory="static"), name="static")  # mountは@app.get()等から除外される. nameはFastAPI内で使われる名称。dirにここで設定した名称のdirが無いとエラーになる。
app.add_middleware(SessionMiddleware, secret_key="arigatou") #sessionに必要な記述
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)   # pythonで＠から始まる物＝デコレータ＝帽子のような物で、関数の上に置き、直下の関数を受けとりFastAPIに知らせる。
def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})



# @app.get("/tems/{tem_id}")
# def read_root(tem_id: str, request: Request):
#     client_host = request.client.host
#     print("主機名稱", request.client.host)
#     print("請求方法", request.method)
#     print("完整url", request.url)

#     print("Header", request.headers["user-agent"])
#     print("語言偏好", request.headers["accept-language"])
#     print("cookie", request.headers["cookie"])
#     # print("引薦網址", request.headers["referrer"]) #他からのリンクを辿ってないと、ヘッダーには含まれず、エラーになる
#     return {"client_host": client_host, "tem_id": tem_id}



