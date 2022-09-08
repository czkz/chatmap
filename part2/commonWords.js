import { toJSON as csvToJSON } from '../csv.js';

let sharedData = null;

export default class {
    data = null;

    constructor() {
        return (async () => {
            if (sharedData === null) {
                const csv = await fetch('commonWords/commonWords.csv')
                    .then(resp => resp.text());
                sharedData = new Set(csv.split('\n'));
            }
            this.data = sharedData;
            return this;
        })();
    }

    has(word) {
        return this.data.has(word);
    }

};
