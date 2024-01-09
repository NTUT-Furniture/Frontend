
    //         try {
    //             const response = await fetch('http://localhost:8000/api/transaction/?target=Shop', {
    //                 method: 'GET',
    //                 headers: {
    //                     'Accept': 'application/json',
    //                     'Authorization': 'Bearer ' + getCookie('token')
    //                 }
    //             });
    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch data from the API');
    //             }
        
    //             const data = await response.json();
    //             // Header row
    //             statusTable.innerHTML = `
    //                 <tr>
    //                     <th>Transaction ID</th>
    //                     <th>Customer ID</th>
    //                     <th>Product Name</th>
    //                     <th>Status</th>
    //                     <th>Date Ordered</th>
    //                     <th>Expected Delivery Date</th>
    //                 </tr>
    //             `;
        
    //             // Data rows
    //             data.transactions.forEach(transaction => {
    //                 console.log(transaction);
    //                 if (transaction.products.transaction_product_logs[0].product_name != businessCardData.name){
    //                     return;
    //                 }
    //                 statusTable.innerHTML += `
    //                     <tr>
    //                         <td>${transaction.transaction_uuid}</td>
    //                         <td>${transaction.account_uuid}</td>
    //                         <td>${transaction.products.transaction_product_logs[0].product_name}</td>
    //                         <td>${transaction.status}</td>
    //                         <td>${transaction.order_time}</td>
    //                         <td>${transaction.receive_time}</td>
    //                     </tr>
    //                 `;
    //             });
