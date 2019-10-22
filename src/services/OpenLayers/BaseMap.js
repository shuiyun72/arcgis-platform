import _ from 'lodash';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import {
    Tile as TileLayer,
    Vector as Vectorlayer,
    Group as LayerGroup
} from 'ol/layer';
import {
    XYZ as XYZSource,
    Vector as VectorSource,
    TileArcGISRest
} from 'ol/source';
import {
    createXYZ
} from 'ol/tilegrid';
import {
    tile as tileStrategy
} from 'ol/loadingstrategy';

import {
    getCenter
} from 'ol/extent';
import {
    get as getProjection,
    transformExtent
} from 'ol/proj';
import proj4 from 'proj4';
import {
    register
} from 'ol/proj/proj4';
import {
    defaults as defaultInteractions,
    Modify,
    Select,
    Snap
} from 'ol/interaction.js';
import EsriJSON from 'ol/format/EsriJSON';
import MapConfigure from "@common/consts/OpenLayersConfig/MapConfigure";
import mapRequest from "@services/OpenLayers/mapRequest";
import Overlay from 'ol/Overlay';
import mapStyle from '@services/OpenLayers/mapStyle.js';
import {
    stringify
} from 'querystring';
/*
OpenLayer地图基础数据操作
*/

class BaseMap {

    constructor() {
        this._DefaultProjection = "EPSG:"+MapConfigure.MapExtent.SpatialReference;
        //定义坐标系
        _.forEach(MapConfigure.CoordinateDefinition, InfoValue => {
            if (InfoValue.IsDeFault) {
                this._DefaultProjection = InfoValue.DeFineName;
            }
            proj4.defs(InfoValue.DeFineName, InfoValue.DefineContent); //坐标类型定义
        });
        register(proj4); //坐标注册
        this._Projection = getProjection(this._DefaultProjection);
        this._Projection.setExtent([MapConfigure.MapExtent.XMin, MapConfigure.MapExtent.YMin, MapConfigure.MapExtent.XMax, MapConfigure.MapExtent.YMax]);
        //this._Projection.setExtent([344577.88, 2381397.91, 617340.63, 5036050.38]);
        this._ProjectionExtent = this._Projection.getExtent();
        this.select = new Select({
            active: false
        }),
            this.mapInstance = {
                map: undefined,
                groups: {
                    tileLayerGroup: undefined,
                    vectorLayerGroup: undefined,
                    businessLayerGroup: undefined,
                    tempLayerGroup: undefined,
                    spatialSearchLayerGroup: undefined
                },
                businessLayers: {
                    polygonLayer: new Vectorlayer(),
                    lineStringLayer: new Vectorlayer(),
                    pointLayer: new Vectorlayer(),
                    monitorLayer: new Vectorlayer({
                        source: new VectorSource()
                    }),
                },
                tempLayers: {
                    drawAndModifyLayer: new Vectorlayer(),
                    bufferLayr: new Vectorlayer()
                },
                spatialSearchLayers: {},
                overlay: undefined,
                interactions: {
                    select: this.select,
                    modify: new Modify({
                        active: false,
                        features: this.select.getFeatures()
                    }),
                    snap: new Snap({
                        source: new VectorSource()
                    })
                },


            }

    }

