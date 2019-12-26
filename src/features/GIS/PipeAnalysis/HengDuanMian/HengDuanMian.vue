<template>
  <div class="formItem hdm-wraper table_style w700" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'横断面分析'" :flexible.sync="flexible"></TableFormTitle>

    <el-form label-width="100px" label-position="right" size="mini">
      <el-row class="tab-btn-wraper">
        <AnalysisSelect
          :btnMessage="{text:'选择横断面',icon:'icon-mian',type:'warning'}"
          v-if="$options.filters.btnTree('choose' ,$route.name)"
          :layerData="layerData"
          :selectLayerValue.sync="selectLayerValue"
          :listViewColumn.sync="listViewColumn"
          @searchFnc="selectTransection"
        ></AnalysisSelect>
        <template v-for="item in btnList">
          <el-button
            size="mini"
            :key="item.text"
            :class="item.class"
            @click="btnChange(item.text)"
            v-if="$options.filters.btnTree(item.model ,$route.name)"
          >
            <i class="iconfont" :class="item.icon"></i>
            {{item.text}}
          </el-button>
        </template>
      </el-row>
    </el-form>
    <el-row class="tab-wraper">
      <el-tabs v-model="tabActiveName" type="card">
        <el-tab-pane label="数据图表" name="first" class="chart-tab">
          <el-scrollbar style="height: calc(100vh - 256px);" v-loading="loading">
            <div class="my-chart" style="height: 400px; width:600px;background: #fff;"></div>
            <div class="my-table">
              <div class="my-line">
                <div v-for="item in layerListName" :key="item.text" class="my-cell"></div>
              </div>
              <div class="my-thead">
                <div v-for="item in layerListName" :key="item.text" class="my-cell">{{item.text}}</div>
              </div>
              <div class="my-tbody">
                <div
                  v-for="item in TransectionTotal"
                  :key="item"
                  class="my-tr"
                  :style="{width: 1/TransectionDataLen * 100 + '%'}"
                >
                  <div class="my-cell" v-for="clum in layerListName" :key="clum.text">
                    <span>{{item[clum.field]}}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="数据列表" name="second">
          <GisTable
            :loading="loading"
            :tableHeight="`calc(100vh - 299px)`"
            @TableRowClick="onPipeRowClick"
            :layerListName="listViewColumn"
            :columnListData="TransectionTotal"
          ></GisTable>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>
