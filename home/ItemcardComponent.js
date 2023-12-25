class ItemCardComponent {
    constructor(productId, productType, productName, productPrice, productDescription, imageUrl) {
        this.productId = productId;
        this.productName = productName;
        this.productPrice = productPrice;
        this.productDescription = productDescription;
        this.imageUrl = imageUrl;
        let priceInt = parseInt(this.productPrice.replace(/\D/g, ''), 10);
        this.item = {id: productId, name: productName, price: priceInt}
        this.container = this.render(); // Save the container element
        this.container.dataset.productId = productId;
    }

    render() {
        const container = document.createElement('div');
        container.classList.add('container', 'itemcard-component');

        // Create image element
        const imageElement = document.createElement('img');
        imageElement.src = this.imageUrl;
        imageElement.alt = this.productName;
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


// 假設有一組商品數據
const products = [
    {
        productId: "1",
        productType: "Furniture",
        productName: "Comfortable Sofa 1",
        productPrice: "$500",
        productDescription: "A cozy sofa for your living room.",
        imageUrl: "../Resources/sofa.jpg"
    },

    {
        productId: "2",
        productType: "Furniture",
        productName: "Comfortable Bed",
        productPrice: "$700",
        productDescription: "A cozy Bed for your living room.",
        imageUrl: "../Resources/bed.png"
    },

    {
        productId: "3",
        productType: "Furniture",
        productName: "Comfortable Sofa",
        productPrice: "$500",
        productDescription: "A cozy sofa for your living room.",
        imageUrl: "../Resources/sofa.jpg"
    },

    {
        productId: "4",
        productType: "Furniture",
        productName: "Comfortable Bed 2",
        productPrice: "$500",
        productDescription: "A cozy Bed for your living room.",
        imageUrl: "../Resources/bed.png"
    },

    {
        productId: "5",
        productType: "Furniture",
        productName: "Comfortable Bed 3",
        productPrice: "$700",
        productDescription: "A cozy Bed for your living room.",
        imageUrl: "../Resources/bed.png"
    },
    // Add more product data as needed
];

function generateItemCard() {

// 獲取 #itemList 容器
    const itemListContainer = document.getElementById("itemList");

// 使用迴圈創建並添加多個 ItemCardComponent 實例
    for (const product of products) {
        const itemCardInstance = new ItemCardComponent(
            product.productId,
            product.productType,
            product.productName,
            product.productPrice,
            product.productDescription,
            product.imageUrl
        );

        itemListContainer.appendChild(itemCardInstance.container);
    }

}

generateItemCard()
