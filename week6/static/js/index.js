'use strict'
import { isEmptyInputs } from './common.js';

document.addEventListener("DOMContentLoaded", function(){
    const forms = document.querySelectorAll(".form");
    isEmptyInputs(forms);


    const formName = document.querySelector(".form__input--name");
    const formInputs = document.querySelectorAll(".form__input");
    function toHalfWidth(e, regex){
        e.target.value = e.target.value.replace(/[Ａ-Ｚａ-ｚ０-９〜！＠＃＄＾＊（）＿]/g, function(str){
            return String.fromCharCode(str.charCodeAt(0) - 0xFEE0);         //リアルタイムで 全角→半角
        }).replace(regex, '');                                       //參考國稅局, 特殊符號僅允許!@#$^*()
    }

    formName.addEventListener("input", function(e){            //addEventListenerに第二引数を設定する記述法
        toHalfWidth(e, /[^A-Za-z0-9~!@#$^*()_\u4E00-\u9FFF\uF900-\uFAFFぁ-んァ-ヶ]/g);   // + 繁簡體 + 注音 + 日文
    })
    for(let formInput of formInputs){
        formInput.addEventListener("input", (e) => {
            toHalfWidth(e, /[^A-Za-z0-9~!@#$^*()_]/g);
        })
    }


    const formShowPsws = document.querySelectorAll(".form__show-psw");
    function showPsw(event){
        const showPswImg = event.target;
        const formPsw = showPswImg.closest(".form__group").querySelector("input");
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
})