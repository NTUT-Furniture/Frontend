// script.js

let shoppingCart = [];

// Function to get the shopping cart from local storage
function getShoppingCart() {
    const storedCart = localStorage.getItem('shoppingCart');
    return storedCart ? JSON.parse(storedCart) : [];
}

// Function to save the shopping cart to local storage
function saveShoppingCart(cart) {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

function toggleCart() {
    const cartPopup = document.getElementById('cart-popup');
    cartPopup.innerHTML = ''; // Clear previous content

    if (cartPopup.style.display === 'none' || cartPopup.style.display === '') {
        // Show cart content
        cartPopup.style.display = 'block';
        showCartItems();
    } else {
        // Hide cart content
        cartPopup.style.display = 'none';
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

        shoppingCart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        itemDiv.innerHTML = `
            <span>${item.name} (Qty: </span>
            <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)">
            <span>)</span>
            <div>$${item.price * item.quantity}</div>
            <button onclick="removeItem(${item.id})">Remove</button>
        `;
        cartPopup.appendChild(itemDiv);
        });

        const totalDiv = document.createElement('div');
        totalDiv.innerHTML = `<strong>Total:</strong> $${totalAmount}`;
        cartPopup.appendChild(totalDiv);
    }
}

function addItemToCart(item) {
    const existingItem = shoppingCart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        shoppingCart.push({ ...item, quantity: 1 });
    }

    saveShoppingCart(shoppingCart);
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
    saveShoppingCart(shoppingCart);
    showCartItems();
}

function updateQuantity(itemId, newQuantity) {
    const parsedQuantity = parseInt(newQuantity, 10);
    if (!isNaN(parsedQuantity) && parsedQuantity >= 1) {
        const item = shoppingCart.find(item => item.id === itemId);
        if (item) {
        item.quantity = parsedQuantity;
        }
    }

    // Clear the cartPopup and show the updated items
    const cartPopup = document.getElementById('cart-popup');
    cartPopup.innerHTML = '';
    saveShoppingCart(shoppingCart);
    showCartItems();
}

function testAddItem() {
    const item = {id: 1, name: 'Item 1', price: 50};
    addItemToCart(item);
}

// Example items
const item1 = { id: 5, name: 'Item 1', price: 20 };
const item2 = { id: 2, name: 'Item 2', price: 30 };

addItemToCart(item1);
addItemToCart(item2);
