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
            searchErrorMsgEl.innerHTML =`No city is found for input: <span class="fst-italic text-danger"> ${place.name}</span>`;
            searchErrorMsgEl.hidden=false;
            setTimeout(() => searchErrorMsgEl.hidden=true, 3000);
            searchInputEl.value="";
            return;
            }
            else{
            coordinates = place.geometry.location;
            }
    });

    function showCurrentWeather(data){
        
        const dateNow = dayjs.unix(data.dt).format("(DD/MM/YYYY)");
        const city = data.name;
        const temp = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const windDeg = data.wind.deg;
        const weatherIcon = data.weather[0].icon;
        const currentWeatherEl = document.createElement("div");
        currentWeatherEl.className = "current-weather box-shadow";
        currentWeatherEl.innerHTML= `
            <h2> ${city} ${dateNow} <img src=https://openweathermap.org/img/wn/${weatherIcon}@2x.png></h2> 
            <p>Temp: ${temp}&degC</p>
            <p>Wind: ${windSpeed}KMH</p>
            <p>Humidity: ${humidity}%</p>
        `;
        weatherContainerEl.append(currentWeatherEl);
    }

    function fetchCurrentWeather(){
        const url= "https://api.openweathermap.org/data/2.5/weather?";
        // const url= "https://api.openweathermap.org/data/2.5/forecast?";
        const key = "5be9f109a7d5fab8bbaf3f512f90f09c";
        if(coordinates){
            const requestUrl = `${url}lat=${coordinates.lat()}&lon=${coordinates.lng()}&units=metric&appid=${key}`;
            // const requestUrl = `${url}q=Kathmandu&units=metric&appid=${key}`;
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
            searchErrorMsgEl.innerHTML =`No city is found for input: <span class="fst-italic text-danger"> ${searchInputEl.value}</span>`;
            searchErrorMsgEl.hidden=false;
            setTimeout(() => searchErrorMsgEl.hidden=true, 3000);
            searchInputEl.value="";
        }
    }
    function fetchWeather(){
        fetchCurrentWeather();
        // fetchForecastWeather();
    }
    searchBtnEl.addEventListener('click', fetchWeather);


