dayjs.extend(window.dayjs_plugin_advancedFormat);
dayjs.extend(window.dayjs_plugin_utc);


    const searchErrorMsgEl = document.getElementById("error");
    const searchBtnEl= document.getElementById('search-btn');
    const searchInputEl = document.getElementById('search-input');
    const weatherContainerEl = document.getElementById("weather-container");
    const citiesEl = document.getElementById('cities');
    const forecastEl = document.getElementById('forecast-row');
    let coordinates;
    
   // https://jsfiddle.net/gh/get/library/pure/googlemaps/js-samples/tree/master/dist/samples/places-autocomplete/jsfiddle

    const autocomplete = new google.maps.places.Autocomplete(searchInputEl);
    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            searchErrorMsgEl.innerHTML =`<p>No city is found for input:  ${place.name}</p>`;
            searchErrorMsgEl.hidden=false;
            setTimeout(() => searchErrorMsgEl.hidden=true, 3000);
            searchInputEl.value="";
            return;
            }
            else{
            coordinates = place.geometry.location;
            }
    });
    function getFormattedDateString(date){
        const newDate = new Date(date);
        const newDateString = `${newDate.getUTCDate()}/${newDate.getUTCMonth()}/${newDate.getUTCFullYear()}`;
        return newDateString;
    }

    function getForecastDays(data){
        const forecastDays = [];
        const fiveForecastDays = data.list.filter(forecast => {
            const forecastDay = dayjs.unix(forecast.dt).format("(DD/MM/YYYY)");
            if(!forecastDays.includes(forecastDay)){
                forecastDays.push(forecastDay);
                return forecastDays;
            }
        });
        fiveForecastDays.shift();
        console.log(fiveForecastDays);
        return fiveForecastDays;
    }
    function showForecastWeather(data){
        
        const fiveForecastDays = getForecastDays(data);
        const forecastContainerEl = document.createElement("div");
        const heading = "<h2 class='fw-bold'>5-Day Forecast:</h2>";
        const forecastRowEl = document.createElement("div");
        forecastRowEl.className = "forecast-row";

        fiveForecastDays.forEach(forecastDay => {
            const forecastDate = dayjs.unix(forecastDay.dt + data.city.timezone);
            const forecastDateString = getFormattedDateString(forecastDate);
            const temp = forecastDay.main.temp;
            const humidity = forecastDay.main.humidity;
            const windSpeed = forecastDay.wind.speed;
            const windDeg = forecastDay.wind.deg;
            const weatherIcon = forecastDay.weather[0].icon;

            const forecastCardEl = document.createElement("div");
            forecastCardEl.className = "forecast-card";
            forecastCardEl.innerHTML= `
                <h3>${forecastDateString}</h3>
                <img src= "https://openweathermap.org/img/wn/${weatherIcon}@2x.png">
                <p>Temp: ${temp}&degC</p>
                <p>Wind: Wind: ${windSpeed}KMH <i class="fa-solid fa-arrow-up" style="rotate: ${windDeg}deg" ></i></p>
                <p>Humidity: ${humidity}%</p>
            `;
            forecastRowEl.append(forecastCardEl);
        });
        forecastContainerEl.insertAdjacentHTML("afterbegin", heading);
        forecastContainerEl.append(forecastRowEl);
        weatherContainerEl.append(forecastContainerEl);
    }

    function fetchForecastWeather(){
        const url= "https://api.openweathermap.org/data/2.5/forecast?";
        const key = "5be9f109a7d5fab8bbaf3f512f90f09c";
        
        const requestUrl = `${url}lat=${coordinates.lat()}&lon=${coordinates.lng()}&units=metric&appid=${key}`;
        fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            showForecastWeather(data);
            searchInputEl.value ="";
        })
        .catch(function (err) {
            console.log("Something went wrong!", err);
        });
    }

    function showCurrentWeather(data){
        
        const dateNow = dayjs.unix(data.dt + data.timezone);
        // const newDate = dayjs(dateNow).format("(DD/MM/YYYY)");
        // const newDate = `${dayjs(dateNow).get('D')}/${dayjs(dateNow).get('M')}/${dayjs(dateNow).get('y')}`;
        const newDateString = getFormattedDateString(dateNow);

        const city = data.name;
        const temp = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const windDeg = data.wind.deg;
        const weatherIcon = data.weather[0].icon;
        const currentWeatherEl = document.createElement("div");
        currentWeatherEl.className = "current-weather";
        currentWeatherEl.innerHTML= `
            <h2> ${city} (${newDateString}) <img src= "https://openweathermap.org/img/wn/${weatherIcon}@2x.png"></h2> 
            <p>Temp: ${temp}&degC</p>
            <p>Wind: ${windSpeed}KMH <i class="fa-solid fa-arrow-up" style="rotate: ${windDeg}deg" ></i></p>
            <p>Humidity: ${humidity}%</p>
        `;
        weatherContainerEl.innerHTML ="";
        weatherContainerEl.append(currentWeatherEl);
    }

    function fetchCurrentWeather(){
        const url= "https://api.openweathermap.org/data/2.5/weather?";
        const key = "5be9f109a7d5fab8bbaf3f512f90f09c";
        if(coordinates){
            const requestUrl = `${url}lat=${coordinates.lat()}&lon=${coordinates.lng()}&units=metric&appid=${key}`;
            fetch(requestUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                showCurrentWeather(data);
                searchInputEl.value ="";
            })
            .catch(function (err) {
                console.log("Something went wrong!", err);
            });
        }else{
            //when user typed a city and that didn't show in google autocomplet but user still pressed search button
            searchErrorMsgEl.innerHTML =`<p> No city is found for input:  ${searchInputEl.value}</p>`;
            searchErrorMsgEl.hidden=false;
            setTimeout(() => searchErrorMsgEl.hidden=true, 3000);
            searchInputEl.value="";
        }
    }
    function fetchWeather(){
        fetchCurrentWeather();
        fetchForecastWeather();
    }
    searchBtnEl.addEventListener('click', fetchWeather);


