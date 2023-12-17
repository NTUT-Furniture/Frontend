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
function UserLogin(userData) {
    if (userData.detail==="Incorrect username or password") {
        alert('Invalid username or password. Please try again.');
    } 
    else if (userData.detail && userData.detail[0].type==="missing") {
        alert('Missing username or password. Please try again.');
    }else {
        alert('Login successful! Redirecting to HomePage.');
        window.location.href = '../home/Index.html';
    }
}

