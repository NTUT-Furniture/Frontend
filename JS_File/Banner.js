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
            <div class="image-text-container" style="font-size:40px">${data.shopname}</div>
            <div class="image-text-container" style="font-size:30px; bottom:0">${data.description}</div>
            </div>
        </div>
        `;
    }

    function fetchMockBannerData() {
        // 假的 JSON 數據
        const mockData = {
            shopname: "GM's Shop",
            description: "Shop Description",
            image: "../Resourse/Banner.jpg"
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
