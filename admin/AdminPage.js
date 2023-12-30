// 假設您的後端 API 端點為 "/api/accounts"
async function fetchAccounts() {
    const apiUrl = 'http://localhost:8000/api/account/all';
    const requestOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + getCookie('token') // 確保 getCookie 函數是可用的
        }
    };
    try {
        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        data.accounts.forEach(account => {
            renderRow(account);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderRow(account) {
    const table = document.getElementById("accountsTable");
    let row = table.insertRow();
    row.insertCell(0).innerHTML = account.account_uuid || '';
    row.insertCell(1).innerHTML = account.name || '';
    row.insertCell(2).innerHTML = '******'; // 隱藏敏感資訊
    // row.insertCell(3).innerHTML = account.imageURL || ''; // 如果您的資料中包含 imageURL
    row.insertCell(3).innerHTML = account.email || '';
    row.insertCell(4).innerHTML = account.phone || '';
    row.insertCell(5).innerHTML = account.credit_card || ''; // 隱藏信用卡資訊
    row.insertCell(6).innerHTML = account.birthday ? formatDate(account.birthday) : '';
    row.insertCell(7).innerHTML = account.address || '';
    // row.insertCell(8).innerHTML = account.is_active ? 'Yes' : 'No ';
    let isActiveCell = row.insertCell(8);
    isActiveCell.innerHTML = account.is_active ? 'Yes' : 'No';
    if (account.is_active) {
        isActiveCell.style.backgroundColor = 'green';
    } else {
        isActiveCell.style.backgroundColor = 'red';
    }
    row.insertCell(9).innerHTML = formatDate(account.update_time);

    let actionsCell = row.insertCell(10);
    actionsCell.innerHTML = `<button class="modify-btn">Edit</button>
                             <button class="delete-btn">Ban</button>`;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

// // 添加一筆測試帳號資訊
// function addTestAccount() {
//     const testAccount = {
//         id: "1",
//         name: "測試用戶",
//         password:"**********",
//         imageURL: "https://example.com/image.jpg",
//         email: "test@example.com",
//         phone: "1234567890",
//         card: "1234 5678 9012 3456",
//         birthday: "1990-01-01",
//         address: "測試地址 123",
//         // createTime: new Date().toISOString()
//     };

//     renderRow(testAccount);
// }

function makeRowEditable(row) {
    console.log("click modify");
    for (let i = 0; i < row.cells.length - 1; i++) {
        let cell = row.cells[i];
        let cellText = cell.innerHTML;
        cell.setAttribute('data-original-text', cellText);
        // console.log(cellText)
        if ([0, 3, 8, 9].includes(i)) continue;
        cell.innerHTML = '';
        let input = document.createElement('input');
        input.type = 'text';
        if (i === 2) {
            input.type = 'password';
            input.value = '';
        } else if (i === 6) { 
            input.type = 'date';
            input.value = cellText ? cellText : ''; 
        } else {
            input.value = cellText;
        }
        cell.appendChild(input);
    }
    let actionsCell = row.cells[row.cells.length - 1];
    actionsCell.innerHTML = `<button class="confirm-btn">Confirm</button>
                             <button class="cancel-btn">Cancel</button>`;
    actionsCell.getElementsByClassName('confirm-btn')[0].addEventListener('click', () => confirmEdit(row));
    actionsCell.getElementsByClassName('cancel-btn')[0].addEventListener('click', () => cancelEdit(row));
}

async function confirmEdit(row) {
    const account_uuid = row.cells[0].getAttribute('data-original-text');
    const name = row.cells[1].firstChild.value;
    const pwd = row.cells[2].firstChild.value;
    const phone = row.cells[4].firstChild.value;
    const credit_card = row.cells[5].firstChild.value;
    const birthday = row.cells[6].firstChild.value;
    const address = row.cells[7].firstChild.value;
    const is_active = 1;
    const role = 0;
    console.log(row.cells[0].getAttribute('data-original-text'))
    const accountData = {
        name,
        pwd,
        phone,
        credit_card,
        birthday,
        address,
        is_active,
        role
    };

    const apiUrl = `http://localhost:8000/api/account/?account_uuid=${account_uuid}`;
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + getCookie('token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(accountData)
    };

    try {
        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchAccounts();
    } catch (error) {
        console.error('Error:', error);
    }
}

async function makeRowBan(row) {
    const account_uuid = row.cells[0].textContent;
    const accountData = {
        is_active : 0,
    };
    console.log(accountData)
    const apiUrl = `http://localhost:8000/api/account/?account_uuid=${account_uuid}`;
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + getCookie('token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(accountData)
    };

    try {
        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchAccounts();
    } catch (error) {
        console.error('Error:', error);
    }
}

function cancelEdit(row) {
    console.log("Cancel Edit");
    for (let i = 0; i < row.cells.length - 1; i++) {
        let cell = row.cells[i];
        cell.innerHTML = cell.getAttribute('data-original-text') || ''; // 恢复原始数据
    }
    let actionsCell = row.cells[row.cells.length - 1];
    actionsCell.innerHTML = `<button class="modify-btn">Edit</button>
                             <button class="delete-btn">Ban</button>`;
    addEditButtonEventListener(actionsCell.getElementsByClassName('modify-btn')[0]);
}

function addEditButtonEventListener(button) {
    console.log("add edit event")
    button.addEventListener('click', function() {
        let row = this.parentNode.parentNode;
        makeRowEditable(row);
    });
}

function addBanButtonEventListener(button) {
    console.log("add edit event")
    button.addEventListener('click', function() {
        let row = this.parentNode.parentNode;
        makeRowBan(row);
    });
}

function addEditButtonEventListeners() {
    const editButtons = document.querySelectorAll('.modify-btn');
    editButtons.forEach(addEditButtonEventListener);
    const banButtons = document.querySelectorAll('.delete-btn');
    banButtons.forEach(addBanButtonEventListener);
}


function getCookie(cookieName) {
    const cookies = document.cookie;
    const cookieArray = cookies.split('; ');
    const tokenCookie = cookieArray.find(row => row.startsWith(cookieName + '='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
}

function sortTableByColumn(table, column, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tHead = table.tHead;
    const rows = Array.from(tHead.querySelectorAll("tr:nth-child(n+2)")); // 从第二行开始获取行
    const sortedRows = rows.sort((a, b) => {
        const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
        const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    });
    while (tHead.rows.length > 1) {
        tHead.deleteRow(1);
    }
    sortedRows.forEach(row => tHead.appendChild(row));

    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);
}

window.onload = async function() {
    await fetchAccounts();
    //addTestAccount(); // 添加測試帳號
    addEditButtonEventListeners();
    document.querySelectorAll("#accountsTable th.sortable").forEach(headerCell => {
        headerCell.addEventListener("click", () => {
            const tableElement = headerCell.closest("table");
            console.log(tableElement)
            const headerIndex = Array.prototype.indexOf.call(headerCell.parentNode.children, headerCell);
            const currentIsAscending = headerCell.classList.contains("th-sort-asc");
            console.log("clicke table");
            sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
        });
    });
};