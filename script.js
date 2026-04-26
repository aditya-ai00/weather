const apiKey = "f0133e94263d448c963164120261904";

let currentUnit = "C"; // default
let currentData = null; // store latest weather

// 🔹 GET WEATHER FUNCTION
function getWeather() {
  const city = document.getElementById("city").value.trim();

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
    })
    .catch(() => {
      spinner.classList.add("hidden");
      alert("Failed to fetch weather data");
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

// 🔹 ENTER KEY SEARCH
document.getElementById("city").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeather();
  }
});

// 🔹 AUTO GEOLOCATION ON PAGE LOAD (silent — no error shown to user)
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

// 📍 USER-TRIGGERED GEOLOCATION BUTTON
function getLocationWeather() {
  const geoBtn = document.getElementById("geo-btn");
  const geoError = document.getElementById("geo-error");
  const spinner = document.getElementById("loading-spinner");

  // Clear any previous error
  geoError.classList.add("hidden");
  geoError.innerText = "";

  // Check if geolocation is supported
  if (!navigator.geolocation) {
    geoError.innerText = "⚠️ Geolocation is not supported by your browser.";
    geoError.classList.remove("hidden");
    return;
  }

  // Show loading state on button
  geoBtn.innerText = "⏳";
  geoBtn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    // ✅ Success callback
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
            geoError.innerText = "⚠️ Could not get weather for your location.";
            geoError.classList.remove("hidden");
            return;
          }

          updateWeather(data);
        })
        .catch(() => {
          spinner.classList.add("hidden");
          geoBtn.innerText = "📍";
          geoBtn.disabled = false;
          geoError.innerText = "⚠️ Failed to fetch weather data. Please try again.";
          geoError.classList.remove("hidden");
        });
    },

    // ❌ Error callback
    function (error) {
      geoBtn.innerText = "📍";
      geoBtn.disabled = false;

      if (error.code === error.PERMISSION_DENIED) {
        geoError.innerText = "🚫 Location access was denied. Please search manually.";
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        geoError.innerText = "⚠️ Location information is unavailable. Please search manually.";
      } else if (error.code === error.TIMEOUT) {
        geoError.innerText = "⏱️ Location request timed out. Please try again.";
      } else {
        geoError.innerText = "⚠️ An unknown error occurred. Please search manually.";
      }

      geoError.classList.remove("hidden");
    }
  );
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