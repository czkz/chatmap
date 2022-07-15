(function() {
    globalThis.cleanup?.reverse().forEach(e => e()), globalThis.cleanup = [];

    const MessageExtractor = class {
        #lastId;

        fetchNew() {
            const a = Array.from((document.querySelector('#chatframe')?.contentDocument ?? document)
                .querySelectorAll('#chat #items yt-live-chat-text-message-renderer'))
                .map(e => ({
                    id: e.id,
                    author: e.querySelector('#author-name').innerText,
                    timestamp: e.querySelector('#timestamp').innerText,
                    text: e.querySelector('#message').innerText,
                }));
            const b = a.slice(a.findIndex(e => e.id == this.#lastId) + 1);
            this.#lastId = a[a.length - 1]?.id;
            return b;
        }
    };

    const uri = 'http://127.0.0.1:8080';
    const msgExtractor = new MessageExtractor();
    const w = window.open(uri);
    cleanup.push(_ => w.close());

    const sendData = () => {
        const newMsgs = msgExtractor.fetchNew();
        if (newMsgs.length > 0) {
            w.postMessage(JSON.stringify(newMsgs), uri);
        }
    }

    let onStart;

    // MutationObserver should provide better performance,
    // but breaks when switching from "Top chat" to "Live chat"
    const useMutationObserver = false;
    if (useMutationObserver) {
        const mo = new MutationObserver(sendData);
        onStart = () => {
            mo.observe((document.querySelector('#chatframe')?.contentDocument ?? document).querySelector('#chat #items'), { childList: true });
            cleanup.push(_ => mo.disconnect());
        };
    } else {
        onStart = () => {
            const id = setInterval(sendData, 1000);
            cleanup.push(_ => clearInterval(id));
        };
    }

    const onMessage = function(event) {
        if (event.origin != uri) { return; }
        if (event.data != 'start') { return; }
        onStart();
        removeEventListener('message', onMessage);
    };
    window.addEventListener('message', onMessage);
    cleanup.push(_ => removeEventListener('message', onMessage));

})();
