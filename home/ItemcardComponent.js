class ItemCardComponent {
    constructor(product) {
        this.productId = product.product_uuid;
        this.shopId = product.shop_uuid;
        this.productName = product.name;
        this.productStock = product.stock;
        this.productPrice = `$${product.price}`; // 假設價格是以美元為單位
        this.productTags = product.tags;
        this.productDescription = product.description || 'No description available';
        this.imageUrl = '';
        this.item = { id: this.productId, name: this.productName, price: product.price };
        this.container = this.render(); // Save the container element
        this.container.dataset.productId = this.productId;
        this.container.dataset.shopId = this.shopId;
    }

    render() {
        const container = document.createElement('div');
        container.classList.add('container', 'itemcard-component');

        // Create image element
        const imageElement = document.createElement('img');
        fetchImage(this.productId, "avatar")
        .then(imageUrl => {
            // console.log('Image URL:', imageUrl);
            imageElement.src = imageUrl; // 在这里将 imageUrl 赋值给 this.imageUrl
        })
        .catch(error => {
            console.error('Error:', error);
            imageElement.src = "this.src='../Resources/defaultProduct.png'";
        });
        imageElement.alt = this.productName;
        imageElement.onerror = "this.src='../Resources/defaultProduct.png'";
        imageElement.classList.add('product-image');

        const slideshowButtons = document.createElement('div');
        slideshowButtons.classList.add('slideshow-buttons');
        slideshowButtons.innerHTML = `
            <div class="one"></div>
            <div class="two"></div>
            <div class="three"></div>
            <div class="four"></div>
        `;

        const pickElement = document.createElement('p');
        pickElement.classList.add('pick');
        pickElement.textContent = 'choose size';

        const sizesElement = document.createElement('div');
        sizesElement.classList.add('sizes');
        sizesElement.innerHTML = `
            <div class="size">5</div>
            <div class="size">6</div>
            <div class="size">7</div>
            <div class="size">8</div>
            <div class="size">9</div>
            <div class="size">10</div>
            <div class="size">11</div>
            <div class="size">12</div>
        `;

        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <p>NFT</p>
            <h1>${this.productName}</h1>
            <h2>${this.productPrice}</h2>
            <p class="desc">${this.productDescription}</p>
            <div class="buttons">
                <button class="add" id="addToCart">Add to Cart</button>
                <button class="like"><span>♥</span></button>
            </div>
        `;

        productElement.querySelector("#addToCart").addEventListener('click', (event) => {
            event.stopPropagation();
            addItemToCart(this.item);
        });
        
        // Append elements to the container
        container.appendChild(imageElement);
        container.appendChild(slideshowButtons);
        container.appendChild(pickElement);
        container.appendChild(sizesElement);
        container.appendChild(productElement);

        return container;
    }
}

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:8000/api/product/all?order=product_uuid&limit=2147483647', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const products = await response.json();
        generateItemCard(products.products);
        addEventListenersToCards();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

async function fetchImage(UUID, imgType) {
    const imageUrl = `http://localhost:8000/api/image/${UUID}?img_type=${imgType}`;
    // console.log(`in fetch Image,UUID = ${UUID}, imgType = ${imgType}`);
    // console.log(imageUrl);
    try {
        const response = await fetch(imageUrl.toString(), { mode: 'no-cors' });
        return imageUrl;
    } catch (error) {
        console.error(`Error fetching image: ${error.message}`);
        return null;
    }
}

function generateItemCard(products) {
    const itemListContainer = document.getElementById("itemList");
    itemListContainer.innerHTML = '';

    for (const product of products) {
        const itemCardInstance = new ItemCardComponent(product);
        itemListContainer.appendChild(itemCardInstance.container);
    }
}

document.addEventListener('DOMContentLoaded', fetchProducts);
