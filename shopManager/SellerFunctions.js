document.addEventListener('DOMContentLoaded', function () {
    const managementContainer = document.getElementById('business-management');
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Product';
    addButton.classList.add('add-business-button'); // Add a class for styling

    // Apply styling to the button
    addButton.style.position = 'absolute';
    addButton.style.top = '420px';
    addButton.style.left = '0';
    addButton.style.display = 'block'; // Ensure it displays as a block
    addButton.style.zIndex = '999';

    // Append the button to the managementContainer
    managementContainer.appendChild(addButton);
    
    let openDetailForm = null;
    let currentDetailType = null;
    
    function renderBusinessCard(business) {
        const card = document.createElement('div');
        card.classList.add('business-card');
        card.innerHTML = `
            <h2 class="name">${business.name}</h2>
            <p class="description">${business.description}</p>
            <p class="stock">Stock: ${business.stock}</p>
            <p class="price">Price: ${business.price}</p>
            <p class="tags">Tag: ${business.tags}</p>
            <img class="image" src="${business.image}" alt="${business.name}">
            <button class="detail-button">Detail</button>
            <button class="product-delete-button">Delete</button>
        `;

        // 添加點擊事件監聽器
        card.addEventListener('click', (event) => {
            // 檢查點擊的目標元素是否為按鈕
            if (!event.target.matches('.detail-button') && !event.target.matches('.product-delete-button')) {
                // 不是按鈕，執行跳轉頁面的操作
                const businessSrc = event.currentTarget.querySelector('img').src;
                redirectToSpecificPage(business, businessSrc);
            }
        });

        card.querySelector('.product-delete-button').addEventListener('click', () => showDeleteForm(business, card));
        card.querySelector('.detail-button').addEventListener('click', () => showDetailPopup(business, card));

        managementContainer.appendChild(card);
    }
    
    // 定義跳轉頁面的函數
    function redirectToSpecificPage(business, businessImg) {
        // 在這裡實現跳轉到特定頁面的邏輯
        console.log(`Redirect to specific page for ${business}`);

        window.location.href = '../productDetail/ProductDetail.html?' + 
        `shopId=${encodeURIComponent(business.shop)}&`+
        `productId=${encodeURIComponent(business.id)}&` +
        `productName=${encodeURIComponent(business.name)}&`+
        `productDetail=${encodeURIComponent(business.description)}&`+
        `productSrc=${encodeURIComponent(businessImg)}&`+
        `productPrice=${encodeURIComponent(business.price)}&`+
        `productStock=${encodeURIComponent(business.stock)}&`;
    }

    async function showDeleteForm(business, card) {
        card.remove(); // Replace with actual delete form implementation 
        alert(`Delete business ${business.id}`);
        try {
            const baseURL = `http://localhost:8000/api/product/?`;
            const url = new URL(baseURL);
            url.searchParams.append("product_uuid",business.id);
            url.searchParams.append('is_active', "0");
            const response = await fetch(url.toString(), {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + getCookie("token"),
                },
            });

        }
        catch(error){
            throw error;
        }
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
                showStatusTable(popup, business);
                currentDetailType = 'status';
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

    function showEditForm(business, card, popup) {
        const formExists = popup.querySelector('.edit-form');
        if (formExists) return formExists.querySelector('input[name="name"]').focus();
        const form = document.createElement('form');
        form.classList.add('edit-form');
        form.style.margin = "20px"; // 設定 form 的 margin
        form.style.maxWidth = "300px"; // 設定 form 的最大寬度

        ['name', 'description', 'stock', 'price', 'image', 'tags'].forEach((field) => {
            const input = document.createElement('input');
            input.name = field;
            input.placeholder = field.charAt(0).toUpperCase() + field.slice(1);
            input.style.display = "block";
            input.style.marginBottom = "10px"; // 設定 input 之間的距離

            if (field === 'stock' || field === 'price') {
                input.type = 'number';
                input.value = business[field];
            } else if (field === 'image') {
                input.type = 'file';
                input.name = field;
                input.style.display = "block";
                input.style.marginBottom = "10px"; // 設定 input 之間的距離
            } else {
                input.type = 'text';
                input.value = business[field];
            }

            form.appendChild(input);
        });

        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.textContent = 'Save';
        submitButton.addEventListener('click', () => {
            const formData = {};
            const formInputs = form.querySelectorAll('input');
            formInputs.forEach(input => {
                if (input.type === 'file') {
                    // Handle file input separately (e.g., you might want to upload the file)
                    formData[input.name] = input.files[0]; // This assumes you only allow one file
                } else {
                    formData[input.name] = input.value;
                }
            });
    
            console.log("new product data",formData);
            console.log("old data", business);
            updateProduct(business, card, formData);
            
            form.remove();
        });
        form.append(submitButton);
        popup.appendChild(form);
    }

    async function updateProduct(business, card, formData){
        try {
            const baseURL = `http://localhost:8000/api/product/?`;
            const url = new URL(baseURL);
            url.searchParams.append("product_uuid",business.id);
            url.searchParams.append('name', formData.name);
            url.searchParams.append('stock', formData.stock);
            url.searchParams.append('price', formData.price);
            url.searchParams.append('tags', formData.tags);
            url.searchParams.append('description', formData.description);
            const response = await fetch(url.toString(), {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + getCookie("token"),
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Success Update Product');
                // 直接更新卡片內容
                ['name', 'description', 'stock', 'price', 'image', 'tags', 'is_active'].forEach((field) => {
                    if (field === 'image') {
                        const imageElement = card.querySelector('.image');
                        if (imageElement) {
                            updateProductImg(business, formData['image'])
                            .then(() => {
                                console.log('get uploaded image');
                                return fetchImage(business.id, 'avatar');  // Return the promise
                            })
                            .then((imageSrc) => {
                                console.log('new image', imageSrc);
                                imageSrc += '&t=' + new Date().getTime().toString();
                                imageElement.src = imageSrc;
                                imageElement.alt = business.name;
                            })
                            .catch((error) => {
                                console.error('Error updating image:', error);
                            });
                        }
                    } else {
                        const element = card.querySelector(`.${field}`);
                        if (element) {
                            business[field] = responseData[field];
                            console.log(element.innerText);
                            if(field == "name" || field == "description"){
                                element.innerText = responseData[field];
                            }
                            else{
                                element.innerText = `${field.charAt(0).toUpperCase() + field.slice(1)}: ${responseData[field]}`;    
                            }
                        }
                    }
                });
            } else {
                console.error('Error Upload Product Image');
            }
        } catch (error) {
            console.error('Update Product to API Error', error);
        }
        console.log("updated product in", business);
    }

    async function updateProductImg(business, file){
        if (file) {
            //const reader = new FileReader();
            //reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('file', file);
            console.log("file", file);
            try {
                const response = await fetch(`http://localhost:8000/api/image/?shop_uuid=${getCookie("shop_uuid")}&product_uuid=${business.id}&img_type=avatar`, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + getCookie('token'),
                    },
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Success Upload product avatar');
                    console.log(data);
                } else {
                    console.error('Error Upload product avatar');
                }
            } catch (error) {
                console.error('Upload to API Error', error);
            }
        }
    }

    // async function showStatusTable(popup, businessCardData) {
    //     const tableExists = popup.querySelector('.table');
    //     if (tableExists) return;
        
    //     if (openDetailForm) {
    //         const statusTableContainer = document.createElement('div');
    //         statusTableContainer.classList.add('table-container');
    //         statusTableContainer.style.position = 'absolute';
    //         statusTableContainer.style.top = '0';
    //         statusTableContainer.style.left = '0';
    //         statusTableContainer.style.right = '0';
    //         statusTableContainer.style.bottom = '15%'; // Adjust the bottom value as needed
    //         statusTableContainer.style.overflow = 'auto';

    //         const statusTable = document.createElement('table');
    //         statusTable.classList.add('table');
    //         // Header row
    //         try {
    //             const response = await fetch('http://localhost:8000/api/transaction/?target=Shop', {
    //                 method: 'GET',
    //                 headers: {
    //                     'Accept': 'application/json',
    //                     'Authorization': 'Bearer ' + getCookie('token')
    //                 }
    //             });
    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch data from the API');
    //             }
        
    //             const data = await response.json();
    //             // Header row
    //             statusTable.innerHTML = `
    //                 <tr>
    //                     <th>Transaction ID</th>
    //                     <th>Customer ID</th>
    //                     <th>Product Name</th>
    //                     <th>Status</th>
    //                     <th>Date Ordered</th>
    //                     <th>Expected Delivery Date</th>
    //                 </tr>
    //             `;
        
    //             // Data rows
    //             data.transactions.forEach(transaction => {
    //                 console.log(transaction);
    //                 if (transaction.products.transaction_product_logs[0].product_name != businessCardData.name){
    //                     return;
    //                 }
    //                 statusTable.innerHTML += `
    //                     <tr>
    //                         <td>${transaction.transaction_uuid}</td>
    //                         <td>${transaction.account_uuid}</td>
    //                         <td>${transaction.products.transaction_product_logs[0].product_name}</td>
    //                         <td>${transaction.status}</td>
    //                         <td>${transaction.order_time}</td>
    //                         <td>${transaction.receive_time}</td>
    //                     </tr>
    //                 `;
    //             });
        
    //             statusTableContainer.appendChild(statusTable);
    //             popup.appendChild(statusTableContainer);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //             alert('An error occurred while fetching status data. Please try again later.');
    //         }
    //     }
    // }

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
    
    async function getShopUUID(){
        const urlParams = new URLSearchParams(window.location.search);
        console.log("get self shop_uuid");
        const response = await fetch("http://localhost:8000/api/shop/mine", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + getCookie('token'),
            },
        });
        
        if (response.ok) {
            //get a self shop_uuid
            const jsonResponse = await response.json();
            console.log("success to get self shop")
            setCookie("shop_uuid", jsonResponse.shop_uuid);
            return jsonResponse.shop_uuid;
        } 
    
    }

    async function fetchBusinessCardData() {
        try {
            const baseURL = 'http://localhost:8000/api/product/all?';
            const url = new URL(baseURL);
            const self_shop_uuid = await getShopUUID();
            
            console.log("self_shop_uuid", self_shop_uuid);
            url.searchParams.append('order', "shop_uuid");
            url.searchParams.append('shop_uuid', self_shop_uuid);
            const response = await fetch(url.toString());
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('Error fetching businessCard data: ' + error.message);
        }
    }
    
    async function fetchImage(UUID, imgType) {
        const imageUrl = `http://localhost:8000/api/image/${UUID}?img_type=${imgType}`;
        console.log(`in fetch Image,UUID = ${UUID}, imgType = ${imgType}`);
        console.log(imageUrl);
        try {
            const response = await fetch(imageUrl.toString(), { mode: 'no-cors' });
    
            // Check if the request was successful (status 200) since no response body can be accessed
            return imageUrl;
        } catch (error) {
            console.error(`Error fetching image: ${error.message}`);
            return null;
        }
    }

    async function renderBusinessCards() {
        try {
            // Assuming fetchBusinessCardData returns an object with 'products' property
            const products = await fetchBusinessCardData();
            console.log(products);
            const productsData = products.products;
    
            const mappedData = [];
    
            for (const product of productsData) {
                try {
                    let productImage = await fetchImage(product.product_uuid, "avatar");
                    //console.log("is_active", product.is_active);
                    
                    if (productImage) {
                        console.log("productImage", productImage);
                        productImage += '&t=' + new Date().getTime().toString();
                    } else {
                        console.log("no picture, now product Image", productImage);
                        productImage = "../Resources/default_banner.webp";
                    }
                    
                    //console.log("productImage", productImage);
                    mappedData.push({
                        shop: product.shop_uuid,
                        id: product.product_uuid,
                        name: product.name,
                        description: product.description,
                        stock: product.stock,
                        price: product.price,
                        tags: product.tags,
                        is_active: product.is_active,
                        image: productImage // Use fetched image or default if not available
                    });
                } catch (imageError) {
                    console.error(`Error fetching image for product ${product.product_uuid}: ${imageError.message}`);
                }
            }
            console.log(mappedData);
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
            url.searchParams.append('stock', newBusinessCardData.stock);
            url.searchParams.append('price', newBusinessCardData.price);
            url.searchParams.append('tags', newBusinessCardData.tags);
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
            stock: 0,
            price: 0,
            tags: '',
            is_active: 1,
            image: '../Resources/default_banner.webp', // Provide a default image URL
        };
        createProduct(newBusiness);
    });

    function generateUniqueId() {
        return Date.now();
    }
});
