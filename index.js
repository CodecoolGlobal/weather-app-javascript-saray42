"use strict"

let codecoolweather = null;

const apiAutocompPath = "http://api.weatherapi.com/v1/search.json";
const apiAutoCompKey = "7dec3eb1df3441718f3102729232401";

const apiWeatherPath = "http://api.weatherapi.com/v1/current.json";
const apiWeatherKey = "6f45d8fb0b634570a17115149232301";

const apiPexelsKey = "DrvSF3EywDucDNZEmt8maC5tjDBMBph4cj1kLUuSNElSgATCNwuBhlRR";
const apiPexelsPath = "https://api.pexels.com/v1/search?query=";

let cities = new Array;

let favCities = new Array;

let isChrome = navigator.userAgent.match(/chrome|chromium|crios/i);

const rootElement = document.querySelector("#root");

window.addEventListener("load", () => {
    fetch("./codecoolweather.json")
    .then((res) => res.json())
    .then((data) => {
        codecoolweather = data;
    });
    
    const panelElement = document.createElement("div");
    panelElement.setAttribute("id", "panel");

    const loader = document.createElement("div");
    const happySun = document.createElement("img");
    loader.setAttribute("id", "loader");
    happySun.setAttribute("id", "happy-sun");
    happySun.setAttribute("src", "./happy_sunCC.png");
    loader.setAttribute("style", "display: none");
    loader.appendChild(happySun);

    const inputField = document.createElement("input");
    inputField.setAttribute("id", "input-field");
    inputField.setAttribute("type", "text");
    inputField.setAttribute("placeholder", "input city");
    inputField.setAttribute("list", "city-list");

    const favButton = document.createElement("button");
    favButton.setAttribute("type", "button");
    favButton.setAttribute("id", "favButton");
    favButton.innerText = "Favourite";

    const resetButton = document.createElement("button");
    resetButton.setAttribute("type", "button");
    favButton.setAttribute("id", "resButton");
    resetButton.innerText = "Reset";

    const inputDiv = document.createElement("div");
    inputDiv.setAttribute("id", "input-div");

    inputDiv.appendChild(inputField);
    inputDiv.appendChild(favButton);
    inputDiv.appendChild(resetButton);

    const datalist = document.createElement("datalist");
    datalist.setAttribute("id", "city-list");

    
    rootElement.insertAdjacentElement("beforeend", datalist);
    rootElement.insertAdjacentElement("afterbegin", inputDiv);
    rootElement.insertAdjacentElement("afterbegin", panelElement);
    document.querySelector("body").insertAdjacentElement("afterbegin", loader);
    
    inputField.addEventListener("input", async () => {
        inputField.value = capitalizeFirstLetter(inputField.value);
        removeAllChildNodes(datalist);
        cities = [];
        if (inputField.value.length >= 3) {
            await autocomplete(inputField.value);
            removeAllChildNodes(datalist);

            cities.map((city) => {        
                const option = document.createElement("option");
                option.setAttribute("value", city.name);
                datalist.appendChild(option);
            });
        } else if (inputField.value.length === 0) {
            mapFavCities();
        }
    });

    inputField.addEventListener("focus", () => {
        removeAllChildNodes(datalist);
        cities = [];
        if (inputField.value.length === 0) {
            mapFavCities();
        }
    });

    inputField.addEventListener("keydown", async (event) => {
        if (event.key === "Enter" && inputField.value === "Codecool") {
            document.querySelector("#loader").setAttribute("style", "display: grid !important");
            await displayWeatherData(codecoolweather);
            inputField.value = "";
            inputField.blur();
            return false;
        } else if (event.key === "Enter" && inputField.value.length > 0) {
            document.querySelector("#loader").setAttribute("style", "display: grid !important");
            await citySearch(inputField.value);
            inputField.value = "";
            inputField.blur();
            return false;
        } else if (event.key === "Backspace" && inputField.value.length === 0) {
            mapFavCities();
        }
    });

    favButton.addEventListener("click", () => {
        cities.filter((city) => {
            if (city.name === inputField.value && !favCities.includes(inputField.value))  {
                favCities.push(city.name)
            };
        });
    });

    resetButton.addEventListener("click", () => {
        removeAllChildNodes(datalist);
        favCities = [];
    });

    const mapFavCities = () => {
        removeAllChildNodes(datalist);
        cities = [];
        if (inputField.value.length === 0) {
            favCities.map((favCity) => {
                const option = document.createElement("option");
                option.setAttribute("value", favCity);
                isChrome ? option.setAttribute("label", "Favourite") : option.setAttribute("label", "Fav | " + favCity);
                datalist.appendChild(option);
            });
        }
    }
});

