// 假設您的後端 API 端點為 "/api/accounts"
function fetchAccounts() {
    fetch('/api/accounts')
        .then(response => response.json())
        .then(data => {
            renderTable(data);
        })
        .catch(error => console.error('Error:', error));
    // addEditButtonEventListeners();
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

// 讓表格行可編輯並添加確認和取消按鈕
function makeRowEditable(row) {
    for (let i = 0; i < row.cells.length - 1; i++) {
        let cell = row.cells[i];
        let cellText = cell.innerHTML;
        // 保存原始數據
        cell.setAttribute('data-original-text', cellText);
        let input = document.createElement('input');
        input.type = 'text';
        input.value = cellText;
        cell.innerHTML = '';
        cell.appendChild(input);
    }
    // 添加確認和取消按鈕
    let actionsCell = row.cells[row.cells.length - 1];
    actionsCell.innerHTML = `<button class="confirm-btn">確認</button>
                             <button class="cancel-btn">取消</button>`;
    // 為確認和取消按鈕添加事件處理器
    actionsCell.getElementsByClassName('confirm-btn')[0].addEventListener('click', () => confirmEdit(row));
    actionsCell.getElementsByClassName('cancel-btn')[0].addEventListener('click', () => cancelEdit(row));
}

// 確認編輯
function confirmEdit(row) {
    console.log("確認編輯");
    // ...將編輯後的數據保存到後端...

    // 將輸入欄位轉換回文本
    for (let i = 0; i < row.cells.length - 1; i++) {
        let cell = row.cells[i];
        let input = cell.firstChild;
        cell.innerHTML = input.value; // 或者將數據保存到後端後再更新
    }
    // 恢復原來的修改按鈕
    row.cells[row.cells.length - 1].innerHTML = `<button class="modify-btn">修改</button>
                                                 <button class="delete-btn">刪除</button>`;
    addEditButtonEventListener(row.cells[row.cells.length - 1].getElementsByClassName('modify-btn')[0]);
}

// 取消編輯
function cancelEdit(row) {
    // 在這裡添加取消編輯的邏輯，通常是恢復原始數據
    console.log("取消編輯");
    for (let i = 0; i < row.cells.length - 1; i++) {
        let cell = row.cells[i];
        // 恢復原始數據
        cell.innerHTML = cell.getAttribute('data-original-text');
    }
    // 恢復原來的修改按鈕
    row.cells[row.cells.length - 1].innerHTML = `<button class="modify-btn">修改</button>
                                                <button class="delete-btn">刪除</button>`;
    addEditButtonEventListener(row.cells[row.cells.length - 1].getElementsByClassName('modify-btn')[0]);
}

// 為修改按鈕添加事件處理器
function addEditButtonEventListener(button) {
    button.addEventListener('click', function() {
        let row = this.parentNode.parentNode;
        makeRowEditable(row);
    });
}

// 為所有修改按鈕添加事件處理器
function addEditButtonEventListeners() {
    const editButtons = document.querySelectorAll('.modify-btn');
    editButtons.forEach(addEditButtonEventListener);
}

// 在頁面加載時添加測試帳號
window.onload = function() {
    fetchAccounts();
    addTestAccount(); // 添加測試帳號
    addEditButtonEventListeners();
};