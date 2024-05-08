const fullname = document.getElementById("fullname");
const accountUp = document.getElementById("account-up");
const pswUp = document.getElementById("psw-up");
const accountIn = document.getElementById("account-in");
const pswIn = document.getElementById("psw-in");
const signUp = document.getElementById("signup");
const signIn = document.getElementById("signin");



function change2HalfChar(args){
    args.addEventListener("input", function(){
        args.value = args.value.replace(/[Ａ-Ｚａ-ｚ０-９〜！＠＃＄＾＊（）＿]/g, function(str){    //參考國稅局, 特殊符號僅允許!@#$^*()
            return String.fromCharCode(str.charCodeAt(0) - 0xFEE0);                          //リアルタイムで 全角→半角
        })
        args.value = args.value.replace(/[^A-Za-z0-9~!@#$^*()_]/g, '');                       //上述以外全都不讓User輸入
    })
}
change2HalfChar(fullname);
change2HalfChar(accountUp);
change2HalfChar(pswUp);
change2HalfChar(accountIn);
change2HalfChar(pswIn);


// function checkBlank(formName, input1, input2, input3=false){
function checkBlank(formName, input1, input2, input3=null){
    document.addEventListener("DOMContentLoaded", function(){
        formName.addEventListener("submit", function(event){
            if(!input1.value || !input2.value || (input3 && !input3.value)){
                event.preventDefault();
                alert("請輸入帳號、密碼");
            }
        })
    })
}
checkBlank(signUp, fullname, accountUp, pswUp);
checkBlank(signIn, accountIn, pswIn);



const showPswUp = document.getElementById("show-psw-up")
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


const accordion = document.querySelector(".accordion");
accordion.addEventListener("click", function(){
    accordion.classList.toggle("active-accordion");
    accordion.nextElementSibling.classList.toggle("open-accordion");
})



document.addEventListener("DOMContentLoaded", function(){
    document.addEventListener("submit", function(event){
        if(event.target.classList.contains("delete_form")){
            const check = confirm("確定要刪除?");
            if (!check){        // user按Yes=T, 按No=F
                event.preventDefault();
            }
        }
    })
})
