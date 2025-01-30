const api = {
    base: "https://api.openweathermap.org/data/2.5/",
    key: "0d966f46bed2c854c473b5d438b08394",
};

let weather = {};
let mainClass = '';

const app_container = document.getElementById("app-container");
const weather_location = document.getElementById("location");
const date_element = document.getElementById("date");
const temperature_current = document.getElementById("temperature-current");
const temperature_max_min = document.getElementById("temperature-max-min");
const _weather = document.getElementById("weather");
const weather_desc = document.getElementById("weather-desc");

document.addEventListener("readystatechange", (e) => {
    if (e.target.readyState === "complete") {
        firstCall();
        addSearchListener();
    }
});

const addSearchListener = () => {
    let location_input = document.getElementById("location-input");
    const getWeatherBtn = document.getElementById("get-weather-btn");

    location_input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            getWeatherData(location_input.value);
        }
    });

    getWeatherBtn.addEventListener("click", () => {
        getWeatherData(location_input.value);
    });
};

const firstCall = () => {
    getCurrentLocationWeather(); 
};

const getWeatherData = (city) => {
    fetch(`${api.base}weather?q=${city}&units=metric&appid=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
            weather = { ...result };
            fill_data(weather);
        });
};

const fill_data = (weather) => {
    mainClass = weather.main.temp > 18 ? "hot" : "cold";
    app_container.className = mainClass;
    weather_location.textContent = `${weather.name}, ${weather.sys.country}`;
    temperature_current.textContent = `Current Temperature: ${Math.round(weather.main.temp)}°C`;
    temperature_max_min.textContent = `High: ${Math.round(weather.main.temp_max)}°C / Low: ${Math.round(weather.main.temp_min)}°C`;
    _weather.textContent = weather.weather[0].main;
    weather_desc.textContent = `${weather.weather[0].description}, Wind speed: ${weather.wind.speed} m/s`;
    date_element.textContent = datebuild(new Date());
};

const datebuild = (d) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString(undefined, options);
};

function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherDataByCoords(lat, lon);
            }
        );
    }
}

const getWeatherDataByCoords = (lat, lon) => {
    fetch(`${api.base}weather?lat=${lat}&lon=${lon}&units=metric&appid=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
            weather = { ...result };
            fill_data(weather);
        });
};