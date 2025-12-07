// js/modal.js

const modal = document.getElementById('service-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalList = document.getElementById('modal-list');
const modalClose = document.getElementById('modal-close');
const modalBook = document.getElementById('modal-book');

export function openModal(service) {
    modalTitle.textContent = service.title;
    modalBody.textContent = service.description;
    modalList.innerHTML = `
        <li>Price: ${service.price}</li>
        <li>Duration: ${service.duration}</li>
        <li>Favorite: ${service.favorite ? 'Yes' : 'No'}</li>
    `;
    modalBook.onclick = () => alert(`Booking ${service.title}`);
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
}

modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    }
});
