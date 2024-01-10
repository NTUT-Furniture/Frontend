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
        <option value="Cancelled" ${transaction.status === 'Canceled' ? 'selected' : ''}>Canceled</option>
    `;

    // Create input for receive-time
    const receiveTimeInput = document.createElement('input');
    receiveTimeInput.type = 'date';
    receiveTimeInput.value = transaction.receive_time;

    // Create Save and Cancel buttons
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.classList.add('confirm-btn');
    saveButton.addEventListener('click', () => handleSave(row, transaction, statusSelect, receiveTimeInput));

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.classList.add('cancel-btn');
    cancelButton.addEventListener('click', () => handleCancel(row, transaction));

    // Hide the Edit button
    const editButtonCell = row.querySelector('.edit-btn');
    editButtonCell.style.display = 'none';

    // Replace cell content with editable elements
    statusCell.innerHTML = '';
    statusCell.appendChild(statusSelect);
    receiveTimeCell.innerHTML = '';
    receiveTimeCell.appendChild(receiveTimeInput);

    // Add Save and Cancel buttons
    const buttonCell = row.querySelector('.edit-btn').parentNode;
    buttonCell.appendChild(saveButton);
    buttonCell.appendChild(cancelButton);
}

function handleSave(row, transaction, statusSelect, receiveTimeInput) {
        // Retrieve the transaction id
        const transactionId = transaction.transaction_uuid;
        // Retrieve the updated status and receive time
        const updatedStatus = statusSelect.value;
        let updatedReceiveTime = receiveTimeInput.value;
        if (updatedReceiveTime) {
            updatedReceiveTime += "T00:00:00";
        }
        // Determine the API endpoint based on the selected status
        let apiEndpoint;
        if (updatedStatus === 'Arrived') {
            apiEndpoint = `http://localhost:8000/api/transaction/${transactionId}?receive_time=${updatedReceiveTime}&status=${updatedStatus}`;
        } else {
            apiEndpoint = `http://localhost:8000/api/transaction/${transactionId}?status=${updatedStatus}`;
        }
    
        // Make the API call to update the data
        fetch(apiEndpoint, {
            method: 'PUT', // Assuming the API supports the PUT method for updating
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie('token')
            },
            // You can customize the body based on the API requirements
            // For example, you might send a JSON object with updated fields
            body: JSON.stringify({
                receive_time: updatedReceiveTime, // Include this only if status is 'Arrived'
                status: updatedStatus
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update data');
            }
            return response.json();
        })
        .then(updatedData => {
            // Update the row with the new values
            row.querySelector('.status').textContent = updatedStatus;
            row.querySelector('.receive-time').textContent = updatedReceiveTime;
    
            // Show the Edit button again
            showEditButton(row);
        })
        .catch(error => {
            console.error('Error updating data:', error.message);
            // Handle error as needed
        });


    // Show the Edit button again
    showEditButton(row);
}

function handleCancel(row, transaction) {
    // Restore the original values
    row.querySelector('.status').textContent = transaction.status;
    row.querySelector('.receive-time').textContent = transaction.receive_time;

    // Show the Edit button again
    showEditButton(row);
}

function showEditButton(row) {
    // Show the Edit button and remove Save and Cancel buttons
    const editButtonCell = row.querySelector('.edit-btn');
    editButtonCell.style.display = 'block';

    const buttonCell = editButtonCell.parentNode;
    const saveButton = buttonCell.querySelector('.confirm-btn');
    const cancelButton = buttonCell.querySelector('.cancel-btn');

    if (saveButton) {
        buttonCell.removeChild(saveButton);
    }

    if (cancelButton) {
        buttonCell.removeChild(cancelButton);
    }
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
