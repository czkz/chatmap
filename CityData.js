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
                    e.population > 15000 && e.name.length >= 5 && e.name_ru.length >= 5 ||
                    e.name == 'Bar' && e.country == 'Montenegro' ||
                    [
                        'Wauconda',
                        'Monterrey',
                        'Bolzano',
                        'Lake Zurich',
                        'Fethiye',
                        'Crozon',
                        'Torshavn',
                        'Sosua',
                        'Lommel',
                        'Ludza',
                        'Tivat',
                        'Narvik',
                        'Moravce',
                        'Zell am See',
                        'Kotor',
                    ].includes(e.name)
                );
                Object.assign(sharedData.find(e => e.name == 'Nur-Sultan'), {
                    "name": "Astana",
                    "name_ru": "Астана",
                });
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
                sharedData.push({
                    "name": "Pereybere",
                    "lat": "-20.0184",
                    "lng": "57.5802",
                    "country": "Mauritius",
                    "iso2": "MU",
                    "iso3": "MUS",
                    "admin_name": "Grand Baie",
                    "population": "1622",
                    "name_ru": "Перейбер",
                    "admin_name_ru": "Гранд Бэй"
                });
                sharedData.push({
                    "name": "Aakirkeby",
                    "lat": "55.0705",
                    "lng": "14.9167",
                    "country": "Denmark",
                    "iso2": "DK",
                    "iso3": "DNK",
                    "admin_name": "Hovedstaden",
                    "population": "2092",
                    "name_ru": "Окиркебю",
                    "admin_name_ru": "Ховедстаден"
                });
                sharedData.push({
                    "name": "Rogachev",
                    "lat": "53.1",
                    "lng": "30.05",
                    "country": "Belarus",
                    "iso2": "BY",
                    "iso3": "BLR",
                    "admin_name": "Homyel’skaya Voblasts",
                    "population": "32029",
                    "name_ru": "Рогачев",
                    "admin_name_ru": "Гомельская область"
                });
                sharedData.push({
                    "name": "Novaya Chara",
                    "lat": "56.8",
                    "lng": "118.3",
                    "country": "Russia",
                    "iso2": "RU",
                    "iso3": "RUS",
                    "admin_name": "Zabaykal’skiy Kray",
                    "population": "4238",
                    "name_ru": "Новая Чара",
                    "admin_name_ru": "Забайкальский край"
                });
                sharedData.push({
                    "name": "Samosir",
                    "lat": "2.58",
                    "lng": "98.82",
                    "country": "Indonesia",
                    "iso2": "ID",
                    "iso3": "IDN",
                    "admin_name": "Sumatera Utara",
                    "population": "108869",
                    "name_ru": "Самосир",
                    "admin_name_ru": "Суматра Утара"
                });
                sharedData.push({
                    "name": "Ushachy",
                    "lat": "55.18",
                    "lng": "28.61",
                    "country": "Belarus",
                    "iso2": "BY",
                    "iso3": "BLR",
                    "admin_name": "Vitebsk Region",
                    "population": "5714",
                    "name_ru": "Ушачи",
                    "admin_name_ru": "Витебская область"
                });
                sharedData.push({
                    "name": "Roja",
                    "lat": "57.50",
                    "lng": "22.81",
                    "country": "Latvia",
                    "iso2": "LV",
                    "iso3": "LVA",
                    "admin_name": "Kurzeme",
                    "population": "2120",
                    "name_ru": "Роя",
                    "admin_name_ru": "Курземе"
                });
                sharedData.push({
                    "name": "Wivenhoe",
                    "lat": "51.86",
                    "lng": "0.96",
                    "country": "United Kingdom",
                    "iso2": "GB",
                    "iso3": "GBR",
                    "admin_name": "Essex",
                    "population": "7637",
                    "name_ru": "Вивенхоу",
                    "admin_name_ru": "Эссекс"
                });
                sharedData = sharedData.filter(city => ![
                    'Louga',
                    'Bata',
                    'Lae',
                    'Svobodnyy',
                    'Etah',
                    'Montenegro',
                    'Wooster',
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
