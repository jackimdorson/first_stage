from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, field_validator
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import re
from fastapi.middleware.cors import CORSMiddleware  # CORSの設定

from mysql.connector import pooling, Error   # Connection Poolの設定

app = FastAPI()
#ブラウザにhtmlを表示する方法その1：　jinja2を使わずに、staticを使い、FileResponseで表示する方法
app.mount("/static", StaticFiles(directory="static"), name="static")
#StaticFilesでマウントしたディレクトリがルートディレクトリとして扱われる。ファイルへの直接アクセスが可能になるため、ファイルの読み込みが高速化される。
# rootディレクトリがstaticとなる事に注意。この中にあるfileの呼び出し時は絶対pathになる為『/static』で始めることに注意。
# jsやcssの読み込みは同じstatic階層に有っても、src="./app.js"とはできず、 src="../static/app.js"となる。
# app.mount("/", StaticFiles(directory="static"), name="static")  #ルートパス("/")にStaticFilesをマウントすると、FastAPIのAPIエンドポイントとの競合が発生する可能性がある為避ける。

origins = [    # CORSの設定、許可するオリジンを指定
    "http://google.com",
]

# CORSミドルウェアの設定 localからlocalの接続は防げない。
app.add_middleware(   #FastAPIにmiddlewareを追加するためのメソッドを呼出
    CORSMiddleware,   #使用するミドルウェアのクラスを指定
    allow_origins=origins,   #CORSリクエストを許可するオリジン（ドメイン）のリストを指定(上で記述したもの)
    allow_credentials=True,  #（認証情報）を含むリクエストを許可するかどうかを指定します。Trueに設定すると、クッキーや認証ヘッダーを含むリクエストが許可
    allow_methods=["*"],     #HTTPメソッドのリストを指定します。["*"]を使用すると、全ての標準的なHTTPメソッド（GET、POST、PUT、DELETEなど）が許可
    allow_headers=["*"],     #HTTPリクエストヘッダーのリストを指定します。["*"]を使用すると、全てのヘッダーが許可されます。
)

 # Connection Poolの設定　dbconfigは、データベース接続の設定を含む辞書
dbconfig = {
    "user": "your_username",
    "password": "your_password",
    "host": "127.0.0.1",
    "database": "your_database"
}

try:
    connection_pool = pooling.MySQLConnectionPool(
        pool_name="mypool",
        pool_size=10,  # プールの最小接続数
        pool_reset_session=True, #接続がプールに返却されるたびにセッションがリセットされ、次の利用時にクリーンな状態で使用可能に
        **dbconfig
    )
except Error as e:
    print(f"Error creating connection pool: {e}")

@app.get("/api/data")
async def get_data():
    try:
        # プールから接続を取得
        connection = connection_pool.get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM your_table")
        result = cursor.fetchall()
        cursor.close()
        connection.close()
        return result
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))

 # Connection Poolの設定　終了




@app.get("/")
async def home_page():
    return FileResponse("static/index.html")

#ブラウザにhtmlを表示する方法その2：　jinja2やstaticを使わずに、HTMLResponseで表示する方法
# from fastapi.responses import HTMLResponse

# @app.get("/")
# async def home_page():
#     with open("index.html", "r") as file:
#         html_content = file.read()
#     return HTMLResponse(content=html_content)

class ValidationRequest(BaseModel):   #PydanticのBaseModelは、データのバリデーションと変換を行うためのクラス
    password: str
    # name: str
    # email: str
    @field_validator('password')    #fieldに対して使う組み込みデコレータ。varidationメソッドの上に記述することで、varidationを行う。
    @classmethod      #varidationメソッドをクラスレベルで呼び出す事で、classの他のメソッドや属性にアクセス可能に。
    def validate_password(cls, v):       #clsはクラス、vは検証対象の値。
        regex = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%])[A-Za-z\d@#$%]{4,8}$')        #A23@
        if not regex.match(v):
            raise ValueError('密碼得4-8個字, 並包含最少各1個文字, 數字以及@#$%特殊符號')
        return v

    # @field_validator('name')
    # @classmethod
    # def validate_alphabetic(cls, v: str) -> str:
    #     if not v.isalpha():
    #         raise ValueError("Name must contain only alphabetic characters")
    #     return v

@app.post("/api/validate-password")  #パスにPOSTリクエストを送信すると、validate_password関数が呼び出される。
async def validate_password(request: ValidationRequest):
    try:
        password_request = ValidationRequest(password = request.password)
        return {"message": password_request}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/data")
async def get_data():
    return {"message": "This is a CORS-enabled response"}




#  xss
@app.post("/api/xss")
async def get_xss(request: Request):
    body = await request.json()
    print(body)
    return body