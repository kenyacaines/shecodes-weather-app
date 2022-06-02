function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
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

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
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
          <span class="weather-forecast-temperature-max" id="forecast-temp-max"> ${Math.round(
            forecastDay.temp.max
          )}° </span>
          <span class="weather-forecast-temperature-min" id="forecast-temp-min"> ${Math.round(
            forecastDay.temp.min
          )}° </span>
        </div>
      </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "fab4debfd3c1e84b570ae548b866f1b0";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

function getForecastMetric(coordinates) {
  let apiKey = "fab4debfd3c1e84b570ae548b866f1b0";
  let apiUrlMetric = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrlMetric).then(displayForecast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temp");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind-speed");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#weather-icon");

  fahrenheitTemperature = response.data.main.temp;
  windSpeedImperial = response.data.wind.speed;

  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].main;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(windSpeedImperial);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "fab4debfd3c1e84b570ae548b866f1b0";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(displayTemperature);
}

function searchMetric(city) {
  let apiKey = "fab4debfd3c1e84b570ae548b866f1b0";
  let apiUrlMetric = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrlMetric}&appid=${apiKey}`).then(getForecastMetric);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input").value;
  let h1 = document.querySelector("h1");
  h1.innerHTML = `${cityInputElement}`;
  
  search(cityInputElement);
}

function showPosition(position) {
  let apiKey = "fab4debfd3c1e84b570ae548b866f1b0";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial&appid=${apiKey}`;

  axios.get(apiUrl).then(displayTemperature);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

function displayCelsius(response) {
  response.preventDefault();
  let temperatureElement = document.querySelector("#temp");
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  let celsiusTemperature = ((fahrenheitTemperature - 32) * 5) / 9;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  windSpeedMetricElement.removeAttribute("style");
  windSpeedImperialElement.style.display = "none";
  let windElement = document.querySelector("#wind-speed");
  let windSpeedMetric = windSpeedImperial * 1.609344;
  windElement.innerHTML = Math.round(windSpeedMetric);

  let cityInputElement = document.querySelector("#city-input").value;
  let h1 = document.querySelector("h1");
  h1.innerHTML = `${cityInputElement}`;
  searchMetric(cityInputElement);
}

function displayFahrenheit(response) {
  response.preventDefault();
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temp");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);

  windSpeedImperialElement.removeAttribute("style");
  windSpeedMetricElement.style.display = "none";
  let windElement = document.querySelector("#wind-speed");
  windElement.innerHTML = Math.round(windSpeedImperial);
}

let fahrenheitTemperature = null;
let windSpeedImperial = null;

let windSpeedMetricElement = document.querySelector("#wind-metric");
let windSpeedImperialElement = document.querySelector("#wind-imperial");

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", getCurrentPosition);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", displayCelsius);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheit);
