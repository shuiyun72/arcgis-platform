/*地图操作模块*/
import * as esriLoader from 'esri-loader';
import _ from 'lodash';

import {
    MapConfigure,
    ArcgisJS,
    ArcgisCSS
} from "@common/consts/GisConst/MapConfigure";


//加载CSS样式文件
esriLoader.loadCss(ArcgisCSS);
const LOAD_MODULES_OPTIONS = {
    url: ArcgisJS
};

class BaseMap {
    constructor() {
        // 存储ArcGis模块变量
        this.modules = {}
        this.FeatureLayerCollection = [];
    }

    //初始话地图组件
    async init() {
        const [
            Map,
            Scalebar,
            OverviewMap,
            Search,
            GraphicsLayer,
            ArcGISTiledMapServiceLayer,
            ArcGISDynamicMapServiceLayer,
            FeatureLayer,
            on,
            connect,
            dom,
            keys,
            registry,
            domConstruct,
            parser,
            arrayUtils,
            Color,
            has,
            Units,
            esriConfig,
            SpatialReference,
            InfoTemplate,
            SnappingManager,
            Measurement,
            HomeButton,
            Legend,
            LayerList,
            domUtils,
            Geometry,
            Point,
            Graphic,
            SimpleMarkerSymbol,
            PictureMarkerSymbol,
            SimpleLineSymbol,
            SimpleFillSymbol,
            TooltipDialog,
            popup,
            PopupTemplate,
            GeometryService,
            esriLang,
            domStyle
        ] =
            await esriLoader.loadModules([
                "esri/map",
                "esri/dijit/Scalebar",
                "esri/dijit/OverviewMap",
                "esri/dijit/Search",
                "esri/layers/GraphicsLayer",
                "esri/layers/ArcGISTiledMapServiceLayer",
                "esri/layers/ArcGISDynamicMapServiceLayer",
                "esri/layers/FeatureLayer",
                "dojo/on",
                "dojo/_base/connect",
                "dojo/dom",
                "dojo/keys",
                "dijit/registry",
                "dojo/dom-construct",
                "dojo/parser",
                "dojo/_base/array",
                "esri/Color",
                "esri/sniff",
                "esri/units",
                "esri/config",
                "esri/SpatialReference",
                "esri/InfoTemplate",
                "esri/SnappingManager",
                "esri/dijit/Measurement",
                "esri/dijit/HomeButton",
                "esri/dijit/Legend",
                "esri/dijit/LayerList",
                "esri/domUtils",
                "esri/geometry/Geometry",
                "esri/geometry/Point",
                "esri/graphic",
                "esri/symbols/SimpleMarkerSymbol",
                "esri/symbols/PictureMarkerSymbol",
                "esri/symbols/SimpleLineSymbol",
                "esri/symbols/SimpleFillSymbol",
                "dijit/TooltipDialog",
                "esri/dijit/Popup",
                "esri/dijit/PopupTemplate",
                "esri/tasks/GeometryService",
                "esri/lang",
                "dojo/dom-style",
                "dojo/domReady!"
            ], LOAD_MODULES_OPTIONS);
        // 在这里将模块变量绑定到实例
        this.modules = {
            Map,
            Scalebar,
            OverviewMap,
            Search,
            GraphicsLayer,
            ArcGISTiledMapServiceLayer,
            ArcGISDynamicMapServiceLayer,
            FeatureLayer,
            on,
            connect,
            dom,
            keys,
            registry,
            domConstruct,
            parser,
            arrayUtils,
            Color,
            has,
            Units,
            esriConfig,
            SpatialReference,
            InfoTemplate,
            SnappingManager,
            Measurement,
            HomeButton,
            Legend,
            LayerList,
            domUtils,
            Geometry,
            Point,
            Graphic,
            SimpleMarkerSymbol,
            PictureMarkerSymbol,
            SimpleLineSymbol,
            SimpleFillSymbol,
            TooltipDialog,
            popup,
            PopupTemplate,
            GeometryService,
            esriLang,
            domStyle
        };
    }

