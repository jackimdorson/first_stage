import os                          #環境変数(.env)の読み込みに必要
from dotenv import load_dotenv     #環境変数(.env)の読み込みに必要
import mysql.connector             #mysqlとpyを紐付け(MySQL公式が開発。非同期処理に未対応)　import aiomysql(コミュニティが開発。非同期処理に対応)
from fastapi import FastAPI, Request, Form
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
import urllib.parse     #urllib.parseの利用に必要
import datetime      #dbのdatetimeをカスタムしたい場合に必要(秒不要など)

load_dotenv()
def connect_db():
    return mysql.connector.connect(       #mysqlへのアクセス
        host = os.getenv("DB_HOST"),
        user = os.getenv("DB_USER"),
        password = os.getenv("DB_PASSWORD"),
        database = os.getenv("DB_NAME")
    )

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY"))
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# カスタムフィルタの定義  datetime.datetimeは『型ヒント』 -> str:は戻り値の『型ヒント』
def format_datetime(value: datetime.datetime, fmt: str) -> str:
    return value.strftime(fmt)
# カスタムフィルタをテンプレートエンジンに登録
templates.env.filters["format_datetime"] = format_datetime


@app.get("/")     #TemplateResponse, HTMLResponseは自動的に Content-Type を text/html; charset=utf-8 に設定。よってresponse_class=HTMLResponseの記述は不要
def home_page(request:Request):
    return templates.TemplateResponse("index.html", {"request":request})


@app.post("/signup")
def signup(request:Request, name:str=Form(...), username:str=Form(...), psw:str=Form(...)):
    with connect_db() as mydb:
        with mydb.cursor() as cursor:                            #SQL指令する為のcursorObjを作成(db操作が必要な度に呼び出し)
            try:
                cursor.execute("SELECT * FROM member WHERE BINARY username = %s", (username,))       #執行SQL指令
                username_exists = cursor.fetchone()                                                   #取得一筆資料   多筆(tupleを含んだlist).fetchall()  一筆(tuple).fetchone()
                if username_exists:         #能取得data = 已經被註冊
                    url_for = request.url_for("error_page")
                    query_params = urllib.parse.urlencode({"message": "帳號已經被註冊"})
                    return RedirectResponse(url=f"{url_for}?{query_params}", status_code=303)

                else:
                    cursor.execute("INSERT INTO member(name, username, password) VALUES(%s, %s, %s)", (name, username, psw))
                    mydb.commit()     #これがないとデータベースに反映されない。
                    return RedirectResponse(url=request.url_for("member_page"), status_code=303)
            except Exception as e:
                mydb.rollback()    #元の状態に戻す
                print(f"==== 發生Error ====: {e}")


@app.post("/signin")
def signin(request:Request, username:str=Form(...), psw:str=Form(...)):
    try:
        with connect_db() as mydb:
            with mydb.cursor() as cursor:
                cursor.execute("SELECT * FROM member WHERE BINARY username = %s AND BINARY password = %s", (username, psw))
                signin_exists = cursor.fetchone()
                if signin_exists:
                    add_sessions = ["MEMBER_ID", "NAME", "USERNAME"]
                    for index, value in enumerate(add_sessions):
                        request.session[value] = signin_exists[index]
                    return RedirectResponse(url=request.url_for("member_page"), status_code=303)
                else:
                    url_for = request.url_for("error_page")
                    query_params = urllib.parse.urlencode({"message": "帳號或密碼輸入錯誤"})
                    return RedirectResponse(url=f"{url_for}?{query_params}", status_code=303)
    except Exception as e:
        print(f"==== 發生Error ====: {e}")


@app.get("/error")
def error_page(request:Request, message:str):    #このmessageはsignup,signinエンドポイントで送信(redirect)される.../error?message=queryPを受信, messageをqueryに含めてredirectしている
    return templates.TemplateResponse("error.html", {"request":request, "message": message })


@app.get("/member")
def member_page(request:Request):
    try:
        with connect_db() as mydb:
            with mydb.cursor() as cursor:
                if "NAME" in request.session:
                    sessionName = request.session.get("NAME")
                    cursor.execute("SELECT member.name, message.id, message.content, message.time FROM member INNER JOIN message ON member.id = message.member_id ORDER BY time DESC")
                    members = cursor.fetchall()
                    return templates.TemplateResponse("member.html", {"request": request, "sessionName": sessionName, "members": members})
                else:
                    return RedirectResponse(url=request.url_for("home_page"))
    except Exception as e:
        print(f"==== 發生Error ====: {e}")


@app.get("/signout")
def signout(request:Request):
    remove_sessions = ["MEMBER_ID", "NAME", "USERNAME"]
    for remove_session in remove_sessions:
        request.session.pop(remove_session, None)   #popメソッドはsession Keyが存在しない場合エラーを出す。エラーを発生させずに処理する為にNoneを指定
    return RedirectResponse(url=request.url_for("home_page"))


@app.post("/createMessage")
def createmsg(request:Request, content:str=Form(...)):
    with connect_db() as mydb:
        with mydb.cursor() as cursor:
            try:
                member_id = request.session.get("MEMBER_ID")
                cursor.execute("INSERT INTO message(member_id, content) VALUES(%s, %s)", (member_id, content))
                mydb.commit()
                return RedirectResponse(url=request.url_for("member_page"), status_code=303)
            except Exception as e:
                mydb.rollback()
                print(f"==== 發生Error ====: {e}")


@app.post("/deleteMessage")
def deletemsg(request:Request, id_message:str=Form(..., alias="id-message")):
    with connect_db() as mydb:
        with mydb.cursor() as cursor:
            try:
                member_id = request.session.get("MEMBER_ID")
                cursor.execute("DELETE FROM message WHERE id = %s AND member_id = %s", (id_message, member_id))    #只讓登入者刪除
                mydb.commit()
                return RedirectResponse(url=request.url_for("member_page"), status_code=303)
            except Exception as e:
                mydb.rollback()
                print(f"==== 發生Error ====: {e}")


@app.get("/api/check-username")
async def check_username(username:str):    #このusernameはjsのfetchから送信される.../check-username?username=queryPを受信
    try:
        with connect_db() as mydb:
            with mydb.cursor() as cursor:
                cursor.execute("SELECT * FROM member WHERE BINARY username = %s", (username,))
                username_exists = cursor.fetchone()
                if username_exists:
                    return {"exists": True}
                else:
                    return {"exists": False}
    except Exception as e:
        print(f"==== 發生Error ====: {e}")