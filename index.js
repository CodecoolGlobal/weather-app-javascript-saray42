"use strict"

const key = "7dec3eb1df3441718f3102729232401";
let apiAutocomplete = `http://api.weatherapi.com/v1/search.json?key=${key}&q=`;

const apiWeatherPath = "http://api.weatherapi.com/v1/current.json"
const apiWeatherKey = "6f45d8fb0b634570a17115149232301";

let cities = null;

let favCities = new Array;

let chosenCity;

let isChrome = navigator.userAgent.match(/chrome|chromium|crios/i);

const rootElement = document.querySelector("#root");

window.addEventListener("load", () => {
    const panelElement = document.createElement("div");
    panelElement.setAttribute("id", "panel");

    const inputCity = document.createElement("input");
    inputCity.setAttribute("id", "input-city");
    inputCity.setAttribute("type", "text");
    inputCity.setAttribute("placeholder", "input city");

    const favButton = document.createElement("button");
    favButton.setAttribute("type", "button");
    favButton.innerText = "Favourite";

    const resetButton = document.createElement("button");
    resetButton.setAttribute("type", "button");
    resetButton.innerText = "Reset";

    const inputDiv = document.createElement("div");

    inputDiv.appendChild(inputCity);
    inputDiv.appendChild(favButton);
    inputDiv.appendChild(resetButton);

    const datalist = document.createElement("datalist");
    datalist.setAttribute("id", "city-list");

    rootElement.insertAdjacentElement("beforeend", datalist);
    rootElement.insertAdjacentElement("afterbegin", inputDiv);
    rootElement.insertAdjacentElement("afterbegin", panelElement);
    
    inputCity.addEventListener("input", async () => {
        inputCity.value = capitalizeFirstLetter(inputCity.value);
        removeAllChildNodes(datalist);
        if (inputCity.value.length >= 3) {
            await apiSearch(inputCity.value);
            inputCity.setAttribute("list", "city-list");

            cities.map((city) => {
                const option = document.createElement("option");
                option.setAttribute("value", city.name);
                datalist.appendChild(option);
            });
        } else {
            favCities.map((favCity) => {
                const option = document.createElement("option");
                option.setAttribute("value", favCity);
                isChrome ? option.setAttribute("label", "Favourite") : option.setAttribute("label", "* " + favCity);
                datalist.appendChild(option);
            });
        }
    });

    inputCity.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            chosenCity = inputCity.value;
            fetch(`${apiWeatherPath}?key=${apiWeatherKey}&q=${chosenCity}&aqi=no`)
                .then(data => data.json())
                .then(parsedData => displayWeatherData(parsedData))
            inputCity.value = "";
            inputCity.blur();
            return false;
        }
    });

    favButton.addEventListener("click", () => {
        let checkForCity = cities.filter((city) => {
            return (city.name === inputCity.value);
        });

        if (checkForCity.length === 1 && !favCities.includes(inputCity.value)) {
            favCities.push(inputCity.value);
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

const apiSearch = async (input) => {
    const fetchedData = await fetch(apiAutocomplete + input);
    const parsedData = await fetchedData.json();
    cities = await parsedData;
}

function displayWeatherData(parsedData) {
    console.log(parsedData.current.temp_c);
    console.log(parsedData.current.condition.text);
    console.log(parsedData.current.wind_kph);
    console.log(parsedData.current.humidity)
}