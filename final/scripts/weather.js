// Weather page functionality
import { openModal, closeModal } from './modal.js';
import { saveToLocalStorage, getFromLocalStorage } from './storage.js';

let recentSearches = getFromLocalStorage('recentWeatherSearches') || [];

document.addEventListener('DOMContentLoaded', () => {
    initializeWeatherPage();
});

function initializeWeatherPage() {
    setupEventListeners();
    displayRecentSearches();
    loadLastSearch();
}

function setupEventListeners() {
    const weatherForm = document.getElementById('weatherForm');
    if (weatherForm) {
        weatherForm.addEventListener('submit', handleWeatherFormSubmit);
    }

    // Add input validation for ICAO code
    const icaoInput = document.getElementById('icaoCode');
    if (icaoInput) {
        icaoInput.addEventListener('input', function (e) {
            // Convert to uppercase and limit to 4 characters
            e.target.value = e.target.value.toUpperCase().substring(0, 4);
        });
    }
}

function loadLastSearch() {
    const lastSearch = getFromLocalStorage('lastWeatherSearch');
    if (lastSearch) {
        document.getElementById('icaoCode').value = lastSearch;
    }
}

async function handleWeatherFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const icaoCode = formData.get('icaoCode').toUpperCase().trim();
    const reportType = formData.get('reportType');

    // Validate ICAO code
    if (!isValidIcaoCode(icaoCode)) {
        showError('Please enter a valid 4-letter ICAO airport code (e.g., KJFK, EGLL)');
        return;
    }

    // Save last search
    saveToLocalStorage('lastWeatherSearch', icaoCode);

    await fetchWeatherData(icaoCode, reportType);
}

function isValidIcaoCode(code) {
    return /^[A-Z]{4}$/.test(code);
}

async function fetchWeatherData(icaoCode, reportType) {
    const weatherResults = document.getElementById('weatherResults');
    const weatherError = document.getElementById('weatherError');

    // Show loading state
    weatherResults.innerHTML = '<div class="loading">Fetching weather data...</div>';
    weatherError.style.display = 'none';

    try {
        // For demonstration purposes, we'll use mock data
        // In a real implementation, you would use an actual aviation weather API like:
        // - Aviation Weather Center API
        // - CheckWX API
        // - AviationAPI
        const weatherData = await getMockWeatherData(icaoCode, reportType);

        displayWeatherResults(weatherData, icaoCode, reportType);
        addToRecentSearches(icaoCode);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError(`Failed to fetch weather data for ${icaoCode}. Please check the ICAO code and try again.`);
    }
}

async function getMockWeatherData(icaoCode, reportType) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate realistic mock weather data based on ICAO code
    const baseData = {
        icao: icaoCode,
        timestamp: new Date().toISOString(),
        station: getStationName(icaoCode)
    };

    // Different mock data based on report type
    if (reportType === 'metar' || reportType === 'both') {
        baseData.metar = generateMockMETAR(icaoCode);
    }

    if (reportType === 'taf' || reportType === 'both') {
        baseData.taf = generateMockTAF(icaoCode);
    }

    return baseData;
}

function generateMockMETAR(icaoCode) {
    const now = new Date();
    const day = now.getUTCDate().toString().padStart(2, '0');
    const hour = now.getUTCHours().toString().padStart(2, '0');
    const minute = now.getUTCMinutes().toString().padStart(2, '0');

    // Different weather patterns based on "region" (first letter of ICAO)
    const firstLetter = icaoCode.charAt(0);
    let weatherData;

    if (['K', 'C', 'P'].includes(firstLetter)) { // North America
        weatherData = {
            wind: '10010KT',
            visibility: '10SM',
            weather: '',
            clouds: 'FEW030 SCT100',
            temp: '15/12',
            pressure: 'Q1012',
            remarks: 'RMK AO2 SLP134 T01500120'
        };
    } else if (['E', 'L'].includes(firstLetter)) { // Europe
        weatherData = {
            wind: '23008KT',
            visibility: '9999',
            weather: '',
            clouds: 'BKN020 OVC040',
            temp: '12/10',
            pressure: 'Q1008',
            remarks: 'RMK BLU'
        };
    } else { // Rest of world
        weatherData = {
            wind: '05005KT',
            visibility: '8000',
            weather: '',
            clouds: 'SCT025',
            temp: '25/20',
            pressure: 'Q1015',
            remarks: 'RMK RED'
        };
    }

    return `${icaoCode} ${day}${hour}${minute}Z ${weatherData.wind} ${weatherData.visibility} ${weatherData.weather}${weatherData.clouds} ${weatherData.temp} ${weatherData.pressure} ${weatherData.remarks}`;
}

