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
import logging

load_dotenv()
def connect_db():   #I/O型の処理 → asyncだが、mysql.connectorは非同期未対応の為 → def
    return mysql.connector.connect(       #mysqlへのアクセス
        host = os.getenv("DB_HOST"),
        user = os.getenv("DB_USER"),
        password = os.getenv("DB_PASSWORD"),
        database = os.getenv("DB_NAME")
    )

# ロガーの作成
logger = logging.getLogger('my_logger')
logger.setLevel(logging.DEBUG)  # ログレベルを設定, DEBUGレベル以上の全てのログメッセージが記録される

# フォーマッターの作成(logメッセージのフォーマットasctime=TimeStamp, name=LoggerName, levelname=LogLevel)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# コンソールハンドラーの作成
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)  # コンソールのログレベルを設定
console_handler.setFormatter(formatter)  # フォーマッターを設定

# ファイルハンドラーの作成
file_handler = logging.FileHandler('app.log')
file_handler.setLevel(logging.DEBUG)  # ファイルのログレベルを設定
file_handler.setFormatter(formatter)  # フォーマッターを設定

# ロガーにハンドラーを追加
logger.addHandler(console_handler)
logger.addHandler(file_handler)

#ログメッセージの出力　　# logger.debug('詳細なデバッグ情報')　　　# logger.info('一般的な情報')
# logger.warning('警告メッセージ')　　# logger.error('エラーメッセージ　')　　# logger.critical('重大なエラーメッセージ　')

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY"))
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")
#CPU型の処理 → def カスタムフィルタの定義  datetime.datetimeは『型ヒント』 -> str:は戻り値の『型ヒント』
def format_datetime(value: datetime.datetime, fmt: str) -> str:
    return value.strftime(fmt)
templates.env.filters["format_datetime"] = format_datetime # カスタムフィルタをテンプレートエンジンに登録

def redirect_error_logger(request, exception):
    logger.error(exception)
    url_for = request.url_for("error_page")
    query_params = urllib.parse.urlencode({"message": str("系統出了問題, 請聯絡我們")})
    return RedirectResponse(url=f"{url_for}?{query_params}", status_code=303)

def has_not_session_redirect_home(request):
    if not request.session:
        return RedirectResponse(url=request.url_for("home_page"))


@app.get("/")     #template,response生成＝I/O型の処理 → async    TemplateResponse, HTMLResponseは自動的に Content-Type を text/html; charset=utf-8 に設定。よってresponse_class=HTMLResponseの記述は不要
async def home_page(request:Request):
    return templates.TemplateResponse("index.html", {"request":request})


@app.post("/signup")
async def signup(request:Request, name:str=Form(...), username:str=Form(...), psw:str=Form(...)):
    try:
        with connect_db() as mydb:   #withの記述法では、エラーハンドリングで例外が生じても、自動でcloseされる。
            with mydb.cursor() as cursor:                            #SQL指令する為のcursorObjを作成(db操作が必要な度に呼び出し)
                try:
                    cursor.execute("SELECT username FROM member WHERE BINARY username = %s", (username,))
                    username_exists = cursor.fetchone()
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
                    return redirect_error_logger(request, f"===SQL發生Error==={e}")
    except Exception as e:
        return redirect_error_logger(request, f"===DB或Cursor發生Error==={e}")


@app.post("/signin")
async def signin(request:Request, username:str=Form(...), psw:str=Form(...)):
    try:
        with connect_db() as mydb:
            with mydb.cursor() as cursor:
                try:
                    cursor.execute("SELECT id, name, username FROM member WHERE BINARY username = %s AND BINARY password = %s", (username, psw))
                    signin_exists = cursor.fetchone()
                    if signin_exists:
                        for index, value in enumerate(["MEMBER_ID", "NAME", "USERNAME"]):
                            request.session[value] = signin_exists[index]
                        return RedirectResponse(url=request.url_for("member_page"), status_code=303)
                    else:
                        url_for = request.url_for("error_page")
                        query_params = urllib.parse.urlencode({"message": "帳號或密碼輸入錯誤"})
                        return RedirectResponse(url=f"{url_for}?{query_params}", status_code=303)
                except Exception as e:
                    return redirect_error_logger(request, f"===SQL發生Error==={e}")
    except Exception as e:
        return redirect_error_logger(request, f"===DB或Cursor發生Error==={e}")


@app.get("/error")
async def error_page(request:Request, message:str):    #このmessageはsignup,signinエンドポイントで送信(redirect)される.../error?message=queryPを受信, messageをqueryに含めてredirectしている
    return templates.TemplateResponse("error.html", {"request":request, "message": message })


@app.get("/member")
async def member_page(request:Request):
    has_not_session_redirect_home(request)
    try:
        with connect_db() as mydb:
            with mydb.cursor() as cursor:
                try:
                    sessionName = request.session.get("NAME")
                    cursor.execute("SELECT member.name, message.id, message.content, message.time FROM member INNER JOIN message ON member.id = message.member_id ORDER BY time DESC")
                    members = cursor.fetchall()
                    return templates.TemplateResponse("member.html", {"request": request, "sessionName": sessionName, "members": members})
                except Exception as e:
                    return redirect_error_logger(request, f"===SQL發生Error==={e}")
    except Exception as e:
        return redirect_error_logger(request, f"===DB或Cursor發生Error==={e}")


