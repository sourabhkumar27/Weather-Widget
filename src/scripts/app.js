const apiKey = "4a69650162d35a5bb96c64027b429ae2";
const baseURL = "https://api.openweathermap.org/data/2.5/";
const imgBaseURL = "https://openweathermap.org/img/wn/";
const currentConditions = document.querySelector('.current-conditions');
const forecast = document.querySelector('.forecast');

function getCurrentCondition(latitude, longitude) {    //obtain the current weather condition using location
    return fetch(`${baseURL}weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
        .then(Response => {
            return Response.json();
        })
}

function get5DaysForecast(latitude, longitude) {      //obtain 5 day forecast for that region 
    return fetch(`${baseURL}forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
        .then(Response => {
            return Response.json();
        })
}

navigator.geolocation.getCurrentPosition((position) => {      //obtain the user's current location
    getWeather(position.coords.latitude, position.coords.longitude);
});

function getWeather(latitude, longitude) {       //get current and forecast weather details for next 5 days of user's location
    getCurrentCondition(latitude, longitude)
        .then(json => {
            currentConditions.innerHTML = "";
            let icon = json.weather[0].icon;
            let temp = json.main.temp;
            let description = json.weather[0].description;
            insertCurrentConditionToHTML(icon, temp, description);

            get5DaysForecast(latitude, longitude)
                .then(json => {
                    let list = [];
                    while (json.list.length > 0) {
                        list.push(json.list.splice(0, 8));
                    }
                    forecast.innerHTML = "";

                    list.forEach(day => {
                        findPropertiesforEachDay(day);
                    });
                })
        })
}

function findPropertiesforEachDay(day) {     //find weather details for next 5 days 
    let date = new Date(day[4].dt_txt);
    let weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    let icon = day[5].weather[0].icon;
    let description = day[5].weather[0].description;
    let tempMin = [];
    let tempMax = [];

    day.forEach(hour => {
        tempMax.push(hour.main.temp_max);
        tempMin.push(hour.main.temp_min);
    });
    let high = Math.ceil(Math.max(...tempMax));
    let low = Math.ceil(Math.min(...tempMin));
    insertWeatherForcastToHTML(weekday, icon, description, high, low);
}

function insertCurrentConditionToHTML(icon, temperature, currentCondition) {       //display today's weather conditions on the screen
    currentConditions.insertAdjacentHTML('beforeend',
        `<h2>Current Conditions</h2>
      <img src="${imgBaseURL}${icon}@2x.png" />
      <div class="current">
        <div class="temp">${temperature}℃</div>
        <div class="condition">${currentCondition}</div>
      </div>
    `)
}

function insertWeatherForcastToHTML(weekday, icon, description, high, low) {       //display weather forcast details of next 5 days on the screen
    forecast.insertAdjacentHTML('beforeend',
        `<div class="day">
        <h3>${weekday}</h3>
        <img src="${imgBaseURL}${icon}@2x.png" />
        <div class="description">${description}</div>
        <div class="temp">
          <span class="high">${high}℃</span>/<span class="low">${low}℃</span>
        </div>
      </div>
  `)
}