document.addEventListener('DOMContentLoaded', function () {
    const managementContainer = document.getElementById('business-management');
    const addButton = document.getElementById('add-business-button');
    let openDetailForm = null;

    function renderBusinessCard(business) {
        const card = document.createElement('div');
        card.classList.add('business-card');
        card.innerHTML = `
            <h2 class="name">${business.name}</h2>
            <p class="description">${business.description}</p>
            <p class="quantity">Quantity: ${business.quantity}</p>
            <p class="price">Price: ${business.price}</p>
            <img class="image" src="${business.image_url}" alt="${business.name}">
            <button class="detail-button">Detail</button>
            <button class="delete-button">Delete</button>
        `;
        card.querySelector('.delete-button').addEventListener('click', () => showDeleteForm(business, card));
        card.querySelector('.detail-button').addEventListener('click', () => showDetailPopup(business, card));
        managementContainer.appendChild(card);
    }

    function showDetailPopup(business, card) {

        if (openDetailForm) {
            openDetailForm.remove();
            openDetailForm = null;
        }

        const popup = document.createElement('div');
        popup.classList.add('detail-popup', 'large');
        popup.innerHTML = `
            <div class="content-container" style="position: fixed; top: 85%; display: flex; flex-direction: column; height: 15%; justify-content: flex-end; align-items: flex-end; width: 100%;">
                <div class="bottom-buttons" style="display: flex; justify-content: space-around; width: 100%;">
                    <button class="detail-button">Edit</button>
                    <button class="detail-button">Status</button>
                    <button class="detail-button">Comment</button>
                    <button class="close-button">Close</button>
                </div>
            </div>
        `;

        popup.querySelectorAll('.detail-button').forEach((button, index) => {
            button.addEventListener('click', () => handleDetailButtonClick(business, card, popup, index + 1));
        });

        const closeButton = popup.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            popup.remove();
            openDetailForm = null;
        });

        // 將懸浮視窗附加到 #business-management
        const businessManagement = document.getElementById('business-management');
        businessManagement.appendChild(popup);

        // 顯示懸浮視窗
        popup.classList.add('show');
        openDetailForm = popup;
    }

    function handleDetailButtonClick(business, card, popup, buttonIndex) {
        switch (buttonIndex) {
            case 1:
                console.log('Edit button clicked');
                showEditForm(business, card, popup);
                break;
            case 2:
                // Status button clicked
                showStatusTable();
                console.log('Status button clicked');
                break;
            case 3:
                console.log('Comment button clicked');
                showCommentSection(business, popup);
                break;
            default:
                break;
        }
    }


    function showEditForm(business, card, popup) {
        const formExists = popup.querySelector('.edit-form');
        if (formExists) return formExists.querySelector('input[name="name"]').focus();

        const form = document.createElement('form');
        form.classList.add('edit-form');

        form.style.margin = "20px"; // 設定 form 的 margin
        form.style.maxWidth = "300px"; // 設定 form 的最大寬度

        ['name', 'description', 'quantity', 'price', 'image_url'].forEach((field) => {
            const input = document.createElement('input');
            input.type = field === 'quantity' || field === 'price' ? 'number' : 'text';
            input.value = business[field];
            input.name = field;
            input.placeholder = field.charAt(0).toUpperCase() + field.slice(1);
            input.style.display = "block";

            // 在 JavaScript 中添加額外的樣式
            input.style.marginBottom = "10px"; // 設定 input 之間的距離

            form.appendChild(input);
        });

        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.textContent = 'Save';
        submitButton.addEventListener('click', () => {
            // 直接更新卡片內容
            ['name', 'description', 'quantity', 'price', 'image_url'].forEach((field) => {
                const inputValue = form.querySelector(`input[name="${field}"]`).value;
                business[field] = inputValue;
                if (field === 'image_url') {
                    // 如果是 image_url，更新對應的 img 標籤的 src 和 alt 屬性
                    const imageElement = card.querySelector('.image');
                    if (imageElement) {
                        imageElement.src = inputValue;
                        imageElement.alt = business.name;
                    }
                } else {
                    // 其他欄位正常更新
                    const element = card.querySelector(`.${field}`);
                    if (element) {
                        element.innerText = field === 'quantity' || field === 'price' ? `${field.charAt(0).toUpperCase() + field.slice(1)}: ${inputValue}` : inputValue;
                    }
                }
            });
            form.remove();
        });
        console.log(business);
        form.append(submitButton);
        popup.appendChild(form);
    }

    function showDeleteForm(business, card) {
        card.remove(); // Replace with actual delete form implementation
        alert(`Delete business ${business.id}`);
    }

    function showStatusTable() {
        if (openDetailForm) {
            const statusTable = document.createElement('table');
            statusTable.innerHTML = `
            <tr>
                <th>Status</th>
                <th>Date</th>
            </tr>
            <tr>
                <td>InProgress</td>
                <td>2023-01-01</td>
            </tr>
            <tr>
                <td>Completed</td>
                <td>2023-01-15</td>
            </tr>
            <!-- Add more rows as needed -->
        `;

            openDetailForm.appendChild(statusTable);
        }
    }


    function showCommentSection(business, popup) {
        const commentSectionExists = popup.querySelector('.comment-section');
        if (commentSectionExists) return;

        const commentSection = document.createElement('div');
        commentSection.classList.add('comment-section');

        const commentInput = document.createElement('textarea');
        commentInput.placeholder = 'Type your comment here...';
        commentInput.classList.add('comment-input');

        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.textContent = 'Submit';
        submitButton.addEventListener('click', () => {
            const commentText = commentInput.value;
            if (commentText.trim() !== '') {
                addCommentToPopup(commentText, business, popup);
                commentInput.value = '';
            }
        });

        commentSection.appendChild(commentInput);
        commentSection.appendChild(submitButton);

        popup.appendChild(commentSection);
    }

    function addCommentToPopup(commentText, business, popup) {
        const commentContainer = document.createElement('div');
        commentContainer.classList.add('comment-container');

        const commentAuthor = document.createElement('span');
        commentAuthor.textContent = 'You: ';

        const commentTextElement = document.createElement('span');
        commentTextElement.textContent = commentText;

        commentContainer.appendChild(commentAuthor);
        commentContainer.appendChild(commentTextElement);

        const commentsSection = popup.querySelector('.comment-section');
        if (commentsSection) {
            commentsSection.appendChild(commentContainer);
        }
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
