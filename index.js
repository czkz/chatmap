'use strict';
const cities = require('./cities');
const ViewerData = require('./viewerData')
const chart_mod = require('./chart');


const viewerData = new ViewerData(cities);
const chart = chart_mod.create();

let untipId = null;
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

    if (untipId != null) {
        // chart.dispatchAction({type: 'hideTip'});
        clearTimeout(untipId);
        untipId = null;
    }
    chart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: viewerData.lastAddedIndex
    });
    untipId = setTimeout(
        () => chart.dispatchAction({type: 'hideTip'}),
        1500
    );
};

(async function main() {

    await cities.load();
    // chart.create();

    const addRandomCities = () => {
        addPoint(cities.randomCity(5).name);
        setTimeout(addRandomCities, Math.random() * 3000);
    };
    setTimeout(addRandomCities, 2000);

})();
