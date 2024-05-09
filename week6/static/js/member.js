'use strict'
document.addEventListener("DOMContentLoaded", function(){

    const leaveMsg = document.getElementById("create_msg")
    leaveMsg.addEventListener("submit", function(event){
        if (event.value.trim() !== ''){
            alert("請輸入文字");
        }
    })

    const deleteForms = document.querySelectorAll(".delete_form");
    for(let form of deleteForms){
        form.addEventListener("submit", function(event){
            const check = confirm("確定要刪除?");
            if (!check){
                event.preventDefault();
            }
        })
    }
})