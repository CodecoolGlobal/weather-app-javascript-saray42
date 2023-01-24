"use strict"

import { capitalCities } from "./cities.js";

let cities = capitalCities;

let cityList = new Array;

let favCities = new Array;

let isChrome = navigator.userAgent.match(/chrome|chromium|crios/i);

const rootElement = document.querySelector("#root");

window.addEventListener("load", () => {
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

    const inputForm = document.createElement("div");

    inputForm.appendChild(inputCity);
    inputForm.appendChild(favButton);
    inputForm.appendChild(resetButton);

    const datalist = document.createElement("datalist");
    datalist.setAttribute("id", "city-list");

    rootElement.insertAdjacentElement("beforeend", datalist);
    rootElement.insertAdjacentElement("afterbegin", inputForm);

    inputCity.addEventListener("input", () => {
        inputCity.value = capitalizeFirstLetter(inputCity.value);
        removeAllChildNodes(datalist);
        cityList = [];
        if (inputCity.value.length >= 3) {
            inputCity.setAttribute("list", "city-list");

            cities.filter((city) => {
                if (city.includes(inputCity.value)) {
                    cityList.push(city)
                }
            });

            cityList.map((city) => {
                const option = document.createElement("option");
                option.setAttribute("value", city);
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
        if (inputCity.value.includes(cityList) && !favCities.includes(inputCity.value)) {
            favCities.push(inputCity.value);
        }
    });

    resetButton.addEventListener("click", () => {
        removeAllChildNodes(datalist);
        favCities = [];
    });
});

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}