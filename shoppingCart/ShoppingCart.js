let shoppingCart = [];

// // Function to get the shopping cart from local storage
// function getShoppingCart() {
//     const storedCart = localStorage.getItem('shoppingCart');
//     return storedCart ? JSON.parse(storedCart) : [];
// }

// // Function to save the shopping cart to local storage
// function saveShoppingCart(cart) {
//     localStorage.setItem('shoppingCart', JSON.stringify(cart));
// }

// Function to save the shopping cart items in a cookie
function saveShoppingCartToCookie() {
    // Convert the shoppingCart array to a JSON string
    const cartString = JSON.stringify(shoppingCart);
    
    // Set the cookie with the shopping cart data
    document.cookie = `shoppingCart=${cartString}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

// Function to load the shopping cart items from a cookie
function loadShoppingCartFromCookie() {
    // Retrieve the shopping cart data from the cookie
    const cartString = getCookie('shoppingCart');

    try {
        // Check if the cartString is empty or null
        if (cartString && cartString.trim() !== '') {
            // Attempt to parse the JSON string to get the shopping cart array
            shoppingCart = JSON.parse(cartString);
        } else {
            // If cartString is empty or null, initialize shoppingCart with an empty array
            shoppingCart = [];
        }
    } catch (error) {
        // Handle the error (e.g., log it or set shoppingCart to an empty array)
        console.error('Error parsing JSON data:', error);
        shoppingCart = [];
    }
}

// Function to clear the shopping cart cookie
function clearShoppingCartCookie() {
    document.cookie = 'shoppingCart=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}

// Helper function to get the value of a cookie by name
function getCookie(cookieName) {
    const name = `${cookieName}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return '';
}

// Check if the page is one of the shared pages
const sharedPages = ['/home/Index.html', '/shopManager/Shop.html', '/checkout/Checkout.html', '/productDetail/ProductDetail.html', /* Add other shared pages here */];
const currentPage = window.location.pathname;

if (sharedPages.includes(currentPage)) {
    // Load the shopping cart from the cookie on shared pages
    window.addEventListener('load', loadShoppingCartFromCookie);

    // // Add logic to clear the cookie on page refresh (F5)
    // window.addEventListener('beforeunload', clearShoppingCartCookie);
}

// window.addEventListener('unload', function () {
//     // Clear the shopping cart cookie when the user closes the browser tab or window
//     clearShoppingCartCookie();
// });

function toggleCart() {
    const cartPopup = document.getElementById('cart-popup');
    cartPopup.innerHTML = ''; // Clear previous content

    // console.log(shoppingCart);
    if (cartPopup.style.display === 'none' || cartPopup.style.display === '') {
        // Show cart content
        cartPopup.style.display = 'block';
        showCartItems();
    } else {
        // Hide cart content
        cartPopup.style.display = 'none';
    }
}

// Function to check if the user has an account token in the cookie
function hasAccountToken() {
    var token = getCookie("token");
    return token !== null && token !== "";
}

// Function to get the value of a cookie by name
function getCookie(name) {
    var cookies = document.cookie.split("; ");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].split("=");
        if (cookie[0] === name) {
            return cookie[1];
        }
    }
    return null;
}

// Function to redirect to checkout page
function redirectToCheckout() {
    if (hasAccountToken()){
        // Implement the logic to navigate to the checkout page
        console.log('Redirecting to checkout page');

        // Implement the logic to navigate to the checkout page
        // Pass the shopping cart data to the checkout page using query parameters
        const queryString = `?cart=${encodeURIComponent(JSON.stringify(shoppingCart))}`;
        const checkoutPageUrl = '../checkout/Checkout.html' + queryString; // Replace 'Checkout.html' with your actual checkout page URL
        window.location.href = checkoutPageUrl;
    }
    else {
        // Redirect to the login page if there is no account token
        console.log('Redirecting to login page');
        alert('please login your account\nor create an new account to login')
        window.location.href = '../login/Login.html'; // Replace with your actual login page URL
    }
}

