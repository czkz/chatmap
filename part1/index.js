'use strict';


module.exports = class {
    #listener;

    onNewMessages = null;

    constructor() {
        this.#listener = function(event) {
            if (this.onNewMessages) {
                this.onNewMessages(JSON.parse(event.data));
            }
        }.bind(this);
        window.addEventListener('message', this.#listener);
    }

    start() {
        window.opener.postMessage('start', '*');
    }

    disable() {
        window.removeEventListener('message', this.#listener);
    }

};
