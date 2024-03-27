const generateSelectorsFromURL = require('./Engine/selectors');

// Contoh penggunaan:
const url = "https://www.saucedemo.com";
const elementId = "user-name";
generateSelectorsFromURL(url, elementId)
    .then(selectors => {
        console.log("Selectors:", selectors);
    })
    .catch(error => {
        console.error("Error:", error);
    });