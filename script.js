const apiKey = "f0133e94263d448c963164120261904";

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
getForecast(e.target.value); // fetch forecast for entered city
}

});



navigator.geolocation.getCurrentPosition(showPosition);

function showPosition(position){

const lat = position.coords.latitude;
const lon = position.coords.longitude;

 const query = `${lat},${lon}`;

const url =
`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

fetch(url)
.then(res => res.json())
.then(data => {

updateWeather(data);
getForecast(query); // fetch forecast for current location
});

}

function updateForecast(data){
  const forecastContainer = document.getElementById("forecast-conatanir");
  forecastContainer.innerHTML = ""; // clear previous
  forecastContainer.innerHTML = "<h3>Up Coming Day Forecast</h3>"; // add header
  data.forecast.forecastday.forEach((day , index) => {
        const card = document.createElement("div");
        card.className = "forecast-card";
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        
        let temp;

       if(currentUnit === "C"){
          temp = Math.round(data.current.temp_c) + " °C";
       } else {
          temp = Math.round(data.current.temp_f) + " °F";
       }

        card.innerHTML = `
          <h4 class="text-black text-lg font-bold">${dayName}</h4>
          <p class="text-black text-sm">${day.date}</p>
          <img src="${day.day.condition.icon}" />
           <p class="text-black text-sm">  ${temp} - ${day.day.avgtemp_c}°C</p>
       
        `;
        forecastContainer.appendChild(card);
  });
}


function getForecast(query) {
  const url =`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(query)}&days=5`;

  fetch(url)
  .then(res => res.json())
  .then(data => {
    // Process and display forecast data
    console.log(data);
    updateForecast(data);
  })
  .catch(() => {
    alert("Failed to fetch forecast data");
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

