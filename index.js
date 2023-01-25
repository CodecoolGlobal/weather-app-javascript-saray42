"use strict"

const apiAutocompPath = "http://api.weatherapi.com/v1/search.json";
const apiAutoCompKey = "7dec3eb1df3441718f3102729232401";

const apiWeatherPath = "http://api.weatherapi.com/v1/current.json";
const apiWeatherKey = "6f45d8fb0b634570a17115149232301";

const apiPexelsKey = "DrvSF3EywDucDNZEmt8maC5tjDBMBph4cj1kLUuSNElSgATCNwuBhlRR";
const apiPexelsPath = "https://api.pexels.com/v1/search?query=";

let cities = null;

let favCities = new Array;

let isChrome = navigator.userAgent.match(/chrome|chromium|crios/i);

const rootElement = document.querySelector("#root");

window.addEventListener("load", () => {
    const panelElement = document.createElement("div");
    panelElement.setAttribute("id", "panel");

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
    
    inputField.addEventListener("input", async () => {
        inputField.value = capitalizeFirstLetter(inputField.value);
        removeAllChildNodes(datalist);
        cities = [];
        if (inputField.value.length >= 3) {
            await autocomplete(inputField.value);

            let existingOpts = Array.from(document.querySelectorAll("option")).map(value => { return value.value });

            cities.map((city) => {
                if (!existingOpts.includes(city.name)) {
                    const option = document.createElement("option");
                    option.setAttribute("value", city.name);
                    datalist.appendChild(option);
                }
            });
        } else if (inputField.value === "" || inputField.value.length === 0) {
            mapFavCities();
        }
    });

    inputField.addEventListener("focus", () => {
        removeAllChildNodes(datalist);
        cities = [];
        if (inputField.value === "" || inputField.value.length === 0) {
            mapFavCities();
        }
    });

    inputField.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
            await citySearch(inputField.value);
            await picSearch(inputField.value);
            inputField.value = "";
            inputField.blur();
            return false;
        } else if (event.key === "Backspace" && inputField.value === "") {
            mapFavCities();
        }
    });

    favButton.addEventListener("click", () => {
        let checkForCity = cities.filter((city) => {
            return (city.name === inputField.value);
        });

        if (checkForCity.length === 1 && !favCities.includes(inputField.value)) {
            favCities.push(inputField.value);
        }
    });

    resetButton.addEventListener("click", () => {
        removeAllChildNodes(datalist);
        favCities = [];
    });

    const mapFavCities = () => {
        removeAllChildNodes(datalist);
        cities = [];
        if (inputField.value === "" || inputField.value.length === 0) {
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
    let windwosXp = document.querySelector("body").style.background = "url('./xp.jpg')";
    const fetchedData = await fetch(apiPexelsPath + input, {headers: {Authorization: apiPexelsKey}})
    const parsedData = await fetchedData.json();
    parsedData.error ? windwosXp : parsedData.photos.length === 0 ? windwosXp : displayCityPic(parsedData);
}

const displayError = (error) => {
    const panelElement = document.querySelector("#panel");

    removeAllChildNodes(panelElement);

    let errorMsg = document.createElement("p");
    errorMsg.innerText = error.error.message;

    panelElement.appendChild(errorMsg);    
}

const displayWeatherData = (parsedData) => {
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
            data: "Wind: " +parsedData.current.wind_kph + " km/h",
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
}

const displayCityPic = (obj) => {
    let randIndex = Math.floor(Math.random() * obj.photos.length);
    document.querySelector("body").style.background = `url(${obj.photos[randIndex].src.landscape})`;
}