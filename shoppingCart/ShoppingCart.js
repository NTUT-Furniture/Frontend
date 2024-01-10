let shoppingCart = [];

function saveShoppingCartToCookie() {
    const cartString = JSON.stringify(shoppingCart);
    
    document.cookie = `shoppingCart=${cartString}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

function loadShoppingCartFromCookie() {
    const cartString = getCookie('shoppingCart');

    try {
        if (cartString && cartString.trim() !== '') {
            shoppingCart = JSON.parse(cartString);
        } else {
            shoppingCart = [];
        }
    } catch (error) {
        console.error('Error parsing JSON data:', error);
        shoppingCart = [];
    }
}

function clearShoppingCartCookie() {
    document.cookie = 'shoppingCart=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}

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

const sharedPages = ['/home/Index.html', '/shopManager/Shop.html', '/checkout/Checkout.html', '/productDetail/ProductDetail.html', /* Add other shared pages here */];
const currentPage = window.location.pathname;

if (sharedPages.includes(currentPage)) {
    window.addEventListener('load', loadShoppingCartFromCookie);
}

function toggleCart() {
    const cartPopup = document.getElementById('cart-popup');
    cartPopup.innerHTML = '';

    if (cartPopup.style.display === 'none' || cartPopup.style.display === '') {
        cartPopup.style.display = 'block';
        showCartItems();
    } else {
        cartPopup.style.display = 'none';
    }
}

function hasAccountToken() {
    var token = getCookie("token");
    return token !== null && token !== "";
}

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

function redirectToCheckout() {
    if (hasAccountToken()){
        console.log('Redirecting to checkout page');

        const queryString = `?cart=${encodeURIComponent(JSON.stringify(shoppingCart))}`;
        const checkoutPageUrl = '../checkout/Checkout.html' + queryString;
        window.location.href = checkoutPageUrl;
    }
    else {
        console.log('Redirecting to login page');
        alert('please login your account\nor create an new account to login')
        window.location.href = '../login/Login.html';
    }
}

function showCartItems() {
    const cartPopup = document.getElementById('cart-popup');
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.onclick = toggleCart;
    closeButton.style.position = 'absolute';
    closeButton.style.bottom = '10px';
    closeButton.style.right = '10px';
    cartPopup.appendChild(closeButton);

    if (shoppingCart.length === 0) {
        const emptyText = document.createElement('div');
        emptyText.innerHTML = `<h2>Cart is empty</h2>`;
        cartPopup.appendChild(emptyText);
    } else {
        const totalAmount = shoppingCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const tableContainer = document.createElement('div');
        tableContainer.classList.add('shopping-cart-container');

        const table = document.createElement('table');
        table.classList.add('shopping-cart-table');

        shoppingCart.forEach(item => {
            const row = document.createElement('tr');
            row.classList.add('item-row');

            const nameCell = document.createElement('td');
            nameCell.classList.add('item-cell');
            nameCell.textContent = item.name;
            row.appendChild(nameCell);

            const quantityCell = document.createElement('td');
            quantityCell.classList.add('item-cell', 'qty-cell');
            quantityCell.style.whiteSpace = 'nowrap';
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

            table.appendChild(row);            
        });
        
        tableContainer.appendChild(table);

        cartPopup.appendChild(tableContainer);
        
        const totalDiv = document.createElement('div');
        totalDiv.innerHTML = `<strong>Total:</strong> $${totalAmount}`;
        cartPopup.appendChild(totalDiv);

        const checkoutButton = document.createElement('button');
        checkoutButton.innerText = 'Checkout';
        checkoutButton.onclick = redirectToCheckout;
        checkoutButton.style.marginTop = '10px';
        checkoutButton.classList.add('checkout-button');
        cartPopup.appendChild(checkoutButton);
    }
}

function addItemToCart(item) {
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
    saveShoppingCartToCookie();
}

function addItemToCartWithQuantity(item, num) {
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

    saveShoppingCartToCookie();
}

function removeItem(itemId) {
    const index = shoppingCart.findIndex(item => item.id === itemId);

    if (index !== -1) {
        shoppingCart.splice(index, 1);
    }

    const cartPopup = document.getElementById('cart-popup');
    cartPopup.innerHTML = '';
    saveShoppingCartToCookie();
    showCartItems();
}

function updateQuantity(itemId, newQuantity) {
    console.log(`Updating quantity for item ${itemId} to ${newQuantity}`);
    const itemToUpdate = shoppingCart.find(item => item.id === itemId);
    const parsedQuantity = parseInt(newQuantity, 10);

    if (itemToUpdate && parsedQuantity >= 1) {
        itemToUpdate.quantity = parsedQuantity;
        saveShoppingCartToCookie();
    } else {
        console.error(`Item with ID ${itemId} not found in the shopping cart.`);
    }

    const cartPopup = document.getElementById('cart-popup');
    cartPopup.innerHTML = '';
    saveShoppingCartToCookie();
    showCartItems();
}

function testAddItem() {
    const item = {id: "1", name: 'Item 1', price: 50, stock: 5, shopID: "1"};
    addItemToCart(item);
}
