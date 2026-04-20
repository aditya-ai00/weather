const apiKey = "3a4dc2581af7beaa310a4dbc43bd8d2c";
const defaultWeatherIcon = "https://openweathermap.org/img/wn/01d@2x.png";

function setMessage(message = "") {
  const messageElement = document.getElementById("message");

  if (!messageElement) {
    return;
  }

  messageElement.innerText = message;
}

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
  const cityInput = document.getElementById("city");
  const city = cityInput ? cityInput.value.trim() : "";

  if (!city) {
    setMessage("Please enter a city name.");
    return;
  }

  setMessage("");

  // Allow worldwide lookups and preserve optional "city,country" input like "Paris,FR".
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status === 404 ? "City not found" : "Unable to fetch weather data");
      }
      return response.json();
    })
    .then(data => {
      const currentWeather = data.weather && data.weather[0] ? data.weather[0] : {};

      document.getElementById("name").innerText =
        data.name + ", " + data.sys.country;

      document.getElementById("temp").innerText =
        Math.round(data.main.temp) + " °C";

      document.getElementById("condition").innerText =
        currentWeather.description || "Weather condition unavailable";

      updateWeatherIcon(currentWeather);
      setMessage("");
    })
    .catch(error => {
      setMessage(
        error.message === "City not found"
          ? "City not found. Try searching for a different city or use city,country such as Paris,FR."
          : "Unable to fetch weather data right now. Please try again."
      );
    });
}
