const apiKey = "f0133e94263d448c963164120261904";

let currentUnit = "C";
let currentData = null;

/* 🔹 GET WEATHER */
function getWeather() {
  const city = document.getElementById("city").value.trim();

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  let query = city;

  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(query)}`;

  const spinner = document.getElementById("loading-spinner");
  spinner.classList.remove("hidden");

  fetch(url)
    .then(res => res.json())
    .then(data => {
      spinner.classList.add("hidden");

      if (data.error) {
        alert(data.error.message);
        return;
      }

      updateWeather(data);
      saveRecentSearch(data.location.name);
    })
    .catch(() => {
      spinner.classList.add("hidden");
      alert("Failed to fetch weather data");
    });
}

/* 🔹 UPDATE WEATHER UI */
/* 🕘 SAVE RECENT SEARCHES */
function saveRecentSearch(city) {
  let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];

  // Remove duplicates
  searches = searches.filter(item => item !== city);

  // Add latest search at beginning
  searches.unshift(city);

  // Keep only last 5 searches
  searches = searches.slice(0, 5);

  localStorage.setItem("recentSearches", JSON.stringify(searches));

  renderRecentSearches();
}

/* 🕘 SHOW RECENT SEARCHES */
function renderRecentSearches() {
  const container = document.getElementById("recent-searches");

  if (!container) return;

  let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];

  container.innerHTML = "";

  searches.forEach(city => {
    const btn = document.createElement("button");

    btn.className = "recent-btn";
    btn.innerText = city;

    btn.addEventListener("click", () => {
      document.getElementById("city").value = city;
      getWeather();
    });

    container.appendChild(btn);
  });
}
function updateWeather(data) {
  currentData = data;

  document.getElementById("name").innerText =
    `${data.location.name}, ${data.location.country}`;

  document.getElementById("temp").innerText =
    currentUnit === "C"
      ? `${Math.round(data.current.temp_c)} °C`
      : `${Math.round(data.current.temp_f)} °F`;

  document.getElementById("condition").innerText =
    data.current.condition.text;

  document.getElementById("icon").src =
    "https:" + data.current.condition.icon;
}

/* 🔹 ENTER KEY SEARCH */
document.getElementById("city").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeather();

    const suggestions = document.getElementById("suggestions-list");
    if (suggestions) suggestions.style.display = "none";
  }
});

/* 🏙️ AUTOCOMPLETE SUGGESTIONS */
const cityInput = document.getElementById("city");
const suggestionsList = document.getElementById("suggestions-list");

let debounceTimer;

cityInput.addEventListener("input", function () {
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
              cityInput.value = `${location.name}, ${location.country}`;
              suggestionsList.style.display = "none";
              getWeather();
            });

            suggestionsList.appendChild(li);
          });
        } else {
          suggestionsList.style.display = "none";
        }
      })
      .catch(() => {
        suggestionsList.style.display = "none";
      });
  }, 300);
});

/* Hide suggestions when clicking outside */
document.addEventListener("click", function (e) {
  if (e.target !== cityInput && e.target !== suggestionsList) {
    suggestionsList.style.display = "none";
  }
});

/* 🔹 AUTO GEOLOCATION ON PAGE LOAD */
navigator.geolocation.getCurrentPosition(showPosition);

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

  const spinner = document.getElementById("loading-spinner");

  spinner.classList.remove("hidden");

  fetch(url)
    .then(res => res.json())
    .then(data => {
      spinner.classList.add("hidden");
      updateWeather(data);
    })
    .catch(() => {
      spinner.classList.add("hidden");
    });
}

/* 📍 USER LOCATION BUTTON */
function getLocationWeather() {
  const geoBtn = document.getElementById("geo-btn");
  const geoError = document.getElementById("geo-error");
  const spinner = document.getElementById("loading-spinner");

  geoError.classList.add("hidden");
  geoError.innerText = "";

  if (!navigator.geolocation) {
    geoError.innerText = "Geolocation not supported.";
    geoError.classList.remove("hidden");
    return;
  }

  geoBtn.innerText = "⏳";
  geoBtn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

      spinner.classList.remove("hidden");

      fetch(url)
        .then(res => res.json())
        .then(data => {
          spinner.classList.add("hidden");

          geoBtn.innerText = "📍";
          geoBtn.disabled = false;

          if (data.error) {
            geoError.innerText = "Could not fetch location weather.";
            geoError.classList.remove("hidden");
            return;
          }

          updateWeather(data);
        })
        .catch(() => {
          spinner.classList.add("hidden");

          geoBtn.innerText = "📍";
          geoBtn.disabled = false;

          geoError.innerText = "Failed to fetch location weather.";
          geoError.classList.remove("hidden");
        });
    },

    function () {
      geoBtn.innerText = "📍";
      geoBtn.disabled = false;

      geoError.innerText = "Location access denied.";
      geoError.classList.remove("hidden");
    }
  );
}

/* 🔹 UNIT TOGGLE */
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
});

/* 🌙 DARK MODE */
const themeBtn = document.getElementById("theme-toggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeBtn.innerText = "☀️ Light Mode";
}

themeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    themeBtn.innerText = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    themeBtn.innerText = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  }
});

/* 🌿 AIR QUALITY CHECK */
const aqButton = document.querySelector(".airquality button");
const aqResult = document.getElementById("aq-result");

aqButton.addEventListener("click", function () {
  if (!currentData) {
    aqResult.innerText = "Weather data not loaded yet!";
    aqResult.classList.add("show");
    return;
  }

  const lat = currentData.location.lat;
  const lon = currentData.location.lon;

  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=yes`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const aqi = data.current.air_quality.pm2_5;

      let status = "";
      let color = "";

      if (aqi <= 35) {
        status = "Good 🟢";
        color = "#28a745";
      } else if (aqi <= 75) {
        status = "Moderate 🟡";
        color = "#f1c40f";
      } else {
        status = "Poor 🔴";
        color = "#e74c3c";
      }

      aqResult.innerHTML = `
        🌿 Air Quality in <b>${data.location.name}</b><br>
        PM2.5 Level: <b>${aqi}</b><br>
        Status: <b>${status}</b>
      `;

      aqResult.style.background = color;
      aqResult.style.color = "white";

      aqResult.classList.remove("show");
      void aqResult.offsetWidth;
      aqResult.classList.add("show");
    })
    .catch(() => {
      aqResult.innerText = "Unable to fetch air quality data";
      aqResult.classList.add("show");
    });
});

/* 🕘 LOAD RECENT SEARCHES */
renderRecentSearches();