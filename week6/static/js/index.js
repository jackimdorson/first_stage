'use strict'
import { submitEmpty } from './common.js';
submitEmpty();     //moduleはデフォルトでdefer属性の効果＝DOMContentLoaded＝HTMLドキュメントの解析が完了するまで実行されない


document.addEventListener("DOMContentLoaded", function(){

    // const inputName = document.querySelector(".form__input--name");
    // const inputsPswUsername = document.querySelectorAll(".form__input--username, .form__input--psw");
    function toHalfWidth(e, regex){
        e.target.value = e.target.value.replace(/[Ａ-Ｚａ-ｚ０-９〜！＠＃＄＾＊（）＿]/g, function(str){
            return String.fromCharCode(str.charCodeAt(0) - 0xFEE0);         //リアルタイムで 全角→半角
        }).replace(regex, '');                                       //參考國稅局, 特殊符號僅允許!@#$^*()
    }

    // inputName.addEventListener("input", function(e){
    //     toHalfWidth(e, /[^A-Za-z0-9~!@#$^*()_\u4E00-\u9FFF\uF900-\uFAFFぁ-んァ-ヶ]/g);   // + 繁簡體 + 注音 + 日文
    // })
    // for(let input of inputsPswUsername){
    //     input.addEventListener("input", (e) => {
    //         toHalfWidth(e, /[^A-Za-z0-9~!@#$^*()_]/g);
    //     })
    // }


    function restrictInput(selector) {
        const args = document.querySelectorAll(selector);
        for(let arg of args){
            arg.addEventListener("input", (e) => {
                if(selector === pswUsername){
                    toHalfWidth(e, /[^A-Za-z0-9~!@#$^*()_]/g);
                }else if(selector === name){
                    toHalfWidth(e, /[^A-Za-z0-9~!@#$^*()_\u4E00-\u9FFF\uF900-\uFAFFぁ-んァ-ヶ]/g);   // + 繁簡體 + 注音 + 日文
                }
            })
        }
    }
    const name = restrictInput(".form__input--name");
    const pswUsername = restrictInput(".form__input--username, .form__input--psw");




    const formShowPsws = document.querySelectorAll(".form__sideimg");
    function showPsw(event){
        const showPswImg = event.target;
        const formPsw = showPswImg.closest(".form__group").querySelector(".form__input--psw");
        if(formPsw.type === "password"){
            formPsw.type = "text";
            showPswImg.src = "../static/img/visible.webp";
        }else{
            formPsw.type = "password";
            showPswImg.src = "../static/img/hidden.webp";
        }
    }

    for(let formShowPsw of formShowPsws){
        formShowPsw.addEventListener("click", showPsw);
    }


    const toggleBtn = document.querySelector(".toggle__btn");
    toggleBtn.addEventListener("click", (e) => {
        e.target.classList.toggle("toggle__btn--clicked");
        e.target.nextElementSibling.classList.toggle("toggle__content--active");
    })




    let timeoutId;
    const usernameInput = document.querySelector('.form__input--username');
    const checkUsernameImg = document.createElement("img");
    checkUsernameImg.classList.add("form__sideimg")
    usernameInput.parentElement.appendChild(checkUsernameImg);

    usernameInput.addEventListener('input', function(e) {
        clearTimeout(timeoutId); // 既存のタイマーをクリア
        timeoutId = setTimeout(async function() { // 新しいタイマーを設定
            const response = await fetch(`/api/check-username?username=${encodeURIComponent(usernameInput.value)}`);
            const data = await response.json();
            const disable = data.exists;
            if(disable || e.target.value.trim() === '' ) {
                checkUsernameImg.src = "../static/img/disable.webp";
            } else {
                checkUsernameImg.src = "../static/img/enable.webp";
            }
        }, 500); // 500ミリ秒の遅延
    });






})