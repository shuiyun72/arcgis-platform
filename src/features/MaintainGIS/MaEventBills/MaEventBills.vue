<template>
  <div class="MaintainGIS table_style" :class="{flexible:flexible}">
    <TableFormTitle :titleName="titleName" :flexible.sync="flexible"></TableFormTitle>
    <el-form size="small" label-width="76px">
      <!-- 上报时间 -->
      <date-btn-choose @DateBtn="SubmitTime" ref="dateBtnChoose" :dataSpan="10"></date-btn-choose>
      <!-- 事件状态 -->
      <ma-plc-status @nowStatus="nowStatus" ref="maPlcStatus"></ma-plc-status>
      <!-- 条件查询 -->
      <ma-plc-search
        @maPlcSearch="maPlcSearch"
        @resetSearchBTn="resetSearchBTn"
        @deleteSearchBTn="WorkorderInvalid"
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
      @pageChange="pageChange"
      @pageSizeChange="pageSizeChange"
    ></main-tain-table>
    <!-- 弹窗 -->
    <detailDialog
      ref="detailLog"
      :centerDialogVisible.sync="centerDialogVisible"
      :currentRow="currentRow"
      :stepDetail="stepDetail"
    ></detailDialog>
  </div>
</template>
<script>
import axios from "axios";
import _ from "lodash";

