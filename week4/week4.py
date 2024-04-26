from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from urllib.parse import urlencode

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.add_middleware(SessionMiddleware, secret_key="arigatou")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)     #FastAPIのdefaultはJSONResponseを返す。jinjaでHTMLResponseをしたい場合は記入すると良い。
def root(request:Request):   #Requestクラスをrequestとしてインスタンス化
    h2 = "歡迎光臨，請輸入帳號密碼"
    return templates.TemplateResponse("common.html", {"request":request, "message":"登入系統", "h2":h2})  #requestObjがrequestというkeyでテンプレに渡される(必須)

@app.post("/signin")
def signin(request:Request, account:str=Form(None), psw:str=Form(None)):   # Form(...)如果空,自動使用fastAPI的error, Form(None)如果空,使用自己設定的error
    if account == "test" and psw == "test":
        request.session["SIGNED-IN"]="TRUE"
        return RedirectResponse(url="/member", status_code=303)  #303=改成GETmethod(預設307)
    else:
        if not account or not psw:
            error_message = "請輸入帳號、密碼"
        else:
            error_message = "帳號、密碼輸入錯誤"
        query_params = urlencode({"message":error_message})
        return RedirectResponse(url=f"/error?{query_params}", status_code=303)

@app.get("/error", response_class=HTMLResponse)
def error_page(request:Request, message:str):
    h2 = "失敗頁面"
    return templates.TemplateResponse("common.html", {"request":request, "message":message, "h2":h2, "link_url":"root", "link_text":"返回首頁"})

@app.get("/member", response_class=HTMLResponse)
def success_page(request:Request):
    if request.session["SIGNED-IN"] == "TRUE":
        message = "恭喜您，成功登入系統"
        h2 = "歡迎光臨，這是會員頁"
        return templates.TemplateResponse("common.html", {"request":request, "message":message, "h2":h2, "link_url":"signout", "link_text":"登出系統"})
    return RedirectResponse(url="/")

@app.get("/signout")
def signout(request:Request):
    request.session["SIGNED-IN"]="FALSE"
    return RedirectResponse(url="/")

@app.get("/square/{input}", response_class=HTMLResponse)
def square_page(request:Request, input:int):
    message = input**2
    h2 = "正整數平方計算結果"
    return templates.TemplateResponse("common.html", {"request":request, "message":message, "h2":h2, "link_url":"root", "link_text":"返回首頁"})

# @app.get("/square")
# def square_page(request:Request, square:str):
#     return RedirectResponse(url=f"/square/{square}")
