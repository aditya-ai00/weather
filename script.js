const apiKey = "f0133e94263d448c963164120261904";

let currentUnit = "C"; // default
let currentData = null; // store latest weather
const dashboardContent = document.getElementById("dashboard-content");
const loadingSpinner = document.getElementById("loading-spinner");

function getWeather() {
  const city = document.getElementById("city").value.trim();

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  fetchWeatherData(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`);
}

function fetchWeatherData(url) {
  if (dashboardContent) dashboardContent.classList.add("hidden");
  if (loadingSpinner) loadingSpinner.classList.remove("hidden");

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (loadingSpinner) loadingSpinner.classList.add("hidden");
      if (data.error) {
        alert(data.error.message);
        // Show dashboard again anyway to not leave a blank screen
        if (dashboardContent) dashboardContent.classList.remove("hidden");
        return;
      }
      updateWeather(data);
    })
    .catch(() => {
      if (loadingSpinner) loadingSpinner.classList.add("hidden");
      if (dashboardContent) dashboardContent.classList.remove("hidden");
      alert("Failed to fetch weather data");
    });
}

function formatDate(dateString) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  // Replace space with T for proper ISO 8601 parsing across browsers (Safari fix)
  const safeDateString = dateString.replace(' ', 'T');
  const d = new Date(safeDateString);
  return d.toLocaleDateString(undefined, options);
}

function updateWeather(data) {
  currentData = data;
  if (dashboardContent) dashboardContent.classList.remove("hidden");

  document.getElementById("name").innerText = `${data.location.name}, ${data.location.country}`;

  if (document.getElementById("date-time")) {
    document.getElementById("date-time").innerText = formatDate(data.location.localtime);
  }

  let temp, feelsLike;
  if (currentUnit === "C") {
    temp = Math.round(data.current.temp_c) + "°";
    feelsLike = Math.round(data.current.feelslike_c) + "°";
  } else {
    temp = Math.round(data.current.temp_f) + "°";
    feelsLike = Math.round(data.current.feelslike_f) + "°";
  }

  document.getElementById("temp").innerText = temp;
  document.getElementById("condition").innerText = data.current.condition.text;

  const iconImg = document.getElementById("icon");
  iconImg.src = "https:" + data.current.condition.icon;
  iconImg.style.display = "block"; // Make sure it's visible after placeholder

  if (document.getElementById("feels-like")) {
    document.getElementById("feels-like").innerText = feelsLike;
  }
  if (document.getElementById("uv-index")) {
    document.getElementById("uv-index").innerText = data.current.uv;
  }
  if (document.getElementById("humidity")) {
    document.getElementById("humidity").innerText = data.current.humidity;
    document.getElementById("humidity-bar").style.width = data.current.humidity + "%";
  }
  if (document.getElementById("wind")) {
    document.getElementById("wind").innerText = data.current.wind_kph;
    document.getElementById("wind-dir").innerText = data.current.wind_dir;
  }
  if (document.getElementById("visibility")) {
    document.getElementById("visibility").innerText = data.current.vis_km;
  }
  if (document.getElementById("pressure")) {
    document.getElementById("pressure").innerText = data.current.pressure_mb;
  }

  updateDynamicBackground(data.current.condition.text.toLowerCase(), data.current.is_day);
}

function updateDynamicBackground(condition, isDay) {
  let gradient;

  if (condition.includes("rain") || condition.includes("drizzle")) {
    gradient = "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)";
  } else if (condition.includes("cloud") || condition.includes("overcast") || condition.includes("mist") || condition.includes("fog")) {
    gradient = "linear-gradient(135deg, #8baaaa 0%, #ae8b9c 100%)";
  } else if (condition.includes("snow") || condition.includes("ice") || condition.includes("blizzard") || condition.includes("sleet")) {
    gradient = "linear-gradient(135deg, #8dc26f 0%, #76b852 100%)";
  } else if (condition.includes("clear") || condition.includes("sunny")) {
    if (isDay) {
      gradient = "linear-gradient(135deg, #f6d365 0%, #fda085 100%)";
    } else {
      gradient = "linear-gradient(135deg, #141e30 0%, #243b55 100%)";
    }
  } else {
    gradient = "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
  }

  document.documentElement.style.setProperty('--weather-bg', gradient);
}

document.getElementById("city").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeather();
  }
});

// Load location or fallback to London
navigator.geolocation.getCurrentPosition((pos) => {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;
  fetchWeatherData(url);
}, (err) => {
  // Fallback to default city if location is blocked
  fetchWeatherData(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=London`);
});

document.getElementById("unit-toggle").addEventListener("click", function () {
  if (!currentData) return;

  if (currentUnit === "C") {
    currentUnit = "F";
    this.innerText = "°C";
  } else {
    currentUnit = "C";
    this.innerText = "°F";
  }

  updateWeather(currentData);
});

// 🌙 DARK MODE TOGGLE
const themeBtn = document.getElementById("theme-toggle");

function enableDarkMode() {
  document.documentElement.setAttribute("data-theme", "dark");
  if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Theme';
  localStorage.setItem("theme", "dark");
}

function disableDarkMode() {
  document.documentElement.removeAttribute("data-theme");
  if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Theme';
  localStorage.setItem("theme", "light");
}

if (localStorage.getItem("theme") === "dark") {
  enableDarkMode();
} else if (themeBtn) {
  themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Theme';
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  });
}
