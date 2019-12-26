/**
 * 地图基本操作
 * 功能：点选、框选、平移、拉框放大、拉框缩小、距离测算、面积量算、清除
 *       图例、图层控制、地图截图、打印、放大、缩小、全图
 */
import * as esriLoader from 'esri-loader';
import Vue from "@vue";
import _ from 'lodash';
import {
    MapConfigure,
    ArcgisJS,
    ArcgisCSS,
    GISWebData
} from "@common/consts/GisConst/MapConfigure";
import {
    parse
} from 'url';

//加载CSS样式文件
// esriLoader.loadCss(`https://js.arcgis.com/${JS_API_VERSION}/esri/css/esri.css`);
// const LOAD_MODULES_OPTIONS = {
//     url: `https://js.arcgis.com/${JS_API_VERSION}/`
// };


//加载CSS样式文件
esriLoader.loadCss(ArcgisCSS);
const LOAD_MODULES_OPTIONS = {
    url: ArcgisJS
};
//量算单位
const operValObj = {
    length: 'm',
    area: 'm',
    areaName: '米'
}

/*地图浏览基本操作类*/
class MapNavigate {
    //构造函数
    constructor(_map) {
        this.modules = {}
        this.Map = _map;
        //操作类型
        this.operType = {
            line: 'disFun', //距离测量
            area: 'areaFun', //面积测量
            pointSelect: "point", //点选
            fillSymbolSelect: "fillSymbol", //填充选择
            areaSelect: "areaSelect", //多边形选择统计
            selectSquibPoint: "selectSquibPoint", //爆管点选择
            setJoinJoinAnalysis: "setJoinJoinAnalysis", //连通点选择
            getMapPoint: "getMapPoint", //获取地图上选中点位
            drawLine: "drawLine", //地图上画线
            default: '' //默认不操作
        }
        this.ButtonType = this.operType.default; //快捷菜单操作类型
        this.SwipeMap = null;//卷帘需要的变量
        this.MagnifyMap = null;//透视所需的变量
    }

