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

      document.getElementById("name").innerText =
        data.name + ", " + data.sys.country;

      document.getElementById("temp").innerText =
        Math.round(data.main.temp) + " °C";

      document.getElementById("condition").innerText =
        data.weather[0].description;

    })
    .catch(() => {
      alert("City not found");
    });

}