export default function() {
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

    const uri = 'https://czkz.github.io/chatmap/map.html';
    const msgExtractor = new MessageExtractor();
    const w = window.open(uri);
    cleanup.push(_ => w.close());

    const sendData = () => {
        const newMsgs = msgExtractor.fetchNew();
        if (newMsgs.length > 0) {
            w.postMessage(JSON.stringify(newMsgs), uri);
        }
    };

    const onStart = () => {
        const id = setInterval(sendData, 500);
        cleanup.push(_ => clearInterval(id));
    };

    const onMessage = function(event) {
        if (!uri.startsWith(event.origin)) { return; }
        if (event.data != 'start') { return; }
        onStart();
        removeEventListener('message', onMessage);
    };
    window.addEventListener('message', onMessage);
    cleanup.push(_ => removeEventListener('message', onMessage));

}
