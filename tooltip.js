'use strict';

class TooltipManager {
    #untipId = null;
    #chart = null;

    timeout = 1500;

    constructor(chart) {
        this.#chart = chart;
    }

    show(dataIndex) {
        if (this.#untipId != null) {
            clearTimeout(this.#untipId);
            this.#untipId = null;
        }
        this.#chart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: dataIndex
        });
        this.#untipId = setTimeout(() => this.hide(), this.timeout);
    }

    hide() {
        this.#chart.dispatchAction({type: 'hideTip'});
    }

};

module.exports = TooltipManager;
