import os                        #環境変数(.env)の読み込みに必要
from dotenv import load_dotenv   #環境変数(.env)の読み込みに必要
import mysql.connector           #mysqlとpyを紐付け
from fastapi import FastAPI, Request, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from urllib.parse import urlencode


def connect_db():
    load_dotenv()
    return mysql.connector.connect(                         #mysqlへのアクセス
        host = os.getenv("DB_HOST"),
        user = os.getenv("DB_USER"),
        password = os.getenv("DB_PASSWORD"),
        database = os.getenv("DB_NAME")
    )

def close_db(cursor, db):
    cursor.close()
    db.close()


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.add_middleware(SessionMiddleware, secret_key="ohayou")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
def home_page(request:Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/signup")
def signup(request:Request, fullname:str=Form(None), account_up:str=Form(None, alias="account-up"), psw_up:str=Form(None, alias="psw-up")):
    mydb = connect_db()
    cursor = mydb.cursor()                                              #SQL指令する為のcursorObjを作成(db操作が必要な度に呼び出し)
    try:
        cursor.execute("SELECT * FROM member WHERE BINARY username = %s", (account_up,))       #執行SQL指令
        member = cursor.fetchone()                                                   #取得一筆資料   多筆(tupleを含んだlist).fetchall()  一筆(tuple).fetchone()
        if member:         #能取得data = 已經被註冊
            query_params = urlencode({"message": "帳號已經被註冊"})
            return RedirectResponse(url=f"/error?{query_params}", status_code=303)
        else:
            cursor.execute("INSERT INTO member(name, username, password) VALUES(%s, %s, %s)", (fullname, account_up, psw_up))
            mydb.commit()    #これがないとデータベースに反映されない。
            return RedirectResponse(url="/member", status_code=303)
    finally:
        close_db(cursor, mydb)

@app.post("/signin")
def signin(request:Request, account_in:str=Form(None, alias="account-in"), psw_in:str=Form(None, alias="psw-in")):
    mydb = connect_db()
    cursor = mydb.cursor()
    try:
        cursor.execute("SELECT * FROM member WHERE BINARY username = %s AND BINARY password = %s", (account_in, psw_in))
        member = cursor.fetchone()
        if member:           #能取得data = 資料是對的
            add_sessions = ["MEMBER_ID", "NAME", "USERNAME"]
            for index, value in enumerate(add_sessions):
                request.session[value] = member[index]
            return RedirectResponse(url="/member", status_code=303)
        else:
            query_params = urlencode({"message": "帳號或密碼輸入錯誤"})
            return RedirectResponse(url=f"/error?{query_params}", status_code=303)
    finally:
        close_db(cursor, mydb)

@app.get("/error", response_class=HTMLResponse)
def error_page(request:Request, message:str):
    return templates.TemplateResponse("error.html",{"request": request, "message": message})

@app.get("/member", response_class=HTMLResponse)
def member_page(request:Request):
    mydb = connect_db()
    cursor = mydb.cursor()
    try:
        if "NAME" in request.session:
            sessionName = request.session.get("NAME")
            cursor.execute("SELECT member.name, message.id, message.content, message.time FROM member INNER JOIN message ON member.id = message.member_id ORDER BY time DESC")
            members = cursor.fetchall()
            return templates.TemplateResponse("member.html",{"request": request, "sessionName": sessionName, "members": members})
        else:
            return RedirectResponse(url="/")
    finally:
        close_db(cursor, mydb)


@app.get("/signout", response_class=HTMLResponse)
def signout(request:Request):
    remove_sessions = ["MEMBER_ID", "NAME", "USERNAME"]
    for remove_session in remove_sessions:
        request.session.pop(remove_session, None)   #popメソッドはsession Keyが存在しない場合エラーを出す。エラーを発生させずに処理する為にNoneを指定
    return RedirectResponse(url="/")


@app.post("/createMessage")
def createmsg(request:Request, leave_msg:str=Form(None)):
    mydb = connect_db()
    cursor = mydb.cursor()
    try:
        member_id = request.session.get("MEMBER_ID")
        cursor.execute("INSERT INTO message(member_id, content) VALUES(%s, %s)", (member_id, leave_msg))
        mydb.commit()
        return RedirectResponse(url="/member", status_code=303)
    finally:
        close_db(cursor, mydb)


@app.post("/deleteMessage")
def deletemsg(request:Request, message_id:str=Form(None)):
    mydb = connect_db()
    cursor = mydb.cursor()
    try:
        member_id = request.session.get("MEMBER_ID")
        cursor.execute("DELETE FROM message WHERE id = %s AND member_id = %s", (message_id, member_id))    #只讓登入者刪除
        mydb.commit()
        return RedirectResponse(url="/member", status_code=303)
    finally:
        close_db(cursor, mydb)


    # cursor.execute("CREATE TEMPORARY TABLE temp_join AS SELECT member.username, message.content FROM member INNER JOIN message ON member.id = message.member_id WHERE username = %s", (username,))


