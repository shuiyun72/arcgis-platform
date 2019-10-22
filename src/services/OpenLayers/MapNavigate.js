import _ from 'lodash';
import 'ol/ol.css';

import {
    Draw,
    Modify,
    Snap,
    Select,
    defaults as defaultInteractions
} from 'ol/interaction.js';
import Point from "ol/geom/Point.js";
import {
    Circle as CircleStyle,
    Fill,
    Stroke,
    Style
} from 'ol/style';
import {
    Vector as VectorSource
} from "ol/source.js";
import Feature from "ol/Feature.js";
import Polygon from "ol/geom/Polygon.js";
import {
    MultiPoint,
    MultiLineString,
    MultiPolygon
} from 'ol/geom.js';
import LineString from "ol/geom/LineString.js";
import mapStyle from '@services/OpenLayers/mapStyle.js';
import * as jsts from 'jsts/dist/jsts.js'

// var drawTypeSelect;
var bufferNumber = 0.001
var plotAnimate = {}
var lineStringSelect = undefined
var lineStringModify = undefined
var polygonSelect = undefined
var polygonModify = undefined
var pointSelect = undefined
var pointModify = undefined
var drawTypeSelect = undefined
var isAllowPointerMove = true
var trackPlay = {};
class MapNavigate {
    /* DrawLayers()*/

    constructor(baseMap) {
        this.mapInstance = baseMap.mapInstance
        this.map = baseMap.mapInstance.map
        this.groups = baseMap.mapInstance.groups
        this.businessLayers = baseMap.mapInstance.businessLayers
        this.tempLayers = baseMap.mapInstance.tempLayers
        this.overlay = baseMap.mapInstance.overlay
        this.baseMap = baseMap

    }

    /**获取buffer
     * 
     * @param {需要添加buffer的geometry} geometry 
     */
    static getBufferGeometry(geometry) {
        let parser = new jsts.io.OL3Parser();
        parser.inject(Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon);

        let jstsGeom = parser.read(geometry);

        let buffered = jstsGeom.buffer(bufferNumber);

        return parser.write(buffered)
    }



    /**添加弹窗
     * @param {坐标[x,y]} coordinate
     * @param {弹出框的上级DOM} overlayContainerDOM
     */
    addOverlayNavigate(coordinate, overlayContainerDOM) {
        //overlayContainerDOM.innerHTML = innerHTML
        //this.overlay.setElement(overlayContainerDOM)
        console.log('addOverlayNavigate', coordinate)
        // this.overlay.setPosition(undefined)
        this.overlay.setPosition(coordinate)
    }
    /**重置map大小
     * 
     * @param {} width 
     * @param {} height 
     */
    resizeMapNavigate(width, height) {
        this.map.setSize([width, height]);
    }
    /**设置中心点
     * @param {坐标[x,y]} coordinate
     * @param {放大层级} zoom
     */
    setCenter(coordinate, zoom) {

        let currentView = this.map.getView();
        if (currentView.getZoom() >= zoom) {
            zoom = currentView.getZoom();
        }
        //动画定位
        currentView.animate({
            center: coordinate,
            duration: 1000,
            zoom: zoom
        });
    }
    /**设置空间查询图层display
     * 
     * @param {ture:显示|flse:不显示} isVisible 
     * @param {ture:清除图层下所有数据 不能重新显示} isClear 
     */
    setSpatialSearchLayerGroupDisplay(isVisible, isClear) {

        this.groups.spatialSearchLayerGroup.setVisible(isVisible)
        if (isClear) {
            this.groups.spatialSearchLayerGroup.getLayers().forEach(layer => {
                layer.getSource() && layer.getSource().clear()
            })
        }
    }


    /**设置矢量图层是否显示 完善点:要增加隐藏和清空的参数 
     * @param {ture|flse} isVisible
     */
    setVectorLayerVisibleNavigate(isVisible) {
        this.groups.vectorLayerGroup.setVisible(isVisible)
    }

