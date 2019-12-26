<template>
  <div>
    <!-- <div class="homeDiv">
      <router-link class="iconfont icon-shouye" to="/" title="返回首页"></router-link>
    </div>-->
    <!-- 顶部查询开始 -->
    <el-row class="Map_Action_Bar_Search row" type="flex" justify="space-between">
      <div class="Text-Wraper hidden-sm-and-down">
        <div class="textShowWraper">
          <span v-for="item in topTotleMessage" :key="item.name">
            <span>{{item.name}}</span>
            <span class="orange">{{item.number}}</span>
            <span>{{item.unit}}</span>
          </span>
        </div>
      </div>

      <el-row type="flex" class="row MapActionBar-icon-wrapper" justify="end">
        <!--右侧菜单控制-->
        <div class="Map_Action_Bar_container" component="MapActionBar">
          <div
            class="action_item"
            v-for="action in actionList"
            :key="action.id"
            :class="{active:actionItemActiveID === action.id}"
            :name="action.name"
            :value="action.value"
            @click="onItemClick(action)"
            @dblclick="onItemCancleClick(action)"
            :title="action.name"
          >
            <el-popover
              v-if="action.id == 'FreehandPolyline'"
              placement="bottom"
              width="72"
              popper-class="Map_Action_Bar_popover"
              trigger="click"
            >
              <div>
                <el-button
                  v-for="item in lengthUtilList"
                  :key="item.value"
                  @click="onItemClick(action,item.value)"
                  :class="{ active: lengthUtilListValue === item.value}"
                >{{item.name}}</el-button>
              </div>
              <span slot="reference" class="iconfont" :class="action.icon"></span>
            </el-popover>

            <el-popover
              v-else-if="action.id == 'Extent'"
              placement="bottom"
              width="72"
              popper-class="Map_Action_Bar_popover"
              trigger="click"
            >
              <div>
                <el-button
                  v-for="item in areaUtilList"
                  :key="item.value"
                  @click="onItemClick(action,item.value)"
                  :class=" { active: areaUtilListValue === item.value } "
                >{{item.name}}</el-button>
              </div>
              <span slot="reference" class="iconfont" :class="action.icon"></span>
            </el-popover>

            <span class="iconfont" :class="action.icon" v-else></span>
          </div>
        </div>
        <POISearch
          :searchList.sync="searchList"
          @actionMapSearch="actionMapSearch"
          :toolbar="toolbar"
          :actionItemActiveID.sync="actionItemActiveID"
        />
      </el-row>
    </el-row>
    <!-- 图层控制弹窗开始 -->
    <MapLayerList
      v-show="actionItemActiveID === 'maplayer' "
      ref="MapLayerList"
      :toolbar="toolbar"
      @closeLayer="closeLayer"
      @axiosWebShowOrHidden="axiosWebShowOrHidden"
    />
    <!-- 图例控制 -->
    <LegendList
      v-show="actionItemActiveID === 'Lengend' "
      ref="LegendList"
      @closeLayer="closeLayer"
    />

    <!-- 打印控制 -->
    <PrintForm
      v-show="actionItemActiveID === 'Print' "
      :toolbar="toolbar"
      @closeLayer="closeLayer"
    />

    <!-- 书签管理 -->
    <BookMark v-show="actionItemActiveID === 'bookMark' " ref="bookMark" @closeLayer="closeLayer" />

    <!-- 框选 -->
    <boxSelectTable :searchType.sync="searchType" ref="boxSelectTable" />
  </div>
</template>

<script>
import _ from "lodash";
import BoxSelectTable from "../SelectTable";
import BookMark from "../BookMark";
import PrintForm from "../PrintForm";
import LegendList from "../LegendList";
import POISearch from "../POISearch";
import MapLayerList from "../MapLayerList";

import { DEFAULT_ACTION_LIST } from "./consts";
import {
  MapConfigure,
  LAYER_NAME_MAP,
  LayerType,
  FeatureLayerOperation,
  Legend_Json
} from "@common/consts/GisConst/MapConfigure";
import SpatialSearch from "@api/GIS/SpatialSearch";

