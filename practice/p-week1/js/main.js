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



// fetch
const btnAjax = document.querySelector(".c-form__btn-ajax");
btnAjax.addEventListener("click", function(){
    fetch("https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json").then(function(response){
        return response.json();
    }).then(function(data){
        let result = document.querySelector(".c-form__btn__result");
        let content = "";
        let datetime ="";
        let count = 0;
        console.log(datetime);
        for(let i=0; i<data.length; i++){
            datetime += data[i].reportDatetime + "\n";
            for(let h=0; h<data[i].timeSeries.length; h++){
                for(let j=0; j<data[i].timeSeries[h].areas.length; j++){
                    let abc = data[i].timeSeries[h].areas[j];
                    let areaName = abc.area.name;
                    let code = abc.area.code;
                    count += 1;
                    content += `${count}:『${areaName}』${code} \n\n`;
                }
            }
        }
        result.innerText = datetime + "\n" + content;
    })
})

// proxy

let data = {
    price: 100, 
    count: 5
};
let proxy = new Proxy(data, {
    get (target, property) {
    if(property === "total"){
        return target.price * target.count;
    }else {
        return target[property];
    }
    }
});

let total = function () {
    return data.price * data.count;
}

console.log(total());
console.log(proxy.total)
// proxy
