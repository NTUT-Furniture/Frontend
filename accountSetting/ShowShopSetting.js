async function showShopSetting() {
    // 先清空 content 區域的內容
    document.getElementById('content').innerHTML = '';

    // 創建 form 元素
    const formElement = document.createElement('form');
    formElement.className = 'AccountSetting-form';
    formElement.action = ''; // 設置表單的 action 屬性
    formElement.method = 'POST'; // 設置表單的 method 屬性
    let data =""
    const shopUuid = getCookie('shop_uuid');
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
    createBannerButton.type = 'submit';
    createBannerButton.textContent = 'Create Banner';

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
    confirmButton.type = 'submit';
    confirmButton.textContent = 'Confirm';

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
    formElement.appendChild(shopNameFormGroup);
    formElement.appendChild(descriptionFormGroup);
    formElement.appendChild(buttonContainer);

    document.getElementById('content').appendChild(formElement);
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