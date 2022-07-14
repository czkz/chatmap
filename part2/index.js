'use strict';
const natural = require('natural');
const CityData = require('../CityData');

function toWords(str) {
    return natural.PorterStemmerRu.tokenizeAndStem(str);
}

function stem(str) {
    return toWords(str)[0];
}

function getToken(str) {
    const words = toWords(str);
    for (const w of words.reverse()) {
        if (w == stem('область')) { continue; }
        if (w == stem('край'))    { continue; }
        if (w == stem('сити'))    { continue; }
        if (w == stem('city'))    { continue; }
        if (w == stem('страна'))  { continue; }
        if (w == stem('город'))   { continue; }
        if (w.length <= 2)        { continue; }
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
            this.#dict[stem('Питер')]     = 'Saint Petersburg';
            this.#dict[stem('СПБ')]       = 'Saint Petersburg';
            this.#dict[stem('Ленинград')] = 'Saint Petersburg';
            this.#dict[stem('Петроград')] = 'Saint Petersburg';
            this.#dict[stem('NY')]        = 'New York';
            this.#dict[stem('LA')]        = 'Los Angeles';
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
