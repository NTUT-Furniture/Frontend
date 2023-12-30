async function toggleSub() {
    var subPopup = document.getElementById("sub-popup");
    subPopup.style.display = (subPopup.style.display === "block") ? "none" : "block";
    
    showSubscription(subPopup);
}

async function showSubscription(subPopup) {
    let resultPromise = getAccountSubscription();
    let result = await resultPromise; // Wait for the promise to resolve
    // console.log('hihi');
    // console.log(result);
    
    subPopup.innerHTML = "";

    // Assuming the result is an object with a 'subscriptions' property
    if (result && result.subscriptions) {
        for (var i=0; i<result.subscriptions.length; i++) {
            // console.log('Subscriptions details:', result.subscriptions[i].shop_uuid);
        }
        // console.log('Subscriptions details:', result.subscriptions);
        // console.log('Subscriptions details:', result.subscriptions[0].shop_uuid);
        for (var i = 0; i < result.subscriptions.length; i++) {
            var shopID = result.subscriptions[i].shop_uuid;

            // Create a div for each subscription item
            var subscriptionItem = document.createElement("div");
            subscriptionItem.className = "subscription-item";

            // Display shop_uuid
            var shopUuidText = document.createTextNode(result.subscriptions[i].shop_uuid);
            subscriptionItem.appendChild(shopUuidText);

            // Create remove button with IIFE to capture the current shopID
            var removeButton = (function (shopID) {
                var button = document.createElement("button");
                button.textContent = "Unsubscribe";
                button.onclick = async function () {
                    // Handle remove button click event
                    // console.log("Remove button clicked for shop_uuid: " + shopID);
                    // Add your logic to remove the subscription
                    await unsubscibeWithAccount(shopID);
                    await showSubscription(subPopup);
                };
                return button;
            })(shopID);

            subscriptionItem.appendChild(removeButton);

            // Append the subscription item to the popup
            subPopup.appendChild(subscriptionItem);
        }
    } else {
        // console.log('No subscriptions found.');
        var nothing = document.createElement("div");
        nothing.innerHTML = "<strong>u do not subscribe any shop</strong>"
        subPopup.appendChild(nothing);
    }
    var closeButton = document.createElement("button");
    closeButton.innerText = 'Close';
    closeButton.onclick = toggleSub; // Use your checkout function here
    closeButton.style.position = 'absolute';
    closeButton.style.bottom = '10px';  // Adjust the bottom spacing as needed
    closeButton.style.right = '10px';  // Adjust the right spacing as needed
    subPopup.appendChild(closeButton);
}

async function getAccountSubscription() {
    // console.log('Get Subscription');
    try {
        accID = getCookie('account_uuid');
        // console.log('subscription account_uuid: ' + accID);
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
            // console.log(jsonResponse);
            // console.log('Success Get Subscription');
            return jsonResponse;
        } else {
            // console.log('u have not subscribe any shop');
            return null;
        }
    } catch (error) {
        console.error('Get Subscription API Error', error);
    }
}

async function unsubscibeWithAccount(shopID) {
    try {
        accID = getCookie('account_uuid');
        // console.log('subscription account_uuid: ' + accID);
        // console.log('subscription shop_uuid: ' + shopID);
        const baseURL = `http://localhost:8000/api/subscription/unsubscribe?`;
        const url = new URL(baseURL);
        url.searchParams.append("shop_uuid", shopID);
        url.searchParams.append('account_uuid', accID);
        const response = await fetch(url.toString(), {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + getCookie('token'),
            },
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            // console.log(jsonResponse);
            // console.log('Success Delete Subscription');
            // return jsonResponse;
        } else {
            alert('??? sth went wrong');
            // return null;
        }
    } catch (error) {
        console.error('Delete Subscription API Error', error);
    }
}