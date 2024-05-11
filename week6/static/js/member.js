'use strict'
import { submitEmpty } from './common.js';
submitEmpty();


document.addEventListener("DOMContentLoaded", function(){

    const deleteForms = document.querySelectorAll(".msg__delete-form");
    for(let deleteForm of deleteForms){
        deleteForm.addEventListener("submit", function(e){
            const yesBtn = confirm("確定要刪除?");
            if (!yesBtn){
                e.preventDefault();
            }
        })
    }
})