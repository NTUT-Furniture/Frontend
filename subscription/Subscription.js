async function toggleSub() {
    var subPopup = document.getElementById("sub-popup");
    subPopup.style.display = (subPopup.style.display === "block") ? "none" : "block";
    
    showSubscription(subPopup);
}

async function showSubscription(subPopup) {
    let resultPromise = getAccountSubscription();
    let result = await resultPromise;
    console.log(result);
    
    subPopup.innerHTML = "";

    if (result && result.subscriptions) {
        for (var i=0; i<result.subscriptions.length; i++) {
            // console.log('Subscriptions details:', result.subscriptions[i].shop_uuid);
        }
        
        var subTableContainer = document.createElement("div");
        subTableContainer.className = "subscription-table-container";
        
        var subTable = document.createElement("table");
        subTable.className = "subscription-table";

        for (var i = 0; i < result.subscriptions.length; i++) {
            var shopID = result.subscriptions[i].uuid;
            
            var subRow = subTable.insertRow();
            var subCell = subRow.insertCell(0);

            var subscriptionItem = document.createElement("div");
            subscriptionItem.className = "subscription-item";

            var shopUuidText = document.createTextNode(result.subscriptions[i].name);
            subscriptionItem.appendChild(shopUuidText);

            var removeButton = (function (shopID) {
                var button = document.createElement("button");
                button.textContent = "Unsubscribe";
                button.onclick = async function () {
                    await unsubscibeWithAccount(shopID);
                    await showSubscription(subPopup);
                };
                return button;
            })(shopID);

            subscriptionItem.appendChild(removeButton);
            subCell.appendChild(subscriptionItem);
        }
        subTableContainer.appendChild(subTable);
        subPopup.appendChild(subTableContainer);
    } else {
        var nothing = document.createElement("div");
        nothing.innerHTML = "<h2>you do not subscribe any shop</h2>"
        subPopup.appendChild(nothing);
    }
    var closeButton = document.createElement("button");
    closeButton.innerText = 'Close';
    closeButton.onclick = toggleSub;
    closeButton.style.position = 'absolute';
    closeButton.style.bottom = '10px';
    closeButton.style.right = '10px';
    subPopup.appendChild(closeButton);
}

async function getAccountSubscription() {
    try {
        accID = getCookie('account_uuid');
        let baseURL = "https://nfta.noobdy.com";
        baseURL = `${baseURL}/api/subscription/account?`;
        const url = new URL(baseURL);
        url.searchParams.append("uuid_type", "account_uuid");
        url.searchParams.append('uuid', accID);
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + getCookie('token'),
            },
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Get Subscription API Error', error);
    }
}

async function unsubscibeWithAccount(shopID) {
    try {
        accID = getCookie('account_uuid');
        let baseURL = "https://nfta.noobdy.com";
        baseURL = `${baseURL}/api/subscription/unsubscribe?`;
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
