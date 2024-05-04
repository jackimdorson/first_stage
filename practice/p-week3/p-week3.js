function addNumberFactory(num){
    function addNumber(value){
        return num + value;
    }
    return addNumber;
}
const add5 = addNumberFactory(5);
add5(4);

(function(){
    console.log('即時関数の練習です')
})();
debugger;

function test(){
    let a = 0;
    let b = 1;
    return { a, b };
  }

  const bb = test();
  console.log(bb.b);


// 必要code
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
// 取得json資料
async function fetchData(){
    const response = await fetch("https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-1");
    const data = await response.json();
    const items = data.data.results;
    const totalItems = items.length;
    return data;
}
async function makeSmall() {
    const dataJson = await fetchData();
    const resultsOfobjArr = dataJson.data.results;
    // stitle, fileObjの作成　　{ stitle: ["spot1", "spot2", "spot3"] }
    const stitleOfobj = {"stitle": []};
    const fileOfobj = {"filelist": []};
    for (let resultsOfobj of resultsOfobjArr) {
        stitleOfobj["stitle"].push(resultsOfobj.stitle);
        const fileOfstr = resultsOfobj["filelist"];
        const regex = /https:\/\/.*?(?=https:\/\/|$)/g;
        const fileMatchOfstr = fileOfstr.match(regex);
        fileOfobj["filelist"].push(fileMatchOfstr);
    }
    // htmlの作成
    const containerSm = document.querySelector(".p-container__small");
    const containerBg = document.querySelector(".p-container__large");
    const loadMoreBtn = document.getElementById("load-more");

    let currentIndex = 0;
    function loadMoreItems(arg="noInit"){
        const totalItems = resultsOfobjArr.length;
        const itemsPerLoad = 10;
        // 計算顯示範圍
        const start = currentIndex;
        let end = Math.min(currentIndex + itemsPerLoad, totalItems);
        if(arg==="init"){
            end = 13;
        }
        for (let i = start; i < end; i++) {
            const figure = document.createElement('figure');
            figure.classList.add('c-item');
            const img = document.createElement('img');
            const eachFile = fileOfobj["filelist"][i][0];
            img.src = eachFile;
            img.alt = "美麗景點";
            figure.appendChild(img);
            const figcaption = document.createElement('figcaption');
            const span = document.createElement('span');
            span.textContent = stitleOfobj["stitle"][i];
            figcaption.appendChild(span);
            figure.appendChild(figcaption);
            if (i < 3 && arg==="init") {
                figcaption.classList.add('c-item__promo');
                containerSm.appendChild(figure);
            } else {
                figcaption.classList.add('c-item__title');
                const star = document.createElement('img');
                star.src = "./img/star.webp";
                star.alt = "星星";
                figure.appendChild(star);
                containerBg.appendChild(figure);
            }
        }
        currentIndex = end;
        if(currentIndex >= totalItems) {
            loadMoreBtn.style.display = 'none';
        }
    }
    const loadSpan = document.createElement('span');
    loadSpan.textContent = "Load More";
    loadMoreBtn.appendChild(loadSpan);
    const lfooter = document.querySelector(".l-footer");
    const ptag = document.createElement('p');
    ptag.textContent = "&copy; copyright 2024 by Jack";
    lfooter.appendChild(ptag);

    loadMoreItems("init");
    loadMoreBtn.addEventListener('click', loadMoreItems);
}
window.addEventListener('load', makeSmall);


