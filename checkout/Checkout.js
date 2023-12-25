let shopping = [];

// Display shopping cart content
function displayShopping(coupon = 1) {
    // Retrieve the shopping cart data from the query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const cartParam = urlParams.get('cart');
    if (cartParam) {
        try {
            // Parse the JSON string to get the shopping cart array
            shopping = JSON.parse(decodeURIComponent(cartParam));
        } catch (error) {
            console.error('Error parsing shopping cart data:', error);
        }
    }

    // Perform checkout logic with the shopping cart data
    console.log('Checkout successful! Items purchased:', shopping);
    
    var cartItem = document.getElementById('cartItem'); // Corrected ID here
    cartItem.innerHTML = '';
    // Add table headers
    var headerRow = cartItem.insertRow(0);
    var headerCell1 = headerRow.insertCell(0);
    var headerCell2 = headerRow.insertCell(1);
    var headerCell3 = headerRow.insertCell(2);
    headerCell1.textContent = 'Item Name';
    headerCell2.textContent = 'Quantity';
    headerCell3.textContent = 'Price';
    
    var cost = 0;
    // Add table content
    shopping.forEach(function (item, index) {
        var row = cartItem.insertRow(index + 1); // Index + 1 to skip the header row
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.textContent = item.name;
        cell2.textContent = item.quantity;
        cell3.textContent = item.quantity * item.price;
        cost += item.quantity * item.price;
    });
    console.log(cost);
    console.log(coupon);
    console.log(cost * coupon);
    const totalCost = document.getElementById('totalCost');
    totalCost.innerHTML = `<h2>total cost: ${cost * coupon}</h2>`;
}

// Apply coupon function
function applyCoupon() {
    var couponInput = document.getElementById('coupon');
    var message = document.getElementById('message');

    if (couponInput.value.trim() === 'SAVE10') {
        message.textContent = 'Coupon applied successfully!';
        displayShopping(0.1);
    } else {
        message.textContent = 'Invalid coupon code.';
    }
}

// Checkout function
function checkout() {
    console.log('Checkout successful! Items purchased:', shopping);
    alert('Checkout successful!');
    clearShoppingCartCookie();
    window.location.href = '../home/Index.html';
}

// Continue shopping function
function continueShopping() {
    window.location.href = '../home/Index.html';
}

displayShopping();