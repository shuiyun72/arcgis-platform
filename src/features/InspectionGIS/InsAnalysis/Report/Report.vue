<template>
  <div class="table_style InsAnalysis w700" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'上报分析'" :flexible.sync="flexible"></TableFormTitle>
    <el-form>
      <date-btn-choose
      @DateBtn="GetData"
      :dataSpanPosition ="'relative'"
      :spanNum="12"
      :dataLeft="'0'"
      :dataTop="'0px'"
      :dataSpan="9"
    ></date-btn-choose>
    </el-form>
    
    <el-row>
      <el-col span="12" class="chart-col">
        <div class="charWraper lineLeft" style="height:36vh"></div>
        <resize-observer @notify="handleResize"/>
      </el-col>
      <el-col span="12" class="chart-col">
        <div class="charWraper barRight" style="height:36vh"></div>
        <resize-observer @notify="handleResize"/>
      </el-col>
    </el-row>
    <InsTable
      style="margin-bottom: 10px;"
      :layerListName="'Ins_ReportAnalysis_Columns'"
      :tableHeight="'calc(100vh - 525px)'"
      :columnListData="squareQueryRawTableData"
      :loading.sync="loading"
      :layeName="'InsAnalysis'"
    ></InsTable>
  </div>
</template>
<script>
import _ from "lodash";
import INSMethod from "@api/Inspection/InspectionStatistics";
import echarts from "echarts";
import { ChartPieGIS, ChartBarGIS } from "@util/echart";
import DateBtnChoose from "@features/InspectionGIS/components/DateBtnChoose";
import TableFormTitle from "@common/components/TableFormTitle";
import InsTable from "@features/InspectionGIS/components/InsTable"
export default {
   components: {
    DateBtnChoose,
    TableFormTitle,
    InsTable
  },
  data() {
    return {
      loading:false,
      flexible:false,//是否收缩左侧表格
      squareQueryRawTableData: [], //搜索结果数据
      timeArray: [],
      timeList: [
        {
          text: "全部",
          value: "all"
        },
        {
          text: "本日",
          value: "today"
        },
        {
          text: "本周",
          value: "thisWeek"
        },
        {
          text: "本月",
          value: "thisMonth"
        },
        {
          text: "自定义",
          value: "custom"
        }
      ],
      timeListValue: "",
      chartPie:null,//圆形图标便于resize
      chartBar:null,
    };
  },
  mounted() {},
  created() {
    this.onLoadData();
    this.GetData();
  },
  methods: {
    handleResize(){
      if(this.chartPie && this.chartBar ){
        this.chartPie.resize()
        this.chartBar.resize()
      }
    },
    onLoadData() {
      this.timeListValue = this.timeList[0].value;
    },
    GetData(_startTime, _endTime) {
      this.loading = true;
      INSMethod.reportAnalysis(_startTime, _endTime).then(res => {
        this.loading = false;
        this.squareQueryRawTableData = res.data.Data.Result;
        this.chartPieInit();
      });
    },
    typeChoose(item, type) {
      this[type] = item;
      this.GetData();
    },
    chartPieInit() {
      let chartPie = _.cloneDeep(ChartPieGIS);
      chartPie.title.x = "left";
      chartPie.title.top = 12;
      chartPie.title.textStyle = {
        color: "#fff",
        fontWeight: 400,
        fontSize: 14,
        fontFamily: "AdobeHeitiStd-Regular",
        letterSpacing: 0.7
      };
      // chartPie.legend.data = _.map(this.squareQueryRawTableData, item => {
      //     return {
      //       icon:"circle",
      //       name:item.PersonName
      //     };
      //   })
      // (chartPie.legend = {
      //   type: "scroll",
      //   orient: "horizontal",
      //   bottom: 20,
      //   left:10,
      //   right: 10,
      //   data: _.map(this.squareQueryRawTableData, item => {
      //     item.icon = "circle";
      //     item.name = item.PersonName;
      //     return item;
      //   }),
      //   textStyle: {
      //     color: "#fff"
      //   }
      // }),
      chartPie.toolbox = null
      chartPie.grid = {
        top: '40%',
        left: 0,
        right: 0,
        bottom: 0,
        containLabel: true
      };
      chartPie.tooltip = {
        formatter: "人员 ：{b} <br/> 数量 ： {c} ({d}%)"
      }
      chartPie.series[0].data = _.map(this.squareQueryRawTableData, item => {
        return {
          name: item.PersonName,
          value: item.ECount
        };
      });
      chartPie.title.text = "人员上报分析";
      this.chartPie = echarts.init(document.querySelector(".charWraper.barRight"))
      this.chartPie.setOption(chartPie);
      let chartBar = _.cloneDeep(ChartBarGIS);
      chartBar.title.x = "left";
      chartBar.title.top = 12;
      chartBar.title.textStyle = {
        color: "#fff",
        fontWeight: 400,
        fontSize: 14,
        fontFamily: "AdobeHeitiStd-Regular",
        letterSpacing: 0.7
      };
      chartBar.toolbox = null;
      (chartBar.grid = {
        top: "100px",
        left: "20px",
        right: "30px",
        bottom: "15",
        containLabel: true
      })
      chartBar.legend.top = 14;
      chartBar.legend.right = 0;
      chartBar.xAxis[0].data = _.map(this.squareQueryRawTableData, item => {
        return item.PersonName;
      });
      chartBar.xAxis[0].axisLabel = { rotate : 45 };
      chartBar.series[0].data = _.map(this.squareQueryRawTableData, item => {
        return item.ECount;
      });
      this.chartBar = echarts.init(document.querySelector(".charWraper.lineLeft"))
      this.chartBar.setOption(chartBar, true);
    }
  }
};
</script>

