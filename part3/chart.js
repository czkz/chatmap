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
            textStyle: {
                color: '#ffffff'
            },
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
            animation: false,
            silent: false,
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
            itemStyle: {
                areaColor: '#101010',
                borderColor: '#808080'
            },
            tooltip: {
                position: function (point, params, dom, rect, size) {
                    const countryCenter = [
                        rect.x + rect.width / 2,
                        rect.y + rect.height / 2,
                    ];
                    const isVisible = p => (
                        p[0] > 0 &&
                        p[1] > 0 &&
                        p[0] < size.viewSize[0] &&
                        p[1] < size.viewSize[1]
                    );
                    const cSize2 = size.contentSize.map(e => e / 2);
                    // p0, p1 - corners of the bounding box of the label
                    const p0 = [
                        countryCenter[0] - cSize2[0],
                        countryCenter[1] - cSize2[1],
                    ];
                    const p1 = [
                        countryCenter[0] + cSize2[0],
                        countryCenter[1] + cSize2[1],
                    ];
                    const labelFullyVisible = isVisible(p0) && isVisible(p1);
                    // From countryCenter to mouse pointer
                    const dist = Math.sqrt(
                        (countryCenter[0] - point[0]) ** 2 +
                        (countryCenter[1] - point[1]) ** 2
                    );
                    if (labelFullyVisible && dist < 200) {
                        return p0;
                    } else {
                        // Just above the mouse pointer
                        return [
                            point[0] - cSize2[0],
                            point[1] - cSize2[1] * 2 - 10,
                        ];
                    }
                }
            },
        },
        dataset: {
            dimensions: ['lat', 'lng', 'city', 'viewers', 'label'],
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
            tooltip: {
                position: 'top',
                formatter: (params) => {
                    return `${params.value[4]}: ${params.value[3]}`;
                }
            }
        }
    };
    myChart.setOption(option);

    window.addEventListener('resize', myChart.resize);

    return myChart;
}

export { create };
