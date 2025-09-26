import 'https://fastly.jsdelivr.net/npm/russian-nouns-js@1.3.1/RussianNouns.js';
import CityData from '../CityData.js';
import CommonWords from './commonWords.js';

const rne = new RussianNouns.Engine();
const cityData = await new CityData();
const commonWords = await new CommonWords();

function decline(word, casei) {
    const gender = {
        'Тюмень': RussianNouns.Gender.FEMININE,
    };
    const indec = {
        'Моа': true,
        'Hue': true,
        'Vladibablo': true,
        'Orel': true,
    };
    const indeclinable = indec[word] ?? ('оиеую'.split('').includes(word.slice(-1)) ||
        ['Лос', 'Сан'].includes(word));
    const lemma = RussianNouns.createLemma({
        text: word,
        gender: gender[word] ?? RussianNouns.Gender.COMMON,
        indeclinable
    });
    return rne.decline(lemma, RussianNouns.CASES[casei])[0];
}

function addCityRaw(lut, name, city) {
    const firstWord = name.split(' ')[0];
    lut[firstWord] ??= Object.create(null);
    lut[firstWord][name] ??= city;  // ?? to not overwrite cities with higher population
}

function addCity(lut, keyword, city) {
    let words = keyword.replaceAll('-', ' ').split(' ');
    while (words.length > 0 && words[0][0] == words[0][0].toLowerCase()) {
        words = words.slice(1);
    }
    if (words.length == 0) { return; }
    if (words.length == 1 && commonWords.has(words[0].toLowerCase())) {
        // console.log('Ignoring city', keyword);
        return;
    }
    const dashed = keyword.includes('-на-');
    const doCaseAll = ci => words.map(w => decline(w, ci)).join(' ');
    const doCaseFirst = ci => [decline(words[0], ci), ...words.slice(1)].join(' ');
    const cases = [0, 1, 6].map(dashed ? doCaseFirst : doCaseAll);
    cases.forEach(name => addCityRaw(lut, name, city));
}

function addExtra(lut) {
    addCity(lut,    'Питер',      'Saint Petersburg');
    addCity(lut,    'Ленинград',  'Saint Petersburg');
    addCity(lut,    'Петроград',  'Saint Petersburg');
    addCity(lut,    'Петербург',  'Saint Petersburg');
    addCity(lut,    'Екат',       'Yekaterinburg');
    addCity(lut,    'Ваконда',    'Wauconda');
    addCity(lut,    'Воконда',    'Wauconda');
    addCity(lut,    'Вуконда',    'Wauconda');
    addCity(lut,    'Вауконда',   'Wauconda');
    addCity(lut,    'Нур-Султан', 'Astana');
    addCity(lut,    'Тель Авив',  'Tel Aviv-Yafo');
    addCity(lut,    'Яффа',       'Tel Aviv-Yafo');
    addCity(lut,    'Яфо',        'Tel Aviv-Yafo');
    addCity(lut,    'Ломмел',     'Lommel');
    addCityRaw(lut, 'Орла',       'Orel');
    addCityRaw(lut, 'Орле',       'Orel');
    addCityRaw(lut, 'Химок',      'Khimki');
    addCityRaw(lut, 'Химках',     'Khimki');
    addCityRaw(lut, 'SPB',        'Saint Petersburg');
    addCityRaw(lut, 'СПБ',        'Saint Petersburg');
    addCityRaw(lut, 'спб',        'Saint Petersburg');
    addCityRaw(lut, 'Спб',        'Saint Petersburg');
    addCityRaw(lut, 'ЕКБ',        'Yekaterinburg');
    addCityRaw(lut, 'екб',        'Yekaterinburg');
    addCityRaw(lut, 'Екб',        'Yekaterinburg');
    addCityRaw(lut, 'МСК',        'Moscow');
    addCityRaw(lut, 'мск',        'Moscow');
    addCityRaw(lut, 'Мск',        'Moscow');
    addCityRaw(lut, 'MSK',        'Moscow');
    addCityRaw(lut, 'NY',         'New York');
    addCityRaw(lut, 'LA',         'Los Angeles');
    addCityRaw(lut, 'Tel Aviv',   'Tel Aviv-Yafo');
    addCityRaw(lut, 'Yafo',       'Tel Aviv-Yafo');
    addCityRaw(lut, 'Бар Черногория', 'Bar');
    addCityRaw(lut, 'Черногория Бар', 'Bar');
    addCityRaw(lut, 'Bar Montenegro', 'Bar');
    addCityRaw(lut, 'Montenegro Bar', 'Bar');
}

let cachedLUT = null;

function genLUT() {
    if (cachedLUT === null) {
        const lut = Object.create(null);
        // Reverse cityData so cities with higher population
        // overwrite cities with lower population
        cityData.data.forEach(city => {
            if (city.country == 'Russia' || city.name.length > 2) {
                if (city.country == 'Russia' || city.population > 10000) {
                    addCity(lut, city.name_ru, city.name);
                }
                addCityRaw(lut, city.name, city.name);
            }
        });
        addExtra(lut);
        for (const k in lut) {
            lut[k] = Object.entries(lut[k]).map(([name, city]) => ({ name, city })).sort((a, b) => a.name.length - b.name.length);
        }
        cachedLUT = lut;
    }
    return cachedLUT;
}

// [
//     { name_ru: 'Москва' },
//     { name_ru: 'Ростов-на-Дону' },
//     { name_ru: 'Рио-де-Жанейро' },
//     { name_ru: 'Майами' },
//     { name_ru: 'Нижний Новгород' },
//     { name_ru: 'Нижний Тагил' },
// ]

export { genLUT };
