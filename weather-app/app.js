const apiKey = "2edd947945dbea9396251c76e8e7457a";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherIcon = document.querySelector(".weather");

async function checkWeather(city) {
    if(!city) return alert("कृपया शहराचे नाव टाका!");

    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status === 404) {
        alert("शहर सापडले नाही!");
        return;
    }

    const data = await response.json();

    document.querySelector(".city").innerText = data.name;
    document.querySelector(".temp").innerText = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerText = data.main.humidity + "%";
    document.querySelector(".wind").innerText = data.wind.speed + " km/h";
    document.querySelector(".description").innerText = data.weather[0].description;

    document.querySelector(".weather").style.display = "block";
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});