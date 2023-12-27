document.addEventListener('DOMContentLoaded', function () {
    const managementContainer = document.getElementById('business-management');
    let openDetailForm = null;
    let currentDetailType = null;

    function renderBusinessCard(business) {
        const card = document.createElement('div');
        card.classList.add('business-card');
        card.innerHTML = `
            <h2 class="name">${business.name}</h2>
            <p class="description">${business.description}</p>
            <p class="quantity">Quantity: ${business.quantity}</p>
            <p class="price">Price: ${business.price}</p>
            <img class="image" src="${business.image_url}" alt="${business.name}">
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" name="quantity" value="1" min="1" max="${business.quantity}">
            <button class="buy-button">Buy</button>
        `;
        card.querySelector('.buy-button').addEventListener('click', () => handleBuyButtonClick(business, card));
        managementContainer.appendChild(card);
    }

    function handleBuyButtonClick(business, card) {
        const quantityInput = card.querySelector('#quantity');
        const quantity = parseInt(quantityInput.value, 10);

        if (isNaN(quantity) || quantity <= 0) {
            alert('Please enter a valid quantity.');
            return;
        }

        let item = {id: business.id, name: business.name, price: business.price, stock: business.quantity};
        addItemToCartWithQuantity(item, quantity);

        // 在這裡可以添加購買邏輯，使用 business 和 quantity 進行相應的處理
        alert(`Buy ${quantity} of ${business.name}`);
    }

    async function fetchBusinessCardData() {
        try {
            const baseURL = 'http://localhost:8000/api/product/all?';
            const url = new URL(baseURL);
            const urlParams = new URLSearchParams(window.location.search);
            const passedShopUUID = urlParams.get('shop_uuid');
            const shopUUID = passedShopUUID || getCookie("shop_uuid");
            url.searchParams.append('order', "shop_uuid");
            url.searchParams.append('shop_uuid', shopUUID);
            url.searchParams.append('is_active', '1');
            const response = await fetch(url.toString());
            const data = await response.json();
            console.log("fetch all product data", data);
            return data;
        } catch (error) {
            throw new Error('Error fetch all product data: ' + error.message);
        }
    }
    
    function fetchImage(UUID, imgType) {
        return `http://localhost:8000/api/image/${UUID}?img_type=${imgType}`;
    }

    async function renderBusinessCards() {
        try {
            // Assuming fetchBusinessCardData returns an object with 'products' property
            const products = await fetchBusinessCardData();
            const productsData = products.products;
    
            const mappedData = [];
    
            for (const product of productsData) {
                try {
                    const productImage = fetchImage(product.product_uuid, "avatar");
                    console.log("here", product.product_uuid);
                    mappedData.push({
                        id: product.product_uuid,
                        name: product.name,
                        description: product.description,
                        quantity: product.stock,
                        price: product.price,
                        tag: product.tags,
                        image_url: productImage || "../Resources/default_banner.webp", // Use fetched image or default if not available
                    });
                } catch (imageError) {
                    console.error(`Error fetching image for product ${product.product_uuid}: ${imageError.message}`);
                }
            }
    
            console.log("mappedData:", mappedData);
            mappedData.forEach((business) => renderBusinessCard(business));
        } catch (error) {
            console.error(error.message);
        }
    }

    renderBusinessCards();
});
