function submitForm() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value;
    const password = passwordInput.value;
    var xhr = new XMLHttpRequest();
    // 設置請求方法和URL
    xhr.open("GET", "http://localhost:8000/api/account", true);
    // 設置當請求完成時的處理函數
    xhr.onreadystatechange = function () {
        // 檢查請求的狀態
        if (xhr.readyState == 4 && xhr.status == 200) {
            // 請求成功，處理返回的資料
            var responseData = JSON.parse(xhr.responseText);
            console.log(responseData);
            UserLogin(responseData,username,password)
        }
    };
    // 發送請求
    xhr.send();
}
function UserLogin(userData,username,password) {
    const matchedUser = userData.data.find(user => user.name === username && user.pwd === password);
    if (matchedUser) {
        // 登录成功，跳转到HomePage
        alert('Login successful! Redirecting to HomePage.');
        window.location.href = '../Html_File/Index.html';
    } else {
        // 登录失败，给出提示
        alert('Invalid username or password. Please try again.');
    }
}