@app.get("/signout")      #session操作,redirect生成＝I/O型の処理 → async
async def signout(request:Request):
    request.session.clear()
    return RedirectResponse(url=request.url_for("home_page"))


@app.post("/createMessage")
async def createmsg(request:Request, content:str=Form(...)):
    has_not_session_redirect_home(request)
    try:
        with connect_db() as mydb:
            with mydb.cursor() as cursor:
                try:
                    member_id = request.session.get("MEMBER_ID")
                    cursor.execute("INSERT INTO message(member_id, content) VALUES(%s, %s)", (member_id, content))
                    mydb.commit()
                    return RedirectResponse(url=request.url_for("member_page"), status_code=303)
                except Exception as e:
                    mydb.rollback()
                    return redirect_error_logger(request, f"===SQL發生Error==={e}")
    except Exception as e:
        return redirect_error_logger(request, f"===DB或Cursor發生Error==={e}")


@app.post("/deleteMessage")
async def deletemsg(request:Request, id_msg:str=Form(..., alias="id-msg")):
    has_not_session_redirect_home(request)
    try:
        with connect_db() as mydb:
            with mydb.cursor() as cursor:
                try:
                    member_id = request.session.get("MEMBER_ID")
                    cursor.execute("DELETE FROM message WHERE id = %s AND member_id = %s", (id_msg, member_id))    #只讓登入者刪除
                    mydb.commit()
                    return RedirectResponse(url=request.url_for("member_page"), status_code=303)
                except Exception as e:
                    mydb.rollback()
                    return redirect_error_logger(request, f"===SQL發生Error==={e}")
    except Exception as e:
        return redirect_error_logger(request, f"===DB或Cursor發生Error==={e}")





@app.get("/api/check-username")
async def check_username(request:Request, username:str):    #このusernameはjsのfetchから送信される.../check-username?username=queryPを受信
    has_not_session_redirect_home(request)
    try:
        with connect_db() as mydb:
            with mydb.cursor() as cursor:
                try:
                    cursor.execute("SELECT * FROM member WHERE BINARY username = %s", (username,))
                    username_exists = cursor.fetchone()
                    if username_exists:
                        return {"exists": True}
                    else:
                        return {"exists": False}
                except Exception as e:
                    return redirect_error_logger(request, f"===SQL發生Error==={e}")
    except Exception as e:
        return redirect_error_logger(request, f"===DB或Cursor發生Error==={e}")



@app.get("/api/member")
async def search_username(request:Request, username:str):
    if not request.session:                                 #不存在 → return Non
        return {"data": None}
    try:
        with connect_db() as mydb:
            with mydb.cursor() as cursor:
                try:
                    cursor.execute("SELECT id, name, username FROM member WHERE BINARY username = %s", (username,))
                    username_exists = cursor.fetchone()         #不存在 → return None
                    if not username_exists:
                        return {"data": None}
                    return {
                        "data":{
                            "id": username_exists[0],
                            "name": username_exists[1],
                            "username": username_exists[2]
                        }
                    }
                except Exception as e:
                    return redirect_error_logger(request, f"===SQL發生Error==={e}")
    except Exception as e:
        return redirect_error_logger(request, f"===DB或Cursor發生Error==={e}")




@app.patch("/api/member")
async def update_username(request:Request):
    if not request.session:                                 #不存在 → return Non
        return  { "error": True }
    try:
        with connect_db() as mydb:
            with mydb.cursor() as cursor:
                try:
                    jsonData = await request.json()             #jsonに変換
                    name = jsonData["name"]
                    print(name)
                    print("==1==")
                    sessionName = request.session.get("NAME")
                    cursor.execute("UPDATE member SET name = %s WHERE name = %s", (name, sessionName))
                    cursor.execute("SELECT name FROM member WHERE BINARY name = %s", (name,))
                    username = cursor.fetchone()
                    request.session["NAME"] = username[0]
                    mydb.commit()
                    return  { "ok": True }
                except Exception as e:
                    mydb.rollback()
                    return  { "error": True }
                    return redirect_error_logger(request, f"===SQL發生Error==={e}")
    except Exception as e:
        return redirect_error_logger(request, f"===DB或Cursor發生Error==={e}")






import random
key = random.randint(1, 10)
print(str(key)+"が含まれるかcheck")

def binary_search(arr):
    left = 0;
    right = len(arr)
    while left < right:
        mid = (left + right) // 2
        if arr[mid] == key:
            return mid
        elif arr[mid] > key:
            right = mid
        else:
            left = mid + 1
        return None

s_list = [1, 2, 5, 8, 10]
print(binary_search(s_list))






class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self, root):
        self.root = Node(root)    #rootにインスタンスを作成

    def insert(self, key):
        node = self.root
        while True:
            if node.value > key:
                if node.left is None:
                    node.left = Node(key)
                    return
                node = node.left
            elif node.value <= key:
                if node.right is None:
                    node.right = Node(key)
                    return
                node = node.right

    def inorder(self, node):
        if node is None:
            return
        else:
            self.inorder(node.left)
            print(node.value)
            self.inorder(node.right)

    def search(self, key):
        node = self.root
        while True:
            if node.value == key:
                print("yes")
                return
            elif node.value > key:
                node = node.left
            else:
                node = node.right
            if node is None:
                print("no")
                return


t = BinarySearchTree(7)
t.insert(3)
t.insert(5)
t.inorder(t.root)