function formatDate(timestamp) {
  let date = new Date(timestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let currentDay = days[date.getDay()];
  let currentDate = [date.getDate()];
  let currentMonth = months[date.getMonth()];

  return `${currentDay}, ${currentMonth}, ${currentDate}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row forecast-row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="col daily-weather-forecast">
              <div class="weather-forecast-date">${formatDay(
                forecastDay.dt
              )}</div>
                <img src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png" 
                    alt= "${forecastDay.weather[0].description}" 
                    id="forecast-icons" 
                    width="42"/>
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max" id="forecast-temp-max">${Math.round(
            forecastDay.temp.max
          )}° </span>/
          <span class="weather-forecast-temperature-min" id="forecast-temp-min">${Math.round(
            forecastDay.temp.min
          )}°</span>
        </div>
      </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function displayUVIndex(response) {
  let uviElement = document.querySelector("#uv-index");
  uviElement.innerHTML = Math.round(response.data.current.uvi);
}

function getCoords(coordinates) {
  let apiKey = "fab4debfd3c1e84b570ae548b866f1b0";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayUVIndex);
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temp");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind-speed");
  let feelsLikeElement = document.querySelector("#feels-like");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#weather-icon");

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].main;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  getCoords(response.data.coord);
}

function search(city) {
  let apiKey = "fab4debfd3c1e84b570ae548b866f1b0";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input").value;
  let h1 = document.querySelector("h1");
  h1.innerHTML = `${cityInputElement}`;

  search(cityInputElement);

  document.querySelector("#city-input").value = "";
}

function showPosition(position) {
  let apiKey = "fab4debfd3c1e84b570ae548b866f1b0";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial&appid=${apiKey}`;

  axios.get(apiUrl).then(displayTemperature);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let currentLocation = document.querySelector("#current-location-button");
currentLocation.addEventListener("click", getCurrentPosition);

search("Austin");
