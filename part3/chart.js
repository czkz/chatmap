'use strict';
import * as echarts from 'https://fastly.jsdelivr.net/npm/echarts@5.3.3/dist/echarts.esm.js';
import { hash } from './murmur.js';

const world = await fetch('https://fastly.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json').then(e => e.json());
echarts.registerMap('world', {geoJSON: world});

let myChart = null;

const hashSeed = crypto.getRandomValues(new Uint32Array(1))[0];

let totalGraphicScale = 0.7;
let totalGraphicFont = '60px "Open Sans", sans-serif';
let totalGraphicPos = [30, 30];

function genTotalGraphic(viewers, cities) {
    return {
        id: 'total',
        type: 'text',
        right: totalGraphicPos[0],
        top: totalGraphicPos[1],
        scaleX: totalGraphicScale,
        scaleY: totalGraphicScale,
        transition: 'all',
        style: {
            text: `{user|}${viewers}\n{city|}${cities}`,
            font: totalGraphicFont,
            fill: 'rgba(100, 100, 100, 0.75)',
            rich: {
                city: {
                    backgroundColor: {
                        image: `data:image/svg+xml,%3Csvg width='800px' height='800px' viewBox='0 0 24 31' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 1.9967C12.4142 1.9967 12.75 2.33249 12.75 2.7467V4H14.75C15.7165 4 16.5 4.7835 16.5 5.75V11H18.75C19.7165 11 20.5 11.7835 20.5 12.75V20.25C20.5 21.2165 19.7165 22 18.75 22H9.75452L9.75 22H5.25C4.2835 22 3.5 21.2165 3.5 20.25V11.8206C3.5 11.2017 3.82689 10.6289 4.35972 10.314L7.5 8.45837V5.75C7.5 4.7835 8.2835 4 9.25 4H11.25V2.7467C11.25 2.33249 11.5858 1.9967 12 1.9967ZM9 8.01845C9.8097 8.13845 10.5 8.82503 10.5 9.75242V20.5H13.5V12.75C13.5 11.8684 14.1519 11.139 15 11.0177V5.75C15 5.61193 14.8881 5.5 14.75 5.5H12.0094L12 5.50006L11.9906 5.5H9.25C9.11193 5.5 9 5.61193 9 5.75V8.01845ZM15.25 12.5C15.1119 12.5 15 12.6119 15 12.75V20.5H18.75C18.8881 20.5 19 20.3881 19 20.25V12.75C19 12.6119 18.8881 12.5 18.75 12.5H15.25ZM8.62282 9.53719L5.12282 11.6054C5.0467 11.6504 5 11.7322 5 11.8206V20.25C5 20.3881 5.11193 20.5 5.25 20.5H9V9.75242C9 9.55885 8.78947 9.43871 8.62282 9.53719Z' fill='rgba(100, 100, 100, 0.75)'/%3E%3C/svg%3E`
                    },
                    height: 50,
                },
                user: {
                    backgroundColor: {
                        image: `data:image/svg+xml,%3Csvg width='800px' height='800px' viewBox='0 0 28 36' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3Eic_fluent_people_28_regular%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='🔍-Product-Icons' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='ic_fluent_people_28_regular' fill='rgba(100, 100, 100, 0.75)' fill-rule='nonzero'%3E%3Cpath d='M4,16 L15,16.001 C16.0538182,16.001 16.9181157,16.8164855 16.9945109,17.8516842 L17,18.001 L17,20.5 C16.999,24.7 12.713,26 9.5,26 C6.35126,26 2.1710504,24.75148 2.00510151,20.7485328 L2,20.5 L2,18 C2,16.9461818 2.81639669,16.0818843 3.85080841,16.0054891 L4,16 Z M24,16 L24.1491916,16.0054891 C25.1318827,16.0780645 25.9178153,16.8617218 25.9939518,17.8434235 L26,18 L26,20 C25.999,23.759 22.57,25 20,25 C18.942,25 17.741,24.785 16.691,24.275 C17.009,23.897 17.278,23.477 17.488,23.007 C18.4456,23.427 19.4789867,23.4924578 19.9157784,23.4993188 L20.2043433,23.4963225 C21.2400556,23.4606629 24.334766,23.1116572 24.4936471,20.2325914 L24.5,20 L24.5,18 C24.5,17.7546667 24.3222222,17.5504198 24.0895748,17.5080604 L24,17.5 L17.949,17.501 C17.865,16.999625 17.6554375,16.5434219 17.3544785,16.1605273 L17.22,16.001 L24,16 Z M4,17.5 L3.899344,17.51 C3.77496,17.53528 3.69,17.6028 3.646,17.646 C3.6028,17.69 3.53528,17.77432 3.51,17.89896 L3.5,18 L3.5,20.5 C3.5,21.839 4.087,22.829 5.295,23.525 C6.29135714,24.1007143 7.68434694,24.4479337 9.15851093,24.4945991 L9.5,24.5 L9.93487113,24.4897846 C11.4554554,24.4219073 15.3140372,23.9331951 15.4935181,20.7322803 L15.5,20.499 L15.5,18.001 C15.5,17.7565556 15.3222222,17.5516173 15.0895748,17.5090933 L15,17.501 L4,17.5 Z M9.5,3 C12.538,3 15,5.463 15,8.5 C15,11.537 12.538,14 9.5,14 C6.462,14 4,11.537 4,8.5 C4,5.463 6.462,3 9.5,3 Z M20.5,5 C22.985,5 25,7.015 25,9.5 C25,11.985 22.985,14 20.5,14 C18.015,14 16,11.985 16,9.5 C16,7.015 18.015,5 20.5,5 Z M9.5,4.5 C7.294,4.5 5.5,6.294 5.5,8.5 C5.5,10.706 7.294,12.5 9.5,12.5 C11.706,12.5 13.5,10.706 13.5,8.5 C13.5,6.294 11.706,4.5 9.5,4.5 Z M20.5,6.5 C18.846,6.5 17.5,7.846 17.5,9.5 C17.5,11.154 18.846,12.5 20.5,12.5 C22.154,12.5 23.5,11.154 23.5,9.5 C23.5,7.846 22.154,6.5 20.5,6.5 Z' id='🎨-Color'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E`,
                    },
                    height: 50,
                },
            },
        },
        z: 100,
        // onmousewheel: function(e) {
        //     totalGraphicScale *= 1 + e.wheelDelta * 0.1;
        //     console.log('Total scale:', totalGraphicScale);
        // },
        onclick: function(event) {
            // if (totalGraphicScale >= 1) {
            //     totalGraphicScale *= 0.5;
            // } else {
            //     totalGraphicScale *= 2;
            // }
            // if (totalGraphicFont == 'lighter 60px sans-serif') {
            //     totalGraphicFont = 'normal 60px sans-serif';
            // } else {
            //     totalGraphicFont = 'lighter 60px sans-serif';
            // }
            if (totalGraphicPos[1] == 30) {
                totalGraphicPos = [90, 90];
            } else {
                totalGraphicPos = [30, 30];
            }
        },
    };
}

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
        graphic: genTotalGraphic(0, 0),
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

export { create, genTotalGraphic };
