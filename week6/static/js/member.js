'use strict'
import { isEmptyInput } from './common.js';

document.addEventListener("DOMContentLoaded", function(){
    const formCreateMsg = document.querySelector(".form--create-msg");
    isEmptyInput(formCreateMsg);


    const deleteForms = document.querySelectorAll(".msg__delete-form");
    for(let deleteForm of deleteForms){
        deleteForm.addEventListener("submit", function(e){
            const check = confirm("確定要刪除?");
            if (!check){
                e.preventDefault();
            }
        })
    }
})