    //创建地图
    createMap(containerDomId, Layers, infoWindow) {
        // 初始化地图
        this.modules.parser.parse();
        const map = new this.modules.Map(containerDomId, {
            zoom: parseInt(MapConfigure.MapCenter.Center_Zoom),
            logo: false,
            showAttribution: false,
            showLabels: true,
            center: new this.modules.Point(MapConfigure.MapCenter.Center_X, MapConfigure.MapCenter.Center_Y, new this.modules.SpatialReference({
                wkid: MapConfigure.MapExtent.SpatialReference
            })), //定位中心点
            infoWindow: infoWindow,
            minZoom: 0,
            // maxZoom:11,
            // lods:MapConfigure.lods
        });
        //加载基础图层信息
        _.forEach(MapConfigure.BaseLayers, ObjValue => {
            let CurrentLayer = undefined;
            if(!ObjValue.layertype || ObjValue.layertype===1)
            {
                CurrentLayer = new this.modules.ArcGISTiledMapServiceLayer(ObjValue.layerURL);
            }
            if(ObjValue.layertype===2)
            {
                CurrentLayer=new this.modules.ArcGISDynamicMapServiceLayer(ObjValue.layerURL);
            }
            
            CurrentLayer.id = ObjValue.layerName;
            CurrentLayer.visible = ObjValue.isActive;
            map.addLayer(CurrentLayer);
        });

        //添加分组图层
        _.forEach(MapConfigure.FeatureLayerGroup, GroupValue => {
            //判断当前图层是否启用
            if (GroupValue.isEnable) {
                //特性图层添加
                _.forEach(GroupValue.featureLayers, featureValue => {
                    let _FeatureURL = GroupValue.layerURL;
                    if (!_.endsWith(GroupValue.layerURL, '/')) {
                        _FeatureURL = GroupValue.layerURL + "/";
                    }
                    let featureLayer = new this.modules.FeatureLayer(_FeatureURL + featureValue.layerIndex, {
                        id: featureValue.layerName,
                        mode: this.getFeatureMode("MODE_ONDEMAND"),
                        outFields: ["*"],
                        advancedQueryCapabilities: {
                            supportsPagination: true,
                            supportsQueryWithDistance: true,
                            supportsReturningQueryExtent: true,
                            supportsStatistics: true,
                            supportsOrderBy: true,
                            supportsDistinct: true
                        }
                    });
                    //图层类别判断
                    if (featureValue.layerType === 1) { //1：代表管线 2：代表节点
                        // featureLayer.setSelectionSymbol(new this.modules.SimpleLineSymbol(
                        //     this.modules.SimpleLineSymbol.STYLE_SOLID,
                        //     new this.modules.Color([255, 255, 0]),
                        //     2
                        // ));
                        //featureLayer.setSelectionSymbol(new this.modules.SimpleLineSymbol().setColor(new this.modules.Color([255,0,0,1])));
                    } else {
                        // featureLayer.setDefinitionExpression("equipment_type_ <> ''");
                        // featureLayer.minScale = 20000;
                        // featureLayer.setSelectionSymbol(new this.modules.SimpleMarkerSymbol(
                        //     this.modules.SimpleMarkerSymbol.STYLE_CIRCLE,
                        //     12,
                        //     new this.modules.SimpleLineSymbol(this.modules.SimpleLineSymbol.STYLE_NULL, new this.modules.Color([0, 255, 255]), 1),
                        //     new this.modules.Color([0, 255, 255])
                        // ));
                    }
                    //弹出框内容
                    let popupContent = [];
                    _.forEach(featureValue.featureColumn, ColumnValue => {
                        popupContent.push(ColumnValue.text + ":${" + ColumnValue.field + "}");
                    });
                    //标注层
                    let json = {
                        //title: "${OBJECTID}",
                        title: featureValue.layerCName,
                        content: popupContent.join("<br/>") //"${*}"
                    };
                    let infoTemplate = new this.modules.InfoTemplate(json);
                    featureLayer.infoTemplate = infoTemplate;
                    featureLayer.visible = featureValue.isActive; //图层是否显示
                    featureLayer.name = featureValue.layerCName;
                    map.addLayer(featureLayer);
                    //为图例做准备
                    this.FeatureLayerCollection.push(featureLayer);
                });
            }
        });

        //添加传输进来的图层
        if (_.isArray(Layers)) {
            _.forEach(Layers, function (row) {
                map.addLayer(row); //添加地图图层
            });
        }

        //该图层主要针对绘制图层
        let Graphicslayer = new this.modules.GraphicsLayer();
        Graphicslayer.id = "Graphicslayer";
        Graphicslayer.visible = true;
        map.addLayer(Graphicslayer);

        return map;
    }

    //创建切片图层
    createLayer(layerURL, LayerID) {
        var baseLayer = new this.modules.ArcGISTiledMapServiceLayer(layerURL);
        baseLayer.id = LayerID;
        return baseLayer;
    }