    //快捷菜单初始化
    async init() {
        const [
            // ClusterLayer,
            Map,
            LayerSwipe,
            ClassBreaksRenderer,
            InfoTemplate,
            SpatialReference,
            GraphicsLayer,
            FeatureLayer,
            Navigation,
            Draw,
            GeometryService,
            Font,
            SimpleMarkerSymbol,
            SimpleLineSymbol,
            SimpleFillSymbol,
            TextSymbol,
            PictureMarkerSymbol,
            Color,
            number,
            graphicsUtils,
            Graphic,
            geometryEngine,
            LengthsParameters,
            Point,
            Polyline,
            Circle,
            Polygon,
            AreasAndLengthsParameters,
            query,
            QueryTask,
            StatisticDefinition,
            InfoWindowLite,
            IdentifyTask,
            IdentifyParameters,
            Popup,
            domAttr,
            PrintTask,
            PrintTemplate,
            PrintParameters,
            Print,
            esriRequest,
            esriConfig,
            arrayUtils,
            LinearUnit,
            on,
            Extent,
            ArcGISTiledMapServiceLayer,
        ] =
            await esriLoader.loadModules([
                // "extras/ClusterLayer",
                "esri/map",
                "esri/dijit/LayerSwipe",
                "esri/renderers/ClassBreaksRenderer",
                "esri/InfoTemplate",
                "esri/SpatialReference",
                "esri/layers/GraphicsLayer",
                "esri/layers/FeatureLayer",
                "esri/toolbars/navigation",
                "esri/toolbars/draw",
                "esri/tasks/GeometryService",
                "esri/symbols/Font",
                "esri/symbols/SimpleMarkerSymbol",
                "esri/symbols/SimpleLineSymbol",
                "esri/symbols/SimpleFillSymbol",
                "esri/symbols/TextSymbol",
                "esri/symbols/PictureMarkerSymbol",
                "esri/Color",
                "dojo/number",
                "esri/graphicsUtils",
                "esri/graphic",
                "esri/geometry/geometryEngine",
                "esri/tasks/LengthsParameters",
                "esri/geometry/Point",
                "esri/geometry/Polyline",
                "esri/geometry/Circle",
                "esri/geometry/Polygon",
                "esri/tasks/AreasAndLengthsParameters",
                "esri/tasks/query",
                "esri/tasks/QueryTask",
                "esri/tasks/StatisticDefinition",
                "esri/dijit/InfoWindowLite",
                "esri/tasks/IdentifyTask",
                "esri/tasks/IdentifyParameters",
                "esri/dijit/Popup",
                "dojo/dom-attr",
                "esri/tasks/PrintTask",
                "esri/tasks/PrintTemplate",
                "esri/tasks/PrintParameters",
                "esri/dijit/Print",
                "esri/request",
                "esri/config",
                "dojo/_base/array",
                "esri/tasks/LinearUnit",

                "dojo/on",
                "esri/geometry/Extent",
                "esri/layers/ArcGISTiledMapServiceLayer",
                "dojo/domReady!",
            ], LOAD_MODULES_OPTIONS);
        // 在这里将模块变量绑定到实例
        this.modules = {
            // ClusterLayer,
            Map,
            LayerSwipe,
            ClassBreaksRenderer,
            InfoTemplate,
            SpatialReference,
            GraphicsLayer,
            FeatureLayer,
            Navigation,
            Draw,
            GeometryService,
            Font,
            SimpleMarkerSymbol,
            SimpleLineSymbol,
            SimpleFillSymbol,
            TextSymbol,
            PictureMarkerSymbol,
            Color,
            number,
            graphicsUtils,
            Graphic,
            geometryEngine,
            LengthsParameters,
            Point,
            Polyline,
            Circle,
            Polygon,
            AreasAndLengthsParameters,
            query,
            QueryTask,
            StatisticDefinition,
            InfoWindowLite,
            IdentifyTask,
            IdentifyParameters,
            Popup,
            domAttr,
            PrintTask,
            PrintTemplate,
            PrintParameters,
            Print,
            esriRequest,
            esriConfig,
            arrayUtils,
            LinearUnit,
            on,
            Extent,
            ArcGISTiledMapServiceLayer,
        };

        //导航工具条
        this.navToolbar = new this.modules.Navigation(this.Map);
        //toolbar工具条
        this.toolbar = new Draw(this.Map, {
            showTooltips: false
        });

        //连通性分析服务开始
        // this.Geoprocessor = new this.modules.Geoprocessor(MapConfigure.SpatialAnalysisURL.GPService);
        // this.Geoprocessor.setOutputSpatialReference(this.Map.spatialReference);

        // esri.bundle.toolbars.draw.addPoint = "点击查询";
        // esri.bundle.toolbars.draw.addShape = "点击绘制查询的矩形区域，按下鼠标开始绘制，松开鼠标完成绘制";
        //开启ArcGis几何分析服务
        this.geometryService = new GeometryService(MapConfigure.SpatialAnalysisURL.GeometryService);
        this.totleDistance = 0.0; //总距离
        this.totalGraphic = null; //存储点集合

        this.inputPoints = []; //存储生成点的集合
        this.startFont = new this.modules.Font('12px').setWeight(this.modules.Font.WEIGHT_BOLD); //定义文字样式
        //标注
        this.makerSymbol = new this.modules.SimpleMarkerSymbol(this.modules.SimpleMarkerSymbol.STYLE_CIRCLE, 8,
            new this.modules.SimpleLineSymbol(this.modules.SimpleLineSymbol.STYLE_SOLID, new this.modules.Color([204, 102, 51]), 1),
            new this.modules.Color([158.184, 71, 0.65])); //定义标记点样式

        //触发完成的事件
        this.toolbar.on("draw-complete", evt => {
            let gLayer = this.getFeatureLayerByName("Graphicslayer");//取得绘制图层对象
            switch (this.ButtonType) {
                case this.operType.line: //距离量算
                    this.addMeasureToMap(evt);
                    this.Map.graphics.add(new this.modules.Graphic(evt.geometry, this.createSimpleLineSymbol([255, 0, 0, 0.8], 2)));
                    break;
                case this.operType.area://面积量算
                    this.addMeasureToMap(evt);
                    // this.toolbar.deactivate(); //撤销地图绘制功能
                    break;
                //点选
                case this.operType.pointSelect://点选
                    if (this.options.featureQueryCompleted && this.options.featureQueryCompleted instanceof Function) {
                        this.options.featureQueryCompleted(evt)
                    }
                    break;
                case this.operType.fillSymbolSelect://框选
                    this.featureQueryTask(evt.geometry, result => {
                        this.options.featureQueryCompleted instanceof Function && this.options.featureQueryCompleted(result)
                    });
                    this.toolbar.deactivate(); //撤销地图绘制功能
                    break;
                case this.operType.areaSelect: //面积选择，例如，缓冲区查询，或者统计区域统计类
                    //进行返回数据
                    gLayer.add(new this.modules.Graphic(evt.geometry, this.createSimpleFillSymbol()));
                    this.options.featureQueryCompleted instanceof Function && this.options.featureQueryCompleted(evt);
                    this.toolbar.deactivate(); //撤销地图绘制功能
                    break;
                case this.operType.selectSquibPoint: //爆管点选择绘制
                    gLayer.add(new this.modules.Graphic(evt.geometry, this.createPictureMarkerSymbol("baselayer/dian.gif", 30, 30)));
                    this.options.featureQueryCompleted instanceof Function && this.options.featureQueryCompleted(evt);
                    this.toolbar.deactivate(); //撤销地图绘制功能
                    this.mapOperationInit(true, true)
                    break;
                case this.operType.setJoinJoinAnalysis: //连通分析点选择
                    gLayer.add(new this.modules.Graphic(evt.geometry, this.createPictureMarkerSymbol("baselayer/dian.gif", 30, 30)));
                    this.options.featureQueryCompleted instanceof Function && this.options.featureQueryCompleted(evt);
                    break;
                case this.operType.getMapPoint: //获取地图空间数据点
                    if (!this.options.NoSympol) {
                        gLayer.add(new this.modules.Graphic(evt.geometry, this.createPictureMarkerSymbol("baselayer/dian.gif", 30, 30)));
                    }
                    this.options.featureQueryCompleted && this.options.featureQueryCompleted instanceof Function && this.options.featureQueryCompleted(evt);
                    this.toolbar.deactivate(); //撤销地图绘制功能
                    break;
                case this.operType.drawLine: //画线
                    gLayer.add(new this.modules.Graphic(evt.geometry, this.createSimpleLineSymbol([255, 0, 0, 0.8], 2)));
                    this.options.featureQueryCompleted instanceof Function && this.options.featureQueryCompleted(evt);
                    this.toolbar.deactivate(); //撤销地图绘制功能
                    break;
                default:
                    break;
            }
        });

        //生成两点之间的连线
        // this.toolbar.setLineSymbol(new this.modules.SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new this.modules.Color([255,
        //     0, 0
        // ]), 2));
    }
    //快捷菜单操作类型
    navButton(operType, options = {}) {
        //地图操作功能模块初始化
        if (!_.isNull(options)) {
            this.options = options;
        } else {
            this.options = {};
        }
        //地图操作类型
        switch (operType) {
            case "拉框缩小":
                this.navToolbar.activate(this.modules.Navigation.ZOOM_OUT);
                break;
            case "拉框放大":
                this.navToolbar.activate(this.modules.Navigation.ZOOM_IN);
                break;
            case "画圆":
                this.circleSelect();
                break;
            case "长方形":
                this.rectangleSelect();
                break;
            case "多边形":
                this.polygonSelect();
                break;
            case "多边形吸附":
                this.polygonSelect(true);
                break;
            case "线":
                this.lineSelect();
                break;
            case "爆管点":
                this.setSquibPoint();
                break;
            case "当前范围":
                this.currentRange();
                break;
        }
    }

    /**
     * 地图操作前设定
     * @param {是否取消InfoWindow选中事件} isInfoWindow 
     * @param {是否启动吸附功能} isSnapping 
     */
    mapOperationInit(isInfoWindow, isSnapping) {
        this.Map.enableScrollWheelZoom();
        this.Map.setInfoWindowOnClick(isInfoWindow); //取消Infowinddow 选中事件
        this.Map.enableSnapping({
            alwaysSnap: isSnapping
        }); //启动吸附功能
    }

    /**
     * 选择联通分析点
     */
    setJoinJoinAnalysis(options = {}) {
        //地图操作功能模块初始化
        if (!_.isNull(options)) {
            this.options = options;
        } else {
            this.options = {};
        }
        this.mapOperationInit(false, true);
        this.ButtonType = this.operType.setJoinJoinAnalysis;
        this.toolbar.activate(this.modules.Draw.POINT);
    }

    /**
     * 从地图上获取点位坐标
     * @param {是否启动吸附功能} isSnap 
     * @param {回调函数} options 
     */
    getMapPoint(isSnap, options = {}) {
        if (!_.isNull(options)) {
            this.options = options;
        } else {
            this.options = {};
        }
        this.mapOperationInit(false, isSnap);
        this.ButtonType = this.operType.getMapPoint;
        this.toolbar.activate(this.modules.Draw.POINT);
    }

