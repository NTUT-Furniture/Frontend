// banner.js

document.addEventListener('DOMContentLoaded', function () {
    const banner = document.getElementById('banner');

    // 更新橫幅內容
    function updateBanner(data) {
        console.log("IN update Banner", data);
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
            const accountUUID = getCookie("account_uuid");
            console.log("init banner accountUUid:",accountUUID);
            const { data: [shopData] } = await getShop(accountUUID);
            const bannerImage = await fetchImage(shopData.shop_uuid, "banner");
            const shopAvatar = await fetchImage(shopData.shop_uuid, "avatar");
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

// 以下是新增的 cookie 操作函數

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    console.log("see all cookie",document.cookie);
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}
