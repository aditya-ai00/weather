const apiKey = config.WEATHER_API_KEY;

let currentUnit = "C";
let currentData = null;
let forecastData = null;

function getWeather() {
  const city = document.getElementById("city").value.trim();

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=7`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error.message);
        return;
      }

      currentData = data;
      forecastData = data.forecast.forecastday;
      updateWeather(data);
      updateForecast(data.forecast.forecastday);
    })
    .catch(() => {
      alert("Failed to fetch weather data");
    });
}

function updateWeather(data) {
  document.getElementById("name").innerText = data.location.name + ", " + data.location.country;

  let temp;
  let unit;

  if (currentUnit === "C") {
    temp = Math.round(data.current.temp_c);
    unit = "C";
  } else {
    temp = Math.round(data.current.temp_f);
    unit = "F";
  }

  document.getElementById("temp").innerText = temp + "°";
  document.querySelector(".unit").innerText = unit;
  document.getElementById("condition").innerText = data.current.condition.text;
}

function updateForecast(forecastDays) {
  const forecastSection = document.getElementById("forecast-section");
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  forecastDays.forEach((day, index) => {
    const date = new Date(day.date);
    const dayName = index === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" });
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    let maxTemp, minTemp;
    if (currentUnit === "C") {
      maxTemp = Math.round(day.day.maxtemp_c);
      minTemp = Math.round(day.day.mintemp_c);
    } else {
      maxTemp = Math.round(day.day.maxtemp_f);
      minTemp = Math.round(day.day.mintemp_f);
    }

    // Get weather icon/emoji based on condition
    const conditionCode = day.day.condition.code;
    const icon = getWeatherEmoji(conditionCode);

    const dayElement = document.createElement("div");
    dayElement.className = "forecast-day";
    dayElement.innerHTML = `
      <div class="day">${dayName}</div>
      <div class="date">${dateStr}</div>
      <div class="icon">${icon}</div>
      <div class="temp-range">
        <span class="high">${maxTemp}°</span>
        <span class="low">${minTemp}°</span>
      </div>
      <div class="condition-text">${day.day.condition.text}</div>
    `;

    forecastContainer.appendChild(dayElement);
  });

  forecastSection.style.display = "block";
}

function getWeatherEmoji(code) {
  const weatherEmojis = {
    1000: "☀️",
    1003: "⛅",
    1006: "☁️",
    1009: "☁️",
    1030: "🌫️",
    1063: "🌧️",
    1066: "🌨️",
    1069: "🌨️",
    1072: "🌨️",
    1087: "⛈️",
    1114: "🌨️",
    1117: "🌨️",
    1135: "🌫️",
    1147: "🌫️",
    1150: "🌧️",
    1153: "🌧️",
    1168: "🌧️",
    1171: "🌧️",
    1180: "🌧️",
    1183: "🌧️",
    1186: "🌧️",
    1189: "🌧️",
    1192: "🌧️",
    1195: "🌧️",
    1198: "🌧️",
    1201: "🌧️",
    1204: "🌨️",
    1207: "🌨️",
    1210: "🌨️",
    1213: "🌨️",
    1216: "🌨️",
    1219: "🌨️",
    1222: "🌨️",
    1225: "🌨️",
    1230: "🌫️",
    1231: "🌫️",
    1240: "🌧️",
    1243: "🌧️",
    1246: "🌧️",
    1249: "🌨️",
    1252: "🌨️",
    1255: "🌨️",
    1258: "🌨️",
    1261: "🌨️",
    1264: "🌨️",
    1273: "⛈️",
    1276: "⛈️",
    1279: "⛈️",
    1282: "⛈️"
  };

  return weatherEmojis[code] || "🌤️";
}

document.getElementById("city").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    getWeather();
  }
});

navigator.geolocation.getCurrentPosition(showPosition);

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      currentData = data;
      forecastData = data.forecast.forecastday;
      updateWeather(data);
      updateForecast(data.forecast.forecastday);
    });
}

document.getElementById("unit-toggle").addEventListener("click", function() {
  if (!currentData) return;

  if (currentUnit === "C") {
    currentUnit = "F";
  } else {
    currentUnit = "C";
  }

  updateWeather(currentData);
  if (forecastData) {
    updateForecast(forecastData);
  }
});

// Dark Mode
const themeBtn = document.getElementById("theme-toggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});