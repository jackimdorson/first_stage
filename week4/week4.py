from fastapi import FastAPI
app = FastAPI()
@app.get("/")
def index():
    total = 0
    i = 0
    while i<10:
        total += i
        i += 1
    return total

