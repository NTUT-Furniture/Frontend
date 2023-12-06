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
            alert(`Edit business ${business.id}`);
        });

        deleteButton.addEventListener('click', function () {
            // Call your delete function here, e.g., deleteBusiness(business.id);
            alert(`Delete business ${business.id}`);
        });

        managementContainer.appendChild(card);
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
