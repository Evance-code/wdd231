

import { showModal } from './main.js';

// Fetch flight data from local JSON
async function fetchFlights() {
    try {
        const response = await fetch('data/flights.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const flights = await response.json();
        displayFlights(flights);
    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('flight-cards').innerHTML = `<p>Failed to load flight data.</p>`;
    }
}

// Generate flight cards dynamically
function displayFlights(flights) {
    const container = document.getElementById('flight-cards');
    container.innerHTML = '';

    flights.forEach((flight, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
      <img src="${flight.image}" alt="${flight.origin} to ${flight.destination}">
      <div class="content">
        <h3>${flight.origin} → ${flight.destination}</h3>
        <p><strong>Distance:</strong> ${flight.distance} NM</p>
        <p><strong>Cruise Speed:</strong> ${flight.cruiseSpeed} knots</p>
        <p><strong>Estimated Time:</strong> ${flight.hours} hr</p>
        <button id="details-${index}">View Details</button>
      </div>
    `;
        container.appendChild(card);

        // Modal button
        const btn = document.getElementById(`details-${index}`);
        btn.addEventListener('click', () => {
            showModal(`
        <h2>${flight.origin} → ${flight.destination}</h2>
        <p><strong>Distance:</strong> ${flight.distance} NM</p>
        <p><strong>Cruise Speed:</strong> ${flight.cruiseSpeed} knots</p>
        <p><strong>Estimated Time:</strong> ${flight.hours} hr</p>
        <p><strong>Notes:</strong> ${flight.notes}</p>
      `);
        });
    });

    // Save last viewed flights to localStorage
    localStorage.setItem('lastFlights', JSON.stringify(flights));
}

// Initialize
fetchFlights();
