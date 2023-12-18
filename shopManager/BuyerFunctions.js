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
            <input type="number" id="quantity" name="quantity" value="1" min="1">
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

        // 在這裡可以添加購買邏輯，使用 business 和 quantity 進行相應的處理
        alert(`Buy ${quantity} of ${business.name}`);
    }

    function fetchMockBusinessData() {
        const mockData = [
            {
                id: 1,
                name: 'Business A',
                description: 'Description A',
                quantity: 10,
                price: 50,
                image_url: '../Resources/bed.png',
            },
            {
                id: 2,
                name: 'Business B',
                description: 'Description B',
                quantity: 5,
                price: 30,
                image_url: '../Resources/chair.jpg',
            },
            // Add more mock data as needed
        ];
        mockData.forEach(renderBusinessCard);
    }

    fetchMockBusinessData();

});
