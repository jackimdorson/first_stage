const menuBtn = document.getElementById("menu_btn");
menuBtn.addEventListener("click", function(){

    const imgNow = document.getElementById("img_now");
    const imgOpenUrl = "./img/burger-menu.webp";
    const imgCloseUrl = "./img/x.webp";

    if (imgNow.src.includes("x.webp")) {
        imgNow.src = imgOpenUrl;
    } else {
        imgNow.src = imgCloseUrl;
    }
});

