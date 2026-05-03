const apiKey = "f0133e94263d448c963164120261904";

let currentUnit = "C";
let currentData = null;

const CONDITION_MAP = [
  // [conditionCodes[], isDay, backdropClass, basmilius-filename]
  { codes: [1000], day: true,  backdrop: "sunny-day",    icon: "clear-day.svg"           },
  { codes: [1000], day: false, backdrop: "clear-night",  icon: "clear-night.svg"         },
  { codes: [1003], day: true,  backdrop: "partly-cloud", icon: "partly-cloudy-day.svg"   },
  { codes: [1003], day: false, backdrop: "partly-cloud", icon: "partly-cloudy-night.svg" },
  { codes: [1006, 1009],       backdrop: "cloudy",       icon: "cloudy.svg"              },
  { codes: [1030, 1135, 1147], backdrop: "fog",          icon: "fog.svg"                 },
  { codes: [1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246], backdrop: "rain", icon: "rain.svg" },
  { codes: [1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258], backdrop: "snow", icon: "snow.svg" },
  { codes: [1069, 1072, 1204, 1207, 1249, 1252], backdrop: "rain",    icon: "sleet.svg"           },
  { codes: [1087, 1273, 1276, 1279, 1282],        backdrop: "thunder", icon: "thunderstorms-rain.svg" },
];

function getConditionInfo(code, isDay) {
  for (const entry of CONDITION_MAP) {
    if (!entry.codes.includes(code)) continue;
    // entries with a `day` field only match that time of day
    if ("day" in entry && entry.day !== Boolean(isDay)) continue;
    return entry;
  }
  return { backdrop: "default", icon: "cloudy.svg" };
}

//  GET WEATHER 
function getWeather() {
  const city = document.getElementById("city").value.trim();
  if (!city) { alert("Please enter a city name"); return; }

  const query = city.includes(",") ? city : city + ",IN";
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(query)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.error) { alert(data.error.message); return; }
      updateWeather(data);
    })
    .catch(() => alert("Failed to fetch weather data"));
}

//  UPDATE UI 
function updateWeather(data) {
  currentData = data;

  // Location
  document.getElementById("name").innerText =
    data.location.name + ", " + data.location.country;

  // Temperature
  const temp = currentUnit === "C"
    ? Math.round(data.current.temp_c) + "°"
    : Math.round(data.current.temp_f) + "°";
  document.getElementById("temp").innerText = temp;

  // Condition text
  document.getElementById("condition").innerText = data.current.condition.text;

  // Stats row
  document.getElementById("stat-humidity").innerText  = data.current.humidity + "%";
  document.getElementById("stat-wind").innerText      = data.current.wind_kph + " km/h";
  const feelslike = currentUnit === "C"
    ? Math.round(data.current.feelslike_c) + "°"
    : Math.round(data.current.feelslike_f) + "°";
  document.getElementById("stat-feelslike").innerText = feelslike;

  // Condition info
  const info = getConditionInfo(data.current.condition.code, data.current.is_day);

  // Swap backdrop gradient
  const backdrop = document.getElementById("card-backdrop");
  backdrop.className = ""; // clear old class
  backdrop.classList.add(info.backdrop);

  // Fallback: WeatherAPI's own PNG icon if file not found
  const iconEl = document.getElementById("icon");
  const basmilius = `assets/weather/${info.icon}`;
  iconEl.onerror = () => {
    iconEl.onerror = null;
    iconEl.src = "https:" + data.current.condition.icon;
  };
  iconEl.src = basmilius;
  document.getElementById("weather-icon-wrap").style.display = "flex";
}

//  ENTER KEY 
document.getElementById("city").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    getWeather();
    document.getElementById("suggestions-list").style.display = "none";
  }
});

//  AUTOCOMPLETE 
const cityInput     = document.getElementById("city");
const suggestionsList = document.getElementById("suggestions-list");
let debounceTimer;

cityInput.addEventListener("input", function() {
  clearTimeout(debounceTimer);
  const query = this.value.trim();

  if (query.length < 2) {
    suggestionsList.style.display = "none";
    suggestionsList.innerHTML = "";
    return;
  }

  debounceTimer = setTimeout(() => {
    const url = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${encodeURIComponent(query)}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        suggestionsList.innerHTML = "";
        if (data.length > 0) {
          suggestionsList.style.display = "block";
          data.forEach(location => {
            const li = document.createElement("li");
            li.textContent = `${location.name}, ${location.country}`;
            li.addEventListener("click", () => {
              cityInput.value = location.name;
              suggestionsList.style.display = "none";
              getWeather();
            });
            suggestionsList.appendChild(li);
          });
        } else {
          suggestionsList.style.display = "none";
        }
      })
      .catch(() => { suggestionsList.style.display = "none"; });
  }, 300);
});

document.addEventListener("click", function(e) {
  if (e.target !== cityInput && e.target !== suggestionsList)
    suggestionsList.style.display = "none";
});

//  CLEAR BUTTON 
const clearBtn = document.getElementById("clear-btn");

cityInput.addEventListener("input", function() {
  clearBtn.classList.toggle("visible", this.value.length > 0);
});

clearBtn.addEventListener("click", function() {
  cityInput.value = "";
  clearBtn.classList.remove("visible");
  suggestionsList.style.display = "none";
  cityInput.focus();
});

//  GEOLOCATION 
navigator.geolocation.getCurrentPosition(
  position => {
    const { latitude: lat, longitude: lon } = position.coords;
    fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`)
      .then(res => res.json())
      .then(data => updateWeather(data));
  },
  () => console.warn("Location denied")
);

//  UNIT PILL 
document.querySelectorAll(".unit-btn").forEach(btn => {
  btn.addEventListener("click", function() {
    if (!currentData) return;
    document.querySelectorAll(".unit-btn").forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    currentUnit = this.dataset.unit;
    updateWeather(currentData);
  });
});

//  THEME TOGGLE 
const themeBtn   = document.getElementById("theme-toggle");
const themeIcon  = themeBtn.querySelector(".theme-icon use");
const themeLabel = themeBtn.querySelector(".theme-label");

function updateThemeToggle(isDark) {
  if (themeIcon)  themeIcon.setAttribute("href", `assets/icons/icons.svg#${isDark ? "icon-sun" : "icon-moon"}`);
  if (themeLabel) themeLabel.textContent = isDark ? "Light Mode" : "Dark Mode";
}

const darkMode = localStorage.getItem("theme") === "dark";
if (darkMode) document.body.classList.add("dark-mode");
updateThemeToggle(darkMode);

themeBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  updateThemeToggle(isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
});