    /**
     * 从地图上获取线
     * @param {回调函数} options 
     */
    getMapLine(options = {}) {
        if (!_.isNull(options)) {
            this.options = options;
        } else {
            this.options = {};
        }
        this.mapOperationInit(false, false);
        this.ButtonType = this.operType.drawLine;
        this.toolbar.activate(this.modules.Draw.POLYLINE);
    }


    /**
     * 设置爆管点
     */
    setSquibPoint() {
        this.mapOperationInit(false, true);
        this.ButtonType = this.operType.selectSquibPoint;
        this.toolbar.activate(this.modules.Draw.POINT);
    }

    //当前屏幕展示的地图范围
    currentRange() {
        let extent = this.Map.extent
        let coordinates = [[[extent.xmin, extent.ymax], [extent.xmax, extent.ymax], [extent.xmax, extent.ymin], [extent.xmin, extent.ymin], [extent.xmin, extent.ymax]]]
        let polygonJson = {
            "rings": coordinates, "spatialReference": this.Map.spatialReference
        };
        let polygon = new this.modules.Polygon(polygonJson);
        let gLayer = this.getFeatureLayerByName("Graphicslayer");
        gLayer.add(new this.modules.Graphic(polygon, this.createSimpleFillSymbol()));
        this.options.featureQueryCompleted instanceof Function && this.options.featureQueryCompleted({ geometry: polygon });
    }
    //画圆选择统计
    circleSelect() {
        this.mapOperationInit(false, false);
        this.ButtonType = this.operType.areaSelect;
        this.toolbar.activate(this.modules.Draw.CIRCLE);
    }

    //长方形选择统计
    rectangleSelect() {
        this.mapOperationInit(false, false);
        this.ButtonType = this.operType.areaSelect;
        this.toolbar.activate(this.modules.Draw.RECTANGLE);
    }


    //多边形选择统计
    polygonSelect(snip = false) {
        this.mapOperationInit(false, snip);
        this.ButtonType = this.operType.areaSelect;
        this.toolbar.activate(this.modules.Draw.POLYGON);
    }


    //线选择统计
    lineSelect() {
        this.mapOperationInit(false, false);
        this.ButtonType = this.operType.drawLine;
        this.toolbar.activate(this.modules.Draw.POLYLINE);
    }
    //mapBar 缩小
    zoomin() {
        let level = parseInt(this.Map.getLevel());
        this.Map.setLevel(level - 1);
    }

    //mapBar 放大
    zoomout() {
        let level = parseInt(this.Map.getLevel());
        this.Map.setLevel(level + 1);
    }

    //mapBar 全图
    Polyline() {
        this.Map.centerAndZoom(new this.modules.Point(MapConfigure.MapCenter.Center_X, MapConfigure.MapCenter.Center_Y, this.Map.spatialReference), parseInt(MapConfigure.MapCenter.Center_Zoom));
    }

    //mapBar 清除
    mapClean() {
        this.clearAction();
        this.clearGraphicslayer();
    }

    //mapBar 平移
    mapPointMove() {
        this.navToolbar.activate(this.modules.Navigation.PAN);
    }

    //mapBar 长度量算
    distanceMeasure(operVal) {
        if (operVal) {
            operValObj.length = operVal
        }
        this.mapOperationInit(false, false);
        this.ButtonType = this.operType.line;
        this.toolbar.activate(this.modules.Draw.POLYLINE);
    }

    //mapBar 面积量算
    areaMeasure(operVal) {
        if (operVal) {
            operValObj.area = operVal.area
            operValObj.areaName = operVal.areaName
        }
        this.mapOperationInit(false, false);
        this.ButtonType = this.operType.area;
        this.toolbar.activate(this.modules.Draw.POLYGON);
    }

    /**
     * mapBar 点选
     * @param {回调函数} options 
     */
    pointSelect(options) {
        if (options) {
            this.options = options;
            this.mapOperationInit(false, true);
        } else {
            this.options = {};
            this.mapOperationInit(true, true);
        }
        this.ButtonType = this.operType.pointSelect;
        this.toolbar.activate(this.modules.Draw.POINT);
    }

    //mapBar  框选
    rangleSelect(options) {
        if (!_.isNull(options)) {
            this.options = options;
        } else {
            this.options = {};
        }
        this.mapOperationInit(false, false);
        this.Map.enableScrollWheelZoom();
        this.ButtonType = this.operType.fillSymbolSelect;
        this.toolbar.activate(this.modules.Draw.RECTANGLE);
    }



    //量算函数
    mapMeasureClick(evt) {
        if (this.ButtonType === this.operType.line) {
            this.inputPoints.push(evt.mapPoint);
            let textSymbol;
            if (this.inputPoints.length === 1) {
                textSymbol = new this.modules.TextSymbol("起点", this.startFont, new this.modules.Color([204, 102, 51]));
                textSymbol.setOffset(0, -20);
                this.Map.graphics.add(new this.modules.Graphic(evt.mapPoint, textSymbol));
            }
            this.Map.graphics.add(new this.modules.Graphic(evt.mapPoint, this.makerSymbol));
            if (this.inputPoints.length >= 2) {
                //    设置距离测量的参数
                let lengthParams = new this.modules.LengthsParameters();
                lengthParams.distanceUnit = this.modules.GeometryService.UNIT_METER;
                lengthParams.calculationType = "preserveShape";
                let p1 = this.inputPoints[this.inputPoints.length - 2];
                let p2 = this.inputPoints[this.inputPoints.length - 1];
                if (p1.x === p2.x && p1.y === p2.y) {
                    return;
                }
                //在两点之间划线将两点链接起来
                let polyline = new this.modules.Polyline(this.Map.spatialReference);
                polyline.addPath([p1, p2]);
                lengthParams.polylines = [polyline];
                // 根据参数，动态的计算长度
                this.geometryService.lengths(lengthParams, distance => {
                    let _distance = this.modules.number.format(distance.lengths[0]);
                    this.totleDistance += parseFloat(_distance); //计算总长度
                    let beetwentDistances
                    switch (operValObj.length) {
                        case 'm':
                            beetwentDistances = _distance + "米";
                            break;
                        case 'km':
                            beetwentDistances = _distance / 1000 + "千米";
                            break;
                    }

                    let tdistance = new this.modules.TextSymbol(beetwentDistances, this.startFont,
                        new this.modules.Color([204, 102, 51]));
                    tdistance.setOffset(40, -3);
                    this.Map.graphics.add(new this.modules.Graphic(p2, tdistance));
                    if (this.totalGraphic) {
                        this.Map.graphics.remove(this.totalGraphic);
                    }
                    let total = this.modules.number.format(this.totleDistance, {
                        pattern: "#.000"
                    });
                    //    设置总长度的显示样式，并添加到地图上
                    let lenghtTotal
                    switch (operValObj.length) {
                        case 'm':
                            lenghtTotal = "总长度：" + total + "米"
                            break;
                        case 'km':
                            lenghtTotal = "总长度：" + total / 1000 + "千米";
                            break;
                    }
                    let totalSymbol = new this.modules.TextSymbol(lenghtTotal,
                        this.startFont, new this.modules.Color([204, 102, 51]));
                    totalSymbol.setOffset(40, -15);
                    this.totalGraphic = this.Map.graphics.add(new this.modules.Graphic(p2, totalSymbol));
                });
            }
        }
    }