function showCartItems() {
    const cartPopup = document.getElementById('cart-popup');
    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.onclick = toggleCart;
    closeButton.style.position = 'absolute';
    closeButton.style.bottom = '10px';  // Adjust the bottom spacing as needed
    closeButton.style.right = '10px';  // Adjust the right spacing as needed
    cartPopup.appendChild(closeButton);

    if (shoppingCart.length === 0) {
        const emptyText = document.createElement('div');
        emptyText.innerHTML = `<h2>Cart is empty</h2>`;
        cartPopup.appendChild(emptyText);
    } else {
        const totalAmount = shoppingCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // shoppingCart.forEach(item => {
        // const itemDiv = document.createElement('div');
        // itemDiv.classList.add('item');
        // itemDiv.innerHTML = `
        //     <span>${item.name} (Qty: </span>
        //     <input type="number" min="1" max="${item.stock}" value="${item.quantity}" onchange="updateQuantity('${item.id}', this.value)">
        //     <span>)</span>
        //     <div>$${item.price * item.quantity}</div>
        //     <button onclick="removeItem('${item.id}')">Remove</button>
        // `;
        // cartPopup.appendChild(itemDiv);
        // });
        // Create a div element to wrap the shopping cart table
        const tableContainer = document.createElement('div');
        tableContainer.classList.add('shopping-cart-container');
        // 創建一個<table>元素
        const table = document.createElement('table');
        table.classList.add('shopping-cart-table');

        // 使用forEach遍歷shoppingCart中的每個商品項目
        shoppingCart.forEach(item => {
            // 創建一個<tr>元素，表示一個商品項目
            const row = document.createElement('tr');
            row.classList.add('item-row');

            // 使用<td>元素來呈現每個商品項目的不同部分
            const nameCell = document.createElement('td');
            nameCell.classList.add('item-cell');
            nameCell.textContent = item.name;
            row.appendChild(nameCell);

            const quantityCell = document.createElement('td');
            quantityCell.classList.add('item-cell', 'qty-cell');
            quantityCell.innerHTML = `
                <span>(Qty: </span>
                <input type="number" min="1" max="${item.stock}" value="${item.quantity}" onchange="updateQuantity('${item.id}', this.value)">
                <span>)</span>
            `;
            row.appendChild(quantityCell);

            const priceCell = document.createElement('td');
            priceCell.classList.add('item-cell');
            priceCell.textContent = `$${item.price * item.quantity}`;
            row.appendChild(priceCell);

            const removeCell = document.createElement('td');
            removeCell.classList.add('item-cell', 'button-cell');
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.onclick = () => removeItem(item.id);
            removeCell.appendChild(removeButton);
            row.appendChild(removeCell);

            // 把這一行商品項目添加到表格中
            table.appendChild(row);            
        });
        
        // Append the table to the container
        tableContainer.appendChild(table);

        // Append the container to the cartPopup
        cartPopup.appendChild(tableContainer);
        
        const totalDiv = document.createElement('div');
        totalDiv.innerHTML = `<strong>Total:</strong> $${totalAmount}`;
        cartPopup.appendChild(totalDiv);

        // Add a Checkout button
        const checkoutButton = document.createElement('button');
        checkoutButton.innerText = 'Checkout';
        checkoutButton.onclick = redirectToCheckout; // Use your checkout function here
        checkoutButton.style.marginTop = '10px'; // Add some spacing from the total
        checkoutButton.classList.add('checkout-button'); // Optionally, add a class for styling
        cartPopup.appendChild(checkoutButton);
    }
}

function addItemToCart(item) {
    // console.log(item.id);
    const existingItem = shoppingCart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        if (existingItem.quantity + 1 > existingItem.stock) {
            existingItem.quantity = existingItem.stock;
        }
        else {
            existingItem.quantity += 1;
        }
    } else {
        shoppingCart.push({ ...item, quantity: 1 });
    }

    // saveShoppingCart(shoppingCart);
    saveShoppingCartToCookie();
    // console.log(shoppingCart);
    // toggleCart();
}

function addItemToCartWithQuantity(item, num) {
    // console.log(item.id);
    const existingItem = shoppingCart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        if (existingItem.quantity + num > existingItem.stock) {
            existingItem.quantity = existingItem.stock;
        }
        else {
            existingItem.quantity += num;
        }
    } else {
        shoppingCart.push({ ...item, quantity: num });
    }

    // saveShoppingCart(shoppingCart);
    saveShoppingCartToCookie();
    // console.log(shoppingCart);
    // toggleCart();
}

function removeItem(itemId) {
    const index = shoppingCart.findIndex(item => item.id === itemId);

    if (index !== -1) {
        shoppingCart.splice(index, 1);
    }

    // Clear the cartPopup and show the updated items
    const cartPopup = document.getElementById('cart-popup');
    cartPopup.innerHTML = '';
    // saveShoppingCart(shoppingCart);
    saveShoppingCartToCookie();
    showCartItems();
}

function updateQuantity(itemId, newQuantity) {
    // console.log(itemId);
    // console.log(typeof(itemId));
    // console.log(shoppingCart);
    console.log(`Updating quantity for item ${itemId} to ${newQuantity}`);
    const itemToUpdate = shoppingCart.find(item => item.id === itemId);
    const parsedQuantity = parseInt(newQuantity, 10);

    if (itemToUpdate && parsedQuantity >= 1) {
        itemToUpdate.quantity = parsedQuantity;
        // saveShoppingCart(shoppingCart);
        saveShoppingCartToCookie();
    } else {
        console.error(`Item with ID ${itemId} not found in the shopping cart.`);
    }

    // Clear the cartPopup and show the updated items
    const cartPopup = document.getElementById('cart-popup');
    cartPopup.innerHTML = '';
    // saveShoppingCart(shoppingCart);
    saveShoppingCartToCookie();
    showCartItems();
}

function testAddItem() {
    const item = {id: "1", name: 'Item 1', price: 50, stock: 5, shopID: "1"};
    addItemToCart(item);
}

// Example items
// const item1 = { id: "5", name: 'Item 1', price: 20, stock: 5 };
// const item2 = { id: "2", name: 'Item 2', price: 30, stock: 5 };

// addItemToCart(item1);
// addItemToCart(item2);
