// banner.js

document.addEventListener('DOMContentLoaded', function () {
    const banner = document.getElementById('banner');

    // 更新橫幅內容
    function updateBanner(data) {
        banner.innerHTML = `
        <div class="container">
            <div class="image-wrapper">
                <img src=${data.bannerImage} alt="" class="image" onerror="this.src='../Resources/default_banner.web'"/>
                <div class="image-overlay">
                    <div class="avatar-container">
                        <img src=${data.avatar} alt="Avatar" class="avatar" onerror="this.src='../Resources/default_avatar.web'"/>
                    </div>
                    <div class="text-content">
                        <div class="shop-name">${data.shopname}</div>
                        <div class="description">${data.description}</div>
                    </div>
                </div>
            </div>
            <div class="buttons"> <button class="like" id="subscriptionButton"style="width: 50px; height: 50px;"> <span style="display: inline-block; transform: scale(2);">♥</span> </button> </div>
        </div>
        `;
        const subButton = document.getElementById('subscriptionButton');
        subButton.addEventListener('click', function () {
            handleLikeButtonClick(data.shop_uuid);
        });
    }

    async function handleLikeButtonClick(shopUuid) {
        // 处理按钮点击事件
        console.log('Sub button clicked for shop:', shopUuid);

        // 调用订阅函数或其他逻辑
        // 例如： subscribe(shopUuid);
    }

    function fetchImage(UUID, imgType) {
        return `http://localhost:8000/api/image/${UUID}?img_type=${imgType}`;
    }

    async function getShop() {
        try {
            // 替換 baseURL 為實際的 API 基礎 URL
            const baseURL = 'http://localhost:8000/api/shop/';
            const url = new URL(baseURL);
            const urlParams = new URLSearchParams(window.location.search);
            const passedShopUUID = urlParams.get('shop_uuid');
            const shopUUID = passedShopUUID || getCookie("shop_uuid");
            url.searchParams.append('shop_uuid', shopUUID);

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
            const shopData = await getShop();
            const bannerImage = fetchImage(shopData.shop_uuid, "banner");
            const shopAvatar = fetchImage(shopData.shop_uuid, "avatar");
            const Data = {
                shop_uuid: shopData.shop_uuid,
                shopname: shopData.name,
                description: shopData.description,
                bannerImage: bannerImage,
                avatar: shopAvatar
            };
            updateBanner(Data);

        } catch (error) {
            // If getShop fails, provide default values for the banner
            const defaultData = {
                shopname: 'Default Shop',
                description: 'Default Description',
                bannerImage: '../Resources/default_banner.webp',
                avatar: '../Resources/default_avatar.webp'
            };
            updateBanner(defaultData);
        }
    }
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
