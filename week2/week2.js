// Task1
function findAndPrint(messages, currentStation){
    // ↓ ↓ ↓ ↓ ↓ 以下是我寫的Code ↓ ↓ ↓ ↓ ↓ 
    const propArray = Object.keys(messages);
    if (currentStation === "Wanlong") {
        console.log(propArray[1]);
    } else if (currentStation === "Songshan") {
        console.log(propArray[2]);
    } else if (currentStation === "Qizhang") {
        console.log(propArray[3]);
    } else if (currentStation === "Ximen") {
        console.log(propArray[0]);
    } else if (currentStation === "Xindian City Hall") {
        console.log(propArray[4]);
    } else {
        console.log("No Data")
    }
    // ↑ ↑ ↑ ↑ ↑以上是我寫的Code↑ ↑ ↑ ↑ ↑
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
function book(consultants, hour, duration, criteria){
    // your code here
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
      const result = [];
    //   for (const eachData of data) {
    //         const middleNum = Math.trunc(eachData.length / 2);
    //         const middleStr = eachData.charAt(middleNum);
    //         middleStrSum += middleStr;

        for (let i = 0; i < data.length; i++) {
            const middleNum = Math.trunc(data[i].length / 2);
            const middleStr = data[i].charAt(middleNum);
            result.push(middleStr);
        }
        const abc = result.filter(res => result.indexOf(res) === result.lastIndexOf(res));
        const bdf = abc.toString();
        let index ="";
        for (let i = 0; i < data.length; i++) {
            index = data[0].indexOf(bdf);
        }
        console.log(data[index]);
    }

    func("彭大牆", "陳王明雅", "吳明"); // print 彭大牆
    func("郭靜雅", "王立強", "郭林靜宜", "郭立恆", "林花花"); // print 林花花
    func("郭宣雅", "林靜宜", "郭宣恆", "林靜花"); // print 沒有
    func("郭宣雅", "夏曼藍波安", "郭宣恆"); // print 夏曼藍波安


// 重複の有り無しが混ざった要素の中で、全ての重複を無くす方法
//     let ab = arr.filter((item, index) => arr.indexOf(item) === index);
//     let ac = Array.from(new Set(arr));

// 重複の有り無しが混ざった要素の中で、重複の無い要素を取得する方法
//     const ad = arr.filter(x => arr.indexOf(x) === arr.lastIndexOf(x))

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


