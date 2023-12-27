async function toggleSub() {
    var subPopup = document.getElementById("sub-popup");
    subPopup.style.display = (subPopup.style.display === "block") ? "none" : "block";
    let resultPromise = getSubscription();
    let result = await resultPromise; // Wait for the promise to resolve
    console.log('hihi');
    console.log(result);

    // Assuming the result is an object with a 'subscriptions' property
    if (result && result.subscriptions) {
        console.log('Subscriptions details:', result.subscriptions);
        console.log('Subscriptions details:', result.subscriptions[0].shop_uuid);
    } else {
        console.log('No subscriptions found.');
    }
}

async function getSubscription() {
    console.log('Get Subscription');
    try {
        sub = [];
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
            console.log(jsonResponse);
            console.log('Success Get Subscription');
            return jsonResponse;
        } else {
            alert('u have not subscribe any shop');
            return null;
        }
    } catch (error) {
        console.error('Get Subscription API Error', error);
    }
}