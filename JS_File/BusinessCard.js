document.addEventListener('DOMContentLoaded', function () {
    const managementContainer = document.getElementById('business-management');
    const addButton = document.getElementById('add-business-button');
    

    // Function to render a business card
    function renderBusinessCard(business) {
        const card = document.createElement('div');
        card.classList.add('business-card');

        // Display business information
        card.innerHTML = `
        <h2>${business.name}</h2>
        <p>${business.description}</p>
        <p>Quantity: ${business.quantity}</p>
        <button class="edit-button">Edit</button>
        <button class="delete-button">Delete</button>
        `;

        // Add event listeners for edit and delete buttons
        const editButton = card.querySelector('.edit-button');
        const deleteButton = card.querySelector('.delete-button');

        editButton.addEventListener('click', function () {
            showEditForm(business, card);
        });

        deleteButton.addEventListener('click', function () {
            showDeleteForm(business, card);
        });

        managementContainer.appendChild(card);
    }

    // Function to show edit form with name, description, and quantity input
    function showEditForm(business, card) {
        // const form = document.createElement('form');
        // form.classList.add('edit-form');
        const existingForm = card.querySelector('.edit-form');

        if (existingForm) {
            // If a form already exists, you can choose to focus on it or do nothing
            existingForm.querySelector('input[name="name"]').focus();
            return;
        }

        const form = document.createElement('form');
        form.classList.add('edit-form');

        // Create input for business name
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = business.name;
        nameInput.name = 'name';
        nameInput.placeholder = 'Name';
        form.appendChild(nameInput);

        // Create input for business description
        const descriptionInput = document.createElement('input');
        descriptionInput.type = 'text';
        descriptionInput.value = business.description;
        descriptionInput.name = 'description';
        descriptionInput.placeholder = 'Description';
        form.appendChild(descriptionInput);

        // Create input for business quantity
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = business.quantity;
        quantityInput.name = 'quantity';
        quantityInput.placeholder = 'Quantity';
        form.appendChild(quantityInput);

        // Create buttons to increase and decrease quantity
        const increaseButton = document.createElement('button');
        increaseButton.type = 'button';
        increaseButton.textContent = '+';
        form.appendChild(increaseButton);

        const decreaseButton = document.createElement('button');
        decreaseButton.type = 'button';
        decreaseButton.textContent = '-';
        form.appendChild(decreaseButton);

        // Create submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.textContent = 'Save';
        form.appendChild(submitButton);

        // Add event listeners
        increaseButton.addEventListener('click', function () {
            quantityInput.value = parseInt(quantityInput.value, 10) + 1;
        });

        decreaseButton.addEventListener('click', function () {
            const currentQuantity = parseInt(quantityInput.value, 10);
            if (currentQuantity > 0) {
                quantityInput.value = currentQuantity - 1;
            }
        });

        submitButton.addEventListener('click', function () {
            // Get the updated values
            const updatedName = nameInput.value;
            const updatedDescription = descriptionInput.value;
            const updatedQuantity = parseInt(quantityInput.value, 10);

            // Update the business data
            business.name = updatedName;
            business.description = updatedDescription;
            business.quantity = updatedQuantity;

            // Update the card content
            card.querySelector('h2').textContent = updatedName;
            card.querySelector('p:nth-child(2)').textContent = updatedDescription;
            card.querySelector('p:nth-child(3)').textContent = `Quantity: ${updatedQuantity}`;

            // Close or remove the form after handling the submission
            form.remove();
        });

        // Show the form
        card.appendChild(form);
    }

    // Function to show delete form
    function showDeleteForm(business, card) {
        // Replace this alert with your actual delete form implementation
        // For demonstration purposes, I'll remove the card from the container
        card.remove();
        alert(`Delete business ${business.id}`);
    }

    // Function to fetch mock business data (replace with actual API call)
    function fetchMockBusinessData() {
        const mockData = [
            {
                id: 1,
                name: 'Business A',
                description: 'Description A',
                quantity: 10,
            },
            {
                id: 2,
                name: 'Business B',
                description: 'Description B',
                quantity: 5,
            },
            // Add more mock data as needed
        ];

        // Render business cards
        mockData.forEach(renderBusinessCard);
    }

    // Fetch and render mock data on page load
    fetchMockBusinessData();

    // Add event listener for the "Add Business" button
    addButton.addEventListener('click', function () {
        // Create a new business object with default values
        const newBusiness = {
            id: generateUniqueId(),
            name: 'New Business',
            description: 'Description',
            quantity: 0,
        };

        // Render the new business card
        renderBusinessCard(newBusiness);
    });

    // Function to generate a unique ID
    function generateUniqueId() {
        return Date.now();
    }

});