    /**设置业务图层是否显示 完善点:要增加隐藏和清空的参数 
     * @param {ture|flse} isVisible 
     */
    setBusinessLayerGroupVisible(isVisible) {
        if (!isVisible)
            this.groups.businessLayerGroup.getLayers().forEach(layer => {
                layer.getSource() && layer.getSource().clear()
            })

        //this.groups.businessLayerGroup.setVisible(isVisible)
    }
    /**设置临时绘制图层是否显示  完善点:要增加隐藏和清空的参数 
     * @param {ture|flse} isVisible
     */
    setTempLayerGroupVisible(isVisible) {
        this.groups.tempLayerGroup.setVisible(isVisible)
        if (!isVisible)
            this.groups.tempLayerGroup.getLayers().forEach(layer => {
                layer.getSource() && layer.getSource().clear()
            })
    }
    /**清空临时图层图层并结束编辑修改交互
     * 
     */
    removeInteractions() {
        console.log("removeInteractions")
        if (drawTypeSelect) {
            this.setTempLayerGroupVisible(false)
            drawTypeSelect.getOverlay().getSource() && drawTypeSelect.getOverlay().getSource().clear()
            this.tempLayers.drawAndModifyLayer.getSource() && this.tempLayers.drawAndModifyLayer.getSource().clear()
            this.tempLayers.bufferLayr.getSource() && this.tempLayers.bufferLayr.getSource().clear()
            this.map.removeInteraction(drawTypeSelect)
        }
    }

    /**设置编辑状态
     * 
     * @param {ture 开始编辑|false 结束编辑} state 
     */
    setEditFeatureState(state) {
        if (state) {
            this.map.removeInteraction(drawTypeSelect)
            this.removeInteractions()
        } else {
            this.map.removeInteraction(lineStringSelect)
            this.map.removeInteraction(lineStringModify)
            this.map.removeInteraction(polygonSelect)
            this.map.removeInteraction(polygonModify)
            this.map.removeInteraction(pointSelect)
            this.map.removeInteraction(pointModify)
        }
        drawTypeSelect && drawTypeSelect.setActive(!state)
        this.mapInstance.interactions.select.setActive(state)
        this.mapInstance.interactions.modify.setActive(state)
    }
    //关闭修改feature交互操作
    CloseModifyInteraction() {
        this.map.removeInteraction(drawTypeSelect)
    }
    /**添加可绘制/修改图层
     *@param {绘制的样式 Point/LineString/Polygon/Circle} typeSelect
     *@param {是否可以修改的绘图} isModify
     *@param {地图弹窗显示类型 0不显示弹窗1添加区域2编辑区域3添加关键点4编辑关键点} dialogType
     *@function 回调函数,返回坐标信息
     */
    addInteractions(typeSelect, isModify, allDoneCallback) {
        let source = new VectorSource();
        this.tempLayers.drawAndModifyLayer.setSource(source);
        drawTypeSelect = new Draw({
            source: source,
            type: typeSelect
        });
        //this.map.removeInteraction(this.mapInstance.interactions.modify);
        this.setEditFeatureState(false)
        this.map.addInteraction(drawTypeSelect);
        drawTypeSelect.on('drawend', (evt) => { //图形完成显示数据
            let coordinate = evt.feature.getGeometry().getCoordinates();
            if (typeSelect == "LineString") {
                let bufferGeom = MapNavigate.getBufferGeometry(evt.feature.getGeometry())
                let feature = new Feature();
                feature.setGeometry(bufferGeom)
                let coordinate2 = feature.getGeometry().getCoordinates()
                this.tempLayers.bufferLayr.setSource(new VectorSource({

                    features: [new Feature({
                        geometry: new Polygon([coordinate2[0]]),
                        style: mapStyle.getStyle('businessLayers.polygonLayer')
                    })]
                }))
                allDoneCallback instanceof Function && allDoneCallback(coordinate, [coordinate2[0]]);
            }
            //测试空间查询
            // else if (typeSelect == "Polygon") {

            //     this.setSpatialSearchOnMap(true, 3, 'ValvewellLayer', evt.feature)
            // } 
            else {
                allDoneCallback instanceof Function && allDoneCallback(coordinate);
            }
            this.CloseModifyInteraction()
        })
        //暂时先不支持修改
        if (false) {
            let modify = new Modify({
                source: source
            });
            this.map.addInteraction(modify);
            source.getFeatures.forEach(value => {
                this.mapInstance.interactions.snap.addFeature(value)
            })

        } else {

        }
    }

