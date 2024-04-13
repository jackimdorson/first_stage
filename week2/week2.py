# Task1

def find_and_print(messages, current_station):
    station_strls = ["Songshan", "NanjingSanmin", "Taipei Arena", "Nanjing Fuxing", "Songjiang Nanjing", "Zhongshan", "Beimen", "Ximen", "Xiaonanmen", "Chiang Kai-Shek Memorial Hall", "Guting", "Taipower Building", "Gongguan", "Wanlong", "Jingmei", "Dapinglin", "Qizhang", "Xiaobitan", "Qizhang", "Xindian City Hall", "Xindian"]
    msvalue_strls = list(messages.values())
    def find_stnidx_rt_num(arg_str):
        return next((stn_idx_int for stn_idx_int, station_str in enumerate(station_strls) if station_str in arg_str), None)
    msvalue_idx_intls = list(map(find_stnidx_rt_num, msvalue_strls))
    current_stnidx_int = find_stnidx_rt_num(current_station)
    gap_idx_intls = [abs(msvalue_idx_int - current_stnidx_int) for msvalue_idx_int in msvalue_idx_intls]
    name_idx_int = gap_idx_intls.index(sorted(gap_idx_intls)[0])
    return print(list(messages.keys())[name_idx_int])

messages={
"Leslie":"I'm at home near Xiaobitan station.",
"Bob":"I'm at Ximen MRT station.",
"Mary":"I have a drink near Jingmei MRT station.",
"Copper":"I just saw a concert at Taipei Arena.",
"Vivian":"I'm at Xindian station waiting for you."
}
find_and_print(messages, "Wanlong") # print Mary
find_and_print(messages, "Songshan") # print Copper
find_and_print(messages, "Qizhang") # print Leslie
find_and_print(messages, "Ximen") # print Bob
find_and_print(messages, "Xindian City Hall") # print Vivian


# Task2

consul_objls = []
# your code here, maybe
def book(consultants, hour, duration, criteria):

    def make_day_rt_objls ():
        aday_intls = []
        i = 1
        while (i <= 24):
            aday_intls.append(i)
            i += 1
        day_objls = [{"name": consultant["name"], "rate": consultant["rate"], "price": consultant["price"], "time": aday_intls.copy()} for consultant in consultants]
        i = 0
        while (i < len(day_objls)):
            consul_objls.append(day_objls[i])
            i += 1

    if (len(consul_objls) == 0):
        make_day_rt_objls()

    def make_needtime_rt_intls():
        end_time_int = hour + duration -1
        need_time_intls = []
        i = hour
        while (i <= end_time_int):
            need_time_intls.append(i)
            i += 1
        return need_time_intls

    def common_rt_non(sort_objls):
        def has_time_rt_bool(idx_int):
            return all(time_int in sort_objls[idx_int]["time"] for time_int in make_needtime_rt_intls())

        def booked_rt_objls(idx_int):

            del sort_objls[idx_int]["time"][hour-1:hour-1+duration]

        if (has_time_rt_bool(0)):
            booked_rt_objls(0)
            print(sort_objls[0]["name"])

        elif (has_time_rt_bool(1)):
            booked_rt_objls(1)
            print(sort_objls[1]["name"])

        elif (has_time_rt_bool(2)):
            booked_rt_objls(2)
            print(sort_objls[2]["name"])
        else:
            print("No Service")

    if (criteria == "price"):
        price_sort_objls = sorted(consul_objls, key=lambda x: x["price"])
        common_rt_non(price_sort_objls)
    else:
        rate_sort_objls = sorted(consul_objls, key=lambda x: x["rate"], reverse=True)
        common_rt_non(rate_sort_objls)

consultants=[
{"name":"John", "rate":4.5, "price":1000},
{"name":"Bob", "rate":3, "price":1200},
{"name":"Jenny", "rate":3.8, "price":800}
]
book(consultants, 15, 1, "price") # Jenny
book(consultants, 11, 2, "price") # Jenny
book(consultants, 10, 2, "price") # John
book(consultants, 20, 2, "rate") # John
book(consultants, 11, 1, "rate") # Bob
book(consultants, 11, 2, "rate") # No Service
book(consultants, 14, 3, "price") # John


# Task3

def func(*data):
    data_strls = list(data)
    data_elm_strls = [data_str[len(data_str) // 2] for data_str in data_strls]
    uniq_strls = [data_elm_str for data_elm_str in data_elm_strls if data_elm_strls.count(data_elm_str) == 1]
    uniq_dt_str = next((data_str for data_str in data_strls if ''.join(uniq_strls) in data_str), None)
    if len(uniq_strls) == 0:
        return print("沒有")
    else:
        return print(uniq_dt_str)

# your code here
func("彭大牆", "陳王明雅", "吳明") # print 彭大牆
func("郭靜雅", "王立強", "郭林靜宜", "郭立恆", "林花花") # print 林花花
func("郭宣雅", "林靜宜", "郭宣恆", "林靜花") # print 沒有
func("郭宣雅", "夏曼藍波安", "郭宣恆") # print 夏曼藍波安


# Task4

def get_number(index):
# your code here
    ls_intls = [0]
    ls_int = 0
    i = 1
    while (i <= index):
        if (i % 3 == 0):
            ls_int -= 1
        else:
            ls_int += 4
        ls_intls.append(ls_int)
        i += 1
    return print(ls_intls[index])
get_number(1) # print 4
get_number(5) # print 15
get_number(10) # print 25
get_number(30) # print 70


# Task5

def find(spaces, stat, n):
    pass
# your code here
find([3, 1, 5, 4, 3, 2], [0, 1, 0, 1, 1, 1], 2) # print 5
find([1, 0, 5, 1, 3], [0, 1, 0, 1, 1], 4) # print -1
find([4, 6, 5, 8], [0, 1, 1, 1], 4) # print 2