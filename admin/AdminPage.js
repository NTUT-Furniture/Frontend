// 假設您的後端 API 端點為 "/api/accounts"
async function fetchAccounts() {
    console.log("fetch account API");
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
        console.log(data);
        data.accounts.forEach(account => {
            account.shop_uuid = "1ed02a41-4413-4374-b437-8c04856cf4b9";
            account.shop_name = "Garry\'s for test";
            account.shop_is_active = "0";
            renderRow(account);
        });
        addEditButtonEventListeners();
    } catch (error) {
        console.error('Error:', error);
    }
}

function clearTable() {
    const table = document.getElementById("accountsTable");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
}

function renderRow(account) {
    const table = document.getElementById("accountsTable");
    console.log(table);
    let row = table.insertRow();
    console.log(row);
    row.insertCell(0).innerHTML = account.account_uuid || '';
    row.insertCell(1).innerHTML = account.name || '';
    row.insertCell(2).innerHTML = '******'; // 隱藏敏感資訊
    // row.insertCell(3).innerHTML = account.imageURL || ''; // 如果您的資料中包含 imageURL
    row.insertCell(3).innerHTML = account.email || '';
    row.insertCell(4).innerHTML = account.phone || '';
    row.insertCell(5).innerHTML = account.credit_card || ''; // 隱藏信用卡資訊
    row.insertCell(6).innerHTML = account.birthday ? formatDate(account.birthday) : '';
    row.insertCell(7).innerHTML = account.address || '';
    let isActiveCell = row.insertCell(8);
    isActiveCell.innerHTML = account.is_active ? 'Yes' : 'No';
    if (account.is_active) {
        isActiveCell.style.backgroundColor = 'green';
    } else {
        isActiveCell.style.backgroundColor = 'red';
    }
    row.insertCell(9).innerHTML = formatDate(account.update_time);

    let actionsCell = row.insertCell(10);
    console.log(account.is_active);
    actionsCell.innerHTML = `<button class="modify-btn">Edit</button>
                             <button class="delete-btn">${account.is_active ? 'Ban':"UnBan"}</button>`;
    row.insertCell(11).innerHTML = account.shop_uuid || '';
    row.insertCell(12).innerHTML = account.shop_name || '';
    row.insertCell(13).innerHTML = account.shop_is_active || '';
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
        if ([0, 3, 8, 9,10,11,12].includes(i)) continue;
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
    let actionsCell = row.cells[10];
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
    try {
        const response = await fetch(`http://localhost:8000/api/account/?` +
            `account_uuid=${account_uuid}&`+
            (name ? `name=${encodeURIComponent(name)}&` : '') +
            (pwd ? `pwd=${encodeURIComponent(pwd)}&` : '') +
            (phone ? `phone=${encodeURIComponent(phone)}&` : '') +
            (credit_card ? `credit_card=${encodeURIComponent(credit_card)}&` : '') +
            (birthday ? `birthday=${encodeURIComponent(birthday)}&` : '') +
            (address ? `address=${encodeURIComponent(address)}` : ''), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization':"Bearer " + getCookie('token'),
                },
            });
        const data = await response.json();
        console.log(data);
        clearTable();
        fetchAccounts();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

async function makeRowBan(row) {
    const account_uuid = row.cells[0].textContent;
    const button = row.cells[10].querySelector('.delete-btn');
    const isBanning = button.textContent.trim() === 'Ban';

    console.log(`Ban You? ${isBanning ? 0 : 1}`)
    const apiUrl = `http://localhost:8000/api/account/?account_uuid=${account_uuid}&is_active=${isBanning ? 0 : 1}`;
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + getCookie('token'),
            'Content-Type': 'application/json'
        },
    };

    try {
        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        clearTable();
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
    let actionsCell = row.cells[10];
    console.log(row.cells[8].innerHTML);
    actionsCell.innerHTML = `<button class="modify-btn">Edit</button>
                             <button class="delete-btn">${row.cells[8].innerHTML ? 'Ban':"UnBan"}</button>`;
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
    console.log("add Ban event")
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
    const rows = Array.from(tHead.querySelectorAll("tr:nth-child(n+2)"));
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

function validateEmail(email) {
    // console.log(email);
    var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    // console.log(re.test(email));
    return re.test(email);
}

function submitForm() {
    var formElement = document.getElementById('addAccountForm');
    var formData = new FormData(formElement);
    var password = formData.get('password');
    var confirmPassword = formData.get('confirmPassword');
    var email = formData.get('email');
    console.log(formData);

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }
    else if (!validateEmail(email)) {
        alert("E-mail format is not correct.");
        return;
    }
    else {
        fetch(`http://localhost:8000/api/account/?` +
        (formData.get('name') ? `name=${encodeURIComponent(formData.get('name'))}&` : '') +
        (formData.get('password') ? `pwd=${encodeURIComponent(formData.get('password'))}&` : '') +
        // (formData.get('imageURL') ? `image_url=${encodeURIComponent(formData.get('imageURL'))}&` : '') // 如果启用图片URL
        (formData.get('email') ? `email=${encodeURIComponent(formData.get('email'))}&` : '') +
        (formData.get('phone') ? `phone=${encodeURIComponent(formData.get('phone'))}&` : '') +
        (formData.get('card') ? `credit_card=${encodeURIComponent(formData.get('card'))}&` : '') +
        (formData.get('birthday') ? `birthday=${encodeURIComponent(formData.get('birthday'))}&` : '') +
        (formData.get('address') ? `address=${encodeURIComponent(formData.get('address'))}` : ''), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.access_token!==undefined) {
                alert('Create successful!');
            }
            else {
                alert('Create Account Error');
            }
            closeModal();
            clearTable();
            fetchAccounts();
        })
        .catch(error => {
            console.error('API Error:', error);
        });
    }
}