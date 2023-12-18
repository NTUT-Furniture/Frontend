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
    const totalAmount = shoppingCart.reduce((sum, item) => sum + item.price, 0);

    shoppingCart.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item');
      itemDiv.innerHTML = `
        <div>${item.name}</div>
        <div>$${item.price}</div>
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
  shoppingCart.push(item);
  toggleCart();
}

function removeItem(itemId) {
  shoppingCart = shoppingCart.filter(item => item.id !== itemId);
  const cartPopup = document.getElementById('cart-popup');
  cartPopup.innerHTML = ''; // Clear previous content
  showCartItems();
}

// Example items
const item1 = { id: 1, name: 'Item 1', price: 20 };
const item2 = { id: 2, name: 'Item 2', price: 30 };

addItemToCart(item1);
addItemToCart(item2);
