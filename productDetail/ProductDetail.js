function generateProductHTML(productName, productURL, productDetail, price, reviews) {
    const container = document.getElementById('product-container');

    let htmlContent = `
        <div class="product-upper">
            <div class="product-image">
                <img src="${productURL}" alt="商品圖片">
            </div>
            <div class="product-info">
                <h2>${productName}</h2>
                <p>${productDetail}</p>
                <p class="price">價格: ${price}</p>
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
}

// 示例數據
var urlParams = new URLSearchParams(window.location.search);
const productName = urlParams.get('productName');
const productDetail = urlParams.get('productDetail');
const productURL = urlParams.get('productSrc');
const price = urlParams.get('productPrice');
const reviews = [
    {text: "Great sofa, very comfortable!", author: "John Doe"},
    {text: "Loved it, perfect for my living room.", author: "Jane Smith"}
];


window.onload = function() {
    generateProductHTML(productName, productURL, productDetail, price, reviews);
};