    //构造点对现象标记
    createSimpleMarkerSymbol() {
        let symbol = new this.modules.SimpleMarkerSymbol(this.modules.SimpleMarkerSymbol.STYLE_CIRCLE, 10,
            new this.modules.SimpleLineSymbol(this.modules.SimpleLineSymbol.STYLE_SOLID, new this.modules.Color([
                255, 0, 0
            ]), 1),
            new this.modules.Color([0, 255, 0, 0.25]));
        return symbol;
    }

    /**
     * 构造线对象标记
     * @param {色值} color 例如：[255, 0, 0, 0.8]
     * @param {线宽} SoildWidth 
     */
    createSimpleLineSymbol(color, SoildWidth) {
        let symbol = new this.modules.SimpleLineSymbol(this.modules.SimpleLineSymbol.STYLE_SOLID,
            new this.modules.Color(color), SoildWidth);
        return symbol;
    }

    //多边形标记
    createSimpleFillSymbol() {
        let symbol = new this.modules.SimpleFillSymbol(this.modules.SimpleFillSymbol.STYLE_SOLID,
            new this.modules.SimpleLineSymbol(this.modules.SimpleLineSymbol.STYLE_SOLID, new this.modules.Color([
                255, 0, 0
            ]), 2),
            new this.modules.Color([255, 255, 0, 0.25]));
        return symbol;
    }

    //构建图片标记
    createPictureMarkerSymbol(pictureName, _width, _height) {
        let symbol = new this.modules.PictureMarkerSymbol(require('@assets/toolIcon/' + pictureName), _width, _height);
        return symbol;
    }

    // 量算图形添加至地图
    addMeasureToMap(evt) {
        if (this.ButtonType === this.operType.line || this.ButtonType === this.operType.area) {
            let geometry = evt.geometry; //绘制图形的geometry
            //将绘制的图形添加到地图上去
            let symbol = null;
            switch (geometry.type) {
                case "point":
                    symbol = this.createSimpleMarkerSymbol();
                    break;
                case "polyline":
                    symbol = this.createSimpleLineSymbol([255, 0, 0, 0.8], 2);
                    break;
                case "polygon":
                    symbol = this.createSimpleFillSymbol();
                    break;
                case "extent":
                    symbol = this.createSimpleFillSymbol();
                    break;
            }
            this.Map.graphics.add(new this.modules.Graphic(geometry, symbol));
            if (this.ButtonType === this.operType.line) {
                this.inputPoints.splice(0, this.inputPoints.length); //删除数组中的所有元素
                this.totleDistance = 0.0;
                this.totalGraphic = null;
            } else if (this.ButtonType === this.operType.area) {
                let areasAndLengthsParameters = new this.modules.AreasAndLengthsParameters();
                let areaUnit = operValObj.areaName
                if (MapConfigure.MapExtent.isCurved) {
                    areasAndLengthsParameters.calculationType = 'preserveShape'
                } else {
                    areasAndLengthsParameters.calculationType = 'planar'
                }

                //设置面积和长度的参数
                switch (operValObj.area) {
                    case 'm':
                        areasAndLengthsParameters.lengthUnit = this.modules.GeometryService.UNIT_METER; //设置距离单位
                        areasAndLengthsParameters.areaUnit = this.modules.GeometryService.UNIT_SQUARE_METERS; //设置面积单位
                        break;
                    case 'km':
                        areasAndLengthsParameters.lengthUnit = this.modules.GeometryService.UNIT_KILOMETER; //设置距离单位
                        areasAndLengthsParameters.areaUnit = this.modules.GeometryService.UNIT_SQUARE_KILOMETERS; //设置面积单位
                        break;
                    case 'miles':
                        areasAndLengthsParameters.lengthUnit = this.modules.GeometryService.UNIT_METER; //设置距离单位
                        areasAndLengthsParameters.areaUnit = this.modules.GeometryService.UNIT_SQUARE_MILES; //设置面积单位
                        break;
                }


                this.geometryService.simplify([geometry], simplifiedGeometries => {
                    areasAndLengthsParameters.polygons = simplifiedGeometries;
                    this.geometryService.areasAndLengths(areasAndLengthsParameters,
                        result => {
                            let font = new this.modules.Font("16px", this.modules.Font.STYLE_NORMAL, this.modules.Font.letIANT_NORMAL, this.modules.Font.WEIGHT_BOLDER);
                            let areaResult = new this.modules.TextSymbol(this.modules.number.format(
                                result.areas[0], {
                                pattern: '#.000'
                            }) + areaUnit, font, new this.modules.Color([204, 102,
                                51
                            ]));
                            let spoint = new this.modules.Point(geometry.getExtent().getCenter()
                                .x, geometry.getExtent().getCenter().y, this.Map
                                .spatialReference);
                            this.Map.graphics.add(new this.modules.Graphic(spoint, areaResult)); //在地图上显示测量的面积
                        });
                });
            }
        }
    }

    //地图导出打印功能实现
    printMap(layOutConfig) {
        Vue.prototype.$startLoading()
        let printTask = new this.modules.PrintTask(MapConfigure.SpatialAnalysisURL.PrintService);
        let layouts = {
            layout: "A4 Landscape",
            label: "Landscape (PDF)",
            format: "svg",
            options: {
                legendLayers: [],
                authorText: "出图:刘  ",
                copyrightText: "出图出图出图出图出图出图出图出图",
                scalebarUnit: "Meters",
                titleText: "出图",
                customTextElements: [{
                    "info": "1234"
                }]
            }
        };

        if (layOutConfig) {
            Object.assign(layouts, layOutConfig);
        }
        let template = new this.modules.PrintTemplate();
        template.layoutOptions = layouts.options;
        template.layout = layouts.layout;
        template.label = layouts.label;
        template.format = layouts.format;
        // template.exportOptions = { dpi: 150 };
        let params = new this.modules.PrintParameters();
        params.map = this.Map;//地图map
        params.template = template;

        printTask.execute(params, evt => {
            Vue.prototype.$endLoading()
            window.open(evt.url, "_black");
        }, err => {
            Vue.prototype.$endLoading()
            console.log(err)
            alert(err)
        });
    }

