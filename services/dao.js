const fs = require('fs');

let fetchItem = (item) => {
    return new Promise((resolve, reject) => {
        let files = fs.readdirSync('./database/weapons/');
        let re = new RegExp(' ', 'g');
        let lowerCaseItem = item.replace(re, '').toLowerCase() + '.png';
        let element = files.find(el => {return el.toLowerCase() === lowerCaseItem});

        if (element === undefined) {
            reject('Item Not Found');
        }

        resolve(`${element}`);
    })
};

let fetchWeapons = () => {
    return new Promise((resolve, reject) => {
        let files = fs.readdirSync('./database/weapons/');

        if (files === undefined) {
            reject('Weapons Not Found');
        }

        let weapons = files.map(el => {return el.split('.png')[0]});
        resolve(weapons);
    })
};

let fetchCategories = () => {
    return new Promise((resolve, reject) => {
        let dirs = fs.readdirSync('./database');

        if (dirs === undefined) {
            reject('Categories not found');
        }

        resolve(dirs);
    })
};

module.exports = {
    fetchItem,
    fetchCategories,
    fetchWeapons
};



