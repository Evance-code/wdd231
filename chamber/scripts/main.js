// Common functionality across all pages
document.addEventListener('DOMContentLoaded', function () {
    // Set copyright year
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;

    // Set last modified date
    const lastModified = document.lastModified;
    document.getElementById('lastModified').textContent = lastModified;

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('show');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        if (!event.target.closest('nav') && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
        }
    });
});