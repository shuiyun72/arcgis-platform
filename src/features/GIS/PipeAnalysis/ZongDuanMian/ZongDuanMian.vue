<template>
  <div class="formItem table_style w700" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'纵断面分析'" :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="100px" label-position="right" size="mini">
      <el-row class="tab-btn-wraper">
        <AnalysisSelect
          :btnMessage="{text:'选择管点',icon:'icon-dingwei',type:'warning'}"
          :layerData="layerData"
          :selectLayerValue.sync="selectLayerValue"
          v-if="$options.filters.btnTree('choose' ,$route.meta.iFunID)"
          :listViewColumn.sync="listViewColumn"
          @searchFnc="choosePipe"
        ></AnalysisSelect>
        <template v-for="item in btnList">
          <el-button
            size="mini"
            :key="item.text"
            :class="item.class"
            v-if="$options.filters.btnTree(item.model ,$route.meta.iFunID)"
            @click="btnChange(item.text)"
          >
            <i class="iconfont" :class="item.icon"></i>
            {{item.text}}
          </el-button>
        </template>

        <!-- <el-button size="mini" type="primary" class="iconfont icon-SWANfenxi">分析结果</el-button>
        <el-button size="mini" icon="el-icon-delete" type="primary">清除</el-button>-->
      </el-row>
    </el-form>
    <el-row class="tab-wraper">
      <el-tabs v-model="tabActiveName" type="card">
        <el-tab-pane label="数据图表" name="first" class="chart-tab">
          <el-scrollbar style="height: calc(100vh - 256px);"  v-loading="loading">
            <div class="my-chart" style="height: 400px; width:600px;"></div>
            <div class="my-table">
              <div class="my-line">
                <div v-for="item in layerListName" :key="item.text" class="my-cell"></div>
              </div>
              <div class="my-thead">
                <div v-for="item in layerListName" :key="item.text" class="my-cell">{{item.text}}</div>
              </div>
              <div class="my-tbody">
                <div
                  v-for="item in tableLayerData"
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
            @TableRowClick="onTableRowClick"
            :layerListName="listViewColumn"
            :columnListData="ConnectedDataTotal"
          ></GisTable>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <!-- <GisTable
      :loading = "loading"
      :tableHeight ="`calc(100vh - 638px)`"
      @TableRowClick = "onTableRowClick"
      :layerListName = "`ZongDuanMian_Columns`"
      :columnListData = "ConnectedDataTotal"
    ></GisTable>
    <div style="height:400px;" class="chatWraper"></div>-->
  </div>
</template>
<script>
import _ from "lodash";
import {
  ZongDuanMian_Columns,
  E_zd_Columns
} from "@common/consts/GisConst/GisTableColumn";
import { ExportExcel, FixFloat } from "@util";
import MapDataOperation from "@services/ArcMap/MapDataOperation"; //空间数据查询
import {
  FeatureLayerOperation,
  LayerType,
  MapConfigure
} from "@common/consts/GisConst/MapConfigure";
import AnalysisSelect from "@features/GIS/components/AnalysisSelect";
import { ChartBar } from "@util/echart";
import echarts from "echarts";
import GisTable from "@features/GIS/components/GisTable";
import TableFormTitle from "@common/components/TableFormTitle";

