/* =====================================================
   Configuration
===================================================== */
const apiKey = "2edd947945dbea9396251c76e8e7457a";
const BASE   = "https://api.openweathermap.org";
const ICON   = "https://openweathermap.org/img/wn/";

/* =====================================================
   Translations
===================================================== */
const translations = {
    en: {
        placeholder:   "Enter city name...",
        search:        "Search",
        locate:        "Use my location",
        humidity:      "Humidity",
        wind:          "Wind Speed",
        feels:         "Feels Like",
        updated:       "Last updated",
        loading:       "Loading...",
        cityNotFound:  "City not found!",
        enterCity:     "Please enter a city name!",
        networkError:  "Network error. Please check your connection.",
        geoNotSupported: "Your browser does not support location.",
        geoDenied:     "Location permission denied.",
        geoFailed:     "Could not get weather for your location.",
        gettingLocation: "Getting your location...",
        defaultCity:   "Mumbai",
        language:      "Language",
    },
    mr: {
        placeholder:   "शहराचे नाव टाका...",
        search:        "शोधा",
        locate:        "माझे स्थान वापरा",
        humidity:      "आर्द्रता",
        wind:          "वाऱ्याचा वेग",
        feels:         "जाणवते",
        updated:       "शेवटचे अपडेट",
        loading:       "लोड होत आहे...",
        cityNotFound:  "शहर सापडले नाही!",
        enterCity:     "कृपया शहराचे नाव टाका!",
        networkError:  "नेटवर्क त्रुटी. इंटरनेट तपासा.",
        geoNotSupported: "तुमचा ब्राउझर स्थान समर्थन करत नाही.",
        geoDenied:     "स्थान परवानगी नाकारली.",
        geoFailed:     "तुमच्या स्थानावरून हवामान मिळाले नाही.",
        gettingLocation: "तुमचे स्थान मिळवत आहे...",
        defaultCity:   "मुंबई",
        language:      "भाषा",
    },
    hi: {
        placeholder:   "शहर का नाम दर्ज करें...",
        search:        "खोजें",
        locate:        "मेरा स्थान उपयोग करें",
        humidity:      "आर्द्रता",
        wind:          "हवा की गति",
        feels:         "महसूस होता है",
        updated:       "अंतिम अपडेट",
        loading:       "लोड हो रहा है...",
        cityNotFound:  "शहर नहीं मिला!",
        enterCity:     "कृपया शहर का नाम दर्ज करें!",
        networkError:  "नेटवर्क त्रुटि. कृपया इंटरनेट जांचें.",
        geoNotSupported: "आपका ब्राउज़र स्थान समर्थन नहीं करता।",
        geoDenied:     "स्थान अनुमति अस्वीकार कर दी गई।",
        geoFailed:     "आपके स्थान का मौसम प्राप्त नहीं हुआ।",
        gettingLocation: "आपका स्थान प्राप्त किया जा रहा है...",
        defaultCity:   "दिल्ली",
        language:      "भाषा",
    }
};

/* Weather condition descriptions translation */
const weatherDesc = {
    en: {},  // use raw API description in English
    mr: {
        "clear sky":            "स्वच्छ आकाश",
        "few clouds":           "काही ढग",
        "scattered clouds":     "विखुरलेले ढग",
        "broken clouds":        "तुटलेले ढग",
        "overcast clouds":      "ढगाळ आकाश",
        "light rain":           "हलका पाऊस",
        "moderate rain":        "मध्यम पाऊस",
        "heavy intensity rain": "जोरदार पाऊस",
        "shower rain":          "सरींचा पाऊस",
        "rain":                 "पाऊस",
        "thunderstorm":         "वादळ",
        "snow":                 "बर्फ",
        "light snow":           "हलका बर्फ",
        "mist":                 "धुके",
        "fog":                  "धुके",
        "haze":                 "धुके",
        "smoke":                "धूर",
        "drizzle":              "रिमझिम",
        "light drizzle":        "हलकी रिमझिम",
    },
    hi: {
        "clear sky":            "साफ आसमान",
        "few clouds":           "कुछ बादल",
        "scattered clouds":     "बिखरे बादल",
        "broken clouds":        "टूटे बादल",
        "overcast clouds":      "घने बादल",
        "light rain":           "हल्की बारिश",
        "moderate rain":        "मध्यम बारिश",
        "heavy intensity rain": "तेज़ बारिश",
        "shower rain":          "बौछारें",
        "rain":                 "बारिश",
        "thunderstorm":         "आंधी-तूफान",
        "snow":                 "बर्फ",
        "light snow":           "हल्की बर्फ",
        "mist":                 "धुंध",
        "fog":                  "कोहरा",
        "haze":                 "धुंध",
        "smoke":                "धुआं",
        "drizzle":              "फुहार",
        "light drizzle":        "हल्की फुहार",
    }
};

