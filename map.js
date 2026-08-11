import Part1 from './part1/index.js';
import Part2 from './part2/index.js';
import Part3 from './part3/index.js';
import { fetchLiveStreamingDetails, fetchTopStream, GoogleApiError } from './part1/api.js';


const part1 = new Part1();
const part2 = await new Part2();
const part3 = await new Part3();
window.part1 = part1;
window.part2 = part2;
window.part3 = part3;

window.bkp = function() {
    window.open().document.writeln(part3.backup());
};

part1.onNewMessages = function(msgs) {
    msgs.forEach(msg => {
        const cityName = part2.parseMsg(msg.text);
        if (cityName) {
            part3.addViewer(cityName);
        }
    });
};

document.getElementById('reset-button').addEventListener('click', () => {
    localStorage.removeItem('settings');
    location.reload();
});
const { channelId, apiKey } = await new Promise(resolve => {
    const stored = JSON.parse(localStorage.getItem('settings'));
    if (stored) { return resolve(stored); }
    document.getElementById('setup-dialog').showModal();
    document.getElementById('setup-dialog').addEventListener('submit', () => {
        const channelId = document.getElementById('channel-id').value;
        const apiKey = document.getElementById('api-key').value;
        localStorage.setItem('settings', JSON.stringify({ channelId, apiKey }));
        resolve({ channelId, apiKey });
    });
});
globalThis.apiKey = apiKey;
try {
    await async function startPart1() {
        const videoId = new URL(location).searchParams.get('v') ?? await fetchTopStream(channelId);
        console.log(`Selected video https://youtu.be/${videoId}`);
        const liveStreamingDetails = await fetchLiveStreamingDetails(videoId);
        const liveChatId = liveStreamingDetails?.activeLiveChatId;
        if (liveChatId === undefined) {
            console.log('Live chat is not available');
            return;
        }
        const startTime = Date.parse(liveStreamingDetails.scheduledStartTime);
        const untilStart = startTime - Date.now();
        if (untilStart > 10 * 60 * 1000) {
            console.log(`Broadcast scheduled in ${Math.round(untilStart / 60_000)}m, waiting`);
            await new Promise(r => setTimeout(r, untilStart - 10 * 60 * 1000));
        }
        part1.start(liveChatId);
    }();
} catch (err) {
    if (err instanceof GoogleApiError && err.error.details[0].reason == 'API_KEY_INVALID') {
        alert(err.error.message);
        localStorage.removeItem('settings');
        location.reload();
    } else {
        console.log('Initialization failed');
    }
    throw err;
}


const update = {
    id: null,
    triggerNow() {
        part3.update();
    },
    enable() {
        if (this.id === null) {
            this.id = setInterval(() => {
                this.triggerNow();
            }, 500);
        }
    },
    disable() {
        clearInterval(this.id);
        this.id = null;
    }
};

window.addEventListener('click', () => { part3.tip.inhibit(); });
window.addEventListener('mousedown', () => {
    update.disable();
    part3.tip.hide();
});
window.addEventListener('mouseup', () => { update.enable(); });
window.addEventListener('wheel', () => {
    update.disable();
    update.enable();
    part3.tip.hide();
}, true);

update.enable();

// import CityData from './CityData.js';
// const cities = await new CityData();
// const addRandomCities = () => {
//     const arr = Array.from(new Array(10)).map(
//         () => ({ text: `Hello from ${cities.randomCity(30).name}` })
//     );
//     part1.onNewMessages(arr);
//     setTimeout(addRandomCities, 4000 + Math.random() * 1000);
// };
// setTimeout(addRandomCities, 2000);
