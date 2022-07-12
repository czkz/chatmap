'use strict';
const csvToJSON = require('./csv').toJSON;

let sharedData = null;

module.exports = class {
    data = null;

    constructor() {
        return (async () => {
            if (sharedData === null) {
                const csv = await fetch('cities/worldcities_clean.csv')
                    .then(resp => resp.text());
                sharedData = csvToJSON(csv);
                sharedData.sort((a, b) => b.population - a.population);
            }
            this.data = sharedData;
            return this;
        })();
    }

    getCityByName(name) {
        return this.data.find(e => e.name == name);
    }

    exists(cityName) {
        return this.getCityByName(cityName) !== null;
    }

    randomCity(n = Infinity) {
        const i = Math.floor(Math.random() * Math.min(n, this.data.length));
        return this.data[i];
    }

};
