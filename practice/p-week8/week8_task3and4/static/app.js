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

        if (!response.ok) {
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

document.getElementById("fetch-button3").addEventListener("click", async function() {
    try {
        const response = await fetch('http://localhost:8000/api/data', {
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