function generateMockTAF(icaoCode) {
    const now = new Date();
    const day = now.getUTCDate().toString().padStart(2, '0');
    const hour = now.getUTCHours().toString().padStart(2, '0');
    const nextHour = (now.getUTCHours() + 1) % 24;

    return `${icaoCode} ${day}${hour}00Z ${day}${hour}00/${day}${nextHour.toString().padStart(2, '0')}00
    TEMPO ${day}${hour}00/${day}${(parseInt(hour) + 6).toString().padStart(2, '0')}00 12015G25KT 4000 -RA BKN015
    BECMG ${day}${(parseInt(hour) + 6).toString().padStart(2, '0')}00/${day}${(parseInt(hour) + 12).toString().padStart(2, '0')}00 08010KT 9999 SCT030
    BECMG ${day}${(parseInt(hour) + 18).toString().padStart(2, '0')}00/${day}${(parseInt(hour) + 24).toString().padStart(2, '0')}00 00000KT CAVOK`;
}

function getStationName(icaoCode) {
    const stationMap = {
        'KJFK': 'New York John F Kennedy',
        'KLAX': 'Los Angeles International',
        'KORD': 'Chicago O\'Hare',
        'EGLL': 'London Heathrow',
        'LFPG': 'Paris Charles de Gaulle',
        'EDDF': 'Frankfurt Main',
        'RJTT': 'Tokyo Haneda',
        'YSSY': 'Sydney Kingsford Smith'
    };

    return stationMap[icaoCode] || `${icaoCode} Airport`;
}

