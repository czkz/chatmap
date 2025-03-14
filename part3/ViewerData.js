class ViewerData {
    #cityData;
    data = Object.create(null);
    lastAddedCityName = null;
    lastAddedIndex = -1;
    nViewers = 0;
    nCities = 0;

    constructor(cityData) {
        this.#cityData = cityData;
    }

    addViewer(cityName) {
        const viewers = this.data[cityName] ?? 0;
        this.data[cityName] = viewers + 1;
        if (viewers == 0) {
            // this.lastAddedCityName = cityName;
            this.nCities++;
        }
        this.nViewers++;
        this.lastAddedCityName = cityName;
    }

    generate() {
        let ret = [];
        for (const [cityName, viewers] of Object.entries(this.data)) {
            if (cityName === this.lastAddedCityName) {
                this.lastAddedIndex = ret.length;
            }
            const { lat, lng, name, name_ru, country } = this.#cityData.getCityByName(cityName);
            const label = (country == 'Russia' ? name_ru : name);
            ret.push([lat, lng, cityName, viewers, label]);
        }
        return ret;
    }

    backup() {
        return JSON.stringify(this.data);
    }

    restore(backup) {
        this.data = JSON.parse(backup);
        Object.entries(this.data).forEach(([k, v]) => {
            this.nCities++;
            this.nViewers += v;
        })
    }

};

export default ViewerData;
