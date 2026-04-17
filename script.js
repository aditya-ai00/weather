const apiKey = config.WEATHER_API_KEY;

let isCelsius = true;
let lastWeatherData = null;

function getWeather() {
    const city = document.getElementById("city").value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    showLoader(true);
    hideResults();
    hideError();

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=5`;

    fetch(url)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then((data) => {
            showLoader(false);

            if (data.error) {
                showError("City not found. Please try again.");
                return;
            }

            lastWeatherData = data;
            displayCurrentWeather(data);
            displayForecast(data.forecast.forecastday);
        })
        .catch(() => {
            showLoader(false);
            showError("Unable to fetch weather data. Check your connection and try again.");
        });
}

function displayCurrentWeather(data) {
    const current = data.current;
    const location = data.location;
    const temp = isCelsius ? current.temp_c : current.temp_f;
    const feels = isCelsius ? current.feelslike_c : current.feelslike_f;
    const wind = isCelsius ? `${current.wind_kph} km/h` : `${current.wind_mph} mph`;

    document.getElementById("city-name").textContent =
        `${location.name}, ${location.country}`;
    document.getElementById("weather-condition").textContent =
        current.condition.text;
    document.getElementById("weather-icon").src =
        `https:${current.condition.icon}`;
    document.getElementById("temp").textContent =
        `${Math.round(temp)}°${isCelsius ? "C" : "F"}`;
    document.getElementById("feels-like").textContent =
        `${Math.round(feels)}°${isCelsius ? "C" : "F"}`;
    document.getElementById("humidity").textContent =
        `${current.humidity}%`;
    document.getElementById("wind").textContent = wind;
    document.getElementById("wind-dir").textContent =
        current.wind_dir;

    document.getElementById("current-weather").classList.remove("hidden");
}

function displayForecast(days) {
    const container = document.getElementById("forecast-cards");
    container.innerHTML = "";

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    days.forEach((day) => {
        const date = new Date(day.date + "T00:00:00");
        const dayName = dayNames[date.getDay()];
        const maxTemp = isCelsius ? day.day.maxtemp_c : day.day.maxtemp_f;
        const minTemp = isCelsius ? day.day.mintemp_c : day.day.mintemp_f;

        const card = document.createElement("div");
        card.className = "forecast-card";

        card.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
            <div class="forecast-high">${Math.round(maxTemp)}°</div>
            <div class="forecast-low">${Math.round(minTemp)}°</div>
            <div class="forecast-condition">${day.day.condition.text}</div>
        `;

        container.appendChild(card);
    });

    document.getElementById("forecast-section").classList.remove("hidden");
}

function toggleUnit() {
    isCelsius = !isCelsius;
    const btn = document.getElementById("unit-toggle");
    btn.textContent = isCelsius ? "Switch to °F" : "Switch to °C";

    if (lastWeatherData) {
        displayCurrentWeather(lastWeatherData);
        displayForecast(lastWeatherData.forecast.forecastday);
    }
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

/* Theme Toggle Logic */
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const toggleIcon = document.querySelector(".toggle-icon");

    function updateToggle() {
        if (document.body.classList.contains("dark-mode")) {
            toggleIcon.style.transform = "translateX(36px)";
            toggleIcon.textContent = "🌙";
        } else {
            toggleIcon.style.transform = "translateX(0)";
            toggleIcon.textContent = "☀️";
        }
    }

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    updateToggle();

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark-mode") ? "dark" : "light"
        );

        updateToggle();
    });
});