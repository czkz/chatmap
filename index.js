'use strict';
window. cities = require('./cities');
const ViewerData = require('./viewerData')

function convertData(cityName, viewers) {
    const cityInfo = cities.getCityByName(cityName);
    return [cityInfo.lat, cityInfo.lng, cityInfo.name, viewers];
}

function randomCityName(n = Infinity) {
    const i = Math.floor(Math.random() * Math.min(n, cities.data.length));
    return cities.data[i].name;
}




const echarts = require('echarts');
const world = require('./world.min.js');

async function init() {
    window.myChart = echarts.init(
        document.getElementById('chart-container'),
        null,
        {
            renderer: 'canvas',
            useDirtyRect: false
        }
    );

    const option = {
        tooltip: {
            triggerOn: 'click',
            backgroundColor: '#0000',
            borderColor: '#0000',
            padding: 0,
            position: 'top',
            textStyle: {
                color: '#ffffff'
            },
            formatter: (params) => {
                return `${params.value[2]}: ${params.value[3]}`;
            }
        },
        backgroundColor: '#000',
        // title: {
        //     text: 'Some title here',
        //     left: 'center',
        //     textStyle: {
        //         color: '#fff'
        //     }
        // },
        geo: {
            map: 'world',
            roam: false,
            label: {
                emphasis: {
                    show: false
                }
            },
            silent: true,
            itemStyle: {
                normal: {
                    areaColor: '#323c48',
                    borderColor: '#111'
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            }
        },
        dataset: {
            dimensions: ['lat', 'lng', 'city', 'viewers'],
            source: []
        },
        series: {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            geoIndex: 0,
            symbolSize: function (params) {
                return (params[3] - 1) * 1.5 + 5;
            },
            itemStyle: {
                color: '#F6F6F6'
            },
            encode: {
                lat: 'lat',
                lng: 'lng',
                tooltip: ['city', 'viewers'],
                itemId: 'city',
                itemGroupId: 'city',
            },
        }
    };
    myChart.setOption(option);

    window.addEventListener('resize', myChart.resize);
}

const viewerData = new ViewerData(cities);
let untipId = null;
function addPoint(cityName) {
    if (!cities.exists(cityName)) {
        console.log(`Undefined city "${cityName}"!`);
        return;
    }

    viewerData.addViewer(cityName);

    // myChart.appendData({
    //     seriesIndex: 0,
    //     data: [convertData(cityName, rawData[cityName])]
    // });
    myChart.setOption({
        dataset: {
            source: viewerData.generate()
        }
    });

    if (untipId != null) {
        // myChart.dispatchAction({type: 'hideTip'});
        clearTimeout(untipId);
        untipId = null;
    }
    myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: viewerData.lastAddedIndex
    });
    untipId = setTimeout(
        () => myChart.dispatchAction({type: 'hideTip'}),
        1500
    );
};

(async function main() {

    await cities.load();
    await init();

    const addRandomCities = () => {
        addPoint(randomCityName(5));
        setTimeout(addRandomCities, Math.random() * 3000);
    };
    setTimeout(addRandomCities, 2000);

})();
