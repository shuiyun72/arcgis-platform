import 'ol/ol.css';

import {
    Circle as CircleStyle,
    Fill,
    Stroke,
    Style,
    Icon,
    Text
} from 'ol/style';

export default {
    /**
     * 获取style
     * @param {style索引}  styleName  
     * @param {标签名称}    tagName  
     */
    getStyle(styleName, tagName = '') {
        let scale = 0.06
        switch (styleName) {

            case 'WaterMeterLayer':



            case 'FirefightingwellLayer':

            case 'FirehydrantLayer':

            case 'ServicingwellLayer':

            case 'ValveLayer':

            case 'ValvewellLayer':

            case 'WatermeterwellLayer':
                return new Style({
                    image: new Icon({
                        scale: scale,
                        src: require('@assets/toolIcon/' + styleName + '.png')
                    })
                })
            case 'businessLayers.polygonLayer':
                return new Style({
                    stroke: new Stroke({
                        color: '#1983ef',
                        width: 3
                    }),
                    fill: new Fill({
                        color: 'rgba(0, 0, 255, 0.1)'
                    }),
                    text: new Text({
                        font: '16px Microsoft YaHei',
                        text: tagName,
                        fill: new Fill({
                            color: '#fff'
                        }),
                        stroke: new Stroke({
                            color: '#123350',
                            width: 2
                        })
                    }),
                })
            case 'businessLayers.lineStringLayer':
                return new Style({
                    text: new Text({
                        font: '16px Microsoft YaHei',
                        text: tagName,
                        fill: new Fill({
                            color: '#fff'
                        }),
                        stroke: new Stroke({
                            color: '#123350',
                            width: 2
                        }),
                    }),
                    stroke: new Stroke({
                        color: '#1983ef',
                        width: 3
                    }),
                    fill: new Fill({
                        color: 'rgba(0, 0, 255, 0.1)'
                    }),

                })
            case 'businessLayers.pointLayer':
                return new Style({
                    text: new Text({
                        font: '12px Microsoft YaHei',
                        text: tagName,
                        offsetY:20,
                        fill: new Fill({
                            color: '#fff'
                        }),
                        stroke: new Stroke({
                            color: '#000',
                            width: 2
                        })
                    }),
                    image: new Icon({
                        scale: scale * 4,
                        src: require('@assets/toolIcon/dingwei.png')
                    })
                })
            case 'businessLayers.monitorLayer':
                return new Style({
                    fill: new Fill({
                        color: 'rgba(255, 0, 0, 0.5)'
                    }),
                    stroke: new Stroke({
                        color: 'red',
                        width: 2
                    })
                })
            case 'businessLayers.monitorLayer.firstStyle':
                return new Style({
                    image: new Icon({
                        scale: scale * 4,
                        src: require('@assets/toolIcon/dingweistart.png'),
                        anchor: [0.5, 1],
                    })
                })
            case 'businessLayers.monitorLayer.endStyle':
                return new Style({
                    image: new Icon({
                        scale: scale * 4,
                        src: require('@assets/toolIcon/dingweiend.png'),
                        anchor: [0.5, 1],
                    })
                })
            case 'businessLayers.monitorLayer.routeStyle':
                return new Style({
                    stroke: new Stroke({
                        width: 6, color: [237, 212, 0, 0.8]
                    })
                })

            case 'businessLayers.monitorLayer.pointStyle':
                return new Style({
                    //把点的样式换成ICON图标
                    image: new Icon({
                        scale: scale * 4,
                        src: require('@assets/toolIcon/dingwei.png'),
                        anchor: [0.5, 1],
                        offset: [0, -4]
                    })
                });
        }
    }
}