    /**空间查询
     * 
     * @param {ture 显示|false 不显示} isVisible 
     * @param {layer索引} layerIndex 
     * @param {layer名称} layerName 
     * @param {查询的区域feature} feature 
     */
    setSpatialSearchOnMap(isVisible, layerIndex, layerName, feature, callback) {
        let layer = this.mapInstance.spatialSearchLayers[layerName]
        this.setVectorLayerVisibleNavigate(false);
        if (isVisible) {
            this.baseMap.createSpatialSearchVectorSource(layerIndex, feature.getGeometry().getCoordinates(), feature.getGeometry().getExtent()).then(resultObject => {
                let pointAll = [];
                _.forEach(resultObject, res => {
                    if (res && res.values_ && res.values_.geometry) {
                        pointAll.push({ "SmID": res.values_.OBJECTID, "SmX": res.values_.geometry.flatCoordinates[0], "SmY": res.values_.geometry.flatCoordinates[1], "EquType": layerIndex[0] })
                    }

                })
                
                if (resultObject.length != 0) {

                    layer.setSource(
                        new VectorSource({
                            features: resultObject,
                            projection:"EPSG:4326"
                        })
                    )
                    
                    callback instanceof Function && callback(layerIndex, pointAll)
                }
            })

        } else {
            layer.getSource() && layer.getSource().clear()
            callback instanceof Function && callback(layerIndex, null)
        }
    }


    /**在地图上绘制Point
     * 
     * @param {需要绘制的Point的数组} geomArray 
     * @param {是否修改} isModify 
     * @param {修改完后的回调} onModifyEndFunc
     * @param {点的名称} featureName 
     * @param {需要添加给点的属性 Object.<string, *>} featureProperties
     */
    setPointOnMap(geomArray, isModify, onModifyEndFunc, featureName, featureProperties) {
        let interactions = this.mapInstance.interactions
        interactions.select.setActive(false)
        interactions.modify.setActive(false)
        let isInsertProperties = featureProperties && featureProperties.length == geomArray.length
        if (geomArray instanceof Array) {
            let features = []
            let pointLayer = this.businessLayers.pointLayer
            geomArray.forEach((obj, index) => {
                let feature = new Feature({
                    geometry: new Point(obj),
                    name: featureName,
                    properties: isInsertProperties ? featureProperties[index] : undefined
                })

                feature.setStyle(mapStyle.getStyle('businessLayers.pointLayer',featureProperties[index].EventFromName))
                features.push(feature)
            })
            pointLayer.setSource(new VectorSource({
                features: features
            }))
            if (isModify) {

                pointSelect = new Select({
                    filter: function (feature) {

                        return feature.getGeometry().getType() == 'Point'
                    },
                    active: true
                })
                pointModify = new Modify({
                    features: pointSelect.getFeatures(),
                    active: true
                }),

                    pointModify.on('modifyend', evt => { //图形完成显示数据
                        onModifyEndFunc instanceof Function && onModifyEndFunc(evt.features.array_[0].getGeometry().getCoordinates(), () => {
                            this.setEditFeatureState(false)
                            console.log('setPointnOnMapModify')
                        });

                    })
                this.map.addInteraction(pointSelect)
                this.map.addInteraction(pointModify)
            }
        }
    }

