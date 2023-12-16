document.addEventListener('DOMContentLoaded', function () {
    // 購物車資訊
    const shoppingCart = [];

    // 獲取商品列表容器
    const productContainer = document.getElementById('product-container');

    // 獲取購物車顯示容器
    const cartContainer = document.getElementById('cart-container');

    // 獲取結帳按鈕
    const checkoutButton = document.getElementById('checkout-button');

    // 商品數據（模擬）
    const products = [
        {id: 1, name: 'Product A', price: 20},
        {id: 2, name: 'Product B', price: 30},
        {id: 3, name: 'Product C', price: 40},
    ];

    // 渲染商品列表
    function renderProducts() {
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <button class="add-to-cart-button" data-product-id="${product.id}">Add to Cart</button>
            `;
            productContainer.appendChild(productElement);

            // 監聽添加到購物車按鈕點擊事件
            const addToCartButton = productElement.querySelector('.add-to-cart-button');
            addToCartButton.addEventListener('click', () => addToCart(product));
        });
    }

    // 將商品添加到購物車
    function addToCart(product) {
        shoppingCart.push(product);
        updateCartDisplay();
    }

    // 更新購物車顯示
    function updateCartDisplay() {
        cartContainer.innerHTML = '<h2>Shopping Cart</h2>';

        if (shoppingCart.length === 0) {
            cartContainer.innerHTML += '<p>Your cart is empty.</p>';
        } else {
            shoppingCart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.innerHTML = `<p>${item.name} - $${item.price}</p>`;
                cartContainer.appendChild(cartItemElement);
            });

            // 顯示結帳按鈕
            cartContainer.appendChild(checkoutButton);
        }
    }

    // 結帳按鈕點擊事件
    checkoutButton.addEventListener('click', () => {
        alert('Checkout functionality: Implement your checkout logic here.');
    });

    // 初始化頁面
    renderProducts();
    updateCartDisplay();
});
