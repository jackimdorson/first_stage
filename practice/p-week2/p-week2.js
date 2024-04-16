// ↓  ↓  ↓  ↓ Week2 Memo ↓  ↓  ↓  ↓  ↓


// forの『記述場所』による挙動の違い => 結論：目的(何をし、何を出力したいのか)を明確にする。

// 1️⃣ sumの記述が無い場合 =>『したい事の不明確』が原因。
for (let i = 0; i <= 10; i++){
    i += i
    console.log(i)      // 0,2,6,14　＝>　意図しない挙動だがErrorが生じない（要注意）
}


// 2️⃣『forの中』に『sumとconsole.log』を記述している場合 => forの中の定義(let,const)はリセットされる。
for (let i = 0; i <= 10; i++){
    let sum = 0;
    sum += i
    console.log(sum)    // 0,1,2,3....10　＝>　意図しない挙動だがErrorが生じない（要注意）
}


// // 3️⃣『forの中』に『sum』を記述、『forの外』に『console.log』を記述している場合
// for (let i = 0; i <= 10; i++){
//     let sum = 0;
//     sum += i
// }
// console.log(sum)    // sum is not defined


// 4️⃣『forの外』に『sumとconsole.log』を記述している場合
let sum = 0;
for (let i = 0; i <= 10; i++){
    sum += i
}
console.log(sum)    // 55


console.time();
let sum3 = 0;
for (let i = 0; i <= 100000000; i++){
   sum3 += i
}
  console.log(sum3)
console.timeEnd();



// ↓  ↓  ↓  ↓ Week2 task ↓  ↓  ↓  ↓  ↓


"use strict";

// Task1
console.time();
function findAndPrint(messages, currentStation){
    const stationOfstrArr= ["Songshan", "NanjingSanmin", "Taipei Arena", "Nanjing Fuxing", "Songjiang Nanjing", "Zhongshan", "Beimen", "Ximen", "Xiaonanmen", "Chiang Kai-Shek Memorial Hall", "Guting", "Taipower Building", "Gongguan", "Wanlong", "Jingmei", "Dapinglin", "Qizhang", "Xiaobitan", "Qizhang", "Xindian City Hall", "Xindian"]
    const findStnIdxRtnum = function(argOfstr){
        return stationOfstrArr.findIndex(stationOfstr=>argOfstr.includes(stationOfstr));
    }

    const currentStnIdxOfnum = findStnIdxRtnum(currentStation);

    const msValueOfstrArr = Object.values(messages);
    const msValIdxOfnumArr = msValueOfstrArr.map(msValOfstr=>{
        return findStnIdxRtnum(msValOfstr);
    })

    const gapIdxOfnumArr = msValIdxOfnumArr.map(msValIdxOfnum=>{
        return Math.abs(msValIdxOfnum - currentStnIdxOfnum);
    })

    const nameIdxOfnum = gapIdxOfnumArr.indexOf(gapIdxOfnumArr.toSorted((m,n)=>m - n)[0]);
    return console.log(Object.keys(messages)[nameIdxOfnum]);
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
console.timeEnd();
console.log("--------task1--End----------");


// Task2

const consulOfobjArr = [];
// your code here, maybe
function book(consultants, hour, duration, criteria){

    const makeDayRtobjArr = function(){
        const aDayOfnumArr = [];
        for (let i = 1; i <= 24; i++) {
            aDayOfnumArr.push(i);
        }
        const dayOfobjArr = consultants.map(consultant => ({ ...consultant, time: [...aDayOfnumArr] }));
        consulOfobjArr.push(...dayOfobjArr);
    }
    if (consulOfobjArr.length === 0){
        makeDayRtobjArr();
    }

    const makeNeedTimeRtnumArr = function(){
        const endTimeOfnum = hour + duration -1;
        const needTimeOfnumArr = [];
        for (let i = hour; i <= endTimeOfnum; i++) {
            needTimeOfnumArr.push(i);
        }
        return needTimeOfnumArr;
    }

    function commonRtnon(sortOfobjArr) {
        const hasTimeRtbool = function(idxOfnum) {
            return makeNeedTimeRtnumArr().every(timeOfnum => sortOfobjArr[idxOfnum].time.includes(timeOfnum));
        }
        const bookedRtobjArr = function(idxOfnum) {
            sortOfobjArr[idxOfnum].time = sortOfobjArr[idxOfnum].time.toSpliced(hour-1, duration);
        }
        if (hasTimeRtbool(0)) {
            bookedRtobjArr(0);
            console.log(sortOfobjArr[0].name);
        } else if (hasTimeRtbool(1)) {
            bookedRtobjArr(1);
            console.log(sortOfobjArr[1].name);
        } else if (hasTimeRtbool(2)) {
            bookedRtobjArr(2);
            console.log(sortOfobjArr[2].name);
        } else {
            console.log("No Service");
        }
    }

    if (criteria === "price") {
        const priceSortOfobjArr = consulOfobjArr.toSorted((m, n) => m.price - n.price);
        commonRtnon(priceSortOfobjArr);
    } else {
        const rateSortOfobjArr = consulOfobjArr.toSorted((m, n) => n.rate - m.rate);
        commonRtnon(rateSortOfobjArr);
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
    const dataOfstrArr = Array.from(data);
    const dataElmOfstrArr = dataOfstrArr.map(dataOfstr=> dataOfstr[Number.parseInt(dataOfstr.length / 2)]);
    const uniqOfstrArr = dataElmOfstrArr.filter(dataElmOfstr => dataElmOfstrArr.indexOf(dataElmOfstr) === dataElmOfstrArr.lastIndexOf(dataElmOfstr));
    const uniqDtOfstr = dataOfstrArr.find(dataOfstr => dataOfstr.includes(uniqOfstrArr.toString()));
    if (uniqOfstrArr.length === 0) {
        return console.log("沒有")
    } else {
        return console.log(uniqDtOfstr)
    }
}
func("彭大牆", "陳王明雅", "吳明"); // print 彭大牆
func("郭靜雅", "王立強", "郭林靜宜", "郭立恆", "林花花"); // print 林花花
func("郭宣雅", "林靜宜", "郭宣恆", "林靜花"); // print 沒有
func("郭宣雅", "夏曼藍波安", "郭宣恆"); // print 夏曼藍波安


// Task4

function getNumber(index){
    const arrOfnumArr = [0];
    let arrOfnum = 0;
    for(let i = 1; i <= index; i++) {
        if (i % 3 === 0 ) {
            arrOfnum -= 1;
        } else {
            arrOfnum += 4;
        }
        arrOfnumArr.push(arrOfnum);
    }
    return console.log(arrOfnumArr[index]);

 }
getNumber(1); // print 4
getNumber(5); // print 15
getNumber(10); // print 25
getNumber(30); // print 70



// Task5

//===========還沒完成===========

// function find(spaces, stat, n){
//     // your code here
//     const statOfnumArr = stat.map((staOfnum, idx) => {
//         if (staOfnum === 1) {
//             return idx;
//         }
//     }).filter( e => e !== undefined)

//     const spaceOfnum = spaces.filter((staceOfnum, idx) => {
//         return spaces.(staceOfnum[idx])
//     })
//     console.log(statOfnumArr)
//     }
// find([3, 1, 5, 4, 3, 2], [0, 1, 0, 1, 1, 1], 2); // print 5
// find([1, 0, 5, 1, 3], [0, 1, 0, 1, 1], 4); // print -1
// find([4, 6, 5, 8], [0, 1, 1, 1], 4); // print 2


