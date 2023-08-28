import { toJSON as csvToJSON } from './csv.js';

let sharedData = null;

export default class {
    data = null;

    constructor() {
        return (async () => {
            if (sharedData === null) {
                const csv = await fetch('cities/worldcities.csv')
                    .then(resp => resp.text());
                sharedData = csvToJSON(csv, '\t');
                sharedData.sort((a, b) => b.population - a.population);
                sharedData = sharedData.filter((e, i) =>
                    e.population > 70000 ||
                    e.population > 10000 && e.country == 'Russia' ||
                    e.population > 15000 && e.country == 'Montenegro' ||
                    ['Wauconda'].includes(e.name)
                );
                sharedData.push({
                    "name": "Vladibablo",
                    "lat": "40",
                    "lng": "-40",
                    "country": "Russia",
                    "iso2": "RU",
                    "iso3": "RUS",
                    "admin_name": "Vladibablo",
                    "population": "0",
                    "name_ru": "Владибабло",
                    "admin_name_ru": "Владибабло"
                });
                sharedData.push({
                    "name": "Langhorne",
                    "lat": "40.1774",
                    "lng": "-74.9189",
                    "country": "United States",
                    "iso2": "US",
                    "iso3": "USA",
                    "admin_name": "Pennsylvania",
                    "population": "1622",
                    "name_ru": "Ланггорн",
                    "admin_name_ru": "Пенсильвания"
                });
                sharedData = sharedData.filter(city => ![
                    'Louga',
                    'Bata',
                    'Lae',
                    'Svobodnyy',
                    'Etah',
                ].includes(city.name));
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
