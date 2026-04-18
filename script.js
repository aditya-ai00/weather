const apiKey = config.WEATHER_API_KEY;

function getWeather() {
    const city = document.getElementById("city").value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    showLoader(true);
    hideResults();
    hideError();

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            showLoader(false);

            console.log(data); // 🔥 debug

            if (data.error) {
                showError(data.error.message);
                return;
            }

            displayCurrentWeather(data);
            displayForecast(data.forecast.forecastday);

            setDynamicBackground(data); // ✅ FIXED
        })
        .catch(error => {
            console.log(error);
            showLoader(false);
            showError("Error fetching weather");
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
setDynamicBackground(data);
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
function setDynamicBackground(data) {
    const condition = data.current.condition.text.toLowerCase();
    const isDay = data.current.is_day;

    let bgImage = "";

    if (condition.includes("rain")) {
        bgImage = "url('https://images.unsplash.com/photo-1501696461415-6bd6660c6742')";
    } 
    else if (condition.includes("cloud")) {
        bgImage = "url('https://images.unsplash.com/photo-1501630834273-4b5604d2ee31')";
    } 
    else if (condition.includes("clear") && isDay) {
        bgImage = "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9')";
    } 
    else if (condition.includes("clear") && !isDay) {
        bgImage = "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee')";
    } 
    else if (!isDay) {
        bgImage = "url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429')";
    } 
    else {
        bgImage = "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')";
    }

    document.body.style.background = `
        linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)),
        ${bgImage}
    `;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
}