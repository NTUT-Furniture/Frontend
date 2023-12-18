// banner.js

document.addEventListener('DOMContentLoaded', function () {
    const banner = document.getElementById('banner');

    // 更新橫幅內容
    function updateBanner(data) {
        console.log("IN update Banner",data);
        banner.innerHTML = `
        <div class="container">
            <div class="image-wrapper">
                <img src=${data.bannerImage} alt="" class="image"/>
                <div class="image-overlay">
                    <div class="avatar-container">
                        <img src=${data.avatar} alt="Avatar" class="avatar"/>
                    </div>
                    <div class="text-content">
                        <div class="shop-name">${data.shopname}</div>
                        <div class="description">${data.description}</div>
                    </div>
                </div>
            </div>
        </div>
        `;
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

    async function initBanner() {
        try {
            const accountUUID = localStorage.getItem("account_uuid");
            const { data: [shopData] } = await getShop(accountUUID);
            const bannerImage = await fetchImage(shopData.shop_uuid,"banner");
            const shopAvatar = await fetchImage(shopData.shop_uuid,"avatar");
            const Data = {
                shopname: shopData.name,
                description: shopData.description,
                bannerImage: bannerImage,
                avatar: shopAvatar
            };
            console.log(Data);
            updateBanner(Data);

        } catch (error) {
            console.error('Error initializing banner:', error);
        }
    }

    // Initialize the banner
    initBanner();

});
