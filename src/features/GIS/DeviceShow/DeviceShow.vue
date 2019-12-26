<template>
  <div class="senior-search-style table_style" :class="{flexible:flexible}" v-loading="loading">
    <TableFormTitle :titleName="'设备展示'" :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="83px" label-position="right" size="mini" v-loading="loadingSelect">
      <el-row type="flex" justify="space-between">
        <el-col :span="9" class="table-left" :xs="12" :sm="12" :lg="9">
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
        <el-col :span="15">
          <el-row type="flex" justify="end" style="padding:0">
            <el-button
              class="my-show"
              size="mini"
              @click="seniorSearch"
              v-if="$options.filters.btnTree('normalShow' ,$route.name)"
            >普通展示</el-button>
            <el-button
              class="my-filter-show"
              size="mini"
              @click="filterSearch"
              v-if="$options.filters.btnTree('filterShow' ,$route.name)"
            >过滤展示</el-button>
            <el-button
              class="my-reset hidden-md-and-down"
              size="mini"
              @click="seniorReset"
              v-if="$options.filters.btnTree('reset' ,$route.name)"
            >重置</el-button>
            <el-button
              class="my-export"
              size="mini"
              @click="exportExcel"
              v-if="$options.filters.btnTree('export' ,$route.name)"
            >导出</el-button>
          </el-row>
        </el-col>
      </el-row>
      <SeniorFator
        ref="SeniorFator"
        :attRList="attRList"
        :layerDataValue="layerDataValue"
        :showSeniorTop="false"
      />
    </el-form>

    <GisTable
      :loading="loading"
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
  beforeDestroy() {
    if (this.sqlValue) {
      this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
    }
    if (this.filterLayer) {
      this.$bus.emit("setCheckedTreeNodes", true);
      this.$bus.emit("onLayerViewAllVisibale", true);
    }
  },
  data() {
    return {
      loadingSelect: false,
      heightLightState: false, //地图高亮状态
      filterLayer: false, //是否展示过滤图层
      flexible: false, //是否收缩左侧表格
      activeItem: {}, //当前选中的图层信息
      layerListName: [], //表格表头
      layerGroupLen: 1, //layerData组别 是否为多组数据，若为多组渲染多组select
      groupLayerDataValue: [], //多选select的值
      loading: false, //表格加载
      columnListData: [], //空间数据查询出来的所有数据列
      seniorData: [], //非缓冲区图层数据  图层下拉框数据
      oldersqlValue: "", //上次查询的sql
      attRList: [], //sql的查询属性列表
      //关系比较数组列表
      mathData: [],
      attrValueList: [] //属性下拉选择框
    };
  },
  created() {},
  mounted() {
    this.loadLayerData();
    this.$refs.SeniorFator.seniorStateChange(true, true);
    //地图数据操作
    this._MapDataOperation = new MapDataOperation();
    this._MapDataOperation.init().then(() => {
      // this.onLayerSelectChange();
    });
  },
  methods: {
    filterSearch() {
      if (this.$refs.SeniorFator.sqlValue.length) {
        this.filterLayer = true;
        // this.$bus.emit('setCheckedTreeNodes',false)
        this.$bus.emit("onLayerViewAllVisibale", false);
        let whereGIScondition = this.$refs.SeniorFator.whereGISconditionFnc();
        if (this.oldersqlValue != whereGIScondition) {
          this.loading = true;
          if (this.heightLightState) {
            this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
            this.heightLightState = false;
          }
          this.MapDataSearch(whereGIScondition);
        }
      } else {
        this.$message({
          type: "warning",
          message: "过滤展示仅用于筛选条件存在时",
          showclose: true
        });
      }
    },
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
    //高级查询重置
    seniorReset() {
      if (this.heightLightState) {
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
      if (this.layerDataValue == "all") {
        this.layerListName = "all";
      } else {
        this.layerListName = FeatureLayerOperation.getLayerFeatureByName(
          this.layerDataValue
        ).listViewColumn;
      }
      if (this.filterLayer) {
        this.filterLayer = false;
        this.$bus.emit("setCheckedTreeNodes", true);
        this.$bus.emit("onLayerViewAllVisibale", true);
      }
      let whereGIScondition = this.$refs.SeniorFator.whereGISconditionFnc();
      if (whereGIScondition && this.oldersqlValue == whereGIScondition) {
        return;
      }
      if (this.heightLightState && !this.Gdata) {
        this.heightLightState = false;
        this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
      } else if (this.Gdata) {
        this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
        this.$bus.emit("addGeometry", this.Gdata);
      }
      this.loading = true;
      this.MapDataSearch(whereGIScondition);
    },
    //调用数据查询和高级空间查询接口
    MapDataSearch(whereGIScondition, layer, callBack) {
      this.oldersqlValue = whereGIScondition;
      layer = layer || this.layerDataValue;
      let pipeURL = FeatureLayerOperation.getLayerURLByName(layer);
      this._MapDataOperation.featureQuery(
        null,
        whereGIScondition,
        pipeURL,
        resultValue => {
          if (whereGIScondition && whereGIScondition != "1=1") {
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
      //下载excel导出
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
      this.$refs.GisTable.exportExcelControl(true);
      this.$nextTick(() => {
        ExportExcel(
          "div .outDataSerchExcel",
          exportName + " - 设备展示",
          res => {
            this.$refs.GisTable.exportExcelControl(false);
          }
        );
      });
    }
  }
};
</script>