//moduleはデフォルトで usestrict + defer属性の効果＝DOMContentLoaded＝HTMLドキュメントの解析が完了するまで実行されない
export function toggle(selector){
    const toggleQryS = document.querySelector(selector);
    toggleQryS.addEventListener("click", (event) => {
        event.target.classList.toggle(`${selector.slice(1)}--clicked`);   //slice(1)はselectorの『.』を除去する為(例.toggle__btn->toggle__btn)
        event.target.nextElementSibling.classList.toggle(`${selector.slice(1)}--spread`);
    })
}

export function submitEmpty(){
    const formQrySA = document.querySelectorAll(".form");
    for(const formQryS of formQrySA){
        formQryS.addEventListener("submit", function(event){
            const inputQrySA = Array.from(event.target.querySelectorAll(".input__field"));   //NodeList -> Array
            if (inputQrySA.some(inputQryS => inputQryS.value.trim() === '')){
                event.preventDefault();
                alert("不得空白");
            }
        })
    }
}
