'use strict';
const cities = require('./cities');
const ViewerData = require('./viewerData')
const chart_mod = require('./chart');
const TooltipManager = require('./tooltip');


const viewerData = new ViewerData(cities);
const chart = chart_mod.create();
const tip = new TooltipManager(chart);

function addPoint(cityName) {
    if (!cities.exists(cityName)) {
        console.log(`Undefined city "${cityName}"!`);
        return;
    }

    viewerData.addViewer(cityName);

    chart.setOption({
        dataset: {
            source: viewerData.generate()
        }
    });

    tip.show(viewerData.lastAddedIndex);
}

(async function main() {

    await cities.load();
    // chart.create();

    const addRandomCities = () => {
        addPoint(cities.randomCity(5).name);
        setTimeout(addRandomCities, Math.random() * 3000);
    };
    setTimeout(addRandomCities, 2000);

})();
