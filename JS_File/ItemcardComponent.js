class ItemCardComponent {
    constructor(productType, productName, productPrice, productDescription, imageUrl) {
        this.productType = productType;
        this.productName = productName;
        this.productPrice = productPrice;
        this.productDescription = productDescription;
        this.imageUrl = imageUrl;
        this.container = this.render(); // Save the container element
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
                <button class="add">Add to Cart</button>
                <button class="like"><span>♥</span></button>
            </div>
        `;

        // Append elements to the container
        container.appendChild(imageElement);
        container.appendChild(slideshowButtons);
        container.appendChild(pickElement);
        container.appendChild(sizesElement);
        container.appendChild(productElement);
        
        return container;
    }
}
