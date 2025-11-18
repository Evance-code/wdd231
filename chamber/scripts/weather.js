const apiKey = "9c368bdc33415e22717e619e2de70f6a";
const city = "Dar es Salaam";
const units = "metric";
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;

async function loadWeather() {
    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();

        document.getElementById("temperature").textContent = Math.round(data.main.temp);
        document.getElementById("weather-desc").textContent = data.weather[0].description;

        loadForecast();
    } catch (error) {
        console.error("Weather fetch error:", error);
        document.querySelector(".weather-info").innerHTML = `<p>Unable to load weather data.</p>`;
    }
}
weatherContainer.innerHTML = `
  <p>Weather data currently unavailable.</p>
  <p>🌤️ Dar es Salaam: 30°C (sample data)</p>
`;


async function loadForecast() {
    try {
        const response = await fetch(forecastUrl);
        const data = await response.json();

        const forecastEl = document.getElementById("forecast");
        forecastEl.innerHTML = "";

        // Show next 3 forecast periods (every 3 hours)
        for (let i = 0; i < 3; i++) {
            const item = data.list[i];
            const time = new Date(item.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const temp = Math.round(item.main.temp);
            const icon = item.weather[0].icon;
            const desc = item.weather[0].description;

            forecastEl.innerHTML += `
                <div class="forecast-item">
                    <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}">
                    <p>${time}</p>
                    <p>${temp}°C</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Forecast fetch error:", error);
    }
}

loadWeather();
