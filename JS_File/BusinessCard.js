document.addEventListener('DOMContentLoaded', function () {
    const managementContainer = document.getElementById('business-management');
    const addButton = document.getElementById('add-business-button');

    function renderBusinessCard(business) {
        const card = document.createElement('div');
        card.classList.add('business-card');
        card.innerHTML = `
            <h2 class="name">${business.name}</h2>
            <p class="description">${business.description}</p>
            <p class="quantity">Quantity: ${business.quantity}</p>
            <p class="price">Price: ${business.price}</p>
            <img class="image" src="${business.image_url}" alt="${business.name}">
            <button class="edit-button">Edit</button>
            <button class="detail-button">Detail</button>
            <button class="delete-button">Delete</button>
        `;
        card.querySelector('.edit-button').addEventListener('click', () => showEditForm(business, card));
        card.querySelector('.delete-button').addEventListener('click', () => showDeleteForm(business, card));
        card.querySelector('.detail-button').addEventListener('click', () => showDetailPopup(business));
        managementContainer.appendChild(card);
    }

    function showEditForm(business, card) {
        const formExists = card.querySelector('.edit-form');
        if (formExists) return formExists.querySelector('input[name="name"]').focus();

        const form = document.createElement('form');
        form.classList.add('edit-form');

        // 修改欄位列表，包括 'name', 'description', 'quantity', 'price', 'image_url'
        ['name', 'description', 'quantity', 'price', 'image_url'].forEach((field) => {
            const input = document.createElement('input');
            input.type = field === 'quantity' || field === 'price' ? 'number' : 'text';
            input.value = business[field];
            input.name = field;
            input.placeholder = field.charAt(0).toUpperCase() + field.slice(1);
            form.appendChild(input);
        });

        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.textContent = 'Save';
        submitButton.addEventListener('click', () => {
            // 修改欄位列表，包括 'name', 'description', 'quantity', 'price', 'image_url'
            ['name', 'description', 'quantity', 'price', 'image_url'].forEach((field) => {
                const inputValue = form.querySelector(`input[name="${field}"]`).value;
                business[field] = inputValue;
                const element = card.querySelector(`.${field}`);
                if (element) {
                    element.innerText = field === 'quantity' || field === 'price' ? `${field.charAt(0).toUpperCase() + field.slice(1)}: ${inputValue}` : inputValue;
                }
            });
            // console.log(business['name']);
            // console.log(business['description']);
            // console.log(business['quantity']);

            form.remove();
        });

        form.append(submitButton);
        card.appendChild(form);
    }


    function showDeleteForm(business, card) {
        card.remove(); // Replace with actual delete form implementation
        alert(`Delete business ${business.id}`);
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

    // Add event listener for the "Add Business" button
    addButton.addEventListener('click', () => {
        // Create a new business object with default values
        const newBusiness = {
            id: generateUniqueId(),
            name: 'New Business',
            description: 'Description',
            quantity: 0,
            price: 0,
            image_url: 'https://example.com/defaultImage.jpg', // Provide a default image URL
        };

        // Render the new business card
        renderBusinessCard(newBusiness);
    });

    function generateUniqueId() {
        return Date.now();
    }
});