import * as disposeData from "../components/config.js";
import * as TableData from "@common/consts/maintain-table.js";
// 引入地图
import config from "@config/config.js";
import BaseMap from "@services/OpenLayers/BaseMap";
import MapNavigate from "@services/OpenLayers/MapNavigate";
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
//事件查询
import EventManageForMaintain from "@api/Maintain/EventManageForMaintain";
import EventStartForMaintain from "@api/Maintain/EventStartForMaintain";

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
      flexible: false, //是否收缩左侧表格
      currentRow: {}, //选中行信息
      titleName: "事件工单",
      maPlcTableH: "calc(100vh - 330px)",
      labelWidth: "76px",
      centerDialogVisible: false,
      resetTime: 0, //重置上报时间
      ReportTimeSelect: "全部",

      columnList: [],
      entrustData: [],
      eventOrderResult: [],
      eventOrderResultLength: 0,
      adminName: "", //登陆人姓名
      adminID: "", //登陆人id,
      adminDeptID: "", //登陆人所在id
      num: 50, //每页50数据
      page: 1, //1页
      obj: {
        SubmitStartTime: "", //上报开始时间段
        SubmitEndTime: "", //上报截止时间段
        nowStatusSt: "", //事件状态
        nowStatusStID: "", //事件状态ID
        eventSourceSelect: "", //事件来源
        deptDataSelect: "", //上报部门
        evevtTypeSelect: "", //事件类型
        evevtTypeSelectID: "", //事件类型id
        eventContentName: "" //事件查找
      },
      stepDetail: [], //步骤数据
      hourUp: "", //处理时间
      simple: "" //临时
    };
  },
  computed: {
    entrustData() {
      return this.entrustData;
    }
  },
  created() {
    this.SubmitResult();
    //初始化数据
    this.init();
    this.$bus.emit("setBusinessLayerGroupVisible", true);
  },
  beforeDestroy() {
    this.$bus.emit("removeInteractions");
    this.$bus.emit("CloseModifyInteraction");
    this.$bus.emit("OffPointermoveControl");
    this.$bus.emit("setBusinessLayerGroupVisible", false);
    //this.$bus.emit("setBusinessLayerGroupVisible", false); //开启业务图层
  },
  methods: {
    //初始化
    init() {
      this.colorList = [
        "#cd3e3e",
        "#3289cc",
        "#c67a3c",
        "#2ca179",
        "#3289cc",
        "#3289cc",
        "#cd3e3e",
        "#c67a3c",
        "#2ca179",
        "#505761"
      ];
      MaApiStatus.GetStatusForMantain().then(res => {
        this.FlowPath = res.data.Data.Result;
        this.FlowPath.shift();
        this.FlowPath.unshift({
          OperId: 11111,
          OperName: "上报",
          OperName2: "上报",
          rank: 11111
        });
        this.FlowPath.push({
          OperId: 999999,
          OperName: "完成",
          OperName2: "完成",
          rank: 999999
        });
      });
      if (this.eventOrderResult) {
        this.columnList = TableData.Mai_EventBills_Columns;
        this.entrustData = {
          num: this.num,
          page: this.page,
          sum: this.eventOrderResultLength,
          Result: this.eventOrderResult
        };
      } else {
        this.SubmitResult();
      }
    },
    //是否显示详情弹窗
    detailBtn(row) {
      this.currentRow = row;
      if (row.EventID) {
        this.$refs.detailLog.loadData(row.EventID);
      }
      // 事件工单只能查询
      this.currentRow.isBtn = false;
      this.centerDialogVisible = true;
    },
    //切换数据/地图
    changeDialog(tab, event) {
    },
    //上报时间组件
    SubmitTime(startTime, endTime) {
      this.obj.SubmitStartTime = startTime;
      this.obj.SubmitEndTime = endTime;
      if (this.obj.nowStatusSt == "无 效") {
        this.SubmitWuXiaoResult();
      } else {
        this.SubmitResult();
      }
    },
    //事件状态组件
    nowStatus(EventFormID, EventType) {
      this.obj.nowStatusSt = EventType;
      this.obj.nowStatusStID = EventFormID;
      if (this.obj.nowStatusSt == "无 效") {
        this.SubmitWuXiaoResult();
      } else {
        this.SubmitResult();
      }
    },
    //事件状态组件传值
    maPlcSearch(source, dept, type, typeid, name, isSummit) {
      this.obj.eventSourceSelect = source; //事件来源
      this.obj.deptDataSelect = dept; //上报部门
      this.obj.evevtTypeSelect = type; //事件类型
      this.obj.evevtTypeSelectID = typeid; //事件类型id
      this.obj.eventContentName = name; //事件查找
      if (isSummit) {
        if (this.obj.nowStatusSt == "无 效") {
          this.SubmitWuXiaoResult();
        } else {
          this.SubmitResult();
        }
      }
    },
    //查询数据
    SubmitResult(id) {
      localStorage.setItem("getOrderParams", JSON.stringify(this.obj));
      let admin = JSON.parse(localStorage.getItem("iAdminID"));
      this.adminID = admin.iAdminID;
      this.adminName = admin.cAdminName;
      this.adminDeptID = admin.iDeptID;
      let ExecPersonId = ""; //待处理人
      let num = this.num;
      let page = this.page;
      EventManageForMaintain.get(
        this.obj.SubmitStartTime,
        this.obj.SubmitEndTime,
        this.obj.eventSourceSelect,
        this.obj.evevtTypeSelectID,
        this.obj.nowStatusStID,
        this.obj.deptDataSelect,
        this.obj.eventContentName,
        ExecPersonId,
        num,
        page
      ).then(res => {
        this.eventOrderResult = res.data.Data.Result;
        this.eventOrderResultLength = res.data.Data.TotalRows;
        for (var i in res.data.Data.Result) {
          res.data.Data.Result[i].ExecTime += "小时";
          res.data.Data.Result[i].EventUpdateTime = res.data.Data.Result[
            i
          ].EventUpdateTime.replace(/T/, " ");
          res.data.Data.Result[i].ExecUpDateTime = res.data.Data.Result[
            i
          ].ExecUpDateTime.replace(/T/, " ");
          res.data.Data.Result[i].UpTime = res.data.Data.Result[
            i
          ].UpTime.replace(/T/, " ");
        }
        // 作废状态改变
        if (id) {
          let temp = this.eventOrderResult.filter(item => {
            return item.EventID == id;
          });
          temp[0].OperName2 = "无效";
        }
        this.columnList = TableData.Mai_EventBills_Columns;
        this.entrustData = {
          num: this.num,
          page: this.page,
          sum: this.eventOrderResultLength,
          // sum:100,
          // Result:disposeData.DataDispose
          Result: this.eventOrderResult
        };
      });
    },
    //查询无效数据
    SubmitWuXiaoResult(id) {
      localStorage.setItem("getOrderParams", JSON.stringify(this.obj));
      let admin = JSON.parse(localStorage.getItem("iAdminID"));
      this.adminID = admin.iAdminID;
      this.adminName = admin.cAdminName;
      this.adminDeptID = admin.iDeptID;
      let ExecPersonId = ""; //待处理人
      let num = this.num;
      let page = this.page;
      EventManageForMaintain.getWuXiao(
        this.obj.SubmitStartTime,
        this.obj.SubmitEndTime,
        this.obj.eventSourceSelect,
        this.obj.evevtTypeSelectID,
        "",
        this.obj.deptDataSelect,
        this.obj.eventContentName,
        ExecPersonId,
        num,
        page
      ).then(res => {
        this.eventOrderResult = res.data.Data.Result;
        this.eventOrderResultLength = res.data.Data.TotalRows;
        for (var i in res.data.Data.Result) {
          res.data.Data.Result[i].ExecTime += "小时";
          res.data.Data.Result[i].EventUpdateTime = res.data.Data.Result[
            i
          ].EventUpdateTime.replace(/T/, " ");
          res.data.Data.Result[i].ExecUpDateTime = res.data.Data.Result[
            i
          ].ExecUpDateTime.replace(/T/, " ");
          res.data.Data.Result[i].UpTime = res.data.Data.Result[
            i
          ].UpTime.replace(/T/, " ");
        }
        this.columnList = TableData.Mai_EventBills_Columns;
        this.entrustData = {
          num: this.num,
          page: this.page,
          sum: this.eventOrderResultLength,
          // sum:100,
          // Result:disposeData.DataDispose
          Result: this.eventOrderResult
        };
      });
    },
    // 更新页面状态
    getOrder() {
      EventManageForMaintain.getCurrentOrder(this.num, this.page).then(res => {
        let arr = JSON.stringify(res.data.Data.Result);
        let temp = JSON.parse(arr).filter(item => {
          return item.EventID == this.currentRow.EventID;
        });
        this.detailBtn(temp[0]);
      });
    },
    //重置
    resetSearchBTn() {
      this.eventSourceSelect = ""; //事件来源
      this.deptDataSelect = ""; //上报部门
      this.evevtTypeSelect = ""; //事件类型
      this.eventContentName = "";
      this.nowStatusSt = "全部";
      this.ReportTimeSelect = "全部";
      this.$refs.dateBtnChoose.onLoadData();
      this.$refs.maPlcStatus.onLoadData();
      this.init();
    },
    //工单作废
    WorkorderInvalid() {
      if(!this.currentRow.EventID){
        this.$message("请选择要作废的工单");
        return;
      }
      if (!this.currentRow.OrderId) {
        this.$message("此工单未分派,请重新选择");
        return;
      }
      if (this.currentRow.OperId && this.simple != this.currentRow.EventID) {
        if (this.currentRow.OperId > 1 && this.currentRow.IsValid != 4) {
          this.$confirm("确认要作废此工单", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              EventManageForMaintain.WorkorderInvalid(
                this.currentRow.EventID,
                this.currentRow.OrderId,
                this.adminID,
                this.adminDeptID
              ).then(res => {
                this.$message({
                  type: "success",
                  message: "作废成功!"
                });
                this.simple = this.currentRow.EventID;
                this.SubmitResult(this.currentRow.EventID);
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消作废"
              });
            });
        } else {
          this.$message("此工单未分派,请重新选择");
        }
      } else {
        this.$message("此工单已作废,请重新选择");
      }
    },
    //单击行
    tableClick(row) {
      this.currentRow = row;
    },
    //双击
    tableDbClick(row) {
      console.log(row);
      this.currentRow = row;
      this.drawPoint(row);
    },
    drawPoint(data) {
      //点坐标的集合
      let pointArrayData = [];
      let objArray = [];
      if (_.isArray(data)) {
        _.map(data, res => {
          if (res.EventX && res.EventY) {
            pointArrayData.push([Number(res.EventX), Number(res.EventY)]);
            let EventPictures = [];
            if (res.EventPictures) {
              EventPictures = res.EventPictures.split("|");
              EventPictures = _.map(EventPictures, item => {
                return config.apiPath.insURL + item;
              });
            }
            objArray.push({
              EventCode: data.EventCode || "",
              DeptName: data.DispatchPersonDeptName || "",
              // PName: data.PName,
              PName: data.PersonName || "",
              PointName: data.EventTypeName || "",
              // ET1: data.ET1,
              ET1: data.EventTypeName2 || "",
              EventFromName: data.EventFromName || "",
              // HandlerLevelName: data.HandlerLevelName,
              HandlerLevelName: data.UrgencyName || "",
              eventAddress: data.EventAddress || "",
              eventDesc: data.EventDesc || "数据最后上传时间" + data.UpTime,
              EventPictures: EventPictures || ""
            });
          }
        });
      } else if (data.EventX && data.EventY) {
        pointArrayData.push([Number(data.EventX), Number(data.EventY)]);
        let EventPictures = [];
        if (data.EventPictures) {
          EventPictures = data.EventPictures.split("|");
          EventPictures = _.map(EventPictures, item => {
            return config.apiPath.insURL + item;
          });
        }
        objArray.push({
          EventCode: data.EventCode || "",
          DeptName: data.DispatchPersonDeptName || "",
          // PName: data.PName,
          PName: data.PersonName || "",
          PointName: data.EventTypeName || "",
          // ET1: data.ET1,
          ET1: data.EventTypeName2 || "",
          EventFromName: data.EventFromName || "",
          // HandlerLevelName: data.HandlerLevelName,
          HandlerLevelName: data.UrgencyName || "",
          eventAddress: data.EventAddress || "",
          eventDesc: data.EventDesc || "数据最后上传时间" + data.UpTime,
          EventPictures: EventPictures || ""
        });
        this.$bus.emit("setCenter", ...pointArrayData);
      } else {
        this.$message({
          type: "error",
          message: "此事件未上传点位",
          showClose: false
        });
      }

      //开启地图hover点
      this.$bus.emit("onPointermoveControl");
      //绘点
      this.$bus.emit(
        "setPointOnMap",
        pointArrayData,
        false,
        () => {},
        "EventPoint",
        objArray
      );
    }
  }
};
</script>