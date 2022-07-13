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
        return w;
    }
}

module.exports = class {

    #dict = Object.create(null);

    constructor(limit = Infinity) {
        return (async () => {
            const cityData = await new CityData(limit);
            console.log(cityData);

            cityData.data.forEach(city => {
                const wordsRu = toWords(city.name_ru);
                const token = wordsRu[wordsRu.length - 1];
                this.#dict[token] = city.name;
            });
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
