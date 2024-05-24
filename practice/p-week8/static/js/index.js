'use strict'
import { submitEmpty, toggle } from './common.js';

document.addEventListener("DOMContentLoaded", function(){

    const toggleBtnSelector = ".toggle__btn";
    const nameSelector = ".input__field--name";
    const pswUsernameSelector = ".input__field--username, .input__field--psw";
    const inputUsernameQryS = document.querySelector('.input__field--username');
    const formSideImgQrySA = document.querySelectorAll(".form__row__img");
    const checkUsernameImg = document.createElement("img");
    checkUsernameImg.classList.add("form__row__img");
    inputUsernameQryS.parentElement.appendChild(checkUsernameImg);

    //【 Function 】
    function showPsw(event){         //『Clickするとpswが見える様になる』関数
        const inputPswQryS = event.target.closest(".form__row").querySelector(".input__field--psw");
        if(inputPswQryS.type === "password"){
            inputPswQryS.type = "text";
            event.target.src = "../static/img/visible.webp";
        }else{
            inputPswQryS.type = "password";
            event.target.src = "../static/img/hidden.webp";
        }
    }

    function toHalfWidth(event){          //『指定以外の全角文字』を『半角変換』する関数 　//參考國稅局, 特殊符號僅允許!@#$^*()
        return event.target.value.replace(/[Ａ-Ｚａ-ｚ０-９〜！＠＃＄＾＊（）＿]/g, function(str){
            return String.fromCharCode(str.charCodeAt(0) - 0xFEE0);         //リアルタイムで 全角→半角
        })
    }

    function restrictInput(inputSelector) {       //『指定文字』のみ入力を受け付ける関数
        const inputQrySA = document.querySelectorAll(inputSelector);
        for(const inputQryS of inputQrySA){
            inputQryS.addEventListener("input", (event) => {
                let regex;
                if(inputSelector === pswUsernameSelector){
                    regex = /[^A-Za-z0-9~!@#$^*()_]/g;
                }else if(inputSelector === nameSelector){
                    regex = /[^A-Za-z0-9~!@#$^*()_\u4E00-\u9FFF\uF900-\uFAFFぁ-んァ-ヶ]/g;   // + 繁簡體 + 注音 + 日文
                }
                event.target.value = toHalfWidth(event).replace(regex, '');
            })
        }
    }

    async function checkUsername() {
        const imgSrcAble = "../static/img/able.webp";
        const imgSrcDisable = "../static/img/disable.webp";
        if(inputUsernameQryS.value.trim() === '' ){
            checkUsernameImg.src = imgSrcDisable;
        }
        const response = await fetch(`/api/check-username?username=${encodeURIComponent(inputUsernameQryS.value)}`);
        const jsonData = await response.json();
        if(jsonData.exists) {  //exists...endpointで設定したreturnされるjson
            checkUsernameImg.src = imgSrcAble;
        } else {
            checkUsernameImg.src = imgSrcDisable;
        }
    }


    //【 EventListener 】
    submitEmpty();
    toggle(toggleBtnSelector);
    restrictInput(nameSelector);
    restrictInput(pswUsernameSelector);
    for(const formSideImgQryS of formSideImgQrySA){
        formSideImgQryS.addEventListener("click", showPsw);
    }

    let timeoutId;
    inputUsernameQryS.addEventListener('input', () => {
        clearTimeout(timeoutId);                              //既存のタイマーをクリア
        timeoutId = setTimeout(checkUsername, 500);           // 新しいタイマーを設定
    })




    document.getElementById("password-form").addEventListener("submit", async function(event) {
        event.preventDefault();

        const password = document.getElementById("password").value;
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%])[A-Za-z\d@#$%]{4,8}$/;

        if (!regex.test(password)) {
            alert('密碼得4-8個字, 並包含最少各1個文字, 數字以及@#$%特殊符號');
            return;
        }
        try {
            const response = await fetch('/api/validate-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "password": password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert('error: ' + errorData.detail);
                return;
            }
            const data = await response.json();
            alert('密碼有効: ' + data);
        } catch (error) {
            console.error('發生error:', error);
            alert('發生error');
        }
    });


    document.getElementById("fetch-button").addEventListener("click", async function() {
        try {
            const response = await fetch('https://www.google.com', {
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.text();
            document.getElementById("response").innerText = data;
        } catch (error) {
            console.error('Fetch error:', error);
            document.getElementById("response").innerText = 'Fetch error: ' + error.message;
        }
    });



    document.getElementById("fetch-button2").addEventListener("click", async function() {
        try {
            const response = await fetch('https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment.json');

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            document.getElementById("response2").innerText = JSON.stringify(data);
        } catch (error) {
            console.error('Fetch error:', error);
            document.getElementById("response2").innerText = 'Fetch error: ' + error.message;
        }
    });

    document.getElementById("fetch-button3").addEventListener("click", async function() {
        try {
            const response = await fetch('http://localhost:8000/api/data', {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            document.getElementById("response3").innerText = JSON.stringify(data);
        } catch (error) {
            console.error('Fetch error:', error);
            document.getElementById("response3").innerText = 'Fetch error: ' + error.message;
        }
    });


    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    if (name) {
        document.getElementById('greeting').innerHTML = name;
    }




})