    //图层显示与隐藏
    layerDiaplayOrHidden(layerName, ResultView) {
        let CurrentLayer = this.Map.getLayer(layerName);
        CurrentLayer.setVisibility(ResultView)
    }

    //图层显示与隐藏
    layerSetOpacity(layerName, opacity) {
        let CurrentLayer = this.Map.getLayer(layerName);
        CurrentLayer.setOpacity(opacity)
    }

    /**
     * POI搜索定位
     * @param {详细数据信息} popupContent 
     */
    setPOIView(popupContent, template) {
        if (!template) {
            if (popupContent.NAME) {
                template = "<label font-size=\"24px\">" + popupContent.NAME + "</label>"
            }
        }

        let setpoint = this.modules.Point(popupContent.geometry.x, popupContent.geometry.y, this.Map.spatialReference);
        this.Map.graphics.add(new this.modules.Graphic(setpoint, this.createPictureMarkerSymbol("baselayer/dian.gif", 30, 30)));
        this.Map.infoWindow.clearFeatures();
        if (template) {
            this.Map.infoWindow.setContent(template);
            this.Map.infoWindow.show(setpoint);
        }
        this.Map.centerAndZoom(setpoint, 8);
    }

    //清空函数
    clearAction() {
        this.toolbar.deactivate(); //撤销地图绘制功能
        this.ButtonType = this.operType.default; //将绘制操作置空
        this.Map.enableScrollWheelZoom();
        this.Map.graphics.clear();
        let graphicLayerIds = this.Map.graphicsLayerIds;
        let len = graphicLayerIds.length;
        for (let i = 0; i < len; i++) {
            let gLayer = this.Map.getLayer(graphicLayerIds[i]);
            //判断是否是Graphicslayer
            let GISWebDataFilter = _.filter(GISWebData, item => {
                return item.id === graphicLayerIds[i]
            })
            if (GISWebDataFilter && GISWebDataFilter.length) {

            } else if (graphicLayerIds[i] === "Graphicslayer" || graphicLayerIds[i] === "clusters") {
                // gLayer.clear();
            } else {
                gLayer.clearSelection(); //清除状态机
            }
        }
    };
    //展示部分图层信息
    setDefinitionExpression(layerName, query) {

        let featureLayer = this.Map.getLayer(layerName);
        featureLayer.setDefinitionExpression(query);

    }

    //绘制分析图层清空
    clearGraphicslayer(layerName) {
        let _layerName = "Graphicslayer";
        if (!_.isNull(layerName) && !_.isUndefined(layerName) && layerName.length > 0) {
            _layerName = layerName;
        }
        let gLayer = this.Map.getLayer(_layerName);
        gLayer.clear();
    }

    //取消绘制功能
    drawDeactivate() {
        this.toolbar.deactivate(); //撤销地图绘制功能
    };

    /**
     * 获取指定特性图层
     */
    getFeatureLayerByName(_layerName) {
        let selectLayer = this.Map.getLayer(_layerName);
        return selectLayer;
    }

    /**
     * 设施高亮显示
     * @param {设施集合} facilitiesCollection 
     */
    facilitiesView(facilitiesCollection, pictureName, tempateValue, templateJson) {
        let gLayer = this.getFeatureLayerByName("Graphicslayer");
        if (templateJson) {
            let infoTemplate = new this.modules.InfoTemplate(templateJson)
            gLayer.infoTemplate = infoTemplate;
        } else {
            gLayer.infoTemplate = undefined;
        }
        _.forEach(facilitiesCollection, (objValue, index) => {
            if (_.isUndefined(objValue.geometry)) {
                if (templateJson) {
                    gLayer.add(new this.modules.Graphic(new this.modules.Point(objValue.coordinate_x, objValue.coordinate_y, this.Map.spatialReference),
                        this.createPictureMarkerSymbol('mapIcon/' + pictureName, 20, 20), tempateValue[index]
                    ));
                } else {
                    gLayer.add(new this.modules.Graphic(new this.modules.Point(objValue.coordinate_x, objValue.coordinate_y, this.Map.spatialReference),
                        this.createPictureMarkerSymbol('mapIcon/' + pictureName, 20, 20)
                    ));
                }

            } else {
                if (templateJson) {
                    gLayer.add(new this.modules.Graphic(objValue.geometry, this.createPictureMarkerSymbol('mapIcon/' + pictureName, 20, 20), tempateValue[index]));
                } else {
                    gLayer.add(new this.modules.Graphic(objValue.geometry, this.createPictureMarkerSymbol('mapIcon/' + pictureName, 20, 20)));
                }

            }
        });
    }
    //点击Graphicslayer并回调
    facilitiesViewClick(callback) {
        let gLayer = this.getFeatureLayerByName("Graphicslayer");
        this.Map.setInfoWindowOnClick(false)
        let click = gLayer.on('dbl-click', res => {
            res.stopPropagation();
            if (callback && callback instanceof Function) {
                callback(click, res)
                setTimeout(() => {
                    this.Map.setInfoWindowOnClick(true)
                }, 500);

            }
        })
        callback(click)
    }

    //搜索管线高亮
    pipeLineView(pipeCollection) {
        let gLayer = this.getFeatureLayerByName("Graphicslayer");
        _.forEach(pipeCollection, objValue => {
            gLayer.add(new this.modules.Graphic(objValue.geometry, this.createSimpleLineSymbol([255, 87, 34, 1], 3), { 'type': 1 }));
        });
    }

