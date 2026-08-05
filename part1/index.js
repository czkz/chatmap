import { apiFetchRetry } from "./api.js";

export default class {
    #nextPageToken = '';
    #lastDelay = 0;
    #enabled = false;
    onNewMessages = null;

    async start(liveChatId) {
        this.#enabled = true;
        do {
            // https://developers.google.com/youtube/v3/live/docs/liveChatMessages#resource
            const response = await apiFetchRetry('liveChat/messages', {
                liveChatId,
                part: 'snippet',
                pageToken: this.#nextPageToken,
            });
            this.#nextPageToken = response.nextPageToken;
            response.items
                .filter(item => item.snippet.type == 'textMessageEvent')
                .map(item => ({
                    id: item.id,
                    author: item.authorDetails?.displayName, // need to add authorDetails to request.part
                    timestamp: item.snippet.publishedAt, // here as ISO string
                    text: item.snippet.textMessageDetails.messageText,
                }))
                .forEach(msg => setTimeout(() => this.onNewMessages?.([msg]), Math.random() * this.#lastDelay));
            const delay = Math.max(response.pollingIntervalMillis, 2000);
            this.#lastDelay = delay;
            await new Promise(r => setTimeout(r, delay));
        } while (this.#nextPageToken && this.#enabled);
    }

    disable() {
        this.#enabled = false;
    }

};
