window.onscroll = function () {
    myFunction()
};
const navbar = document.getElementById("navbar");

function myFunction() {
    if (window.scrollY > 0) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // 檢查是否存在帳戶 token
    var hasToken = checkToken();

    // 根據結果更新 Login 按鈕的文字
    updateLoginButtonText(hasToken);
});

// 檢查 cookie 中是否存在帳戶 token
function checkToken() {
    var token = getCookie("token");

    return token !== null && token !== "";
}

// 根據帳戶 token 的存在與否更新 Login 按鈕的文字
function updateLoginButtonText(hasToken) {
    var loginButton = document.querySelector(".dropbtn");

    if (hasToken) {
        loginButton.textContent = "Logout";
    } else {
        loginButton.textContent = "Login";
    }
}

// 從 cookie 中獲取指定名稱的值
function getCookie(name) {
    var cookies = document.cookie.split("; ");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].split("=");
        if (cookie[0] === name) {
            return cookie[1];
        }
    }
    return null;
}