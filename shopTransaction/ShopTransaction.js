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
            statusTable.innerHTML += `
                <tr>
                    <td>${transaction.transaction_uuid}</td>
                    <td>${transaction.account_uuid}</td>
                    <td>${transaction.products.transaction_product_logs[0].product_name}</td>
                    <td>${transaction.status}</td>
                    <td>${transaction.order_time}</td>
                    <td>${transaction.receive_time}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error fetching data:', error.message);
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
