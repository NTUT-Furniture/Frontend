async function showShopSetting() {
    document.getElementById('content').innerHTML = '';

    const formElement = document.createElement('form');
    formElement.className = 'AccountSetting-form';
    formElement.action = ''; // 設置表單的 action 屬性
    formElement.method = 'POST'; // 設置表單的 method 屬性
    let data =""
    const shopUuid = getCookie('shop_uuid');
    const token = getCookie('token');
    console.log(shopUuid === 'undefined');
    if (shopUuid === 'undefined') {
        try {
            const response = await fetch('http://localhost:8000/api/shop/?name=Shop&description=Empty', {
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
        } catch (error) {
            console.error('Create Shop Error:', error);
        }
    }
    else{
        data = await GetAccount('Bearer',getCookie('token'));
    }

    console.log(data);
    const createBannerButton = document.createElement('button');
    createBannerButton.id = 'Banner';
    createBannerButton.type = 'button';
    createBannerButton.textContent = 'Create Banner';
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'bannerFileInput';
    fileInput.style.display = 'none';
    
    createBannerButton.addEventListener('click', function() {
        fileInput.click();
    });

    const shopNameFormGroup = document.createElement('div');
    shopNameFormGroup.className = 'form-group';

    const nameLabelElement = document.createElement('label');
    nameLabelElement.setAttribute('for', 'shopname');
    nameLabelElement.textContent = 'Name';

    const shopNameInput = document.createElement('input');
    shopNameInput.type = 'text';
    shopNameInput.id = 'shopname';
    shopNameInput.name = 'shopname';
    shopNameInput.value = data.name;

    shopNameFormGroup.appendChild(nameLabelElement);
    shopNameFormGroup.appendChild(shopNameInput);

    const descriptionFormGroup = document.createElement('div');
    descriptionFormGroup.className = 'form-group';

    const descriptionLabelElement = document.createElement('label');
    descriptionLabelElement.setAttribute('for', 'description');
    descriptionLabelElement.textContent = 'Description';

    const descriptionTextarea = document.createElement('textarea');
    descriptionTextarea.type = 'text';
    descriptionTextarea.id = 'description';
    descriptionTextarea.name = 'description';
    descriptionTextarea.value = data.description;
    descriptionTextarea.required = true;

    descriptionFormGroup.appendChild(descriptionLabelElement);
    descriptionFormGroup.appendChild(descriptionTextarea);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'AccountSetting-Button';

    const confirmButton = document.createElement('button');
    confirmButton.id = 'Confirm';
    confirmButton.type = 'button';
    confirmButton.textContent = 'Confirm';
    confirmButton.addEventListener('click',async function(event){
        event.preventDefault();
        modifyShopSetting("Bearer",token);
        try {
            await modifyShopSetting("Bearer", token);
            window.location.reload();
        } catch (error) {
            console.error('Error during shop modification:', error);
        }
    });

    const cancelButton = document.createElement('button');
    cancelButton.id = 'Cancel';
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', function() {
        showShopSetting(); 
    });

    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(cancelButton);

    formElement.appendChild(createBannerButton);
    formElement.appendChild(fileInput);
    formElement.appendChild(shopNameFormGroup);
    formElement.appendChild(descriptionFormGroup);
    formElement.appendChild(buttonContainer);

    document.getElementById('content').appendChild(formElement);

    loadBannerImage();

    fileInput.addEventListener('change', async function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                createBannerButton.style.backgroundImage = `url(${e.target.result})`;
                createBannerButton.textContent = 'Banner'; // 清除按钮文字
            };
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch(`http://localhost:8000/api/image/?shop_uuid=${shopUuid}&img_type=banner`, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Success');
                    console.log(data);
                } else {
                    console.error('Error');
                }
            } catch (error) {
                console.error('Upload Error', error);
            }
        }
    });
}


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function GetAccount(type,token) {
    try {
        const response = await fetch('http://localhost:8000/api/shop/mine', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': type + " " + token,
            },
        });

        const data = await response.json();
        console.log(document.cookie);
        return data
    } catch (error) {
        throw new Error('Error fetching account data: ' + error.message);
    }
}

async function modifyShopSetting(type, token) {
    var shopName = document.getElementById('shopname').value;
    var description = document.getElementById('description').value;

    try {
        const response = await fetch(`http://localhost:8000/api/shop/?` +
            `name=${shopName}&`+
            `description=${description}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': type + " " + token,
                },
            });

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

async function loadBannerImage() {
    const shopUuid = getCookie('shop_uuid');
    const imageUrl = `http://localhost:8000/api/image/${shopUuid}?img_type=banner`;
    try {
        const response = await fetch(imageUrl);
        if (response.ok) {
            document.getElementById('Banner').style.backgroundImage = `url(${imageUrl})`;
            document.getElementById('Banner').textContent = "Banner";
        } else if (response.status === 404) {
            console.log('Image not found, not changing the banner.');
        }
    } catch (error) {
        console.error('Error fetching image:', error);
    }
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
    //console.log(document.cookie);
}