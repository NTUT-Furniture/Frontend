function addEventListenersToCards() {
    document.querySelectorAll('.container.itemcard-component').forEach(function(container) {
        container.addEventListener('click', function(event) {
            if (event.target.matches('.container.itemcard-component, .container.itemcard-component *')) {
                console.log('Container was clicked!');
                console.log(container.dataset.productId);
                console.log(container.dataset.shopId);
                console.log(container.dataset.productStock);
    
               // Extract data from the clicked container
                var itemName = this.querySelector('h1').textContent;
                var itemDescript = this.querySelector('p.desc').textContent;
                var itemSrc = this.querySelector('img').src;
                var itemPrice = this.querySelector('h2').textContent;
                var itemId = container.dataset.productId;
                var itemShop = container.dataset.shopId;
                var itemStock = container.dataset.productStock;

                // Redirect to another page with the item name
                window.location.href = '../productDetail/ProductDetail.html?' + 
                `shopId=${encodeURIComponent(itemShop)}&`+
                `productId=${encodeURIComponent(itemId)}&` +
                `productName=${encodeURIComponent(itemName)}&`+
                `productDetail=${encodeURIComponent(itemDescript)}&`+
                `productSrc=${encodeURIComponent(itemSrc)}&`+
                `productPrice=${encodeURIComponent(itemPrice)}&`+
                `productStock=${encodeURIComponent(itemStock)}&`;
            }
        });
    });
}