const puppeteer = require('puppeteer');

async function getAllSelectors(url, username, password, usernameSelector, passwordSelector, submitButtonSelector, targetUrl) {
    const browser = await puppeteer.launch({ headless: false, args: ['--disable-extensions'], userDataDir: './temp' });
    const page = await browser.newPage();

    try {
        // Buka halaman login
        await page.goto(url);

        // Masukkan username
        await page.waitForSelector(usernameSelector);
        await page.type(usernameSelector, username);

        // Masukkan password
        await page.waitForSelector(passwordSelector);
        await page.type(passwordSelector, password);

        // Klik tombol login
        await page.waitForSelector(submitButtonSelector);
        await page.click(submitButtonSelector);

        // Buka halaman target setelah login
        await page.goto(targetUrl);

        const allSelectors = {
            id: {},
            xpath: {},
            css: {},
        };

        // Dapatkan elemen dengan ID
        const idElements = await page.$$('[id]');
        for (const element of idElements) {
            const id = await element.evaluate(node => node.id);
            addToGroup(allSelectors, 'id', id, `#${id}`);
        }

        // Dapatkan elemen dengan XPath
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

        // Dapatkan elemen dengan CSS selector
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

// Contoh penggunaan

