'use strict';

class ViewerData {
    #cityData;
    data = Object.create(null);
    lastAddedCityName = null;
    lastAddedIndex = -1;

    constructor(cityData) {
        this.#cityData = cityData;
    }

    addViewer(cityName) {
        this.data[cityName] = (this.data[cityName] ?? 0) + 1;
        this.lastAddedCityName = cityName;
    }

    generate() {
        let ret = [];
        for (const [cityName, viewers] of Object.entries(this.data)) {
            if (cityName === this.lastAddedCityName) {
                this.lastAddedIndex = ret.length;
            }
            const { lat, lng } = this.#cityData.getCityByName(cityName);
            ret.push([lat, lng, cityName, viewers]);
        }
        return ret;
    }

    backup() {
        return JSON.stringify(this.data);
    }

    restore(backup) {
        this.data = JSON.parse(backup);
    }

};

module.exports = ViewerData;
