'use strict';
const CityData = require('./CityData');
const Part3 = require('./part3');


(async function main() {

    const cities = await new CityData();
    const part3 = await new Part3();

    const addRandomCities = () => {
        part3.addViewer(cities.randomCity(5).name);
        setTimeout(addRandomCities, Math.random() * 3000);
    };
    setTimeout(addRandomCities, 2000);

})();
