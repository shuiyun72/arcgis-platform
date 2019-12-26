import {
    normalize
} from "path";
import echarts from "echarts";
import _ from "lodash";


const myThemeColor = ['#00a1c5', '#ec4a4c', '#49bc6c', '#ff9000', '#2fd4c0', '#e746da', '#ffc700', '#9946e7']
const myThemeLightColor = ['#0091da', '#ec4a4c', '#2edac5', '#49c26e', '#ff9000', '#e746da', '#ffc700', '#a960ed']
const KPIPieColor =['#49bc6c', '#ff9000', '#ef6c02', '#efaf02', '#267ee0','#0bccd8', '#49bc6c', '#ff9000', '#2fd4c0', '#e746da', '#ffc700', '#9946e7']
//柱形图带伸缩
export const ChartBarZoom = {
    title: {
        text: "数量统计",
        x: 'center'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
            label: {
                show: true
            }
        }
    },
    legend: {
        data: [],
        x: 'left'
    },
    grid: {
        top: '20%',
        left: '10%',
        right: '16%',
        containLabel: true
    },
    toolbox: {
        show: true,
        feature: {
            restore: {
                show: true
            },
            saveAsImage: {
                show: true
            }
        }
    },
    calculable: true,
    xAxis: [{
        type: 'category',
        data: [1, 2]
    }],
    yAxis: [{
        type: 'value'
    }],
    dataZoom: [{
        show: true,
        start: 0,
        end: 100
    }],
    series: [{
        name: '数量',
        type: 'bar',
        data: [1, 2],
        markPoint: {
            data: [{
                type: 'max',
                name: '最大值'
            }, {
                type: 'min',
                name: '最小值'
            }]
        },
        markLine: {
            data: [{
                type: 'average',
                name: '平均值'
            }]
        }
    }]
}
//GIS柱状图
export const ChartBarZoomGIS = {
    title: {
        text: "数量统计",
        x: 'center',
        textStyle: {
            color: '#fff',
            fontWeight: 400,
            fontSize: 18,
            fontFamily: 'AdobeHeitiStd-Regular',
            letterSpacing: 0.9,
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
            label: {
                show: true,
                color: '#000'
            },
        },
        backgroundColor: '#fff',
        padding: 10,
        textStyle: {
            color: '#000'
        }
    },
    legend: {
        data: [],
        x: 'left',
        textStyle: {
            color: '#000',
            fontSize: 16
        }
    },

    grid: {
        top: '80px',
        left: '6%',
        right: '6%',
        bottom: '10%',
        containLabel: true
    },
    // toolbox: {
    //     show: fa,
    //     feature: {
    //         restore: {
    //             show: true
    //         },
    //         saveAsImage: {
    //             show: true
    //         }
    //     },
    //     iconStyle: {
    //         borderColor: '#afbcc4;',
    //     }
    // },
    calculable: true,
    xAxis: [{
        type: 'category',
        data: [1, 2],
        splitLine: { 
            lineStyle:{
                color:'#484d57',
                type:'dashed',
            }
         },
        axisLine: {
            lineStyle: {
                color: 'rgba(255,255,255,0.8)',
            }
        },
    }],
    yAxis: [{
        type: 'value',
        splitLine: { 
            lineStyle:{
                color:'#484d57',
                type:'dashed',
            }
         },
        axisLine: {
            lineStyle: {
                color: 'rgba(255,255,255,0.8)',
            }
        },
    }],
    dataZoom: [{
        show: true,
        start: 0,
        end: 100,
        bottom: '3%',
        dataBackground: {
            areaStyle: {
                color: "#00c3aa"
            }
        },
    }],
    series: [{
        name: '数量',
        type: 'bar',
        data: [1, 2],
        itemStyle: {
            normal: {
                color: '#00a1c5'
            }
        },
        markPoint: {
            symbol:'path://M864 305.408h-704C73.472 305.408 2.56 376.32 2.56 462.848s70.912 157.44 157.44 157.44h278.528l74.752 98.048 74.752-98.048h275.968c86.528 0 157.44-70.912 157.44-157.44s-70.912-157.44-157.44-157.44z',
            symbolSize: value => {
                return [String(value).length*6 + 18, 24]
            },
            symbolOffset:[0,'-18px'],
            data: [{
                type: 'max',
                name: '最大值'
            }, {
                type: 'min',
                name: '最小值'
            }]
        },
        markLine: {
            data: [{
                type: 'average',
                name: '平均值',
            }]
        }
    }]
}
export const ChartBarGIS = {
    title: {
        text: "数量统计",
        x: 'center',
        textStyle: {
            color: '#fff',
            fontWeight: 400,
            fontSize: 18,
            fontFamily: 'AdobeHeitiStd-Regular',
            letterSpacing: 0.9,
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
            label: {
                show: true,
                color: '#000'
            },
        },
        backgroundColor: '#fff',
        padding: 10,
        textStyle: {
            color: '#000'
        }
    },
    legend: {
        top:34,
        right:4,
        textStyle: {
            color: '#fff',
            fontSize: 13
        }
    },

    grid: {
        top: '80',
        left: '50',
        right: '50',
        bottom: '15',
        containLabel: true,
    },
    toolbox: {
        show: true,
        iconStyle: {
            borderColor: '#fff',
        },
        feature: {
            mark: {
                show: true
            },
            magicType: {
                show: true,
                type: ['line', 'bar']
            },
            restore: {
                show: true
            },
            saveAsImage: {
                show: true
            }
        }
    },
    calculable: true,
    xAxis: [{
        type: 'category',
        data: [1, 2],
        axisLine: {
            lineStyle: {
                color: 'rgba(255,255,255,0.8)',
            }
        },
        splitLine: { show: false },
        axisLabel:{
            lineHeight:26
        }
    }],
    yAxis: [{
        splitLine: { show: false },
        type: 'value',
        axisLine: {
            lineStyle: {
                color: 'rgba(255,255,255,0.8)',
            }
        },
    }],
    series: [{
        name: '数量',
        type: 'bar',
        data: [1, 2],
        barMaxWidth:'40',
        markPoint: {
            symbol:'path://M864 305.408h-704C73.472 305.408 2.56 376.32 2.56 462.848s70.912 157.44 157.44 157.44h278.528l74.752 98.048 74.752-98.048h275.968c86.528 0 157.44-70.912 157.44-157.44s-70.912-157.44-157.44-157.44z',
            symbolSize: value => {
                return [String(value).length*6 + 18, 24]
            },
            symbolOffset:[0,'-50%'],
            data: [{
                type: 'max',
                name: '最大值'
            }, {
                type: 'min',
                name: '最小值'
            }],
            itemStyle:{
                color: '#ea6625' 
            }
        },
        markLine: {
            data: [{
                type: 'average',
                name: '平均值',
            }],
            lineStyle:{
                color: '#ea6625' 
            }
        },
        itemStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#00c3aa'},
                        {offset: 1, color: '#00a1c5'}
                    ]
                )
            },
        }
    }]
}
export const ChartBar = {
    title: {
        text: "数量统计",
        x: 'left',
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
            label: {
                show: true
            }
        }
    },
    legend: {
        data: [],
        x: 'left'
    },
    grid: {
        top: '20%',
        left: '2%',
        right: '6%',
        bottom: "5%",
        containLabel: true
    },
    toolbox: {
        show: true,
        feature: {
            mark: {
                show: true
            },
            magicType: {
                show: true,
                type: ['line', 'bar']
            },
            restore: {
                show: true
            },
            saveAsImage: {
                show: true
            }
        }
    },
    calculable: true,
    xAxis: [{
        type: 'category',
        data: []
    }],
    yAxis: [{
        type: 'value'
    }],
    series: [{
        name: '数量',
        type: 'bar',
        data: [],
        markPoint: {
            data: [{
                type: 'max',
                name: '最大值'
            }, {
                type: 'min',
                name: '最小值'
            }]
        },
        markLine: {
            data: [{
                type: 'average',
                name: '平均值'
            }]
        }
    }]
}
//GIS饼形图
export const ChartPieGIS = {
    color: myThemeColor,
    title: {
        text: "给水管线口径-数量统计",
        x: 'center',
        textStyle: {
            color: '#fff',
            fontWeight: 400,
            fontSize: 18,
            fontFamily: 'AdobeHeitiStd-Regular',
            letterSpacing: 0.9,
        }
    },
    tooltip: {
        formatter: "类别 ：{b} <br/> 数量: {c} ({d}%)",
    },
    // toolbox: {
    //     show: true,
    //     iconStyle: {
    //         borderColor: '#fff',
    //     },
    //     feature: {
    //         restore: {
    //             show: true
    //         },
    //         saveAsImage: {
    //             show: true
    //         },
    //     }
    // },
    grid: {
        top: '80px',
        left: '6%',
        right: '6%',
        containLabel: true
    },
    calculable: true,
    legend: {
        type: 'scroll',
        orient: 'horizontal',
        left: 10,
        right: 10,
        bottom: 40,
        data: [{
            name: '123',
            icon: 'circle',
        }, ]
    },
    series: [{
            name: "口径",
            type: "pie",
            radius: ['20%', '51%'],
            center: ['50%', '46%'],
            animate: true,
            data: [{
                name: '1',
                value: 1
            }, {
                name: '2',
                value: 2
            }]
        }, // 边框的设置
        {
            radius: ['20%', '24%'],
            center: ['50%', '46%'],
            type: 'pie',
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false
                }
            },
            labelLine: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false
                }
            },
            animation: false,
            tooltip: {
                show: false
            },
            data: [{
                value: 1,
                itemStyle: {
                    color: "rgba(255,255,255,0.3)",
                },
            }],
        }, 
        {
            name: '外边框',
            type: 'pie',
            Color: '#0fa7c8',
            clockWise: false, //顺时加载
            hoverAnimation: false, //鼠标移入变大
            center: ['50%', '46%'],
            radius: ['55%', '55%'],
            label: {
                normal: {
                    show: false
                }
            },
            data: [{
                value: 9,
                name: '',
                itemStyle: {
                    Color: '#0fa7c8',
                    normal: {
                        borderWidth: 0,
                        borderColor: '#0fa7c8'
                    }
                }
            }]
        },
    ]
}
//light 饼状图
export const ChartPieLight = _.cloneDeep(ChartPieGIS)
ChartPieLight.color = myThemeLightColor
ChartPieLight.series[2].data = [{
    value: 9,
    name: '',
    itemStyle: {
        normal: {
            borderWidth: 1,
            borderColor: '#12a8c9'
        }
    }
}]
//饼形图KPI
export const ChartPie = {
    color: KPIPieColor,
    title: {
        text: "给水管线口径-数量统计",
        x: 'center'
    },
    tooltip: {
        formatter: "类别 ：{b} <br/> 数量: {c} ({d}%)",
        position: {right: 4, top: 4}
    },
    toolbox: {
        show: true,
        feature: {
            restore: {
                show: true
            },
            saveAsImage: {
                show: true
            }
        }
    },
    calculable: true,
    series: [{
        name: "口径",
        type: "pie",
        radius: "50%",
        center: ['50%', '60%'],
        animate: true,
        data: [{
            name: '1',
            value: 1
        }, {
            name: '2',
            value: 2
        }]
    }]
}

