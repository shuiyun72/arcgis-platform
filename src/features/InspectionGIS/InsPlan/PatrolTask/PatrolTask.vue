<template>
  <div class="table_style formItem" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'巡检任务管理'" :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="86px">
      <date-btn-choose
        @DateBtn="dateBtn"
        ref="dateBtn"
        :dataLeft="'10px'"
        :dataSpan="9"
        
      ></date-btn-choose>
      <el-row>
        <el-col :span="8">
          <el-form-item label="巡检员：">
            <el-select v-model="iAdminIDValue" size="mini">
              <el-option
                v-for="item in iAdminIDList"
                :key="item.iAdminID"
                :label="item.cAdminName"
                :value="item.iAdminID"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="计划类型：">
            <el-row type="flex" justify="start" style="padding:0">
              <el-radio
                class="my-radio"
                v-model="planTypeListValue"
                size="mini"
                v-for="item in planTypeList"
                :key="item.value"
                :label="item.value"
                @change="typeChoose(item.value ,'planTypeListValue')"
              >{{item.text}}</el-radio>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="计划名称：">
            <el-input v-model="serachCondition" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="计划类型：">
            <el-row type="flex" justify="start" style="padding:0">
              <el-radio
                class="my-radio"
                v-model="isAssignedValue"
                size="mini"
                v-for="item in isAssignedList"
                :key="item.value"
                :label="item.value"
                @change="typeChoose(item.value ,'isAssignedValue')"
              >{{item.text}}</el-radio>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-button class="my-search" size="mini" @click="GetData(1)"  v-if="$options.filters.btnTree('/api/InspectionPlan/TaskManage/GetPlanManageInfo' ,$route.name)">查询</el-button>
        <el-button class="my-reset" size="mini" @click="initData"  v-if="$options.filters.btnTree('/api/InspectionPlan/TaskManage/GetPlanManageInfo' ,$route.name)">重置</el-button>
        <el-button class="my-task-sell" size="mini" @click="taskDistribution"  v-if="$options.filters.btnTree('/api/InspectionPlan/TaskManage/AssignTask' ,$route.name)">任务派发</el-button>
        <el-button class="my-del" size="mini" @click="delData"  v-if="$options.filters.btnTree('/api/InspectionPlan/TaskManage/Delete' ,$route.name)">批量删除</el-button>
      </el-row>
    </el-form>
    <multi-line-table
      :layerListName="'Ins_PatrolTask_Columns'"
      :tableHeight="'calc(100vh - 272px)'"
      :columnListData="squareQueryRawTableData"
      :loading.sync="loading"
      :pageSize.sync="currentPageSize"
      :pageNumber.sync="currentPageNumber"
      :dataTotal="squareQueryTotal"
      :tableIndex.sync = "tableIndex"
      :layeName="'InsPlan'"
      @tableDbClick="tableDbClick"
      @GetData="GetData"
      @currentChange="currentChange"
      @deltableItem="deltableItem"
      @changeAttr="changeAttr"
      ></multi-line-table>
  </div>
</template>
<script>
import _ from "lodash";
import DateBtnChoose from "@features/InspectionGIS/components/DateBtnChoose";

import { GeoTextCenter } from "@util/index";
import InspectionPlan from "@api/Inspection/InspectionPlan";
import User from "@api/Inspection/User";
import InsPlanLineDetail from "@api/Inspection/PlanLineDetail";
import InsPointArea from "@api/Inspection/PointArea";
import MultiLineTable from "@features/InspectionGIS/InsPlan/components/MultiLineTable.vue";
import TableFormTitle from "@common/components/TableFormTitle";
import InsTable from "@features/InspectionGIS/components/InsTable";
import { debug } from 'util';
import utilData from "@util/utilData";

