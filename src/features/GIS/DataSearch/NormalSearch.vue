<template>
  <div :class="{flexible:flexible}" class="table_style" v-loading="loading">
    <TableFormTitle :titleName="'数据查询'" :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="60px" label-position="right" v-loading="loadingSelect">
      <el-row class="table-left">
        <el-col :span="7" :xs="12" :sm="12" :lg="7">
          <layerSelect
            :layerGroupLen.sync="layerGroupLen"
            :layerData.sync="layerData"
            :loading.sync="loading"
            :groupLayerDataValue.sync="groupLayerDataValue"
            :layerDataValue.sync="layerDataValue"
            @onLayerSelectChange="onLayerSelectChange"
            @onGroupLayerSelectChange="onLayerSelectChange"
          ></layerSelect>
        </el-col>
        <el-col :span="7" :xs="12" :sm="12" :lg="7">
          <el-form-item label="道路：">
            <el-select v-model="SearchPar.installation_address" placeholder="道路" size="mini" :disabled="!Installation_addressData.length">
              <el-option label="全部" value size="mini"></el-option>
              <el-option
                v-for="item in Installation_addressData"
                :key="item.value"
                :label="item"
                :value="item"
                size="mini"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9" :xs="12" :sm="12" :lg="9" class="hidden-md-and-down">
          <el-form-item label="竣工开始日期：" style="padding-left:5px;" label-width="120px">
            <el-date-picker
              :disabled="completion_dateDisable"
              :editable="false"
              v-model="SearchPar.completion_date"
              type="date"
              placeholder="开始日期"
              style=" width:100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="mini"
              :picker-options="{
                disabledDate(time) {
                  return SearchPar.ADD_END_DATE ?  time.getTime() > (new Date(SearchPar.ADD_END_DATE )).getTime() :false;
                 }
              }"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="table-left">
        <el-col :span="7" :xs="12" :sm="12" :lg="7">
          <el-form-item label="材质：">
            <el-select v-model="SearchPar.material_science" placeholder="材质" size="mini" :disabled="!material_scienceData.length">
              <el-option label="全部" value size="mini"></el-option>
              <el-option
                v-for="item in material_scienceData"
                :key="item.value"
                :label="item"
                :value="item"
                size="mini"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7" :xs="12" :sm="12" :lg="7">
          <el-form-item label="口径：">
            <el-select v-model="SearchPar.caliber" placeholder="口径" size="mini" :disabled="!caliberData.length">
              <el-option label="全部" value size="mini"></el-option>
              <el-option
                v-for="item in caliberData"
                :key="item.value"
                :label="item"
                :value="item"
                size="mini"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9" :xs="12" :sm="12" :lg="9" class="hidden-md-and-down">
          <el-form-item label="竣工结束日期：" style="padding-left:5px;" label-width="120px">
            <el-date-picker
              :disabled="completion_dateDisable"
              :editable="false"
              v-model="SearchPar.ADD_END_DATE"
              type="date"
              placeholder="结束日期"
              style="width:100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="mini"
              :picker-options="{
                disabledDate(time) {
                   return SearchPar.completion_date ? time.getTime() < (new Date(SearchPar.completion_date )).getTime() :false;
                 }
              }"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9" :xs="12" :sm="12" :lg="9" class="hidden-lg-and-up">
          <el-form-item label="竣工开始日期：" label-width="104px">
            <el-date-picker
              :disabled="completion_dateDisable"
              :editable="false"
              v-model="SearchPar.completion_date"
              type="date"
              placeholder="开始日期"
              style="width:100%"
              size="mini"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="{
                disabledDate(time) {
                  return SearchPar.ADD_END_DATE ?  time.getTime() > (new Date(SearchPar.ADD_END_DATE )).getTime() :false;
                 }
              }"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9" :xs="12" :sm="12" :lg="9" class="hidden-lg-and-up">
          <el-form-item label="竣工结束日期：" style="padding-left:5px;" label-width="104px">
            <el-date-picker
              :disabled="completion_dateDisable"
              :editable="false"
              v-model="SearchPar.ADD_END_DATE "
              type="date"
              placeholder="结束日期"
              style=" width:100%"
              size="mini"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="{
                disabledDate(time) {
                  return SearchPar.completion_date ? time.getTime() < (new Date(SearchPar.completion_date )).getTime() :false;
                 }
              }"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end" class="form-btn-warper">
        <el-button
          type="primary"
          size="mini"
          @click="onSearch"
          class="my-search"
          v-if="$options.filters.btnTree('search' ,$route.name)"
        >查询</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="exportExcel"
          class="my-export"
          v-if="$options.filters.btnTree('export' ,$route.name)"
        >导出</el-button>
      </el-row>
    </el-form>
    <GisTable
      :loading="loading"
      :tableHeight="`calc(100vh - 314px)`"
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
import layerSelect from "@features/GIS/components/layerSelect";
import GisTable from "@features/GIS/components/GisTable";
import TableFormTitle from "@common/components/TableFormTitle";
export default {
  components: {
    layerSelect,
    GisTable,
    TableFormTitle
  },
  data() {
    return {
      loadingSelect: false, //图层下拉选项加载
      flexible: false, //是否收缩左侧表格
      activeItem: {}, //当前选中的图层信息
      layerListName: [], //表格表头
      layerGroupLen: 1, //layerData组别 是否为多组数据，若为多组渲染多组select
      groupLayerDataValue: [], //多选select的值
      loading: false, //表格加载
      columnListData: [], //空间数据查询出来的所有数据列
      layerData: [], //图层下拉框数据
      Installation_addressData: [], //道路下拉框数据
      material_scienceData: [], //材质下拉框数据
      caliberData: [], //口径数据
      whereGIScondition: "", //sql拼接语句
      //检索参数
      SearchPar: {
        layerequipment_type: "",
        installation_address: "",
        material_science: "",
        caliber: "",
        ADD_END_DATE: "",
        completion_date: "",
        sort: "caliber",
        ordering: "asc"
      },
      attrValueList: [], //属性下拉选择框
      completion_dateDisable: false //时间选择是否可选
    };
  },
  created() {},
  mounted() {
    this.loadLayerData();
    //地图数据操作
    this._MapDataOperation = new MapDataOperation();
    this._MapDataOperation.init().then(() => {
      this.GetSelect();
    });
  },
  beforeDestroy() {
    if (this.whereGIScondition) {
      this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
    }
  },
  methods: {
    //图层下拉选择
    onLayerSelectChange(objvalue) {
      this.activeItem = FeatureLayerOperation.getLayerFeatureByName(
        this.layerDataValue
      );
      //设置选中列的前端列表控件列
      //this.columnListData = "";
      this.SearchPar.installation_address = "";
      this.SearchPar.material_science = "";
      this.SearchPar.caliber = "";
      this.GetSelect();
      if (this.whereGIScondition) {
        this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
      }
    },
    loadLayerData() {
      let needLayer = FeatureLayerOperation.getNeedLayer();
      this.layerData = needLayer[1];
      this.layerGroupLen = needLayer[0].length;
      this.layerDataValue = needLayer[2];
      this.activeItem = FeatureLayerOperation.getLayerFeatureByName(
        this.layerDataValue
      );
      this.groupLayerDataValue = needLayer[3];
      this.layerListName = this.activeItem.listViewColumn; //表头
    },
    //高亮选中区域
    heightLight(resultValue, layer) {
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
    //属性下拉信息 获取数据方法
    GetSelect() {
      this.loadingSelect = true;
      let _GroupField = [];
      let file = ["Installation_address", "material_science", "caliber"];
      _.forEach(file, item => {
        this[item + "Data"] = [];
      });
      _.forEach(GisTableColumn[this.activeItem.listViewColumn], item => {
        if (_.indexOf(file, item.field) >= 0) {
          _GroupField.push(item.field);
        }
        if (item.field === "completion_date") {
          this.completion_dateDisable = false;
        }
      });
      let pipeURL = FeatureLayerOperation.getLayerURLByName(
        this.layerDataValue
      );
      this._MapDataOperation.searchOrCountCondition(
        _GroupField,
        pipeURL,
        resultValue => {
          _.forEach(_GroupField, field => {
            let attrValueList = [];
            _.forEach(resultValue, item => {
              if (item[field] && _(item[field]).trim()) {
                attrValueList.push(item[field]);
              }
            });
            attrValueList = _.uniqBy(attrValueList);
            attrValueList = _.sortBy(attrValueList, field);
            if (attrValueList.length) {
              this[field + "Data"] = _.orderBy(attrValueList);
            }
          });
          this.loadingSelect = false;
        }
      );
    },
    onSearch(layer, callBack) {
      if (this.layerDataValue == "all") {
        this.layerListName = "all";
      } else {
        this.layerListName = FeatureLayerOperation.getLayerFeatureByName(
          this.layerDataValue
        ).listViewColumn;
      }
      this.loading = true;
      layer = _.isObject(layer) ? undefined : layer;
      let whereGIScondition = "";
      if (this.SearchPar.installation_address) {
        whereGIScondition +=
          " and Installation_address  like '%" +
          this.SearchPar.installation_address +
          "%' ";
      }
      if (this.SearchPar.material_science) {
        whereGIScondition +=
          " and material_science='" + this.SearchPar.material_science + "' ";
      }
      if (this.SearchPar.caliber) {
        whereGIScondition += " and  caliber=" + this.SearchPar.caliber + " ";
      }
      if (this.SearchPar.ADD_END_DATE) {
        whereGIScondition +=
          " and  completion_date <= date ' " + this.SearchPar.ADD_END_DATE + "' ";
      }
      if (this.SearchPar.completion_date) {
        whereGIScondition +=
          " and  completion_date >=  date ' " + this.SearchPar.completion_date + "' ";
      }
      if (whereGIScondition) {
        whereGIScondition = whereGIScondition.replace(/and/i, " ");
      }
      if (this.whereGIScondition) {
        this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
      }
      this.whereGIScondition = whereGIScondition;
      this.MapDataSearch(this.whereGIScondition, layer, callBack);
    },
    //调用数据查询和高级空间查询接口
    MapDataSearch(whereGIScondition, layer, callBack) {
      console.log(whereGIScondition);
      layer = layer || this.layerDataValue;
      if (whereGIScondition) {
        this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
      }
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
        }
      );
    },
    //导出表格
    exportExcel() {
      //下载excel导出
      let exportName;
      _.some(this.layerData, group => {
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
      ExportExcel("div .outDataSerchExcel", exportName + " - 数据查询");
    }
  }
};
</script>

