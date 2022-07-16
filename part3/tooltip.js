class TooltipManager {
    #untipId = null;
    #chart = null;
    #disabled = false;
    #enableId = null;

    #timeout = 1500;
    #inhibitTimeout = 3000;

    constructor(chart) {
        this.#chart = chart;
    }

    #clearTimeout() {
        if (this.#untipId != null) {
            clearTimeout(this.#untipId);
            this.#untipId = null;
        }
    }

    show(dataIndex) {
        if (this.#disabled) {
            return;
        }
        this.#clearTimeout();
        this.#chart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: dataIndex
        });
        this.#untipId = setTimeout(() => this.hide(), this.#timeout);
    }

    hide() {
        this.#chart.dispatchAction({type: 'hideTip'});
    }

    inhibit() {
        if (this.#enableId !== null) {
            clearTimeout(this.#enableId);
            this.#enableId = null;
        }
        this.#enableId = setTimeout(() => {
            this.#disabled = false;
            this.#enableId = null;
            this.hide();
        }, this.#inhibitTimeout);
        this.#disabled = true;
        this.#clearTimeout();
    }

};

export default TooltipManager;
