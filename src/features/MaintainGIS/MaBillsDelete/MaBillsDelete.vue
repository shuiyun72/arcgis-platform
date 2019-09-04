<template>
  <div class="MaintainGIS table_style" :class="{flexible:flexible}">
      <TableFormTitle 
        :titleName = "titleName" 
        :flexible.sync="flexible"></TableFormTitle>
      <el-form size="small" label-width="76px">
         <!-- 上报时间 -->
        <date-btn-choose @DateBtn="SubmitTime" 
        :spanNum ='12'
        :dataSpan = 8
         ref="dateBtnChoose"></date-btn-choose>
         <!-- 事件状态 -->
        <ma-plc-status @nowStatus="nowStatus" ref="maPlcStatus"></ma-plc-status>
         <!-- 条件查询 -->
        <ma-plc-search 
          @maPlcSearch="maPlcSearch"
          @resetSearchBTn="resetSearchBTn"
          @deleteSearchBTn="deleteSearchBTn"
        ></ma-plc-search>
      </el-form>
       <!-- 公用table -->
      <main-tain-table  
        :entrustData="entrustData"
        :columnList="columnList"
        :maPlcTableH="maPlcTableH"
        :handleBtn="true"
        @detailBtn="detailBtn"
        @tableClick="tableClick"
        @tableDbClick="tableDbClick"
      ></main-tain-table>
    <!-- 弹窗 -->
    <!-- <el-dialog
      :visible.sync="centerDialogVisible"
      width="98%"
      custom-class="order_detail_dialog merge_rows_table"
      title="工单详情"
      center
      >
      <div class="status_nav step_hidden_left_title clearfix">
        <div class="left header_title">
          <em></em>处理状态
        </div>
        <el-steps active="2" simple>
          <el-step v-for="item in FlowPath" :key="item" :title="item"></el-step>
        </el-steps>
      </div>
      <el-tabs v-model="DialogTab" type="card" @tab-click="changeDialog">
        <el-tab-pane label="工单处理信息" name="first" class="event_order_pane">
          <dialog-report></dialog-report>
          <dialog-dispose :TitleName="'处理'"></dialog-dispose>
          <dialog-dispose :TitleName="'分派'"></dialog-dispose>
          <dialog-dispose :TitleName="'接受'"></dialog-dispose>
          <dialog-dispose :TitleName="'到场'"></dialog-dispose>
          <dialog-dispose :TitleName="'处置'"></dialog-dispose>
          <dialog-dispose :TitleName="'完工'"></dialog-dispose>
          <dialog-dispose :TitleName="'审核'"></dialog-dispose>
        </el-tab-pane>
        <el-tab-pane label="处理位置" name="third">12312121212</el-tab-pane>
      </el-tabs>
    </el-dialog> -->
    <detailDialog :centerDialogVisible.sync = "centerDialogVisible" :currentRow="currentRow"></detailDialog>
  </div>
</template>
<script>
import axios from "axios";
import _ from "lodash";

import * as disposeData from "../components/config.js";
import * as TableData from "@common/consts/maintain-table.js";


//公共组件
// import DateBtnChoose from "@common/components/DateBtnChoose";
import DateBtnChoose from "@features/InspectionGIS/components/DateBtnChoose";
import MaPlcStatus from "../components/MaPlcStatus";
import MaPlcSearch from "../components/MaPlcSearch";
import MainTainTable from "../components/MainTainTable";
import TableFormTitle from "@common/components/TableFormTitle";
//弹窗组件
import detailDialog from "../components/detailDialog";
//Api
import MaStatus from "@api/Maintain/GetStatusForMantain";

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
      currentRow:undefined,     //选中行信息
      titleName:"工单作废",
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
    //删除工单
    deleteSearchBTn(){
      if(this.currentRow){
        this.$confirm("确认删除工单？")
        .then(_ => {
          this.$message({
            type: "success",
            message: "删除成功！"
          });
        })
        .catch(_ => {
          this.$message({
            type: "info",
            message: "已取消删除！"
          });
        });
      }else{  
        this.$message({
          type: "error",
          message: "请选择要删除的工单"
        });
      }
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