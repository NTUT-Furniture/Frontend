function submitForm() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value;
    const password = passwordInput.value;

    fetch('http://localhost:8000/api/token', {
        method: 'POST', // 修改为 POST 方法
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: '',
            username: username,
            password: password,
            scope: '',
            client_id: '',
            client_secret: ''
        }).toString()
    })
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        UserLogin(data);
    })
    .catch(error => console.error('Error:', error));
}

async function UserLogin(userData) {
    if (userData.detail === "Incorrect username or password") {
        alert('Invalid username or password. Please try again.');
    } else if (userData.detail && userData.detail[0].type === "missing") {
        alert('Missing username or password. Please try again.');
    } else {
        try {
            alert('Login successful! Redirecting to HomePage.');
            await GetAccount(userData.access_token, userData.token_type);
            window.location.href = '../home/Index.html';
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
    //console.log(document.cookie);
}

async function GetAccount(token, type) {
    try {
        const response = await fetch('http://localhost:8000/api/account/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': type + " " + token
            },
        });
        const data = await response.json();
        setCookie("account_uuid", data.account_uuid, 7);
        setCookie("token", token, 7);
        console.log("fjsgjklfdjgklfdsjkl");
    } catch (error) {
        throw new Error('Error fetching account data: ' + error.message);
    }
}
