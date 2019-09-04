<template>
  <div class="Pipe_Query_container">
    <div id="mapx" class="mapx" style="width:100%;height:100%;position: relative;">
      <resize-observer @notify="handleResize" />
    </div>
    <div id="popup">
      <MapDialog
        v-if="dialogShow == 'MapDialog'"
        :dialogType="dialogType"
        :dialogData="dialogData"
        :planAreaId="planAreaId"
        :onSubmit="onSubmit"
      ></MapDialog>
      <mapLayer v-else :title="layerTtitle" :htmlString="htmlString"></mapLayer>
    </div>
  </div>
</template>
<script>
// import axios from "axios";
import InsOverView from "@features/InspectionGIS/InsOverView";
import BaseMap from "@services/OpenLayers/BaseMap";
import MapNavigate from "@services/OpenLayers/MapNavigate";
import MapConfigure from "@common/consts/OpenLayersConfig/MapConfigure";
import mapLayer from "@common/components/mapLayer";
import MapDialog from "@features/InspectionGIS/MapDialog";
import { setTimeout } from "timers";

export default {
  components: {
    InsOverView,
    MapDialog,
    mapLayer
  },
  created() {
    this.$bus.on("setCenter", this.setCenter); //设置中心点
    this.$bus.on("addInteractions", this.addInteractions); //绘制
    this.$bus.on("setOverlay", this.setOverlay); //开启地图弹窗
    this.$bus.on("resizeMapNavigate", this.resizeMapNavigate); //地图大小重置
    this.$bus.on("PlanAreaId", this.PlanAreaId); //获取区域Id
    this.$bus.on("setVectorLayerVisible", this.setVectorLayerVisible);
    this.$bus.on("plotAnimateControl", this.plotAnimateControl); //巡检监控动画（控制点动画）
    this.$bus.on("setTempLayerGroupVisible", this.setTempLayerGroupVisible);
    this.$bus.on(
      "setBusinessLayerGroupVisible",
      this.setBusinessLayerGroupVisible
    );
    this.$bus.on("setPolygonOnMap", this.setPolygonOnMap);
    this.$bus.on("setLineStringOnMap", this.setLineStringOnMap);
    this.$bus.on("setPointOnMap", this.setPointOnMap);
    this.$bus.on("removeInteractions", this.removeInteractions);
    this.$bus.on("endEditFeature", this.endEditFeature);
    this.$bus.on("setEditFeatureState", this.setEditFeatureState); //开启或结束编辑 value > ture/false
    this.$bus.on("setSpatialSearchOnMap", this.setSpatialSearchOnMap);
    this.$bus.on("OffPointermoveControl", this.OffPointermoveControl);//关闭开启鼠标hover点显示信息
    this.$bus.on("onPointermoveControl", this.onPointermoveControl);//开启鼠标hover点显示信息

    this.$bus.on(
      "setSpatialSearchLayerGroupDisplay",
      this.setSpatialSearchLayerGroupDisplay
    ); //设置区域查询设备 (true,true   显示或隐藏,清除)
    this.$bus.on("CloseModifyInteraction", this.CloseModifyInteraction); //关闭添加状态
  },
  beforeDestroy() {
    this.$bus.off("setCenter", this.setCenter); //设置中心点
    this.$bus.off("addInteractions", this.addInteractions); //绘制
    this.$bus.off("setOverlay", this.setOverlay); //开启地图弹窗
    this.$bus.off("resizeMapNavigate", this.resizeMapNavigate);
    this.$bus.off("PlanAreaId", this.PlanAreaId); //获取区域Id
    this.$bus.off("setVectorLayerVisible", this.setVectorLayerVisible);
    this.$bus.off("plotAnimateControl", this.plotAnimateControl); //巡检监控动画（控制点动画）
    this.$bus.off("setTempLayerGroupVisible", this.setTempLayerGroupVisible);
    this.$bus.off(
      "setBusinessLayerGroupVisible",
      this.setBusinessLayerGroupVisible
    );
    this.$bus.off("setPolygonOnMap", this.setPolygonOnMap);
    this.$bus.off("setLineStringOnMap", this.setLineStringOnMap);
    this.$bus.off("setPointOnMap", this.setPointOnMap);
    this.$bus.off("removeInteractions", this.removeInteractions);
    this.$bus.off("endEditFeature", this.removeInteendEditFeatureractions);
    this.$bus.off("setEditFeatureState", this.setEditFeatureState); //开启或结束编辑 value > ture/false
    this.$bus.off("setSpatialSearchOnMap", this.setSpatialSearchOnMap);
    this.$bus.off("onPointermoveControl", this.onPointermoveControl);//开启鼠标hover点显示信息
    this.$bus.on("OffPointermoveControl", this.OffPointermoveControl);//关闭开启鼠标hover点显示信息

    this.$bus.off(
      "setSpatialSearchLayerGroupDisplay",
      this.setSpatialSearchLayerGroupDisplay
    );
    this.$bus.off("CloseModifyInteraction", this.CloseModifyInteraction); //关闭添加状态
  },
  data() {
    return {
      dialogShow: "",
      layerTtitle: "", //hover点展示的layer标题
      htmlString: "", //hover点展示的layerhtml内容
      UrlOlMap: MapConfigure.url.urlSatell,
      UrlPipeLine: MapConfigure.url.urlPipeLine,
      MapData: undefined,
      MapMethods: undefined,
      //esrijsonFormat: new EsriJSON()
      isMapDialogShow: false,
      dialogType: 0,
      dialogData: [],
      planAreaId: 0,
      onSubmit: undefined,
      //需要关闭矢量图层的routeName
      cleanMapPipeLayer: [
        "PlanManage",
        "PatrolTask",
        "RegionalManagement",
        "RouteManagement",
        "InsMinitor"
      ],
      cleanMapPipeLayerBoolea: false, //是否需要关闭矢量图层
      loadState: false //地图是否加载完毕
    };
  },
  computed: {
    routeName() {
      return this.$route.name;
    }
  },
  watch: {
    routeName() {
      this.cleanMapPipeLayerControl();
    }
  },
  mounted() {
    //声明地图对象
    this._mapController = new BaseMap();

    //构建地图对象
    this._mapController.createMap("mapx").then(ResultObject => {
      this._map = ResultObject;
      this.MapMethods = new MapNavigate(ResultObject);
      this.resizeMapNavigate();
      this.MapMethods.pointermoveControl(
        document.getElementById("popup"),
        (res, title) => {
          console.log(this.dialogType);
          this.dialogShow = "mapLayer";
          // document.getElementById('popup').inner
          this.htmlString = res;
          this.layerTtitle = title;
        }
      );
      this.loadState = true;
      this.cleanMapPipeLayerControl();
      // this.MapMethods.setPolygonOnMap();
      this.MapMethods.setEditFeatureState(false);
    });
  },
  methods: {
    cleanMapPipeLayerControl() {
      let clean = _.indexOf(this.cleanMapPipeLayer, this.$route.name) >= 0;
      if (this.cleanMapPipeLayerBoolea == clean || !this.loadState) {
        return;
      }
      this.cleanMapPipeLayerBoolea = clean;
      if (this.cleanMapPipeLayerBoolea) {
        //this.setVectorLayerVisible(false); //关闭矢量图层
        this.setBusinessLayerGroupVisible(true); //开启业务图层
        this.setTempLayerGroupVisible(true);
      } else {
        //this.setVectorLayerVisible(true); //关闭矢量图层
        this.setBusinessLayerGroupVisible(false); //开启业务图层
        this.setTempLayerGroupVisible(false);
        //this.$bus.emit("setSpatialSearchLayerGroupDisplay", true, true);
      }
    },
    handleResize() {
      this.resizeMapNavigate()
    },
    //关闭鼠标hover点显示信息
    OffPointermoveControl() {
      console.log("off");
      this.MapMethods.OffPointermoveControl();
    },
    //开启鼠标hover点显示信息
    onPointermoveControl() {
      console.log("on");
      this.MapMethods.onPointermoveControl();
    },
    //hover点展示信息
    // pointermoveControl(layerTtitle,callback){
    //   this.layerTtitle = layerTtitle
    //   this.dialogType = ''
    //   let overlayContainerDOM = document.getElementById("popup")
    //   this.MapMethods.pointermoveControl(overlayContainerDOM,res => {
    //     this.htmlString = callback(res)
    //   })
    // },
    PlanAreaId(id) {
      this.planAreaId = id;
    },
    /**添加可绘制/修改图层
     *@param {绘制的样式 Point/LineString/Polygon/Circle} typeSelect
     *@param {是否可以修改的绘图} isModify

     *@function 回调函数,返回坐标信息
     */
    addInteractions(typeSelect, isModify, allDoneCallback) {
      this.MapMethods.addInteractions(
        typeSelect,
        isModify,
        (ResultValue, ResultValueArea) => {
          this.setTempLayerGroupVisible(true); //开启遮罩层
          allDoneCallback instanceof Function &&
            allDoneCallback(ResultValue, ResultValueArea);
          this.dialogData = ResultValue;
        }
      );
    },
    /**设置空间查询显示/隐藏/清空
     *
     * @param {true 显示|false 不显示} isVisible
     * @param {true 全部清空} clear
     */
    setSpatialSearchLayerGroupDisplay(isVisible, clear) {
      clear = clear || false;
      this.MapMethods.setSpatialSearchLayerGroupDisplay(isVisible, clear);
    },
    /**空间查询
     *
     * @param {ture 显示|false 不显示} isVisible
     * @param {layer索引} layerIndex
     * @param {layer名称} layerName
     * @param {查询的区域feature} feature
     */
    setSpatialSearchOnMap(isVisible, layerIndex, layerName, feature, callback) {
      this.MapMethods.setSpatialSearchOnMap(
        isVisible,
        layerIndex,
        layerName,
        feature,
        (layerIndex, PointValue) => {
          callback instanceof Function && callback(layerIndex, PointValue);
        }
      );
    },
    /**结束可绘制/修改图层
     *
     */
    removeInteractions() {
      this.MapMethods.removeInteractions();
    },
    /**添加弹窗
     * @param {坐标[x,y]} coordinate
     * @param {弹出框的上级DOM} overlayContainerDOM
     *@param {地图弹窗显示类型 弹窗title } dialogType
     */
    setOverlay(coordinate, overlayContainerDOM, dialogType, onSubmit) {
      this.dialogShow = "MapDialog";
      this.dialogType = dialogType;
      this.onSubmit = onSubmit;
      this.MapMethods.addOverlayNavigate(coordinate, overlayContainerDOM);
    },

    /**关闭弹窗 */
    removeOverlay() {
      // this.MapMethods.removeOverlay();
      this.isMapDialogShow = false;
    },
    /**设置中心点
     * @param {坐标[x,y]} coordinate
     * @param {放大层级} zoom
     */
    setCenter(coordinate, zoom) {
      zoom = zoom || 4;
      this.MapMethods.setCenter(coordinate, zoom);
    },
    /**重置map的宽高
     * @param {宽} width
     * @param {高} height
     */
    resizeMapNavigate(width, height) {
      width =
        width ||
        parseInt(document.querySelector(".mapWraperWidthResize").clientWidth);
      height =
        height || parseInt(document.querySelector(".main-body").clientHeight);
      this.MapMethods.resizeMapNavigate(width, height);
    },
    /**设置矢量图层是否显示
     * @param {ture|flse} isVisible
     */

    setVectorLayerVisible(isVisible) {
      this.MapMethods.setVectorLayerVisibleNavigate(isVisible);
    },
    /**设置临时绘制图层是否显示
     * @param {ture|flse} isVisible
     */
    setTempLayerGroupVisible(isVisible) {
      this.MapMethods.setTempLayerGroupVisible(isVisible);
    },
    /**设置业务图层是否显示
     * @param {ture|flse} isVisible
     */
    setBusinessLayerGroupVisible(isVisible) {
      this.MapMethods.setBusinessLayerGroupVisible(isVisible);
    },
    /**是否开始/结束编辑
     *
     */
    setEditFeatureState(isTure) {
      this.MapMethods.setEditFeatureState(isTure);
    },
    /**结束编辑
     *
     */
    endEditFeature() {
      this.MapMethods.setEditFeatureState(false);
    },
    /**结束添加状态
     *
     */
    CloseModifyInteraction() {
      this.MapMethods.CloseModifyInteraction();
    },
    /**巡检监视动画
     * @param {点数组} point
     * @param {间隔} interValTime
     * @param {动作} action |start|stop|pause|clear|
     * @param {回调函数} callBack
     * {}
     */
    plotAnimateControl(
      point,
      interValTime,
      action,
      callBack,
    ) {
      this.MapMethods.plotAnimateControl(
        point,
        interValTime,
        action,
        callBack
      );
    },
    /**在地图上绘制Polygon(geomArray和nameArray的数目和顺序都要一致)
     *
     * @param {需要绘制的Polygon的数组} geomArray
     * @param {需要添加的name} nameArray
     * @param {是否修改} isModify
     * @param {修改完后的回调} onModifyEndFunc
     */
    setPolygonOnMap(geomArray, nameArray, isModify, onModifyEndFunc) {
      this.MapMethods.setPolygonOnMap(
        geomArray,
        nameArray,
        isModify,
        onModifyEndFunc
      );
    },
    /**在地图上绘制LineString(geomArray和nameArray的数目和顺序都要一致,if bufferArray==undifiand|bufferArray.length!=geomArray.length 则不执行)
     *
     * @param {需要绘制的LineString的数组} geomArray
     * @param {需要添加的name} nameArray
     * @param {是否修改} isModify
     * @param {修改完后的回调} onModifyEndFunc
     * @param {buffer图层} bufferArray
     */
    setLineStringOnMap(
      geomArray,
      nameArray,
      isModify,
      onModifyEndFunc,
      bufferArray
    ) {
      this.MapMethods.setBusinessLayerGroupVisible(true);
      this.MapMethods.setLineStringOnMap(
        geomArray,
        nameArray,
        isModify,
        onModifyEndFunc,
        bufferArray
      );
    },
    /**在地图上绘制Point
     *
     * @param {需要绘制的Polygon的数组} geomArray
     * @param {是否修改} isModify
     * @param {修改完后的回调} onModifyEndFunc
     * @param {点的名称} featureName
     * @param {需要添加给点的属性 Object.<string, *>} featureProperties
     */
    setPointOnMap(
      geomArray,
      isModify,
      onModifyEndFunc,
      featureName,
      featureProperties
    ) {
      this.MapMethods.setBusinessLayerGroupVisible(true);
      this.MapMethods.setPointOnMap(
        geomArray,
        isModify,
        onModifyEndFunc,
        featureName,
        featureProperties
      );
    }
  }
};
</script>