function displayWeatherResults(weatherData, icaoCode, reportType) {
    const weatherResults = document.getElementById('weatherResults');

    let resultsHTML = `
        <div class="weather-header">
            <h2>Weather for ${icaoCode}</h2>
            <p class="station-name">${weatherData.station}</p>
            <p class="timestamp">Last updated: ${new Date(weatherData.timestamp).toLocaleString()}</p>
        </div>
    `;

    if ((reportType === 'metar' || reportType === 'both') && weatherData.metar) {
        resultsHTML += `
            <div class="weather-card">
                <div class="weather-card-header">
                    <h3>METAR</h3>
                    <span class="report-type">Current Conditions</span>
                </div>
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
                <div class="weather-card-header">
                    <h3>TAF</h3>
                    <span class="report-type">Terminal Forecast</span>
                </div>
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
        modalContent = createMETARAnalysis(icao);
    } else if (type === 'taf') {
        modalContent = createTAFAnalysis(icao);
    }

    openModal(modalContent, 'weatherModal');
}

function createMETARAnalysis(icao) {
    return `
        <h2>METAR Analysis for ${icao}</h2>
        <div class="weather-analysis">
            <div class="analysis-section">
                <h3>✈️ Flight Category: <span class="vfr-category">VFR</span></h3>
                <p>Visual Flight Rules conditions - suitable for VFR operations.</p>
            </div>
            
            <div class="analysis-section">
                <h3>🌬️ Wind Conditions</h3>
                <ul>
                    <li><strong>Direction:</strong> 100° (East)</li>
                    <li><strong>Speed:</strong> 10 knots</li>
                    <li><strong>Gusts:</strong> None reported</li>
                </ul>
            </div>
            
            <div class="analysis-section">
                <h3>👁️ Visibility & Weather</h3>
                <ul>
                    <li><strong>Visibility:</strong> 10 statute miles (Excellent)</li>
                    <li><strong>Weather:</strong> No significant weather</li>
                    <li><strong>Clouds:</strong> Few at 3,000 ft, Scattered at 10,000 ft</li>
                </ul>
            </div>
            
            <div class="analysis-section">
                <h3>🌡️ Temperature & Pressure</h3>
                <ul>
                    <li><strong>Temperature:</strong> 15°C</li>
                    <li><strong>Dew Point:</strong> 12°C</li>
                    <li><strong>Spread:</strong> 3°C (Low fog risk)</li>
                    <li><strong>Altimeter:</strong> 1012 hPa / 29.88 inHg</li>
                </ul>
            </div>
            
            <div class="analysis-section">
                <h3>📝 Remarks</h3>
                <p>Automated station with precipitation sensor. No significant changes expected in the next hour.</p>
            </div>
            
            <div class="operational-notes">
                <h4>Operational Impact</h4>
                <p>✅ Favorable conditions for all operations<br>
                ✅ No significant weather concerns<br>
                ✅ Good visibility for visual approaches<br>
                ✅ Light winds, all runways usable</p>
            </div>
        </div>
    `;
}

function createTAFAnalysis(icao) {
    return `
        <h2>TAF Forecast Analysis for ${icao}</h2>
        <div class="weather-analysis">
            <div class="analysis-section">
                <h3>📅 Forecast Period</h3>
                <p>Valid for the next 24 hours from issuance time.</p>
            </div>
            
            <div class="analysis-section">
                <h3>⏰ First 6 Hours</h3>
                <div class="forecast-period">
                    <span class="period-label">TEMPO</span>
                    <ul>
                        <li><strong>Wind:</strong> 120° at 15 knots, gusting to 25 knots</li>
                        <li><strong>Visibility:</strong> 4000 meters in light rain</li>
                        <li><strong>Weather:</strong> Light rain</li>
                        <li><strong>Clouds:</strong> Broken at 1,500 ft</li>
                        <li><strong>Flight Category:</strong> MVFR</li>
                    </ul>
                </div>
            </div>
            
            <div class="analysis-section">
                <h3>⏰ Hours 6-12</h3>
                <div class="forecast-period">
                    <span class="period-label">BECMG</span>
                    <ul>
                        <li><strong>Wind:</strong> 080° at 10 knots</li>
                        <li><strong>Visibility:</strong> 10 km or more</li>
                        <li><strong>Weather:</strong> No significant weather</li>
                        <li><strong>Clouds:</strong> Scattered at 3,000 ft</li>
                        <li><strong>Flight Category:</strong> VFR</li>
                    </ul>
                </div>
            </div>
            
            <div class="analysis-section">
                <h3>⏰ Hours 18-24</h3>
                <div class="forecast-period">
                    <span class="period-label">BECMG</span>
                    <ul>
                        <li><strong>Wind:</strong> Calm</li>
                        <li><strong>Visibility:</strong> Unlimited (CAVOK)</li>
                        <li><strong>Clouds:</strong> Ceiling and Visibility OK</li>
                        <li><strong>Flight Category:</strong> VFR</li>
                    </ul>
                </div>
            </div>
            
            <div class="operational-notes">
                <h4>Operational Planning</h4>
                <p>⚠️  Temporary MVFR conditions in first 6 hours<br>
                ✅  Improving to VFR after 6 hours<br>
                ✅  Excellent conditions expected by 18 hours<br>
                📋  Consider delays for operations sensitive to crosswinds</p>
            </div>
        </div>
    `;
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
    const recentSearchesSection = document.getElementById('recentSearches');

    if (!recentList || recentSearches.length === 0) {
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
            // Trigger form submission
            document.getElementById('weatherForm').dispatchEvent(new Event('submit', { cancelable: true }));
        });
    });

    if (recentSearchesSection) {
        recentSearchesSection.style.display = 'block';
    }
}

function showError(message) {
    const weatherError = document.getElementById('weatherError');
    const weatherResults = document.getElementById('weatherResults');

    weatherResults.innerHTML = '';
    weatherError.style.display = 'block';
    weatherError.textContent = message;
}

// Utility function to format timestamps
function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });
}