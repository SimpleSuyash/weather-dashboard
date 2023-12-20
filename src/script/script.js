

async function initMap() {
    const searchErrorMsgEl = document.getElementById("error");
    const searchBtnEl= document.getElementById('search-btn');
    const searchInputEl = document.getElementById('search-input');
    const currentWeatherEl = document.getElementById('current-weather');
    const citiesEl = document.getElementById('cities');
    const forecastEl = document.getElementById('forecast-row');
    const key = "5be9f109a7d5fab8bbaf3f512f90f09c";
    let coordinates;
    let place;
   // https://jsfiddle.net/gh/get/library/pure/googlemaps/js-samples/tree/master/dist/samples/places-autocomplete/jsfiddle
    const options = {
        fields: ["formatted_address", "geometry", "name"],
        strictBounds: false,
      };
    const autocomplete = new google.maps.places.Autocomplete(searchInputEl, options);
    autocomplete.addListener("place_changed", () => {
        place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            searchInputEl.value="";
            searchErrorMsgEl.innerHTML =`No city is found for input: <span class="fst-italic text-danger"> ${place.name}</span>`;
            searchErrorMsgEl.hidden=false;
            setTimeout(() => searchErrorMsgEl.hidden=true, 3000);
            return;
          }
          else{
            coordinates = place.geometry.location;
          }
    });


    function showCurrentWeather(){
        const today = dayjs().format(` (D/M/YYYY)`);
        currentWeatherEl.innerHTML =`<h2 class="fw-bold">${place.name} ${today}<i></i></h2>`;
    }

                 // <h2 class="fw-bold">Sydney 19/12/2023<i></i></h2>
                //     <p>Temp: 76.62</p>
                //     <p>Wind: 8.43 MPH</p>
                //     <p>Humidity: 44%</p>

    function searchCity(){
        
        if(coordinates){
            
            const requestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat()}&lon=${coordinates.lng()}&appid=${key}`;
            fetch(requestUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);

                showCurrentWeather();

   
            })
            .catch(function (err) {
                console.log("Something went wrong!", err);
            });
        }else{}
        

    }

    searchBtnEl.addEventListener('click', searchCity);


}

 initMap();