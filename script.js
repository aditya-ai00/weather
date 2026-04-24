const apiKey = config.WEATHER_API_KEY;

let currentUnit = "C";
let currentData = null;

function getWeather() {
  const city = document.getElementById("city").value.trim();

  if (!city) {
    alert("Please enter a city name");
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
      alert("Failed to fetch weather data");
    });
}

function updateWeather(data) {
  currentData = data;

  document.getElementById("name").innerText = data.location.name + ", " + data.location.country;

  let temp;
  let unit;

  if (currentUnit === "C") {
    temp = Math.round(data.current.temp_c);
    unit = "°C";
  } else {
    temp = Math.round(data.current.temp_f);
    unit = "°F";
  }

  document.getElementById("temp").innerText = temp;
  document.querySelector(".unit").innerText = unit;

  document.getElementById("condition").innerText = data.current.condition.text;
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

  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      updateWeather(data);
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