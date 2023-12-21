document.addEventListener('DOMContentLoaded', function () {
    const managementContainer = document.getElementById('business-management');
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Business';
    document.body.appendChild(addButton);
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
            <p class="tag">Tag: ${business.tag}</p>
            <p class="is_active">Is_active: ${business.is_active}</p>
            <img class="image" src="${business.image}" alt="${business.name}">
            <button class="detail-button">Detail</button>
            <button class="delete-button">Delete</button>
        `;
        card.querySelector('.delete-button').addEventListener('click', () => showDeleteForm(business, card));
        card.querySelector('.detail-button').addEventListener('click', () => showDetailPopup(business, card));
        managementContainer.appendChild(card);
    }

    function showDeleteForm(business, card) {
        card.remove(); // Replace with actual delete form implementation 
        alert(`Delete business ${business.id}`);
    }

    function showDetailPopup(business, card) {

        if (openDetailForm) {
            openDetailForm.remove();
            openDetailForm = null;
        }

        const popup = document.createElement('div');
        popup.classList.add('detail-popup', 'large');
        popup.innerHTML = `
            <div class="button-container" style="position: fixed; top: 85%; display: flex; flex-direction: column; height: 15%; justify-content: flex-end; align-items: flex-end; width: 100%;">
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
        // assume that already have a form be called, hide it
        if (currentDetailType) {
            hideDetailContent(popup);
        }

        switch (buttonIndex) {
            case 1:
                console.log('Edit button clicked');
                showEditForm(business, card, popup);
                currentDetailType = 'edit';
                break;
            case 2:
                console.log('Status button clicked');
                showStatusTable(popup);
                currentDetailType = 'status';
                break;
            case 3:
                console.log('Comment button clicked');
                showCommentSection(business, popup);
                currentDetailType = 'comment';
                break;
            default:
                break;
        }
    }

    function hideDetailContent(popup) {
        // 根據當前的詳細類型隱藏相應的內容
        switch (currentDetailType) {
            case 'edit':
                hideEditForm(popup);
                break;
            case 'status':
                hideStatusTable(popup);
                break;
            case 'comment':
                hideCommentSection(popup);
                break;
            default:
                break;
        }

        currentDetailType = null;
    }

    function hideEditForm(popup) {
        const editForm = popup.querySelector('.edit-form');
        if (editForm) {
            editForm.remove();
        }
    }

    function hideStatusTable(popup) {
        console.log("status clean be called");
        const TableContainer = popup.querySelector('.table-container');
        const statusTable = popup.querySelector('.table');
        if (statusTable) {
            statusTable.remove();
            TableContainer.remove();
        }
    }

    function hideCommentSection(popup) {
        const TableContainer = popup.querySelector('.table-container');
        const commentSection = popup.querySelector('.comment-section');
        if (commentSection) {
            commentSection.remove();
            TableContainer.remove();
        }
    }

    function showEditForm(business, card, popup) {
        const formExists = popup.querySelector('.edit-form');
        if (formExists) return formExists.querySelector('input[name="name"]').focus();

        const form = document.createElement('form');
        form.classList.add('edit-form');

        form.style.margin = "20px"; // 設定 form 的 margin
        form.style.maxWidth = "300px"; // 設定 form 的最大寬度

        ['name', 'description', 'quantity', 'price', 'image', 'tag', 'is_active'].forEach((field) => {
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
            ['name', 'description', 'quantity', 'price', 'image', 'tag', 'is_active'].forEach((field) => {
                const inputValue = form.querySelector(`input[name="${field}"]`).value;
                business[field] = inputValue;
                if (field === 'image') {
                    const imageElement = card.querySelector('.image');
                    if (imageElement) {
                        imageElement.src = inputValue;
                        imageElement.alt = business.name;
                    }
                } else {
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

    function showStatusTable(popup) {
        const tableExists = popup.querySelector('.table');
        if (tableExists) return;

        if (openDetailForm) {
            const statusTableContainer = document.createElement('div');
            statusTableContainer.classList.add('table-container');
            statusTableContainer.style.position = 'absolute';
            statusTableContainer.style.top = '0';
            statusTableContainer.style.left = '0';
            statusTableContainer.style.right = '0';
            statusTableContainer.style.bottom = '15%'; // Adjust the bottom value as needed
            statusTableContainer.style.overflow = 'auto';

            const statusTable = document.createElement('table');
            statusTable.classList.add('table');
            // Header row
            statusTable.innerHTML = `
            <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Product Name</th>
                <th>Status</th>
                <th>Date Ordered</th>
                <th>Expected Delivery Date</th>
            </tr>
        `;

            // Mock Data
            const mockOrderData = [
                {
                    orderId: 1,
                    customerName: 'John Doe',
                    productName: 'Product A',
                    status: 'InProgress',
                    dateOrdered: '2023-01-01',
                    expectedDeliveryDate: '2023-01-10'
                },
                {
                    orderId: 2,
                    customerName: 'Jane Smith',
                    productName: 'Product B',
                    status: 'Completed',
                    dateOrdered: '2023-01-15',
                    expectedDeliveryDate: '2023-01-25'
                },
                {
                    orderId: 2,
                    customerName: 'Jane Smith',
                    productName: 'Product B',
                    status: 'Completed',
                    dateOrdered: '2023-01-15',
                    expectedDeliveryDate: '2023-01-25'
                },
                {
                    orderId: 2,
                    customerName: 'Jane Smith',
                    productName: 'Product B',
                    status: 'Completed',
                    dateOrdered: '2023-01-15',
                    expectedDeliveryDate: '2023-01-25'
                },
                {
                    orderId: 2,
                    customerName: 'Jane Smith',
                    productName: 'Product B',
                    status: 'Completed',
                    dateOrdered: '2023-01-15',
                    expectedDeliveryDate: '2023-01-25'
                },
                {
                    orderId: 2,
                    customerName: 'Jane Smith',
                    productName: 'Product B',
                    status: 'Completed',
                    dateOrdered: '2023-01-15',
                    expectedDeliveryDate: '2023-01-25'
                }, {
                    orderId: 2,
                    customerName: 'Jane Smith',
                    productName: 'Product B',
                    status: 'Completed',
                    dateOrdered: '2023-01-15',
                    expectedDeliveryDate: '2023-01-25'
                },

                // Add more mock data as needed
            ];

            // Data rows
            mockOrderData.forEach(order => {
                statusTable.innerHTML += `
                <tr>
                    <td>${order.orderId}</td>
                    <td>${order.customerName}</td>
                    <td>${order.productName}</td>
                    <td>${order.status}</td>
                    <td>${order.dateOrdered}</td>
                    <td>${order.expectedDeliveryDate}</td>
                </tr>
            `;
            });
            statusTableContainer.appendChild(statusTable);
            popup.appendChild(statusTableContainer);
        }
    }

    function showCommentSection(business, popup) {
        const commentSectionExists = popup.querySelector('.comment-section');
        if (commentSectionExists) return;
        const commentSectionContainer = document.createElement('div');
        commentSectionContainer.classList.add('table-container');
        commentSectionContainer.style.position = 'absolute';
        commentSectionContainer.style.top = '0';
        commentSectionContainer.style.left = '0';
        commentSectionContainer.style.right = '0';
        commentSectionContainer.style.bottom = '15%'; // Adjust the bottom value as needed
        commentSectionContainer.style.overflow = 'auto';
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
                addCommentToPopup(commentText, 'You', popup);
                commentInput.value = '';
            }
        });

        commentSection.appendChild(commentInput);
        commentSection.appendChild(submitButton);
        commentSectionContainer.appendChild(commentSection);
        popup.appendChild(commentSectionContainer);

        // Mock comment to addCommentToPopup
        const mockData = [
            {
                name: 'Kyynk',
                comment: 'Great work!',
            },
            {
                name: 'GM',
                comment: 'Nice job!',
            },
            {
                name: 'Vincent',
                comment: 'Awesome!',
            },
            {
                name: 'Vincent',
                comment: 'Awesome!',
            },
            {
                name: 'Vincent',
                comment: 'Awesome!',
            },
            {
                name: 'Vincent',
                comment: 'Awesome!',
            },
            {
                name: 'Vincent',
                comment: 'Awesome!',
            },
            {
                name: 'Vincent',
                comment: 'Awesome!',
            },
            {
                name: 'Vincent',
                comment: 'Awesome!',
            },
            {
                name: 'Vincent',
                comment: 'Awesome!',
            },
            {
                name: 'Vincent',
                comment: 'Awesome!',
            },
            {
                name: 'Vincent',
                comment: 'Awesome!',
            },
            {
                name: 'Vincent',
                comment: 'Awesome!',
            },
            {
                name: 'Vincent',
                comment: 'Awesome!',
            },
            {
                name: 'Vincent',
                comment: 'Awesome!',
            },
            {
                name: 'Vincent',
                comment: 'Awesome!',
            }, {
                name: 'Vincent',
                comment: 'Awesome!',
            },
            {
                name: 'Vincent',
                comment: 'Awesome!',
            },


        ];
        mockData.forEach(data => {
            addCommentToPopup(data.comment, data.name, popup);
        });

    }

    function addCommentToPopup(commentText, name, popup) {
        //console.log("name", name, "comment Test", commentText);
        const commentContainer = document.createElement('div');
        commentContainer.classList.add('comment-container');

        const commentAuthor = document.createElement('span');
        commentAuthor.textContent = name + ': ';

        const commentTextElement = document.createElement('span');
        commentTextElement.textContent = commentText;

        commentContainer.appendChild(commentAuthor);
        commentContainer.appendChild(commentTextElement);

        //console.log(commentContainer.innerHTML);
        const commentsSection = popup.querySelector('.comment-section');
        if (commentsSection) {
            //console.log("success to comment");
            commentsSection.appendChild(commentContainer);
        }
    }


    async function fetchBusinessCardData() {
        try {
            const baseURL = 'http://localhost:8000/api/product/all?';
            const url = new URL(baseURL);
            const self_shop_uuid = getCookie("shop_uuid");
            url.searchParams.append('order', "shop_uuid");
            url.searchParams.append('shop_uuid', self_shop_uuid);
            const response = await fetch(url.toString());
            const data = await response.json();
            console.log("return data", data);
            return data;
        } catch (error) {
            throw new Error('Error fetching businessCard data: ' + error.message);
        }
    }
    
    async function fetchImage(UUID, imgType) {
        try {
            // Replace baseURL with the actual API base URL for fetching images
            const baseURL = `http://localhost:8000/api/image/${UUID}?img_type=${imgType}`;
            const response = await fetch(baseURL);

            if (!response.ok) {
                throw new Error('Failed to fetch shop image from the API');
            }

            const imageData = await response.blob(); // Get image data as Blob
            const imageUrl = URL.createObjectURL(imageData); // Convert Blob to URL

            return imageUrl;
        } catch (error) {
            console.error('Error fetching shop image:', error);
            //throw error;

        }
    }

    async function renderBusinessCards() {
        try {
            // Assuming fetchBusinessCardData returns an object with 'products' property
            const products = await fetchBusinessCardData();
            const productsData = products.products;
    
            const mappedData = [];
    
            for (const product of productsData) {
                try {
                    const productImage = await fetchImage(product.product_uuid, "avatar");
                    console.log("is_active", product.is_active);
                    mappedData.push({
                        id: product.product_uuid,
                        name: product.name,
                        description: product.description,
                        quantity: product.stock,
                        price: product.price,
                        tag: product.tags,
                        is_active: product.is_active,
                        image: productImage || "../Resources/default_banner.webp", // Use fetched image or default if not available
                    });
                } catch (imageError) {
                    console.error(`Error fetching image for product ${product.product_uuid}: ${imageError.message}`);
                }
            }
    
            console.log("mappedData:", mappedData);
            mappedData.forEach(renderBusinessCard);
        } catch (error) {
            console.error(error.message);
        }
    }

    renderBusinessCards();

    async function createProduct(newBusinessCardData){
        try {
            // Replace baseURL with the actual API base URL for fetching images
            const baseURL = `http://localhost:8000/api/product/?`;
            const url = new URL(baseURL);
            url.searchParams.append('name', newBusinessCardData.name);
            url.searchParams.append('stock', newBusinessCardData.quantity);
            url.searchParams.append('price', newBusinessCardData.price);
            url.searchParams.append('tags', newBusinessCardData.tag);
            url.searchParams.append('is_avtive', newBusinessCardData.is_active);
            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': "Bearer " + getCookie("token"),
                },
            });

            if (!response.ok) {
                throw new Error('Failed to create a product from the API');
            }
            console.log("Create Product response", response);
            location.reload();
        } catch (error) {
            console.error('Error Create Product response:', error);
            throw error;
        }
    }

    addButton.addEventListener('click', () => {
        // Create a new business object with default values
        const newBusiness = {
            id: generateUniqueId(),
            name: 'New Business',
            description: 'Description',
            quantity: 0,
            price: 0,
            tag: 'None',
            is_active: 1,
            image: '../Resources/default_banner.webp', // Provide a default image URL
        };
        createProduct(newBusiness);
    });

    function generateUniqueId() {
        return Date.now();
    }
});
