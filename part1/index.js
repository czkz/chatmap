export default class {
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
        if (window.opener) {
            window.opener.postMessage('start', '*');
            return true;
        } else {
            console.log('Part1.start() failed - window.opener is null');
            return false;
        }
    }

    disable() {
        window.removeEventListener('message', this.#listener);
    }

};
