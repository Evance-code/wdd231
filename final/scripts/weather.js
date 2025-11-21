// weather.js — AVWX API with airport name lookup

// DOM elements
const DOM = {
    form: document.getElementById('weatherForm'),
    icaoInput: document.getElementById('icaoInput'),
    loading: document.getElementById('loadingMessage'),
    error: document.getElementById('errorMessage'),
    display: document.getElementById('weatherDisplay'),
    location: document.getElementById('locationHeader'),
    rawMetar: document.getElementById('rawMetar'),
    decodedMetar: document.getElementById('decodedMetar'),
    metarTime: document.getElementById('metarTime'),
    rawTaf: document.getElementById('rawTaf'),
    decodedTaf: document.getElementById('decodedTaf'),
    tafTime: document.getElementById('tafTime'),
};

// Your AVWX API token
const AVWX_TOKEN = '1JO14Q07OGe7RsYUnhGpCwwb6z7f-JB78IzdSs_zlJY';

// Basic ICAO → Airport Name mapping (add more as needed)
const airportNames = {
    'HTDA': 'Dar es Salaam Airport',
    'HTKJ': 'Kilimanjaro International Airport',
    'HKJK': 'Nairobi Jomo Kenyatta International Airport',
    'KLAX': 'Los Angeles International Airport',
    'KSEA': 'Seattle-Tacoma International Airport'
};

// Fetch METAR & TAF from AVWX
async function fetchWeatherData(icao) {
    const base = 'https://avwx.rest/api';
    const metarUrl = `${base}/metar/${icao}?format=json`;
    const tafUrl = `${base}/taf/${icao}?format=json`;

    const headers = { 'Authorization': AVWX_TOKEN, 'Accept': 'application/json' };

    const [metarRes, tafRes] = await Promise.all([
        fetch(metarUrl, { headers }),
        fetch(tafUrl, { headers })
    ]);

    if (!metarRes.ok) throw new Error(`METAR fetch error for ${icao}: ${metarRes.status}`);
    if (!tafRes.ok) throw new Error(`TAF fetch error for ${icao}: ${tafRes.status}`);

    const metarJson = await metarRes.json();
    const tafJson = await tafRes.json();

    // Lookup airport name
    const name = airportNames[icao] || metarJson.station || icao;

    return { airportName: name, metar: metarJson.raw || '', taf: tafJson.raw || '' };
}

// Helpers
function formatReportTime(raw) {
    const m = raw.match(/(\d{6}Z)/);
    if (!m) return 'N/A';
    const t = m[1];
    return `Day ${t.slice(0, 2)}, ${t.slice(2, 4)}:${t.slice(4, 6)} Z`;
}

function decodeMetar(raw) { return raw.split(' ').map(w => ({ label: w, value: w })); }
function decodeTaf(raw) { return raw.split(' ').map(w => ({ label: w, value: w })); }
function renderDecoded(data, container) {
    container.innerHTML = data.map(item => `<div><strong>${item.label}:</strong> ${item.value}</div>`).join('');
}

function showError(msg) {
    DOM.error.textContent = msg;
    DOM.error.style.display = 'block';
    DOM.display.style.display = 'none';
}

async function handleFetch(e) {
    e.preventDefault();
    const icao = DOM.icaoInput.value.trim().toUpperCase();
    if (icao.length !== 4) return showError('Enter a valid 4-letter ICAO code.');

    DOM.error.style.display = 'none';
    DOM.display.style.display = 'none';
    DOM.loading.style.display = 'block';

    try {
        const data = await fetchWeatherData(icao);

        DOM.location.textContent = `${icao} (${data.airportName})`;
        DOM.rawMetar.textContent = data.metar;
        DOM.rawTaf.textContent = data.taf;
        DOM.metarTime.textContent = formatReportTime(data.metar);
        DOM.tafTime.textContent = formatReportTime(data.taf);

        renderDecoded(decodeMetar(data.metar), DOM.decodedMetar);
        renderDecoded(decodeTaf(data.taf), DOM.decodedTaf);

        DOM.display.style.display = 'grid';
    } catch (err) {
        showError(err.message);
        console.error(err);
    }

    DOM.loading.style.display = 'none';
}

// Initialize
if (DOM.form) DOM.form.addEventListener('submit', handleFetch);
