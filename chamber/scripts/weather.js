const apiKey = "9c368bdc33415e22717e619e2de70f6a";
const city = "Dar es Salaam";
const units = "metric";
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;

// Function to fetch and display the current weather
async function loadCurrentWeather() {
    try {
        const response = await fetch(weatherUrl);
        if (!response.ok) throw new Error('Current weather response not OK');
        const data = await response.json();

        const tempEl = document.getElementById("temperature");
        const descEl = document.getElementById("weather-desc");

        // **Current Weather Requirements**
        // The current weather icon is often helpful but was missing a placeholder in HTML.
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
        const description = data.weather[0].description;

        tempEl.innerHTML = `<img src="${iconUrl}" alt="${description}" class="weather-icon">${Math.round(data.main.temp)}`;
        descEl.textContent = description;

        // Load the 3-day forecast after successful current weather load
        loadThreeDayForecast();
    } catch (error) {
        console.error("Current Weather fetch error:", error);
        document.querySelector(".weather-info").innerHTML = `<p>Unable to load current weather data.</p>`;
    }
}

// Function to fetch and display the 3-day forecast
async function loadThreeDayForecast() {
    try {
        const response = await fetch(forecastUrl);
        if (!response.ok) throw new Error('Forecast response not OK');
        const data = await response.json();

        const forecastEl = document.getElementById("forecast");
        forecastEl.innerHTML = '<h3>3-Day Forecast</h3><div class="forecast-grid"></div>'; // Added a title and grid container
        const forecastGrid = forecastEl.querySelector('.forecast-grid');

        // Filter to select the data for the next three days at 12:00:00 (midday)
        const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));

        // Use slice(0, 3) to ensure we get exactly the next three days
        for (let i = 0; i < 3 && i < dailyForecasts.length; i++) {
            const item = dailyForecasts[i];

            // Format the date to show the day of the week
            const date = new Date(item.dt_txt);
            const day = date.toLocaleDateString('en-US', { weekday: 'short' });

            const temp = Math.round(item.main.temp);
            const icon = item.weather[0].icon;
            const desc = item.weather[0].description;

            // **3-Day Forecast Requirement**
            forecastGrid.innerHTML += `
                <figure class="forecast-item">
                    <figcaption>${day}</figcaption>
                    <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}">
                    <p class="forecast-temp">${temp}°C</p>
                    <p class="forecast-desc">${desc}</p>
                </figure>
            `;
        }
    } catch (error) {
        console.error("Forecast fetch error:", error);
        document.getElementById("forecast").innerHTML = `<p>Unable to load forecast.</p>`;
    }
}

// Initial call to start the process
loadCurrentWeather();