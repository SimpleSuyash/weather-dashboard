const searchErrorMsgEl = document.getElementById("error");
const searchBtnEl = document.getElementById('search-btn');
const searchInputEl = document.getElementById('search-input');
const weatherContainerEl = document.getElementById("weather-container");
const citiesEl = document.getElementById('cities');
const forecastEl = document.getElementById('forecast-row');
let coordinates;

//limiting the place object's properties to name and geometry
//otherwise the place object has a long list of properties
const options = {fields:["name", "geometry"] };
//creating an autocomplete for google map places
let autocomplete = new google.maps.places.Autocomplete(searchInputEl, options);
autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        searchErrorMsgEl.innerHTML = `<p>No city is found for input:  ${place.name}</p>`;
        searchErrorMsgEl.hidden = false;
        setTimeout(() => searchErrorMsgEl.hidden = true, 3000);
        searchInputEl.value = "";
        return;
    }
    else {
        //when user selected the place shown in autocomplete
        //getting lattitude and longititude values
        const lat =  place.geometry.location.lat();
        const lng =  place.geometry.location.lng();
        //assigning the values to coordinates
        coordinates = {lat, lng};
    }
});

//handles the event when the list of cities in the search history is clicked
function clickCity(theEvent){
    let aPlace;
    const cityName = theEvent.target.innerText;
    const places = getPlacesFromStorage();
    places.forEach(place =>{
        //when city from the button matches to the localstorage item
        if( place.name === cityName){
             aPlace = place;
        }
    });
    //getting the location from the saved object
    coordinates = aPlace.geometry.location;
    //rendering the weather
    fetchWeather();
    coordinates = null;
}

//searched cities are rendered to the screen
function renderCities(places) {
    citiesEl.innerHTML ="";
    places.forEach(place => {
        if (places) {
            const city = place.name;
            cityButton = document.createElement("button");
            cityButton.innerText = city;
            //rendering the objects from list as the first child of citiesEl
            //so the latest serched item shown on top of the list
            citiesEl.insertAdjacentElement("afterbegin", cityButton);
        }
    });
    citiesEl.addEventListener("click", clickCity);
}

//gets the places from the storage
function getPlacesFromStorage(){
    let places = localStorage.getItem("places");
    if(places){
        places = JSON.parse(places);
    }else{
        places = [];
    }
    return places;
}

//saves the places to the storage
function savePlacesToStorage(places){
    console.log ("-----------------saving the following items to storage");
    places.forEach(place =>{
        console.log(place);
    });
    localStorage.setItem("places", JSON.stringify(places));
}

//handles the searched city saving function
function savePlace(place) {
    let places = getPlacesFromStorage();
    let placeExistAlready =false;
    //when there is nothing in the storage
    //just add the new city being searched
    if (places.length=== 0){
        places.push(place);
    } else {
        //when there are some cities already saved in the localstorage
        places.forEach(thePlace => {
            if (place.name === thePlace.name) {
                //when the city being searched is already in the localstorage
                //just change the order of the item in the list
                //push the city to the bottom of the list
                //as it is the recent one
                places = places.filter(aPlace => aPlace.name != place.name);
                places.push(place);
                placeExistAlready = true;
            } else {
                //do nothing
            }
        });
        //if the city being searched is not in the storage yet
        if(!placeExistAlready){
            places.push(place);
        }
    }
    //preventing the list from ever-growing
    //if the list is getting bigger than 7, delete the earliest item
    if(places.length >7){
        places.shift();
    }
    savePlacesToStorage(places);
    renderCities(places);
}

//dt from openweathermap is the unix time
//if you format with dayjs, the time is automatically converted to the user's local time
//so insteading of formatting it, we just getting the D/M/YYYY part from the utc date of the city
//so we can display the city's actual current date
function getFormattedDateString(date) {
    const newDate = new Date(date);
    const newDateString = `${newDate.getUTCDate()}/${newDate.getUTCMonth()}/${newDate.getUTCFullYear()}`;
    return newDateString;
}

//get unique forecast days out of all the timestamps
//summerizes 1 data for a day
function getForecastDays(data) {
    const fiveForecastDays = [];
    /*
    const forecastDays = [];
    //getting unique days out of the data which has 39 items, an item for every 3 hour
    //this method always extract the first forecast data of the day, which is midnight 12AM
    //regardless of the current time, forecast data is always of midnight
    const fiveForecastDays = data.list.filter(forecast => {
        const forecastDay = dayjs.unix(forecast.dt).format("(DD/MM/YYYY)");
        if (!forecastDays.includes(forecastDay)) {
            forecastDays.push(forecastDay);
            return forecastDays;
        }
    });
    //don't need the first day data
    fiveForecastDays.shift();
    */

    //the following algorithm gets data stamps which is same time as of current time for forecast days
    // data is 3 hours apart
    //so 3hrs * 8 is 24 hrs
    //getting every 8 interval data
   for (let i = 0; i < data.list.length; i++){
     if (i===7 || i === 15 || i === 23 ||  i === 31 || i === 39 ){
        fiveForecastDays.push(data.list[i]);
     }
   }
    console.log("----------------Gettng 5 day forecast")
    console.log(fiveForecastDays);
    return fiveForecastDays;
}

