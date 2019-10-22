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
      <!-- <el-table-column
          v-for="column in columnList"
          :key="column.text"
          :prop="PersonName"
          :label="column.text"
          :width="column.width"
          :align ="column.align"
        ></el-table-column> -->
        <el-table-column
          :key="columnList[0].text"
          prop="PersonName"
          label="上报人员"
          :align ="columnList[0].align"
        ></el-table-column>
        <el-table-column
          :key="columnList[0].text"
          prop="ECount"
          label="上报事件次数"
          :align ="columnList[0].align"
        ></el-table-column>
      </el-table>
      <el-pagination
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page.sync="currentPageNumber"
        :page-sizes="[50,100, 200]"
        :page-size="currentPageSize"
        :pager-count="5"
        layout="total, sizes, prev, pager, next, jumper"
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
//柱状图 折线图
import EventManageForMaintain from "@api/Maintain/EventManageForMaintain";
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
      // 柱状
      getData: [
        { 2: "1", 3: "10" },
        { 2: "10", 3: "102" },
        { 2: "15", 3: "102" },
        { 2: "16", 3: "102" },
        { 2: "154", 3: "120" },
        { 2: "11", 3: "120" }
      ],
      // 柱状
      getBarData: [
        { 2: "1", 3: "10" },
        { 2: "10", 3: "102" },
        { 2: "15", 3: "102" },
        { 2: "16", 3: "102" },
        { 2: "154", 3: "120" },
        { 2: "11", 3: "120" }
      ],
      // 折线
      getLineData: [
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
      Xarr:[],//折线图x轴数据
    };
  },
  created() {
    //初始化数据
    this.init();
  },
  mounted() {
    //图表显示
    // this.gtCharInitGauge();
  },

  methods: {
    handleResize () {
      if( this.chartBar &&  this.chartBrokenLine){
        this.chartBar.resize()
        this.chartLine.resize()
      }      
    },
    controlTableHeight(state){
      if(state){
        this.tableHeight ='calc(100vh - 582px)'
      }else{
        this.tableHeight ='calc(100vh - 552px)'
      }
    },
    //初始化
    init() {
      this.getEventsBar();
      this.getEChatLine();
      this.GetEvents();
      this.columnList = TableData.Mai_Analysis_Columns;
    },
    gtCharInitGauge(chartBarZoomData, chartBrokenLineData) {
      // this.squareQueryTotal = 10;
      //图表显示
      this.chartBarZoom.series[0].data = _.map(this.getBarData, "ECount");
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
      this.chartBarZoom.xAxis[0].data = _.map(this.getBarData, "EventFromName");
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
      // this.chartBrokenLine.series[0].data = _.map(this.getLineData, "data");
      // this.chartBrokenLine.xAxis[0].data = _.map(this.getLineData, "Xarr");
      this.chartBrokenLine.series = this.getLineData.p3;
      this.chartBrokenLine.xAxis[0].data = this.Xarr;
      // 折线图去掉legend
      // this.chartBrokenLine.legend[0].data = [];
      this.chartLine = echarts.init(document.querySelector(".charWraper.job2"))
      this.chartBrokenLine.legend = null;
      this.chartLine.setOption(this.chartBrokenLine); 
    },
    // 分页相关
    onPageChange(objvalue) {
      this.currentPageNumber = objvalue;
      this.GetEvents();
    },
    //当前页数据变化
    onPageSizeChange(objvalue) {
      this.currentPageSize = objvalue;
      this.GetEvents();
    },
    //上报时间
    SubmitTime(startTime, endTime) {
      this.SubmitStartTime = startTime;
      this.SubmitEndTime = endTime;
      this.getEventsBar();
      this.getEChatLine();
      this.GetEvents();
    },
    // 获取柱状图数据
    getEventsBar(){
      EventManageForMaintain.EChatbar(this.SubmitStartTime,this.SubmitEndTime).then(res=>{
        let temp = JSON.stringify(res.data.Data.Result);
        this.getBarData = JSON.parse(temp);
        this.gtCharInitGauge();
      })
    },
    // 获取折线图数据
    getEChatLine(){
      EventManageForMaintain.EChatLine(this.SubmitStartTime,this.SubmitEndTime).then(res=>{
        let temp = JSON.stringify(res.data.Data.Result);
        this.getLineData = JSON.parse(temp);
        _.each(this.getLineData.p3,(res,index)=>{
          if(res.name == "接电上报"){
            this.getLineData.p3[index] = _.assign({},{color:"#3088c2"},res)
          }
        })
        // else if(res.name == "调度事件"){
        //     this.getLineData.p3[index] = _.assign({},{color:"#c23030"},res)
        //   }else if(res.name == "临时工作"){
        //     this.getLineData.p3[index] = _.assign({},{color:"#30b1c2"},res)
        //   }else if(res.name == "热线系统"){
        //     this.getLineData.p3[index] = _.assign({},{color:"#d27632"},res)
        //   }else if(res.name == "日常工作处理"){
        //     this.getLineData.p3[index] = _.assign({},{color:"#30c27e"},res)
        //   }else if(res.name == "巡检上报"){
        //     this.getLineData.p3[index] = _.assign({},{color:"#c2b230"},res)
        //   }
        this.Xarr = this.getLineData.p1.split(',');
        this.gtCharInitGauge();
      })
    },
    // 获取数据表格
    GetEvents(){
      let sort = "PersonName";
      let ordering = "desc";
      let num = this.currentPageSize;
      let page = this.currentPageNumber;
      EventManageForMaintain.GetEvents(this.SubmitStartTime,this.SubmitEndTime,sort,ordering,num,page).then(res=>{
        let temp = JSON.stringify(res.data.Data.Result);
        this.getData = JSON.parse(temp);
        this.squareQueryTotal = res.data.Data.TotalRows
      })
    }
  }
};
</script>