async function fetchData() {
    console.log("in transaction page fetch data");
    try {
        const response = await fetch('http://localhost:8000/api/transaction/?target=Shop', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + getCookie('token')
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from the API');
        }

        const data = await response.json();
        const statusTable = document.querySelector("#transactionsTable tbody");
        data.transactions.forEach(transaction => {
            console.log(transaction);
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${transaction.transaction_uuid}</td>
                <td>${transaction.account_uuid}</td>
                <td class="product">${transaction.products.transaction_product_logs[0].product_name}</td>
                <td class="status">${transaction.status}</td>
                <td class="order-time">${transaction.order_time}</td>
                <td class="receive-time">${transaction.receive_time}</td>
                <td><button class="edit-btn">Edit</button></td>
            `;

            row.querySelector('.edit-btn').addEventListener('click', () => handleEdit(row, transaction));

            statusTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

function handleEdit(row, transaction) {
    const statusCell = row.querySelector('.status');
    const receiveTimeCell = row.querySelector('.receive-time');

    // Create dropdown for status
    const statusSelect = document.createElement('select');
    statusSelect.innerHTML = `
        <option value="Ordered" ${transaction.status === 'Ordered' ? 'selected' : ''}>Ordered</option>
        <option value="Delivering" ${transaction.status === 'Delivering' ? 'selected' : ''}>Delivering</option>
        <option value="Arrived" ${transaction.status === 'Arrived' ? 'selected' : ''}>Arrived</option>
        <option value="Canceled" ${transaction.status === 'Canceled' ? 'selected' : ''}>Canceled</option>
    `;

    // Create input for receive-time
    const receiveTimeInput = document.createElement('input');
    receiveTimeInput.type = 'date';
    receiveTimeInput.value = transaction.receive_time;

    // Replace cell content with editable elements
    //productCell.innerHTML = `<input type="text" value="${transaction.products.transaction_product_logs[0].product_name}">`;
    statusCell.innerHTML = '';
    statusCell.appendChild(statusSelect);
    receiveTimeCell.innerHTML = '';
    receiveTimeCell.appendChild(receiveTimeInput);
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Call the fetchData function when the page loads
fetchData();
