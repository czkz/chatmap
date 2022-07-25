// import CityData from './CityData';
import Part1 from './part1/index.js';
import Part2 from './part2/index.js';
import Part3 from './part3/index.js';


window.part1 = new Part1();
window.part2 = await new Part2();
window.part3 = await new Part3();

window.bkp = function() {
    window.open().document.write(part3.backup());
};

part1.onNewMessages = function(msgs) {
    msgs.forEach(msg => {
        const cityName = part2.parseMsg(msg.text);
        if (cityName) {
            part3.addViewer(cityName);
        }
    });
};
part1.start();


const update = {
    id: null,
    triggerNow() {
        part3.update();
    },
    enable() {
        if (this.id === null) {
            this.id = setInterval(() => {
                this.triggerNow();
            }, 1000);
        }
    },
    disable() {
        clearInterval(this.id);
        this.id = null;
    }
};

window.addEventListener('click', () => { part3.tip.inhibit(); });
window.addEventListener('mousedown', () => {
    update.disable();
    part3.tip.hide();
});
window.addEventListener('mouseup', () => { update.enable(); });
window.addEventListener('wheel', () => {
    update.disable();
    update.enable();
    part3.tip.hide();
}, true);

update.enable();

// const cities = await new CityData();
//
// const addRandomCities = () => {
//     part3.addViewer(cities.randomCity(5).name);
//     setTimeout(addRandomCities, Math.random() * 3000);
// };
// setTimeout(addRandomCities, 2000);
