function toggleSub() {
    var subPopup = document.getElementById("sub-popup");
    subPopup.style.display = (subPopup.style.display === "block") ? "none" : "block";
}

async function getSubscription() {
    try {
        accID = getCookie('account_uuid');
        console.log('subscription account_uuid: ' + accID);
        const baseURL = `http://localhost:8000/api/subscription/account?`;
        const url = new URL(baseURL);
        url.searchParams.append("target", "account_uuid");
        url.searchParams.append('account_uuid', accID);
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + getCookie('token'),
            },
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log('Success Get Subscription');
            
        } else {
            alert('u have not subscribe any shop');
        }
    } catch (error) {
        console.error('Get Subscription API Error', error);
    }
    console.log('Get Subscription');
}