/* =====================================================
   State
===================================================== */
let currentLang = localStorage.getItem("lang") || "en";
let lastData = null;       // last weather data (to re-render on language change)
let lastForecast = null;

/* =====================================================
   DOM
===================================================== */
const searchBox   = document.getElementById("cityInput");
const searchBtn   = document.getElementById("searchBtn");
const locBtn      = document.getElementById("locBtn");
const loader      = document.getElementById("loader");
const errorBox    = document.getElementById("error");
const weatherBox  = document.getElementById("weather");
const forecastBox = document.getElementById("forecast");
const recentBox   = document.getElementById("recent");
const langSelect  = document.getElementById("langSelect");

/* =====================================================
   i18n helpers
===================================================== */
function t(key) {
    return translations[currentLang][key] || translations.en[key] || key;
}
function translateDescription(desc) {
    if (currentLang === "en") return desc;
    const map = weatherDesc[currentLang];
    return map[desc.toLowerCase()] || desc;
}
function applyLanguage() {
    document.documentElement.lang = currentLang;

    // Static elements
    document.querySelectorAll("[data-i18n]").forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });

    // Placeholder & titles
    searchBox.placeholder = t("placeholder");
    searchBtn.title       = t("search");
    locBtn.title          = t("locate");

    // Re-render dynamic parts
    if (lastData) renderWeather(lastData);
    if (lastForecast) renderForecast(lastForecast);
}

/* =====================================================
   Helpers
===================================================== */
function showLoader(show) { loader.style.display = show ? "block" : "none"; }
function showError(msg) {
    errorBox.textContent = msg;
    errorBox.style.display = "block";
    clearTimeout(showError._t);
    showError._t = setTimeout(() => (errorBox.style.display = "none"), 3500);
}
function setBackground(main) {
    const map = {
        Clear: "clear", Clouds: "clouds", Rain: "rain", Drizzle: "rain",
        Snow: "snow", Thunderstorm: "thunder", Mist: "mist",
        Fog: "mist", Haze: "mist", Smoke: "mist",
    };
    document.body.className = map[main] || "default";
}
function formatTime(unix) {
    return new Date(unix * 1000).toLocaleTimeString([], {
        hour: "2-digit", minute: "2-digit",
    });
}
function dayName(dateStr) {
    const localeMap = { en: "en", mr: "mr-IN", hi: "hi-IN" };
    return new Date(dateStr).toLocaleDateString(localeMap[currentLang] || "en", { weekday: "short" });
}

/* =====================================================
   Recent searches
===================================================== */
function getRecent() {
    return JSON.parse(localStorage.getItem("recentCities") || "[]");
}
function addRecent(city) {
    if (!city) return;
    let list = getRecent().filter(c => c.toLowerCase() !== city.toLowerCase());
    list.unshift(city);
    list = list.slice(0, 5);
    localStorage.setItem("recentCities", JSON.stringify(list));
    renderRecent();
}
function renderRecent() {
    const list = getRecent();
    recentBox.innerHTML = "";
    list.forEach(city => {
        const btn = document.createElement("button");
        btn.textContent = city;
        btn.onclick = () => checkWeather(city);
        recentBox.appendChild(btn);
    });
}

/* =====================================================
   Weather API
===================================================== */
async function fetchByCity(city) {
    const [cur, fore] = await Promise.all([
        fetch(`${BASE}/data/2.5/weather?units=metric&q=${encodeURIComponent(city)}&appid=${apiKey}`),
        fetch(`${BASE}/data/2.5/forecast?units=metric&q=${encodeURIComponent(city)}&appid=${apiKey}`),
    ]);
    return { cur, fore };
}
async function fetchByCoords(lat, lon) {
    const [cur, fore] = await Promise.all([
        fetch(`${BASE}/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`),
        fetch(`${BASE}/data/2.5/forecast?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`),
    ]);
    return { cur, fore };
}

async function checkWeather(city) {
    if (!city || !city.trim()) {
        showError(t("enterCity"));
        return;
    }
    city = city.trim();
    weatherBox.style.display = "none";
    forecastBox.innerHTML = "";
    showLoader(true);

    try {
        const { cur, fore } = await fetchByCity(city);

        if (cur.status === 404) {
            showLoader(false);
            showError(t("cityNotFound"));
            return;
        }
        if (!cur.ok || !fore.ok) {
            showLoader(false);
            showError(t("networkError"));
            return;
        }

        const data     = await cur.json();
        const forecast = await fore.json();
        lastData = data;
        lastForecast = forecast;
        renderWeather(data);
        renderForecast(forecast);
        addRecent(data.name);

        showLoader(false);
        weatherBox.style.display = "block";
    } catch (err) {
        console.error(err);
        showLoader(false);
        showError(t("networkError"));
    }
}

