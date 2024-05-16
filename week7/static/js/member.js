'use strict'
import { submitEmpty } from './common.js';


document.addEventListener("DOMContentLoaded", function(){

    const deleteFormQrySA = document.querySelectorAll(".msg__delete-form");
    const submitQryS = document.querySelector('.form__submit');
    const submitUpdateQryS = document.querySelector('.form__submit--update');


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


    function existsUsername() {        // strで送信
        const createDiv = document.createElement("div");
        createDiv.classList.add("form__search-username");
        submitQryS.after(createDiv);
        submitQryS.addEventListener("click", async function(){
            const inputUsernameQryS = document.querySelector('.form__input--username');
            const response = await fetch(`/api/member?username=${encodeURIComponent(inputUsernameQryS.value)}`);
            const data = await response.json();
            if (data === null) {
                createDiv.textContent = "No Date";
            }
            else {
                const name = data.data.name;
                const username = data.data.username;
                createDiv.textContent = `${name} (${username})`;
            }
        })
    }

    function updateName() {            // jsonで送信
        const createDiv = document.createElement("div");
        createDiv.classList.add("form__search-name");
        submitUpdateQryS.after(createDiv);
        submitUpdateQryS.addEventListener("click", async function(){
            const inputNameQryS = document.querySelector('.form__input--name');
            const response = await fetch('api/member',{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "name": inputNameQryS.value })  // 送信するデータをJSON形式に変換
            })
            const data = await response.json();
            if (Object.keys(data)[0] === "error") {
                createDiv.textContent = "更新失敗";
            }
            else {
                createDiv.textContent = "更新成功";
            }
        })
    }

    confirmDelete(deleteFormQrySA);
    submitEmpty();
    existsUsername()
    updateName()
})