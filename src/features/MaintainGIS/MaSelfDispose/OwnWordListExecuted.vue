<template>
  <div class="MaintainGIS table_style" :class="{flexible:flexible}">
    <TableFormTitle :titleName="titleName" :flexible.sync="flexible"></TableFormTitle>

    <el-form label-width="83px" label-position="right" size="small" gutter="20px">
      <date-btn-choose @DateBtn="SubmitTime" ref="dateBtnChoose" :dataSpan="10"></date-btn-choose>
      <el-button size="mini" @click="orderInvalid()" class="my-del">作废</el-button>
      <el-button size="mini" @click="disposeMsgBtn()" class="my-process">查询</el-button>
    </el-form>
    <!-- 公用table -->
    <main-tain-table
      :entrustData="entrustData"
      :columnList="columnList"
      @detailBtn="detailBtn"
      @tableClick="tableClick"
      @tableDbClick="tableDbClick"
    ></main-tain-table>
    <!-- 弹窗 -->
    <detailDialog
      ref="detailLog"
      :centerDialogVisible.sync="centerDialogVisible"
      :currentRow="currentRow"
    ></detailDialog>
  </div>
</template>
<script>
import _ from "lodash";
import axios from "axios";
import * as disposeData from "../components/config.js";
import * as TableData from "@common/consts/maintain-table.js";
// 引入地图
import config from "@config/config.js";
import BaseMap from "@services/OpenLayers/BaseMap";
import MapNavigate from "@services/OpenLayers/MapNavigate";
//组件
import MainTainTable from "../components/MainTainTable";
import Initiate from "./component/Initiate";
import TableFormTitle from "@common/components/TableFormTitle";
import detailDialog from "../components/detailDialog";
//公共组件
import DateBtnChoose from "@features/InspectionGIS/components/DateBtnChoose";
//待办事件查询
import EventManageForMaintain from "@api/Maintain/EventManageForMaintain";
//转派部门
import EventStartForMaintain from "@api/Maintain/EventStartForMaintain";
export default {
  components: {
    Initiate,
    MainTainTable,
    TableFormTitle,
    detailDialog,
    DateBtnChoose
  },
  data() {
    return {
      flexible: false, //是否收缩左侧表格
      titleName: "已办工单",
      currentRow: "",
      eventOrderResult: [],
      columnList: [],
      eventOrderResultLength: "",
      entrustData: [],
      DisposePages: [
        { name: "待办处理", urlTo: "Entrust" },
        { name: "发起事件", urlTo: "Initiate" },
        { name: "已办工单", urlTo: "HaveDone" }
      ], //图层下拉框数据
      centerDialogVisible: false,
      adminName: "", //登陆人姓名
      adminID: "", //登陆人id
      adminDeptID: "", //登陆人所在部门id
      num: 50,
      page: 1,
      SubmitStartTime: "",
      SubmitEndTime: "",
      hourUp: "",
      simple: ""
    };
  },
  created() {
    this.SubmitResult();
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
    init() {
      //初始化
      if (this.eventOrderResult) {
        this.columnList = TableData.Mai_DoneOrderBills_Columns;
        this.entrustData = {
          num: this.num,
          page: this.page,
          sum: this.eventOrderResultLength,
          // sum:100,
          // Result:disposeData.DataDispose
          Result: this.eventOrderResult
        };
      } else {
        this.SubmitResult();
      }
    },
    //单击行
    tableClick(row) {
      this.currentRow = row;
    },
    //双击
    tableDbClick(row) {
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
    },
    //是否显示详情弹窗
    detailBtn(row) {
      this.currentRow = row;
      if (row.IsValid == 0) {
        this.$message("此工单已作废");
      } else {
        if (row.EventID) {
          this.$refs.detailLog.loadData(row.EventID);
        }
        // 分派的对象是否为自己
        let temp = JSON.parse(localStorage.getItem("iAdminID"));
        this.currentRow.adminID = temp.iAdminID;
        this.currentRow.isBtn = true;
        this.centerDialogVisible = true;
      }
    },
    //已办处理查询数据
    SubmitResult(id) {
      let admin = JSON.parse(localStorage.getItem("iAdminID"));
      this.adminID = admin.iAdminID;
      this.adminName = admin.cAdminName; //登陆人id
      this.adminDeptID = admin.iDeptID;
      EventManageForMaintain.GetEventListOwn(
        this.SubmitStartTime,
        this.SubmitEndTime,
        this.adminID,
        this.num,
        this.page
      ).then(res => {
        this.eventOrderResult = res.data.Data.Result;
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
        this.eventOrderResultLength = res.data.Data.TotalRows;
        this.columnList = TableData.Mai_DoneOrderBills_Columns;
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
    //上报时间组件
    SubmitTime(startTime, endTime) {
      this.SubmitStartTime = startTime;
      this.SubmitEndTime = endTime;
      this.SubmitResult();
    },
    // 更新页面状态
    getOrder() {
      EventManageForMaintain.getCurrentOrder(50, 1).then(res => {
        let arr = JSON.stringify(res.data.Data.Result);
        let temp = JSON.parse(arr).filter(item => {
          return item.EventID == this.currentRow.EventID;
        });
        temp[0].ExecTime += "小时";
        this.detailBtn(temp[0]);
      });
    },
    orderInvalid() {
      if (!this.currentRow.EventID) {
        this.$message("请选择要作废的工单");
        return;
      }
      if(!this.currentRow.OrderId){
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
    }
  }
};
</script>
<style lang="stylus" scoped>
.el-button.my-del {
  margin-left: 10px;
}
</style>