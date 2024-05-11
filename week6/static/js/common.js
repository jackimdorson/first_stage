//moduleはデフォルトで usestrict + defer属性の効果＝DOMContentLoaded＝HTMLドキュメントの解析が完了するまで実行されない
export function submitEmpty(){
    const forms = document.querySelectorAll(".form");
    for(let form of forms){
        form.addEventListener("submit", function(e){
            const inputsArr = Array.from(e.target.querySelectorAll(".form__input"))   //NodeList -> Array
            if (inputsArr.some(input => input.value.trim() === '')){
                e.preventDefault();
                alert("不得空白");
            }
        })
    }
}