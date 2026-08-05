export class GoogleApiError extends Error {
    constructor(res) {
        super(res.error.message);
        this.name = 'GoogleApiError';
        this.error = res.error;
    }
}

export async function apiFetch(path, params) {
    const apiKey = globalThis.apiKey;
    const base = 'https://www.googleapis.com/youtube/v3';
    const res = await fetch(
        `${base}/${path}?${new URLSearchParams(params)}`,
        { headers: { 'x-goog-api-key': apiKey } }
    ).then(res => res.json());
    if (res.error) { throw new GoogleApiError(res); }
    return res;
}

export async function apiFetchRetry(path, params) {
    let i = 0;
    while (true) {
        try {
            return await apiFetch(path, params);
        } catch (err) {
            i++;
            console.error(`apiFetch failed #${i}`);
            if (i == 5) { throw err; }
            await new Promise(r => setTimeout(r, (2 ** i) * 1000));
        }
    }
}

export async function fetchLiveChatId(videoId) {
    const res = await apiFetch('videos', { part: 'liveStreamingDetails', id: videoId });
    return res.items[0].liveStreamingDetails?.activeLiveChatId;
}

export async function fetchTopStream(channelId) {
    // limited to 100 requests per day
    const f = eventType => apiFetch('search', {
        part: 'id',
        channelId,
        eventType,
        type: 'video',
        maxResults: 1,
        order: 'viewCount',
    });
    let res = await f('live');
    if (res.items.length == 0) {
        res = await f('upcoming');
    }
    if (res.items.length == 0) {
        throw new Error('channel has no live or upcoming livestreams');
    }
    return await res.items[0].id.videoId;
}
