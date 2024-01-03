function subscribeSetting() {
    const url = `http://localhost:8000/api/subscription/account?uuid_type=account_uuid&uuid=${getCookie('account_uuid')}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${getCookie('token')}` // Replace with your method to get the token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        return Promise.all(data.subscriptions.map(subscription => 
            fetch(`http://localhost:8000/api/shop/?shop_uuid=${subscription.uuid}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(shopDetails => ({
                ...subscription,
                ...shopDetails 
            }))
        ));
    })
    .then(updatedSubscriptions => {
        const tableHtml = createTable(updatedSubscriptions);
        document.getElementById('content').innerHTML = tableHtml;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('content').innerHTML = `
        <table border="1">
        <tr><th>Shop Name</th><th>Shop Details</th></tr>
        <td colspan="2">Doesn't subscribe any shop yet!</td>
        </table>
        `;
    });
}

function createTable(subscriptions) {
    let table = '<table border="1">';
    table += '<tr><th>Shop Name</th><th>Shop Details</th><th>Action</th></tr>'; // Table headers

    subscriptions.forEach(subscription => {
        table += `<tr>`;
        table += `<td>${subscription.name}</td>`;
        table += `<td>${subscription.description}</td>`;
        table += `<td><button class="delete-button" onclick="deleteSubscription('${subscription.uuid}')">Delete</button></td>`;
        table += `</tr>`;
    });

    table += '</table>';
    return table;
}

async function deleteSubscription(shopUuid) {
    try {
        const token = getCookie('token');
        const accountUuid = getCookie('account_uuid');
        const url = `http://localhost:8000/api/subscription/unsubscribe?shop_uuid=${shopUuid}&account_uuid=${accountUuid}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Subscription deleted successfully');
        subscribeSetting();
    } catch (error) {
    }
}
