let shopping = [];
let usingCouponCode = "";

function displayShopping(coupon = 1, couponCode = "") {
    const urlParams = new URLSearchParams(window.location.search);
    const cartParam = urlParams.get('cart');
    if (cartParam) {
        try {
            shopping = JSON.parse(decodeURIComponent(cartParam));
            usingCouponCode = couponCode;
        } catch (error) {
            console.error('Error parsing shopping cart data:', error);
        }
    }

    console.log('Checkout successful! Items purchased:', shopping);
    
    var cartItem = document.getElementById('cartItem');
    cartItem.innerHTML = '';
    var headerRow = cartItem.insertRow(0);
    headerRow.innerHTML = '<th>Product Name</th><th>Quantity</th><th>Price</th>';

    var cost = 0;

    shopping.forEach(function (item, index) {
        var row = cartItem.insertRow(index + 1);
        row.innerHTML = `<td>${item.name}</td><td>${item.quantity}</td><td>${item.quantity * item.price}</td>`;
        cost += item.quantity * item.price;
    });
    const totalCost = document.getElementById('totalCost');
    totalCost.innerHTML = `<h2>total cost: ${cost * coupon}</h2>`;
}

async function applyCoupon() {
    var couponInput = document.getElementById('coupon');
    var message = document.getElementById('message');
    let resultPromise = getCurrentCoupons();
    let nowCoupons = await resultPromise;
    console.log(nowCoupons);
    let usingCoupon = false;

    if (nowCoupons && nowCoupons.coupons) {
        for (let index = 0; index < nowCoupons.coupons.length; index++) {
            const element = nowCoupons.coupons[index];
            if (couponInput.value.trim() === element.coupon_code) {
                message.textContent = 'Coupon applied successfully! Use Coupon: ' + element.coupon_code;
                displayShopping(element.discount / 100, element.coupon_code);
                usingCoupon = true;
                break;
            }
        }
    }
    if (! usingCoupon) {
        message.textContent = 'Invalid coupon code.';
        displayShopping();
    }
}

function getCookie(cookieName) {
    const cookies = document.cookie;
    const cookieArray = cookies.split('; ');
    const tokenCookie = cookieArray.find(row => row.startsWith(cookieName + '='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
}

async function getCurrentCoupons() {
    console.log('Get Current Counpons');
    let baseURL = "https://nfta.noobdy.com";
    try {
        baseURL = `${baseURL}/api/coupon/`;
        const url = new URL(baseURL);
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Get Counpons API Error', error);
    }
}

async function checkout() {
    console.log('Checkout successful! Items purchased:', shopping);
    alert('Checkout successful!');
    let requestBodies = convertToRequestBody(shopping);

    try {
        const transactionResults = await Promise.all(requestBodies.map(requestBody => createTransaction(requestBody)));
        
        transactionResults.forEach(result => {
            console.log(result);
        });

        clearShoppingCartCookie();
        window.location.href = '../home/Index.html';
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('Checkout failed. Please try again later.');
    }
}

function continueShopping() {
    window.location.href = '../home/Index.html';
}

function convertToRequestBody(productList) {
    let groupedItems = {};
    productList.forEach(item => {
        if (!groupedItems[item.shopID]) {
            groupedItems[item.shopID] = [];
        }
        groupedItems[item.shopID].push(item);
    });

    let requestBodies = [];
    for (let shopID in groupedItems) {
        let products = {
            transaction_product_logs: groupedItems[shopID].map(item => ({
                product_uuid: item.id,
                quantity: item.quantity
            }))
        };
        let requestBody;
        if (usingCouponCode === "") {
            requestBody = {
                shop_uuid: shopID,
                status: "Ordered",
                products: products
            };
        }
        else {
            requestBody = {
                shop_uuid: shopID,
                coupon_code: usingCouponCode,
                status: "Ordered",
                products: products
            };
        }
        requestBodies.push(requestBody);
    }

    return requestBodies;
}

async function createTransaction(requestBody) {
    const keyOrder = ['shop_uuid', 'coupon_code', 'receive_time', 'status', 'products'];
    const sortedRequestBody = {};

    keyOrder.forEach(key => {
        if (requestBody.hasOwnProperty(key)) {
            sortedRequestBody[key] = requestBody[key];
        }
    });

    const jsonString = JSON.stringify(sortedRequestBody, null, 2);
    console.log(jsonString);

    const baseURL = "https://nfta.noobdy.com"
    const api = `${baseURL}:8000/api/transaction/`;
    
    try {
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + getCookie('token'),
                'Content-Type': 'application/json'
            },
            body: jsonString
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Request sent successfully for shop_uuid: ${requestBody.shop_uuid}`);
        console.log('API Response:', data);

        return data;
    } catch (error) {
        console.error(`Error sending request for shop_uuid: ${requestBody.shop_uuid}`);
        console.error('Error details:', error);
        throw error;
    }
}

displayShopping();
