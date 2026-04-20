const apiKey = "3a4dc2581af7beaa310a4dbc43bd8d2c";
const defaultWeatherIcon = "https://openweathermap.org/img/wn/01d@2x.png";

function getWeatherIconUrl(iconCode) {
  return iconCode
    ? `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    : defaultWeatherIcon;
}

function updateWeatherIcon(weather = {}) {
  const weatherIcon = document.getElementById("weather-icon");
  const iconUrl = getWeatherIconUrl(weather.icon);
  const description = weather.description || "Weather condition unavailable";

  if (!weatherIcon) {
    return;
  }

  // Reveal the icon after it loads and fall back to a default if the API icon is missing.
  weatherIcon.hidden = true;
  weatherIcon.classList.add("is-loading");
  weatherIcon.alt = description;
  weatherIcon.title = description;
  weatherIcon.onerror = () => {
    if (weatherIcon.dataset.fallbackApplied === "true") {
      weatherIcon.hidden = false;
      weatherIcon.classList.remove("is-loading");
      return;
    }

    weatherIcon.dataset.fallbackApplied = "true";
    weatherIcon.src = defaultWeatherIcon;
  };
  weatherIcon.onload = () => {
    weatherIcon.hidden = false;
    weatherIcon.classList.remove("is-loading");
  };
  weatherIcon.dataset.fallbackApplied = iconUrl === defaultWeatherIcon ? "true" : "false";
  weatherIcon.src = iconUrl;
}

function getWeather() {
  const city = document.getElementById("city").value.trim();

navigator.geolocation.getCurrentPosition(showPosition);

function showPosition(position){

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then(data => {
      const currentWeather = data.weather && data.weather[0] ? data.weather[0] : {};

const url =
`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

fetch(url)
.then(res => res.json())
.then(data => {

      document.getElementById("condition").innerText =
        currentWeather.description || "Weather condition unavailable";

      updateWeatherIcon(currentWeather);
    })
    .catch(() => {
      alert("City not found");
    });
}
