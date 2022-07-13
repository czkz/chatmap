'use strict';
// const CityData = require('./CityData');
const Part2 = require('./part2');
// const Part3 = require('./part3');


(async function main() {

    window. part2 = await new Part2(500);
    part2.parseMsg('Привет из Урюпинска!');

    // const cities = await new CityData();
    // const part3 = await new Part3();
    //
    // const addRandomCities = () => {
    //     part3.addViewer(cities.randomCity(5).name);
    //     setTimeout(addRandomCities, Math.random() * 3000);
    // };
    // setTimeout(addRandomCities, 2000);

})();