export default {
  components: {
    AnalysisSelect,
    GisTable,
    TableFormTitle
  },
  data() {
    return {
      loading:false,
      listViewColumn:'',//表格表头
      layerListName: E_zd_Columns,
      tabActiveName: "first", //tab选中值
      flexible: false, //是否收缩左侧表格
      chartVariable: null,
      gpJoinAnalysisData: [],
      selectLayerValue: [], //选中图层
      layerData: [], //图层集合
      ConnectedDataTotal: [],
      btnList: [
        // {
        //   text: "选择管点",
        //   icon: "icon-dingwei"
        // },
        // {
        //   text: "分析结果",
        //   icon: "icon-analyzefenxi"
        // },
        {
          text: "导出",
          class: "my-export",
          model:'export'
        },
        {
          text: "清除",
          class: "my-clean",
          model:'clear'
        }
      ],
      ContourList: [], //高程数据
      tableLayerData: [], //图数据
      TransectionDataLen: 10, //表个数
      TransectionDataLen: [] //图个数
    };
  },
  created() {
    this.loadData();
  },
  mounted() {
    this._MapDataOperation = new MapDataOperation();
    this._MapDataOperation.init(); //初始化
    this.chartInit();
  },
  beforeDestroy() {
    this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
    this.$bus.emit("clearGraphics"); //取消绘制方法
  },
  methods: {
    //调用数据查询和高级空间查询接口
    MapDataSearch(Gdata, finish) {
      let pipeURL = MapConfigure.SpatialAnalysisURL.dgxService;
      //let pipeURL = FeatureLayerOperation.getLayerURLByName(this.selectLayerValue[1]);
      this._MapDataOperation.featureQuery(Gdata, "", pipeURL, resultValue => {
        this.ContourList = _.map(resultValue, objValue => {
          return objValue.attributes.Contour;
        });
        this.MapFeatureQueryTask(Gdata);
      });
    },
    MapFeatureQueryTask(_GData) {
      this.$bus.emit(
        "featureQueryTask",
        _GData,
        res => {
          let layerData = [];
          _.forEach(res, item => {
            if (
              item.layerData.length &&
              item.layerType !== LayerType.PipeTypeNO
            ) {
              layerData.push(...item.layerData);
            }
          });
          this.tableLayerData = _.map(layerData, "attributes");
          let ConnectedDataTotal = _.cloneDeep(this.ConnectedDataTotal);
          _.forEach(ConnectedDataTotal, item => {
            item.equipment_type = "管线";
            item.SHAPE_Length = item["length"];
          });
          this.tableLayerData.unshift(...ConnectedDataTotal);
          console.log(this.tableLayerData);
          this.chartInit();
        },
        0.1
      );
    },
    chartInit() {
      let ContourList = this.ContourList[0] || 80;
      let lineData = _.map(this.tableLayerData, item => {
        return item.startingpoint_elevation;
      });

      let lineDataMax = _.max(lineData);
      let XData = [];
      _.forEach(this.tableLayerData, (item, index) => {
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
            name: "line",
            type: "line",
            smooth: true,
            animation:false,
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
            animation:false,
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
            animation:false,
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
            animation:false,
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
      echarts.init(document.querySelector(".my-chart")).setOption(option, true);
    },
    loadData() {
      this.layerData = FeatureLayerOperation.getLayer(LayerType.PipeTypeNO);
      this.selectLayerValue.push(this.layerData[0].id);
      this.selectLayerValue.push(this.layerData[0].children[0].id);
      this.listViewColumn = this.layerData[0].children[0].listViewColumn
      // this.layerData =[{children:[]}]
      // console.log(layerData)
      // _.forEach(layerData , group  => {
      //   group.children[0].label = group.label
      //   this.layerData[0].children.push(...group.children)
      // })
    },
    pipeKPI_TagChoose(id) {
      this.tagActive = id;
    },
    btnChange(val) {
      switch (val) {
        case "导出":
          this.exportExcel();
          break;
        case "清除":
          this.clearResult();
          break;
        default:
          break;
      }
    },
    choosePipe() {
      if (this.gpJoinAnalysisData) {
        this.$bus.emit("clearGDataLayer");
      }
      this.$bus.emit("gpJoinAnalysis", ResultValue => {
        this.loading = true;
        this._MapDataOperation.gpJoinAnalysis(
          ResultValue,
          this.selectLayerValue[1], //图层名称
          this.selectLayerValue[0], //图层分组名称
          GPResult => {
            this.loading = false;
            this.gpJoinAnalysisData = GPResult;
            console.log(GPResult);
            //获取数据
            if (GPResult.length > 0) {
              this.ConnectivitySearchFnc();
            } else {
              this.$message({
                type: "warning",
                message: "两点之间没有连通的管线",
                showClose: true
              });
            }
          }
        );
      });
    },
    ConnectivitySearchFnc() {
      this.$bus.emit("pipeLineView", this.gpJoinAnalysisData[0]); //高亮管线
      let ConnectedDataTotal = _.map(this.gpJoinAnalysisData[0], "attributes");
      let geometry = _.map(this.gpJoinAnalysisData[0], "geometry");
      this.ContourList = [];
      let geometrylen = geometry.length;
      //_.forEach(geometry,(Gdata , index) => this.MapDataSearch(Gdata,index === geometrylen-1))
      let GdataAll = geometry[0];
      _.forEach(geometry, (Gdata, index) => {
        GdataAll.paths[0].push(...Gdata.paths[0]);
      });
      this.MapDataSearch(GdataAll);
      console.log(GdataAll);
      //保留三位小数
      this.ConnectedDataTotal = FixFloat(ConnectedDataTotal);
    },
    clearResult() {
      this.ConnectedDataTotal = [];
      this.tableLayerData = [];
      this.gpJoinAnalysisData = [];
      this.ContourList = [];
      this.chartInit();
      //this.chartVariable && this.chartVariable.clear();
      this.$bus.emit("clearGDataLayer");
      this.$bus.emit("clearGraphics"); //取消绘制方法
    },
    exportExcel() {
      ExportExcel("div .exportTable", "纵断面分析");
    },
    //点击选择事件
    onTableRowClick(row, column, event) {
      this.$bus.emit(
        "setMapLocation",
        { PID: row.PID },
        this.selectLayerValue[1],
        resultValue => {
          console.log(resultValue);
        }
      );
    }
  }
};
</script>


