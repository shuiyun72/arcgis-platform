<template>
  <el-form size="small">
    <el-form-item label="活动区域" v-for="(item,index) in sss" :key="index">
      <el-select v-model="form.region" placeholder="请选择活动区域">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-row class="title" :style="{color:color }" >工单基本信息</el-row>
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
        <td colspan="3">{{MaDialogReportData.EventDesc}}</td>
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

export default {
  components: {},
  data() {
    return {
      MaDialogReportData: {
        EventID: 519,
        上报: 0,
        处理: 1,
        分派: 0,
        接受: 0,
        到场: 0,
        处置: 0,
        完工: 0,
        审核: 0,
        回复: 1,
        完成: 1,
        EventID1: 519,
        EventCode: "LS190000519",
        EventAddress: "澳园",
        UpTime: "2019-04-23T17:13:09",
        DeptId: null,
        PersonId: 383,
        PersonName: "李婉莹",
        cDepName: "测试中心",
        cRoleName: "科员",
        EventTypeId: 3,
        EventTypeId2: 91,
        EventTypeName: "表井内问题",
        EventTypeName2: "其它",
        EventFromId: 4,
        EventFromName: "临时工作",
        UrgencyId: 1,
        UrgencyName: "一般",
        DispatchPerson: null,
        DispatchPersonName: null,
        EventPictures: null,
        EventDesc: "查看是否正常",
        EventX: "109.783748428763",
        EventY: "39.5682384568813",
        EventUpdateTime: "2019-04-23T17:13:09",
        IsValid: 3,
        IsValidName: "完成",
        Devicesmid: null,
        DevicesType: null,
        DeleteStatus: "0",
        TaskId: -1,
        Remark_Back: "流量计维护",
        OtherSysEventId: null,
        ExecTime: 36,
        OperId: 12,
        OperName: "回复",
        OrderId: null,
        IsFinish: 1,
        LinkMan: "侯晓东",
        LinkCall: "18947759998",
        EventStatus: 0,
        StatusName: "正常",
        ExecPersonId: null,
        ExecUpDateTime: "2019-04-23T17:15:09.843",
        ExecDetpID: null,
        ExecDetpName: null,
        ExecPersonName: null,
        DispatchPersonID: 361,
        DispatchPersonName2: "测试侯",
        DispatchPersonDeptName: "测试中心",
        OperName2: "已完成",
        OperRemarks: "流量计维护",
        DispatchPersonTelePhone: null
      }
    };
  },
 props:{
    color:{
      default:'#7a7e80'
    }
  },
  computed: {
    MaDialogReport() {
      return [
        [
           "事件编号：",
          this.MaDialogReportData.EventCode,
           "事件地址：",
          this.MaDialogReportData.EventAddress
        ],
        [
           "上报时间：",
          this.MaDialogReportData.UpTime,
           "工单来源：",
          this.MaDialogReportData.EventFromName
        ],
        [
           "上报人：",
          this.MaDialogReportData.PersonName,
           "上报部门：",
          this.MaDialogReportData.cDepName
        ],
        [
           "事件类型：",
          this.MaDialogReportData.EventTypeName,
           "事件内容：",
          this.MaDialogReportData.EventTypeName2
        ],
        [
           "紧急程度：",
          this.MaDialogReportData.UrgencyName,
           "处理时间：",
          this.MaDialogReportData.ExecTime
       ],
        [
           "联系人：",
          this.MaDialogReportData.LinkMan,
           "联系电话：",
          this.MaDialogReportData.LinkCall
        ],
        [
           "处理部门：",
          this.MaDialogReportData.DispatchPersonDeptName,
           "处理人：",
          this.MaDialogReportData.DispatchPersonName2
        ]
      ];
    }
  },
  created() {},
  methods: {}
};
</script>