<template>
  <div class="table_style count-style" :class="{flexible:flexible}" v-loading="loading">
    <TableFormTitle :titleName="'自定义统计'" :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="49px"  label-position="right" size="small">
      <el-row>
        <el-col :span="8" :xs="12" :sm="12" :lg="8" :xl="8" >
          <layerSelect
            :layerGroupLen.sync="layerGroupLen"
            :layerData.sync="layerData"
            :groupLayerDataValue.sync="groupLayerDataValue"
            :layerDataValue.sync="layerDataValue"
            :loading.sync="loading"
            @onLayerSelectChange="attrDataChange"
            @onGroupLayerSelectChange="attrDataChange"
          ></layerSelect>
        </el-col>
        <el-col
          :span="8"
          :xs="12"
          :sm="12"
          :lg="8"
          :xl="8"
          v-if="$options.filters.btnTree('draw' ,$route.name)"
        >
          <el-form-item label="形状：" class="choose_Icon_Wraper" label-width="78px">
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
      <el-row type="flex" justify="end" class="form-btn-wrapper">
        <el-button
          class="my-setting"
          size="mini"
          @click="setCountAttr"
          v-if="$options.filters.btnTree('clear' ,$route.name)"
        >设置统计字段</el-button>
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
                  v-for=" (column ,index) in columnList"
                  :key="index"
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
          <ChartDom ref="ChartDom" :attrDataValue="attrDataValue.join(',')" :loading="loading" />
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <SetCountAttr :setDialog.sync="setDialog" :attrList="attrList" @setSubmit="setSubmit"  ref="SetCountAttr"/>
  </div>
