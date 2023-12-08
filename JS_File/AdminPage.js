// 假設您的後端 API 端點為 "/api/accounts"
function fetchAccounts() {
    fetch('/api/accounts')
        .then(response => response.json())
        .then(data => {
            renderTable(data);
        })
        .catch(error => console.error('Error:', error));
}

// 渲染單行帳號資訊
function renderRow(account) {
    const table = document.getElementById("accountsTable");
    let row = table.insertRow();
    row.insertCell(0).innerHTML = account.id || '';
    row.insertCell(1).innerHTML = account.name || '';
    row.insertCell(2).innerHTML = '******';
    row.insertCell(3).innerHTML = account.imageURL || '';
    row.insertCell(4).innerHTML = account.email || '';
    row.insertCell(5).innerHTML = account.phone || '';
    row.insertCell(6).innerHTML = account.card || '';
    row.insertCell(7).innerHTML = account.birthday ? formatDate(account.birthday) : '';
    row.insertCell(8).innerHTML = account.address || '';
    row.insertCell(9).innerHTML = account.createTime ? formatDate(account.createTime) : '';

    let actionsCell = row.insertCell(10);
    actionsCell.innerHTML = `<button class="modify-btn">修改</button>
                             <button class="delete-btn">刪除</button>`;
}

// 日期格式化函數（假設您想將日期格式化為特定格式）
function formatDate(dateString) {
    let date = new Date(dateString);
    return date.toLocaleDateString(); // 這會將日期格式化為本地格式，您可以根據需要調整
}

// 模態框控制
var modal = document.getElementById("modal");
var addButton = document.getElementById("add");
var closeButton = document.getElementsByClassName("close-button")[0];

addButton.onclick = function() {
    modal.style.display = "block";
}

closeButton.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function closeModal() {
    modal.style.display = "none";
}

function submitForm() {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return; // 不提交表單
    }

    // 添加其餘的表單提交邏輯...
    closeModal();
}

// 添加一筆測試帳號資訊
function addTestAccount() {
    const testAccount = {
        id: "1",
        name: "測試用戶",
        password:"**********",
        imageURL: "https://example.com/image.jpg",
        email: "test@example.com",
        phone: "1234567890",
        card: "1234 5678 9012 3456",
        birthday: "1990-01-01",
        address: "測試地址 123",
        createTime: new Date().toISOString()
    };

    renderRow(testAccount);
}

// 在頁面加載時添加測試帳號
window.onload = function() {
    fetchAccounts();
    addTestAccount(); // 添加測試帳號
};