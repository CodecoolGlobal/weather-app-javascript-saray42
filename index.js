"use strict"

const apiAutocompPath = "http://api.weatherapi.com/v1/search.json";
const apiAutoCompKey = "7dec3eb1df3441718f3102729232401";

const apiWeatherPath = "http://api.weatherapi.com/v1/current.json"
const apiWeatherKey = "6f45d8fb0b634570a17115149232301";

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
            await apiAutocomplete(inputField.value);

            cities.map((city) => {
                const option = document.createElement("option");
                option.setAttribute("value", city.name);
                datalist.appendChild(option);
            });
        } else if (inputField.value === "" || inputField.value.length === 0) {
            favCities.map((favCity) => {
                const option = document.createElement("option");
                option.setAttribute("value", favCity);
                isChrome ? option.setAttribute("label", "Favourite") : option.setAttribute("label", "* " + favCity);
                datalist.appendChild(option);
            });
        }
    });

    inputField.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
            await apiCitySearch(inputField.value);
            inputField.value = "";
            inputField.blur();
            return false;
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
});

const removeAllChildNodes = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

const apiAutocomplete = async (input) => {
    const fetchedData = await fetch(apiAutocompPath + "?key=" + apiAutoCompKey + "&q=" + input);
    const parsedData = await fetchedData.json();
    cities = await parsedData;
}

const apiCitySearch = async (input) => {
    try {
        const fetchedData = await fetch(apiWeatherPath + "?key=" + apiWeatherKey + "&q=" + input);
        const parsedData = await fetchedData.json();
        displayWeatherData(parsedData);
    } catch (error) {
        if (error) console.log(error);
    }
}

function displayWeatherData(parsedData) {
    console.log(parsedData.current.temp_c);
    console.log(parsedData.current.condition.text);
    console.log(parsedData.current.wind_kph);
    console.log(parsedData.current.humidity);

    const panelElement = document.querySelector("#panel");

    const cityHeadline = document.createElement("h1");
    cityHeadline.innerHTML = parsedData.location.name + ", " + parsedData.location.country;

    const tempElement = document.createElement("p");
    tempElement.innerHTML = `${parsedData.current.temp_c}°C`;

    panelElement.insertAdjacentElement("beforeend", cityHeadline)
    panelElement.insertAdjacentElement("beforeend", tempElement);
}