const removeAllChildNodes = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

const autocomplete = async (input) => {
    const fetchedData = await fetch(apiAutocompPath + "?key=" + apiAutoCompKey + "&q=" + input);
    const parsedData = await fetchedData.json();
    cities = await parsedData;
}

const citySearch = async (input) => {
    const fetchedData = await fetch(apiWeatherPath + "?key=" + apiWeatherKey + "&q=" + input);
    const parsedData = await fetchedData.json();
    parsedData.error ? displayError(parsedData) : displayWeatherData(parsedData);
}

const picSearch = async (input) => {
    let windwosXp = document.querySelector("body").style.setProperty("background", "url('./xp.jpg') center center");
    const fetchedData = await fetch(apiPexelsPath + input, {headers: {Authorization: apiPexelsKey}})
    const parsedData = await fetchedData.json();
    parsedData.error ? windwosXp : parsedData.photos.length === 0 ? windwosXp : displayCityPic(parsedData);
    setTimeout(() => {
        document.querySelector("#loader").setAttribute("style", "display: none !important");
    }, 5000);
}

const displayCityPic = (obj) => {
    const randIndex = Math.round(Math.random() * (obj.photos.length - 1));
    const body = document.querySelector("body");
    body.style.setProperty("background", `url(${obj.photos[randIndex].src.landscape}) no-repeat`);
    body.style.setProperty("background-size", "cover");
    body.style.setProperty("background-position", "center center");
}

const displayError = (error) => {
    document.querySelector("body").style.setProperty("background", "url('./xp.jpg') center center");
    const panelElement = document.querySelector("#panel");

    removeAllChildNodes(panelElement);

    let errorMsg = document.createElement("p");
    errorMsg.innerText = error.error.message;

    panelElement.appendChild(errorMsg);
    setTimeout(() => {
        document.querySelector("#loader").setAttribute("style", "display: none !important");
    }, 5000); 
}

const displayWeatherData = async (parsedData) => {
    let weatherElements = [
        {
            id: "city",
            data: parsedData.location.name + ", " + parsedData.location.country,
            type: "text"
        },
        {
            id: "local-time",
            data: "Localtime: " + parsedData.location.localtime,
            type: "text"
        },
        {
            id: "temp-c",
            data: parsedData.current.temp_c + "°C " + parsedData.current.condition.text,
            type: "text"
        },
        {
            id: "wind-speed",
            data: "Wind: " + parsedData.current.wind_kph + " km/h",
            type: "text"
        },
        {
            id: "humidity",
            data: "Humidity: " + parsedData.current.humidity + "%",
            type: "text"
        },
        {
            id: "condition-icon",
            data: parsedData.current.condition.icon,
            type: "img"
        }
    ];

    const panelElement = document.querySelector("#panel");

    removeAllChildNodes(panelElement);

    weatherElements.map((element) => {
        let weatherInfo = null;
        if (element.type === "text") {
            weatherInfo = document.createElement("p");
            weatherInfo.innerText = element.data;
        } else {
            weatherInfo = document.createElement("img");
            weatherInfo.setAttribute("src", element.data)
        }
        weatherInfo.setAttribute("id", element.id);
        panelElement.appendChild(weatherInfo);
    });

    await picSearch(parsedData.location.name);
}