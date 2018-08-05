var request = require('request-promise');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const infoExtractor = require('../info-extractor/extractInfoTable');

const urlWiki = 'https://darksouls.wiki.fextralife.com';
const url = urlWiki + '/Weapons';

let extractWeaponList = () => {
    return request(url).then((htmlString) => {
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
            return weaponLinks;
        }).catch((error) => {
            throw new Error('Unable to find the weapons links');
        });
};

extractWeaponList().then((response) => {
    for (let i=0; i<response.length; i++) {
        console.log(response[i]);
        let link = response[i];
        let itemName = response[i].split(urlWiki + '/')[1].replace(/[\W_]+/g, '');

        infoExtractor.extractInfoTable(response[i], itemName);
    }
}).catch(err => console.log(err));





