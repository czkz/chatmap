'use strict';
const cities = require('./cities');
const Part3 = require('./part3');


(async function main() {

    await cities.load();

    const part3 = new Part3();
    await part3.init();

    const addRandomCities = () => {
        part3.addViewer(cities.randomCity(5).name);
        setTimeout(addRandomCities, Math.random() * 3000);
    };
    setTimeout(addRandomCities, 2000);

})();
