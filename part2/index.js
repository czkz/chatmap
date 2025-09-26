import { genLUT, stripAccent } from './lut.js';

export default class {

    #lut = Object.create(null);

    constructor() {
        return (async () => {
            this.#lut = genLUT();
            return this;
        })();
    }

    parseMsg(msg) {
        const msgWords = stripAccent(msg)
            // .toLowerCase()
            .replaceAll(/[^a-zа-я0-9\u0456 ]/giu, ' ')
            .replaceAll(/ +/g, ' ')
            .split(' ');
        for (let i = 0; i < msgWords.length; i++) {
            const cityWords = msgWords.slice(i);
            const firstRes = this.#lut[cityWords[0]];
            if (firstRes !== undefined) {
                const cityWordsJoined = cityWords.join(' ');
                for (const { name, city } of firstRes) {
                    if (cityWordsJoined.startsWith(stripAccent(name).replaceAll('-', ' '))) {
                        console.log(`Found city ${city} for msg "${msg}"`);
                        return city;
                    }
                }
            }
        }
        return null;
    }

};
