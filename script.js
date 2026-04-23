// Check if config exists and has the key; otherwise, default to an empty string
const apiKey = (typeof config !== 'undefined' && config.WEATHER_API_KEY) ? config.WEATHER_API_KEY : "";

let isCelsius = true; 
let lastWeatherData = null;

function getWeather() {
    const city = document.getElementById("city").value.trim();

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    // Handle missing API key gracefully
    if (!apiKey) {
        alert("API Key is missing. If you're the developer, please check your environment variables or config.js.");
        console.error("Weather API key not found.");
        return;
    }

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error.message);
                return;
            }
            updateWeather(data);
        })
        .catch(() => {
            alert("Failed to fetch weather data. Please check your connection.");
        });
}

function updateWeather(data) {
    document.getElementById("name").innerText = data.location.name + ", " + data.location.country;
    document.getElementById("temp").innerText = Math.round(data.current.temp_c) + " °C";
    document.getElementById("condition").innerText = data.current.condition.text;
    document.getElementById("icon").src = "https:" + data.current.condition.icon;
}

document.getElementById("city").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        getWeather();
    }
});

// Added a check here to prevent automatic failures if the key is missing
if (apiKey) {
    navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (!data.error) {
                updateWeather(data);
            }
        })
        .catch(err => console.error("Geolocation weather fetch failed:", err));
}