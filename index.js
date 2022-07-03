'use strict';

const CSVToArray = (data, delimiter = ',', omitFirstRow = false) => data
    .slice(omitFirstRow ? data.indexOf('\n') + 1 : 0)
    .split('\n')
    .map(v => v.split(delimiter));

function convertData(cityName, viewers) {
    const cityInfo = cities[cityName];
    return [cityInfo.lat, cityInfo.lng, cityName, viewers];
}

function indexOfCity(data, cityName) {
    for (const i in data) {
        if (data[i][2] == cityName) {
            return i;
        }
    }
    return -1;
}

function randomCityName(n = Infinity) {
    const ck = Object.keys(cities);
    const i = Math.floor(Math.random() * Math.min(n, ck.length));
    return ck[i];
}

(async function() {

    const csv = await fetch('cities/worldcities_clean.csv')
        .then(resp => resp.text());
    const data = CSVToArray(csv, ',', true).reverse();
    const cities = Object.fromEntries(data.map(line => [
        line[0],
        {
            lat: line[1],
            lng: line[2],
            country: line[3],
            population: line[4],
        }
    ]));
    window.cities = cities;

    window.myChart = echarts.init(
        document.getElementById('chart-container'),
        null,
        {
            renderer: 'canvas',
            useDirtyRect: false
        }
    );

    window.rawData = [];
    window.nDataPoints = 0;

    let untipId = null;

    window.addPoint = function(cityName) {
        const info = cities[cityName];
        if (info == undefined) {
            console.log('Undefined city!');
            return;
        }

        const idx = indexOfCity(rawData, cityName);
        let viewers = 0;
        if (idx != -1) {
            viewers = rawData[idx][3];
            rawData.splice(idx, 1);
        }
        viewers += 1;
        rawData.push(convertData(cityName, viewers));

        // myChart.appendData({
        //     seriesIndex: 0,
        //     data: [convertData(cityName, rawData[cityName])]
        // });
        myChart.setOption({
            dataset: {
                source: rawData
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
            dataIndex: rawData.length - 1
        });
        untipId = setTimeout(
            () => myChart.dispatchAction({type: 'hideTip'}),
            1500
        );
    };

    const addRandomCities = () => {
        addPoint(randomCityName(10));
        setTimeout(addRandomCities, Math.random() * 3000);
    };
    addRandomCities();

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
        title: {
            text: '10000000 GPS Points',
            left: 'center',
            textStyle: {
                color: '#fff'
            }
        },
        geo: {
            map: 'world',
            roam: false,
            label: {
                emphasis: {
                    show: false
                }
            },
            silent: false,
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
                return params[3] + 5;
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

    addPoint('Moscow');

    window.addEventListener('resize', myChart.resize);
})();
