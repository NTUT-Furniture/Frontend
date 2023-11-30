window.onscroll = function () {
    myFunction()
};
var navbar = document.getElementById("navbar");

function myFunction() {
    if (window.scrollY > 0) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
}
