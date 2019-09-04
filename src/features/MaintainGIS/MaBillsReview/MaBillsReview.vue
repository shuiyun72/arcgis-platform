<template>
  <div class="table_style MaintainGIS"  :class="{flexible:flexible}">
     <TableFormTitle 
        :titleName = "titleName" 
        :flexible.sync="flexible"></TableFormTitle>
    <el-form size="small">
      <el-row  class="event_order" type="felx" justify="start">
          <el-button size="mini" class="my-tableout" @click="queryMsgBtn"><i class="iconfont icon-chakan"></i>查看
          </el-button>
          <el-button size="mini" class="my-tableout" @click="auditMsgBtn" ><i class="iconfont icon-shenhe"></i>审核
          </el-button>
      </el-row>
    </el-form>
    <!-- 公用table -->
    <main-tain-table
      :entrustData="entrustData"
      :columnList="columnList"
      @tableClick="tableClick"
      @tableDbClick="tableDbClick"
    ></main-tain-table>
  </div>
</template>
<script>
import _ from "lodash";
import axios from "axios";
import * as disposeData from "../components/config.js";
import * as TableData from "@common/consts/maintain-table.js";
import MainTainTable from "../components/MainTainTable";
import TableFormTitle from "@common/components/TableFormTitle";
export default {
  components: {
    MainTainTable,
    TableFormTitle
  },
  data() {
    return {
       flexible:false,//是否收缩左侧表格
      titleName: "工单审核",
      currentRow:undefined,
      columnList: [],
      entrustData: [] //代办数据
    };
  },
  created() {
    this.init();
  },
  methods: {
    //初始化
    init() {
      this.columnList = TableData.Mai_BillsReview_Columns;
      this.entrustData = {
        num: 1,
        page: 50,
        sum: 186,
        Result: disposeData.DataDispose
      };
    },
    //单击行
    tableClick(row){
      this.currentRow = row;
    },
    //双击行
    tableDbClick(row){
      this.currentRow = row;
    },
    //查看
    queryMsgBtn(){
      if(this.currentRow){
        console.log("查看")
      }else{  
        this.$message({
          type: "error",
          message: "请选择要查看的工单"
        });
      }
    },
    //审核
    auditMsgBtn(){
      if(this.currentRow){
        console.log("审核")
      }else{  
        this.$message({
          type: "error",
          message: "请选择要审核的工单"
        });
      }

    }
  }
};
</script>