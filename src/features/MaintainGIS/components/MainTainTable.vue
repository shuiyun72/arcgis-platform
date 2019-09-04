<template>
<!-- <el-scrollbar class="table-scroll"> -->
  <!--合并表格-->
  <el-row  class="merge_rows_table table-flex-wraper">
    <div class="table-contain-wrapper complexTable">
    <el-table
      ref="mainTainTable"
      :data="newEntrustData"
      stripe
      border
      highlight-current-row
      :height="'100%'"
      :span-method="objectSpanMethod"
      :cell-style="objectColMethod"
      @current-change="currentChange"
      @cell-dblclick="tableDbClick"
      @row-click="tableClick"
      :row-class-name="tableRowClassName"
      >
      <el-table-column width="42px" fixed>
        <template slot-scope="scope">
          <div v-if="(scope.$index+1)%2 == 0" class="step_hidden_left_title">
            <el-steps :active="newEntrustData[(scope.$index-1)]['OperId']" simple v-if="handleBtn" class="table-state">
              <el-step v-for="( item , index ) in eventState.slice(0,newEntrustData[(scope.$index-1)]['OperId']-1)" :key="item" :title="item">
                <span class="teble-state-span" slot="title" :style="{color: '#fff' ,'background-color': (colorList[index])}">{{item.OperName}}</span>
              </el-step>
            </el-steps>
            <el-steps :active="newEntrustData[(scope.$index-1)]['OperId']" simple v-else class="table-state" >
              <template v-if="newEntrustData[(scope.$index-1)]['OperId'] != 11">
                <el-step v-for=" ( item , index ) in eventState" :key="item" :title="item.OperName" 
                :class="{normal:index > newEntrustData[(scope.$index-1)]['OperId']}" >
                <span class="teble-state-span" slot="title" :style="{color: '#fff' ,'background-color':( index <= (newEntrustData[(scope.$index-1)]['OperId'] - 1)? colorList[index] : '#505761')}">{{item.OperName}}</span>
                </el-step>
              </template>
              
              <template v-else>
                <el-step v-for=" ( item , index ) in eventState" :key="item" :title="item.OperName" 
                :class="{normal:index > newEntrustData[(scope.$index-1)]['OperId']}" >
                <span class="teble-state-span" slot="title" :style="{color: '#fff' ,'background-color':( index <= 0? colorList[index] : '#505761')}">{{item.OperName}}</span>
                </el-step>
              </template>
              
            </el-steps>
          </div>
          <div v-if="(scope.$index+1)%2 != 0">{{(scope.$index)/2 + 1}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="upTime" label="上报时间" fixed>
        <template slot-scope="scope"><span>{{scope.row['UpTime']}}</span></template>
      </el-table-column>
      <el-table-column label="操作" fixed width="60">
        <template slot-scope="scope">
          <span @click="detailBtn(scope.row)" class="my-detail">处理</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" fixed width="60">
        <template slot-scope="scope">
          <span @click="WorkorderInvalid(scope.row)" class="my-detail">{{scope.row.IsValid ? '作废' : '已作废'}}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        fit="true"
        v-for="column in columnList"
        :key="column.text"
        :prop="column.field"
        :label="column.text"
        :width="column.width"
      >
        <template slot-scope="scope">
          <span
          :style="{color:eventStatusFliter(scope.row[column.field])}"
          v-if="column.eventStatus"
          >{{column.eventStatus(scope.row)}}</span>
          <span v-else>{{scope.row[column.field]}}</span>
        </template>
      </el-table-column>
    </el-table>
    </div>
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
  <!-- </el-scrollbar> -->
</template>
<script>
import _ from "lodash";
//Api
import MaApiStatus from "@api/Maintain/GetStatusForMantain";
//事件查询
import EventManageForMaintain from "@api/Maintain/EventManageForMaintain";
import { ExportExcel } from "@util";

export default {
  components: {},
  props: {
    //接收到的全部数据 entrustData.Result  可得到data值
    entrustData: {
      fooMessage: Object
    },
     //需要显示的属性
    columnList: {
      fooMessage: Object,
      required: true
    },
  },
  data() {
    return {
      FlowPath: [
        //处理流程
        "处理",
        "分派",
        "接受",
        "到场",
        "处置",
        "完工",
        "审核"
      ],
      currentPageSize: 50,
      currentPageNumber: 1,
      squareQueryTotal: 0,
      eventState: [],//事件类型
      colorList:[],//颜色设置
    };
  },
  created() {
    this.init();
    this.$bus.on("ExportSearchBTn",this.ExportSearchBTn);
  },
  beforeDestroy(){
    this.$bus.off("ExportSearchBTn",this.ExportSearchBTn);
  },
  mounted() {
   
  },
  computed: {
    newEntrustData() {
        this.squareQueryTotal = this.entrustData.sum;
        this.currentPageSize = this.entrustData.num;
        this.currentPageNumber = this.entrustData.page;
        return JSON.parse(
          JSON.stringify(this.entrustData.Result).replace(/}/g, "},{}")
        );     
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}){
      if(row && row.OperId == 0){
        return "obsolete_row_color"
      }else{
        return ""
      }    
    },
    eventStatusFliter(el) {
      console.log(el);
      let state = _.filter(this.eventState , item => {
        return item['OperName2'] ==el
      })
      if(state.length){
        return state = this.colorList[state[0].rank] 
      }else{
        return 
      }     
    },
    init() {
      // this.colorList = ['#cd3e3e','#3289cc','#c67a3c','#2ca179','#3289cc','#3289cc','#cd3e3e','#c67a3c','#2ca179','#505761',]
      this.colorList = ['#2e8ed7','#2e8ed7','#2e8ed7','#2e8ed7','#2e8ed7','#2e8ed7','#2e8ed7','#1ead7c','#1ead7c','#1ead7c',] 
     MaApiStatus.GetStatusForMantain().then(res => {
        this.eventState = res.data.Data.Result
        // 删除处理
        this.eventState.shift();
        this.eventState.unshift({
          OperId: 11111,
          OperName: "上报",
          OperName2: "上报",
          rank: 11111
        })
        this.eventState.push({
          OperId: 999999,
          OperName: "完成",
          OperName2: "完成",
          rank: 8
        })
        console.log(this.eventState)
      })
    },
    //合并表格
    objectSpanMethod({ row, column, rowIndex, columnIndex }){
      let columnNum = 3;
      if(this.handleBtn){
        columnNum = 3
      }
      if (columnIndex <= columnNum) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 1,
            colspan: this.columnList.length-3
          };
        }
      }
    },
    // 查询数据
    getData(){
      let obj = JSON.parse(localStorage.getItem("getOrderParams"));
      let ExecPersonId = ""; //待处理人
      EventManageForMaintain.get(
        obj.SubmitStartTime,
        obj.SubmitEndTime,
        obj.eventSourceSelect,
        obj.evevtTypeSelectID,
        obj.nowStatusStID,
        obj.deptDataSelect,
        obj.eventContentName,
        ExecPersonId,
        this.currentPageSize,
        this.currentPageNumber
      ).then(res=>{
        let eventOrderResult = res.data.Data.Result;
        console.log(this.currentPageSize)
        console.log("页码更新", res.data.Data.Result);
        let eventOrderResultLength = res.data.Data.TotalRows;
        for (var i in res.data.Data.Result) {
          res.data.Data.Result[i].ExecTime += "小时";
        }
        this.entrustData = {
          num: this.currentPageSize,
          page: this.currentPageNumber,
          sum: eventOrderResultLength,
          // sum:100,
          // Result:disposeData.DataDispose
          Result: eventOrderResult
        };
      })
    },
    //切换行
    currentChange(row) {
      console.log("切换行")
    },
    //详情按钮
    detailBtn(row) {
      //this.centerDialogVisible = true;
      this.$emit("detailBtn", row);
    },
    WorkorderInvalid(row){
      this.$emit("WorkorderInvalid", row);
    },
    tableClick(row,index,a){
      if(!_.keys(row).length){
        row = null
      }
      if(row){
        this.$emit("tableClick",row);
      } 
    },
    //双击行
    tableDbClick(row) {
      this.$emit("tableDbClick",row);
    },
    //当前页数据变化
    onPageSizeChange(objvalue) {
      this.currentPageSize = objvalue;
      console.log("每页",objvalue)
      this.getData();
    },
    // 分页相关
    onPageChange(objvalue) {
      this.currentPageNumber = objvalue;
      console.log("第几页",objvalue)
      this.getData();
    },
    //导出数据
    ExportSearchBTn(){
     // merge_rows_table
     ExportExcel(".merge_rows_table","事件工单")
    }
  }
};
</script>
<style lang="stylus">
.normal{
  .el-step__title{
    background-color: #505761;
			border: solid 1px #58647b;
			color: #afbcc4;
  }

  
  
}
.teble-state-span{
    background-color: #505761;
			color: #afbcc4;
      flex: 1;
      padding: 0 8px;
  }
  .el-step__arrow{
    margin:0 4px;
    display: inline-block;
    width: 14px;
	  height: 2px;
	  border: dashed 1px #036fa6;
    margin-top: 10px;
  }
.el-table tr.obsolete_row_color td{
  background:#e6e9f0;
}
</style>