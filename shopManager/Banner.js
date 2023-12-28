// banner.js

document.addEventListener('DOMContentLoaded', function () {
    const banner = document.getElementById('banner');

    // 更新橫幅內容
    function updateBanner(data) {
        banner.innerHTML = `
        <div class="container">
            <div class="image-wrapper">
                <img src=${data.bannerImage} alt="" class="image" onerror="this.src='../Resources/default_banner.webp'"/>
                <div class="image-overlay">
                    <!--<div class="avatar-container">
                        <img src=${data.avatar} alt="Avatar" class="avatar" onerror="this.src='../Resources/default_avatar.webp'"/>
                    </div> -->
                    <div class="text-content">
                        <div class="shop-name">${data.shopname}</div>
                        <div class="description">${data.description}</div>
                    </div>
                </div>
            </div>
            <div class="buttons"> <button class="like" id="subscriptionButton"style="width: 50px; height: 50px;"> <span style="display: inline-block; transform: scale(2);">❤️</span> </button> </div>
        </div>
        `;
        const subButton = document.getElementById('subscriptionButton');
        subButton.addEventListener('click', function () {
            handleLikeButtonClick(data.shop_uuid);
        });
    }

    async function handleLikeButtonClick(shopUuid) {
        console.log('Sub button clicked for shop:', shopUuid);
        SubscribeShop(shopUuid);
    }

    function fetchImage(UUID, imgType) {
        return `http://localhost:8000/api/image/${UUID}?img_type=${imgType}`;
    }

    async function getShopUUID(){
        const urlParams = new URLSearchParams(window.location.search);
        const passedShopUUID = urlParams.get('shop_uuid');
        if(passedShopUUID == null){
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
            else if (response.status == 404){
                console.log("fail to get self shop, because dont have shop");
                try {
                    const response = await fetch('http://localhost:8000/api/shop/?name=Default Shop&description=Default Description', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': 'Bearer ' + getCookie('token'),
                        },
                    });
        
                    data = await response.json();
                    console.log(data);
                    if (response.ok) {
                        console.log('Shop Create Success:', data);
                    } else {
                        throw new Error('Shop Create Error');
                    }
                    setCookie("shop_uuid", data.shop_uuid);
                    return data.shop_uuid;
                } catch (error) {
                    console.error('Create Shop Error:', error);
                }
            }
        }
        else{
            return passedShopUUID;
        }
        //const shopUUID = passedShopUUID || getCookie("shop_uuid");
    }
    
    async function getShop() {
        try {
            // 替換 baseURL 為實際的 API 基礎 URL
            const baseURL = 'http://localhost:8000/api/shop/';
            const url = new URL(baseURL);

            url.searchParams.append('shop_uuid', await getShopUUID());

            const response = await fetch(url.toString());

            if (!response.ok) {
                throw new Error('Failed to fetch shopname and description from the API');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching shopname and description:', error);
        }
    }

    async function initBanner() {
        try {
            const shopData = await getShop();
            const bannerImage = await fetchImage(shopData.shop_uuid, "banner");
            const shopAvatar = await fetchImage(shopData.shop_uuid, "avatar");
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
