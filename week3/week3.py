# with open("data.txt", "w", encoding="utf-8") as file:
#     file.write('5\n3')

# sum=0
# with open("data.txt","r", encoding="utf-8") as file:
#     for line in file:
#         sum+=int(line)
#         print(sum)


# import json
# with open("config.json", mode="r") as file:
#     data=json.load(file)
# print("name", data["name"])


import urllib.request as request
import json
import re
# 取得spot.csv用的資料
src_spot_json="https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-1"

with request.urlopen(src_spot_json) as res_spot_json:
    load_spot_json = json.load(res_spot_json)

results_spot_json = load_spot_json["data"]["results"]
with open("spot.csv", "w", encoding="utf-8") as spot_csv:
    for results_spot_elem in results_spot_json:
        filelist_str = results_spot_elem["filelist"]    # print(type(results_spot_elem["filelist"]))
        filelist_ls = re.findall(r'https://.*?(?=https://|$)', filelist_str)  # https://から次のhttps://が出現するまでの文字列を取得
        print(filelist_ls[0])


        # spot_csv.write(f"${results_spot_elem['stitle']},${results_spot_elem['longitude']}, ${results_spot_elem['latitude']}, ${results_spot_elem['filelist']}"+'\n')



# 取得mrt.csv用的資料

src_mrt="https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-2"
