import os                        #環境変数(.env)の読み込みに必要
from dotenv import load_dotenv   #環境変数(.env)の読み込みに必要
import mysql.connector           #mysqlとpyを紐付け

load_dotenv()                    #環境変数の読み込み
host = os.getenv("DB_HOST")
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")

mydb = mysql.connector.connect(   #mysqlへのアクセス
    host=host,
    user=user,
    password=password
)
print('資料庫連線成功')
print(mydb)

cursor = mydb.cursor()              #SQL指令する為のcursorObjを作成
cursor.execute("SHOW DATABASES")    #執行SQL指令

for x in cursor:
    print(x)

# mydb.commit()                     #これを記述することで、データベースにも反映される。


mydb.close()                       #關閉MySQL 同時接続の緩和＋リソースの解放