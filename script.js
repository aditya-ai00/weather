// Myapi key
const apiKey = config.WEATHER_API_KEY;

function getWeather() {
  const city = document.getElementById("city").value.trim();

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("name").innerText =
        data.name + ", " + data.sys.country;

      document.getElementById("temp").innerText =
        Math.round(data.main.temp) + " °C";

      document.getElementById("condition").innerHTML = "<b>Condition: </b>" + data.weather[0].description;

      document.getElementById("humidity").innerHTML = "<b>Humidity: </b>" + data.main.humidity + " %";

      document.getElementById("wind").innerHTML = "<b>Wind: </b>" + data.wind.speed + " Km/h";

      const oldIcon = document.getElementById("icon");
      if (oldIcon) oldIcon.remove();

      const iconCode = data.weather[0].icon;
      const img = document.createElement("img");
      img.id = "icon";
      img.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      img.alt = "weather icon";

      const card = document.getElementById("weather-card");
      card.insertBefore(img, document.getElementById("temp")); 
    })
    .catch(() => {
      alert("City not found");
    });
    document.getElementById("city").value = "";
}