export default {
  components: {
    MultiLineTable,
    TableFormTitle,
    InsTable,
    DateBtnChoose
  },
  beforeDestroy() {
    this.$bus.emit("setBusinessLayerGroupVisible", false); //关闭业务图层
    //this.$bus.emit("setVectorLayerVisible", false); //关闭矢量图层
    //this.$bus.emit("setSpatialSearchLayerGroupDisplay", true, true);
  },
  data() {
    return {
      loading: true,
      columnListData: [], //表格全部数据
      dataTotal: 1, //表格数据个数
      currentPageNumber: 1, //表格页码
      currentPageSize: 50, //表格页size
      currentRow: null, //当前表格选中项
      tableIndex:[],//select列表
      flexible: false, //是否收缩左侧表格
      planTypeList: [
        {
          text: "全部",
          value: null
        },
        {
          text: "常规",
          value: 1
        },
        {
          text: "临时",
          value: 0
        }
      ],
      planTypeListValue: "",
      isAssignedList: [
        {
          text: "全部",
          value: null
        },
        {
          text: "已派发",
          value: 1
        },
        {
          text: "未派发",
          value: 0
        }
      ],
      isAssignedValue: "",
      serachCondition: "", //索引数据
      iAdminIDValue: "all",
      iAdminIDList: [],
      startTime: "",
      endTime: ""
    };
  },
  created() {
    this.onLoadData();
  },
  mounted(){
    let queryDate = this.$route.query.date;
    if(queryDate && queryDate == 1){
      let current = utilData.getCurrentDate();
      let data = utilData.myformatStr(current);
      this.startTime = data;
      this.endTime  = data;
    }else
    if(queryDate && queryDate == 4){
      let data = utilData.getMonth();
      this.startTime = data.begin;
      this.endTime = data.over;
    }
    this.GetData();
  },
  methods: {
    currentChange(row){
      this.currentRow = row
    },
    onLoadData() {
      User.AdminNameData(19).then(res => {
        this.iAdminIDList = res.data.Data.Result;
        this.iAdminIDList.unshift({
          iAdminID: 'all',
          cAdminName: "全部"
        });
        this.iAdminIDValue = this.iAdminIDList[0].iAdminID;
      });
      this.planTypeListValue = this.planTypeList[0].value;
      this.isAssignedValue = this.isAssignedList[0].value;
      this.startTime = "";
      this.endTime = "";
    },
    initData() {
      this.iAdminIDValue = 'all';
      this.$refs.dateBtn.typeChoose("all", "timeListValue");
      this.planTypeListValue = this.planTypeList[0].value;
      this.isAssignedValue = this.isAssignedList[0].value;
      
      this.serachCondition = "";
      this.startTime = "";
      this.endTime = "";
      this.GetData();
    },
    typeChoose(item, type) {
      this[type] = item;
      //this.GetData(1);
    },
    // 查询操作
    GetData(pageNumber, pageSize) {
      this.loading = true;
      if (typeof pageNumber == "number") {
        //如果传值更新父页面的表格页码为1，切换数据调用data时使用，
        //因为getdata初始查询页码为1
        this.currentPageNumber = pageNumber;
      }
      if (typeof pageSize == "number") {
        this.currentPageSize = pageSize;
      }
      this.startTime ? this.startTime : "";
      this.endTime ? this.endTime : "";
      
      let iAdminIDValue = this.iAdminIDValue
      if(this.iAdminIDValue == 'all'){
        iAdminIDValue = ""
      }else{
        iAdminIDValue = Number(this.iAdminIDValue)
      }
      InspectionPlan.PatrolTaskSearch(
        this.isAssignedValue,
        this.serachCondition,
        this.planTypeListValue,
        iAdminIDValue,
        this.startTime,
        this.endTime,
        "TaskId",
        "desc",
        this.currentPageSize,
        this.currentPageNumber
      ).then(res => {
        res.data.Data.Result = JSON.parse(
          JSON.stringify(res.data.Data.Result).replace(/}/g, "},{}")
        );
        this.loading = false;
        this.squareQueryRawTableData = res.data.Data.Result;
        this.squareQueryTotal = res.data.Data.TotalRows;
      });
    },
    dateBtn(_startTime, _endTime) {
      this.startTime = _startTime;
      this.endTime = _endTime;
      //this.GetData(1);
    },
    taskDistribution() {
      let data = _.filter(this.tableIndex, item => {
        return item.AssignState != 1;
      });
      if (data.length != this.tableIndex.length) {
        this.$message({
          type: "warning",
          message: "只能分派未派发的任务",
          showClose: true
        });
        return;
      }
      let TaskIds = this.getAcctiveIndex(data);
      if (!TaskIds) {
        this.$message({
          type: "warning",
          message: "请选择未派发的任务",
          showClose: true
        });
        return;
      }
      this.$confirm("确定要分派该任务么").then(() => {
        InspectionPlan.PatrolTaskAssign(TaskIds).then(res => {
          this.$message({
            type: "success",
            message: "任务派发成功",
            showClose: true
          });
          this.GetData();
        });
      });
    },
    delData() {
      let TaskIds = this.getAcctiveIndex();
      if (!TaskIds) {
        this.$message({
          type: "warning",
          message: "请选择需要删除的任务",
          showClose: true
        });
        return;
      }
      this.$confirm("确定要删除该任务么").then(() => {
        InspectionPlan.PatrolTaskDel(TaskIds).then(res => {
          this.$message({
            type: "info",
            message: "任务删除成功",
            showClose: true
          });
          this.GetData(1);
        });
      });
    },
    getAcctiveIndex(data) {
      //console.log(this.tableIndex,data)
      data = data || this.tableIndex;
      let TaskIds = []
      _.forEach(data, item => {
        if(item.TaskId){
          TaskIds.push(item.TaskId)
        }
      });
      //console.log(TaskIds)
      return TaskIds.join(",");
    },
    //双击查询行信息
    tableDbClick(row) {
      //console.log(row)
      if (row.GeoText != null) {
        try {
          JSON.parse(row.GeoText);
        } catch (e) {
          this.$message({
            type: "error",
            message: "您选择的区域已删除,请联系管理员!",
            showClose: true
          });
          return;
        }
        let GeoTextData = JSON.parse(row.GeoText);
        if (row.PlanTypeName == "区域巡检") {
          this.areaTableDbClick(row, GeoTextData);
        }
        if (row.PlanTypeName == "路线巡检") {
          this.routeTableDbClick(row, GeoTextData)
        }
      } else {
        this.$message({
          type: "error",
          message: "您选择的区域已删除,请联系管理员!",
          showClose: true
        });
      }
    },
    //区域的行双击
    areaTableDbClick(row, GeoTextData) {
      let PlanAreaName = row.PlanAreaName;
      this.$bus.emit(
        "setPolygonOnMap",
        [GeoTextData],
        [PlanAreaName],
        false,
        res => {
        }
      );
      //console.log(row);
      //显示区域关键点
      InsPointArea.GetPointArea(20, 1, row.PlanAreaId).then(res => {
        let pointArrayData = []; //点坐标的集合
        let pointObjArray = [];
        _.map(res.data.Data.Result, res => {
          pointArrayData.push([Number(res.PointX), Number(res.PointY)]);
          pointObjArray.push({
            PointName: res.PointName
          });
        });
        this.$bus.emit("onPointermoveControl");
        this.$bus.emit(
          "setPointOnMap",
          pointArrayData,
          false,
          (res, fun) => {},
          "RegionalPoint",
          pointObjArray
        );
      });

      GeoTextCenter(row.GeoText, res => {
        this.$bus.emit("setCenter", res);
      });
    },
    //路线的行双击
    routeTableDbClick(row, GeoTextData) {
      let PatroGeoText = JSON.parse(row.PatroGeoText);
          let PlanLineName = row.PlanLineName;
          this.$bus.emit(
            "setLineStringOnMap",
            [GeoTextData],
            [PlanLineName],
            false,
            res => {
              console.log("地图上显示路线");
            },
            [PatroGeoText]
          );
          console.log(row, row.PlanLineId)
          InsPlanLineDetail.GetPlanLineDetail(20, 1, row.PlanLineId).then(
            res => {
              //点坐标的集合
              let pointArrayData = [];
              let objArray = [];
              _.forEach(res.data.Data.Result, res => {
                pointArrayData.push([Number(res.X), Number(res.Y)]);
                objArray.push({
                  ImportPointName: res.ImportPointName,
                  AddTime: res.AddTime
                });
              });
              this.$bus.emit("onPointermoveControl");
              this.$bus.emit(
                "setPointOnMap",
                pointArrayData,
                false,
                () => {},
                "RoutePoint",
                objArray
              );
            }
          );
          GeoTextCenter(row.GeoText, res => {
            this.$bus.emit("setCenter", res);
          });
    }
  }
};
</script>


