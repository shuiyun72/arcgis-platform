<template>
  <el-form size="small">
    <el-form-item label="活动区域" v-for="(item,index) in sss" :key="index">
      <el-select v-model="form.region" placeholder="请选择活动区域">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-row class="title" :style="{color:color }" >工单基本信息 </el-row>
    <!-- <el-row v-for="(item,index) in MaDialogReport" :key="index" class="dialog-table">
        <el-col :span="3" class="dialog-table-lable">{{item.name1}}</el-col>
        <el-col :span="9">{{item.val1}}</el-col>
        <el-col :span="3" class="dialog-table-lable">{{item.name2}}</el-col>
        <el-col :span="9">{{item.val2}}</el-col>
    </el-row> -->
    <table border="1" class="dialog-table">
      <tr  v-for="(item,index) in MaDialogReport" :key="index"  class="wrapperCol">
          <td class="dialog-table-lable">{{item[0]}}</td>
          <td>{{item[1]}}</td>
          <td class="dialog-table-lable">{{item[2]}}</td>
          <td>{{item[3]}}</td>
      </tr>
      <tr class="wrapperCol" >
        <td class="dialog-table-lable">事件备注：</td>
        <td colspan="3">{{currentRow.EventDesc}}</td>
      </tr>
    </table>
    <!-- <el-row class="dialog-table">
      <el-col :span="3"  class="dialog-table-lable">事件备注：</el-col>
      <el-col :span="21" class="textalign_left">{{MaDialogReportData.EventDesc}}</el-col>
    </el-row> -->
  </el-form>
</template>
<script>
import _ from "lodash";
//事件查询
import EventManageForMaintain from "@api/Maintain/EventManageForMaintain";

export default {
  components: {},
  data() {
    return {
     
    };
  },
 props:{
    color:{
      default:'#7a7e80'
    },

    currentRow:'currentRow'
  },
  computed: {
    MaDialogReport() {
      this.currentRow.UpTime = this.currentRow.UpTime.replace(/T/," ");
      this.currentRow.ExecTime = this.currentRow.ExecTime.replace(/T/," ");
      return [
        [
           "事件编号：",
          this.currentRow.EventCode,
           "事件地址：",
          this.currentRow.EventAddress
        ],
        [
           "上报时间：",
          this.currentRow.UpTime,
           "工单来源：",
          this.currentRow.EventFromName
        ],
        [
           "上报人：",
          this.currentRow.PersonName,
           "上报部门：",
          this.currentRow.cDepName
        ],
        [
           "事件类型：",
          this.currentRow.EventTypeName,
           "事件内容：",
          this.currentRow.EventTypeName2
        ],
        [
           "紧急程度：",
          this.currentRow.UrgencyName,
           "处理时间：",
          this.currentRow.ExecTime
       ],
        [
           "报修人：",
          this.currentRow.LinkMan,
           "报修电话：",
          this.currentRow.LinkCall
        ],
        [
           "处理部门：",
          this.currentRow.ExecDetpName,
           "处理人：",
          this.currentRow.ExecPersonName
        ]
      ];
    }
  },
  created() {
    
  },
  methods: {
    //查询数据 
    // SubmitResult(){
    //   console.log("report查询");
    //   let eventid = localStorage.getItem("eventid");
    //   let ExecPersonId = "";//待处理人
    //   let sort = 'EventID';
    //   let ordering = "";
    //   let num = 50;
    //   let page = 1;
    //   EventManageForMaintain.get(this.SubmitStartTime,this.SubmitEndTime,this.eventSourceSelectID,this.evevtTypeSelect,eventid,this.nowStatusStID,1,this.deptDataSelectID,this.eventContentName,ExecPersonId,sort,ordering,num,page).then(res=>{
    //     this.MaDialogReportData = res.data.Data.Result[0];
    //     this.$set(this.MaDialogReportData,"EventCode",this.MaDialogReportData.EventCode)
    //     console.log(res.data.Data.Result[0],eventid);
    //   })
    // },
  }
};
</script>
<style scoped>
.dialog-table-lable {
  width: 82px!important;
}
</style>