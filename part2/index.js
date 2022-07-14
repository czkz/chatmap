'use strict';
const natural = require('natural');
const CityData = require('../CityData');

function toWords(str) {
    return natural.PorterStemmerRu.tokenizeAndStem(str);
}

function getToken(str) {
    const words = toWords(str);
    for (const w of words.reverse()) {
        if (w == 'область') { continue; }
        if (w == 'край') { continue; }
        if (w == 'сити') { continue; }
        if (w == 'city') { continue; }
        if (w.length <= 2) { continue; }
        return w;
    }
}

module.exports = class {

    #dict = Object.create(null);

    constructor() {
        return (async () => {
            const cityData = await new CityData();
            console.log(cityData);

            // Reverse so cities with higher population
            // overwrite cities with lower population
            cityData.data.slice().reverse().forEach(city => {
                this.#dict[getToken(city.name_ru)] = city.name;
                this.#dict[getToken(city.name)] = city.name;
            });
            delete this.#dict[undefined];
            delete this.#dict[null];
            return this;
        })();
    }

    parseMsg(msg) {
        const words = toWords(msg).reverse();
        for (const word of words) {
            const city = this.#dict[word];
            if (city !== undefined) {
                console.log(`Found city ${city} for token ${word}`);
                return city;
            }
        }
        return null;
    }

};
