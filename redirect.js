function redirectToPage() {
    setTimeout(function() {
    const baseURL = window.location.origin;
        window.location.href = `${baseURL}/home/Index.html`; // Replace with the desired URL
    },); // Redirect after 3 seconds (adjust the time as needed)
}
