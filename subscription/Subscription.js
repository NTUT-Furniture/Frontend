async function toggleSub() {
    var subPopup = document.getElementById("sub-popup");
    subPopup.style.display = (subPopup.style.display === "block") ? "none" : "block";
    let resultPromise = getAccountSubscription();
    let result = await resultPromise; // Wait for the promise to resolve
    console.log('hihi');
    console.log(result);

    // Assuming the result is an object with a 'subscriptions' property
    if (result && result.subscriptions) {
        for (var i=0; i<result.subscriptions.length; i++) {
            console.log('Subscriptions details:', result.subscriptions[i].shop_uuid);
        }
        // console.log('Subscriptions details:', result.subscriptions);
        // console.log('Subscriptions details:', result.subscriptions[0].shop_uuid);
        subPopup.innerHTML = "";

        for (var i = 0; i < result.subscriptions.length; i++) {
            // Create a div for each subscription item
            var subscriptionItem = document.createElement("div");
            subscriptionItem.className = "subscription-item";

            // Display shop_uuid
            var shopUuidText = document.createTextNode(result.subscriptions[i].shop_uuid);
            subscriptionItem.appendChild(shopUuidText);

            // Create remove button
            var removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.onclick = function () {
                // Handle remove button click event
                console.log("Remove button clicked for shop_uuid: " + result.subscriptions[i].shop_uuid);
                // Add your logic to remove the subscription
            };

            subscriptionItem.appendChild(removeButton);

            // Append the subscription item to the popup
            subPopup.appendChild(subscriptionItem);
        }
    } else {
        console.log('No subscriptions found.');
    }
}

async function getAccountSubscription() {
    console.log('Get Subscription');
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