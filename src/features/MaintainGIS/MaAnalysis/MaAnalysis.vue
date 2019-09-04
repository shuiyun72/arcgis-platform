<template>
  <div class="MaintainGIS table_style" :class="{flexible:flexible}">
    <TableFormTitle :titleName="titleName" :flexible.sync="flexible"></TableFormTitle>
    <el-form size="small">
      <!-- 上报时间 -->
      <date-btn-choose 
        @controlTableHeight ="controlTableHeight"
        @DateBtn="SubmitTime"  
        :dataSpan="10"
      ></date-btn-choose>
    </el-form>
    <el-row>
      <el-col :span="12" class="chart-col">
        <div class="charWraper job2" style="height:36vh"></div>
        <resize-observer @notify="handleResize" />
      </el-col>
      <el-col :span="12" class="chart-col">
        <div class="charWraper job1" style="height:36vh"></div>
        <resize-observer @notify="handleResize" />
      </el-col>
    </el-row>
    <el-row  class="table-flex-wraper">
      <el-table
        :data="getData"
        stripe
        border
        :height="tableHeight"
        highlight-current-row
      >
        <el-table-column
          v-for="column in columnList"
          :key="column.text"
          :prop="column.field"
          :label="column.text"
          :width="column.width"
          :align ="column.align"
        ></el-table-column>
      </el-table>
      <el-pagination
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page.sync="currentPageNumber"
        :page-sizes="[50,100, 200]"
        :page-size="currentPageSize"
        :pager-count="5"
        layout=" sizes, prev, next, jumper"
        :total="squareQueryTotal"
      ></el-pagination>
    </el-row>
  </div>
</template>
<script>
import axios from "axios";
import _ from "lodash";
import * as TableData from "@common/consts/maintain-table.js";
import echarts from "echarts";
//公共组件
// import DateBtnChoose from "./DateBtnChoose";
import DateBtnChoose from "@features/InspectionGIS/components/DateBtnChoose";
import TableFormTitle from "@common/components/TableFormTitle";

import { ChartBarZoom, ChartBrokenLine, ChartBarGIS } from "@util/echart";
export default {
  components: {
    DateBtnChoose,
    TableFormTitle
  },
  data() {
    return {
      squareQueryTotal:2,
      flexible: false, //是否收缩左侧表格
      titleName: "事件趁势分析",
      getData: [
        { 2: "1", 3: "10" },
        { 2: "10", 3: "102" },
        { 2: "15", 3: "102" },
        { 2: "16", 3: "102" },
        { 2: "154", 3: "120" },
        { 2: "11", 3: "120" }
      ],
      columnList: [],
      //关系比较数组
      mathData: [],
      SubmitStartTime: "",
      SubmitEndTime: "",
      // 分页相关
      currentPageNumber: 1,
      currentPageSize: 50,
      chartBarZoom: _.cloneDeep(ChartBarGIS),
      chartBrokenLine: null,
      tableHeight:'calc(100vh - 552px)',
      chartBar:null,//两个图表便于引用resize
      chartBrokenLine:null,

    };
  },
  created() {
    //初始化数据
    this.init();
  },
  mounted() {
    //图表显示
    this.gtCharInitGauge();
  },

  methods: {
    handleResize () {
      if( this.chartBar &&  this.chartBrokenLine){
        this.chartBar.resize()
        this.chartLine.resize()
      }      
    },
    controlTableHeight(state){
      console.log(state)
      if(state){
        this.tableHeight ='calc(100vh - 582px)'
      }else{
        this.tableHeight ='calc(100vh - 552px)'
      }
    },
    //初始化
    init() {
      this.squareQueryTotal = this.getData.length
      this.columnList = TableData.Mai_Analysis_Columns;
    },
    gtCharInitGauge(chartBarZoomData, chartBrokenLineData) {
      //图表显示
      this.chartBarZoom.series[0].data = _.map(this.getData, "3");
      this.chartBarZoom.title.text = "柱状图展示";
      this.chartBarZoom.title.x = "left"
      this.chartBarZoom.title.top= 12
      this.chartBarZoom.title.textStyle =  {
            color: '#fff',
            fontWeight: 400,
            fontSize: 14,
            fontFamily: 'AdobeHeitiStd-Regular',
            letterSpacing: 0.7,
        }
      this.chartBarZoom.toolbox = null;
      this.chartBarZoom.xAxis[0].data = _.map(this.getData, "2");
      (this.chartBarZoom.grid = {
        top: "100px",
        left: "20px",
        right: "30px",
        bottom: "15",
        containLabel: true
      })
      this.chartBarZoom.legend.top = 14
      this.chartBarZoom.legend.right = 0
      this.chartBar = echarts.init(document.querySelector(".charWraper.job1"))
      this.chartBar.setOption(this.chartBarZoom);
      this.chartBrokenLine = _.cloneDeep(this.chartBarZoom),
      this.chartBrokenLine.title.text = "折线图展示";
      this.chartBrokenLine.series[0].type = "line";
      this.chartBrokenLine.series[0].data = _.map(this.getData, "3");
      this.chartBrokenLine.xAxis[0].data = _.map(this.getData, "2");
      this.chartLine = echarts.init(document.querySelector(".charWraper.job2"))
      this.chartLine.setOption(this.chartBrokenLine); 
    },
    // 分页相关
    onPageChange(objvalue) {
      this.currentPageNumber = objvalue;
    },
    //当前页数据变化
    onPageSizeChange(objvalue) {
      this.currentPageSize = objvalue;
    },
    //上报时间
    SubmitTime(startTime, endTime) {
      this.SubmitStartTime = startTime;
      this.SubmitEndTime = endTime;
      console.log(startTime + " " + endTime);
    }
  }
};
</script>