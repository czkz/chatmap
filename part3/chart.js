'use strict';
import * as echarts from 'https://fastly.jsdelivr.net/npm/echarts@5.3.3/dist/echarts.esm.js';
import { hash } from './murmur.js';

const world = await fetch('https://fastly.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json').then(e => e.json());
echarts.registerMap('world', {geoJSON: world});

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
                disabled: true,
                label: {
                    show: true,
                    color: "#ffffff"
                },
                itemStyle: {
                    areaColor: '#161b21'
                }
            },
            silent: false,
            tooltip: {
                show: true,
                position: 'inside'
            },
            animation: false,
            itemStyle: {
                areaColor: '#101010',
                borderColor: '#404040'
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

export { create };
