// Task1
function findAndPrint(messages, currentStation){
    const greenLine = ["Songshan", "NanjingSanmin", "Taipei Arena", "Nanjing Fuxing", "Songjiang Nanjing", "Zhongshan", "Beimen", "Ximen", "Xiaonanmen", "Chiang Kai-Shek Memorial Hall", "Guting", "Taipower Building", "Gongguan", "Wanlong", "Jingmei", "Dapinglin", "Qizhang", "Xiaobitan", "Qizhang", "Xindian City Hall", "Xindian"]
        // [2, "Songshan"], [4, "NanjingSanmin"], [6, "Taipei Arena"], [8, "Nanjing Fuxing"], [10, "Songjiang Nanjing"],
        // [12, "Zhongshan"], [14, "Beimen"], [16, "Ximen"], [18, "Xiaonanmen"], [20, "Chiang Kai-Shek Memorial Hall"],
        // [22, "Guting"], [24, "Taipower Building"], [26, "Gongguan"], [28, "Wanlong"], [30, "Jingmei"],
        // [32, "Dapinglin"], [34, "Qizhang"], [35, "Xiaobitan"], [36, "Xindian City Hall"], [38, "Xindian"]
    const text = Object.values(messages);

    let  messageSpotArr= [];
    for (let i = 0; i < text.length; i ++) {
        let friend = greenLine.findIndex(function(station){
            return text[i].includes(station);
        });
        messageSpotArr.push(friend);
    }

    const currentSpot = greenLine.findIndex(function(station){
        return currentStation.includes(station)
    })

    // distance與messageSpotArr排列順序相同
    let distance = [];
    for (let i = 0; i < messageSpotArr.length; i ++) {
        const decrease = messageSpotArr[i] - currentSpot
        const printSpot = Math.abs(decrease);
        distance.push(printSpot);
    }

    const sortedDis = distance.toSorted((m, n) => m - n );
    const indexNum = distance.indexOf(sortedDis[0])
    const finished = Object.keys(messages)[indexNum];
    console.log(finished)

    }
    const messages={
    "Bob":"I'm at Ximen MRT station.",
    "Mary":"I have a drink near Jingmei MRT station.",
    "Copper":"I just saw a concert at Taipei Arena.",
    "Leslie":"I'm at home near Xiaobitan station.",
    "Vivian":"I'm at Xindian station waiting for you."
    };
    findAndPrint(messages, "Wanlong"); // print Mary
    findAndPrint(messages, "Songshan"); // print Copper
    findAndPrint(messages, "Qizhang"); // print Leslie
    findAndPrint(messages, "Ximen"); // print Bob
    findAndPrint(messages, "Xindian City Hall"); // print Vivian


// Task2

// your code here, maybe
let aDay = [];
for (let i = 1; i <= 24; i++) {
    aDay.push(i);
}
let finishedConsul = [];
for (let i = 0; i < 3; i ++) {
    finishedConsul.push([...aDay]);
}

function book(consultants, hour, duration, criteria){

    const originalConsul = [...consultants];
    // ↓ ↓ ↓ ↓ ↓ 　設定『時間』property　↓ ↓ ↓ ↓ ↓
    for (let i = 0; i < originalConsul.length; i ++) {
        originalConsul[i]["time"] = finishedConsul[i];
    }
    // ↓ ↓ ↓ ↓ ↓ 　需要的總時間　↓ ↓ ↓ ↓ ↓
    const endTime = hour + duration -1;
    const needTime = [];
    for (let i = hour; i <= endTime; i++) {
        needTime.push(i);
    }

    if (criteria === "price") {
        const sortedConsul = originalConsul.toSorted((m, n) => m.price - n.price);
        // ↓ ↓ ↓ ↓ ↓ 　check能否預約　↓ ↓ ↓ ↓ ↓
        const hasTime = function(index) {
            return needTime.every(neTime => sortedConsul[index].time.includes(neTime));
        }
        // ↓ ↓ ↓ ↓ ↓ 　能預約 -> 刪除時間　↓ ↓ ↓ ↓ ↓
        const finishedConsulFunc = function(index) {
            sortedConsul[index].time.splice(hour-1, duration);
        }
        if (hasTime(0)) {
            finishedConsulFunc(0);
            console.log(sortedConsul[0].name);
        } else if (hasTime(1)) {
            finishedConsulFunc(1);
            console.log(sortedConsul[1].name);
        } else if (hasTime(2)) {
            finishedConsulFunc(2);
            console.log(sortedConsul[2].name);
        } else {
            console.log("No Service");
        }
    } else {
        const sortedConsul2 = originalConsul.toSorted((m, n) => n.rate - m.rate);
        const hasTime2 = function(index) {
            return needTime.every(neTime => sortedConsul2[index].time.includes(neTime));
        }
        const finishedConsulFunc2 = function(index) {
            sortedConsul2[index].time.splice(hour-1, duration);
        }
        if (hasTime2(0)) {
            finishedConsulFunc2(0);
            console.log(sortedConsul2[0].name);
        } else if (hasTime2(1)) {
            finishedConsulFunc2(1);
            console.log(sortedConsul2[1].name);
        } else if (hasTime2(2)) {
            finishedConsulFunc2(2);
            console.log(sortedConsul2[2].name);
        } else {
            console.log("No Service");
        }
    }
}
    const consultants=[
    {"name":"John", "rate":4.5, "price":1000},
    {"name":"Bob", "rate":3, "price":1200},
    {"name":"Jenny", "rate":3.8, "price":800}
    ];
    book(consultants, 15, 1, "price"); // Jenny
    book(consultants, 11, 2, "price"); // Jenny
    book(consultants, 10, 2, "price"); // John
    book(consultants, 20, 2, "rate"); // John
    book(consultants, 11, 1, "rate"); // Bob
    book(consultants, 11, 2, "rate"); // No Service
    book(consultants, 14, 3, "price"); // John



// Task3

function func(...data){
    // your code here
    const fullName = Array.from(data);
    const middleChar = fullName.map(function(name){
        const order = Number.parseInt(name.length / 2);
        const char = name[order]
        return char;
    })
    const uniqChar = middleChar.filter(char => middleChar.indexOf(char) === middleChar.lastIndexOf(char));
    const result = fullName.find(word => word.includes(uniqChar));
    if (uniqChar.length === 0) {
        console.log("沒有")
    } else {
        console.log(result)
    }
}
    func("彭大牆", "陳王明雅", "吳明"); // print 彭大牆
    func("郭靜雅", "王立強", "郭林靜宜", "郭立恆", "林花花"); // print 林花花
    func("郭宣雅", "林靜宜", "郭宣恆", "林靜花"); // print 沒有
    func("郭宣雅", "夏曼藍波安", "郭宣恆"); // print 夏曼藍波安


// Task4

function getNumber(index){
    // your code here
    let arr = [0];
    let currentNum = 0;
    for(let i = 1; i <= index; i++) {
        if (i % 3 === 0 ) {
            currentNum -= 1;
        } else {
            currentNum += 4;
        }
        arr.push(currentNum);
    }
    console.log(arr[index]);

 }
    getNumber(1); // print 4
    getNumber(5); // print 15
    getNumber(10); // print 25
    getNumber(30); // print 70



// Task5

function find(spaces, stat, n){
    // your code here
    }
    find([3, 1, 5, 4, 3, 2], [0, 1, 0, 1, 1, 1], 2); // print 5
    find([1, 0, 5, 1, 3], [0, 1, 0, 1, 1], 4); // print -1
    find([4, 6, 5, 8], [0, 1, 1, 1], 4); // print 2


