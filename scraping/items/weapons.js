var request = require('request-promise');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const infoExtractor = require('../info-extractor/extractInfoTable');

const urlWiki = 'https://darksouls.wiki.fextralife.com';
const url = urlWiki + '/Weapons';

let extractWeaponList = () => {
    return new Promise((resolve, reject) => {
        request(url).then((htmlString) => {
            let domWeaponsList = new JSDOM(htmlString);
            let weaponList = domWeaponsList.window.document.getElementsByClassName('col-xs-6 col-sm-2');
            let weaponLinks = [];

            for (let i=0; i<weaponList.length; i++) {
                try {
                    let link = weaponList[i].getElementsByClassName('wiki_link')[0].href;
                    weaponLinks.push(urlWiki + link);
                } catch (err) {
                    console.log('Unable to extract link: ', err);
                }
            }
            resolve(weaponLinks);
        }).catch((error) => {
            reject(error);
        });
    });
};


extractWeaponList().then((response) => {
    for (let i=0; i<response.length; i++) {
      infoExtractor.extractInfoTable(response[i]);
    }
}).catch(err => console.log(err));





