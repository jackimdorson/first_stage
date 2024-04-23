from fastapi import FastAPI, Request, Form             #client系のデータ取得に必要
from fastapi.staticfiles import StaticFiles    #静的ファイルのインポート(urlで入力するとすぐレスポンスするように)
from fastapi.responses import RedirectResponse     #redirect機能を追加する際に必要
from fastapi.responses import HTMLResponse    # ＃htmlのみの出力(jinja2に必要)   return HTMLResponse(content=html)
#from fastapi.responses import FileResponse   　#html + css +jsの出力　return FileResponse("index.html")
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware  #sessionの導入, secret_keyを追記する必要あり

app = FastAPI()   # FastAPI = APIのすべての機能を提供するPythonクラス, そのインスタンスを生成。Uvicorn file名:app --reloadで呼び出し
app.mount("/static", StaticFiles(directory="static"), name="static")  # mountは@app.get()等から除外される. nameはFastAPI内で使われる名称。dirにここで設定した名称のdirが無いとエラーになる。
app.add_middleware(SessionMiddleware, secret_key="konichiwa") #sessionに必要な記述
templates = Jinja2Templates(directory="templates")

@app.get("/")   # pythonで＠から始まる物＝デコレータ＝帽子のような物で、関数の上に置き、直下の関数を受けとりFastAPIに知らせる。
def read_session(request: Request):
    session_value = request.session.get("key", "default")
    return {"session_value": session_value}

# @app.get("/set/{value}")
# def write_session(request: Request, value: str):
#     request.session["key"]=value
#     return {"message": "Session value set"}


@app.get("/members/{id}", response_class=HTMLResponse)
def read_member(request: Request, id: str):
    session_value = request.session.get("key", "default")
    return templates.TemplateResponse("member.html", {"request": request,"id": id, "session_value": session_value})


@app.get("/users/me")
def read_user_me():
    return {"user_id": "the current user"}

@app.get("/users/{user_id}")
def read_user(request: Request, user_id: str):
    request.session["key"]=user_id
    return templates.TemplateResponse("name.html", {"request": request, "user_id": user_id})


@app.get("/items/{item_id}")
def read_item(item_id: int, k:str, v:str = None):    #  デフォルト値をNoneとすることでオプショナルとなり。none無しだと必須の意味。
    if v:
        return {"item_id": item_id, "key": k, "val": v}    #  /items/5?k=6&v=7
    return {"item_id": item_id, "key": k}


@app.get("/tems/{tem_id}")
def read_root(tem_id: str, request: Request):
    client_host = request.client.host
    print("主機名稱", request.client.host)
    print("請求方法", request.method)
    print("完整url", request.url)

    print("Header", request.headers["user-agent"])
    print("語言偏好", request.headers["accept-language"])
    print("cookie", request.headers["cookie"])
    # print("引薦網址", request.headers["referrer"]) #他からのリンクを辿ってないと、ヘッダーには含まれず、エラーになる
    return {"client_host": client_host, "tem_id": tem_id}



@app.get("/lang/en")
def read_en():
    return {"lang": "en"}

@app.get("/lang/zh")
def read_zh():
    return {"lang": "zh"}


@app.get("/lang/{lang_id}")    #lang_idの部分は先に記述する必要がある。でないとエラーになりredirect出来なくなる。
def read_lang(lang_id: str):
    if lang_id == "en":
        return RedirectResponse(url="/lang/en")
    elif lang_id == "zh":
        return RedirectResponse(url="/lang/zh")
    else:
        return {"error": "not found"}


@app.get("/show")
def read_show(request: Request):
    name = request.query_params["name"]
    request.session["key"]=name
    return templates.TemplateResponse("name.html", {"request": request, "name": name})




@app.post("/calc")
def read_calc(request: Request, max: int = Form()):
    # maxNum = int(request.query_params["max"])  getのformでのquerystring取得の記述法
    maxNum = max  # postのform-data取得
    result = 0
    for n in range(1, maxNum+1):
        result += n
    return templates.TemplateResponse("calc.html", {"request": request, "result": str(result)})





