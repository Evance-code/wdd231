// Weather page functionality
import { openModal, closeModal } from './modal.js';
import { saveToLocalStorage, getFromLocalStorage } from './storage.js';

let recentSearches = getFromLocalStorage('recentWeatherSearches') || [];

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    displayRecentSearches();
    setupModal();
});

function setupEventListeners() {
    const weatherForm = document.getElementById('weatherForm');
    if (weatherForm) {
        weatherForm.addEventListener('submit', handleWeatherFormSubmit);
    }
}

async function handleWeatherFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const icaoCode = formData.get('icaoCode').toUpperCase();
    const reportType = formData.get('reportType');

    await fetchWeatherData(icaoCode, reportType);
}

async function fetchWeatherData(icaoCode, reportType) {
    const weatherResults = document.getElementById('weatherResults');
    const weatherError = document.getElementById('weatherError');

    // Clear previous results
    weatherResults.innerHTML = '';
    weatherError.style.display = 'none';

    try {
        // For demonstration, we'll use mock data since real METAR APIs often require keys
        // In a real implementation, you would use an actual aviation weather API
        const mockWeatherData = generateMockWeatherData(icaoCode, reportType);

        displayWeatherResults(mockWeatherData, icaoCode, reportType);
        addToRecentSearches(icaoCode);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherError.style.display = 'block';
        weatherError.textContent = `Failed to fetch weather data for ${icaoCode}. Please check the ICAO code and try again.`;
    }
}

function generateMockWeatherData(icaoCode, reportType) {
    // Generate realistic mock weather data for demonstration
    const timestamp = new Date().toISOString();
    const baseData = {
        icao: icaoCode,
        timestamp: timestamp
    };

    if (reportType === 'metar' || reportType === 'both') {
        baseData.metar = `${icaoCode} ${getCurrentTimeZulu()} 10010KT 10SM FEW030 SCT100 15/12 Q1012 RMK AO2 SLP134 T01500120`;
    }

    if (reportType === 'taf' || reportType === 'both') {
        baseData.taf = `${icaoCode} ${getCurrentTimeZulu()} VALID ${getNext24Hours()} 
        TEMPO ${getNext6Hours()} 12015G25KT 4000 -RA BKN015 
        BECMG ${getNext12Hours()} 08010KT 9999 SCT030`;
    }

    return baseData;
}

function getCurrentTimeZulu() {
    const now = new Date();
    return now.getUTCDate().toString().padStart(2, '0') +
        now.getUTCHours().toString().padStart(2, '0') +
        now.getUTCMinutes().toString().padStart(2, '0') + 'Z';
}

function getNext6Hours() {
    const now = new Date();
    const future = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    return `${now.getUTCHours().toString().padStart(2, '0')}/${future.getUTCHours().toString().padStart(2, '0')}`;
}

function getNext12Hours() {
    const now = new Date();
    const future = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    return `${now.getUTCHours().toString().padStart(2, '0')}/${future.getUTCHours().toString().padStart(2, '0')}`;
}

function getNext24Hours() {
    const now = new Date();
    const future = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return `${now.getUTCDate().toString().padStart(2, '0')}${now.getUTCHours().toString().padStart(2, '0')}/${future.getUTCDate().toString().padStart(2, '0')}${future.getUTCHours().toString().padStart(2, '0')}`;
}

function displayWeatherResults(weatherData, icaoCode, reportType) {
    const weatherResults = document.getElementById('weatherResults');

    let resultsHTML = '';

    if ((reportType === 'metar' || reportType === 'both') && weatherData.metar) {
        resultsHTML += `
            <div class="weather-card">
                <h3>METAR for ${icaoCode}</h3>
                <div class="weather-data">${weatherData.metar}</div>
                <button class="btn btn-secondary view-details" data-type="metar" data-icao="${icaoCode}" style="margin-top: 1rem;">
                    View Detailed Analysis
                </button>
            </div>
        `;
    }

    if ((reportType === 'taf' || reportType === 'both') && weatherData.taf) {
        resultsHTML += `
            <div class="weather-card">
                <h3>TAF for ${icaoCode}</h3>
                <div class="weather-data">${weatherData.taf}</div>
                <button class="btn btn-secondary view-details" data-type="taf" data-icao="${icaoCode}" style="margin-top: 1rem;">
                    View Forecast Details
                </button>
            </div>
        `;
    }

    weatherResults.innerHTML = resultsHTML;

    // Add event listeners to detail buttons
    setupWeatherDetailButtons();
}

