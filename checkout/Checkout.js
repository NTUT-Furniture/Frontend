// 假設你有一個全域變數來存儲購物車內容
var shoppingCart = [];

// 初始化購物車內容（這只是一個範例）
shoppingCart.push({ product: '商品1', price: 20 });
shoppingCart.push({ product: '商品2', price: 30 });

// 顯示購物車內容
function displayCart() {
    var cartBody = document.getElementById('cartBody');
    cartBody.innerHTML = '';

    for (var i = 0; i < shoppingCart.length; i++) {
        var row = cartBody.insertRow(i);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = shoppingCart[i].product;
        cell2.innerHTML = shoppingCart[i].price;
    }
}

// 套用優惠碼的函數
function applyCoupon() {
    var couponInput = document.getElementById('coupon');
    var message = document.getElementById('message');

    // 在這裡實現你的優惠碼邏輯，這裡只是一個範例
    if (couponInput.value === 'SAVE10') {
        message.textContent = '優惠碼套用成功！';
    } else {
        message.textContent = '優惠碼無效。';
    }
}

// 結帳的函數
function checkout() {
    // 在這裡實現結帳邏輯，可以將購物車內容存儲在本地存儲中或通過API發送到後端等
    // 這裡只是一個簡單的範例，將購物車內容顯示在控制台並清空購物車
    console.log('結帳成功！購買的內容：', shoppingCart);
    shoppingCart = [];
    displayCart();
    alert('結帳成功！');
}

// 繼續購買的函數
function continueShopping() {
    // 這裡可以導向到你的首頁（Index.html）
    window.location.href = 'Index.html';
}

// 初始化時顯示購物車內容
displayCart();
