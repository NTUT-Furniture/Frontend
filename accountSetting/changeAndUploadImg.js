document.getElementById('changeAndUploadAvatarButton').addEventListener('click', function() {
    document.getElementById('avatarInput').click();
});

document.getElementById('avatarInput').addEventListener('change', async function(event) {
    token = getCookie('token');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatarImage').src = e.target.result;
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const baseURL = "https://nfta.noobdy.com";
            const response = await fetch(`${baseURL}/api/image/?img_type=avatar`, {
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


function loadAvatarImage() {
    account_uuid = getCookie('account_uuid');
    const timestamp = new Date().getTime();
    const baseURL = "https://nfta.noobdy.com";
    const imageUrl = `${baseURL}/api/image/${account_uuid}?img_type=avatar&t=${timestamp}`;
    document.getElementById('avatarImage').src = imageUrl;
    console.log(imageUrl)
}

window.addEventListener('load', loadAvatarImage);
