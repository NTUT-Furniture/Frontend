async function showOrderRecord() {
    try {
        // Fetch data from API
        const baseURL = "https://nfta.noobdy.com";
        const response = await fetch(`${baseURL}/api/transaction/?target=Account`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + getCookie('token')
            }
        });
        const data = await response.json();
        console.log(data);
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
            const productNames = transaction.products.transaction_product_logs.map(product => product.product_name).join('<br>');
            let discountDisplay = '';
            if (1 > transaction.discount > 0) {
                const discountPercentage = ((1 - transaction.discount) * 100).toFixed(0);
                discountDisplay = `<span class="discount"> ${discountPercentage}% off</span>`;
            }
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${new Date(transaction.order_time).toLocaleDateString()}</td>
                <td>${productNames}</td>
                <td>${transaction.total_price} ${discountDisplay}</td> <!-- 同時顯示價格和折扣 -->
                <td>${transaction.status}</td>
                <td><a href="javascript:void(0);" style="color: initial;" id="detail-status-${index}" onclick="toggleOpenDetail('detail-${index}' ,${index})">Open</a></td>
            `;
            tbody.appendChild(tr);
        
            const detailTr = document.createElement('tr');
            detailTr.id = `detail-${index}`;
            detailTr.style.display = 'none';
            detailTr.innerHTML = `
                <td colspan="5">
                    <table>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                        ${transaction.products.transaction_product_logs.map(product => `
                            <tr>
                                <td>
                                    <span class="product-name-tooltip">${product.product_name}
                                        <span class="product-description">${product.product_description}</span>
                                    </span>
                                </td>
                                <td>${product.quantity}</td>
                                <td>${product.price}</td>
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

function toggleOpenDetail(detailId,index) {
    const detailRow = document.getElementById(detailId);
    const status = document.getElementById(`detail-status-${index}`)
    if (detailRow) {
        detailRow.style.display = detailRow.style.display === 'none' ? '' : 'none';
        status.innerHTML = status.innerHTML === 'Open' ? 'Close' :'Open';
    }
}
