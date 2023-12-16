document.getElementById('submitButton').addEventListener('click', function () {
    const inputElements = document.querySelectorAll('input');
    const formData = {};
    const passwordError = document.getElementById('passwordError');
    inputElements.forEach(input => {
        formData[input.name] = input.value;
    });
    if (formData['password'] === formData['confirm_password']) {
        passwordError.textContent = '';
        fetch(`https://nft.servehttp.com/api/account/?` +
        (formData['name'] ? `name=${encodeURIComponent(formData['name'])}&` : '') +
        (formData['password'] ? `pwd=${encodeURIComponent(formData['password'])}&` : '') +
        (formData['image_url'] ? `image_url=${encodeURIComponent(formData['image_url'])}&` : '') +
        (formData['email'] ? `email=${encodeURIComponent(formData['email'])}&` : '') +
        (formData['phone'] ? `phone=${encodeURIComponent(formData['phone'])}&` : '') +
        (formData['credit_card'] ? `credit_card=${encodeURIComponent(formData['credit_card'])}&` : '') +
        (formData['birthday'] ? `birthday=${encodeURIComponent(formData['birthday'])}&` : '') +
        (formData['address'] ? `address=${encodeURIComponent(formData['address'])}` : ''), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                // 处理API请求错误
                console.error('API Error:', error);
            });
    } else {
        // 密码和确认密码不匹配，显示错误消息
        passwordError.textContent = 'Passwords do not match.';
    }
});
