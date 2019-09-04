<template>
  <div class="MaintainGIS table_style"  :class="{flexible:flexible}">
      <TableFormTitle 
        :titleName = "titleName" 
        :flexible.sync="flexible"></TableFormTitle>
      <el-form size="small" label-width="76px">
         <!-- 上报时间 -->
        <date-btn-choose @DateBtn="SubmitTime"  ref="dateBtnChoose"
        :dataSpan = 10
        ></date-btn-choose>
         <!-- 事件状态 -->
        <ma-plc-status @nowStatus="nowStatus" ref="maPlcStatus"></ma-plc-status>
         <!-- 条件查询 -->
        <ma-plc-search 
          @maPlcSearch="maPlcSearch"
          @resetSearchBTn="resetSearchBTn"
        ></ma-plc-search>
      </el-form>
       <!-- 公用table -->
      <main-tain-table  
        ref="table"
        :entrustData="entrustData"
        :columnList="columnList"
        :maPlcTableH="maPlcTableH"
        :handleBtn="true"
        @detailBtn="detailBtn"
        @tableClick="tableClick"
        @tableDbClick="tableDbClick"
      ></main-tain-table>
    <!-- 弹窗 -->
     <detailDialog :centerDialogVisible.sync = "centerDialogVisible" :currentRow="currentRow"></detailDialog>
  </div>
</template>
<script>
import axios from "axios";
import _ from "lodash";

import * as disposeData from "../components/config.js";
import * as TableData from "@common/consts/maintain-table.js";


//公共组件
import DateBtnChoose from "@features/InspectionGIS/components/DateBtnChoose";
//import DateBtnChoose from "@common/components/DateBtnChoose";
import MaPlcStatus from "../components/MaPlcStatus";
import MaPlcSearch from "../components/MaPlcSearch";
import MainTainTable from "../components/MainTainTable";
import TableFormTitle from "@common/components/TableFormTitle";
//弹窗组件
import detailDialog from "@features/MaintainGIS/components/detailDialog.vue";
//Api
import MaStatus from "@api/Maintain/GetStatusForMantain";
import MaApiStatus from "@api/Maintain/GetStatusForMantain";
export default {
 components: {
    DateBtnChoose,
    MaPlcStatus,
    MaPlcSearch,
    MainTainTable,
    TableFormTitle,
    detailDialog
  },
  data() {
    return {
      flexible:false,//是否收缩左侧表格
      currentRow:{},//选中行信息
      titleName:"事件工单",
      maPlcTableH:'calc(100vh - 330px)',
      labelWidth: "76px",
      centerDialogVisible: false, 
      resetTime:0,    //重置上报时间
      ReportTimeSelect: "全部",   
      SubmitStartTime: "",      //上报开始时间段
      SubmitEndTime: "",          //上报截止时间段
      nowStatusSt: "",     //事件状态
      eventSourceSelect:"",   //事件来源
      deptDataSelect:0 ,    //上报部门
      evevtTypeSelect:0 ,   //事件类型
      eventContentName:"",      //事件查找
      columnList: [],  
      entrustData:[]
    };
  },

  created() {
    //初始化数据
    this.init();
  },
  methods: {
    //初始化
    init() {
      this.colorList = ['#cd3e3e','#3289cc','#c67a3c','#2ca179','#3289cc','#3289cc','#cd3e3e','#c67a3c','#2ca179','#505761',]
      MaApiStatus.GetStatusForMantain().then(res => {
        this.FlowPath = res.data.Data.Result
        this.FlowPath.unshift({
          OperId: 11111,
          OperName: "上报",
          OperName2: "上报",
          rank: 11111
        })
        this.FlowPath.push({
          OperId: 999999,
          OperName: "完成",
          OperName2: "完成",
          rank: 999999
        })
        console.log(this.FlowPath)
      })
      this.columnList = TableData.Mai_EventBills_Columns;
      this.entrustData ={
        num:1,
        page:50,
        sum:186,
        Result:disposeData.DataDispose
      } 
      
    },   
    //是否显示详情弹窗
    detailBtn(row){
      this.currentRow = row;
      this.centerDialogVisible = true;
    },
    //切换数据/地图
    changeDialog(tab, event) {
      console.log(tab, event);
    },
    //上报时间组件
    SubmitTime(startTime, endTime) {
      this.SubmitStartTime = startTime;
      this.SubmitEndTime = endTime;
      console.log(startTime+" "+endTime)
      this.SubmitResult();
    },
    //事件状态组件
    nowStatus(item) {
      this.nowStatusSt = item;
      console.log(item)
      this.SubmitResult();
    },
    //事件状态组件传值
    maPlcSearch(source,dept,type,name,isSummit){
      console.log("查")
      this.eventSourceSelect = source ;   //事件来源
      this.deptDataSelect = dept ;    //上报部门
      this.evevtTypeSelect = type ;   //事件类型
      this.eventContentName = name ;      //事件查找
      if(isSummit){
        this.SubmitResult();
      }
    },
    //查询数据 
    SubmitResult(){
      console.log("查询数据,发送请求")
    },
    //重置
    resetSearchBTn(){
      this.eventSourceSelect = "" ;   //事件来源
      this.deptDataSelect = "" ;    //上报部门
      this.evevtTypeSelect = "" ;   //事件类型
      this.eventContentName = "" ; 
      this.nowStatusSt="全部";
      this.ReportTimeSelect="全部";
      this.$refs.dateBtnChoose.onLoadData();
      this.$refs.maPlcStatus.onLoadData();
      console.log("重置")
      this.init();
    },
    //单击行
    tableClick(row){
      this.currentRow = row;
    },
    //双击行
    tableDbClick(row){
      this.currentRow = row;
    }
  }
};
</script>