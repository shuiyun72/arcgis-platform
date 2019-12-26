<template>
  <div class="senior-search-style table_style" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'设施管理'" :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="83px" label-position="right" size="mini" v-loading="loadingSelect">
      <el-row type="flex" justify="space-between">
        <el-col :span="9" class="table-left" :xs="12" :sm="12" :lg="9">
          <layerSelect
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
              v-if="$options.filters.btnTree('search' ,$route.name)"
            >查询</el-button>
            <el-button
              class="my-filter-show"
              size="mini"
              @click="editEquipment"
              v-if="$options.filters.btnTree('edit' ,$route.name)"
            >编辑</el-button>
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
      @currentChange="currentChange"
    ></GisTable>
    <EditEquipmentForm
      :currentRow="currentRow"
      :layerDataValue="layerDataValue"
      :dialogVisible.sync="dialogVisible"
      :editClumn="editClumn"
      @loadData="seniorSearch"
    />
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
import EditEquipmentForm from "./EditEquipmentForm";
import SeniorFator from "@features/GIS/components//SeniorFator";
export default {
  components: {
    layerSelect,
    GisTable,
    TableFormTitle,
    EditEquipmentForm,
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
      currentRow: null, //当前行
      dialogVisible: false, //编辑弹窗
      editClumn: [], //编辑的信息
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
      sqlValue: "", //高级查询拼接后的sql语句
      sqlCValue: "", //高级查询拼接后的中文sql语句
      oldersqlValue: "", //上次查询的sql
      attRList: [], //sql的查询属性列表
      //关系比较数组列表
      mathData: [],
      attrValueList: [], //属性下拉选择框
      //高级查询所需的左侧单个条件输入
      fatorObj: {
        detailDataValue: "",
        mathDataValue: "",
        attRListValue: "",
        type: "", //是字符还是数字
        dom: "" //是下拉框还是时间选择，默认input
      } //sql查询
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
    //更改当前行
    currentChange(row) {
      this.currentRow = row;
    },
    //编辑信息
    editEquipment() {
      if (!this.currentRow) {
        this.$myMessage("warning", "请选择需要编辑的数据");
        return;
      }
      this.dialogVisible = true;
      this.editClumn = _.filter(GisTableColumn[this.layerListName], clumn => {
        return clumn.isEdit;
      });
    },
    loadLayerData() {
      let needLayer = FeatureLayerOperation.getNeedLayer("", false, true);
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
      ExportExcel("div .outDataSerchExcel", exportName + " - 设备展示");
    }
  }
};
</script>