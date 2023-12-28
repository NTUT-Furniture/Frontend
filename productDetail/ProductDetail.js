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
                <a class="shop-name" id="${shopId}" href="../shopManager/Shop.html?userType=buyer&shop_uuid=${shopId}">${shopName}</a>
                <h2>${productName}</h2>
                <p>${productDetail}</p>
                <p class="price">價格: ${price}</p>
                <div class="buttons">
                    <button class="add" id="addToCart">Add to Cart</button>
                    <button class="like" id="subscribe"><span>♥</span></button>
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
    container.querySelector("#subscribe").addEventListener('click', (event) => {
        SubscribeShop(shopId);
    });
}


function getCookie(cookieName) {
    const cookies = document.cookie;
    const cookieArray = cookies.split('; ');
    const tokenCookie = cookieArray.find(row => row.startsWith(cookieName + '='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
}


async function main() {
    // 示例數據
    var urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('productName');
    const productDetail = urlParams.get('productDetail');
    const productURL = urlParams.get('productSrc');
    const price = urlParams.get('productPrice');
    const productStock = urlParams.get('productStock');
    const reviews = [
        {text: "Great sofa, very comfortable!", author: "John Doe"},
        {text: "Loved it, perfect for my living room.", author: "Jane Smith"}
    ];
    const productId = urlParams.get('productId');
    const shopId = urlParams.get('shopId');
    const shopName = await getShopName(shopId)
                    .then(shopName => {
                        console.log(`Shop Name: ${shopName}`);
                        return shopName;
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
    
    generateProductHTML(shopName, productName, productURL, productDetail, price, reviews, productId ,shopId, productStock);
}

async function getShopName(shopUuid) {
    try {
        const url = `http://localhost:8000/api/shop/?shop_uuid=${shopUuid}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const shopData = await response.json();

        if (shopData && shopData.name) {
            const shopName = shopData.name;
            console.log(`Shop Name: ${shopName}`);
            return shopName;
        } else {
            throw new Error('Shop data or name not found');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

window.onload = function() {
    main();
};
