// fetch().then(function(response){
//     return response.text();
// }).then(function(data){
//     console.log(data);
// });

// change-humburger
const burgerNow = document.getElementById("burger-now");

burgerNow.addEventListener("click", function(){
    const burgerOpen = "./img/burger-menu.webp";
    const burgerClose = "./img/x.webp";
    burgerNow.src = burgerNow.src.includes("x.webp") ? burgerOpen : burgerClose;
});


// darkMode
const btnDark = document.querySelector(".c-form__btn-darkmode");

btnDark.addEventListener("click", () => {
    const modeNow = document.documentElement.getAttribute("data-theme");
    const updatedMode = modeNow === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", updatedMode);
});

// jsonDataの取得
async function fetchData(){
    const response = await fetch("https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-1");
    const data = await response.json();
    return data;
}

async function makeSmall() {
    const dataJson = await fetchData();
    const resultsOfobjArr = dataJson.data.results;

    // stitle, fileObjの作成　　{ stitle: ["spot1", "spot2", "spot3"] }
    let stitleOfobj = {"stitle": []};
    let fileOfobj = {"filelist": []};
    for (let resultsOfobj of resultsOfobjArr) {
        stitleOfobj["stitle"].push(resultsOfobj.stitle);

        const fileOfstr = resultsOfobj["filelist"];
        const regex = /https:\/\/.*?(?=https:\/\/|$)/g;
        const fileMatchOfstr = fileOfstr.match(regex);
        fileOfobj["filelist"].push(fileMatchOfstr)
    }


    // htmlの作成
    const container = document.querySelector(".p-container__small");

    for(let i = 0; i <= 2; i++) {

        const figure = document.createElement('figure');
        figure.classList.add('c-item');

        const img = document.createElement('img');
        // for (let eachFile of fileOfobj["filelist"]){
            let eachFile = fileOfobj["filelist"][i][0]
            img.src = eachFile;
            img.alt = "加油圖"

        figure.appendChild(img);

        const figcaption = document.createElement('figcaption');
        figcaption.classList.add('c-item__promo');
        figcaption.textContent = stitleOfobj["stitle"][i];
        figure.appendChild(figcaption);

        container.appendChild(figure);
    }
}
window.addEventListener('load', makeSmall);

