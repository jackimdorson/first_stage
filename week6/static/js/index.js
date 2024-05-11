'use strict'
import { submitEmpty, toggle } from './common.js';


document.addEventListener("DOMContentLoaded", function(){

    const toggleBtnSelector = ".toggle__btn";
    const nameSelector = ".form__input--name";
    const pswUsernameSelector = ".form__input--username, .form__input--psw";
    const inputUsernameQryS = document.querySelector('.form__input--username');
    const formSideImgQrySA = document.querySelectorAll(".form__sideimg");
    const checkUsernameImg = document.createElement("img");
    checkUsernameImg.classList.add("form__sideimg");
    inputUsernameQryS.parentElement.appendChild(checkUsernameImg);

    //【 Function 】
    function showPsw(event){         //『Clickするとpswが見える様になる』関数
        const inputPswQryS = event.target.closest(".form__group").querySelector(".form__input--psw");
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
        for(let inputQryS of inputQrySA){
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
        const response = await fetch(`/api/check-username?username=${encodeURIComponent(inputUsernameQryS.value)}`);
        const data = await response.json();
        const disableName = data.exists;
        if(disableName || inputUsernameQryS.value.trim() === '' ) {
            checkUsernameImg.src = "../static/img/disable.webp";
        } else {
            checkUsernameImg.src = "../static/img/enable.webp";
        }
    }

    //【 EventListener 】
    submitEmpty();
    toggle(toggleBtnSelector);
    restrictInput(nameSelector);
    restrictInput(pswUsernameSelector);
    for(let formSideImgQryS of formSideImgQrySA){
        formSideImgQryS.addEventListener("click", showPsw);
    }

    let timeoutId;
    inputUsernameQryS.addEventListener('input', function() {
        clearTimeout(timeoutId);                              //既存のタイマーをクリア
        timeoutId = setTimeout(checkUsername, 500);           // 新しいタイマーを設定
    })
})