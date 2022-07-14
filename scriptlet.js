(function() {
    globalThis.cleanup?.reverse().forEach(e => e()), globalThis.cleanup = [];

    const MessageExtractor = class {
        #lastId;
        #root;
		get root() { return this.#root; }

        constructor() {
            this.#root = (
                document.querySelector('#chatframe')?.contentDocument ?? document).querySelector('#chat #items');
        }

        fetchNew() {
            const a = Array.from(this.#root.querySelectorAll('yt-live-chat-text-message-renderer')).map(e => ({
                id: e.id,
                author: e.querySelector('#author-name').innerText,
                timestamp: e.querySelector('#timestamp').innerText,
                text: e.querySelector('#message').innerText,
            }));
            const b = a.slice(a.findIndex(e => e.id == this.#lastId) + 1);
            this.#lastId = a[a.length - 1].id;
            return b;
        }
    };

    const uri = 'http://127.0.0.1:9966';
    const msgExtractor = new MessageExtractor();
    const w = window.open(uri);
    cleanup.push(_ => w.close());
    const mo = new MutationObserver(() => {
        const newMsgs = msgExtractor.fetchNew();
        w.postMessage(JSON.stringify(newMsgs), uri);
    });
    const onMessage = function(event) {
        if (event.origin != uri) { return; }
        if (event.data != 'start') { return; }
        mo.observe(msgExtractor.root, { childList: true });
        cleanup.push(_ => mo.disconnect());
        removeEventListener('message', onMessage);
    };
    window.addEventListener('message', onMessage);
    cleanup.push(_ => removeEventListener('message', onMessage));
})();
