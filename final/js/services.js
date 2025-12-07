// js/services.js

import { openModal } from './modal.js';

const servicesGrid = document.getElementById('services-grid');
const searchInput = document.getElementById('search');
const showFavs = document.getElementById('show-favs');

let servicesData = [];

async function fetchServices() {
    try {
        const res = await fetch('./data/services.json'); // relative path from HTML page
        servicesData = await res.json();
        renderServices(servicesData);
    } catch (err) {
        servicesGrid.innerHTML = '<p>Error loading services.</p>';
        console.error(err);
    }
}

function renderServices(data) {
    servicesGrid.innerHTML = '';
    data.forEach(service => {
        const card = document.createElement('div');
        card.classList.add('service-card');
        card.innerHTML = `
            <h4>${service.title}</h4>
            <p>${service.description}</p>
            <p>Price: ${service.price}</p>
            <p>Duration: ${service.duration}</p>
            <button class="btn-primary" data-id="${service.id}">Learn More</button>
        `;
        const btn = card.querySelector('button');
        btn.addEventListener('click', () => openModal(service));
        servicesGrid.appendChild(card);
    });
}

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = servicesData.filter(s => s.title.toLowerCase().includes(query));
    renderServices(filtered);
});

showFavs.addEventListener('change', () => {
    if (showFavs.checked) {
        const favs = servicesData.filter(s => s.favorite);
        renderServices(favs);
    } else {
        renderServices(servicesData);
    }
});

fetchServices();