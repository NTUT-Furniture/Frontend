// script.js

let shoppingCart = [];

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

  if (shoppingCart.length === 0) {
    cartPopup.innerHTML = '<h2>Cart is empty</h2>';
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

  toggleCart();
}

function removeItem(itemId) {
  const index = shoppingCart.findIndex(item => item.id === itemId);

  if (index !== -1) {
    shoppingCart.splice(index, 1);
  }

  // Clear the cartPopup and show the updated items
  const cartPopup = document.getElementById('cart-popup');
  cartPopup.innerHTML = '';
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
  showCartItems();
}

// Example items
const item1 = { id: 1, name: 'Item 1', price: 20 };
const item2 = { id: 2, name: 'Item 2', price: 30 };

addItemToCart(item1);
addItemToCart(item2);
