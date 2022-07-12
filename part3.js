'use strict';
const cities = require('./cities');
const ViewerData = require('./viewerData')
const chart_mod = require('./chart');
const TooltipManager = require('./tooltip');


module.exports = class {

    #viewerData = null;
    #chart = null;
    #tip = null;

    async init() {
        this.#viewerData = new ViewerData(cities);
        this.#chart = chart_mod.create();
        this.#tip = new TooltipManager(this.#chart);

        await cities.load();

        const addRandomCities = () => {
            addPoint(cities.randomCity(5).name);
            setTimeout(addRandomCities, Math.random() * 3000);
        };
        setTimeout(addRandomCities, 2000);

    }

    addViewer(cityName) {
        if (!cities.exists(cityName)) {
            console.log(`Undefined city "${cityName}"!`);
            return;
        }

        this.#viewerData.addViewer(cityName);

        this.#chart.setOption({
            dataset: {
                source: this.#viewerData.generate()
            }
        });

        this.#tip.show(this.#viewerData.lastAddedIndex);
    }

};
