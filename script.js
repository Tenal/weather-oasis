// app namespace object
const app = {};


// information to be used in api call
app.apiKey = `d84d7b910043f96e753abee2b52918d6`;
app.url = `https://api.openweathermap.org/data/2.5/weather?`;


// API call to Open Weather API to grab data from users input
app.getWeather = function (query) {
    $.ajax({
        url: `${app.url}q=${query}&appid=${app.apiKey}`,
        method: 'GET',
        dataType: 'json',
}).then((result) => {
    app.changeBackground(result);
    app.displayWeather(result);
});
}


// a method to get the users input value
app.getValue = function() {
    //listen for the submit
    $('form').on('submit', function(event) {
        // prevent default refresh
        event.preventDefault();

        // when a user has submitted an input, grab input and store it in a variable
        const selection = $('input[type=text]').val();

        // once input is stored in a variable, clear search query & uncheck toggle
        $('form').children('input').val('');
        $('input[type=checkbox]').prop('checked', false);

        // call above function
        app.getWeather(selection);
    });
}


// a method to display weather on the page
app.displayWeather = function(weather) {
    // converting temperature (between kelvin, degrees celsius & fahrenheit)
    const cel = (Math.round(weather.main.temp - 273) + '°C');
    const celFeelsLike = (Math.round(weather.main.feels_like - 273) + '°C');
    const celMax = (Math.round(weather.main.temp_max - 273) + '°C');
    const celMin = (Math.round(weather.main.temp_min - 273) + '°C');
    const fahr = (Math.round((weather.main.temp - 273) * 1.8 + 32) + '°F');
    const fahrFeelsLike = (Math.round((weather.main.feels_like - 273) * 1.8 + 32) + '°F');
    const fahrMax = (Math.round((weather.main.temp_max - 273) * 1.8 + 32) + '°F');
    const fahrMin = (Math.round((weather.main.temp_min - 273) * 1.8 + 32) + '°F');

    // converting wind speed (between miles/hr & km/hr)
    const windKm = (Math.round(weather.wind.speed * 1.6) + ' km/hr');
    const windMiles =  ((weather.wind.speed) + ' m/hr');

    // caching my selectors (note: I'm only caching selectors I use 3+ times)
    const $locationTemp = $('.location-temperature');
    const $locationWind = $('.location-wind')
    const $currentTemp = $('.today-average .temperature')
    const $maxTemp = $('.today-high .temperature')
    const $minTemp = $('.today-low .temperature')
    const $tomorrowTemp = $('.tomorrow-average .temperature')

    // display content in main container
    $('.location-name').text(`${weather.name}, ${weather.sys.country}`);
    $locationTemp.text(cel);
    $('.location-description').text(weather.weather[0].description);
    $('.location-humidity').text(`${weather.main.humidity}%`);
    $locationWind.text(windKm);

    // display content in bottom container
    $currentTemp.text(celFeelsLike);
    $('.today-average .description').text(weather.weather[0].description);
    $maxTemp.text(celMax);
    $('.today-high .description').text(weather.weather[0].description);
    $minTemp.text(celMin);
    $('.today-low .description').text(weather.weather[0].description);
    $tomorrowTemp.text(celMax);
    $('.tomorrow-average .description').text(weather.weather[0].description);

    // change between imperial and metric using the toggle
    $('label').on('change', 'input[type=checkbox]', function() {
        if ($locationTemp.text() === cel) {
            $locationTemp.text(fahr);
            $currentTemp.text(fahrFeelsLike);
            $maxTemp.text(fahrMax);
            $minTemp.text(fahrMin);
            $tomorrowTemp.text(fahrMax);
            $locationWind.text(windMiles);
        } else if ($locationTemp.text() === fahr) {
            $locationTemp.text(cel);
            $currentTemp.text(celFeelsLike);
            $maxTemp.text(celMax);
            $minTemp.text(celMin);
            $tomorrowTemp.text(celMax);
            $locationWind.text(windKm);
        }
    })
}


// a method to change the background image depending on the weather
app.changeBackground = function(result) {
    if(result.weather[0].main == "Clear") {
        $('.layout').css('background-image', 'url(./assets/sun.jpg)');
        $('.layout').css('background-position', 'top');
    } else if (result.weather[0].main == "Rain") {
        $('.layout').css('background-image', 'url(./assets/rain.jpg)');
        $('.layout').css('background-position', 'center');
    } else if (result.weather[0].main == "Clouds") {
        $('.layout').css('background-image', 'url(./assets/cloud.jpg)');
        $('.layout').css('background-position', 'center');
    } else if (result.weather[0].main == "Snow") {
        $('.layout').css('background-image', 'url(./assets/snow.jpg)');
    } else {
        $('.layout').css('background-image', 'url(./assets/neutral.jpg)');
    };
}


// app initialization 
app.init = function () {
    app.getValue();
    // upon initialization, display weather for Toronto 
    app.getWeather('toronto');
}


// document ready
$(function () {
    // once the DOM has loaded, initialize the app
    app.init();
});