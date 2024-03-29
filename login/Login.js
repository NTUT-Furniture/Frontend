function clearAllCookies() {
    var cookies = document.cookie.split("; ");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}

// 調用 clearAllCookies 函數來清除所有 cookie
clearAllCookies();

function submitForm() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value;
    const password = passwordInput.value;
    const baseURL = "https://nfta.noobdy.com"
    fetch(`${baseURL}/api/token`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
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
        console.log("in get token");
        console.log(data);
        UserLogin(data);
    })
    .catch(error => console.error('Error:', error));
}

async function UserLogin(userData) {
    console.log("in User Login");
    if (userData.detail === "Incorrect username or password") {
        alert('Invalid username or password. Please try again.');
    } else if (userData.detail && userData.detail[0].type === "missing") {
        alert('Missing username or password. Please try again.');
    } else if (userData.detail && userData.detail=== "Inactive user") {
        alert('You was had Banned! Please to Talk with Admin!');
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
        date.setTime(date.getTime() + (10 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
    //console.log(document.cookie);
}

async function GetAccount(token, type) {
    const baseURL = "https://nfta.noobdy.com";
    try {
        const response = await fetch(`${baseURL}/api/account/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': type + " " + token,
            },
        });

        const data = await response.json();
        setCookie("account_uuid", data.account_uuid, 7);
        setCookie("token", token, 7);
        // setCookie("shop_uuid", data.shop_uuid);
        console.log(document.cookie);
    } catch (error) {
        throw new Error('Error fetching account data: ' + error.message);
    }
}
