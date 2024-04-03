const ajaxbtn = document.getElementById("ajaxbtn");
ajaxbtn.addEventListener("click", function(){
    fetch("https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json").then(function(response){
        return response.json();
    }).then(function(data){
        let result = document.querySelector("#result");
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