</template>
<script>
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
import TableFormTitle from "@common/components/TableFormTitle";
import ChartDom from "@features/GIS/components/ChartDom";
import SetCountAttr from "./SetCountAttr";
export default {
  components: {
    layerSelect,
    TableFormTitle,
    ChartDom,
    SetCountAttr
  },
  data() {
    return {
      spanArr: [], //表格合并
      attrList: [], //表头
      setDialog: false, //自定义弹框
      shapeList: ["画圆", "长方形", "多边形", "线"], //可点击形状
      flexible: false, //是否收缩左侧表格
      activeItem: {}, //当前选中的图层信息
      loading: false,
      shapeActive: "", //缓冲区部分选择地图绘制的形状
      chartTitle: "", //图表名称
      doubleLine: false, //是否表格双折线
      attrDataValue: [], //表格类型选中值
      tabActiveName: "first", //tab选中的数据
      // 分页相关
      columnList: [], //表头信息
      columnListData: [], //查询出的总数据
      SearchFields: ["equipment_type"],
      roadData: [],
      roadDataValue: "全部",
      layerData: [], //下拉框
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
    this.loadData();
    //空间数据查询
    this._MapDataOperation = new MapDataOperation();
    this._MapDataOperation.init().then(() => {});
  },
  beforeDestroy() {
    this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
    this.$bus.emit("clearGraphics"); //取消绘制方法
  },
  methods: {
    columnListChange() {
      let TableName = "Count_Attr";
      let columnList = [];
      if (FeatureLayerOperation.getLayerFeatureByName(this.layerDataValue)) {
        let layerType = FeatureLayerOperation.getLayerFeatureByName(
          this.layerDataValue
        ).layerType;
        if (layerType == LayerType.PipeTypeNO) {
          columnList = _.cloneDeep(GisTableColumn[TableName]);
        } else {
          columnList = _.cloneDeep(
            GisTableColumn[TableName].filter(item => {
              return item.show != "PipeLineLayer";
            })
          );
        }
        let len = this.attrDataValue.length;
        for (let i = len - 1; i >= 0; i--) {
          let attrClumn = _.filter(this.attrList, item => {
            return item.field === this.attrDataValue[i];
          })[0];
          columnList.unshift(attrClumn);
        }
        this.columnList = columnList;
      }
    },
    //初始加载数据
    loadData() {
      let needLayer = FeatureLayerOperation.getNeedLayer();
      this.layerData = needLayer[1];
      this.layerGroupLen = needLayer[0].length;
      this.groupLayerDataValue = needLayer[3];
      this.layerDataValue = needLayer[2];
      this.activeItem = FeatureLayerOperation.getLayerFeatureByName(
        this.layerDataValue
      );
      this.layerListName = this.activeItem.listViewColumn; //表头
      this.attrList = GisTableColumn[this.activeItem.listViewColumn];
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
      this.setTable(this.columnListData);
      this.columnListAllData = _.cloneDeep(this.columnListData);
      let len = parseInt(
        (document.querySelector("div .exportTable").offsetHeight - 45) / 41
      );
      if (this.columnListData.length > len - 1) {
        this.showSummary = true;
      } else {
        this.showSummary = false;
        _.forEach(this.attrDataValue, (item, index) => {
          if (!index) {
            sumObj[item] = "合计";
          } else {
            sumObj[item] = "";
          }
        });
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
      let attrDataCName = _.filter(this.attrList, item => {
        let a = 1 + _.indexOf(this.attrDataValue, item.field);
        return a;
      });
      attrDataCName = _.map(attrDataCName, "text").join(",");
      let LayerFeature = FeatureLayerOperation.getLayerFeatureByName(
        this.layerDataValue
      );
      //表头信息
      this.doubleLine = LayerFeature.layerType === LayerType.PipeTypeNO;
      let layerDataCName = LayerFeature.layerCName;
      if (this.attrDataValue === "all") {
        this.chartTitle = attrDataCName + "统计";
      } else {
        this.chartTitle = layerDataCName + attrDataCName + "统计";
      }
    },
    //统计类别选择操作方法
    layerChange() {
      //this.loading = true;
      //this.SearchStatices();
    },
    //查询的属性字段更改
    attrDataChange() {
      this.activeItem = FeatureLayerOperation.getLayerFeatureByName(
        this.layerDataValue
      );
      this.attrList = GisTableColumn[this.activeItem.listViewColumn];
      this.attrDataValue = []
      // this.columnListData = [];
      // if (this.Gdata) {
      //   this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
      //   this.Gdata = null;
      // }
      //this.SearchStatices();
    },
    //根据字段查询下拉信息
    SearchStatices() {
      if(!this.attrDataValue.length){
        this.$myMessage('warning' ,'统计字段为必选项')
        return
      }
      this.loading = true;
      this.columnListChange();
      this.activeItem = FeatureLayerOperation.getLayerFeatureByName(
        this.layerDataValue
      );
      this.columnListData = [];
      //分组统计字段
      let _GroupStaticesField = [
        {
          statisticType: "count", //定义统计类型 'count'|'sum'|'min'|'max'|'avg'|'stddev'
          onStatisticField: "OBJECTID",
          outStatisticFieldName: "equipment_number"
        }
      ];
      let _layerName = this.layerDataValue; //查询图层
      let layerType = FeatureLayerOperation.getLayerFeatureByName(_layerName)
        .layerType;
      if (this.attrDataValue == "all") {
        this.allsearchMethods(_GroupStaticesField);
      } else if (layerType == LayerType.PipeTypeNO) {
        this.searchMethods(_layerName, this.attrDataValue, null, null);
      } else {
        this.searchMethods(
          _layerName,
          this.attrDataValue,
          _GroupStaticesField,
          null
        );
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
      ``;
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
          // this.columnListData = _.sortBy(
          //   this.columnListData,
          //   this.attrDataValue
          // );
          this.columnListDataRefresh();
        }
      );
    },
    //导出表格
    exportExcel() {
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
      // _.some(this.attrData, item => {
      //   if (item.value === this.attrDataValue) {
      //     exportName += " - " + item.label;
      //     return true;
      //   } else {
      //     return false;
      //   }
      // });

      ExportExcel("div .exportTable", exportName);
    },
    //设置字段表格打开
    setCountAttr() {
      this.$refs.SetCountAttr.attrDataValue = this.attrDataValue
      this.setDialog = true;
    },
    //设置字段提交
    setSubmit(val) {
      this.attrDataValue = val;
    },
    //设置表格的单元格合并
    setTable(data) {
      let spanArr = {},
        concatOne = 0;
      let len = this.attrDataValue.length;
      _.forEach(this.attrDataValue, (attr, attrindex) => {
        if (attrindex < len) {
          spanArr[attrindex] = [];
          _.forEach(data, (item, index) => {
            if (index === 0) {
              spanArr[attrindex].push(1);
              concatOne = 0;
            } else {
              if (item[attr] === data[index - 1][attr]) {
                //第一列需合并相同内容的判断条件
                if (attrindex > 0) {
                  if (spanArr[attrindex - 1][index] === 0) {
                    spanArr[attrindex][concatOne] += 1;
                    spanArr[attrindex].push(0);
                  } else {
                    spanArr[attrindex].push(1);
                    concatOne = index;
                  }
                } else {
                  spanArr[attrindex][concatOne] += 1;
                  spanArr[attrindex].push(0);
                }
              } else {
                spanArr[attrindex].push(1);
                concatOne = index;
              }
            }
          });
        }
      });
      this.spanArr = spanArr;
    },
    //事件趋势合并单元格
    tableSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (!this.showSummary && rowIndex === this.columnListAllData.length - 1) {
        return;
      }
      let len = this.attrDataValue.length;
      if (columnIndex < len) {
        let _row = this.spanArr[columnIndex] && this.spanArr[columnIndex][rowIndex];
        let _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    }
  }
};
</script>