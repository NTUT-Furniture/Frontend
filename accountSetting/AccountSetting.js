function showAccountSetting() {
    document.getElementById('content').innerHTML = '';
    const formElement = document.createElement('form');
    formElement.className = 'AccountSetting-form';
    formElement.action = ''; // 設置表單的 action 屬性
    formElement.method = 'POST'; // 設置表單的 method 屬性

    const formGroups = [
        {
            label: 'E-mail',
            type: 'text',
            id: 'e-mail',
            name: 'e-mail',
            placeholder: 't110590028@ntut.org.tw',
        },
        {label: 'Account', type: 'text', id: 'username', name: 'username', placeholder: 'Garry1128'},
        {label: 'Password', type: 'password', id: 'password', name: 'password', placeholder: '***'},
        {label: 'Address', type: 'text', id: 'address', name: 'address', placeholder: '窩忘了'},
        {
            label: 'PhoneNumber',
            type: 'text',
            id: 'phonenumber',
            name: 'phonenumber',
            placeholder: '窩不知道'
        },
        {
            label: 'Birthday',
            type: 'date',
            id: 'birthday',
            name: 'birthday',
            placeholder: '2023/01/01'
        },
        {
            label: 'CredCard',
            type: 'text',
            id: 'credcard',
            name: 'credcard',
            placeholder: '123123123'
        },
    ];

    formGroups.forEach(function (group) {
        const formGroupElement = document.createElement('div');
        formGroupElement.className = 'form-group';

        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', group.id);
        labelElement.textContent = group.label;

        const inputElement = document.createElement('input');
        inputElement.type = group.type;
        inputElement.id = group.id;
        inputElement.name = group.name;
        inputElement.placeholder = group.placeholder;
        inputElement.required = group.required;

        formGroupElement.appendChild(labelElement);
        formGroupElement.appendChild(inputElement);

        formElement.appendChild(formGroupElement);
    });
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'AccountSetting-Button';

    const modifyButton = document.createElement('button');
    modifyButton.id = 'Confirm';
    modifyButton.type = 'submit';
    modifyButton.textContent = 'Confirm';
    modifyButton.addEventListener('click', function() {
        modifyAccountSetting();
    });

    const cancelButton = document.createElement('button');
    cancelButton.id = 'Cancel';
    cancelButton.type = 'button'; // 如果是取消操作，使用 type="button"
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', function() {
        showAccountSetting(); // 调用 showAccountSetting() 函数
    });
    buttonContainer.appendChild(modifyButton);
    buttonContainer.appendChild(cancelButton);

    formElement.appendChild(buttonContainer);

    document.getElementById('content').appendChild(formElement);
}

function modifyAccountSetting(){
    const inputElements = document.querySelectorAll('input');
    const formData = {};

    inputElements.forEach(input => {
        formData[input.name] = input.value;
    });
    fetch(`http://localhost:8000/api/account/?` +
        (formData['username'] ? `name=${encodeURIComponent(formData['username'])}&` : '') +
        (formData['password'] ? `pwd=${encodeURIComponent(formData['password'])}&` : '') +
        (formData['image_url'] ? `image_url=${encodeURIComponent(formData['image_url'])}&` : '') +
        (formData['email'] ? `email=${encodeURIComponent(formData['email'])}&` : '') +
        (formData['phone'] ? `phone=${encodeURIComponent(formData['phone'])}&` : '') +
        (formData['credit_card'] ? `credit_card=${encodeURIComponent(formData['credit_card'])}&` : '') +
        (formData['birthday'] ? `birthday=${encodeURIComponent(formData['birthday'])}&` : '') +
        (formData['address'] ? `address=${encodeURIComponent(formData['address'])}` : ''), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(formData);
            })
            .catch(error => {
                console.error('API Error:', error);
            });
}
