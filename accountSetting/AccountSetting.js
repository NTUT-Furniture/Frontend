async function showAccountSetting() {
    document.getElementById('content').innerHTML = '';
    const formElement = document.createElement('form');
    formElement.className = 'AccountSetting-form';
    formElement.action = '';
    formElement.method = 'POST'; 

    const token = getCookie('token');
    console.log(token);
    formGroups =  await GetAccountDetail("Bearer",token);

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
        inputElement.value = group.value;
        inputElement.required = group.required;
        inputElement.readOnly = group.readOnly;

        formGroupElement.appendChild(labelElement);
        formGroupElement.appendChild(inputElement);

        formElement.appendChild(formGroupElement);
    });
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'AccountSetting-Button';

    const modifyButton = document.createElement('button');
    modifyButton.id = 'Confirm';
    modifyButton.type = 'button';
    modifyButton.textContent = 'Confirm';
    modifyButton.addEventListener('click',async function(event) {
        event.preventDefault();
        modifyAccountSetting("Bearer", token);
        try {
            await modifyAccountSetting("Bearer", token);
            window.location.reload();
        } catch (error) {
            console.error('Error during account modification:', error);
        }
    });

    const cancelButton = document.createElement('button');
    cancelButton.id = 'Cancel';
    cancelButton.type = 'button'; 
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', function() {
        showAccountSetting(); 
    });
    buttonContainer.appendChild(modifyButton);
    buttonContainer.appendChild(cancelButton);

    formElement.appendChild(buttonContainer);

    document.getElementById('content').appendChild(formElement);
}

async function modifyAccountSetting(type, token) {
    const inputElements = document.querySelectorAll('input');
    const formData = {};

    inputElements.forEach(input => {
        formData[input.name] = input.value;
    });
    if(formData['password']==="***"){
        formData['password'] = "";
    }
    try {
        const baseURL = "https://nfta.noobdy.com";
        const response = await fetch(`${baseURL}/api/account/?` +
            // `account_uuid=${getCookie("account_uuid")}&`+
            (formData['username'] ? `name=${encodeURIComponent(formData['username'])}&` : '') +
            (formData['password'] ? `pwd=${encodeURIComponent(formData['password'])}&` : '') +
            // (formData['image_url'] ? `image_url=${encodeURIComponent(formData['image_url'])}&` : '') +
            // (formData['email'] ? `email=${encodeURIComponent(formData['email'])}&` : '') +
            (formData['phone'] ? `phone=${encodeURIComponent(formData['phone'])}&` : '') +
            (formData['credcard'] ? `credit_card=${encodeURIComponent(formData['credcard'])}&` : '') +
            (formData['birthday'] ? `birthday=${encodeURIComponent(formData['birthday'])}&` : '') +
            (formData['address'] ? `address=${encodeURIComponent(formData['address'])}` : ''), {
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

async function GetAccountDetail(type,token) {
    try {
        const baseURL = "https://nfta.noobdy.com";
        const response = await fetch(`${baseURL}/api/account/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': type + " " + token, 
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const jsonData = await response.json();
        console.log(jsonData)
        return updateFormGroups(jsonData);
    } catch (error) {
        console.error('The Account Error: ', error);
        throw error;
    }
}

function updateFormGroups(jsonData) {
    let formGroups = [
      {
          label: 'E-mail',
          type: 'text',
          id: 'e-mail',
          name: 'e-mail',
          value: jsonData.email,
          readOnly: true
      },
      {
          label: 'Account',
          type: 'text',
          id: 'username',
          name: 'username',
          value: jsonData.name,
      },
      {
        label: 'Password',
        type: 'password',
        id: 'password',
        name: 'password',
        value: '***'
      },
      {
          label: 'Address',
          type: 'text',
          id: 'address',
          name: 'address',
          value: jsonData.address,
      },
      {
          label: 'PhoneNumber',
          type: 'text',
          id: 'phone',
          name: 'phone',
          value: jsonData.phone,
      },
      {
          label: 'Birthday',
          type: 'date',
          id: 'birthday',
          name: 'birthday',
          value: jsonData.birthday,
      },
      {
        label: 'CredCard',
        type: 'text',
        id: 'credcard',
        name: 'credcard',
        value: jsonData.credit_card
        },
    ];
    console.log(formGroups);
    return formGroups;
}

function getCookie(cookieName) {
    const cookies = document.cookie;
    const cookieArray = cookies.split('; ');
    const tokenCookie = cookieArray.find(row => row.startsWith(cookieName + '='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
}
