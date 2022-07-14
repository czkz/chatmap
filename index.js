'use strict';
// const CityData = require('./CityData');
const Part1 = require('./part1');
const Part2 = require('./part2');
const Part3 = require('./part3');


(async function main() {

    const part1 = new Part1();
    const part2 = await new Part2(500);
    const part3 = await new Part3();

    part1.onNewMessages = function(msgs) {
        msgs.forEach(msg => {
            const cityName = part2.parseMsg(msg.text);
            if (cityName) {
                part3.addViewer(cityName);
            }
        });
    };
    part1.start();

    setInterval(() => part3.update(), 1000);

    // const cities = await new CityData();
    //
    // const addRandomCities = () => {
    //     part3.addViewer(cities.randomCity(5).name);
    //     setTimeout(addRandomCities, Math.random() * 3000);
    // };
    // setTimeout(addRandomCities, 2000);

})();
