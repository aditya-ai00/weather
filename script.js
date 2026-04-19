function getWeather() {

const city = document.getElementById("city").value.trim();

if (!city) {
alert("Please enter a city name");
return;
}

const apiKey = config.WEATHER_API_KEY;

const url =
`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

fetch(url)
.then(res => res.json())
.then(data => {

if (data.error) {
alert(data.error.message);
return;
}

document.getElementById("name").innerText =
data.location.name + ", " + data.location.country;

document.getElementById("temp").innerText =
Math.round(data.current.temp_c) + " °C";

document.getElementById("condition").innerText =
data.current.condition.text;

document.getElementById("icon").src =
"https:" + data.current.condition.icon;

});
}