//showing 5 day forecast
function showForecastWeather(data) {

    const fiveForecastDays = getForecastDays(data);
    //wrapper for 5 day forecast
    const forecastContainerEl = document.createElement("div");
    const heading = "<h2 class='fw-bold'>5-Day Forecast:</h2>";
    //wrapper for forecast cards
    const forecastRowEl = document.createElement("div");
    forecastRowEl.className = "forecast-row";

    fiveForecastDays.forEach(forecastDay => {
        const forecastDate = dayjs.unix(forecastDay.dt + data.city.timezone);
        const forecastDateString = getFormattedDateString(forecastDate);
        const temp = forecastDay.main.temp;
        const humidity = forecastDay.main.humidity;
        const windSpeed = forecastDay.wind.speed;//unit is m/sec
        const formattedWindSpeed = (windSpeed * 3600 / 1000).toFixed(2);//unit km/h
        const windDeg = forecastDay.wind.deg;
        const weatherIcon = forecastDay.weather[0].icon;

        const forecastCardEl = document.createElement("div");
        forecastCardEl.className = "forecast-card";
        forecastCardEl.innerHTML = `
                <h3>${forecastDateString}</h3>
                <img src= "https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="weather icon">
                <p>Temp: ${temp}&degC</p>
                <p>Wind: Wind: ${formattedWindSpeed}KMH <i class="fa-solid fa-arrow-up" style="rotate: ${windDeg}deg" ></i></p>
                <p>Humidity: ${humidity}%</p>
            `;
        forecastRowEl.append(forecastCardEl);
    });
    forecastContainerEl.insertAdjacentHTML("afterbegin", heading);
    forecastContainerEl.append(forecastRowEl);
    weatherContainerEl.append(forecastContainerEl);
}

//fetching 5 day forecast weather
function fetchForecastWeather() {
    const url = "https://api.openweathermap.org/data/2.5/forecast?";
    const key = "5be9f109a7d5fab8bbaf3f512f90f09c";
    const requestUrl = `${url}lat=${coordinates.lat}&lon=${coordinates.lng}&units=metric&appid=${key}`;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("-----------------fetching 5 day forecast data");
            console.log(data);
            showForecastWeather(data);
            searchInputEl.value = "";
        })
        .catch(function (err) {
            console.log("Something went wrong!", err);
        });
}

//showing current weather
function showCurrentWeather(data) {

    //current utc/gmt time of the city
    const dateNow = dayjs.unix(data.dt + data.timezone);
    // const newDate = dayjs(dateNow).format("(DD/MM/YYYY)");
    // const newDate = `${dayjs(dateNow).get('D')}/${dayjs(dateNow).get('M')}/${dayjs(dateNow).get('y')}`;
    //shows in D/M/YYYY format
    const newDateString = getFormattedDateString(dateNow);

    const city = data.name;
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const formattedWindSpeed = (windSpeed * 3600 / 1000).toFixed(2);
    const windDeg = data.wind.deg;
    const weatherIcon = data.weather[0].icon;
    const currentWeatherEl = document.createElement("div");
    currentWeatherEl.className = "current-weather";
    currentWeatherEl.innerHTML = `
            <h2> ${city} (${newDateString}) <img src= "https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="weather icon"></h2> 
            <p>Temp: ${temp}&degC</p>
            <p>Wind: ${formattedWindSpeed}KMH <i class="fa-solid fa-arrow-up" style="rotate: ${windDeg}deg" ></i></p>
            <p>Humidity: ${humidity}%</p>
        `;
    weatherContainerEl.innerHTML = "";
    weatherContainerEl.append(currentWeatherEl);
}

//fetching current weather
function fetchCurrentWeather() {
    const url = "https://api.openweathermap.org/data/2.5/weather?";
    const key = "5be9f109a7d5fab8bbaf3f512f90f09c";
 
    if (coordinates) {
        const requestUrl = `${url}lat=${coordinates.lat}&lon=${coordinates.lng}&units=metric&appid=${key}`;
        fetch(requestUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log("-----------------fetching current weather data");
                console.log(data);
                showCurrentWeather(data);
                searchInputEl.value = "";
            })
            .catch(function (err) {
                console.log("Something went wrong!", err);
            });
    } else {
        //when user typed a city and that didn't show in google autocomplet but user still pressed search button
        searchErrorMsgEl.innerText = ` No city is found for input:  ${searchInputEl.value}`;
        searchErrorMsgEl.hidden = false;
        setTimeout(() => searchErrorMsgEl.hidden = true, 3000);
        searchInputEl.value = "";
    }
}

//fetching current and 5 day forecast weather
function fetchWeather() {
    fetchCurrentWeather();
    fetchForecastWeather();
}

//saves the  searched city 
function saveSearchedCity(){
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
        return
    }else{
        savePlace(place);
        //to prevent from saving places that didn't show in autoplace
        coordinates = null;
    }
    

}
//attaching event handlers
searchBtnEl.addEventListener("click", fetchWeather);
searchBtnEl.addEventListener("click", saveSearchedCity);

//when window starts this function runs
function init(){
    let places = getPlacesFromStorage();
    renderCities(places);
}
//calling init function after window initialization
window.init = init();


