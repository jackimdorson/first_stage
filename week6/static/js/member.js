'use strict'
import { submitEmpty } from './common.js';


document.addEventListener("DOMContentLoaded", function(){

    const deleteFormQrySA = document.querySelectorAll(".msg__delete-form");

    function confirmDelete(){
        for(let deleteFormQryS of deleteFormQrySA){
            deleteFormQryS.addEventListener("submit", function(event){
                const yesBtn = confirm("確定要刪除?");
                if (!yesBtn){
                    event.preventDefault();
                }
            })
        }
    }

    confirmDelete(deleteFormQrySA);
    submitEmpty();
})