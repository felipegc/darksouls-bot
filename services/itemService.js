const dao = require('./dao');

const findItem = (item) => {
    return new Promise((resolve, reject) => {
        dao.fetchItem(item).then(response => {
            resolve(`./database/weapons/${response}`);
        }).catch(err => {
            reject(err);
        });
    });
};

const findCommandItem = (commandItem) => {
    let item = commandItem.replace('/', '');
    return new Promise((resolve, reject) => {
        dao.fetchItem(item).then(response => {
            resolve(`./database/weapons/${response}`);
        }).catch(err => {
            reject(err);
        });
    });
};

const buildCategories = () => {
    return new Promise((resolve, reject) => {
        dao.fetchCategories().then(response => {
            let categoriesToCommand = response.map(el => {return `/${el}\n`}).join('');
            resolve(categoriesToCommand);
        }).catch(err => {
            reject(err);
        })
    });
};

const buildWeaponsList = () => {
    return new Promise((resolve, reject) => {
        dao.fetchWeapons().then(weapons => {
            let weaponsList = '';
            for (let i = 0; i < weapons.length; i ++) {
                weaponsList += `/${weapons[i]}\n`;
            }
            resolve(weaponsList);
        }).catch(err => {
            reject(err);
        })
    });
};

//buildWeponsList().then(response => console.log(response));

//findItem('Claymore').then(response => console.log(response));

module.exports = {
    findItem,
    buildCategories,
    buildWeaponsList,
    findCommandItem
};