import * as stemlib from './stem.js';
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
            this.#dict[stemlib.stem('Питер')]     = 'Saint Petersburg';
            this.#dict[stemlib.stem('СПБ')]       = 'Saint Petersburg';
            this.#dict[stemlib.stem('Ленинград')] = 'Saint Petersburg';
            this.#dict[stemlib.stem('Петроград')] = 'Saint Petersburg';
            this.#dict[stemlib.stem('NY')]        = 'New York';
            this.#dict[stemlib.stem('LA')]        = 'Los Angeles';
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
