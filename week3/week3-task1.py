import urllib.request as request
import json
import re
# 取得spot.json資料
src_spot_json="https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-1"
with request.urlopen(src_spot_json) as res_spot_json:
    load_spot_json = json.load(res_spot_json)
results_spot_json = load_spot_json["data"]["results"]

# 取得mrt.json資料
src_mrt_json="https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-2"
with request.urlopen(src_mrt_json) as res_mrt_json:
    load_mrt_json = json.load(res_mrt_json)
data_mrt_json = load_mrt_json["data"]

# 製做 key="SERIAL_NO" 的dict
mix_dict = {}
mrt_dict = {}
for data_mrt_elem in data_mrt_json:
    mix_dict[data_mrt_elem["SERIAL_NO"]] = {        # { SERIAL_NO: { address:..., MRT:... }  } 狀態
        "address": data_mrt_elem["address"],
        "MRT": data_mrt_elem["MRT"]
    }
    mrt_dict[data_mrt_elem["MRT"]] = []

# 製做 key="MRT" 的dict
for results_spot_elem in results_spot_json:
    id = results_spot_elem["SERIAL_NO"]
    if id in mix_dict:
        mix_dict_mrt = mix_dict[results_spot_elem["SERIAL_NO"]]["MRT"]    # { MRT: [士林, 劍潭, 北投] } 狀態

        if mix_dict_mrt in mrt_dict:
            mrt_list = mrt_dict[f"{mix_dict_mrt}"]
            mrt_list.append(results_spot_elem["stitle"])


# 輸出csv
with open("spot.csv", "w", encoding="utf-8") as spot_csv:
    for results_spot_elem in results_spot_json:
        filelist_str = results_spot_elem["filelist"]    # print(type(results_spot_elem["filelist"]))
        filelist_ls = re.findall(r'https://.*?(?=https://|$)', filelist_str)  # https://から次のhttps://が出現するまでの文字列を取得
        id = results_spot_elem["SERIAL_NO"]
        if id in mix_dict:
            spot_csv.write(f"{results_spot_elem["stitle"]},"
                        f"{mix_dict[id]["address"][5:8]},"
                        f"{results_spot_elem["longitude"]},"
                        f"{results_spot_elem["latitude"]},"
                        f"{filelist_ls[0]}\n")


with open("mrt.csv", "w", encoding="utf-8") as mrt_csv:
    for data_mrt_elem in data_mrt_json:
        mrt = data_mrt_elem["MRT"]
        if mrt in mrt_dict:
            mrt_csv.write(f"{mrt},"
                          f"{','.join(mrt_dict[mrt])}\n")