function setupWeatherDetailButtons() {
    const detailButtons = document.querySelectorAll('.view-details[data-type]');

    detailButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            const icao = e.target.dataset.icao;

            showWeatherDetails(type, icao);
        });
    });
}

function showWeatherDetails(type, icao) {
    let modalContent = '';

    if (type === 'metar') {
        modalContent = `
            <h2>METAR Analysis for ${icao}</h2>
            <div style="margin: 1rem 0;">
                <h3>Current Conditions</h3>
                <ul style="margin: 1rem 0; padding-left: 1.5rem;">
                    <li>Wind: 100° at 10 knots</li>
                    <li>Visibility: 10 statute miles</li>
                    <li>Clouds: Few at 3,000 ft, Scattered at 10,000 ft</li>
                    <li>Temperature: 15°C, Dew Point: 12°C</li>
                    <li>Altimeter: 1012 hPa</li>
                </ul>
                <p><strong>Flight Category:</strong> VFR (Visual Flight Rules)</p>
                <p><strong>Remarks:</strong> Automated station with precipitation sensor</p>
            </div>
        `;
    } else if (type === 'taf') {
        modalContent = `
            <h2>TAF Forecast Details for ${icao}</h2>
            <div style="margin: 1rem 0;">
                <h3>Forecast Period</h3>
                <p>Valid for the next 24 hours from issuance time.</p>
                
                <h3>Temporary Conditions (Next 6 hours)</h3>
                <ul style="margin: 1rem 0; padding-left: 1.5rem;">
                    <li>Wind: 120° at 15 knots, gusting to 25 knots</li>
                    <li>Visibility: 4000 meters in light rain</li>
                    <li>Clouds: Broken at 1,500 ft</li>
                </ul>
                
                <h3>Becoming Conditions (After 12 hours)</h3>
                <ul style="margin: 1rem 0; padding-left: 1.5rem;">
                    <li>Wind: 080° at 10 knots</li>
                    <li>Visibility: 10 km or more</li>
                    <li>Clouds: Scattered at 3,000 ft</li>
                </ul>
            </div>
        `;
    }

    openModal(modalContent, 'weatherModal');
}

function addToRecentSearches(icaoCode) {
    // Remove if already exists
    recentSearches = recentSearches.filter(code => code !== icaoCode);

    // Add to beginning
    recentSearches.unshift(icaoCode);

    // Keep only last 5 searches
    recentSearches = recentSearches.slice(0, 5);

    // Save to localStorage
    saveToLocalStorage('recentWeatherSearches', recentSearches);

    // Update display
    displayRecentSearches();
}

function displayRecentSearches() {
    const recentList = document.getElementById('recentList');

    if (!recentList || recentSearches.length === 0) {
        const recentSearchesSection = document.getElementById('recentSearches');
        if (recentSearchesSection) {
            recentSearchesSection.style.display = 'none';
        }
        return;
    }

    const recentHTML = recentSearches.map(icao =>
        `<span class="recent-item" data-icao="${icao}">${icao}</span>`
    ).join('');

    recentList.innerHTML = recentHTML;

    // Add event listeners to recent items
    const recentItems = document.querySelectorAll('.recent-item');
    recentItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const icao = e.target.dataset.icao;
            document.getElementById('icaoCode').value = icao;
            document.getElementById('weatherForm').dispatchEvent(new Event('submit'));
        });
    });

    const recentSearchesSection = document.getElementById('recentSearches');
    if (recentSearchesSection) {
        recentSearchesSection.style.display = 'block';
    }
}

function setupModal() {
    // Modal setup is handled by the modal.js module
}