document.addEventListener("DOMContentLoaded", function() {
    const nav = document.querySelector("nav");

    window.addEventListener("scroll", function() {
        if (window.scrollY > 130) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    });

    // Menú Hamburguesa
    const navHamb = document.getElementById("navHamb");
    const navMenu = document.getElementById("navMenu");
    const links = navMenu.querySelectorAll("a");

    // Abrir/cerrar al hacer clic en el botón hamburguesa
    navHamb.addEventListener("click", function() {
        navMenu.classList.toggle("displayMenu");
    });

    // Cerrar el menú cuando se hace clic en cualquier enlace
    links.forEach(link => {
        link.addEventListener("click", function() {
            navMenu.classList.remove("displayMenu");
        });
    });
});