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