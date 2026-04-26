const apiKey = "f0133e94263d448c963164120261904";

let currentUnit = "C"; // default
let currentData = null; // store latest weather

// 🔹 GET WEATHER FUNCTION
function getWeather() {
  const city = document.getElementById("city").value.trim();
// fix: added default country handling
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  let query;

  // ✅ Fix: default country handling
  if (city.includes(",")) {
    query = city;
  } else {
    query = city + ",IN";
  }

 const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(query)}`;
const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(query)}&days=5`;

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
      alert("Failed to fetch weather data");
    });

  fetch(forecastUrl)
    .then(res => res.json())
    .then(data => {
      if (!data.error) {
        updateForecast(data);
      }
    });
  }
// 🔹 UPDATE UI FUNCTION
function updateWeather(data) {
  currentData = data;

  document.getElementById("name").innerText =
    data.location.name + ", " + data.location.country;

  let temp;

  if (currentUnit === "C") {
    temp = Math.round(data.current.temp_c) + " °C";
  } else {
    temp = Math.round(data.current.temp_f) + " °F";
  }

  document.getElementById("temp").innerText = temp;

  document.getElementById("condition").innerText =
    data.current.condition.text;

  document.getElementById("icon").src =
    "https:" + data.current.condition.icon;
}

// 🔹 FORECAST FUNCTION
function updateForecast(data) {
  const forecastCards = document.getElementById("forecast-cards");
  const forecastTitle = document.getElementById("forecast-title");

  forecastTitle.innerText = "3-Day Forecast";
  forecastCards.innerHTML = "";

  data.forecast.forecastday.forEach(day => {
    let high, low;

    if (currentUnit === "C") {
      high = Math.round(day.day.maxtemp_c) + "°C";
      low = Math.round(day.day.mintemp_c) + "°C";
    } else {
      high = Math.round(day.day.maxtemp_f) + "°F";
      low = Math.round(day.day.mintemp_f) + "°F";
    }

    const date = new Date(day.date);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

    const card = document.createElement("div");
    card.classList.add("forecast-card");
    card.innerHTML = `
      <p class="forecast-day">${dayName}</p>
      <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" />
      <p class="forecast-condition">${day.day.condition.text}</p>
      <p class="forecast-temp">⬆ ${high} &nbsp; ⬇ ${low}</p>
    `;
    forecastCards.appendChild(card);
  });
}

// 🔹 ENTER KEY SEARCH
document.getElementById("city").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeather();
  }
});

// 🔹 GEOLOCATION
navigator.geolocation.getCurrentPosition(showPosition);

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;
  const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=5`;
 
  fetch(url)
    .then(res => res.json())
    .then(data => {
      updateWeather(data);
    });
}

// 🔹 UNIT TOGGLE
document.getElementById("unit-toggle").addEventListener("click", function () {
  if (!currentData) return;

  if (currentUnit === "C") {
    currentUnit = "F";
    this.innerText = "Switch to °C";
  } else {
    currentUnit = "C";
    this.innerText = "Switch to °F";
  }

  updateWeather(currentData);

  const city = document.getElementById("city").value.trim() ||
    `${currentData.location.lat},${currentData.location.lon}`;
  const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=5`;
  fetch(forecastUrl)
    .then(res => res.json())
    .then(data => {
      if (!data.error) updateForecast(data);
    });
});

// 🌙 DARK MODE
const themeBtn = document.getElementById("theme-toggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeBtn.innerText = "☀️ Light Mode";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    themeBtn.innerText = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    themeBtn.innerText = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  }
});

