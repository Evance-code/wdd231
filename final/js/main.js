// js/main.js

// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

// Video link placeholder
const videoLink = document.getElementById('video-link');
if (videoLink) {
    videoLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://www.youtube.com/watch?v=OdwU3r2ht4I', '_blank');
    });
}