    /**
     * 缓冲区查询分析
     * @param {空间数据点} point 
     * @param {分析点半径} metersLength 
     * @param {图层名称} _layerName 
     * @param {回调函数} allDoneCallback 
     */
    bufferAnalysis(_GData, metersLength, _layerName, allDoneCallback) {
        let gLayer = this.getFeatureLayerByName("Graphicslayer");
        gLayer.clear();
        let symbol = new this.modules.SimpleFillSymbol(this.modules.SimpleFillSymbol.STYLE_SOLID,
            new this.modules.SimpleLineSymbol(this.modules.SimpleLineSymbol.STYLE_SOLID, new this.modules.Color([
                255, 0, 0
            ]), 2),
            new this.modules.Color([255, 255, 0, 0.25]));
        let buffer
        if (MapConfigure.MapExtent.isCurved) {
            buffer = this.modules.geometryEngine.geodesicBuffer([_GData], [metersLength], "meters", true);
        } else {
            buffer = this.modules.geometryEngine.buffer([_GData], [metersLength], "meters", true);
        }
        let bufferGraphic = new this.modules.Graphic(buffer[0], symbol);
        gLayer.add(bufferGraphic);

        //空间数据查询
        let queryTask = new Promise((resolve, reject) => {
            let CurrentLayer = this.Map.getLayer(_layerName);
            //声明query对象
            let query = this.modules.query();
            //构建缓冲区
            query.geometry = buffer[0];
            query.returnGeometry = true;
            //执行查询操作
            CurrentLayer.queryFeatures(query, evt => {
                if (evt.features.length > 0) {
                    resolve(evt.features);
                } else {
                    resolve([]);
                }
            }, err => {
                reject(err)
            });
        });
        queryTask.then(result => {
            allDoneCallback(result);
        }).catch(err => {
            console.log("空间数据查询", err);
        });
    }

    /**
     * 空间数据查询
     * @param {空间数据} _GData     
     * @param {图层名称} _layerName 
     */
    featureQuery(_GData, _layerName, allDoneCallback) {
        let queryTask = new Promise((resolve, reject) => {
            let CurrentLayer = this.Map.getLayer(_layerName);
            //声明query对象
            let query = this.modules.query();
            //构建缓冲区
            let bufferedGeometries
            if (MapConfigure.MapExtent.isCurved) {
                bufferedGeometries = this.modules.geometryEngine.geodesicBuffer([_GData], [0.1], "meters", true);
            } else {
                bufferedGeometries = this.modules.geometryEngine.buffer([_GData], [0.1], "meters", true);
            }
            query.geometry = bufferedGeometries[0];
            //执行查询操作
            CurrentLayer.queryFeatures(query, evt => {
                if (evt.features.length > 0) {
                    resolve(_.map(evt.features, "attributes"));
                } else {
                    resolve([]);
                }
            }, err => {
                reject(err)
            });
        });
        queryTask.then(result => {
            allDoneCallback(result);
        }).catch(err => {
            console.log("空间数据查询", err);
        });
    }

    /**
     * 根据空间数据获取指定记录集
     * @param {控件数据} _GData 
     * @param {图层名称} _layerName 
     * @param {回调函数} allDoneCallback 
     */
    featureQueryFeature(_GData, _layerName, _SearchCondition, allDoneCallback) {

        let CurrentLayer = this.Map.getLayer(_layerName);
        //声明query对象
        let query = this.modules.query();
        //构建缓冲区
        query.geometry = _GData;
        query.where = _SearchCondition;
        query.returnGeometry = true;
        //执行查询操作
        CurrentLayer.queryFeatures(query, evt => {
            allDoneCallback(evt.features);
        }, err => {
            console.log("空间数据查询", err);
        });
    }

    /**
     * 根据编号查询管线
     * @param {设施编号} OBJECTID 
     * @param {图层名称} _layerName 
     * @param {回调函数} allDoneCallback
     */
    featureQueryByID(OBJECTID, _layerName, allDoneCallback) {
        let queryTask = new Promise((resolve, reject) => {
            let CurrentLayer = this.Map.getLayer(_layerName);
            let query = this.modules.query();
            query.objectIds = OBJECTID; //为数组
            query.outFields = ["*"];
            query.returnGeometry = true;
            CurrentLayer.queryFeatures(query, evt => {
                resolve(evt.features);
            }, err => {
                reject(err);
            });
        });
        queryTask.then(result => {
            allDoneCallback instanceof Function && allDoneCallback(result);
        }).catch(err => {
            console.log("回调函数报错", err);
        });
    }

    /**
     * 空间数据查询，按照全图层进行查询
     * @param {*} _GData            空间数据
     * @param {*} allDoneCallback   回调函数
     */
    featureQueryTask(_GData, allDoneCallback, metersLength, layerType) {
        let buffer
        if (metersLength) {
            if (MapConfigure.MapExtent.isCurved) {
                buffer = this.modules.geometryEngine.geodesicBuffer([_GData], [metersLength], "meters", true);
            } else {
                buffer = this.modules.geometryEngine.buffer([_GData], [metersLength], "meters", true);
            }
        }
        let taskList = []
        _.forEach(MapConfigure.FeatureLayerGroup, (GroupValue, index) => {
            //判断当前图层是否启用
            if (GroupValue.isEnable) {
                //特性图层循环
                _.forEach(GroupValue.featureLayers, featureValue => {
                    if (layerType && featureValue.layerType !== layerType) {
                        return
                    }
                    let queryTask = new Promise((resolve, reject) => {
                        let CurrentLayer = this.Map.getLayer(featureValue.layerName);
                        let query = this.modules.query();

                        query.geometry = _GData;
                        if (buffer) {
                            query.geometry = buffer[0];
                        }
                        CurrentLayer.selectFeatures(query, this.modules.FeatureLayer.SELECTION_NEW, evt => {
                            resolve({
                                groupName: GroupValue.groupName,
                                layerName: featureValue.layerName,
                                layerCName: featureValue.layerCName,
                                iconName: featureValue.iconName,
                                layerType: featureValue.layerType,
                                groupIndex: index,
                                layerIndex: featureValue.layerIndex,
                                listViewColumn: featureValue.listViewColumn,
                                layerData: evt
                            });
                        }, err => {
                            debugger;
                            reject(err)
                        });
                    });
                    taskList.push(queryTask)
                });
            }
        });
        Promise.all(taskList).then(result => {
            allDoneCallback(result);
        }).catch(err => {
            console.log('有一個task出錯', err);
        });
    }

    /**
     * 获取选中控件数据集合
     * @param {*} OBJECTID          设施或管线类型
     * @param {*} _layerName        图层名称
     * @param {*} allDoneCallback   回调函数
     */
    featureSearch(OBJECTID, _layerName, allDoneCallback) {
        let queryTask = new Promise((resolve, reject) => {
            let CurrentLayer = this.Map.getLayer(_layerName);
            let query = this.modules.query();
            query.returnGeometry = true;
            query.where = " OBJECTID=" + OBJECTID; //搜索条件
            if (_.isObject(OBJECTID)) {
                query.where = " PID=" + OBJECTID.PID; //搜索条件
            }
            CurrentLayer.selectFeatures(query, this.modules.FeatureLayer.SELECTION_NEW, evt => {
                resolve(evt);
            }, err => {
                reject(err);
            });
        });
        queryTask.then(result => {
            allDoneCallback(result);
        }).catch(err => {
            console.log("回调函数报错", err);
        });
    }

