const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function generateSelectorsFromURL(url, elementId) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    
    const htmlContent = await page.content();
    const selectors = {
        id: generateSelectorByID(htmlContent, elementId),
        xpath: await generateXPath(page, elementId),
        css: generateSelectorByCSS(htmlContent, elementId)
    };

    await browser.close();
    return selectors;
}

function generateSelectorByID(htmlContent, elementId) {
    const $ = cheerio.load(htmlContent);
    const element = $(`#${elementId}`);
    if (element.length > 0) {
        return `#${elementId}`;
    } else {
        return "Element ID not found";
    }
}

async function generateXPath(page, elementId) {
    const elementHandle = await page.$(`[id="${elementId}"]`);
    if (!elementHandle)
        return "Element ID not found";

    const xpath = await page.evaluate((element) => {
        const getElementXPath = (element) => {
            if (element.tagName === 'HTML')
                return '/HTML[1]';
            if (element === document.body)
                return '/HTML[1]/BODY[1]';

            let ix = 0;
            const siblings = element.parentNode.childNodes;
            for (let i = 0; i < siblings.length; i++) {
                const sibling = siblings[i];
                if (sibling === element)
                    return `${getElementXPath(element.parentNode)}/${element.tagName}[${ix + 1}]`;
                if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
                    ix++;
            }
        };

        return getElementXPath(element);
    }, elementHandle);

    return xpath;
}

function generateSelectorByCSS(htmlContent, elementId) {
    const $ = cheerio.load(htmlContent);
    const element = $(`#${elementId}`);
    if (element.length > 0) {
        const classes = element.attr('class');
        const tagName = element.get(0).tagName;
        const id = elementId;
        return `${tagName}#${id}.${classes}`;
    } else {
        return "Element ID not found";
    }
}

module.exports = generateSelectorsFromURL;
