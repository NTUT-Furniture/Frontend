function SubscribeShop(shop) {
    const url = `http://localhost:8000/api/subscription/?shop_uuid=${shop}&account_uuid=${getCookie("account_uuid")}`;
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${getCookie("token")}`
        }
    };
    fetch(url, fetchOptions)
        .then(response => {
            if (response.status === 400) {
                // Handle 400 status code specifically
                alert("You had subscribed!");
                throw new Error('Subscription already exists');
            }
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}