<template>
  <div
    class="senior-search-style table_style count-style"
    :class="{flexible:flexible}"
    v-loading="loading"
  >
    <TableFormTitle :titleName="'高级查询'" :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="83px" label-position="right" size="mini" v-loading="loadingSelect">
      <el-row>
        <el-col :span="10" class="table-left" :xs="14" :sm="14" :lg="8">
          <layerSelect
            :loading.sync="loading"
            :layerGroupLen.sync="layerGroupLen"
            :layerData.sync="seniorData"
            :groupLayerDataValue.sync="groupLayerDataValue"
            :layerDataValue.sync="layerDataValue"
            @onLayerSelectChange="onLayerSelectChange"
            @onGroupLayerSelectChange="onLayerSelectChange"
          ></layerSelect>
        </el-col>
        <el-col span="12">
          <el-form-item label="形状：" class="choose_Icon_Wraper" label-width="49px">
            <!-- <svg
              class="icon"
              aria-hidden="true"
              @click="mapSelectStatices('长方形')"
              v-hide="{active:shapeActive === '长方形'}"
            >
              <use xlink:href="#icon-caozuoxingzhuang-1" />
            </svg>
            <svg
              class="icon"
              aria-hidden="true"
              @click="mapSelectStatices('多边形')"
              v-hide="{active:shapeActive === '多边形'}"
            >
              <use xlink:href="#icon-caozuoxingzhuang-" />
            </svg>
            <svg
              class="icon"
              aria-hidden="true"
              @click="mapSelectStatices('当前范围')"
              v-hide="{active:shapeActive === '当前范围'}"
            >
              <use xlink:href="#icon-caozuoxingzhuang_dangqianfanwei-" />
            </svg>-->
            <img
              class="imgIcon"
              v-for="item in shapeList"
              :key="item"
              @click="mapSelectStatices(item)"
              :src=" require('@assets/toolIcon/action/'+ item  + (shapeActive === item ? 'active.png' : '.png'))"
              alt
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-button
          class="my-search"
          size="mini"
          @click="seniorSearch"
          v-if="$options.filters.btnTree('search' ,$route.name)"
        >查询</el-button>
        <el-button class="my-search" size="mini" @click="seniorStateChange()">自定义条件</el-button>
        <el-button
          class="my-reset"
          size="mini"
          @click="seniorReset"
          v-if="$options.filters.btnTree('reset' ,$route.name)"
        >重置</el-button>
        <el-button class="my-clean" size="mini" @click="clearGdata">清空选区</el-button>
        <el-button
          class="my-export"
          size="mini"
          @click="exportExcel"
          v-if="$options.filters.btnTree('export' ,$route.name)"
        >导出</el-button>
      </el-row>
      <SeniorFator ref="SeniorFator" :attRList="attRList" :layerDataValue="layerDataValue" />
    </el-form>
    <GisTable
      :loading="loading"
      :tableHeight="`calc(100vh - 361px)`"
      @TableRowClick="onTableRowClick"
      :layerListName="layerListName"
      :columnListData="columnListData"
    ></GisTable>
  </div>
