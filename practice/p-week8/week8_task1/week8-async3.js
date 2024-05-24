console.time('Async 3');
console.log('Async 3 Start');

// 実行する関数
function exampleFunction1() {
    for (let i = 0; i < 1000; i++) {
        console.log('Async 3: Hello Geeks');
    }
}

// 関数を実行
exampleFunction1();

console.timeEnd('Async 3');
