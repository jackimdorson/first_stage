import os                        #環境変数(.env)の読み込みに必要
from dotenv import load_dotenv   #環境変数(.env)の読み込みに必要
import mysql.connector           #mysqlとpyを紐付け
from fastapi import FastAPI, Request, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from urllib.parse import urlencode

load_dotenv()
def connect_db():
    return mysql.connector.connect(       #mysqlへのアクセス
        host = os.getenv("DB_HOST"),
        user = os.getenv("DB_USER"),
        password = os.getenv("DB_PASSWORD"),
        database = os.getenv("DB_NAME")
    )

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.add_middleware(SessionMiddleware, secret_key="ohayou")
templates = Jinja2Templates(directory="templates")


@app.get("/")     #returnにTemplateResponse を使用する場合　response_class=HTMLResponseは不要
async def home_page(request:Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/signup")
async def signup(request:Request, name:str=Form(None), username:str=Form(None), psw:str=Form(None)):
    with connect_db() as mydb:
        with mydb.cursor() as cursor:                            #SQL指令する為のcursorObjを作成(db操作が必要な度に呼び出し)
            try:
                cursor.execute("SELECT * FROM member WHERE BINARY username = %s", (username,))       #執行SQL指令
                member = cursor.fetchone()                                                   #取得一筆資料   多筆(tupleを含んだlist).fetchall()  一筆(tuple).fetchone()
                if member:         #能取得data = 已經被註冊
                    return RedirectResponse(url=request.url_for("error_page", message= "帳號已經被註冊"), status_code=303)
                else:
                    cursor.execute("INSERT INTO member(name, username, password) VALUES(%s, %s, %s)", (name, username, psw))
                    mydb.commit()    #これがないとデータベースに反映されない。
                    return RedirectResponse(url=request.url_for("member_page"), status_code=303)
            except Exception as e:
                mydb.rollback()    #元の状態に戻す
                return JSONResponse(status_code=500, content={"message": str(e)})


@app.post("/signin")
async def signin(request:Request, username:str=Form(None), psw:str=Form(None)):
    with connect_db() as mydb:
        with mydb.cursor() as cursor:
            try:
                cursor.execute("SELECT * FROM member WHERE BINARY username = %s AND BINARY password = %s", (username, psw))
                member = cursor.fetchone()
                if member:           #能取得data = 資料是對的
                    add_sessions = ["MEMBER_ID", "NAME", "USERNAME"]
                    for index, value in enumerate(add_sessions):
                        request.session[value] = member[index]
                    return RedirectResponse(url=request.url_for("member_page"), status_code=303)
                else:
                    return RedirectResponse(url=request.url_for("error_page", message= "帳號或密碼輸入錯誤"), status_code=303)
            except Exception as e:
                mydb.rollback()
                return JSONResponse(status_code=500, content={"message": str(e)})


@app.get("/error")
async def error_page(request:Request, message:str):
    return templates.TemplateResponse("error.html",{"request": request, "message": message})


@app.get("/member")
async def member_page(request:Request):
    with connect_db() as mydb:
        with mydb.cursor() as cursor:
            try:
                if "NAME" in request.session:
                    sessionName = request.session.get("NAME")
                    cursor.execute("SELECT member.name, message.id, message.content, message.time FROM member INNER JOIN message ON member.id = message.member_id ORDER BY time DESC")
                    members = cursor.fetchall()
                    return templates.TemplateResponse("member.html",{"request": request, "sessionName": sessionName, "members": members})
                else:
                    return RedirectResponse(url=request.url_for("home_page"))
            except Exception as e:
                mydb.rollback()
                return JSONResponse(status_code=500, content={"message": str(e)})


@app.get("/signout")
async def signout(request:Request):
    remove_sessions = ["MEMBER_ID", "NAME", "USERNAME"]
    for remove_session in remove_sessions:
        request.session.pop(remove_session, None)   #popメソッドはsession Keyが存在しない場合エラーを出す。エラーを発生させずに処理する為にNoneを指定
    return RedirectResponse(url=request.url_for("home_page"))


# @app.post("/createMessage")
# async def createmsg(request:Request, content:str=Form(None)):
#     with connect_db() as mydb:
#         with mydb.cursor() as cursor:
#             try:
#                 member_id = request.session.get("MEMBER_ID")
#                 cursor.execute("INSERT INTO message(member_id, content) VALUES(%s, %s)", (member_id, content))
#                 mydb.commit()
#                 return RedirectResponse(url=request.url_for("member_page"), status_code=303)
#             except Exception as e:
#                 mydb.rollback()
#                 return JSONResponse(status_code=500, content={"message": str(e)})


# @app.post("/deleteMessage")
# async def deletemsg(request:Request, id_message:str=Form(None, alias="id-message")):
#     with connect_db() as mydb:
#         with mydb.cursor() as cursor:
#             try:
#                 member_id = request.session.get("MEMBER_ID")
#                 cursor.execute("DELETE FROM message WHERE id = %s AND member_id = %s", (id_message, member_id))    #只讓登入者刪除
#                 mydb.commit()
#                 return RedirectResponse(url=request.url_for("member_page"), status_code=303)
#             except Exception as e:
#                 mydb.rollback()
#                 return JSONResponse(status_code=500, content={"message": str(e)})



def execute_query(query_func):
    def wrapper(*args, **kwargs):
        with connect_db() as mydb:
            with mydb.cursor() as cursor:
                try:
                    return query_func(cursor, *args, **kwargs)
                except Exception as e:
                    mydb.rollback()
                    return JSONResponse(status_code=500, content={"message": str(e)})
    return wrapper

@app.post("/createMessage")
@execute_query
def createmsg(cursor, request: Request, content: str = Form(None)):
    member_id = request.session.get("MEMBER_ID")
    cursor.execute("INSERT INTO message (member_id, content) VALUES (%s, %s)", (member_id, content))
    return RedirectResponse(url=request.url_for("member_page"), status_code=303)

@app.post("/deleteMessage")
@execute_query
def deletemsg(cursor, request: Request, id_message: str = Form(None, alias="id-message")):
    member_id = request.session.get("MEMBER_ID")
    cursor.execute("DELETE FROM message WHERE id = %s AND member_id = %s", (id_message, member_id))
    return RedirectResponse(url=request.url_for("member_page"), status_code=303)