// Aircraft page functionality
import { openModal, closeModal } from './modal.js';
import { saveToLocalStorage, getFromLocalStorage } from './storage.js';

let aircraftData = [];
let filteredAircraft = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadAircraftData();
    setupEventListeners();
    setupModal();
});

async function loadAircraftData() {
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');

    try {
        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';

        const response = await fetch('../data/aircraft.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        aircraftData = await response.json();
        filteredAircraft = [...aircraftData];

        displayAircraft(filteredAircraft);
        loadingMessage.style.display = 'none';

    } catch (error) {
        console.error('Error loading aircraft data:', error);
        loadingMessage.style.display = 'none';
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Failed to load aircraft data. Please try again later.';
    }
}

function setupEventListeners() {
    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterAircraft);
    }

    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterAircraft);
    }
}

function filterAircraft() {
    const categoryFilter = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchInput');

    const selectedCategory = categoryFilter.value;
    const searchTerm = searchInput.value.toLowerCase();

    filteredAircraft = aircraftData.filter(aircraft => {
        const matchesCategory = selectedCategory === 'all' || aircraft.category === selectedCategory;
        const matchesSearch = aircraft.model.toLowerCase().includes(searchTerm) ||
            aircraft.manufacturer.toLowerCase().includes(searchTerm) ||
            aircraft.category.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    displayAircraft(filteredAircraft);
}

function displayAircraft(aircraft) {
    const grid = document.getElementById('aircraftGrid');

    if (!grid) return;

    if (aircraft.length === 0) {
        grid.innerHTML = '<p class="no-results">No aircraft found matching your criteria.</p>';
        return;
    }

    // Use array method to generate HTML
    const aircraftHTML = aircraft.map(aircraft =>
        createAircraftCard(aircraft)
    ).join('');

    grid.innerHTML = aircraftHTML;

    // Add event listeners to view details buttons
    setupAircraftDetailButtons();
}

function createAircraftCard(aircraft) {
    // Using template literals for string construction
    return `
        <div class="aircraft-card" data-id="${aircraft.model}">
            <img src="${aircraft.image}" alt="${aircraft.model}" class="aircraft-image" loading="lazy">
            <div class="aircraft-info">
                <h3>${aircraft.model}</h3>
                <div class="aircraft-spec">
                    <span>Manufacturer:</span>
                    <span>${aircraft.manufacturer}</span>
                </div>
                <div class="aircraft-spec">
                    <span>Cruise Speed:</span>
                    <span>${aircraft.cruiseSpeed}</span>
                </div>
                <div class="aircraft-spec">
                    <span>Max Range:</span>
                    <span>${aircraft.range}</span>
                </div>
                <span class="aircraft-category">${aircraft.category}</span>
                <button class="btn btn-primary view-details" style="margin-top: 1rem; width: 100%;">
                    View Details
                </button>
            </div>
        </div>
    `;
}

function setupAircraftDetailButtons() {
    const detailButtons = document.querySelectorAll('.view-details');

    detailButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const aircraftCard = e.target.closest('.aircraft-card');
            const aircraftModel = aircraftCard.dataset.id;
            const aircraft = aircraftData.find(a => a.model === aircraftModel);

            if (aircraft) {
                showAircraftDetails(aircraft);
            }
        });
    });
}

function showAircraftDetails(aircraft) {
    const modalContent = `
        <h2>${aircraft.model}</h2>
        <img src="${aircraft.image}" alt="${aircraft.model}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin: 1rem 0;">
        <div style="display: grid; gap: 1rem; margin-top: 1rem;">
            <div style="display: flex; justify-content: space-between;">
                <strong>Manufacturer:</strong>
                <span>${aircraft.manufacturer}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <strong>Cruise Speed:</strong>
                <span>${aircraft.cruiseSpeed}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <strong>Max Range:</strong>
                <span>${aircraft.range}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <strong>Category:</strong>
                <span>${aircraft.category}</span>
            </div>
        </div>
        <p style="margin-top: 1.5rem; padding: 1rem; background: var(--card-bg); border-radius: 4px;">
            This ${aircraft.model} by ${aircraft.manufacturer} is ideal for ${getAircraftUsage(aircraft.category)} operations.
        </p>
    `;

    openModal(modalContent, 'aircraftModal');
}

function getAircraftUsage(category) {
    const usageMap = {
        'Commercial': 'commercial passenger',
        'Regional': 'regional',
        'General Aviation': 'general aviation and training',
        'Business Jet': 'corporate and business',
        'Helicopter': 'rotary-wing',
        'Cargo': 'cargo and freight'
    };

    return usageMap[category] || 'various';
}

function setupModal() {
    // Modal setup is handled by the modal.js module
}