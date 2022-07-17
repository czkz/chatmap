import * as stemlib from './stem.js';
import * as dictExceptions from './dictExceptions.js';
import CityData from '../CityData.js';

export default class {

    #dict = Object.create(null);

    constructor() {
        return (async () => {
            const cityData = await new CityData();
            console.log(cityData);

            // Reverse so cities with higher population
            // overwrite cities with lower population
            cityData.data.slice().reverse().forEach(city => {
                this.#dict[stemlib.cityToken(city.name_ru, city)] = city.name;
                this.#dict[stemlib.cityToken(city.name, city)] = city.name;
                this.#dict[city.name] = city.name;
                this.#dict[city.name_ru] = city.name;
            });
            dictExceptions.apply(this.#dict);
            delete this.#dict[undefined];
            delete this.#dict[null];
            return this;
        })();
    }

    parseMsg(msg) {
        const words = stemlib.nameTokens(msg).reverse();
        for (const word of [...words, ...stemlib.tokenize(msg)]) {
            const city = this.#dict[word];
            if (city !== undefined) {
                console.log(`Found city ${city} for token ${word}`);
                return city;
            }
        }
        return null;
    }

};
