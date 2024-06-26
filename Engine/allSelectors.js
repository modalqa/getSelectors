const puppeteer = require('puppeteer');

// Versi 1.0.0
// async function getAllSelectors(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(url);
    
//     const allSelectors = {};

//     // Mendapatkan semua elemen dengan ID
//     const idElements = await page.$$('[id]');
//     for (const element of idElements) {
//         const id = await element.evaluate(node => node.id);
//         addToGroup(allSelectors, 'id', id, `#${id}`);
//     }

//     // Mendapatkan semua elemen dengan XPath
//     const xpathElements = await page.evaluate(() => {
//         const elements = document.evaluate("//*", document, null, XPathResult.ANY_TYPE, null);
//         let elem = elements.iterateNext();
//         const xpaths = {};
//         while (elem) {
//             const idx = (sib, name) => sib
//                 ? idx(sib.previousElementSibling, name || sib.tagName) + (sib.tagName === name)
//                 : 1;
//             const segs = elm => !elm || elm.nodeType !== 1
//                 ? ['']
//                 : elm.id && document.getElementById(elm.id) === elm
//                     ? [`id("${elm.id}")`]
//                     : [...segs(elm.parentNode), `${elm.tagName.toLowerCase()}[${idx(elm)}]`];
//             const xpath = segs(elem).join('/');
//             xpaths[xpath] = xpath;
//             elem = elements.iterateNext();
//         }
//         return xpaths;
//     });
//     addToGroup(allSelectors, 'xpath', xpathElements);

//     // Mendapatkan semua elemen dengan CSS
//     const cssElements = await page.$$('*');
//     for (const element of cssElements) {
//         const tagName = await element.evaluate(node => node.tagName.toLowerCase());
//         const classes = await element.evaluate(node => node.className);
//         const id = await element.evaluate(node => node.id);
//         const selector = (id ? `#${id}` : '') + (classes ? `.${classes.replace(/\s+/g, '.')}` : '');
//         addToGroup(allSelectors, 'css', tagName, selector);
//     }

//     // Menutup browser yang digunakan oleh Puppeteer
//     await browser.close();

//     return allSelectors;
// }

// function addToGroup(allSelectors, group, key, value) {
//     if (!allSelectors[group]) {
//         allSelectors[group] = {};
//     }
//     if (!allSelectors[group][key]) {
//         allSelectors[group][key] = [];
//     }
//     allSelectors[group][key].push(value);
// }

// Versi 1.0.1
async function getAllSelectors(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        await page.goto(url);

        const allSelectors = {
            id: {},
            xpath: {},
            css: {},
        };

        // Get elements with IDs
        const idElements = await page.$$('[id]');
        for (const element of idElements) {
            const id = await element.evaluate(node => node.id);
            addToGroup(allSelectors, 'id', id, `#${id}`);
        }

        // Get elements with XPaths
        const xpathElements = await page.evaluate(() => {
            const elements = document.evaluate("//*", document, null, XPathResult.ANY_TYPE, null);
            let elem = elements.iterateNext();
            const xpaths = {};
            const getXPath = (elm) => {
                const idx = (sib, name) => sib 
                    ? idx(sib.previousElementSibling, name || sib.tagName) + (sib.tagName === name)
                    : 1;
                const segs = elm => !elm || elm.nodeType !== 1
                    ? ['']
                    : elm.id && document.getElementById(elm.id) === elm
                        ? [`id("${elm.id}")`]
                        : [...segs(elm.parentNode), `${elm.tagName.toLowerCase()}[${idx(elm)}]`];
                return segs(elm).join('/');
            };
            while (elem) {
                const xpath = getXPath(elem);
                xpaths[xpath] = xpath;
                elem = elements.iterateNext();
            }
            return xpaths;
        });
        for (const [key, value] of Object.entries(xpathElements)) {
            addToGroup(allSelectors, 'xpath', key, value);
        }

        // Get elements with CSS selectors
        const cssElements = await page.$$('*');
        for (const element of cssElements) {
            const tagName = await element.evaluate(node => node.tagName.toLowerCase());
            const classes = await element.evaluate(node => node.className);

            // Periksa apakah classes adalah string sebelum memanggil metode replace
            const selectorClasses = (typeof classes === 'string') ? `.${classes.replace(/\s+/g, '.')}` : '';

            const id = await element.evaluate(node => node.id);
            const selector = (id ? `#${id}` : '') + selectorClasses;
            addToGroup(allSelectors, 'css', tagName, selector);
        }

        return allSelectors;
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        await browser.close();
    }
}

function addToGroup(allSelectors, group, key, value) {
    if (!allSelectors[group]) {
        allSelectors[group] = {};
    }
    if (!allSelectors[group][key]) {
        allSelectors[group][key] = [];
    }
    allSelectors[group][key].push(value);
}

module.exports = getAllSelectors;
