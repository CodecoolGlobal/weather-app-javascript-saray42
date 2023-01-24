"use strict"

const key = "7dec3eb1df3441718f3102729232401";
let apiAutocomplete = `http://api.weatherapi.com/v1/search.json?key=${key}&q=`;

let cities = null;

let favCities = new Array;

let isChrome = navigator.userAgent.match(/chrome|chromium|crios/i);

const rootElement = document.querySelector("#root");

window.addEventListener("load", () => {
    const inputCity = document.createElement("input");
    inputCity.setAttribute("id", "input-city");
    inputCity.setAttribute("type", "text");
    inputCity.setAttribute("placeholder", "input city");
    inputCity.setAttribute("list", "city-list");

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

    inputCity.addEventListener("input", async () => {
        inputCity.value = capitalizeFirstLetter(inputCity.value);
        removeAllChildNodes(datalist);
        if (inputCity.value.length >= 3) {
            await apiSearch(inputCity.value);

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