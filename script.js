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

// Dynamic weather icon mapping
// Safety check for data
    if (data && data.current && data.current.condition) {
        const condition = data.current.condition.text.toLowerCase();
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
            emojiElement.innerText = weatherEmoji;
        }
    }     // Ensure styling isn't cleared if it's used for Dark Mode
    }
}
document.getElementById("city").addEventListener("keypress", function(e){

if(e.key === "Enter"){
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
