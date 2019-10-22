<template>
  <div class="table_style w700" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'缓冲查询'" :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="83px" label-position="right">
      <el-row>
        <el-col class="table-left" :xs="12" :sm="12" :lg="8">
          <layerSelect
            :layerGroupLen.sync="layerGroupLen"
            :layerData.sync="bufferData"
            :loading.sync="loading"
            :groupLayerDataValue.sync="groupLayerDataValue"
            :layerDataValue.sync="layerDataValue"
            :layerListName.sync="layerListName"
            @onLayerSelectChange="onLayerSelectChange"
            @onGroupLayerSelectChange="onLayerSelectChange"
          ></layerSelect>
        </el-col>

        <!-- <el-col :span="2" class="iconfont-yelleow choose-Icon-shape" :offset="1">
          <span class="iconfont icon-dian" @click="onPointBuffer"></span>
          <span class="iconfont icon-xiantiao-line" @click="onLineBuffer"></span>
        </el-col>-->
        <el-col :xs="12" :sm="12" :lg="10">
          <el-form-item
            label="缓冲半径(米)："
            style="padding-left:20px"
            label-width="120px"
            @keyup.enter.native="bufferSearch"
          >
            <el-input-number v-model="bufferRadius" controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-button
          class="my-search"
          size="mini"
          @click="equipmentSearch"
          style="margin-right:10px;"
          v-if="$options.filters.btnTree('eSearch' ,$route.meta.iFunID)"
        >设备区域</el-button>
        <el-popover
          popper-class="buffer-popover"
          placement="bottom-start"
          width="10"
          trigger="click"
        >
          <div class="choose-Icon-shape">
            <span style>请选择：</span>
            <span>
              <svg
                class="icon"
                aria-hidden="true"
                @click="mapSelectStatices('画圆')"
                :class="{active:shapeActive == '画圆'}"
              >
                <use xlink:href="#icon-caozuoxingzhuang-2" />
              </svg>
            </span>
            <span>
              <svg
                class="icon"
                aria-hidden="true"
                @click="mapSelectStatices('长方形')"
                :class="{active:shapeActive == '长方形'}"
              >
                <use xlink:href="#icon-caozuoxingzhuang-1" />
              </svg>
            </span>
            <span>
              <svg
                class="icon"
                aria-hidden="true"
                @click="mapSelectStatices('多边形')"
                :class="{active:shapeActive == '多边形'}"
              >
                <use xlink:href="#icon-caozuoxingzhuang-" />
              </svg>
            </span>
          </div>
          <el-button
            slot="reference"
            class="my-search"
            size="mini"
            style="margin-right:10px;"
            v-if="$options.filters.btnTree('sSearch' ,$route.meta.iFunID)"
          >空间区域</el-button>
        </el-popover>
        <el-button
          class="my-search"
          size="mini"
          @click="bufferSearch"
          v-if="$options.filters.btnTree('search' ,$route.meta.iFunID)"
        >查询</el-button>
        <el-button
          class="my-export"
          size="mini"
          @click="exportExcel"
          v-if="$options.filters.btnTree('export' ,$route.meta.iFunID)"
        >导出</el-button>
        <el-button
          class="my-del"
          size="mini"
          @click="bufferClean"
          v-if="$options.filters.btnTree('clear' ,$route.meta.iFunID)"
        >清除</el-button>
      </el-row>
    </el-form>
    <GisTable
      :loading="loading"
      :tableHeight="`calc(100vh - 276px)`"
      @doubleAnalysis="doubleAnalysis"
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
import * as easyuiTable from "@common/consts/GisConst/GisTableColumn";
import { ExportExcel, FixFloat } from "@util";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { constants } from "fs";
import layerSelect from "@features/GIS/components/layerSelect";
import GisTable from "@features/GIS/components/GisTable";
import TableFormTitle from "@common/components/TableFormTitle";
import { debug } from "util";
export default {
  components: {
    layerSelect,
    GisTable,
    TableFormTitle
  },
  data() {
    return {
      visible: false,
      flexible: false, //是否收缩左侧表格
      eachLayer: [], //全部查询所需的图层信息
      activeItem: {}, //当前选中的图层信息
      layerListName: [], //表格表头
      layerGroupLen: 1, //layerData组别 是否为多组数据，若为多组渲染多组select
      groupLayerDataValue: [], //多选select的值
      loading: false, //表格加载
      tabActiveName: "first", //tab选中的列名称
      columnListData: [], //空间数据查询出来的所有数据列
      layerData: [], //图层下拉框数据
      roadData: [], //道路下拉框数据
      materialData: [], //材质下拉框数据
      caliberData: [], //口径数据
      whereGIScondition: "", //sql拼接语句
      sqlValue: "", //高级查询拼接后的sql语句
      attRList: [], //sql的查询属性列表
      //检索参数
      SearchPar: {
        layerequipment_type: "",
        installation_address: "",
        material_science: "",
        caliber: "",
        startCompletion_date: "",
        endCompletion_date: "",
        sort: "caliber",
        ordering: "asc"
      },
      bufferRadius: 100, //缓冲区半径
      _GData: [], //绘制的点数据
      drawType: "", //当前缓存的线or点绘制类型
      bufferData: [], //缓冲区图层数据
      seniorData: [], //非缓冲区图层数据
      PID: []
    };
  },
  created() {
    // this.loading = true;
  },
  mounted() {
    this.loadLayerData();
    //地图数据操作
    this._MapDataOperation = new MapDataOperation();
    this._MapDataOperation.init().then(() => {
      //this.bufferSearch();
    });
  },
  beforeDestroy() {
    if (this._GData) {
      this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
    }
    this.$bus.emit("clearGraphics"); ////取消绘制方法
  },
  methods: {
    doubleAnalysis(currentRow) {
      // if (!this.currentRow) {
      //   this.$message({
      //     type: "warning",
      //     message: "请选择需要分析的数据",
      //     showClose: true
      //   });
      //   return;
      // }

      // let _GData = this._MapDataOperation.createPoint(
      //   this.currentRow.coordinate_x,
      //   this.currentRow.coordinate_y
      // );
      if (!currentRow.coordinate_x) {
        return;
      }
      let _GData = this._MapDataOperation.createPoint(
        currentRow.coordinate_x,
        currentRow.coordinate_y
      );
      this.AnalysisFnc(_GData);
    },
    AnalysisFnc(_GData) {
      this.$bus.emit("bufferAnalysis", this.layerDataValue, _GData, 1, res => {
        _.forEach(res, item => {
          this.PID.push(item.attributes.PID);
        });
        console.log("buffer", this.layerDataValue, this.PID, res);
        //this.SquibSearchFnc();
      });
    },
    loadLayerData() {
      let needLayer = FeatureLayerOperation.getNeedLayer();
      this.bufferData = needLayer[1];
      this.layerGroupLen = needLayer[0].length;
      this.layerDataValue = needLayer[2];
      this.activeItem = FeatureLayerOperation.getLayerFeatureByName(
        this.layerDataValue
      );
      this.groupLayerDataValue = needLayer[3];
      this.layerListName = needLayer[0][0].featureLayers[0].listViewColumn; //表头
      this.seniorData = _.cloneDeep(this.bufferData);
      if (this.layerGroupLen > 1) {
        this.bufferData = _.forEach(this.bufferData, ele => {
          ele.children.unshift({
            label: "全部",
            value: "all",
            listViewColumn: "all"
          });
        });
      } else {
        this.bufferData.unshift({
          viewIndex: 0,
          label: "全部",
          value: "all",
          listViewColumn: "all"
        });
      }
      this.layerDataValue = "all";
      this.layerListName = "all";
      this.groupLayerDataValue[1] = "all";
      this.attRList =
        MapConfigure.FeatureLayerGroup[0].featureLayers[0].featureColumn;
      this.eachLayer = this.getEachLayer();
    },
    //清除buffer在地图的展示
    bufferClean() {
      this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
      this.$bus.emit("clearGraphics"); //取消绘制方法
      this._GData = null;
      //this.loading = true;
      this.drawType = "";
      this.columnListData = [];
      //this.bufferSearch();
    },
    //设备统计
    equipmentSearch() {
      this.drawType = "设备";
      this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
      this._GData = null;
      this.$bus.emit("getMapPoint", true, res => {
        console.log(res);
        this._GData = res;
        this.$bus.emit(
          "featureQueryTask",
          this._GData,
          res => {
            let layerData = [];
            _.forEach(res, item => {
              if (item.layerData.length) {
                layerData.push(...item.layerData);
              }
            });
            if (layerData.length == 0) {
              this.$message({
                type: "warning",
                message: "请选择设备点进行分析",
                showclose: true
              });
            } else if (layerData.length == res[0].layerData.length) {
              this.drawType = "管线";
              this._GData = res[0].layerData[0].geometry;
              this.$bus.emit("addMapLine", this._GData);
              //this.allBufferSearch();
            } else {
              this.drawType = "其他";
              this.$bus.emit("addMapPoint", this._GData);
              //this.allBufferSearch();
            }
          },
          0.3
        );
        return;
      });
    },
    //地图框选统计
    mapSelectStatices(_drawType) {
      this.drawType = _drawType;
      this._GData = null;
      //条件组合
      this.$bus.emit("getStatisticsResult", _drawType, resultValue => {
        //this.loading = true;
        this._GData = resultValue;
        //console.log('equipmentSearch',resultValue)
        //this.allBufferSearch();
        return;
      });
    },
    // //点缓冲区查询
    // onPointBuffer() {
    //    this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
    //   this.$bus.emit("getMapPoint", false, _GData => {
    //     // this.loading = true;
    //     this._GData = _GData;
    //     console.log(_GData)
    //     this.drawType = "Point";
    //     this.allBufferSearch();
    //   });
    // },
    // //线缓冲区查询
    // onLineBuffer() {
    //   this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
    //   this.$bus.emit("getMapLine", _GData => {
    //     this.loading = true;
    //     this._GData = _GData;
    //     this.drawType = "Line";
    //     this.allBufferSearch();
    //   });
    // },
    onBufferSearch(layer, callBack) {
      layer = layer || this.layerDataValue;
      this.$bus.emit(
        "bufferAnalysis",
        layer,
        this._GData,
        this.bufferRadius,
        resultValue => {
          let resData = _.map(resultValue, "attributes");
          if (_.isFunction(callBack)) {
            callBack(resData);
          } else {
            this.loading = false;
            this.columnListData = resData;
          }
          this.heightLight(resultValue, layer);
        },
        false
      );
    },
    allBufferSearch() {
      if (this.layerDataValue == "all") {
        this.layerListName = "all";
      } else {
        this.layerListName = FeatureLayerOperation.getLayerFeatureByName(
          this.layerDataValue
        ).listViewColumn;
      }
      if (this.layerDataValue === "all") {
        let resArray = [];
        let eachLayerData = this.eachLayer;
        let taskList = [];
        _.forEach(eachLayerData, ele => {
          let queryTask = new Promise((resolve, reject) => {
            this.onBufferSearch(ele.value, res => {
              _.forEach(res, item => {
                item.allType = ele.label;
                item.allTypeValue = ele.value;
              });
              resolve(res);
            });
          });
          taskList.push(queryTask);
        });
        Promise.all(taskList)
          .then(result => {
            this.loading = false;
            if (this.drawType == "管线") {
              this.$bus.emit("addMapLine", this._GData);
            } else if (this.drawType == "其他") {
              this.$bus.emit("addMapPoint", this._GData);
            }
            let resArray = [];
            _.forEach(result, item => {
              item.length && resArray.push(...item);
            });
            this.columnListData = resArray;
          })
          .catch(err => {
            console.log("search全部查询部分", err);
          });
      } else {
        this.onBufferSearch();
        if (this.drawType == "管线") {
          this.$bus.emit("addMapLine", this._GData);
        } else if (this.drawType == "其他") {
          this.$bus.emit("addMapPoint", this._GData);
        }
      }
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
    //缓冲区查询事件
    bufferSearch() {
      this.loading = true;
      if (this.layerDataValue == "all") {
        this.layerListName = "all";
      } else {
        this.layerListName = FeatureLayerOperation.getLayerFeatureByName(
          this.layerDataValue
        ).listViewColumn;
      }
      if (this.drawType && this._GData) {
        this.allBufferSearch();
        return;
      }
      if (this.layerDataValue == "all") {
        let taskList = [];
        let eachLayerData = this.eachLayer;
        _.forEach(eachLayerData, (ele, index) => {
          let queryTask = new Promise((resolve, reject) => {
            this.onSearch(ele.value, res => {
              _.forEach(res, item => {
                item.allType = ele.label;
                item.allTypeValue = ele.value;
              });
              resolve(res);
            });
          });
          taskList.push(queryTask);
        });
        Promise.all(taskList)
          .then(result => {
            this.loading = false;
            this.columnListData = result.flat();
          })
          .catch(err => {
            console.log("search全部查询部分", err);
          });
      } else {
        this.onSearch();
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
    //导出表格
    exportExcel() {
      let exportName;
      _.some(this.bufferData, group => {
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
      ExportExcel("div .outDataSerchExcel", exportName + " - 缓冲区查询");
    },
    //获取全部查询所需的图层
    getEachLayer() {
      let eachData = [];
      if (this.layerGroupLen > 1) {
        eachData = [];
        _.forEach(this.seniorData, group => {
          _.forEach(group.children, item => {
            if (this.groupLayerDataValue[0] == group.value) {
              if (_.indexOf(eachData, item.value) < 0) {
                eachData.push({
                  value: item.value,
                  label: item.label,
                  layerType: item.type
                });
              }
            }
          });
        });
      } else {
        eachData = _.map(this.seniorData, item => {
          return {
            value: item.value,
            label: item.label,
            layerType: item.type
          };
        });
      }
      return eachData; //所有的图层
    },
    //图层下拉选择
    onLayerSelectChange(objvalue) {
      this.activeItem = FeatureLayerOperation.getLayerFeatureByName(
        this.layerDataValue
      );
      //设置选中列的前端列表控件列
      this.columnListData = "";
      //this.bufferSearch();
    },
    onSearch(layer, callBack) {
      this.loading = true;
      layer = _.isObject(layer) ? undefined : layer;
      this.MapDataSearch("1=1", layer, callBack);
    },
    //调用数据查询和高级空间查询接口
    MapDataSearch(whereGIScondition, layer, callBack) {
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
        }
      );
    }
  }
};
</script>
<style lang="stylus">
.buffer-popover.el-popover {
  padding: 0;
  border-radius: 2px;
  background: #2a2d33;
  border: solid 1px #565b66;
  height: 30px;
  padding-left: 10px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.43);

  .choose-Icon-shape {
    span {
      color: #cdd3d7;
      line-height: 30px;
      cursor: pointer;
      height: 30px;
      display: inline-block;
    }

    svg {
      line-height: 30px;
      cursor: pointer;
      width: 30px;
      height: 30px;
      text-align: center;
      display: inline-block;
      vertical-align: middle;

      &:hover {
        background: #354256;
        color: #fff;
      }
    }

    .iconfont {
      display: inline-block;
    }
  }

  .popper__arrow {
    border-bottom-color: #565b66;

    &:after {
      border-bottom-color: #2a2d33;
    }
  }
}
</style>

