const apiKey = "";

let currentUnit = "C"; // default
let currentData = null; // store latest weather

function getWeather() {

const city = document.getElementById("city").value.trim();

if (!city) {
alert("Please enter a city name");
return;
}

const url =
`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;

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


function updateWeather(data){

  currentData = data; // store data

  document.getElementById("name").innerText =
    data.location.name + ", " + data.location.country;

  let temp;

  if(currentUnit === "C"){
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
}

});



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
