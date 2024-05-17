'use strict'
import { submitEmpty } from './common.js';


document.addEventListener("DOMContentLoaded", function(){

    const deleteFormQrySA = document.querySelectorAll(".msg__delete-form");
    const submitExistQryS = document.querySelector('.btn--exist');
    const submitUpdateQryS = document.querySelector('.btn--update');


    function confirmDelete(qrySA){
        for(let qryS of qrySA){
            qryS.addEventListener("submit", function(event){
                const yesBtn = confirm("確定要刪除?");
                if (!yesBtn){
                    event.preventDefault();
                }
            })
        }
    }

    function createElement(element, qryS) {
        const elem = document.createElement(element)
        elem.classList.add(`form__newline-${element}`);
        qryS.after(elem);
        return elem;
    }

    function existsUsername(qryS) {        // strで送信
        const createDiv = createElement("div", qryS);
        qryS.addEventListener("click", async(event)=>{
            event.preventDefault();
            const inputUsernameQryS = document.querySelector(".input__field--username");
            const response = await fetch(`/api/member?username=${encodeURIComponent(inputUsernameQryS.value)}`);
            const jsonData = await response.json();
            if (!jsonData.data) {
                createDiv.textContent = "No Date";
            }
            else {
                const name = jsonData.data.name;
                const username = jsonData.data.username;
                createDiv.textContent = `${name} (${username})`;
            }
        })
    }

    function updateName(qryS) {            // jsonで送信
        const createDiv = createElement("div", qryS);
        qryS.addEventListener("click", async(event)=>{
            event.preventDefault();
            const inputNameQryS = document.querySelector(".input__field--name")
            const response = await fetch('api/member',{
                method: 'PATCH',            //預設是GET, 故GET不需這樣寫
                headers: {                  //Content-Type是指定request body的形式, GET沒有body故不需這樣寫
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "name": inputNameQryS.value })  // 送信するデータをJSON形式に変換
            })
            const jsonData = await response.json();
            if (Object.keys(jsonData)[0] === "error") {
                createDiv.textContent = "更新失敗";
            }
            else {
                createDiv.textContent = "更新成功";
            }
        })
    }


    submitEmpty();
    confirmDelete(deleteFormQrySA);
    existsUsername(submitExistQryS)
    updateName(submitUpdateQryS)
})