    /**在地图上绘制Polygon(geomArray和nameArray的数目和顺序都要一致)
     * 
     * @param {需要绘制的Polygon的数组} geomArray 
     * @param {需要添加的name} nameArray
     * @param {是否修改} isModify 
     * @param {修改完后的回调} onModifyEndFunc
     */
    setPolygonOnMap(geomArray, nameArray, isModify, onModifyEndFunc) {
        let interactions = this.mapInstance.interactions
        interactions.select.setActive(false)
        interactions.modify.setActive(false)
        if (geomArray instanceof Array && nameArray instanceof Array && geomArray.length == nameArray.length) {
            let features = []
            let polygonLayer = this.businessLayers.polygonLayer
            geomArray.forEach((obj, index) => {
                let feature = new Feature({
                    geometry: new Polygon([obj]),
                    name: nameArray[index],

                })
                feature.setStyle(mapStyle.getStyle('businessLayers.polygonLayer', nameArray[index]))
                features.push(feature)
            })

            polygonLayer.setSource(new VectorSource({
                features: features
            }))

            if (isModify) {

                polygonSelect = new Select({
                    filter: function (feature) {

                        return feature.getGeometry().getType() == 'Polygon'
                    },
                    active: true
                })
                polygonModify = new Modify({
                    features: polygonSelect.getFeatures(),
                    active: true
                }),

                    polygonModify.on('modifyend', evt => { //图形完成显示数据
                        onModifyEndFunc instanceof Function && onModifyEndFunc(evt.features.array_[0].getGeometry().getCoordinates(), () => {
                            this.setEditFeatureState(false)
                            console.log('setPolygonOnMapModify')
                        }, evt.features.array_[0]);

                    })

                this.map.addInteraction(polygonSelect)
                this.map.addInteraction(polygonModify)
            } else {
                onModifyEndFunc instanceof Function && onModifyEndFunc(features[0]);
            }
        }
    }
    /**在地图上绘制LineString(geomArray和nameArray的数目和顺序都要一致,if bufferArray==undifiand|bufferArray.length!=geomArray.length 则不执行)
     * 
     * @param {需要绘制的LineString的数组} geomArray 
     * @param {需要添加的name} nameArray 
     * @param {是否修改} isModify 
     * @param {修改完后的回调} onModifyEndFunc
     * @param {buffer图层} bufferArray
     */
    setLineStringOnMap(geomArray, nameArray, isModify, onModifyEndFunc, bufferArray) {
        let interactions = this.mapInstance.interactions
        interactions.select.setActive(false)
        interactions.modify.setActive(false)
        if (geomArray instanceof Array && nameArray instanceof Array && geomArray.length == nameArray.length) {
            let features = []
            let features2 = []
            let lineStringLayer = this.businessLayers.lineStringLayer
            let polygonLayer = this.businessLayers.polygonLayer
            let isAddBuffer = (bufferArray instanceof Array && bufferArray.length == geomArray.length)
            geomArray.forEach((obj, index) => {
                let feature = new Feature({
                    geometry: new LineString(obj),
                    name: nameArray[index],
                })
                feature.setStyle(mapStyle.getStyle('businessLayers.lineStringLayer', nameArray[index]))
                features.push(feature)
                //buffer图层
                if (isAddBuffer) {
                    let feature2 = new Feature({
                        geometry: new Polygon(bufferArray[index]),
                    })
                    feature2.setStyle(mapStyle.getStyle('businessLayers.polygonLayer'))
                    features2.push(feature2)
                }
            })
            lineStringLayer.setSource(new VectorSource({
                features: features
            }))
            if (isAddBuffer) {
                polygonLayer.setSource(new VectorSource({
                    features: features2
                }))
            }
            if (isModify) {
                interactions.snap.addFeature(features[0])

                lineStringSelect = new Select({
                    filter: function (feature) {

                        return feature.getGeometry().getType() == 'LineString'
                    },
                    active: true
                })
                lineStringModify = new Modify({
                    features: lineStringSelect.getFeatures(),
                    active: true
                }),

                    lineStringModify.on('modifyend', evt => { //图形完成显示数据

                        let bufferGeom = MapNavigate.getBufferGeometry(evt.features.array_[0].getGeometry())
                        let feature = new Feature({
                            geometry: bufferGeom
                        });

                        let coordinate2 = feature.getGeometry().getCoordinates()
                        polygonLayer.setSource(new VectorSource({
                            features: [new Feature({
                                geometry: new Polygon(coordinate2),
                                style: mapStyle.getStyle('businessLayers.polygonLayer')
                            })]
                        }))

                        onModifyEndFunc instanceof Function && onModifyEndFunc(evt.features.array_[0].getGeometry().getCoordinates(), () => {
                            this.setEditFeatureState(false)
                        }, coordinate2);
                    })
                this.map.addInteraction(lineStringSelect)
                this.map.addInteraction(lineStringModify)
            }
        }
    }





