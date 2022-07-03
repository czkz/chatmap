'use strict';

const CSVToArray = (data, delimiter = ',', omitFirstRow = false) => data
    .slice(omitFirstRow ? data.indexOf('\n') + 1 : 0)
    .split('\n')
    .map(v => v.split(delimiter));

function convertData(inp) {
    const ret = [];
    for (const [cityName, viewers] of Object.entries(inp)) {
        const cityInfo = cities[cityName];
        ret.push([cityInfo.lng, cityInfo.lat, cityName, viewers]);
    }
    return ret;
}

(async function() {

    const csv = await fetch('cities/worldcities_clean.csv')
        .then(resp => resp.text());
    const data = CSVToArray(csv, ',', true);
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

    const myChart = echarts.init(
        document.getElementById('chart-container'),
        null,
        {
            renderer: 'canvas',
            useDirtyRect: false
        }
    );

    window.rawData = Object.create(null);

    window.addPoint = function(cityName) {
        const info = cities[cityName];
        if (info == undefined) {
            console.log('Undefined city!');
            return;
        }

        if (rawData[cityName] == undefined) {
            rawData[cityName] = 0;
        }
        rawData[cityName] += 1;

        myChart.appendData({
            seriesIndex: 0,
            data: convertData(rawData)
        });
    };

    const option = {
        tooltip: {},
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
            roam: true,
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
            data: []
        }
    };
    myChart.setOption(option);

    addPoint('Moscow');

    window.addEventListener('resize', myChart.resize);
})();