    /**
     * 构建地图
     * @param {地图容器} _containerDomId 
     */
    async createMap(_containerDomId) {
        let _tileLayers = [];
        let _vectorLayers = [];
        let tempLayers = this.mapInstance.tempLayers
        let tempLayersGroup = []
        let groups = this.mapInstance.groups
        let businessLayers = this.mapInstance.businessLayers
        let businessLayersGroup = []
        let spatialSearchLayerGroup = []

        //遥感图加载
        let _SatellLayer = this.createTileLayer(this.createArcGISRestSource(MapConfigure.url.urlSatell), "SatellLayer", true);
        _tileLayers.push(_SatellLayer);


        // //街道图加载
        let _VectorLayer = this.createTileLayer(this.createArcGISRestSource(MapConfigure.url.urlPipeLine), "PipeLayer", true);
        _vectorLayers.push(_VectorLayer);

        // //地形图加载
        // let _TerrainLayer = this.createTileLayer(this.createArcGISRestSource(MapConfigure.url.urlTerrain), "TerrainLayer", true);
        // _tileLayers.push(_TerrainLayer);

        groups.tileLayerGroup = new LayerGroup({
            layers: _tileLayers
        })


        //添加临时图层
        for (let obj in tempLayers) {
            tempLayersGroup.push(tempLayers[obj])
        }
        groups.tempLayerGroup = new LayerGroup({
            layers: tempLayersGroup
        })


        //管网数据加载==>管线，阀门，消防栓等
        _.forEach(MapConfigure.LayerConfiguration, ObjValue => {
            // let _VectorLayer = this.createVectorlayer(this.createVectorSource(ObjValue.layerIndex), ObjValue.layerName, true);
            // _vectorLayers.push(_VectorLayer);
            //空间查询
            if (ObjValue.isSpatialSearch) {
                console.log('IconName',ObjValue.IconName)
                this.mapInstance.spatialSearchLayers[ObjValue.layerName] = new Vectorlayer({
                    style: mapStyle.getStyle(ObjValue.IconName)
                })
            }
        });
        groups.vectorLayerGroup = new LayerGroup({
            layers: _vectorLayers
        })
        //夹杂空间查询layer
        for (let obj in this.mapInstance.spatialSearchLayers) {
            spatialSearchLayerGroup.push(this.mapInstance.spatialSearchLayers[obj])
        }
        groups.spatialSearchLayerGroup = new LayerGroup({

            layers: spatialSearchLayerGroup
        })

        //添加弹出框
        this.mapInstance.overlay = new Overlay({
            element: document.getElementById("popup"),
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        })
        //_overlays.push(MapConfigure.OverLayConfiguration.overLay)

        //业务数据图层
        for (let obj in businessLayers) {
            businessLayersGroup.push(businessLayers[obj])
        }
        groups.businessLayerGroup = new LayerGroup({

            layers: businessLayersGroup
        })


        //地图数据
        this.mapInstance.map = new Map({
            layers: [groups.tileLayerGroup, groups.vectorLayerGroup, groups.businessLayerGroup, groups.tempLayerGroup, groups.spatialSearchLayerGroup],
            overlays: [this.mapInstance.overlay],
            // interactions: defaultInteractions().extend([this.mapInstance.interactions.select, this.mapInstance.interactions.modify]),
            interactions: defaultInteractions().extend([this.mapInstance.interactions.select, this.mapInstance.interactions.modify, this.mapInstance.interactions.snap]),
            target: _containerDomId,
            view: new View({
                projection: this._Projection,
                extent: this._ProjectionExtent || undefined,
                center: [MapConfigure.MapCenter.Center_X, MapConfigure.MapCenter.Center_Y],
                zoom: MapConfigure.MapCenter.Center_Zoom,
                minZoom: 3
            })
        });
        return this;
    }

    /**
     * 创建切片图层
     * @param {瓦片图层数据源}  _source  
     * @param {切片图层名称}    _layerName 
     * @param {是否显示}        _isShow 
     */
    createTileLayer(_source, _layerName, _isShow) {
        let tileLayer = new TileLayer({
            name: _layerName,
            source: _source,
            visible: _isShow
        });
        return tileLayer;
    }

    /**
     * 创建矢量图层
     * @param {矢量图层数据源}  _source  
     * @param {矢量图层名称}    _layerName  
     * @param {是否显示}        _isShow 
     */
    createVectorlayer(_source, _layerName, _isShow) {
        let vectorLayer = new Vectorlayer({
            name: _layerName,
            source: _source,
            visible: _isShow,
            style: mapStyle.getStyle(_layerName)
        });
        return vectorLayer;
    }

    /**
     * 创建ArcGISReset的Source
     * @param {*} _layerURL 
     */
    createArcGISRestSource(_layerURL) {
        let arcGISSource = new TileArcGISRest({
            url: _layerURL
        });
        return arcGISSource;
    }

    /**
     * 创建万能瓦片的Source
     * @param {瓦片URL地址} _layerURL 
     */
    createXYZSource(_layerURL) {
        let sourceXYZ = new XYZSource({
            url: _layerURL
        });
        return sourceXYZ;
    }

