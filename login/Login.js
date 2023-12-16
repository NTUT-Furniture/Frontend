function submitForm() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value;
    const password = passwordInput.value;

    fetch('http://localhost:8000/api/token', {
        method: 'POST', // 修改为 POST 方法
        headers: {
            'Accept': 'application/json', // 指定期望的响应格式
            'Content-Type': 'application/x-www-form-urlencoded' // 设置内容类型
        },
        body: new URLSearchParams({
            grant_type: '',
            username: username, // 使用输入的用户名
            password: password, // 使用输入的密码
            scope: '',
            client_id: '',
            client_secret: ''
        }).toString() // 将数据转换为 x-www-form-urlencoded 格式
    })
    .then(response => response.json()) // 处理 JSON 格式的响应
    .then(data => {
        console.log(data);
        UserLogin(data); // 调用 UserLogin 函数，传入响应数据和用户名密码
    })
    .catch(error => console.error('Error:', error)); // 处理错误
}
function UserLogin(userData) {
    if (userData.detail==="Incorrect username or password") {
        // 登录失败，给出提示
        alert('Invalid username or password. Please try again.');
    } 
    if (userData.detail && userData.detail[0].type==="missing") {
        alert('Missing username or password. Please try again.');
    }else {
        // 登录成功，跳转到HomePage
        alert('Login successful! Redirecting to HomePage.');
        window.location.href = '../home/Index.html';
    }
}

