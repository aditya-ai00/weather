const apiKey = config.WEATHER_API_KEY;
let isRaining = false;
let isCelsius = true;
let lastWeatherData = null;
let activeVideoIndex = 0;
let currentBackgroundFile = "videos/clear.mp4";

const bgVideos = [
    document.getElementById("bgVideoA"),
    document.getElementById("bgVideoB")
];

const canvasFX = document.getElementById("effectsCanvas");
const ctxFX = canvasFX.getContext("2d");
let rainDrops = [];

function getWeather() {
    const city = document.getElementById("city").value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    showLoader(true);
    hideResults();
    hideError();

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;

    fetch(url)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network error");
            }
            return res.json();
        })
        .then((data) => {
            showLoader(false);

            if (data.error) {
                showError(data.error.message);
                return;
            }

            lastWeatherData = data;
            displayCurrentWeather(data);
            displayForecast(data.forecast.forecastday);
            setDynamicBackground(data);
        })
        .catch(() => {
            showLoader(false);
            showError("Unable to fetch weather data.");
        });
}

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}&units=metric`;

    document.getElementById("current-weather").classList.remove("hidden");
}

function displayForecast(days) {
    const container = document.getElementById("forecast-cards");
    container.innerHTML = "";

navigator.geolocation.getCurrentPosition(showPosition);

function showPosition(position){

    })
    .catch(() => {
      alert("City not found");
    });

    document.getElementById("forecast-section").classList.remove("hidden");
}

function toggleUnit() {
    isCelsius = !isCelsius;
    document.getElementById("unit-toggle").textContent = isCelsius ? "Switch to °F" : "Switch to °C";

    if (lastWeatherData) {
        displayCurrentWeather(lastWeatherData);
        displayForecast(lastWeatherData.forecast.forecastday);
    }
}

function showLoader(show) {
    document.getElementById("loader").classList.toggle("hidden", !show);
}

function showError(message) {
    const el = document.getElementById("error-msg");
    el.textContent = message;
    el.classList.remove("hidden");
}

function hideError() {
    document.getElementById("error-msg").classList.add("hidden");
}

function hideResults() {
    document.getElementById("current-weather").classList.add("hidden");
    document.getElementById("forecast-section").classList.add("hidden");
}

function getCityLocalHour(data) {
    const localtime = data?.location?.localtime;
    if (!localtime) return null;
    const parts = localtime.split(" ");
    if (parts.length < 2) return null;
    const hour = Number(parts[1].split(":")[0]);
    return Number.isNaN(hour) ? null : hour;
}

function getBackgroundFile(data) {
    const condition = data.current.condition.text.toLowerCase();
    const localHour = getCityLocalHour(data);
    const isDayByLocalTime = localHour !== null ? localHour >= 6 && localHour < 18 : data.current.is_day === 1;

    if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("thunder")) {
        isRaining = true;
        return "videos/rain.mp4";
    }

    isRaining = false;
    if (condition.includes("cloud") || condition.includes("overcast") || condition.includes("mist")) {
        return "videos/clouds.mp4";
    }

    return isDayByLocalTime ? "videos/clear.mp4" : "videos/night.mp4";
}

function applyFrontTheme(data) {
    const condition = data.current.condition.text.toLowerCase();
    const localHour = getCityLocalHour(data);
    const isDayByLocalTime = localHour !== null ? localHour >= 6 && localHour < 18 : data.current.is_day === 1;

    document.body.classList.remove("theme-day", "theme-night", "theme-rain", "theme-cloud");

    if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("thunder")) {
        document.body.classList.add("theme-rain");
        return;
    }

    if (condition.includes("cloud") || condition.includes("overcast") || condition.includes("mist")) {
        document.body.classList.add("theme-cloud");
        return;
    }

    document.body.classList.add(isDayByLocalTime ? "theme-day" : "theme-night");
}

function setDynamicBackground(data) {
    applyFrontTheme(data);

    const nextFile = getBackgroundFile(data);
    if (nextFile === currentBackgroundFile) return;

    const currentVideo = bgVideos[activeVideoIndex];
    const nextVideo = bgVideos[1 - activeVideoIndex];

    nextVideo.src = nextFile;
    nextVideo.load();
    nextVideo.play().catch(() => {});

    nextVideo.classList.add("active");
    currentVideo.classList.remove("active");

    activeVideoIndex = 1 - activeVideoIndex;
    currentBackgroundFile = nextFile;
}

class RainDrop {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        this.x = Math.random() * canvasFX.width;
        this.y = initial ? Math.random() * canvasFX.height : -20;
        this.length = Math.random() * 20 + 10;
        this.speed = Math.random() * 7 + 8;
    }

    update() {
        this.y += this.speed;
        if (this.y > canvasFX.height) {
            this.reset();
        }
    }

    draw() {
        ctxFX.strokeStyle = "rgba(255,255,255,0.35)";
        ctxFX.lineWidth = 1.2;
        ctxFX.beginPath();
        ctxFX.moveTo(this.x, this.y);
        ctxFX.lineTo(this.x - 2, this.y + this.length);
        ctxFX.stroke();
    }
}

function initRain() {
    rainDrops = Array.from({ length: 170 }, () => new RainDrop());
}

function animateEffects() {
    ctxFX.clearRect(0, 0, canvasFX.width, canvasFX.height);

    if (isRaining) {
        rainDrops.forEach((drop) => {
            drop.update();
            drop.draw();
        });
    }
    requestAnimationFrame(animateEffects);
}

function resizeEffects() {
    canvasFX.width = window.innerWidth;
    canvasFX.height = window.innerHeight;
}

resizeEffects();
initRain();
animateEffects();
window.addEventListener("resize", resizeEffects);

bgVideos.forEach((video) => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.play().catch(() => {});
});

const lat = position.coords.latitude;
const lon = position.coords.longitude;

const url =
`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

fetch(url)
.then(res => res.json())
.then(data => {

updateWeather(data);

});

}


document.getElementById("unit-toggle").addEventListener("click", function(){

  if(!currentData) return; // no data yet

  if(currentUnit === "C"){
    currentUnit = "F";
    this.innerText = "Switch to °C";
  } else {
    currentUnit = "C";
    this.innerText = "Switch to °F";
  }

  updateWeather(currentData); // refresh display
});



// 🌙 DARK MODE TOGGLE
const themeBtn = document.getElementById("theme-toggle");

// Load saved theme (optional but recommended)
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeBtn.innerText = "☀️ Light Mode";
}

// Toggle on click
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