    //创建矢量图层
    createDynamicLayer(layerURL, LayerID) {
        var baseLayer = new this.modules.ArcGISTiledMapServiceLayer(layerURL);
        baseLayer.id = LayerID;
        return baseLayer;
    }

    //创建特性图层
    createFeatureLayer(layerURL, featureModel, outFields) {
        let featureLayer = new this.modules.FeatureLayer(layerURL, {
            mode: this.getFeatureMode(featureModel),
            outFields: outFields
        });
        return featureLayer;
    }

    /**
     * 创建地图图例信息
     * @param {地图对象} _Map 
     * @param {图例容器} domControlName
     */
    // createLegend(_Map, domControlName) {
    //     let layerInfo = _.map(this.FeatureLayerCollection, resultValue => {
    //         return {
    //             layer: resultValue,
    //             title: resultValue.name
    //         }
    //     });
    //     if (layerInfo.length > 0) {
    //         let stackedLegend = dijit.byId(domControlName);
    //         if (stackedLegend) {
    //             stackedLegend.destroyRecursive(true);
    //         }
    //         let legendDijit = new this.modules.Legend({
    //             map: _Map,
    //             layerInfos: layerInfo
    //         }, domControlName);
    //         legendDijit.startup()
    //     }
    // }

    /**
     * 创建比例尺
     * @param {地图对象} _Map 
     */
    createScalebar(_Map) {
        let scalebar = new this.modules.Scalebar({
            map: _Map,
            // scalebarStyle: "line",
            scalebarUnit: "metric"
        });
        return;
    }

    /**
     * 创建鹰眼
     * @param {地图对象} _Map 
     */
    createOverviewMap(_Map) {
        let overviewMapDijit = new this.modules.OverviewMap({
            map: _Map,
            visible: false
        });
        overviewMapDijit.startup();
    }

    /**
     * 创建搜索框对象
     * @param {地图对象} _Map 
     */
    createSearch(_Map) {
        let search = new this.modules.Search({
            enableLabel: true,
            enableInfoWindow: false,
            map: _Map
        }, "");
        search.startup();
        return search;
    }

    /**
     * 
     * @param {地图对象} _Map 
     * @param {显示的Dom对象} _viewDome 
     */
    createMouse(_Map, allDoneCallBack) {
        _Map.on("mouse-move", allDoneCallBack);
        _Map.on("mouse-drag", allDoneCallBack);
    }

    //特性图层类型
    getFeatureMode(modelType) {
        let featurMode = null;
        switch (modelType) {
            case "MODE_AUTO":
                featurMode = this.modules.FeatureLayer.MODE_AUTO;
                break;
            case "MODE_ONDEMAND":
                featurMode = this.modules.FeatureLayer.MODE_ONDEMAND;
                break;
            case "MODE_SELECTION":
                featurMode = this.modules.FeatureLayer.MODE_SELECTION;
                break;
            case "MODE_SNAPSHOT":
                featurMode = this.modules.FeatureLayer.MODE_SNAPSHOT;
                break;
            case "POPUP_HTML_TEXT":
                featurMode = this.modules.FeatureLayer.POPUP_HTML_TEXT;
                break;
            case "POPUP_NONE":
                featurMode = this.modules.FeatureLayer.POPUP_NONE;
                break;
            case "POPUP_URL":
                featurMode = this.modules.FeatureLayer.POPUP_URL;
                break;
            case "SELECTION_ADD":
                featurMode = this.modules.FeatureLayer.SELECTION_ADD;
                break;
            case "SELECTION_NEW":
                featurMode = this.modules.FeatureLayer.SELECTION_NEW;
                break;
            case "SELECTION_SUBTRACT":
                featurMode = this.modules.FeatureLayer.SELECTION_SUBTRACT;
                break;
        }
        return featurMode;
    }

    //添加图层集合
    addLayers(_Map, layers) {
        _Map.addLayers(layers);
    }

    //添加单个图层
    addLayer(_Map, layer) {
        _Map.addLayer(layer);
    }

    /**
     * 构造弹出对话框
     */
    createPopup() {
        let popup = new this.modules.popup(null, this.modules.domConstruct.create("div"));
        return popup;
    }

    /**
     * 构建点点对象
     * @param {*} x  经度 
     * @param {*} y  维度
     */
    createPoint(x, y) {
        let point = new this.modules.Point();
        point.x = x;
        point.y = y;
        return point;
    }

    //创建回到开始加载页
    createHomeButton(_Map, homeDiv) {
        let home = new this.modules.HomeButton({
            map: _Map
        }, homeDiv);
        return home;
    }
}

export default BaseMap;