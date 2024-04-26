document.addEventListener("DOMContentLoaded", function(){
    const form = document.getElementById("form");
    form.addEventListener("submit", function(event){
        const checkBtn = document.getElementById("check");
        if(!checkBtn.checked){
            event.preventDefault();
            alert("Please check the checkbox first");
        }
    })
})

function change2HalfChar(input){
    input.addEventListener("input", function(){
        input.value = input.value.replace(/[０-９]/g, function(str){
            return String.fromCharCode(str.charCodeAt(0) - 0xFEE0);
        })
    })
}
const squareOfelemObj = document.getElementById("square");
change2HalfChar(squareOfelemObj);


function showPsw(){
    const psw = document.getElementById("psw");
    const showPsw = document.getElementById("show-psw");
    showPsw.addEventListener("click", function(){
        if (psw.type === "password") {
            psw.type = "text";
        } else {
            psw.type = "password";
        }
    })
}
showPsw();


document.addEventListener("DOMContentLoaded", function(){
    const squareForm = document.getElementById("square-form");
    squareForm.addEventListener("submit", function(event){
        event.preventDefault() //フォームの送信を防ぐ
        const squareOfnum = Number(squareOfelemObj.value)
        if (squareOfnum <= 0){
            alert("Please enter a positive number");
        } else {
            const redirectUrl = `/square/${squareOfnum}`;
            window.location.href = redirectUrl;
        }
    })
})

const visible = document.getElementById("show-psw");
visible.addEventListener("click", function(){
    if (visible.src.includes("invisible")){
        visible.src = "../static/img/visible.webp";
    } else {
        visible.src = "../static/img/invisible.webp";
    }
})

// 不需考慮安全性=》前端redirect
// 需要考慮安全性=》後段redirect