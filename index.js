"use strict"

import { capitalCities } from "./cities.js";

let cities = capitalCities;

let cityList = new Array;

let favCities = new Array;

const rootElement = document.querySelector("#root");

window.addEventListener("load", () => {
    const input = document.createElement("input");
    input.setAttribute("id", "input-city");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "input city");

    const favButton = document.createElement("button");
    favButton.setAttribute("type", "button");
    favButton.innerText = "Favourite";

    const resetButton = document.createElement("button");
    resetButton.setAttribute("type", "button");
    resetButton.innerText = "Reset";

    const form = document.createElement("form");
    form.setAttribute("action", "");

    form.appendChild(input);
    form.appendChild(favButton);
    form.appendChild(resetButton);

    const datalist = document.createElement("datalist");
    datalist.setAttribute("id", "city-list");

    rootElement.insertAdjacentElement("beforeend", datalist);
    rootElement.insertAdjacentElement("afterbegin", form);

    input.addEventListener("input", () => {
        removeAllChildNodes(datalist);
        cityList = [];
        if (input.value.length >= 3) {
            input.setAttribute("list", "city-list");

            cities.filter((city) => {
                if (city.includes(input.value)) {
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
                option.setAttribute("label", "Favourite");
                datalist.appendChild(option);
            });
        }
    });

    favButton.addEventListener("click", () => {
        if (input.value.includes(cityList) && !favCities.includes(input.value)) {
            favCities.push(input.value);
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