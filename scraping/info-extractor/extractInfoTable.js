const puppeteer = require('puppeteer');

/**
 * Takes a screenshot of a DOM element on the page.
 * https://github.com/checkly/puppeteer-examples/blob/master/5.%20parallel-pages/screenshots_parallel.js
 */
const generateInfoTables = async (pathToSave, selector, files) => {
    return puppeteer.launch().then(async browser => {
        const promises = [];
        for(let i = 0; i < files.length; i++) {
            promises.push(browser.newPage().then(async page => {
                try {
                    console.log(`Taking screenshot of ${files[i].linkToScrap}`);

                    page.setViewport({width: 3000, height: 6000, deviceScaleFactor: 1});
                    await page.goto(files[i].linkToScrap, {
                        timeout: 3000000,
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

                    return await page.screenshot({
                        path: `${pathToSave}/${files[i].item}.png`,
                        clip: {
                            x: rect.left,
                            y: rect.top,
                            width: rect.width,
                            height: rect.height
                        }
                    });
                } catch (err) {
                    console.log(`It was not possible to generate the info for ${files[i].item} --- ${files[i].linkToScrap}`);
                    console.log(err);
                }
            }).catch(err => {
                console.log('Unable to generate new Page');
                console.log(err);
            }));
        }
        await Promise.all(promises);
        await browser.close();
        return 'FINISHED';
    }).catch(err => {
        console.log('Unable to launch the browser');
        console.log(err);
    });
};

module.exports = {
	generateInfoTables,
};