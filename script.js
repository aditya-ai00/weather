const apiKey = "591574ad50974c7d895202633263101";

//function to tackle gibberish city name 
function isValidCity(city) {
    const regex = /^[\p{L}\s.'-]{2,50}$/u;
    return regex.test(city);
}

function getWeather() {
    const cityInput = document.getElementById("city");
    const city = cityInput.value.trim();
    if (city === "") {
        hideResults(); //to hide previous result to not to mix with current one
        showError("Please enter a city name.");
        return;
    }

    //to prevent from multiple search while api calling 
    if (!isValidCity(city)) {
        hideResults();
        showError("Invalid input. Please enter a valid city name.");
        return;
    }
    cityInput.disabled = true;

    // Show loader, hide previous results and errors
    showLoader(true);
    hideResults();
    hideError();

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=5`;

    fetch(url)
        .then(res => res.json())

        .then(data => {
            showLoader(false);
            cityInput.disabled = false;

            // for api error
            if (data.error) {
                showError("City not found. Try a valid city name.");
                return;
            }

            if (!data.location || !data.current || !data.forecast) {
                showError("Incomplete data received. Please try again.");
                return;
            }

            displayCurrentWeather(data);
            displayForecast(data.forecast.forecastday);
        })
        .catch(() => {
            showLoader(false);
            cityInput.disabled = false;
            showError("Network error. Please try again.");
        });
}

function displayCurrentWeather(data) {
    const current = data.current;
    const location = data.location;

    document.getElementById("city-name").textContent = `${location.name}, ${location.country}`;
    document.getElementById("weather-condition").textContent = current.condition.text;
    document.getElementById("weather-icon").src = `https:${current.condition.icon}`;
    document.getElementById("temp").textContent = `${Math.round(current.temp_c)}°C`;
    document.getElementById("feels-like").textContent = `${Math.round(current.feelslike_c)}°C`;
    document.getElementById("humidity").textContent = `${current.humidity}%`;
    document.getElementById("wind").textContent = `${current.wind_kph} km/h`;
    document.getElementById("wind-dir").textContent = current.wind_dir;

    document.getElementById("current-weather").classList.remove("hidden");
}

function displayForecast(days) {
    const container = document.getElementById("forecast-cards");
    container.innerHTML = "";

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    days.forEach(day => {
        const date = new Date(day.date + "T00:00:00");
        const dayName = dayNames[date.getDay()];

        const card = document.createElement("div");
        card.className = "forecast-card";
        card.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
            <div class="forecast-high">${Math.round(day.day.maxtemp_c)}°</div>
            <div class="forecast-low">${Math.round(day.day.mintemp_c)}°</div>
            <div class="forecast-condition">${day.day.condition.text}</div>
        `;
        container.appendChild(card);
    });

    document.getElementById("forecast-section").classList.remove("hidden");
}

function showLoader(show) {
    document.getElementById("loader").classList.toggle("hidden", !show);
}

function showError(message) {
    const el = document.getElementById("error-msg");
    el.textContent = message;
    el.classList.remove("hidden");
}

function hideError() {
    document.getElementById("error-msg").classList.add("hidden");
}

function hideResults() {
    document.getElementById("current-weather").classList.add("hidden");
    document.getElementById("forecast-section").classList.add("hidden");
}