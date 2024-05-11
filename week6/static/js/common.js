'use strict'

export function isEmptyInput(form){
    form.addEventListener("submit", function(e){
        const textarea = e.target.elements[0];     // フォーム内の最初の『入力欄』を取得
        if(textarea.value.trim() === ''){
            e.preventDefault();
            alert("請輸入文字");
        }
    })
}

export function isEmptyInputs(forms){
    for(let form of forms){
        form.addEventListener("submit", function(e){
            const inputsArr = Array.from(e.target.querySelectorAll("input"))   //NodeList -> Array
            if (inputsArr.some(input => input.value.trim() === '')){
                e.preventDefault();
                alert("請輸入帳號、密碼");
            }
        })
    }
}