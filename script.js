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

  if (city.includes(",")) {
    query = city;
  } else {
    query = city + ",IN";
  }

  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(query)}`;

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

// 🔹 UPDATE UI FUNCTION
function updateWeather(data) {
  currentData = data;

  document.getElementById("name").innerText =
    data.location.name + ", " + data.location.country;

  let temp;

  if (currentUnit === "C") {
    temp = Math.round(data.current.temp_c) + "°";
  } else {
    temp = Math.round(data.current.temp_f) + "°";
  }

  document.getElementById("temp").innerText = temp;

  document.getElementById("condition").innerText =
    data.current.condition.text;

  document.getElementById("icon").src =
    "https:" + data.current.condition.icon;
}


document.getElementById("city").addEventListener("keypress", function(e){
  if(e.key === "Enter"){
    getWeather();
    document.getElementById("suggestions-list").style.display = "none";
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

// 🔹 CLEAR BUTTON
const clearBtn = document.getElementById("clear-btn");

cityInput.addEventListener("input", function () {
  if (this.value.length > 0) {
    clearBtn.classList.add("visible");
  } else {
    clearBtn.classList.remove("visible");
  }
});

clearBtn.addEventListener("click", function () {
  cityInput.value = "";
  clearBtn.classList.remove("visible");
  suggestionsList.style.display = "none";
  cityInput.focus();
});

// 🔹 GEOLOCATION
navigator.geolocation.getCurrentPosition(showPosition, () => {
  console.warn("Location denied");
});

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

// 🔹 UNIT PILL TOGGLE
document.querySelectorAll(".unit-btn").forEach(btn => {
  btn.addEventListener("click", function () {
    if (!currentData) return;
    document.querySelectorAll(".unit-btn").forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    currentUnit = this.dataset.unit;
    updateWeather(currentData);
  });
});

const themeBtn = document.getElementById("theme-toggle");
const themeIcon = themeBtn.querySelector(".theme-icon use");
const themeLabel = themeBtn.querySelector(".theme-label");

function updateThemeToggle(isDark) {
  if (themeIcon) {
    const iconId = isDark ? "icon-sun" : "icon-moon";
    themeIcon.setAttribute("href", `assets/icons.svg#${iconId}`);
  }
  if (themeLabel) {
    themeLabel.textContent = isDark ? "Light Mode" : "Dark Mode";
  }
}

const darkMode = localStorage.getItem("theme") === "dark";
if (darkMode) {
  document.body.classList.add("dark-mode");
}
updateThemeToggle(darkMode);

themeBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  updateThemeToggle(isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
});