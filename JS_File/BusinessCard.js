// business-management-card.js

document.addEventListener('DOMContentLoaded', function () {
    const managementContainer = document.getElementById('business-management');

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
            // Call your edit function here, e.g., editBusiness(business.id);
            showEditForm(business);
        });

        deleteButton.addEventListener('click', function () {
            // Call your delete function here, e.g., deleteBusiness(business.id);
            showDeleteForm(business);
        });

        managementContainer.appendChild(card);
    }

// Function to show edit form with quantity input
    function showEditForm(business) {
        // Create a form element
        const form = document.createElement('form');
        form.classList.add('edit-form');

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
        submitButton.type = 'button'; // You can change it to 'submit' if you want to submit the form
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
            // Get the updated quantity value
            const updatedQuantity = parseInt(quantityInput.value, 10);

            // Perform your logic to update the business data (replace this with your actual implementation)
            alert(`Update business ${business.id} with quantity ${updatedQuantity}`);

            // Close or remove the form after handling the submission
            form.remove();
        });

        // Show the form (replace this with your actual implementation, e.g., displaying a modal)
        document.body.appendChild(form);
    }


    // Function to show delete form
    function showDeleteForm(business) {
        // Replace this alert with your actual delete form implementation
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
});