    /**
     * 空间数据定位
     * @param {*} objValue  定位对象
     */
    featureSetLocation(objValue) {
        let point = null;
        let centerPoint = null;
        //point | multipoint | polyline | polygon | extent
        switch (objValue.geometry.type) {
            case "point":
                point = objValue.geometry;
                this.Map.centerAndZoom(point, 11);
                break;
            case "polyline":
                centerPoint = objValue.geometry.getExtent();
                this.Map.setExtent(centerPoint, true); //定位
                //this.Map.setLevel(11)
                break;
            case "polygon":
                centerPoint = objValue.geometry.getExtent();
                this.Map.setExtent(centerPoint, true); //定位
                // this.Map.centerAndZoom(centerPoint, 11);
                break;
            // case "multipoint":
            //     break;
            // case "extent":
            //     break;
            default:
                break;
        }
    }

    /**
     * POI点定位
     * @param {经度} x 
     * @param {纬度} y 
     */
    setMapLocation(x, y) {
        let point = new this.modules.Point(x, y, this.Map.spatialReference);
        this.Map.centerAt(point);
        let gLayer = this.getFeatureLayerByName("Graphicslayer");
        gLayer.add(new this.modules.Graphic(point,
            this.createPictureMarkerSymbol("baselayer/dian.gif", 30, 30)
        ));
    }

    /**
     * 绘制多边形
     * @param {坐标点集合} coordinates 
     *参数示例：[[[-122.63, 45.52], [-122.57, 45.53], [-122.52, 45.50], [-122.49, 45.48],[-122.64, 45.49], [-122.63, 45.52], [-122.63, 45.52]]]
     */
    drawRangle(coordinates) {
        if (_.isEmpty(coordinates)) {
            return;
        }
        let polygonJson = {
            "rings": coordinates, "spatialReference": this.Map.spatialReference
        };
        let polygon = new this.modules.Polygon(polygonJson);
        let gLayer = this.getFeatureLayerByName("Graphicslayer");
        gLayer.add(new this.modules.Graphic(polygon, this.createSimpleFillSymbol()));
    }

    drawPonit(coordinates) {
        if (_.isEmpty(coordinates)) {
            return;
        }
        let setpoint = new this.modules.Point(coordinates[0], coordinates[1], this.Map.spatialReference);
        let buffer
        if (MapConfigure.MapExtent.isCurved) {
            buffer = this.modules.geometryEngine.geodesicBuffer([setpoint], [coordinates[2]], "meters", true);
        } else {
            buffer = this.modules.geometryEngine.buffer([setpoint], [coordinates[2]], "meters", true);
        }
        let gLayer = this.getFeatureLayerByName("Graphicslayer");
        gLayer.add(new this.modules.Graphic(buffer[0], this.createSimpleFillSymbol()));
    }

    addMapPoint(geometry) {
        let gLayer = this.getFeatureLayerByName("Graphicslayer");//取得绘制图层对象
        gLayer.add(new this.modules.Graphic(geometry, this.createPictureMarkerSymbol("baselayer/dian.gif", 30, 30)));
    }

    addGeometry(geometry) {
        let gLayer = this.getFeatureLayerByName("Graphicslayer");//取得绘制图层对象
        let symbol = new this.modules.SimpleFillSymbol(this.modules.SimpleFillSymbol.STYLE_SOLID,
            new this.modules.SimpleLineSymbol(this.modules.SimpleLineSymbol.STYLE_SOLID, new this.modules.Color([
                255, 0, 0
            ]), 2),
            new this.modules.Color([255, 255, 0, 0.25]));
        gLayer.add(new this.modules.Graphic(geometry, symbol));

    }

    addMapLine(geometry) {
        let gLayer = this.getFeatureLayerByName("Graphicslayer");//取得绘制图层对象
        gLayer.add(new this.modules.Graphic(geometry, this.createSimpleLineSymbol([255, 255, 0, 0.8], 6)));
    }

    //图层新增编辑属性删除操作方法
    featureLayerApplyEdits(layName, graphic, station, allDoneCallback, errorCallback) {
        let featureLayers = this.Map.getLayer(layName)
        let editObj = []
        if (station === 'add') {
            // 添加要素信息   修改要素信息 删除要素信息
            editObj = [[graphic], null, null]
        } else if (station === 'edit') {
            editObj = [null, [graphic], null]
        } else {
            editObj = [null, null, [graphic]]
        }
        featureLayers.applyEdits(
            ...editObj,
            result => {
                if (allDoneCallback && allDoneCallback instanceof Function) {
                    allDoneCallback(result)
                }
            },
            error => {
                if (errorCallback && errorCallback instanceof Function) {
                    errorCallback(error)
                }
            },
        )
    }

    //卷帘效果 开启
    SwipeMapInit() {
        if (!this.SwipeMap) {
            this.SwipeMap = new SwipeMap(this.Map, this.modules)
        }
        if (this.SwipeMap.initState) {
            this.clearSwipe()
            return
        } else {
            this.SwipeMap.initState = true
        }
        this.SwipeMap.InitSwipe()
    }

    //卷帘效果关闭
    clearSwipe() {
        if (this.SwipeMap && this.SwipeMap.initState) {
            this.SwipeMap.initState = false
            this.SwipeMap.clearSwipe()
        }

    }


    //放大镜效果 开启
    MagnifyMapInit() {
        if (!this.MagnifyMap) {
            this.MagnifyMap = new MagnifyMap(this.Map, this.modules)
        }
        if (this.MagnifyMap.initState) {
            this.clearMagnify()
        } else {
            this.MagnifyMap.initState = true
            this.MagnifyMap.InitMagnify()
        }

    }

    infoWindowUnseen() {
        this.Map.infoWindow.show(new this.modules.Point(-1, -1, this.Map.spatialReference))
    }


    //放大镜效果关闭
    clearMagnify() {
        if (this.MagnifyMap && this.MagnifyMap.initState) {
            this.MagnifyMap.initState = false
            this.MagnifyMap.clearMagnify()
        }

    }

}

