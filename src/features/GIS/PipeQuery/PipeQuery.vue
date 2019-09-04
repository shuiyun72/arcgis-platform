<template>
  <div class="Pipe_Query_container" component="PipeQuery">
    <div class="side_action_bar_placeholder">
      <MapActionBar
        v-show="mapBarShow"
        ref="MapActionBar"
        @coordinateSearch="coordinateSearch"
        @action-mapSearch="onMapSearch"
        @layer-click="onLayerViewOrHidden"
        @layer-ActionClear="onActionClear"
        @layerSetOpacity="layerSetOpacity"
        @axiosWebShowOrHidden="axiosWebShowOrHidden"
        :toolbar="_toolBar"
      ></MapActionBar>
    </div>
    <div class="coordinate-wrapper">
      <p>横坐标：{{coordinate[0]}}</p> 
      <p>纵坐标：{{coordinate[1]}}</p>
    </div>
    <!-- <div id="legendDiv" style="display:none;" ref="legendDiv"></div> -->
    <div id="mapNode"></div>
  </div>
</template>
<script>
import _ from "lodash";
import BaseMap from "@services/ArcMap/BaseMap"; // 地图基础类
import MapNavigate from "@services/ArcMap/MapNavigate"; //地图操作类
import * as businessMethod from "@services/ArcMap/businessMethod";//不同地图特别的业务操作
import MapDataOperation from "@services/ArcMap/MapDataOperation"; //空间数据查询
import MapActionBar from "./components/MapActionBar";
import { MapConfigure, LayerType , GISWebData} from "@common/consts/GisConst/MapConfigure";
import { debug, debuglog } from "util";
const MAP_CONTAINER_ID = "mapNode";
export default {
  components: { MapActionBar},
  data() {
    return { 
      mapBarShow:false,
      coordinate:[],//地图坐标
      selectEQ: null,
      searchType: ""
    };
  },
  created() {
    this.$bus.on("setMapLocation", this.SetMapLocation); //开启空间数据定位
    this.$bus.on("getStatisticsResult", this.getStatisticsResult); //开启空间数据统计
    this.$bus.on("selectSquib", this.selectSquib); //开启选择爆管点
    this.$bus.on("getSpaceData", this.getSpaceData); //根据数据库查询数据获取空间数据
    this.$bus.on("gpJoinAnalysis", this.gpJoinAnalysis); //连通性分析
    this.$bus.on("clearGraphics", this.clearGraphics); //清楚绘制图层
    this.$bus.on("clearGDataLayer", this.clearGDataLayer); //清除空间数据操作(高亮等)
    this.$bus.on("getMapPoint", this.getMapPoint); //获取地图上分析点=》例如火灾分析、拆迁分析
    this.$bus.on("getMapLine", this.getMapLine); //获取地图上分析线
    this.$bus.on("bufferAnalysis", this.bufferAnalysis); //缓冲区查询分析
    this.$bus.on("lineAnalysis", this.lineAnalysis); //根据地图上选中的线进行分析
    this.$bus.on("facilitiesView", this.facilitiesView); //设施高亮
    this.$bus.on("pipeLineView", this.pipeLineView); //管线高亮
    this.$bus.on("dataSearchByLayerName", this.dataSearchByLayerName); //根据图层进行检索数据信息
    this.$bus.on("getNeedLayer", this.getNeedLayer); //根据图层字符串查询获得需要的图层数组信息
    this.$bus.on("onLayerViewAllVisibale", this.onLayerViewAllVisibale); //是否展示管线等地图标志信息
    this.$bus.on("drawPolygon", this.drawPolygon); //绘制多边形
    this.$bus.on("pointSelect", this.pointSelect); //点击设备事件
    this.$bus.on("featureQueryTask", this.featureQueryTask); //全图层数据查询
    this.$bus.on("addMapPoint", this.addMapPoint); //地图添加点展示
    this.$bus.on("addMapLine", this.addMapLine); //地图添加点展示
    this.$bus.on("drawPonit", this.drawPonit); //地图添加点展示
  },
  beforeDestroy() {
    this.$bus.off("setMapLocation", this.SetMapLocation); //开启空间数据定位
    this.$bus.off("getStatisticsResult", this.getStatisticsResult); //开启空间数据统计
    this.$bus.off("selectSquib", this.selectSquib); //开启选择爆管点
    this.$bus.off("getSpaceData", this.getSpaceData); //根据数据库查询数据获取空间数据
    this.$bus.off("gpJoinAnalysis", this.gpJoinAnalysis); //连通性分析
    this.$bus.off("clearGraphics", this.clearGraphics); //清楚绘制图层
    this.$bus.on("clearGDataLayer", this.clearGDataLayer); //清除空间数据操作(高亮等)
    this.$bus.off("getMapPoint", this.getMapPoint); //获取地图上分析点=》例如火灾分析、拆迁分析
    this.$bus.off("getMapLine", this.getMapLine); //获取地图上分析线
    this.$bus.off("bufferAnalysis", this.bufferAnalysis); //缓冲区查询分析
    this.$bus.off("lineAnalysis", this.lineAnalysis); //根据地图上选中的线进行分析
    this.$bus.off("facilitiesView", this.facilitiesView); //设施高亮
    this.$bus.off("pipeLineView", this.pipeLineView); //管线高亮
    this.$bus.off("dataSearchByLayerName", this.dataSearchByLayerName); //根据图层进行检索数据信息
    this.$bus.off("getNeedLayer", this.getNeedLayer); //根据图层字符串查询获得需要的图层数组信息
    this.$bus.off("onLayerViewAllVisibale", this.onLayerViewAllVisibale); //是否展示管线等地图标志信息
    this.$bus.off("drawPolygon", this.drawPolygon); //绘制多边形
    this.$bus.off("pointSelect", this.pointSelect); //点击设备事件
    this.$bus.off("featureQueryTask", this.featureQueryTask); //全图层数据查询
    this.$bus.off("addMapPoint", this.addMapPoint); //地图添加点展示
    this.$bus.off("addMapLine", this.addMapLine); //地图添加点展示
    this.$bus.off("drawPonit", this.drawPonit); //地图添加点展示
  },
  mounted() {
    // 页面顶部显示progress bar
    this.$progress.start();
    this._mapController = new BaseMap();
    // 声明图层集合
    this._maplayers = [];
    /* 
      由于在Vue组件中，data和methods的内容都可以直接通过this访问到
      为了阅读代码时的方便，挂载到this上的自定义的引用变量，统一以_开头
    */
    this._mapController.init().then(() => {
      //构造气泡对象
      this._popup = this._mapController.createPopup();
      this.selectEQ = this._mapController.createPoint(0, 0);
      //初始化地图
      this._map = this._mapController.createMap(
        MAP_CONTAINER_ID,
        this._maplayers,
        this._popup
      );
      //构建图例
      // this._mapController.createLegend(this._map, "legendDiv")
      
      //构建比例尺
      this._mapController.createScalebar(this._map);
      // //构建鼠标移动事件
      this._mapController.createMouse(this._map, evt => {
        this.coordinate = [evt.mapPoint.x,evt.mapPoint.y]
      });
      //构造地图搜索控件
      // this._mapSearch = this._mapController.createSearch(this._map);

      //构造地图操作菜单
      this._toolBar = new MapNavigate(this._map);
      this._toolBar.init().then(() => {
        //地图添加接口获取数据点信息
        if(GISWebData.length){
          businessMethod.GISWebDataInit(this._toolBar,this._map)
        }
        
        
        //注册地图事件
        this.mapBarShow = true
        this._map.on("click", evt => {
          this._toolBar.mapMeasureClick(evt);
        });
      });
      //空间数据查询
      this._MapDataOperation = new MapDataOperation();
      this._MapDataOperation.init(); //初始化
      this._MapDataOperation.init().then(() => {
        this.$refs.MapActionBar.getCount(this._MapDataOperation);
      });
      //实例化提示框
      this.$progress.done();
    });
  },
  methods: {
    axiosWebShowOrHidden(item){
       businessMethod.axiosWebShowOrHidden(this._toolBar,item)
    },
     /**
     * 空间数据查询，按照全图层进行查询
     * @param {*} _GData            空间数据
     * @param {*} allDoneCallback   回调函数
     */
    featureQueryTask(_GData, allDoneCallback,meter){
      this._toolBar.featureQueryTask(_GData, allDoneCallback,meter)
    },
    // 获取需要展示的图层信息
    getNeedLayer(special, callBack) {
      let data = this._MapDataOperation.getNeedLayer(special);
      callBack(data);
    },
    //清除基础图层操作
    clearGraphics() {
      this._toolBar.clearAction();
    },
    //清除空间数据操作(高亮等)
    clearGDataLayer() {
      this._toolBar.clearGraphicslayer();
    },
    //地图定位
    SetMapLocation(_OBJECTID, _layerName) {
      this._toolBar.featureSearch(_OBJECTID, _layerName, resultValue => {
        if (resultValue.length > 0) {
          if (_.isNull(this.selectEQ)) {
            this.selectEQ = this._mapController.createPoint(0, 0);
          }
          //弹出对话框
          let centerPoint = null;
          switch (resultValue[0].geometry.type) {
            case "point":
              this.selectEQ = resultValue[0].geometry;
              break;
            case "polyline":
              centerPoint = resultValue[0].geometry.getExtent();
              this.selectEQ.x = (centerPoint.xmax + centerPoint.xmin)/2;
              this.selectEQ.y = (centerPoint.ymax+ centerPoint.ymin)/2;
              break;
            case "polygon":
              centerPoint = resultValue[0].geometry.getCentroid();
              break;
            default:
              break;
          }
          //气泡弹出
          this._map.infoWindow.setFeatures(resultValue);
          this._map.infoWindow.show(this.selectEQ);
          //定位
          this._toolBar.featureSetLocation(resultValue[0]); 
        }
      });
    },
    //管网设施高亮
    facilitiesView(facilitiesCollection, pictureName) {
      this._toolBar.facilitiesView(facilitiesCollection, pictureName); //地图上高亮设施
    },
    //管网管线高亮
    pipeLineView(pipeCollection) {
      this._toolBar.pipeLineView(pipeCollection); //地图上高亮管线
    },
    //空间数据统计
    getStatisticsResult(_drawType, allDoneCallback) {
      // this._toolBar.clearAction(); //清除操作
      this._toolBar.clearGraphicslayer(); //清除操作
      this._toolBar.navButton(_drawType, {
        //进行数据统计
        featureQueryCompleted: _GData => {
          allDoneCallback(_GData.geometry); //数据统计
        }
      });
    },
    //选择爆管点
    selectSquib(_layerName, allDoneCallback) {
      this._toolBar.clearAction(); //清除操作
      this._toolBar.navButton("爆管点", {
        featureQueryCompleted: _GData => {
          //根据爆管点空间数据信息进行查询
          this._toolBar.featureQuery(
            _GData.geometry,
            _layerName,
            resultValue => {
              allDoneCallback(resultValue); //爆管管线
            }
          );
        }
      });
    },
    //空间数据
    getSpaceData(_datalist, _layerName, allDoneCallback) {
      let pipeIDC = _.map(_datalist, "OBJECTID");
      //从地图上获取数据信息
      this._toolBar.featureQueryByID(pipeIDC, _layerName, resultValue => {
        allDoneCallback instanceof Function && allDoneCallback(resultValue);
      });
    },
    //连通性分析结果
    gpJoinAnalysis(allDoneCallback) {
      this._toolBar.clearAction(); //清除操作
      //连通分析点选择
      let GPPoint = [];
      this._toolBar.setJoinJoinAnalysis({
        //进行数据统计
        featureQueryCompleted: _GData => {
          GPPoint.push(_GData);
          if (GPPoint.length >= 2) {
            this._toolBar.drawDeactivate(); //取消绘制功能
            this._toolBar.mapOperationInit(true ,true);
            allDoneCallback instanceof Function && allDoneCallback(GPPoint);
          }
        }
      }); 
    },
    //缓冲区查询分析
    bufferAnalysis(_layerName, _GData, metersLength, allDoneCallback,clearAction = true) {
      if(clearAction){
        this._toolBar.clearAction(); //清楚操作
      }
      this._toolBar.bufferAnalysis(
        _GData,
        metersLength,
        _layerName,
        resultValue => {
          allDoneCallback(resultValue);
        }
      );
    },
    //根据图层进行检索数据信息
    dataSearchByLayerName(_GData, _layerName, allDoneCallback) {
      this._toolBar.featureQueryFeature(_GData, _layerName, resultValue => {
        allDoneCallback instanceof Function && allDoneCallback(resultValue);
      });
    },
    //根据线获取空间数据
    lineAnalysis(_layerName, _GLineData, allDoneCallback) {
      this._toolBar.featureQueryFeature(_GLineData, _layerName, resultValue => {
        allDoneCallback instanceof Function &&
          allDoneCallback(_.map(resultValue, "attributes"));
      });
    },
    //从地图上获取分析 isSnap 是否启动吸附功能，allDoneCallback：回调函数
    getMapPoint(isSnap, allDoneCallback) {
      this._toolBar.clearAction(); //清除操作
      this._toolBar.getMapPoint(isSnap, {
        featureQueryCompleted: _GData => {
          //回调函数调用
          allDoneCallback(_GData.geometry);
        }
      });
    },
    //从地图上获取线
    getMapLine(allDoneCallback) {
      this._toolBar.clearAction();
      this._toolBar.getMapLine({
        featureQueryCompleted: _GData => {
          //回调函数调用
          allDoneCallback(_GData.geometry);
        }
      });
    },

    //图层显示与隐藏
    onLayerViewOrHidden(layerName, isDisplay) {
      //图层显示与不控制
      this._toolBar.layerDiaplayOrHidden(layerName, isDisplay);
    },
    //所有管线的图层显示隐藏
    onLayerViewAllVisibale(isDisplay) {
      let layerData = [];
      _.forEach(MapConfigure.FeatureLayerGroup, item => {
        let itemData = _.map(item.featureLayers, "layerName");
        layerData = layerData.concat(itemData);
      });
      _.forEach(layerData, layer => {
        this._toolBar.layerDiaplayOrHidden(layer, isDisplay);
      });
    },
    //绘制多边形
    //参数示例：[[[-122.63, 45.52], [-122.57, 45.53], [-122.52, 45.50], [-122.49, 45.48],[-122.64, 45.49], [-122.63, 45.52], [-122.63, 45.52]]]
    drawPolygon(coordinates) {
      this._toolBar.drawRangle(coordinates);
    },
    drawPonit(coordinates){
      this._toolBar.drawPonit(coordinates);
    },
    //调整图层透明度方法
    layerSetOpacity(layer, opacity) {
      this._toolBar.layerSetOpacity(layer, opacity);
    },
    pointSelect(callBack){
      this._toolBar.pointSelect(callBack)
    },
    //图层数据清楚
    onActionClear(isClear) {
      if (isClear) {
        this._toolBar.clearAction(); //清除操作
      }
    },
    //右上角坐标查询方法
    coordinateSearch(x, y) {
      this._toolBar.setMapLocation(x, y);
    },
    //右上角搜索功能
    onMapSearch(searchContent) {
      this._toolBar.setPOIView(searchContent);
      // this._MapDataOperation.featureQuery(
      //   null,
      //   " NAME like '%" + searchContent.NAME + "%'",
      //   MapConfigure.url.urlPOI,
      //   resultValue => {
      //     this._toolBar.setPOIView(resultValue[0]);
      //   }
      // );
    },
    addMapPoint(geometry){
      this._toolBar.addMapPoint(geometry)
    },
    addMapLine(geometry){
      this._toolBar.addMapLine(geometry)
    },
  }
};
</script>
