const puppeteer = require('puppeteer');

/**
 * Takes a screenshot of a DOM element on the page.
 * https://github.com/checkly/puppeteer-examples/blob/master/5.%20parallel-pages/screenshots_parallel.js
 */
const generateInfoTables = async (pathToSave, selector, item, linkToScrap) => {
    try {

        console.log(`Taking screenshot of ${linkToScrap}`);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        page.setViewport({width: 1900, height: 6000, deviceScaleFactor: 1});
        await page.goto(linkToScrap, {
            timeout: 30000,
            waitUntil: 'networkidle2'
        });

        const rect = await page.evaluate(selector => {
            //Most of the pages contains 2 tables.
            //If there is only one, it means we want the first.
            let element = document.getElementsByTagName('table')[1];
            if (element === undefined) {
                element = document.getElementsByTagName('table')[0];
            }
            const {x, y, width, height} = element.getBoundingClientRect();
            return {left: x, top: y, width, height, id: element.id};
        });

        await page.screenshot({
            path: `${pathToSave}/${item}.jpeg`,
            clip: {
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height
            }
        });

        await browser.close();
        return 'SUCCESS';
    } catch (err) {
        console.log(`It was not possible to generate the info for ${item} --- ${linkToScrap}`);
        console.log(err);
    }
};

const batchGenerateInfoTables = async (pathToSave, selector, files) => {
    for (let i = 0; i < files.length; i++) {
        try {
            await generateInfoTables(
                pathToSave, selector, files[i].item, files[i].linkToScrap);
        } catch(err) {
            console.log(`Something went wrong to process the file ${files[i].linkToScrap}`);
        }
    }
    return 'BATCH FINISHED';
}

module.exports = {
    generateInfoTables,
    batchGenerateInfoTables
};