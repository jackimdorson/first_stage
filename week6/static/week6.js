const fullname = document.getElementById("fullname");
const accountUp = document.getElementById("account-up");
const pswUp = document.getElementById("psw-up");


function change2HalfChar(args){
    args.addEventListener("input", function(){
        args.value = args.value.replace(/[Ａ-Ｚａ-ｚ０-９！＠＃＄＾＊（）＿]/g, function(str){    //參考國稅局, 特殊符號僅允許!@#$^*()
            return String.fromCharCode(str.charCodeAt(0) - 0xFEE0);                          //リアルタイムで 全角→半角
        })
        args.value = args.value.replace(/[^A-Za-z0-9!@#$^*()_]/g, '');                       //上述以外全都不讓User輸入
    })
}
change2HalfChar(fullname);
change2HalfChar(accountUp);
change2HalfChar(pswUp);



document.addEventListener("DOMContentLoaded", function(){
    signup.addEventListener("submit", function(event){
        const checkName = document.getElementById("fullname");
        const checkAccount = document.getElementById("account-up");
        const checkPsw = document.getElementById("psw-up");
        if(!checkName.value || !checkAccount.value || !checkPsw.value){
            event.preventDefault();
            alert("請輸入帳號、密碼");
        }
    })
})


const showPswUp = document.getElementById("show-psw-up")
const pswIn = document.getElementById("psw-in");
const showPswIn = document.getElementById("show-psw-in")

function showPsw(psw, img){
    img.addEventListener("click", function(){
        if(img.src.includes("invisible")){
            img.src = "../static/img/visible.webp";
            psw.type = "text";
        }else{
            img.src = "../static/img/invisible.webp";
            psw.type = "password";
        }
    })
}
showPsw(pswUp, showPswUp);
showPsw(pswIn, showPswIn);


const accordion = document.getElementById("accordion");
accordion.addEventListener("click", function(){
    if(accordion.classList === "active"){
        accordion.classList.remove("active");
        accordion.nextElementSibling.classList.remove("open");
    }
    accordion.classList.toggle("active");
    accordion.nextElementSibling.classList.toggle("open");
})