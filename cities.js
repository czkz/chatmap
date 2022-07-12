'use strict';
const csvToJSON = require('./csv').toJSON;

let loaded = false;

module.exports = {
    data: null,

    async load() {
        if (loaded) { return false; }
        const csv = await fetch('cities/worldcities_clean.csv')
            .then(resp => resp.text());
        this.data = csvToJSON(csv);
        this.data.sort((a, b) => b.population - a.population);
        // console.log(data);
        // const cities = Object.fromEntries(data.map(e => [e.city, e]));
        loaded = true;
        return true;
    },

    getCityByName(name) {
        return this.data.find(e => e.name == name);
    },

    exists(cityName) {
        return this.getCityByName(cityName) !== null;
    }
};