export default {
  components: {
    BoxSelectTable,
    BookMark,
    PrintForm,
    LegendList,
    POISearch,
    MapLayerList
  },
  props: {
    customizeActionFunc: {
      type: Function
    },
    toolbar: {
      type: Object
    }
  },
  created() {
    this.actionList = DEFAULT_ACTION_LIST;
    this.$bus.on("setCheckedTreeNodes", this.setCheckedTreeNodes);
  },
  beforeDestroy() {
    this.$bus.off("setCheckedTreeNodes", this.setCheckedTreeNodes);
  },
  data() {
    return {
      searchList: [], //控制中心的数据列表
      countedData: false, //是否计算过数据
      boxSelectState: false, //框选状态
      actionItemActiveID: "", //地图操作图标选中
      layerData: FeatureLayerOperation.getLayer(),
      topTotleMessage: [
        {
          name: "管网总数",
          eName: "pipeCountNumber",
          number: 100,
          unit: "根",
          layerType: LayerType.PipeTypeNO,
          math: "count"
        },
        {
          name: "管网总长",
          eName: "pipeLengthNumber",
          number: 100,
          unit: "千米",
          layerType: LayerType.PipeTypeNO,
          math: "length"
        },
        {
          name: "消防栓总数",
          eName: "FireCountNumber",
          number: 100,
          unit: "个",
          layerType: LayerType.FirehydrantTypeNO,
          math: "count"
        },
        {
          name: "水表井总数",
          eName: "ValveCountNumber",
          number: 100,
          unit: "个",
          layerType: [LayerType.WatermeterwellTypeNO],
          math: "count"
        }
      ], //顶部管网总数等统计结果集
      actionList: [],
      //量算
      lengthUtilList: [
        {
          name: "米",
          value: "m"
        },
        {
          name: "千米",
          value: "km"
        }
      ],
      lengthUtilListValue: "m",
      areaUtilListValue: "m",
      areaUtilList: [
        {
          name: "平方米",
          value: "m"
        },
        {
          name: "平方公里",
          value: "km"
        }
        //{
        //  name:'平方英里',
        //  value: 'miles'
        //},
      ]
    };
  },
  filters: {
    // 截取当前数据到小数点后两位
    numFilter(value) {
      let realVal = parseFloat(value).toFixed(3);
      return parseFloat(realVal);
    }
  },
  watch: {
    $route(to, from) {
      if (!this.countedData && to.name === "GIS") {
        this.getCount();
      }
    }
  },
  methods: {
    //通过接口获取的数据是否选择是否展示
    axiosWebShowOrHidden(item) {
      this.$emit("axiosWebShowOrHidden", item);
    },
    //更改官网等设备显示树
    //false 清空  true 显示全部 addNode添加的点
    setCheckedTreeNodes(type, addNode, isDisplay) {
      this.$refs.MapLayerList.setCheckedTreeNodes(type, addNode, isDisplay);
    },
    //map toolbar  点击事件
    onItemCancleClick(action) {
      if (action.value != "框选") {
        if (this.boxSelectState) {
          this.boxSelectState = false;
          this.$refs.boxSelectTable.boxHide();
        }
      } else {
        this.$bus.emit("clearGDataLayer"); //清除操作
      }
      if (action.value != "点选") {
        this.$bus.emit("clearGraphics"); //清除绘制过的图层数据信息
      }

      if (action.id === "Swipe") {
        this.toolbar.SwipeMapInit();
      } else {
        this.toolbar.clearSwipe();
      }

      //放大镜注册和清除
      if (action.id === "Magnify") {
        this.toolbar.MagnifyMapInit();
      } else {
        this.toolbar.clearMagnify();
      }
      this.closeLayer();
      return;
    },
    onItemClick(action, operVal) {
      // if (!operVal && action.id === this.actionItemActiveID) {
      //   if (action.value != "框选") {
      //     if (this.boxSelectState) {
      //       this.boxSelectState = false;
      //       this.$refs.boxSelectTable.boxHide();
      //     }
      //   } else {
      //     this.$bus.emit("clearGDataLayer"); //清除操作
      //   }
      //   if (action.value != "点选") {
      //     this.$bus.emit("clearGraphics"); //清除绘制过的图层数据信息
      //   }
      //   this.actionItemActiveID = "";
      //   if (action.id === "Swipe") {
      //     this.toolbar.SwipeMapInit();
      //   } else {
      //     this.toolbar.clearSwipe();
      //   }

      //   //放大镜注册和清除
      //   if (action.id === "Magnify") {
      //     this.toolbar.MagnifyMapInit();
      //   } else {
      //     this.toolbar.clearMagnify();
      //   }
      //   return;
      // }
      operVal = operVal || "m";
      if (action.value != "框选") {
        if (this.boxSelectState) {
          this.boxSelectState = false;
          this.$refs.boxSelectTable.boxHide();
        }
      } else {
        this.$bus.emit("clearGDataLayer"); //清除操作
      }
      if (action.value != "点选") {
        this.$bus.emit("clearGraphics"); //清除绘制过的图层数据信息
      }

      //卷帘注册和清除
      if (action.id === "Swipe") {
        if (this.actionItemActiveID !== "Swipe") {
          this.toolbar.SwipeMapInit();
        }
      } else {
        this.toolbar.clearSwipe();
      }

      //放大镜注册和清除
      if (action.id === "Magnify") {
        if (this.actionItemActiveID !== "Magnify") {
          this.toolbar.MagnifyMapInit();
        }
      } else {
        this.toolbar.clearMagnify();
      }

      this.actionItemActiveID = action.id;
      switch (action.id) {
        case "bookMark":
          this.$refs.bookMark.initBookMark();
          break;
        case "Lengend":
          this.$refs.LegendList.getTuliList();
          break;
        case "maplayer":
          // this.$refs.MapLayerList.loadData();
          break;
        case "FreehandPolyline":
          this.actionItemActiveID = "";
          this.lengthUtilListValue = operVal;
          this.toolbar.distanceMeasure(operVal);
          break;
        case "Extent":
          this.areaUtilListValue = operVal;
          let areaName = _.filter(this.areaUtilList, item => {
            return item.value === this.areaUtilListValue;
          })[0].name;
          this.toolbar.areaMeasure({ area: operVal, areaName: areaName });
          break;
        case "Polyline":
          this.toolbar.Polyline();
          break;
        case "PointSelect":
          this.toolbar.pointSelect();
          break;
        case "RangleSelect":
          this.toolbar.rangleSelect({
            featureQueryCompleted: result => {
              this.boxSelectState = true;
              this.actionItemActiveID = "";
              this.$refs.boxSelectTable.boxSelect(result);
            }
          });
          break;
        case "Point":
          this.toolbar.mapPointMove();
          break;
        case "Circle":
          this.actionItemActiveID = "";
          this.toolbar.mapClean();
          break;
        case "zoomout":
          this.actionItemActiveID = "";
          this.toolbar.zoomout();
          break;
        case "zoomin":
          this.actionItemActiveID = "";
          this.toolbar.zoomin();
          break;
        case "Magnify":
        case "Swipe":
        case "fastMap":
        case "Print":
          break;
      }
    },
    //关闭图例、图层、打印弹窗
    closeLayer(closeType) {
      if (this.actionItemActiveID === "bookMark") {
        this.$bus.emit("mapEditCancle");
        this.$bus.emit("onLayerViewAllVisibale", true);
        this.$bus.emit("onLayerViewOrHidden", "bookMarkLayer", false, true);
      }
      this.actionItemActiveID = "";
    },
    //统计管线长度数量等
    getCount(fnc) {
      if (fnc) this._MapDataOperation = fnc;
      if (this.$store.state.login.iframe && this.$route.name !== "GIS") return;
      this.countedData = true;
      let _GroupStaticesField = {
       count: {
          statisticType: "count", //定义统计类型 'count'|'sum'|'min'|'max'|'avg'|'stddev'
          onStatisticField: "OBJECTID",
          outStatisticFieldName: "equipment_number"
        },
        length: {
          statisticType: "sum", //定义统计类型 'count'|'sum'|'min'|'max'|'avg'|'stddev'
          onStatisticField: "length",
          outStatisticFieldName: "length"
        }
      };
      _.forEach(this.topTotleMessage, item => {
        if (this.$store.state.gisCount[item.eName]) {
          item.number = this.$store.state.gisCount[item.eName];
          return;
        }
        this.countMethods(
          item.layerType,
          [_GroupStaticesField[item.math]],
          res => {
            item.number = _.floor(
              _.sumBy(res, _GroupStaticesField[item.math].outStatisticFieldName)
            );
            if (item.name === "管网总长") {
              item.number = item.number / 1000;
            }
            this.$store.dispatch("gisCount/setState", item);
          }
        );
      });
    },
    countMethods(layerType, _GroupStaticesField, callBack) {
      let StatURLCollection = [];
      if (_.isArray(layerType)) {
        
        _.forEach(layerType, item => {
          StatURLCollection.push(
            ...FeatureLayerOperation.getLayerURLByType(item)
          );
        });
      } else {
        StatURLCollection = FeatureLayerOperation.getLayerURLByType(layerType);
      }

      //统计
      this._MapDataOperation.featureQueryGroup(
        null,
        "1=1",
        _GroupStaticesField,
        null,
        StatURLCollection,
        resultValue => {
          callBack instanceof Function && callBack(resultValue);
          return;
        }
      );
    },
    actionMapSearch(searchContent, searchCallBack, template) {
      this.$emit("action-mapSearch", searchContent, searchCallBack, template);
    }
  }
};
</script>
<style lang="stylus" scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
