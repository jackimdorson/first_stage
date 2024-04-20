import urllib.request as urllib
import json
import re
# 取得mrt.json資料
src_mrt_json="https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-2"
with urllib.urlopen(src_mrt_json) as get_src_mrt_json:
    mrt_dic = json.load(get_src_mrt_json)
data_mrt_objls = mrt_dic["data"]
# 取得spot.json資料
src_spot_json="https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-1"
with urllib.urlopen(src_spot_json) as get_src_spot_json:
    spot_dic = json.load(get_src_spot_json)
results_spot_objls = spot_dic["data"]["results"]

serial_dic = {}
mrt_dic = {}
for data_mrt_obj in data_mrt_objls:
    serial_dic[data_mrt_obj["SERIAL_NO"]] = {
        "address": data_mrt_obj["address"][5:8],
        "MRT": data_mrt_obj["MRT"]
    }
    mrt_dic[data_mrt_obj["MRT"]] = []
for results_spot_obj in results_spot_objls:
    serial_dict_mrt = serial_dic[results_spot_obj["SERIAL_NO"]]["MRT"]
    mrt_list = mrt_dic[serial_dict_mrt]
    mrt_list.append(results_spot_obj["stitle"])

# 輸出csv
with open("spot.csv", "w", encoding="utf-8") as spot_csv:
    for results_spot_obj in results_spot_objls:
        filelist_str = results_spot_obj["filelist"]
        filelist_ls = re.findall(r'https://.*?(?=https://|$)', filelist_str)     # https://から次のhttps://が出現するまでの文字列を取得
        id = results_spot_obj["SERIAL_NO"]
        spot_csv.write(f"{results_spot_obj["stitle"]},"
                       f"{serial_dic[id]["address"]},"
                       f"{results_spot_obj["longitude"]},"
                       f"{results_spot_obj["latitude"]},"
                       f"{filelist_ls[0]}\n")
with open("mrt.csv", "w", encoding="utf-8") as mrt_csv:
    for data_mrt_obj in data_mrt_objls:
        mrt = data_mrt_obj["MRT"]
        mrt_csv.write(f"{mrt},"
                      f"{','.join(mrt_dic[mrt])}\n")