import os                        #環境変数(.env)の読み込みに必要
from dotenv import load_dotenv   #環境変数(.env)の読み込みに必要
import mysql.connector           #mysqlとpyを紐付け
from fastapi import FastAPI, Request, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from urllib.parse import urlencode

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.add_middleware(SessionMiddleware, secret_key="ohayou")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
def root(request:Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("signup")
def signup(request:Request, fullname:str=Form(None), account:str=Form(None), psw:str=Form(None)):
        # db記述
    if  account == "test" and psw == "test":
        request.session["SIGNED-IN"]="TRUE"
        return RedirectResponse(url="/member", status_code=303)
    else:
        query_params = urlencode({"message": "帳號或密碼輸入錯誤"})
        return RedirectResponse(url=f"/error?{query_params}", status_code=303)

@app.post("signin")
def signin(request:Request, account:str=Form(None), psw:str=Form(None)):
    # db記述
    if  account == "test" and psw == "test":
        request.session["SIGNED-IN"]="TRUE"
        return RedirectResponse(url="/member", status_code=303)
    else:
        query_params = urlencode({"message": "帳號或密碼輸入錯誤"})
        return RedirectResponse(url=f"/error?{query_params}", status_code=303)

@app.get("/error", response_class=HTMLResponse)
def error_page(request:Request, message:str):
    return templates.TemplateResponse("error.html",{"request": request, "message": message})

@app.get("/member", response_class=HTMLResponse)
def success_page(request:Request, fullname:str):
    if request.session["SIGNED-IN"] == "TRUE":
        return templates.TemplateResponse("member.html",{"request": request, "fullname": fullname})
    return RedirectResponse(url="/")





load_dotenv()                    #環境変数の読み込み
host = os.getenv("DB_HOST")
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")

mydb = mysql.connector.connect(   #mysqlへのアクセス
    host=host,
    user=user,
    password=password
)

cursor = mydb.cursor()              #SQL指令する為のcursorObjを作成
cursor.execute("USE mydb")    #執行SQL指令
# data=cursor.fetchone()         #取得一筆資料   多筆(tupleを含んだlist).fetchall()  一筆(tuple).fetchone()
# mydb.commit()                     #これがないとデータベースに反映されない。

mydb.close()                       #關閉MySQL 同時接続の緩和＋リソースの解放


