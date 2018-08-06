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
                console.log('Unable to extract link: ', err.message);
            }
        }
            return weaponLinks;
        }).catch((error) => {
            throw new Error('Unable to find the weapons links');
        });
};

extractWeaponList().then((response) => {
    let files = [];

    files = response.map(element => {
        return {
            linkToScrap: element,
            item: element.split(urlWiki + '/')[1].replace(/[\W_]+/g, '')
        };
    });

    let batch = [];
    for (let i = 0; i < 1; i++) {
        batch[i] = files[i];
    }

    return infoExtractor.batchGenerateInfoTables('./database/weapons', 'table', batch);
}).then(response => {
    console.log(response);
}).catch(err => console.log(err));





