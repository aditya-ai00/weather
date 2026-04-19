const apiKey = "f0133e94263d448c963164120261904";


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

document.getElementById("name").innerText =
data.location.name + ", " + data.location.country;

document.getElementById("temp").innerText =
Math.round(data.current.temp_c) + " °C";

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