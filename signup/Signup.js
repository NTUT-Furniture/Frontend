document.getElementById('submitButton').addEventListener('click', function () {
    const inputElements = document.querySelectorAll('input');
    const formData = {};
    const passwordError = document.getElementById('passwordError');
    inputElements.forEach(input => {
        formData[input.name] = input.value;
    });
    if (formData['password'] === formData['confirm_password']) {
        passwordError.textContent = '';
        fetch(`https://nft.servehttp.com/api/account/?\
        name=${encodeURIComponent(formData['name'])}&\
        pwd=${encodeURIComponent(formData['password'])}&\
        image_url=${encodeURIComponent(formData['image_url'])}&\
        email=${encodeURIComponent(formData['email'])}&\
        phone=${encodeURIComponent(formData['phone'])}&\
        credit_card=${encodeURIComponent(formData['credit_card'])}&\
        birthday=${encodeURIComponent(formData['birthday'])}&\
        address=${encodeURIComponent(formData['address'])}`, {
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
