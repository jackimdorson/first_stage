import urllib.request as urllib
import bs4

data_ls = []
def getData(src):

    request = urllib.Request(src, headers={
        "cookie": "over18=1",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    })
    with urllib.urlopen(request) as open_ptt_html:
        read_ptt_html = open_ptt_html.read().decode("utf-8")

        root = bs4.BeautifulSoup(read_ptt_html, "html.parser")
        rents = root.find_all("div", class_="r-ent")
        for rent in rents:
            has_a = rent.select_one(".title > a")
            has_span = rent.select_one(".nrec > span")
            if has_a:
                data_ls.append(has_a.string)
                if has_span:
                    data_ls.append(has_span.string)
                else:
                    data_ls.append(0)
                gethref = has_a.get("href")
                href = "https://www.ptt.cc"+gethref
                href_req = urllib.Request(href, headers={
                    "cookie": "over18=1",
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
                })
                with urllib.urlopen(href_req) as open_click_html:
                    read_click_html = open_click_html.read().decode("utf-8")

                    root2 = bs4.BeautifulSoup(read_click_html, "html.parser")
                    times = root2.select_one("#main-content div:nth-of-type(4) > .article-meta-value")
                    if times:
                        data_ls.append(times.get_text())
                    else:
                        data_ls.append("")

    nextLink=root.find("a", string="‹ 上頁")
    return nextLink["href"]


src = "https://www.ptt.cc/bbs/Lottery/index.html"
count = 0
while count < 3:
    src = "https://www.ptt.cc" + getData(src)
    count += 1


with open("article.csv", "w", encoding="utf-8") as article_csv:
    i = 1
    for data in data_ls:
        if i%3 == 0:
            article_csv.write(f"{str(data)}\n")
        else:
            article_csv.write(f"{str(data)},")
        i += 1
