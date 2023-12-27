function generateProductHTML(shopName, productName, productURL, productDetail, price, reviews, productId ,shopId, productStock) {
    const container = document.getElementById('product-container');
    // console.log(productId);
    // console.log(productName);
    // console.log(productURL);
    // console.log(productDetail);
    // console.log(price);

    let htmlContent = `
        <div class="product-upper">
            <div class="product-image" id="${productId}">
                <img src="${productURL}" alt="商品圖片">
            </div>
            <div class="product-info">
                <a class="shop-name" id="${shopId}" href="../shopManager/Shop.html?userType=buyer&shop_uuid=${getCookie("shop_uuid")}">${shopName}</a>
                <h2>${productName}</h2>
                <p>${productDetail}</p>
                <p class="price">價格: ${price}</p>
                <div class="buttons">
                    <button class="add" id="addToCart">Add to Cart</button>
                </div>
            </div>
        </div>
        <div class="product-lower">
            <h3>Product Reviews</h3>
    `;

    reviews.forEach(review => {
        htmlContent += `
            <div class="review">
                <p class="review-text">${review.text}</p>
                <p class="review-author">- ${review.author}</p>
            </div>
        `;
    });

    htmlContent += `</div>`;
    container.innerHTML = htmlContent;
    
    let priceInt = parseInt(price.replace(/\D/g, ''), 10);
    // console.log(priceInt);
    let item = {id: productId, name: productName, price: priceInt, stock: productStock};
    container.querySelector("#addToCart").addEventListener('click', (event) => {
        addItemToCart(item);
    });
}


function getCookie(cookieName) {
    const cookies = document.cookie;
    const cookieArray = cookies.split('; ');
    const tokenCookie = cookieArray.find(row => row.startsWith(cookieName + '='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
}

// 示例數據
var urlParams = new URLSearchParams(window.location.search);
const shopName = "Go To Shop";
const productName = urlParams.get('productName');
const productDetail = urlParams.get('productDetail');
const productURL = urlParams.get('productSrc');
const price = urlParams.get('productPrice');
const stock = urlParams.get('productStock');
const reviews = [
    {text: "Great sofa, very comfortable!", author: "John Doe"},
    {text: "Loved it, perfect for my living room.", author: "Jane Smith"}
];
const productId = urlParams.get('productId');
const shopId = urlParams.get('shopId');

window.onload = function() {
    generateProductHTML(shopName, productName, productURL, productDetail, price, reviews, productId ,shopId, stock);
};