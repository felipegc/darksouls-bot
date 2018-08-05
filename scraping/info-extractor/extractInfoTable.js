const puppeteer = require('puppeteer');

/**
 * Takes a screenshot of a DOM element on the page.
 * https://github.com/checkly/puppeteer-examples/blob/master/5.%20parallel-pages/screenshots_parallel.js
 */
const screenshotDOMElement = async (pathToSave, fileName, selector, linkToScrap) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // Guarantees that a menu will not appear on the screenshot.
        page.setViewport({width: 1000, height: 6000, deviceScaleFactor: 1});
        await page.goto(linkToScrap, {waitUntil: 'networkidle2'});

        const rect = await page.evaluate(selector => {
            //Most of the pages contains 2 tables. If there is only one, it means we want the first.
            let element = document.getElementsByTagName('table')[1];
            if (element === undefined) {
                element = document.getElementsByTagName('table')[0];
            }
            const {x, y, width, height} = element.getBoundingClientRect();
            return {left: x, top: y, width, height, id: element.id};
        });

        return await page.screenshot({
            path: `${pathToSave}/${fileName}`,
            clip: {
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height
            }
        });

        browser.close();
    } catch (err) {
        console.log(err);
        throw new Error('Unable to generate thr info for this item');
    }
}

//selector: '#wiki-content-block > div.tabcontent',
//TODO felipegc: improve selector
screenshotDOMElement('./database/', 'teste.png', 'table', 'https://darksouls.wiki.fextralife.com/Claymore').then(response => {
    console.log('Image Generated');
}).catch(err => {
    console.log(err);
});










// var extractInfoTable = (url) => {
// 	setTimeout(() => {
//         console.log(`generating info image for ${url}`);
// 	}, 1500);
// };

// module.exports = {
// 	extractInfoTable,
// };