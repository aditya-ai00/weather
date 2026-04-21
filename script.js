const apiKey = "3a4dc2581af7beaa310a4dbc43bd8d2c";

function getWeather() {

  const city = document.getElementById("city").value.trim();

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}&units=metric`;

 fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then(data => {
            // Name aur Temp update 
            document.getElementById("name").innerText = data.name + ", " + data.sys.country;
            document.getElementById("temp").innerText = Math.round(data.main.temp) + " °C";

           // --- Dynamic Weather Icon Mapping ---
            const condition = data.weather[0].main.toLowerCase();
            const weatherIconElement = document.getElementById("weather-icon");

            const iconMap = {
                "clear": "☀️",
                "clouds": "☁️",
                "rain": "🌧️",
                "drizzle": "🌦️",
                "thunderstorm": "⛈️",
                "snow": "❄️",
                "mist": "🌫️",
                "smoke": "💨",
                "haze": "🌫️"
            };

            // Icon update
            if (weatherIconElement) {
                weatherIconElement.innerText = iconMap[condition] || "🌡️";
            }
        })
        .catch(err => {
            alert(err.message);
        });
