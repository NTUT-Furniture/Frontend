async function showOrderRecord() {
    try {
        // Fetch data from API
        const response = await fetch('http://localhost:8000/api/transaction/?account_uuid=' + getCookie('account_uuid'), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + getCookie('token')
            }
        });
        const data = await response.json();

        const container = document.getElementById('content');
        container.innerHTML = '';
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Order Date</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Detail</th>
            </tr>
        `;
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        data.transactions.forEach((transaction, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${new Date(transaction.order_time).toLocaleDateString()}</td>
                <td>Multiqqqqqqqqqqqqqqqqqqqqqqqqqple Products</td>
                <td>Varies</td>
                <td>${transaction.status}</td>
                <td><a href="javascript:void(0);" onclick="toggleOpenDetail('detail-${index}')">Open</a></td>
            `;
            tbody.appendChild(tr);

            const detailTr = document.createElement('tr');
            detailTr.id = `detail-${index}`;
            detailTr.style.display = 'none';
            detailTr.innerHTML = `
                <td colspan="5">
                    <table>
                        ${transaction.products.map(product => `
                            <tr>
                                <td>${product.product_uuid.substring(0, 5)}</td>
                                <td>${product.quantity}</td>
                                <td>Money</td>
                            </tr>
                        `).join('')}
                    </table>
                </td>
            `;
            tbody.appendChild(detailTr);
        });

        table.appendChild(tbody);
        container.appendChild(table);
    } catch (error) {
        console.error('Error fetching order records:', error);
    }
}

function toggleOpenDetail(detailId) {
    const detailRow = document.getElementById(detailId);
    if (detailRow) {
        detailRow.style.display = detailRow.style.display === 'none' ? '' : 'none';
    }
}
