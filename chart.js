'use strict';
const echarts = require('echarts');
const world = require('./world.min.js');

let myChart = null;

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
            roam: false,
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

    return myChart;
}

module.exports = {
    create
};
