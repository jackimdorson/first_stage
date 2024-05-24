console.time('Defer 1');
console.log('Defer 1 Start');

// 実行する関数
function exampleFunction1() {
    for (let i = 0; i < 1000; i++) {
        console.log('Defer 1: Hello Geeks');
    }
}

// 関数を実行
exampleFunction1();

console.timeEnd('Defer 1');
