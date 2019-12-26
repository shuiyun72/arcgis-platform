<template>
  <div class="table_style count-style" :class="{flexible:flexible}" v-loading="loading">
    <TableFormTitle :titleName="'快速统计'" :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="78px" label-position="right" size="small">
      <el-row>
        <el-col
          :span="8"
          :xs="24"
          :sm="24"
          :lg="8"
          :xl="8"
          v-if="$options.filters.btnTree('draw' ,$route.name)"
        >
          <el-form-item label="形状：" class="choose_Icon_Wraper" label-width="49px">
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
        <el-col :span="8" :xs="12" :sm="12" :lg="8" :xl="8">
          <el-form-item label="统计类别：">
            <el-select size="mini" v-model="attrDataValue" @change="layerChange">
              <el-option
                v-for="item in attrData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :xs="12" :sm="12" :lg="8" :xl="8">
          <layerSelect
            v-show="attrDataValue !== 'all'"
            :layerGroupLen.sync="layerGroupLen"
            :layerData.sync="layerData"
            :groupLayerDataValue.sync="groupLayerDataValue"
            :layerDataValue.sync="layerDataValue"
            :loading.sync="loading"
            @onLayerSelectChange="attrDataChange"
            @onGroupLayerSelectChange="attrDataChange"
          ></layerSelect>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end" class="form-btn-wrapper">
        <el-button
          class="my-clean"
          size="mini"
          @click="clearGDataLayer"
          v-if="$options.filters.btnTree('clear' ,$route.name)"
        >清空选区</el-button>
        <el-button
          class="my-count"
          size="mini"
          @click="SearchStatices"
          v-if="$options.filters.btnTree('search' ,$route.name)"
        >统计</el-button>
        <el-button
          class="my-export"
          size="mini"
          @click="exportExcel"
          v-if="$options.filters.btnTree('export' ,$route.name)"
        >导出</el-button>
      </el-row>
    </el-form>
    <el-row class="tab-wraper">
      <el-tabs v-model="tabActiveName" type="card" @tab-click="chartChoosed">
        <el-tab-pane label="数据列表" name="first" style="padding-bottom:20px;">
          <el-row class="table-flex-wraper">
            <div class="table-contain-wrapper">
              <el-table
                v-loading="loading"
                class="exportTable"
                :data="columnListAllData"
                stripe
                border
                :span-method="tableSpanMethod"
                highlight-current-row
                height="100%"
                :show-summary="showSummary"
              >
                <el-table-column
                  v-for="column in columnList"
                  :key="column.field"
                  :prop="column.field"
                  :label="column.text"
                  :width="column.width"
                  :type="column.type"
                  align="center"
                ></el-table-column>
              </el-table>
            </div>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="数据图表" name="second">
          <ChartDom ref="ChartDom" :attrDataValue="attrDataValue" :loading="loading" />
        </el-tab-pane>
      </el-tabs>
    </el-row>
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
import * as easyuiTable from "@common/consts/GisConst/GisTableColumn";
import { ExportExcel, FixFloat } from "@util";
import { setTimeout } from "timers";
import { EMSGSIZE } from "constants";
import { reject } from "q";
import { promises } from "fs";
import layerSelect from "@features/GIS/components/layerSelect";
import TableFormTitle from "@common/components/TableFormTitle";
import ChartDom from "@features/GIS/components/ChartDom";
export default {
  components: {
    layerSelect,
    TableFormTitle,
    ChartDom
  },
  data() {
    return {
      layerData: [], //下拉框
      shapeList: ["画圆", "长方形", "多边形", "线"], //可点击形状
      flexible: false, //是否收缩左侧表格
      activeItem: {}, //当前选中的图层信息
      loading: false,
      shapeActive: "", //缓冲区部分选择地图绘制的形状
      chartTitle: "", //图表名称
      doubleLine: false, //是否表格双折线
      attrData: [
        {
          label: "按管径统计",
          value: "caliber",
          easyTableName: "Count_Caliber"
        },
        {
          label: "按道路统计",
          value: "Installation_address",
          easyTableName: "Count_Road"
        },
        {
          label: "按材质统计",
          value: "material_science",
          easyTableName: "Count_Material",
          name: "material_science"
        },
        {
          label: "全设备统计",
          value: "all",
          easyTableName: "Count_All"
        }
      ], //选择表格类型下拉框数据（原菜单页面）
      attrDataValue: "caliber", //表格类型选中值
      tabActiveName: "first", //tab选中的数据
      // 分页相关
      columnList: [], //表头信息
      columnListData: [], //查询出的总数据
      SearchFields: ["equipment_type"],
      roadData: [],
      roadDataValue: "全部",
      layerDataValue: "",
      GroupStaticesField: [], //属性查询字段
      Gdata: null, //空间数据
      layerListName: "", //表格表头
      groupLayerDataValue: [], //多选select的值
      layerGroupLen: 1, //layerData组别 是否为多组数据，若为多组渲染多组select
      columnListAllData: [], //表格内容列表
      showSummary: false //表格底部是否采用vue的合计
    };
  },
  mounted() {
    //this.loading = true;
    this.loadData([
      LayerType.PipeTypeNO,
      LayerType.ValveTypeNO,
      LayerType.FirehydrantTypeNO
    ]);
    //空间数据查询
    this._MapDataOperation = new MapDataOperation();
    this._MapDataOperation.init().then(() => {
      //this.SearchStatices(); //调取数据
    });
  },
  beforeDestroy() {
    this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
    this.$bus.emit("clearGraphics"); //取消绘制方法
  },
  watch: {
    //选择表格类型下拉框数据（原菜单页面）
    attrDataValue() {
      switch (this.attrDataValue) {
        case "D_S":
        case "LANE_WAY":
          this.loadData([
            LayerType.PipeTypeNO,
            LayerType.ValveTypeNO,
            LayerType.FirehydrantTypeNO
          ]);
          break;
        case "MATERIAL":
          this.loadData([LayerType.PipeTypeNO, LayerType.ValveTypeNO]);
          break;
      }
    }
  },
  methods: {
    columnListChange() {
      let TableName = _.filter(this.attrData, item => {
        return item.value == this.attrDataValue;
      })[0].easyTableName;
      if (FeatureLayerOperation.getLayerFeatureByName(this.layerDataValue)) {
        let layerType = FeatureLayerOperation.getLayerFeatureByName(
          this.layerDataValue
        ).layerType;
        if (layerType == LayerType.PipeTypeNO) {
          this.columnList = easyuiTable[TableName];
        } else {
          this.columnList = easyuiTable[TableName].filter(item => {
            return item.show != "PipeLineLayer";
          });
        }
      }
    },
    //初始加载数据
    loadData(type) {
      let needLayer = FeatureLayerOperation.getNeedLayer(type);
      this.layerData = needLayer[1];
      this.layerGroupLen = needLayer[0].length;
      this.groupLayerDataValue = needLayer[3];
      this.layerDataValue = needLayer[2];
      this.activeItem = FeatureLayerOperation.getLayerFeatureByName(
        this.layerDataValue
      );
      this.layerListName = needLayer[0][0].featureLayers[0].listViewColumn; //表头
      this.columnListChange();
      this.getCharttitle();
      this.$refs.ChartDom.charInit(
        this.columnListAllData,
        this.chartTitle,
        this.doubleLine
      );
    },
    //当列表更新数据后的操作
    columnListDataRefresh() {
      let sumObj = {};
      let _GroupStaticesField = this.GroupStaticesField;
      _.forEach(_GroupStaticesField, item => {
        sumObj[item.outStatisticFieldName] = _.sumBy(
          this.columnListData,
          function(o) {
            return Number(o[item.outStatisticFieldName]);
          }
        );
        if (item.outStatisticFieldName === "length") {
          sumObj[item.outStatisticFieldName] =
            parseInt(sumObj[item.outStatisticFieldName]) / 1000;
        }
        sumObj[item.outStatisticFieldName + "Percent"] = "100%";
      });
      _.forEach(this.columnListData, column => {
        _.forEach(_GroupStaticesField, item => {
          if (item.outStatisticFieldName === "length") {
            column[item.outStatisticFieldName] =
              parseInt(column[item.outStatisticFieldName]) / 1000;
          }
          column[item.outStatisticFieldName + "Percent"] =
            (
              (column[item.outStatisticFieldName] /
                sumObj[item.outStatisticFieldName]) *
              100
            ).toFixed(2) + "%";
        });
      });
      this.columnListAllData = _.cloneDeep(this.columnListData);
      let len = parseInt(
        (document.querySelector("div .exportTable").offsetHeight - 45) / 41
      );
      if (this.columnListData.length > len - 1) {
        this.showSummary = true;
      } else {
        this.showSummary = false;
        sumObj[this.attrDataValue] = "合计";
        this.columnListAllData.push(sumObj);
      }
      this.getCharttitle();
      this.$refs.ChartDom.charInit(
        this.columnListAllData,
        this.chartTitle,
        this.doubleLine
      );
    },
    //清空选区
    clearGDataLayer() {
      this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
      this.Gdata = null;
      // this.columnListData = [];
      // this.$refs.ChartDom.charInit();
      //this.SearchStatices();
    },
    //合计方法
    getTotal(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (column.property === "num") {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index];
        } else {
          sums[index] = "--";
        }
      });

      return sums;
    },
    //选择到chart
    chartChoosed(tabPane) {
      if (tabPane.paneName === "second") {
        this.$nextTick(() => {
          this.$refs.ChartDom.handleResize();
        });
      }
    },
    getCharttitle() {
      let attrDataCName = _.filter(this.attrData, item => {
        return item.value == this.attrDataValue;
      })[0].label;
      let LayerFeature = FeatureLayerOperation.getLayerFeatureByName(
        this.layerDataValue
      );
      //表头信息
      this.doubleLine = LayerFeature.layerType === LayerType.PipeTypeNO;
      let layerDataCName = LayerFeature.layerCName;
      if (this.attrDataValue === "all") {
        this.chartTitle = attrDataCName;
      } else {
        this.chartTitle = attrDataCName + layerDataCName;
      }
    },
    //统计类别选择操作方法
    layerChange() {
      //this.loading = true;
      //this.SearchStatices();
    },
    //查询的属性字段更改
    attrDataChange() {
      // this.activeItem = FeatureLayerOperation.getLayerFeatureByName(
      //   this.layerDataValue
      // );
      // this.columnListData = [];
      // if (this.Gdata) {
      //   this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
      //   this.Gdata = null;
      // }
      //this.SearchStatices();
    },
    //根据字段查询下拉信息
    SearchStatices() {
      this.loading = true;
      this.columnListChange();
      this.activeItem = FeatureLayerOperation.getLayerFeatureByName(
        this.layerDataValue
      );
      this.columnListData = [];
      // if (this.Gdata) {
      //   this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
      //   this.Gdata = null;
      // }
      //分组统计字段
      let _GroupStaticesField = [
        {
          statisticType: "count", //定义统计类型 'count'|'sum'|'min'|'max'|'avg'|'stddev'
          onStatisticField: "OBJECTID",
          outStatisticFieldName: "equipment_number"
        }
      ];
      let _layerName = this.layerDataValue; //查询图层
      let _GroupField = this.attrDataValue; //分组字段
      let layerType = FeatureLayerOperation.getLayerFeatureByName(_layerName)
        .layerType;
      if (this.attrDataValue == "all") {
        this.allsearchMethods(_GroupStaticesField);
      } else if (layerType == LayerType.PipeTypeNO) {
        _GroupField = _GroupField.split(",");
        this.searchMethods(_layerName, _GroupField, null, null);
      } else {
        _GroupField = _GroupField.split(",");
        this.searchMethods(_layerName, _GroupField, _GroupStaticesField, null);
      }
    },
    //全部查询方法
    allsearchMethods(_GroupStaticesField) {
      //搜集所需的查询图层及后续用到的lable表头名字
      let serchLayerArr = [];
      _.forEach(MapConfigure.FeatureLayerGroup, objValue => {
        _.forEach(objValue.featureLayers, item => {
          if (serchLayerArr[item.layerType]) {
            serchLayerArr[item.layerType].layerName.push(item.layerName);
          } else {
            serchLayerArr[item.layerType] = {
              layerType: item.layerType,
              layerName: [item.layerName],
              layerCName: item.layerCName
            };
          }
        });
      });
      this.columnListData = [];
      let taskList = [];
      for (let item of serchLayerArr) {
        if (item) {
          let queryTask = new Promise((res, rej) => {
            this.searchMethods(
              item.layerName,
              null,
              _GroupStaticesField,
              resolve => {
                if (resolve.length) {
                  res({
                    all: item.layerCName,
                    equipment_number: resolve[0].equipment_number
                  });
                } else {
                  res({
                    error: true
                  });
                }
              },
              item.layerType
            );
          });
          taskList.push(queryTask);
        }
      }
      Promise.all(taskList)
        .then(res => {
          let columnData = _.filter(res, item => {
            return !item.error;
          });
          this.loading = false;

          if (!columnData.length) {
            this.$message({
              type: "warning",
              message: "此处没有数据",
              showClose: true
            });
          }
          this.columnListData = columnData;
          this.columnListDataRefresh();
        })
        .catch(err => {
          console.log("全部查询加空间数据", err);
        });
    },
    //高亮选中区域
    heightLight(objValue) {
      if (this.activeItem.layerType == LayerType.PipeTypeNO) {
        // //展示线
        this.$bus.emit("pipeLineView", objValue); //线高亮
      } else {
        // //展示消防栓
        this.$bus.emit("facilitiesView", objValue, this.activeItem.iconName);
      }
    },
    //地图框选统计
    mapSelectStatices(_drawType) {
      if (this.shapeActive === _drawType) {
        this.shapeActive = "";
        this.$bus.emit("clearGraphics", true);
        return;
      }
      this.shapeActive = _drawType;
      this.Gdata = null;
      //条件组合
      this.$bus.emit("getStatisticsResult", _drawType, resultValue => {
        this.shapeActive = "";
        //this.loading = true;
        this.Gdata = resultValue;
        //this.SearchStatices();
        return;
      });
    },
    //调用数据查询之前的计算参数方法
    searchMethods(
      layerName,
      GroupField,
      GroupStaticesField,
      callBack,
      layerType
    ) {
      this.columnListData = [];
      let _GroupStaticesField = GroupStaticesField || [
        {
          statisticType: "count", //定义统计类型 'count'|'sum'|'min'|'max'|'avg'|'stddev'
          onStatisticField: "OBJECTID",
          outStatisticFieldName: "equipment_number"
        },
        {
          statisticType: "sum", //定义统计类型 'count'|'sum'|'min'|'max'|'avg'|'stddev'
          onStatisticField: "length",
          outStatisticFieldName: "length"
        }
      ];
      this.GroupStaticesField = _GroupStaticesField;
      let _GData = this.Gdata || null; //空间数据
      let _GroupField = GroupField;
      let _SearchCondition = "1=1"; //查询条件
      let pipeURL;
      if (layerType) {
        pipeURL = FeatureLayerOperation.getLayerURLByType(layerType);
      } else {
        pipeURL = FeatureLayerOperation.getLayerURLByName(this.layerDataValue);
      }
      if (this.attrDataValue == "all") {
        let layerTypeList = [];
        let taskList = [];
        _.forEach(layerName, layerItem => {
          let url = FeatureLayerOperation.getLayerURLByName(layerItem);
          let queryTask = new Promise((resolve, reject) => {
            this.featureQuery(
              _GData,
              _SearchCondition,
              _GroupStaticesField,
              _GroupField,
              url,
              resolve
            );
          });
          taskList.push(queryTask);
        });
        Promise.all(taskList)
          .then(result => {
            _.forEach(result, (resItem, index) => {
              if (resItem.length) {
                layerTypeList.push(
                  FeatureLayerOperation.getLayerURLByName(layerName[index])
                );
              }
            });
            if (layerTypeList.length) {
              this.featureQueryGroup(
                _GData,
                _SearchCondition,
                _GroupStaticesField,
                _GroupField,
                layerTypeList,
                callBack
              );
            } else {
              callBack([]);
            }
          })
          .catch(err => {
            console.log("layer是否可以进行查询方法出错", err);
          });
      } else {
        // this.loading = true
        this.featureQuery(
          _GData,
          _SearchCondition,
          _GroupStaticesField,
          _GroupField,
          pipeURL,
          resolve => {
            this.featureQueryGroup(
              _GData,
              _SearchCondition,
              _GroupStaticesField,
              _GroupField,
              pipeURL,
              callBack
            );
          }
        );
      }
    },
    //查询layer是否有信息
    featureQuery(
      _GData,
      _SearchCondition,
      _GroupStaticesField,
      _GroupField,
      pipeURL,
      callBack
    ) {
      this._MapDataOperation.featureQuery(_GData, "1=1", pipeURL, res => {
        if (this.attrDataValue == "all") {
          callBack(res);
          return;
        }

        if (res.length) {
          this.featureQueryGroup(
            _GData,
            _SearchCondition,
            _GroupStaticesField,
            _GroupField,
            pipeURL,
            callBack
          );
        } else {
          if (this.attrDataValue != "all") {
            this.loading = false;
            this.columnListData = [];
            this.columnListDataRefresh();
            this.$message({
              type: "warning",
              message: "此处没有数据",
              showClose: true
            });
          } else {
            callBack(res);
            return;
          }
        }
      });
    },
    //查询表格信息
    featureQueryGroup(
      _GData,
      _SearchCondition,
      _GroupStaticesField,
      _GroupField,
      pipeURL,
      callBack
    ) {
      this._MapDataOperation.featureQueryGroup(
        _GData,
        _SearchCondition,
        _GroupStaticesField,
        _GroupField,
        pipeURL,
        resultValue => {
          if (typeof callBack === "function") {
            callBack(resultValue);
            return;
          }
          this.loading = false;
          this.columnListData = resultValue;
          //保留三位小数
          this.columnListData = FixFloat(resultValue);
          //排序
          //console.log(this.columnListData, this.attrDataValue);
          this.columnListData = _.sortBy(
            this.columnListData,
            this.attrDataValue
          );
          this.columnListDataRefresh();
        }
      );
    },
    //导出表格
    exportExcel() {
      let exportName;
      if (this.attrDataValue === "all") {
        exportName = "全设备统计";
      } else {
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
        _.some(this.attrData, item => {
          if (item.value === this.attrDataValue) {
            exportName += " - " + item.label;
            return true;
          } else {
            return false;
          }
        });
      }

      ExportExcel("div .exportTable", exportName);
    }
  }
};
</script>