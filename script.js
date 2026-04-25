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
