function generateProductHTML(shopName, productName, productURL, productDetail, price, reviews, productId ,shopId, productStock) {
    const container = document.getElementById('product-container');
    const baseURL = "https://nfta.noobdy.com";
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
                </div>
            </div>
        </div>
        <div class="product-lower">
            <h3>Product Reviews</h3>
            <div class="add-review">
                <textarea id="reviewText" placeholder="Enter your review here..."></textarea>
                <button id="submitReview">Submit Review</button>
            </div>
            <div id="reviewsContainer">
            </div>
    `;
    htmlContent += `</div>`;
    container.innerHTML = htmlContent;
    loadReviews(productId);
    
    let priceInt = parseInt(price.replace(/\D/g, ''), 10);
    // console.log(priceInt);
    let item = {id: productId, name: productName, price: priceInt, stock: productStock};
    container.querySelector("#addToCart").addEventListener('click', (event) => {
        addItemToCart(item);
    });
    
    document.getElementById('submitReview').addEventListener('click', async () => {
        const reviewText = document.getElementById('reviewText').value;
        const productUuid = productId;
        const token = getCookie('token');
    
        try {
            const response = await fetch(`${baseURL}/api/comment/?product_uuid=${productUuid}&text=${reviewText}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
    
            if (response.ok) {
                document.getElementById('reviewText').value = '';
                loadReviews(productId);
            } else {
                console.error('Failed to submit review');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

async function loadReviews(productUuid) {
    const reviews = await getProductReviews(productUuid);
    let htmlContent = '';

    reviews.forEach(review => {
        htmlContent += `
            <div class="review" id="${review.comment_uuid}">
                <p class="review-text">${review.text}</p>
                <div class="review-footer">
                    <div class="review-stats">
                        <div class="review-like like-button">
                            <span>❤️: ${review.likes}</span>
                        </div>
                        <div class="review-poop dislike-button">
                            <span>💩: ${review.dislikes}</span>
                        </div>
                    </div>
                    <div class="review-author-time">
                        <p class="review-author">${review.name} - </p>
                        <p class="review-time">${review.update_time}</p>
                    </div>
                </div>
            </div>
        `;
    });
    const reviewsContainer = document.getElementById('reviewsContainer'); // 确保这个元素存在
    reviewsContainer.innerHTML = htmlContent;
    setupLikeButtons(productUuid);
}

function setupLikeButtons(productId) {
    const baseURL = "https://nfta.noobdy.com";
    document.querySelectorAll('.like-button, .dislike-button').forEach(button => {
        button.addEventListener('click', async (event) => {
            const reviewId = button.closest('.review').id;
            let isLikeButton = button.classList.contains('like-button');
            const token = getCookie('token');
            let url = `${baseURL}/api/comment/addLike?comment_uuid=${reviewId}&if_hates=${isLikeButton ? 0 : 1}`;
            try {
                let response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 500) {
                    console.log('delete')
                    url = `${baseURL}/api/comment/deleteLike?comment_uuid=${reviewId}`;
                    response = await fetch(url, {
                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (!response.ok) {
                        console.error('Failed to delete like/dislike after server error');
                    }
                } else if (!response.ok) {
                    console.error('Failed to update like/dislike');
                }
            } catch (error) {
                console.error('Error:', error);
            }
            loadReviews(productId);
        });
    });
}

function getCookie(cookieName) {
    const cookies = document.cookie;
    const cookieArray = cookies.split('; ');
    const tokenCookie = cookieArray.find(row => row.startsWith(cookieName + '='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
}


async function main() {
    var urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('productName');
    const productDetail = urlParams.get('productDetail');
    const productURL = urlParams.get('productSrc');
    const price = urlParams.get('productPrice');
    const productStock = urlParams.get('productStock');
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
    const productReviews = await getProductReviews(productId)
                    .then(reviews => {
                        console.log(`reviews: ${reviews}`);
                        return reviews;
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
    
    generateProductHTML(shopName, productName, productURL, productDetail, price, productReviews, productId ,shopId, productStock);
}

async function getShopName(shopUuid) {
    const baseURL = "https://nfta.noobdy.com";
    try {
        const url = `${baseURL}/api/shop/?shop_uuid=${shopUuid}`;
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

async function getProductReviews(productUuid) {
    const baseURL = "https://nfta.noobdy.com";
    try {
        const url = `${baseURL}/api/comment/guest?product_uuid=${productUuid}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });
        if (response.status === 404) {
            return [];
        } else if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        return result.comments || [];
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

window.onload = function() {
    main();
};