    /**
     * 创建矢量的Source 
     * @param {矢量图层编号} _layerURL 
     * @param {目标坐标系} _CDeFine 
     */
    createVectorSource(_layerURL, _CDeFine, geomStr) {
        let esrijsonFormat = new EsriJSON();
        let vectorSource = new VectorSource({
            loader: (extent, resolution, projection) => {
                // let Extent4490 = transformExtent(extent, "EPSG:4326", "EPSG:4490");
                // let url = '/9/query/?f=json&' +
                //     'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
                //     encodeURIComponent('{"xmin":' + Extent4490[0] + ',"ymin":YMin: ' + Extent4490[1] + ',"xmax":XMax: ' + Extent4490[2] + ',"ymax":YMax: ' + Extent4490[3] + ',"spatialReference":{"wkid":4490}}') +
                //     '&geometryType=esriGeometryEnvelope&inSR=4490&outFields=*' +
                //     '&outSR=4490';
                let cloneExtent = _.cloneDeep(extent);
                let CDeFien = projection.code_.split(':')[1]; //取得定义坐标系
                if (_CDeFine) {
                    cloneExtent = transformExtent(extent, projection.code_, _CDeFine); //转换为指定坐标系
                    CDeFien = _CDeFine.split(':')[1];
                }
                //指定URL
                let url = '/' + _layerURL + '/query/?f=json&' +
                    'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
                    encodeURIComponent('{"xmin":' + cloneExtent[0] + ',"ymin":YMin: ' + cloneExtent[1] + ',"xmax":XMax: ' + cloneExtent[2] + ',"ymax":YMax: ' + cloneExtent[3] + ',"spatialReference":{"wkid":' + CDeFien + '}}') +
                    '&geometryType=esriGeometryEnvelope&inSR=' + CDeFien + '&outFields=*' +
                    '&outSR=' + CDeFien;
                mapRequest.GetGisReset(url).then(resultValue => {
                    let sourceData = JSON.parse(resultValue.data);
                    var features = esrijsonFormat.readFeatures(sourceData, {
                        featureProjection: projection
                    });
                    if (features.length > 0) {

                        vectorSource.addFeatures(features);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            // url: MapConfigure.url.urlPipeLine + "/" + _layerURL + "?f=pjson",
            strategy: tileStrategy(createXYZ({
                tileSize: 512
            }))
        });
        // console.log('createVectorSource', vectorSource.getFeatures())
        return vectorSource;
    }


    /**
     * 创建矢量的Source 
     * @param {矢量图层编号} _layerURL 
     * @param {坐标对象} CoordinatesArray
     */
    async createSpatialSearchVectorSource(_layerURL, CoordinatesArray, extent) {
        let geometryStr = {
            // "rings": [
            //     [
            //         [524553.1905414565, 3958482.028005024],
            //         [524667.4907700568, 3958806.9369881754],
            //         [525190.3084823589, 3958719.095145825],
            //         [525098.2332982086, 3958134.8939774227],
            //         [524553.1905414565, 3958482.028005024]
            //     ]
            // ],
            "rings": CoordinatesArray,
            "_ring": 0,
            "spatialReference": {
                "wkid": MapConfigure.MapExtent.SpatialReference,
                "latestWkid": MapConfigure.MapExtent.SpatialReference
            },
            "cache": {
                "_extent": {
                    "xmin": extent[0],
                    "ymin": extent[1],
                    "xmax": extent[2],
                    "ymax": extent[3],
                    "spatialReference": {
                        "wkid": MapConfigure.MapExtent.SpatialReference,
                        "latestWkid": MapConfigure.MapExtent.SpatialReference
                    }
                },
                "_partwise": null
            }
        };
        //_layerURL = 9
        let url = '/' + _layerURL + '/query/?f=json&' +
            'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' + JSON.stringify(geometryStr) +
            '&geometryType=esriGeometryPolygon&inSR=' + MapConfigure.MapExtent.SpatialReference + '&outFields=*' +
            '&outSR=' + MapConfigure.MapExtent.SpatialReference;

        let esrijsonFormat = new EsriJSON();

        return mapRequest.GetGisReset(url).then(resultValue => {
            let sourceData = JSON.parse(resultValue.data);
            let features = esrijsonFormat.readFeatures(sourceData, {
                featureProjection: this._Projection,
                dataProjection: this._Projection,
            });
            //console.log('createSpatialSearchVectorSource', features);
            return features
        }).catch(err => {
            console.log(err);
        });

    }

    // /**
    //  * 创建WMTS的Source
    //  * @param {瓦片URL地址} _layerURL 
    //  */
    // createWMTSSource(_layerURL) {
    //     let sourceWMTS = new WMTSSource(_layerURL);
    //     return sourceWMTS;
    // }
}

export default BaseMap;