//卷帘方法类
class SwipeMap {
    //构造函数
    constructor(map, modules) {
        this.swipeWidget = null;
        this.map = map;
        this.modules = modules;
        this.layerlist = _.cloneDeep(map.layerIds);
        this.divID = "";//卷帘对比的地图
        this.showDivID = "";//目前展示的地图
        this.len = 0;
    }

    InitSwipe() {
        let rt = true;
        this.getTopLayerDivID();
        if (!this.divID) {
            alert('当前图层不支持卷帘')
            return false
        }
        let swipeLayer = this.map.getLayer(this.divID)
        if (this.swipeWidget) {
            this.swipeWidget.layers = [swipeLayer]
            this.swipeWidget.enable()
        } else {
            this.swipeWidget = new this.modules.LayerSwipe({
                type: "vertical",  //Try switching to "scope" or "horizontal"
                map: this.map,
                layers: [swipeLayer]
            }, "swipeDiv");
            this.swipeWidget.startup();
        }
    }


    clearSwipe() {
        if (this.swipeWidget) {
            this.swipeWidget.disable()
            for (let i = 0; i < this.len; i++) {
                let item = this.map.getLayer(this.layerlist[i]);
                if (this.showDivID === item.id) {
                    item.setVisibility(true)
                } else {
                    item.visible && item.setVisibility(false)
                }
                this.map.reorderLayer(item, i)
            }
        }
    }

    getTopLayerDivID() {
        this.len = 0;
        if (this.layerlist != undefined && this.layerlist.length > 0) {
            this.len = this.layerlist.length;
        } else {
            this.divID = ''
            return 0;
        }

        if (this.len === 1) {
            this.divID = ''
            return
        }
        this.divID = '';
        for (let i = 0; i < this.len; i++) {
            let item = this.map.getLayer(this.layerlist[i]);
            if (item.visible) {
                this.showDivID = item.id;
            } else if (!this.divID) {
                this.divID = item.id
                this.map.reorderLayer(item, this.len - 1)
                item.setVisibility(true)
            }
        }
    }
}


//透视放大镜方法类
class MagnifyMap {
    //构造函数
    constructor(map, modules) {
        this._map_down = null;
        this._map_up = null;
        this._map_move = null
        this.map = map;
        this.modules = modules;
        this.divID = "MagnifyMap";
        this.mmap;
        this.radius = document.getElementById(this.map.id).offsetHeight / 4;
        this.levelMax = 2;
        this.mmap = null;//放大镜地图
    }
    searchLayerInfo(layerID) {
        let _layer;
        if (mapLayerObj != undefined) {
            _layer = mapLayerObj.searchLayerByLayerID(layerID);
        }
        return _layer;
    }

    InitMagnify() {
        let rt = true;
        let sdivID = this.getSecondLayerID();
        let div = document.getElementById(this.map.id + "_" + sdivID);
        let mlayer
        if (div.length && div.length > 0) {
            mlayer = searchLayerInfo(sdivID);
        } else if (div) {
            mlayer = div
        } else {
            alert("当前图层不支持透镜操作");
            rt = false;
        }
        if (mlayer == undefined || !rt) {
            showError("当前图层不支持透镜操作", true);
            rt = false;
        }
        if (rt) {
            this.mmap = new this.modules.Map("mmap", {
                slider: false,
                logo: false
            });
            this.mmap.setLevel(this.map.getLevel() + this.levelMax);
            this.mmap.centerAt(this.map.extent.getCenter());

            document.getElementById('mmapWrapper').style.width = this.radius * 2 + 'px';
            document.getElementById('mmapWrapper').style.height = this.radius * 2 + 'px';
            // document.getElementById(mmapWrapper).css("border-radius", "50%");
            let layer = new this.modules.ArcGISTiledMapServiceLayer(this.map.getLayer(sdivID).url);
            layer.id = 'mmap1'
            layer.visible = true
            this.mmap.addLayer(layer);
            //添加管网信息
            let graphicsLayerIds = this.map.graphicsLayerIds
            _.forEach(graphicsLayerIds, (item, index) => {
                let layer = _.cloneDeep(this.map.getLayer(item))
                if (!layer.url) {
                    return
                }
                let addLayer = new this.modules.FeatureLayer(layer.url, {
                    id: layer.id + index,
                    mode: this.modules.FeatureLayer.MODE_ONDEMAND,
                });
                this.mmap.addLayer(addLayer)
            })
            this.mmap.disablePan();
            this.mmap.disableDoubleClickZoom();
            this.mmap.disableScrollWheelZoom();
            this.mmap.disableSnapping();
            this.mmap.disableKeyboardNavigation();

            this.map.disablePan();
            this._map_down = this.map.on("mouse-drag", (e) => {
                e.stopPropagation();
                this.map.disablePan();
                this.mmap.setLevel(this.map.getLevel() + this.levelMax);
                this.mmap.centerAt(e.mapPoint)
                document.getElementById('mmapWrapper').style.visibility = 'visible';
                let offsetX = e.screenPoint.x;
                let offsetY = e.screenPoint.y;
                let mapx = e.mapPoint.x;
                let mapy = e.mapPoint.y;
                this.refreshDivSize(offsetX, offsetY, mapx, mapy);
            });
            this._map_up = this.map.on("mouse-up", (e) => {
                document.getElementById('mmapWrapper').style.visibility = 'hidden';
            });
        }

        return rt;
    }

    disableMagnify() {
        clearMagnify();
    }

    clearMagnify() {
        if (this._map_down != undefined) {
            this._map_down.remove();
            // this._map_up.remove();
            // this._map_move.remove()
            this.map.enablePan();
        }
        if (this.mmap != undefined) {
            this.mmap.removeAllLayers();
            this.mmap.destroy();
        }
        document.getElementById("mmapWrapper").style.visibility = "hidden";
    }

    getSecondLayerID() {
        let layerlist = this.map.layerIds;
        let len = 0;
        if (layerlist != undefined && layerlist.length > 0) {
            len = layerlist.length;
        } else {
            return null;
        }
        let layerID = null;
        for (let i = 0; i < len; i++) {
            let item = this.map.getLayer(layerlist[i]);
            if (item.visible) {
                layerID = item.id;
                break;
            }
        }
        return layerID;
    }

    refreshDivSize(offsetX, offsetY, mapX, mapY) {
        let t = offsetY - this.radius;
        let l = offsetX - this.radius;
        // document.getElementById("mmap").style.top = -(offsetY - this.radius) + "px";
        // document.getElementById("mmap").style.left = -(offsetX - this.radius) + "px";
        document.getElementById("mmapWrapper").style.top = t + "px";
        document.getElementById("mmapWrapper").style.left = l + "px";
    }
}


export default MapNavigate;