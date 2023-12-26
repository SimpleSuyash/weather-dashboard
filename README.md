# Weather Dashboard 
The Weather Dashboard is an application where the current and 5 day forecast weather of any city in the world can be viewed.

![image](/asset/image/screenshot1.png)

## Description
This application lets user search a city to view its current and next five days forecast weather. The [*Google Autocomplete Search*](https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete) feature is used to help get a city when an user type in an input box to search for a city. 
![image](/asset/image/autocomplete.png)
The user input for the city is validated against certain criteria. As soon as the user starts to type in the input box, the Google shows the suggested or matched cities. The user has to select one of the suggested values, and click the *Search* button to view the weather. The weather data is fetched through the *OpenWeatherMap* APIs. For current weather, the [*Current Weather Data*](https://openweathermap.org/current) API is used. And, for the five day forecast weather, [*the 5 day / 3 Hour Forecast*](https://openweathermap.org/forecast5) is used.


The application displays following weather variables:
- City name
- Current date and the next five days' date 
- Temperature in °C
- Wind in KMH
- Wind direction in ° (arrow pointing to the corresponding angle)
- Humidity in %
- Weather Icon

When a city's weather is displayed, the application also saves the city's data to the localstorage, and the city is added to the list of recently searched cities displayed as buttons for quick retrieval of weather data. Once the city is added, to view its weather, all the user has to do is click the city button.
![image](/asset/image/firstcity.png)

The list is limited to 7 items or cities maximum. So it only holds the latest 7 searched cities. 
![image](/asset/image/allcities.png)


This application was created as a coding challenge assignment while doing a coding bootcamp at the University of Sydney in 2023. The following user story and acceptance criteria demonstrate its requirements:
### User Story
    AS A traveler
    I WANT to see the weather outlook for multiple cities
    SO THAT I can plan a trip accordingly
### Acceptance Criteria
    GIVEN a weather dashboard with form inputs
    WHEN I search for a city
    THEN I am presented with current and future conditions for that city and that city is added to the
    search history
    WHEN I view current weather conditions for that city
    THEN I am presented with the city name, the date, an icon representation of weather conditions, the
    temperature, the humidity, and the the wind speed
    WHEN I view future weather conditions for that city
    THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather
    conditions, the temperature, the wind speed, and the humidity
    WHEN I click on a city in the search history
    THEN I am again presented with current and future conditions for that city

## Features of the application
- *JavaScript* for dynamically creating dom elements
- *CSS* for styling 
- *DayJS* for date and time calculation
- *Google Fonts* for text
- *Fonts Awesome* for icons
- Responsive design

## Caution
The ***dt*** time you see in data from the OpenWeatherMap is a Unix timestamp ( 10 digits, seconds since the Unix Epoch, which is Thu, 1 Jan, 1970 00:00:00 UT). So to get the current time of the city being searched, ***dt*** and ***timezone*** need to be added and converted to date and time. If you format thus obtained date and time using dayjs, it will automatically convert the date and time to your local date and time, so refrain from using the format method of dayjs.

During the process of developing this application, I came to realize that the Localstorage is only used to save data which is safe to convert into string. If you store an object in the storage, during the stringify, the object may lose its state, i.e, the object's functions may not be correctly parsed back. This application saves an object in the Localstorage. But, you may wish to save the object data instead.

## Background Image
The background image is used from [Picsum](https://picsum.photos/id/296/3072/2048 )

## Link to the deployed application
[Link to deployed Weather Dashboard application](https://simplesuyash.github.io/weather-dashboard/)

  
