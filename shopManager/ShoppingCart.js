document.addEventListener('DOMContentLoaded', function () {
    // Create a floating table container

    console.log('ShoppingCart.js is executed!');
    const floatingTableContainer = document.createElement('div');
    floatingTableContainer.id = 'floating-table-container';

    // Create a table element
    const table = document.createElement('table');
    table.id = 'floating-table';

    // Add table headers
    const headers = ['Product', 'Price', 'Stock'];
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Add some sample data (replace this with your actual product data)
    const products = [
        {product: 'Product A', price: '$50', stock: 20},
        {product: 'Product B', price: '$30', stock: 15},
        {product: 'Product C', price: '$40', stock: 25},
    ];

    // Add table rows with product information
    products.forEach(product => {
        const row = document.createElement('tr');
        Object.values(product).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    // Append the table to the floating table container
    floatingTableContainer.appendChild(table);

    // Add a "Shopping Cart" button
    const shoppingCartBtn = document.createElement('button');
    shoppingCartBtn.textContent = 'Add to Cart';

    // Add click event listener to the "Shopping Cart" button
    shoppingCartBtn.addEventListener('click', function () {
        // Add your shopping cart logic here
        alert('Product added to the Shopping Cart!');
    });

    // Append the "Shopping Cart" button to the floating table container
    floatingTableContainer.appendChild(shoppingCartBtn);

    // Append the floating table container to the body
    document.body.appendChild(floatingTableContainer);

    // Add styles to the floating table container (you can customize these styles)
    floatingTableContainer.style.position = 'fixed';
    floatingTableContainer.style.top = '20px';
    floatingTableContainer.style.right = '20px';
    floatingTableContainer.style.backgroundColor = '#fff';
    floatingTableContainer.style.border = '1px solid #ddd';
    floatingTableContainer.style.padding = '10px';
    floatingTableContainer.style.borderRadius = '5px';
});
