// Toggle mobile navigation menu
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.primary-nav ul');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// Modal functionality
const modal = document.getElementById('modal');
const modalClose = document.querySelector('.modal-close');
const modalBody = document.getElementById('modal-body');

modalClose.addEventListener('click', () => {
    modal.classList.remove('show');
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

export function showModal(content) {
    modalBody.innerHTML = content;
    modal.classList.add('show');
}
