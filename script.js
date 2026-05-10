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

  query=city;

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

// Dynamic weather icon mapping
// Safety check for data
   if (data && data.current && data.current.condition && data.current.condition.text) {
  const condition = data.current.condition.text.toLowerCase();
     );
        let weatherEmoji = "🌡️"; 

        if (condition.includes("sunny") || condition.includes("clear")) {
            weatherEmoji = "☀️";
        } else if (condition.includes("cloud") || condition.includes("overcast")) {
            weatherEmoji = "☁️";
        } else if (condition.includes("rain") || condition.includes("drizzle")) {
            weatherEmoji = "🌧️";
        } else if (condition.includes("snow") || condition.includes("blizzard")) {
            weatherEmoji = "❄️";
        } else if (condition.includes("thunder") || condition.includes("storm")) {
            weatherEmoji = "⛈️";
        } else if (condition.includes("fog") || condition.includes("mist")) {
            weatherEmoji = "🌫️";
        } else if (condition.includes("wind")) {
            weatherEmoji = "💨";
        }

        const emojiElement = document.getElementById("weather-emoji");
        if (emojiElement) {
            // InnerText update karo, par element ki classes (Dark Mode wali) ko mat hatana
          emojiElement.textContent = weatherEmoji;
        }
    }     // Ensure styling isn't cleared if it's used for Dark Mode
    }
}
document.getElementById("city").addEventListener("keypress", function(e){

if(e.key === "Enter"){
getWeather();
}

});


// 🏙️ AUTOCOMPLETE SUGGESTIONS LOGIC
const cityInput = document.getElementById("city");
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

// Hide suggestions when clicking outside
document.addEventListener("click", function(e) {
    if (e.target !== cityInput && e.target !== suggestionsList) {
        suggestionsList.style.display = "none";
    }
});



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