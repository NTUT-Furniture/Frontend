// banner.js

document.addEventListener('DOMContentLoaded', function () {
    // 獲取橫幅元素
    const banner = document.getElementById('banner');

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
                        <div class="shop-name">${data.shopname}</div>
                        <div class="description">${data.description}</div>
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

    fetchMockBannerData();
    document.body.addEventListener('htmx:afterSwap', function (event) {
        if (event.target === banner) {
            fetchMockBannerData();
        }
    });
});
