// --- Autocomplete Function ---
function autocomplete(inp, list) {
    inp.addEventListener('input', function () {
        const val = this.value.toUpperCase();
        closeAllLists();
        if (!val) return false;
        const divList = document.createElement('div');
        divList.setAttribute('class', 'autocomplete-items');
        this.parentNode.appendChild(divList);
        list.filter(st => st.icao.startsWith(val) || st.name.toUpperCase().includes(val))
            .slice(0, 5)
            .forEach(st => {
                const item = document.createElement('div');
                item.innerHTML = `<strong>${st.icao}</strong> - ${st.name}`;
                item.setAttribute('class', 'autocomplete-item');
                item.addEventListener('click', () => {
                    inp.value = st.icao;
                    closeAllLists();
                });
                divList.appendChild(item);
            });
    });
    function closeAllLists(elmnt) {
        const items = document.getElementsByClassName('autocomplete-items');
        for (let i = 0; i < items.length; i++) {
            if (elmnt !== items[i] && elmnt !== inp) items[i].parentNode.removeChild(items[i]);
        }
    }
    document.addEventListener('click', () => closeAllLists());
}

// --- Distance and Track ---
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 3440.07; // NM
    const toRad = x => x * Math.PI / 180;
    const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getTrack(lat1, lon1, lat2, lon2) {
    const toRad = x => x * Math.PI / 180;
    const toDeg = x => x * 180 / Math.PI;
    const phi1 = toRad(lat1), phi2 = toRad(lat2);
    const deltaLon = toRad(lon2 - lon1);
    const y = Math.sin(deltaLon) * Math.cos(phi2);
    const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLon);
    let theta = Math.atan2(y, x);
    theta = (toDeg(theta) + 360) % 360;
    return theta.toFixed(1);
}

function suggestFL(track) {
    track = parseFloat(track);
    return (track >= 0 && track < 180) ? 'Odd FL (FL330, FL350)' : 'Even FL (FL340, FL360)';
}

// --- Get Airport Coordinates ---
async function getCoords(icao) {
    const AVWX_TOKEN = '1JO14Q07OGe7RsYUnhGpCwwb6z7f-JB78IzdSs_zlJY';
    const res = await fetch(`https://avwx.rest/api/station/${icao}?format=json`, { headers: { 'Authorization': AVWX_TOKEN } });
    if (!res.ok) throw new Error(`Airport not found: ${icao}`);
    const data = await res.json();
    return { lat: data.latitude, lon: data.longitude, name: data.name || icao };
}

// --- Initialize Map ---
let map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
let markers = [], lines = [];

// --- Calculate Button ---
document.getElementById('calculateBtn').addEventListener('click', async () => {
    const dep = document.getElementById('depIcao').value.trim().toUpperCase();
    const arr = document.getElementById('arrIcao').value.trim().toUpperCase();
    const alt = document.getElementById('altIcao').value.trim().toUpperCase();
    const speed = parseFloat(document.getElementById('speed').value) || 450;
    const result = document.getElementById('result');

    if (dep.length !== 4 || arr.length !== 4) return alert('Enter valid ICAO codes');

    result.innerHTML = 'Calculating...';

    // Clear previous map
    markers.forEach(m => map.removeLayer(m));
    lines.forEach(l => map.removeLayer(l));
    markers = []; lines = [];

    try {
        const depData = await getCoords(dep);
        const arrData = await getCoords(arr);
        const airports = [depData, arrData];
        if (alt) airports.push(await getCoords(alt));

        let html = `<strong>Flight Plan:</strong><br>`;
        for (let i = 0; i < airports.length - 1; i++) {
            const d = getDistance(airports[i].lat, airports[i].lon, airports[i + 1].lat, airports[i + 1].lon).toFixed(1);
            const track = getTrack(airports[i].lat, airports[i].lon, airports[i + 1].lat, airports[i + 1].lon);
            const tH = d / speed;
            const h = Math.floor(tH), m = Math.round((tH - h) * 60);
            const FL = suggestFL(track);
            html += `${airports[i].name} → ${airports[i + 1].name}: ${d} NM, Track ${track}°, Time ${h}h ${m}min, Suggested FL: ${FL}<br>`;
        }
        result.innerHTML = html;

        // Add markers and lines
        for (let i = 0; i < airports.length; i++) {
            const m = L.marker([airports[i].lat, airports[i].lon]).addTo(map).bindPopup(airports[i].name).openPopup();
            markers.push(m);
        }
        for (let i = 0; i < airports.length - 1; i++) {
            const l = L.polyline([[airports[i].lat, airports[i].lon], [airports[i + 1].lat, airports[i + 1].lon]], { color: 'red' }).addTo(map);
            lines.push(l);
        }

        map.fitBounds(airports.map(a => [a.lat, a.lon]), { padding: [50, 50] });

    } catch (e) {
        result.innerHTML = `<span style="color:red;">Error: ${e.message}</span>`;
    }
});

// Initialize autocomplete
autocomplete(document.getElementById('depIcao'), ICAO_LIST);
autocomplete(document.getElementById('arrIcao'), ICAO_LIST);
autocomplete(document.getElementById('altIcao'), ICAO_LIST);
