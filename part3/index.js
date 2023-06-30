import CityData from '../CityData.js';
import ViewerData from './ViewerData.js';
import * as chart_module from './chart.js';
import TooltipManager from './tooltip.js';


export default class {

    #cityData = null;
    #viewerData = null;
    #prevRawData = null;
    #chart = null;
    tip = null;
    #newTip = false;

    constructor() {
        return (async () => {
            this.#cityData = await new CityData();
            this.#viewerData = new ViewerData(this.#cityData);
            this.#chart = chart_module.create();
            this.tip = new TooltipManager(this.#chart);
            return this;
        })();
    }

    addViewer(cityName) {
        if (!this.#cityData.exists(cityName)) {
            console.log(`Undefined city "${cityName}"!`);
            return;
        }

        this.#viewerData.addViewer(cityName);
        this.#newTip = true;
    }

    inhibitTooltip() {
        this.tip.inhibit();
    }

    update() {
        window.rawData = this.#viewerData.generate();
        if (this.#prevRawData !== rawData) {
            this.#chart.setOption({
                dataset: {
                    source: window.rawData
                },
                graphic: chart_module.genTotalGraphic(
                    this.#viewerData.nViewers,
                    this.#viewerData.nCities
                )
            });
            if (this.#newTip == true) {
                this.tip.show(this.#viewerData.lastAddedIndex);
                this.#newTip = false;
            }
        }
    }

    backup() {
        return this.#viewerData.backup();
    }

    restore(backup) {
        this.#viewerData.restore(backup);
    }

};
