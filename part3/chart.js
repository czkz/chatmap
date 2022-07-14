'use strict';
const echarts = require('echarts');
const world = require('./world.min.js');
const hash = require('./murmur').hash;

let myChart = null;

const hashSeed = crypto.getRandomValues(new Uint32Array(1))[0];

function create() {
    if (myChart !== null) {
        return myChart;
    }
    myChart = echarts.init(
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
            roam: true,
            emphasis: {
                label: {
                    show: false
                },
                itemStyle: {
                    areaColor: '#2a333d'
                }
            },
            silent: true,
            itemStyle: {
                areaColor: '#323c48',
                borderColor: '#111'
            }
        },
        dataset: {
            dimensions: ['lat', 'lng', 'city', 'viewers'],
            source: []
        },
        series: {
            type: 'scatter',
            coordinateSystem: 'geo',
            geoIndex: 0,
            symbolSize: function (value) {
                const x = value[3];
                const scale = 20;
                const smooth = 3;
                return (x * scale) / (x + smooth);
            },
            itemStyle: {
                color: function(params) {
                    const h2rgb2 = t => [0, 1, 2].map(e => Math.cos((e / 3 - t) * Math.PI * 2) * 0.5 + 0.5);
                    const color = h2rgb2(hash(params.value[2], hashSeed) / 2**32);
                    return `rgb(${color.map(e => Math.floor(e * 256)).join(', ')})`;
                }
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

    return myChart;
}

module.exports = {
    create
};
