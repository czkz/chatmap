import { toJSON as csvToJSON } from './csv.js';

let sharedData = null;

export default class {
    data = null;

    constructor() {
        return (async () => {
            if (sharedData === null) {
                const csv = await fetch('cities/worldcities.csv')
                    .then(resp => resp.text());
                sharedData = csvToJSON(csv);
                sharedData.sort((a, b) => b.population - a.population);
                sharedData = sharedData.filter((e, i) =>
                    e.population > 80000 ||
                    e.population > 25000 && e.country == 'Russia'
                );
            }
            this.data = sharedData;
            return this;
        })();
    }

    getCityByName(name) {
        return this.data.find(e => e.name == name);
    }

    getCityByNameRu(nameRu) {
        return this.data.find(e => e.name_ru == name);
    }

    exists(cityName) {
        return this.getCityByName(cityName) !== null;
    }

    randomCity(n = Infinity) {
        const i = Math.floor(Math.random() * Math.min(n, this.data.length));
        return this.data[i];
    }

};