//仪表盘
export const ChartGauge = {
    series: [{
        name: '管网总长',
        type: 'gauge',
        center: ['50%', '60%'], // 默认全局居中
        radius: '92%',
        min: 0, //最小值
        max: 300, //最大值
        startAngle: 180,
        endAngle: 0,
        splitNumber: 8,
        axisLine: { // 坐标轴线
            lineStyle: { // 属性lineStyle控制线条样式
                width: 30,
                color:[
                    [
                     1, new echarts.graphic.LinearGradient(
                      0, 0, 1, 0, [{
                      offset: 0,
                      color: '#00beb4',
                    },
                    {
                        offset: 0.35,
                        color:'#1491cb',
                      },
                      {
                        offset: 1,
                        color:'#2764e1',
                      }
                    ]
                      )
                    ],
                    [
                      1, '#222e7d'
                    ]
                  ]
            }
        },
        axisTick: { // 坐标轴小标记
            show: false
        },
        axisLabel: {
            position:[],
            // 使用函数模板，函数参数分别为刻度数值
            formatter: function (value) {
                return parseInt(value);
            },
            color: '#00beb4',
        },
        splitLine: { // 分隔线
            length: -30, // 属性length控制线长
            show:false,
            lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                color: '#00beb4'
            }
        },
        pointer: { //指针样式
            width: 2,
           
        },
        itemStyle:{
            color: '#00beb4'
        },
        title: {
            show: true,
            textStyle: {
                color: '#338B84',
                fontSize: 13,
            },
            offsetCenter: ['-85%', '12%']
        },
        detail: {
            show: true,
            textStyle: {
                color: '#fff',
                fontSize: 13,
            },
            
        },
        
        data: [{
            name: 'Km',
            value: '302.45',
            x: 10,
            y: 500,
        }]
    }]
}

//折线图
export const ChartBrokenLine = {
    title: {
        text: '折线图堆叠'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['接电上报', '临时工作', '热线系统']
    },
    grid: {
        top: '16%',
        left: '2%',
        right: '6%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        show: true,
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            dataView: {
                readOnly: false
            },
            magicType: {
                type: ['line', 'bar']
            },
            restore: {},
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['2018-12-11', '2018-12-17', '2018-12-25', '2019-02-04']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        // {
        //     name:'接电上报',
        //     type:'line',
        //     stack: '总量',
        //     data:[2, 10, 41, 10,20]
        // },
    ]
};