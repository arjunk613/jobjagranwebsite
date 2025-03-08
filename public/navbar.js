document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.getElementById("navbar");
    const slogan = document.getElementById("slogan");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            navbar.classList.add("py-2", "bg-indigo-800", "shadow-lg");
            navbar.classList.remove("py-4");
            slogan.classList.add("hidden"); // Hide slogan when navbar shrinks
        } else {
            navbar.classList.add("py-4");
            navbar.classList.remove("py-2", "bg-indigo-800", "shadow-lg");
            slogan.classList.remove("hidden"); // Show slogan when at the top
        }
    });
});
