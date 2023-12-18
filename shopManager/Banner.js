// banner.js

document.addEventListener('DOMContentLoaded', function () {
    const banner = document.getElementById('banner');
    let shopName = null;
    let shopDescription = null;

    // 更新橫幅內容
    function updateBanner(data) {
        banner.innerHTML = `
        <div class="container">
            <div class="image-wrapper">
                <img src=${data.image} alt="" class="image"/>
                <div class="image-overlay">
                    <div class="avatar-container">
                        <img src=${data.avatar} alt="Avatar" class="avatar"/>
                    </div>
                    <div class="text-content">
                        <div class="shop-name">${shopName}</div>
                        <div class="description">${shopDescription}</div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    function fetchMockBannerData() {
        // 假的 JSON 數據
        const mockData = {
            shopname: "GM Furniture Emporium",
            description: "Shop Description",
            image: "../Resources/Banner.jpg",
            avatar: "../Resources/frog_avatar.jpg"
        };
        updateBanner(mockData);
    }

    async function fetchImage(UUID,imgType) {
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
            throw error;
        }
    }

    async function getShop(accountUUID) {
        try {
            // 替換 baseURL 為實際的 API 基礎 URL
            const baseURL = 'http://localhost:8000/api/shop/';
            const url = new URL(baseURL);
            
            // 添加 query 參數，這裡使用 account_uuid，您可以根據實際需求調整
            url.searchParams.append('account_uuid', accountUUID);
    
            const response = await fetch(url.toString());
    
            if (!response.ok) {
                throw new Error('Failed to fetch shopname and description from the API');
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching shopname and description:', error);
            throw error; // 可以根據實際需求處理錯誤
        }
    }

    const accountUUID = '9b6a5a9c-2eed-45df-a438-77406dccc000';
    getShop(accountUUID)
    .then(({ data: [shopData] }) => {
        console.log('Shop data:', shopData);
        const { name, description } = shopData;
        shopName = name;
        shopDescription = description;
        console.log("name:", name);
        console.log("description:", description);
    })
    .catch(error => {
        console.error('Error:', error);
        // 在這裡處理錯誤
    });

    document.body.addEventListener('htmx:afterSwap', function (event) {
        if (event.target === banner) {
            fetchMockBannerData();
        }
    });
});