<script>
import _ from "lodash";
import echarts from "echarts";
import { E_hd_Columns } from "@common/consts/GisConst/GisTableColumn";
import SpatialSearch from "@api/GIS/SpatialSearch";
import { debug } from "util";
import { ExportExcel, FixFloat } from "@util";
import {
  LayerType,
  FeatureLayerOperation,
  MapConfigure
} from "@common/consts/GisConst/MapConfigure";
import MapDataOperation from "@services/ArcMap/MapDataOperation";
import AnalysisSelect from "@features/GIS/components/AnalysisSelect";
import GisTable from "@features/GIS/components/GisTable";
import TableFormTitle from "@common/components/TableFormTitle";
export default {
  components: {
    AnalysisSelect,
    GisTable,
    TableFormTitle
  },
  created() {
    this.loadData();
    this._MapDataOperation = new MapDataOperation();
    this._MapDataOperation.init().then(() => {});
  },
  mounted() {
    this.myChart = echarts.init(document.querySelector(".my-chart"));
    this.chartInit();
  },
  beforeDestroy() {
    this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
    this.$bus.emit("clearGraphics"); //取消绘制方法
  },
  data() {
    return {
      myChart: "", //图表对象
      listViewColumn: "", //表格表头
      ContourList: null, //高程数组列表
      layerListName: E_hd_Columns,
      flexible: false, //是否收缩左侧表格
      tabActiveName: "first", //tab选中值
      Gdata: null,
      selectLayerValue: [], //选中图层
      layerData: [], //图层集合
      loading: false,
      ChartImgUrl: "",
      TransectionTotal: [],
      TransectionData: null,
      TransectionDataLen: 10,
      btnList: [
        // {
        //   text: "选择横断面",
        //   icon: "icon-mian"
        // },
        // {
        //   text: "分析结果",
        //   icon: "icon-analyzefenxi"
        // },

        {
          text: "导出",
          class: "my-export",
          model: "export"
        },
        {
          text: "清除",
          class: "my-clean",
          model: "clear"
        }
      ]
    };
  },
  methods: {
    //调用数据查询和高级空间查询接口 高程数据
    MapDataSearch(callBack) {
      this.loading = true;
      let pipeURL = MapConfigure.SpatialAnalysisURL.dgxService;
      //let pipeURL = FeatureLayerOperation.getLayerURLByName(this.selectLayerValue[1]);
      this._MapDataOperation.featureQuery(
        this.Gdata,
        "",
        pipeURL,
        resultValue => {
          resultValue = _.map(resultValue, objValue => {
            return objValue.attributes.Contour;
          });
          this.ContourList = resultValue;
          this.TransectionSearchFuc();
        }
      );
    },
    chartInit() {
      let lineData = _.map(this.TransectionTotal, item => {
        return Number(item.caliber);
      });
      let lineDataMax = _.max(lineData);
      let XData = [];
      _.forEach(this.TransectionTotal, (item, index) => {
        XData.push(index);
      });
      //  if(lineData.length > 6){
      //    lineData.split(0,7)
      //  }
      this.TransectionDataLen = lineData.length > 10 ? lineData.length : 10;
      let option = {
        color: ["#03B700"],
        backgroundColor: "#fff",
        grid: {
          bottom: 0,
          right: 21,
          left: 70
        },
        xAxis: [
          {
            boundaryGap: false,
            data: XData,
            max: this.TransectionDataLen - 1,
            min: -1,
            interval: 1,
            axisLabel: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#000"
              }
            }
          },
          {
            boundaryGap: false,
            data: this.ContourList,
            show: false,
            axisLabel: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#000"
              }
            }
          }
        ],
        yAxis: [
          {
            silent: true,
            show: false,
            splitLine: { show: false },
            axisLine: {
              lineStyle: {
                color: "#000"
              }
            }
          },
          {
            nameLocation: "start",
            silent: true,
            splitLine: { show: false },
            position: "left",
            axisLine: {
              lineStyle: {
                color: "#000"
              }
            },
            max: function(value) {
              return value.max + 20;
            }
          }
        ],
        series: [
          {
            name: "linePoint",
            type: "line",
            smooth: true,
            showAllSymbol: true,
            symbol: "circle",
            lineStyle: {
              width: false
            },
            symbolSize: (value, params) => {
              return (value / lineDataMax) * 13 + 2;
            },
            data: lineData
          },
          {
            name: "line",
            barCategoryGap: "10px",
            type: "bar",
            barGap: "-100%",
            barWidth: "1px",
            itemStyle: {
              normal: {
                color: "#000"
              }
            },
            z: -12,
            data: lineData
          },
          {
            name: "dotted",
            type: "pictorialBar",
            symbol: "rect",
            itemStyle: {
              normal: {
                color: "#fff"
              }
            },
            symbolRepeat: true,
            symbolSize: [12, 2],
            symbolMargin: 1,
            z: -10,
            data: lineData
          },
          {
            name: "line",
            type: "line",
            barGap: "-100%",
            lineStyle: {
              width: 1
            },
            xAxisIndex: 1,
            yAxisIndex: 1,
            showSymbol: false,
            itemStyle: {
              color: "#000"
            },
            z: 3,
            data: this.ContourList
          }
        ]
      };
      this.myChart.setOption(option, true);
      this.myChart.off("click");
      this.myChart.on("click", params => {
        if (params.seriesName === "linePoint") {
          this.onPipeRowClick(this.TransectionTotal[params.dataIndex]);
        }
      });
    },
    onPipeRowClick(row, column, event) {
      this.$bus.emit(
        "setMapLocation",
        row.OBJECTID,
        this.selectLayerValue[1],
        resultValue => {
          console.log(resultValue);
          // this.RemoveData =
        }
      );
    },
    loadData() {
      this.layerData = FeatureLayerOperation.getLayer(LayerType.PipeTypeNO);
      this.selectLayerValue.push(this.layerData[0].id);
      this.selectLayerValue.push(this.layerData[0].children[0].id);
      this.listViewColumn = this.layerData[0].children[0].listViewColumn;
    },
    btnChange(val) {
      switch (val) {
        case "清除":
          this.clearFireAnalysis();
          break;
        case "导出":
          this.exportExcel();
      }
    },
    exportExcel() {
      ExportExcel("div .exportTable", "横断面分析");
    },
    selectTransection() {
      //获取地图上画线的空间数据
      if (this.TransectionTotal.length) {
        this.TransectionTotal = [];
        this.ContourList = [];
        this.chartInit();
        this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
      }
      this.$bus.emit("getMapLine", resultValue => {
        this.Gdata = resultValue;
        //通过空间数据信息，获取管网数据列表
        this.MapDataSearch();
      });
    },
    TransectionSearchFuc() {
      //通过空间数据信息，获取管网数据列表
      this.$bus.emit(
        "lineAnalysis",
        this.selectLayerValue[1],
        this.Gdata,
        objectValue => {
          objectValue = FixFloat(objectValue);
          this.TransectionTotal = objectValue;
          this.chartInit();
          this.TransectionData = _.map(objectValue, currentValue => {
            return {
              OBJECTID: currentValue.OBJECTID,
              length: currentValue.length,
              caliber: currentValue.caliber,
              startingpoint_depth: 12, //currentValue.startingpoint_depth,
              startingpoint_elevation: currentValue.startingpoint_elevation
            };
          });
          this.loading = false;
          if (!this.TransectionData.length) {
            this.$message({
              type: "warning",
              message: "此范围没有数据",
              showClose: true
            });
          }
        }
      );
    },
    clearFireAnalysis() {
      this.ChartImgUrl = "";
      this.TransectionData = null;
      this.TransectionTotal = [];
      this.ContourList = [];
      this.chartInit();
      this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
      this.$bus.emit("clearGraphics"); //取消绘制方法
    }
  }
};
</script>