</template>
<script>
import axios from "axios";
import _ from "lodash";
import {
  MapConfigure,
  LAYER_NAME_MAP,
  FeatureLayerOperation,
  LayerType
} from "@common/consts/GisConst/MapConfigure";
import MapDataOperation from "@services/ArcMap/MapDataOperation";
import * as GisTableColumn from "@common/consts/GisConst/GisTableColumn";
import { ExportExcel, FixFloat } from "@util";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { constants } from "fs";
import layerSelect from "@features/GIS/components/layerSelect";
import GisTable from "@features/GIS/components/GisTable";
import TableFormTitle from "@common/components/TableFormTitle";
import SeniorFator from "@features/GIS/components//SeniorFator";
export default {
  components: {
    layerSelect,
    GisTable,
    TableFormTitle,
    SeniorFator
  },
  data() {
    return {
      seniorState: false,
      radio: "add",
      shapeList: ["长方形", "多边形", "当前范围"],
      loadingSelect: false,
      shapeActive: "",
      flexible: false, //是否收缩左侧表格
      activeItem: {}, //当前选中的图层信息
      layerListName: [], //表格表头
      layerGroupLen: 1, //layerData组别 是否为多组数据，若为多组渲染多组select
      groupLayerDataValue: [], //多选select的值
      loading: false, //表格加载
      columnListData: [], //空间数据查询出来的所有数据列
      seniorData: [], //非缓冲区图层数据  图层下拉框数据
      sqlValue: [], //高级查询拼接后的sql语句
      sqlCValue: [], //高级查询拼接后的中文sql语句
      attRList: [], //sql的查询属性列表
      //关系比较数组列表
      mathData: [],
      attrValueList: [], //属性下拉选择框
      Gdata: null, //空间查询条件
      //高级查询所需的左侧单个条件输入
      heightLightState: false //是否高亮
    };
  },
  created() {
    //this.loading = true;
  },
  beforeDestroy() {
    if (this.$refs.SeniorFator.sqlValue.length || this.Gdata) {
      this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
    }

    if (this.Gdata) {
      this.$bus.emit("clearGraphics"); //取消绘制方法
      this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
    }
  },
  mounted() {
    this.loadLayerData();
    //地图数据操作
    this._MapDataOperation = new MapDataOperation();
    this._MapDataOperation.init().then(() => {
      //this.onLayerSelectChange();
    });
  },
  methods: {
    loadLayerData() {
      let needLayer = FeatureLayerOperation.getNeedLayer();
      this.seniorData = needLayer[1];
      this.layerGroupLen = needLayer[0].length;
      this.layerDataValue = needLayer[2];
      this.activeItem = FeatureLayerOperation.getLayerFeatureByName(
        this.layerDataValue
      );
      this.groupLayerDataValue = needLayer[3];
      this.layerListName = this.activeItem.listViewColumn; //表头
      this.attRList = GisTableColumn[this.activeItem.listViewColumn];
      this.loading = false;
    },
    //地图框选统计
    mapSelectStatices(_drawType) {
      if (this.shapeActive === _drawType) {
        this.shapeActive = "";
        this.$bus.emit("clearGraphics", true);
        return;
      }
      this.Gdata = null;
      this.shapeActive = _drawType;
      //条件组合
      this.$bus.emit("getStatisticsResult", _drawType, resultValue => {
        //this.loading = true;
        this.Gdata = resultValue;
        this.shapeActive = "";
        //this.SearchStatices();
        return;
      });
    },
    //清空选区
    clearGdata() {
      this.$bus.emit("clearGDataLayer"); //取消绘制方法
      this.Gdata = null;
    },
    //高级查询重置
    seniorReset() {
      if (this.Gdata) {
        this.clearGdata();
      }
      if (this.heightLightState && !this.Gdata) {
        this.heightLightState = false;
        this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
      }
      if (this.layerDataValue == "all") {
        this.layerListName = "all";
      } else {
        this.layerListName = FeatureLayerOperation.getLayerFeatureByName(
          this.layerDataValue
        ).listViewColumn;
      }
      this.columnListData = [];
      this.$refs.SeniorFator.cleanSeniorContion();
    },
    //图层下拉选择
    onLayerSelectChange(objvalue) {
      this.activeItem = FeatureLayerOperation.getLayerFeatureByName(
        this.layerDataValue
      );
      //设置选中列的前端列表控件列
      this.columnList = [];
      this.attRList = GisTableColumn[this.activeItem.listViewColumn];
      this.$nextTick(() => {
        this.$refs.SeniorFator.cleanSeniorContion();
      });
    },
    //点击高级查询按钮
    seniorStateChange() {
      this.$refs.SeniorFator.seniorStateChange();
    },
    //点击选择事件
    onTableRowClick(row, column, event) {
      let layer = this.layerDataValue;
      if (this.layerDataValue == "all") {
        layer = row.allTypeValue;
      }
      this.$bus.emit("setMapLocation", row.OBJECTID, layer, resultValue => {
        console.log(resultValue);
      });
    },
    //高亮选中区域
    heightLight(resultValue, layer) {
      this.heightLightState = true;
      if (layer) {
        this.activeItem = FeatureLayerOperation.getLayerFeatureByName(layer);
      }
      if (this.activeItem.layerType == LayerType.PipeTypeNO) {
        // //展示线
        this.$bus.emit("pipeLineView", resultValue); //线高亮
      } else {
        // //展示消防栓
        this.$bus.emit("facilitiesView", resultValue, this.activeItem.iconName);
      }
    },
    //高级查询
    seniorSearch() {
      if (this.heightLightState && !this.Gdata) {
        this.heightLightState = false;
        this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
      } else if (this.Gdata) {
        this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
        this.$bus.emit("addGeometry", this.Gdata);
      }
      this.loading = true;
      if (this.layerDataValue == "all") {
        this.layerListName = "all";
      } else {
        this.layerListName = FeatureLayerOperation.getLayerFeatureByName(
          this.layerDataValue
        ).listViewColumn;
      }
      let whereGIScondition = this.$refs.SeniorFator.whereGISconditionFnc();
      this.MapDataSearch(whereGIScondition);
    },
    //调用数据查询和高级空间查询接口
    MapDataSearch(whereGIScondition, layer, callBack) {
      layer = layer || this.layerDataValue;
      let pipeURL = FeatureLayerOperation.getLayerURLByName(layer);
      this._MapDataOperation.featureQuery(
        this.Gdata,
        whereGIScondition,
        pipeURL,
        resultValue => {
          if ((whereGIScondition && whereGIScondition != "1=1") || this.Gdata) {
            this.heightLight(resultValue);
          }
          resultValue = _.map(resultValue, objValue => {
            return objValue.attributes;
          });
          if (this.layerDataValue !== "all") {
            this.loading = false;
          }
          resultValue = FixFloat(resultValue);
          if (_.isFunction(callBack)) {
            callBack(resultValue);
            return;
          }
          this.columnListData = resultValue;
          if (!this.columnListData.length) {
            this.$myMessage("warning", "查询数据为空");
          }
        },
        err => {
          this.$myMessage("error", "查询表达式错误,查询结果为空");
          this.loading = false;
          this.columnListData = [];
        }
      );
    },
    //导出表格
    exportExcel() {
      let exportName;
      _.some(this.seniorData, group => {
        if (group.children && _.isArray(group.children)) {
          if (group.value === this.groupLayerDataValue[0]) {
            _.some(group.children, item => {
              if (item.value === this.layerDataValue) {
                exportName = group.label + item.label;
                return true;
              }
              return false;
            });
          }
          return exportName;
        } else {
          if (group.value === this.layerDataValue) {
            exportName = group.label;
            return true;
          }
          return false;
        }
      });
      //下载excel导出
      this.$refs.GisTable.exportExcelControl(true);
      this.$nextTick(() => {
        ExportExcel("div .outDataSerchExcel", exportName, res => {
          this.$refs.GisTable.exportExcelControl(false);
        });
      });
    }
  }
};
</script>

