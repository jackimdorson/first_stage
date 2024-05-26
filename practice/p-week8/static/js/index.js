'use strict'
import { submitEmpty, toggle } from './common.js';

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
        try {
            const response = await fetch(`/api/check-username?username=${encodeURIComponent(inputUsernameQryS.value)}`);  //エンコード関数を使い、URI内で安全に使用できる形式に変換
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP(Server) error(接受Promise卻false) status: ${response.status}, message: ${errorData.message}, details: ${errorData.details}`);
            }
            const jsonData = await response.json();
            if(!jsonData.exists) {  //exists...endpointで設定したreturnされるjson
                checkUsernameImg.src = imgSrcAble;
            } else {
                checkUsernameImg.src = imgSrcDisable;
            }
        } catch (error) {
            console.error("Network error(拒絕Promise):", error);
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