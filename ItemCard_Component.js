window.addEventListener('DOMContentLoaded', () => {
    const mainPage = document.getElementById('mainPage');
    const itemList = document.getElementById('itemList');

    const items = [
        {
            title: 'Sofa',
            description: '凡爾賽',
            imageUrl: 'Resourse/sofa.jpg'
        },
        {
            title: 'Bed',
            description: 'Bed',
            imageUrl: 'Resourse/bed.png'
        },
    ];

    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.classList.add('item-card');
        
        const title = document.createElement('h2');
        title.textContent = item.title;

        const description = document.createElement('p');
        description.textContent = item.description;

        const image = document.createElement('img');
        image.src = item.imageUrl;

        itemCard.appendChild(title);
        itemCard.appendChild(image);
        itemCard.appendChild(description);
        itemList.appendChild(itemCard);
    });

    mainPage.appendChild(itemList);
});