async function loadByCoords(lat, lon) {
    showLoader(true);
    try {
        const { cur, fore } = await fetchByCoords(lat, lon);
        if (!cur.ok || !fore.ok) {
            showLoader(false);
            showError(t("geoFailed"));
            return;
        }
        const data     = await cur.json();
        const forecast = await fore.json();
        lastData = data;
        lastForecast = forecast;
        renderWeather(data);
        renderForecast(forecast);
        addRecent(data.name);
        showLoader(false);
        weatherBox.style.display = "block";
    } catch (err) {
        console.error(err);
        showLoader(false);
        showError(t("geoFailed"));
    }
}

/* =====================================================
   Rendering
===================================================== */
function renderWeather(data) {
    document.getElementById("city").innerText        = `${data.name}, ${data.sys.country}`;
    document.getElementById("temp").innerText        = Math.round(data.main.temp) + "°C";
    document.getElementById("description").innerText = translateDescription(data.weather[0].description);
    document.getElementById("humidity").innerText    = data.main.humidity + "%";
    document.getElementById("wind").innerText        = data.wind.speed + " km/h";
    document.getElementById("feels").innerText       = Math.round(data.main.feels_like) + "°C";
    document.getElementById("sunrise").innerText     = formatTime(data.sys.sunrise);
    document.getElementById("sunset").innerText      = formatTime(data.sys.sunset);
    document.getElementById("pressure").innerText    = data.main.pressure;

    document.getElementById("weatherIcon").src = `${ICON}${data.weather[0].icon}@4x.png`;

    document.getElementById("updated").innerText = new Date().toLocaleTimeString([], {
        hour: "2-digit", minute: "2-digit",
    });

    setBackground(data.weather[0].main);
}

function renderForecast(data) {
    forecastBox.innerHTML = "";

    const daily = {};
    data.list.forEach(item => {
        const day = item.dt_txt.split(" ")[0];
        if (!daily[day]) daily[day] = item;
        else if (item.dt_txt.includes("12:00:00")) daily[day] = item;
    });

    Object.values(daily).slice(0, 5).forEach(item => {
        const div = document.createElement("div");
        div.className = "day";
        div.innerHTML = `
            <div class="dname">${dayName(item.dt_txt)}</div>
            <img src="${ICON}${item.weather[0].icon}.png" alt="">
            <div class="dtemp">${Math.round(item.main.temp)}°C</div>
        `;
        forecastBox.appendChild(div);
    });
}

/* =====================================================
   Geolocation — accurate with reverse geocoding
===================================================== */
async function useMyLocation() {
    if (!navigator.geolocation) {
        showError(t("geoNotSupported"));
        return;
    }

    showLoader(true);
    errorBox.style.display = "none";

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            console.log("User coords:", lat, lon);

            try {
                // Fetch weather using exact coordinates (most accurate)
                await loadByCoords(lat, lon);

                // Reverse geocode for a nicer city name using OpenWeatherMap
                const rev = await fetch(
                    `${BASE}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
                );
                if (rev.ok) {
                    const arr = await rev.json();
                    if (arr.length) {
                        const place = arr[0];
                        const nice = [place.name, place.state, place.country].filter(Boolean).join(", ");
                        document.getElementById("city").innerText = nice;
                    }
                }
            } catch (err) {
                console.error(err);
                showLoader(false);
                showError(t("geoFailed"));
            }
        },
        (err) => {
            console.warn("Geo error:", err);
            showLoader(false);
            if (err.code === err.PERMISSION_DENIED) {
                showError(t("geoDenied"));
            } else {
                showError(t("geoFailed"));
            }
        },
        {
            enableHighAccuracy: true,   // use GPS if available
            timeout: 15000,             // 15s timeout
            maximumAge: 0               // always fresh location
        }
    );
}

/* =====================================================
   Events
===================================================== */
searchBtn.addEventListener("click", () => checkWeather(searchBox.value));
searchBox.addEventListener("keypress", e => {
    if (e.key === "Enter") checkWeather(searchBox.value);
});
locBtn.addEventListener("click", useMyLocation);

langSelect.addEventListener("change", (e) => {
    currentLang = e.target.value;
    localStorage.setItem("lang", currentLang);
    applyLanguage();
});

/* =====================================================
   Init
===================================================== */
langSelect.value = currentLang;
applyLanguage();
renderRecent();

const recent = getRecent();
if (recent.length) {
    checkWeather(recent[0]);
} else {
    checkWeather(t("defaultCity"));
}