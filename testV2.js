const getAllSelectors = require('./Engine/allSelectors');

// Contoh penggunaan:
const url = "https://www.saucedemo.com";
getAllSelectors(url)
    .then(allSelectors => {
        console.log("All Selectors:", allSelectors);
    })
    .catch(error => {
        console.error("Error:", error);
    });
