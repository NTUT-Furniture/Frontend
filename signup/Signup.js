document.getElementById('submitButton').addEventListener('click', function () {
    const inputElements = document.querySelectorAll('input');
    const formData = {};
    const passwordError = document.getElementById('passwordError');
    const emailError = document.getElementById('emailError');
    inputElements.forEach(input => {
        formData[input.name] = input.value;
    });
    if (formData['password'] !== formData['confirm_password']) {
        passwordError.textContent = 'Passwords do not match.';
    }
    else if (!validateEmail(formData['email'])) {
        emailError.textContent = 'E-mail input type not correct.';
    } 
    else {
        emailError.textContent = '';
        passwordError.textContent = '';
        fetch(`http://localhost:8000/api/account/?` +
        (formData['username'] ? `name=${encodeURIComponent(formData['username'])}&` : '') +
        (formData['password'] ? `pwd=${encodeURIComponent(formData['password'])}&` : '') +
        (formData['image_url'] ? `image_url=${encodeURIComponent(formData['image_url'])}&` : '') +
        (formData['email'] ? `email=${encodeURIComponent(formData['email'])}&` : '') +
        (formData['phone'] ? `phone=${encodeURIComponent(formData['phone'])}&` : '') +
        (formData['credit_card'] ? `credit_card=${encodeURIComponent(formData['credit_card'])}&` : '') +
        (formData['birthday'] ? `birthday=${encodeURIComponent(formData['birthday'])}&` : '') +
        (formData['address'] ? `address=${encodeURIComponent(formData['address'])}` : ''), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                // console.log(formData);
                UserSignup(data,formData['email'],formData['password']);
            })
            .catch(error => {
                console.error('API Error:', error);
            });
    }
});

function validateEmail(email) {
    // console.log(email);
    var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    // console.log(re.test(email));
    return re.test(email);
}

function UserSignup(userData,name,pwd) {
    // console.log(userData.account_uuid);
    if (userData.account_uuid!==undefined) {
        alert('Sign up successful! Redirecting to HomePage.');
        UserLogin(name,pwd)
    } 
    else {
        alert('Sign up error! Please check your information');
    }
}
function UserLogin(username ,password) {
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
        GetAccount(data.access_token, data.token_type);
    })
    .catch(error => console.error('Error:', error));
}

async function GetAccount(token, type) {
    try {
        const response = await fetch('http://localhost:8000/api/shop/mine', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': type + " " + token,
            },
        });

        const data = await response.json();
        setCookie("account_uuid", data.account_uuid, 7);
        setCookie("token", token, 7);
        setCookie("shop_uuid", data.shop_uuid);
        console.log(document.cookie);
    } catch (error) {
        throw new Error('Error fetching account data: ' + error.message);
    }
}
