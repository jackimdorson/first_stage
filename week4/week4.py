from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
# from starlette.exceptions import HTTPException as StarletteHTTPException
from urllib.parse import urlencode
# from starlette.status import HTTP_303_SEE_OTHER

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.add_middleware(SessionMiddleware, secret_key="arigatou")
templates = Jinja2Templates(directory="templates")

#customエラーハンドルの定義
# @app.exception_handler(StarletteHTTPException)
# def custom_http_exception_handler(request:Request, exc: StarletteHTTPException):
#     message = exc.detail
#     query_params = urlencode({"message": message})
#     # return templates.TemplateResponse("error.html", {"request":request, "message":message}, status_code=exc.status_code)
#     furl = f"/error/?{query_params}"
#     return RedirectResponse(url=furl)

def func_signin(request:Request, message:str):
    return templates.TemplateResponse("member.html", {"request":request, "message":message})


@app.get("/", response_class=HTMLResponse) #FastAPIのdefaultはJSONResponseを返す。jinjaでHTMLResponseをしたい場合は記入すると良い。
def root(request:Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/signin", response_class=HTMLResponse)
def signin(request:Request, account:str=Form(None), password:str=Form(None)):     # Form(...)...如果空,自動使用fastAPI的error, Form(None)如果空,使用自己設定的error
    if account == "test" and password == "test":
        request.session["SIGNED-IN"]="TRUE"
        return RedirectResponse(url = "/member", status_code=303) #303=改成GETmethod(預設307)
    else:
        if not account or not password:
            error_message = "請輸入帳號、密碼"
        else:
            error_message = "帳號、密碼輸入錯誤"
        query_params = urlencode({"message":error_message})
        return RedirectResponse(url = f"/error?{query_params}", status_code=303)


@app.get("/error", response_class=HTMLResponse)
def error_page(request:Request, message:str):
    session_value = request.session["SIGNED-IN"]
    return templates.TemplateResponse("error.html", {"request":request, "message":message})


@app.get("/member", response_class=HTMLResponse)
def success_page(request:Request):
    session_value = request.session["SIGNED-IN"]
    if session_value == "TRUE":
        message = "恭喜您，成功登入系統"
        return templates.TemplateResponse("member.html", {"request":request, "message":message})
    return RedirectResponse(url ="/")

@app.get("/signout", response_class=HTMLResponse)
def signout(request:Request):
    request.session["SIGNED-IN"]="FALSE"
    return RedirectResponse(url = "/")





@app.get("/square/{square}", response_class=HTMLResponse)
def square_page(request:Request, square:str):
    total = int(square)**2
    return templates.TemplateResponse("square.html", {"request":request, "total":total})


@app.get("/square")
def square_page(request:Request, square:str):
    return RedirectResponse(url = f"/square/{square}")
