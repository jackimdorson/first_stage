document.addEventListener("DOMContentLoaded", function(){

    const inputs = document.querySelectorAll("#fullname, #account-up, #psw-up, #account-in, #psw-in");
    function change2HalfChar(event){
        event.target.value = event.target.value.replace(/[^A-Za-z0-9~!@#$^*()_]/g, '');                       //上述以外全都不讓User輸入
        event.target.value = event.target.value.replace(/[Ａ-Ｚａ-ｚ０-９〜！＠＃＄＾＊（）＿]/g, function(str){    //參考國稅局, 特殊符號僅允許!@#$^*()
            return String.fromCharCode(str.charCodeAt(0) - 0xFEE0);         //リアルタイムで 全角→半角
        })
    }
    for(let input of inputs){
        input.addEventListener("input", change2HalfChar);
    }


    const signs = document.querySelectorAll("#signup, #signin");
    function checkBlank(...inputs){
        return inputs.every(input => input.value.trim() !== '');
    }
    function stopSubmit(event){
        if (!checkBlank(...event.target.querySelectorAll("input"))){
            event.preventDefault();
            alert("請輸入帳號、密碼");
        }
    }
    for(let sign of signs){
        sign.addEventListener("submit", stopSubmit)
    }


    const imgs = document.querySelectorAll("#show-psw-up, #show-psw-in");
    function showPsw(event){
        const img = event.target;
        const psw = img.previousElementSibling;    //直前の兄弟要素=input要素を取得
        if(psw.type === "password"){
            psw.type = "text";
            img.src = "../static/img/visible.webp";
        }else{
            psw.type = "password";
            img.src = "../static/img/invisible.webp";
        }
    }
    for(let img of imgs){
        img.addEventListener("click", showPsw);
    }


    const accordion = document.querySelector(".accordion");
    if (accordion){
        accordion.addEventListener("click", function(){
            accordion.classList.toggle("active-accordion");
            accordion.nextElementSibling.classList.toggle("open-accordion");
        })
    }


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