    //点动画函数
    plotAnimateControl(points, interValTime, action, callBack) {
        plotAnimate.index = plotAnimate.index || 0
        trackPlay.animating//动画状态
        trackPlay.routeLength = points.length
        trackPlay.points = points
        trackPlay.interValTime = interValTime
        //获取地图图层
        let layerMove = this.businessLayers.monitorLayer
        layerMove.setStyle(mapStyle.getStyle('businessLayers.monitorLayer'))

        //样式
        trackPlay.firstStyle = mapStyle.getStyle('businessLayers.monitorLayer.firstStyle');
        trackPlay.endStyle = mapStyle.getStyle('businessLayers.monitorLayer.endStyle');
        trackPlay.pointStyle = mapStyle.getStyle('businessLayers.monitorLayer.pointStyle');
        trackPlay.routeStyle = mapStyle.getStyle('businessLayers.monitorLayer.routeStyle');
        //绘点
        function AddPoint(style, lnglat, id) {
            let newFeature = new Feature({
                geometry: new Point(lnglat)
            });
            //设置点的样式
            newFeature.setStyle(style);
            newFeature.setId("PlayPoints" + id)
            //将当前要素添加到矢量数据源中
            layerMove.getSource().addFeature(newFeature);
        }
        //绘线
        function AddLine(style, lnglat, id) {
            let lineFeature = new Feature({
                geometry: new LineString(lnglat)
            });
            //设置点的样式
            lineFeature.setStyle(style);
            lineFeature.setId("PlayLine" + id)
            //将当前要素添加到矢量数据源中
            layerMove.getSource().addFeature(lineFeature);
        }
        //动画
        trackPlay.move = (event) => {
            let vectorContext = event.vectorContext;
            let frameState = event.frameState;

            if (trackPlay.animating) {
                trackPlay.elapsedTime = frameState.time - trackPlay.now;

                // here the trick to increase speed is to jump some indexes
                // on lineString coordinates
                trackPlay.index = Math.floor(trackPlay.elapsedTime / trackPlay.interValTime * 100) / 100;
                if (trackPlay.index >= trackPlay.routeLength - 1) {
                    trackPlay.stop(true);
                    callBack()
                    return;
                }
                trackPlay.nowPoint = []
                let parseIndex = parseInt(trackPlay.index)
                trackPlay.nowPoint[0] = points[parseIndex][0] + (points[parseIndex + 1][0] - points[parseIndex][0]) * (trackPlay.index % 1)
                trackPlay.nowPoint[1] = points[parseIndex][1] + (points[parseIndex + 1][1] - points[parseIndex][1]) * (trackPlay.index % 1)
                let currentPoint = new Feature({
                    geometry: new Point(trackPlay.nowPoint)
                });
                vectorContext.drawFeature(currentPoint, trackPlay.pointStyle);
            }
            this.map.render();
        };
        //绘制路线
        trackPlay.showRoute = () => {
            if (trackPlay.animating) {
                trackPlay.stop(true);
            }
            layerMove.getSource().clear();
            AddPoint(trackPlay.pointStyle, points[0], -1);
            AddPoint(trackPlay.firstStyle, points[0], 0);

            AddPoint(trackPlay.endStyle, points[trackPlay.routeLength - 1], trackPlay.routeLength - 1);
            AddLine(trackPlay.routeStyle, points, 'route')
        }
        //开始画线
        trackPlay.start = () => {
            let feature = layerMove.getSource().getFeatureById('PlayPoints-1')
            if (trackPlay.animating) {
                trackPlay.stop(true);
            } else if (trackPlay.index) {
                feature.setStyle(null);
                trackPlay.animating = true;
                trackPlay.now = new Date().getTime() - trackPlay.index * trackPlay.interValTime;
                this.map.on('postcompose', trackPlay.move);
                this.map.render();
            } else {
                feature.setStyle(null);
                trackPlay.animating = true;
                trackPlay.now = new Date().getTime();
                this.map.on('postcompose', trackPlay.move);
                this.map.render();
            }


        }
        trackPlay.stop = (ended) => {
            trackPlay.animating = false;
            // if animation cancelled set the marker at the beginning

            let coord
            if (ended) {
                this.map.un('postcompose', trackPlay.move);
                trackPlay.index = 0
                coord = trackPlay.points[0]
                trackPlay = {}
            } else {
                this.map.un('postcompose', trackPlay.move);
                coord = trackPlay.nowPoint
            }
            let feature = layerMove.getSource().getFeatureById('PlayPoints-1')
            feature.getGeometry().setCoordinates(coord);
            feature.setStyle(trackPlay.pointStyle);
            //remove listener


        }
        switch (action) {
            case 'showRoute':
                trackPlay.showRoute()
                break;
            case 'start':
                trackPlay.start()
                break;
            case 'pause':
                trackPlay.stop(false)
                break;
            case 'clear':
                if (trackPlay.animating) {
                    trackPlay.stop(true)
                }
                layerMove.getSource().clear();
        }
    }
    OffPointermoveControl() {
        isAllowPointerMove = false
    }
    onPointermoveControl() {
        isAllowPointerMove = true
    }
    /**
     * 添加pointerMove事件
     */
    pointermoveControl(overlayDOM, callback) {
        this.map.on('pointermove', e => {
            if (!isAllowPointerMove) {
                return e.coordinate
            }
            //获取像素区域
            let pixel = this.map.getEventPixel(e.originalEvent);
            let flag = false;
            let overlay = this.overlay
            overlay.setPosition(undefined)
            this.map.forEachFeatureAtPixel(pixel, (feature) => {
                let properties = feature.getProperties();
                let coodinate = feature.getGeometry().getCoordinates();
                if (feature.getGeometry().getType() == 'Point') {
                    if (properties.name == 'RoutePoint') {
                        //overlay.setElement(overlayDOM)
                        let innerHTML = `<div><strong>名称：</strong>${properties.properties.ImportPointName}</div>
                        <div><strong>上报时间：</strong>${properties.properties.AddTime}</div>`;
                        callback(innerHTML, '路线巡检', true)
                        overlay.setPosition(coodinate)
                        //设置overlay的显示位置
                        // overlay.setPosition(e.coordinate);

                    }
                    else if (properties.name == 'EventPoint') {
                        //overlay.setElement(overlayDOM)
                        let innerHTML = `<div><strong>事件编号：</strong>${properties.properties.EventCode}</div>
                        <div><strong>事件位置：</strong>${properties.properties.eventAddress}</div>
                        <div><strong>上报部门：</strong>${properties.properties.DeptName}</div>
                        <div><strong>上传人员：</strong>${properties.properties.PName}</div>
                        <div><strong>事件类别：</strong>${properties.properties.PointName}</div>
                        <div><strong>事件内容：</strong>${properties.properties.ET1}</div>
                        <div><strong>事件来源：</strong>${properties.properties.EventFromName}</div>
                        <div><strong>紧急级别：</strong>${properties.properties.HandlerLevelName}</div>
                        <div><strong>事件描述：</strong>${properties.properties.eventDesc}</div>`
                        if (properties.properties.EventPictures.length) {
                            innerHTML += `<div><strong>图片：</strong>`;
                            _.forEach(properties.properties.EventPictures, picture => {
                                innerHTML += `<a href="${picture}"><image  src="${picture}"/></a>`
                            })
                            innerHTML += `</div>`;
                        }

                        callback(innerHTML, '事件')
                        overlay.setPosition(coodinate)
                    } else if (properties.name == 'DatailEvent') {
                        let innerHTML =
                            `<div><strong>事件编号：</strong>${properties.properties.EventCode}</div>
                            <div><strong>时间：</strong>${properties.properties.EventUpdateTime.split("T")[0]} ${properties.properties.EventUpdateTime.split("T")[1]}</div>
                            <div><strong>事件位置：</strong>${properties.properties.EventAddress}</div>
                            <div><strong>部门：</strong>${properties.properties.cDepName || properties.properties.DeptName}</div>
                            <div><strong>事件来源：</strong>${properties.properties.EventFromName}</div>
                            <div><strong>事件描述：</strong>${properties.properties.EventDesc}</div>`;
                        callback(innerHTML, '事件上报')
                        overlay.setPosition(coodinate)
                    }
                }

            });
        });
    }

}

export default MapNavigate;