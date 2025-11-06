document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("hamburger");
    const nav = document.getElementById("primaryNav");

    btn.addEventListener("click", () => {
        const isExpanded = btn.getAttribute("aria-expanded") === "true";
        nav.classList.toggle("show");
        btn.setAttribute("aria-expanded", String(!isExpanded));
    });

    // Close menu when clicking on a link (for mobile)
    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("show");
            btn.setAttribute("aria-expanded", "false");
        });
    });
});