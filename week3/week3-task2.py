import urllib.request as req

def getData(src_ptt_json):
    # src_ptt_json ="https://www.ptt.cc/bbs/Lottery/index.html"

    # 建立一個Request物件, 附加Headers訊息
    request = req.Request(src_ptt_json, headers={
        "cookie": "over18=1",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    })
    with req.urlopen(request) as res_ptt_json:
        read_ptt_json = res_ptt_json.read().decode("utf-8")

    import bs4
    root = bs4.BeautifulSoup(read_ptt_json, "html.parser")
    titles = root.find_all("div", class_="title")
    for title in titles:
        if title.a:
            print(title.a.string)
        else:
            print(title.string)
    nextLink=root.find("a", string="‹ 上頁")
    return nextLink["href"]


url = "https://www.ptt.cc/bbs/Gossiping/index.html"

count = 0
while count<3:
    url = "https://www.ptt.cc"+getData(url)
    count +=1



