# Web Selector Framework

The Web Selector Framework is a framework used to collect selectors (ID, XPath, and CSS) from web pages. This framework utilizes Puppeteer for web page navigation and Cheerio for element inspection.

## Installation

1. Make sure you have Node.js installed on your system.
2. Clone this repository or download the source code.
3. Open a terminal or command prompt and navigate to the project directory.
4. Run the command `npm install` to install all dependencies.

## Usage

To collect selectors from a web page, follow these steps:

1. Import the `getAllSelectors` module from `selectorCollector.js`.
2. Call the `getAllSelectors` function providing the URL of the web page you want to process.
3. Display the results returned by the function.

Example usage:

```javascript
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
```
## Result
This framework will produce a JavaScript object containing selectors (ID, XPath, and CSS) of all elements on the web page you provide.

Example result:
```json

{
  id: {
    element: '#element-id',
    ...
  },
  xpath: {
    '/HTML[1]/BODY[1]/DIV[1]': '/HTML[1]/BODY[1]/DIV[1]',
    ...
  },
  css: {
    'div.class': 'div.class',
    ...
  }
}
```

## Contribution
If you would like to contribute to the development of this framework, please fork this repository, make the desired changes, and create a pull request to the main repository. We greatly appreciate contributions from various parties.
