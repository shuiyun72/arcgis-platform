<template>
  <div class="table_style formItem" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'巡检计划管理'" :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="48px">
      <el-row>
        <el-col :span="7" :xs="12" :sm="12" :lg="7">
          <el-form-item label="名称：">
            <el-input v-model="serachCondition" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :xs="13" :sm="13" :lg="{span:8,offset: 1}">
          <el-form-item label="类型：">
            <el-row type="flex" justify="start" style="padding:0">
              <el-radio
                class="my-radio"
                v-model="isNomalPlan"
                size="mini"
                v-for="item in attrList"
                :key="item.value"
                :label="item.value"
                @change="attrChange(item)"
              >{{item.text}}</el-radio>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-button
          class="my-search"
          size="mini"
          @click="searchBtn"
          v-if="$options.filters.btnTree('/api/InspectionPlan/PlanManage/GetPlanManageInfo' ,$route.meta.iFunID)"
        >查询</el-button>
        <el-button
          class="my-reset"
          size="mini"
          @click="resetBtn"
          v-if="$options.filters.btnTree('/api/InspectionPlan/PlanManage/GetPlanManageInfo' ,$route.meta.iFunID)"
        >重置</el-button>
        <el-button
          class="my-regionIns"
          type
          size="mini"
          @click="GetPlanType(1)"
          v-if="$options.filters.btnTree('/api/InspectionPlan/PlanManage/GetPlanManageInfo' ,$route.meta.iFunID)"
        >区域巡检</el-button>
        <el-button
          class="my-routeIns"
          type
          size="mini"
          @click="GetPlanType(2)"
          v-if="$options.filters.btnTree('/api/InspectionPlan/PlanManage/GetPlanManageInfo' ,$route.meta.iFunID)"
        >路线巡检</el-button>
        <el-button
          class="my-all"
          size="mini"
          @click="GetPlanType(0)"
          v-if="$options.filters.btnTree('/api/InspectionPlan/PlanManage/GetPlanManageInfo' ,$route.meta.iFunID)"
        >全部</el-button>
      </el-row>
      <el-row type="flex" justify="start" class="table-btn-control">
        <el-button
          class="my-tableout"
          plain
          size="mini"
          @click="addItem"
          v-if="$options.filters.btnTree('/api//InspectionPlan/PlanManage/Post' ,$route.meta.iFunID)"
        >
          <i class="iconfont icon-xinzeng"></i>新增
        </el-button>
        <el-button
          class="my-tableout"
          size="mini"
          @click="editItem"
          v-if="$options.filters.btnTree('/api/InspectionPlan/PlanManage/Put' ,$route.meta.iFunID)"
        >
          <i class="iconfont icon-bianji"></i>编辑
        </el-button>
        <el-button
          class="my-tableout"
          size="mini"
          @click="delItem"
          v-if="$options.filters.btnTree('/api/InspectionPlan/PlanManage/Delete' ,$route.meta.iFunID)"
        >
          <i class="iconfont icon-shanchu"></i>删除
        </el-button>
        <el-button
          class="my-tableout"
          size="mini"
          @click="PlanAssign"
          v-if="$options.filters.btnTree('/api/InspectionPlan/PlanManage/AssignTask' ,$route.meta.iFunID)"
        >
          <i class="iconfont icon-jihuafenpai"></i> 计划分派
        </el-button>
      </el-row>
    </el-form>
    <InsTable
      :layerListName="'Ins_PlanManage_Columns'"
      :tableHeight="'calc(100vh - 273px)'"
      :columnListData="squareQueryRawTableData"
      :loading.sync="loading"
      :pageSize.sync="currentPageSize"
      :pageNumber.sync="currentPageNumber"
      :dataTotal="squareQueryTotal"
      :layeName="'InsPlan'"
      :tableIndex.sync="tableIndex"
      @tableDbClick="tableDbClick"
      @GetData="GetData"
      @currentChange="currentChange"
      @deltableItem="deltableItem"
    ></InsTable>
    <el-dialog
      title="计划分派"
      :visible.sync="assignDialogVisible"
      :before-close="handleClose"
      customClass="el_add_dialog"
      class="myDialog"
    >
      <el-form label-width="80px" size="small">
        <el-form-item label="计划名称：">
          <el-input v-model="alignNameChangeValue" disabled></el-input>
        </el-form-item>
        <el-form-item label="任务名称：">
          <el-input v-model="alignNameChangeTime"></el-input>
        </el-form-item>
        <el-form-item label="部门：">
          <el-select v-model="fromAssignDept" placeholder="请选择" @change="deptDataChange">
            <el-option
              v-for="item in deptData"
              :key="item.iDeptID"
              :label="item.cDepName"
              :value="item.cDepName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分派人员：">
          <el-select v-model="fromAssignStaff" placeholder="请选择">
            <el-option
              v-for="item in staffData"
              :key="item.iAdminID"
              :label="item.cAdminName"
              :value="item.cAdminName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间：">
          <el-date-picker
            v-model="fromAssignPlan.starTime"
            value-format="yyyy-MM-dd"
            type="date"
            @change="onChangeStarTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：">
          <el-date-picker v-model="fromAssignPlan.endTime" value-format="yyyy-MM-dd" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="任务描述：">
          <el-input v-model="fromAssignPlan.descript"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="my-dialog-cancel" @click="assignDialogVisible = false">取 消</el-button>
        <el-button class="my-dialog-submit" @click="submitPlanAssign">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="新增计划"
      v-dialogDrag
      :modal="false"
      center
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      customClass="el_add_dialog"
      class="myDialog insPlanDialog"
    >
      <el-form label-width="100px" size="small">
        <el-form-item label="计划名称：">
          <el-input v-model="alignNameChangeValue" @change="alignNameChange"></el-input>
        </el-form-item>
        <el-form-item label="巡检类型：">
          <el-select
            v-model="formLabelAlign.patrolType"
            placeholder="请选择"
            @change="ChangePatrolType"
            :disabled="isEditPattern"
          >
            <el-option
              v-for="item in patrolTypeData"
              :key="item.PlanTypeId"
              :label="item.PlanTypeName"
              :value="item.PlanTypeName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划类型：">
          <el-select v-model="formLabelAlign.planType" placeholder="请选择" :disabled="isEditPattern">
            <el-option
              v-for="item in planTypeData"
              :key="item.PlanTypeId"
              :label="item.PlanTypeName"
              :value="item.PlanTypeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="formLabelAlign.patrolType == '区域巡检'?'区域名称：':'路线名称：'">
          <el-select
            v-model="formLabelAlign.areaName"
            placeholder="请选择"
            :disabled="isEditPattern"
            @change="onChangeAreaName"
          >
            <el-option
              v-for="(item,indexs) in areaNameData"
              :key="indexs"
              :label="formLabelAlign.patrolType == '区域巡检'?item.PlanAreaName:item.PlanLineName"
              :value="formLabelAlign.patrolType == '区域巡检'?item.PlanAreaId:item.PlanLineId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备实体：" v-if="formLabelAlign.patrolType == '区域巡检'">
          <el-select
            multiple
            v-model="watchFacilityNew"
            placeholder="请选择"
            @change="onChangeFacility"
            :disabled="isEditPattern"
          >
            <el-option
              v-for="(item,index) in facilityData"
              :key="index"
              :label="item.layerCName"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="辅助路径：" v-if="formLabelAlign.patrolType == '区域巡检'">
          <el-input v-model="formLabelAlign.route" disabled placeholder="请在地图上选择辅助路线"></el-input>
        </el-form-item>
        <el-form-item label="是否需要反馈：">
          <el-radio v-model="formLabelAlign.isFeedback" label="1" :disabled="isEditPattern">需反馈</el-radio>
          <el-radio v-model="formLabelAlign.isFeedback" label="0" :disabled="isEditPattern">仅到位</el-radio>
        </el-form-item>
        <el-form-item label="计划类型：">
          <el-radio v-model="formLabelAlign.planTypeslect" label="1">常规</el-radio>
          <el-radio v-model="formLabelAlign.planTypeslect" label="0">临时</el-radio>
        </el-form-item>
        <el-form-item label="巡检方式：">
          <el-radio v-model="formLabelAlign.patrolWay" label="1">车巡</el-radio>
          <el-radio v-model="formLabelAlign.patrolWay" label="2">步行</el-radio>
        </el-form-item>
        <el-form-item label="计划周期：">
          <el-select v-model="formLabelAlign.planCycle" placeholder="请选择" :disabled="isEditPattern">
            <el-option
              v-for="item in planCycleData"
              :key="item.PlanCycleId"
              :label="item.PlanCycleName"
              :value="item.PlanCycleId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="my-dialog-cancel" @click="dialogVisible = false">取 消</el-button>
        <el-button class="my-dialog-submit" @click="SubmitPlanData" v-if="!isEditPattern">确 定</el-button>
        <el-button class="my-dialog-submit" @click="EditPlanManage" v-if="isEditPattern">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import _ from "lodash";
import * as EasyTable from "@common/consts/inseasyui-table";
import MapConfigure from "@common/consts/OpenLayersConfig/MapConfigure";
import { GeoTextCenter } from "@util/index";

import InsPlanLineDetail from "@api/Inspection/PlanLineDetail";
import InsPointArea from "@api/Inspection/PointArea";
import PlanManage from "@api/Inspection/PlanManage";
import InsDepartmentUserCycle from "@api/Inspection/DepartmentUserCycle";
import InsPlanType from "@api/Inspection/PlanType";
import InsPlanArea from "@api/Inspection/PlanArea";
import InsPlanLine from "@api/Inspection/PlanLine";
import TableFormTitle from "@common/components/TableFormTitle";
import InsTable from "@features/InspectionGIS/components/InsTable";
export default {
  components: {
    TableFormTitle,
    InsTable
  },
  data() {
    return {
      loading: true,
      columnListData: [], //表格全部数据
      dataTotal: 1, //表格数据个数
      currentPageNumber: 1, //表格页码
      currentPageSize: 50, //表格页size
      currentRow: null, //当前表格选中项
      flexible: false, //是否收缩左侧表格
      tableIndex: [], //多选列表
      attrList: [
        {
          text: "全部",
          value: null
        },
        {
          text: "常规",
          value: "1"
        },
        {
          text: "临时",
          value: "0"
        }
      ],
      planCycleData: [], //计划周期
      patrolTypeData: [], //巡检类型
      planTypeData: [], //计划类型
      areaNameData: [], //区域名称
      routeNameData: [], //路线名称
      facilityData: [],
      watchFacilityNew: [], //设备实体选择模板 new
      watchFacilityOld: [], //设备实体选择模板 old
      watchFacilityGeometry: [], //设备实体Geometry
      formLabelAlign: {
        patrolType: "", //巡检类型
        planType: "", //计划类型
        areaName: "", //区域名称
        routeName: "", //路线名称
        facilityNum: [], //设备实体数字集合
        facility: [], //设备实体名称集合
        route: "", //辅助路径
        isFeedback: "1", //是否反馈
        planTypeslect: "1", //计划类型
        patrolWay: "1", //巡检方式
        planCycle: "" //计划周期
      },
      assignDialogVisible: false, //计划分派
      dialogVisible: false, //新增编辑弹窗
      isEditPattern: false, //是否进入编辑模式
      //筛选
      serachCondition: null, //筛选名称
      planTypeId: null, //筛选类别
      isNomalPlan: null, //类型
      alignNameChangeValue: "", //计划名称
      alignNameChangeTime: "", //计划分派带月份
      //计划分派
      deptData: [], //部门数据
      staffData: [], //人员数据
      fromAssignDept: "", //部门
      fromAssignStaff: "", //分派人员
      fromAssignStaffId: 0, //分派人员ID
      fromAssignPlan: {
        deptId: 0, //部门ID
        starTime: new Date(), //开始时间
        endTime: "", //结束时间
        descript: "" //任务描述
      },
      FeatureData: undefined
    };
  },
  watch: {
    watchFacilityNew(newVal, oldVal) {
      //设备实体选择模板
      this.watchFacilityOld = oldVal;
      this.formLabelAlign.facility = [];
      this.formLabelAlign.facilityNum = [];
      let newLevel = _.intersection(newVal, oldVal);
      let changeFacility = [];

      if (newVal.length > oldVal.length) {
        console.log(" //设备添加实体选择模板");
        changeFacility = _.difference(newVal, newLevel)[0];
        this.formLabelAlign.facility.push(
          this.facilityData[changeFacility].layerName
        );
        this.formLabelAlign.facilityNum.push(
          this.facilityData[changeFacility].layerIndex
        );
        this.$bus.emit(
          "setSpatialSearchOnMap",
          true,
          this.formLabelAlign.facilityNum,
          this.formLabelAlign.facility,
          this.FeatureData,
          (layerIndex, PointValue) => {
            console.log("添加", layerIndex, PointValue);
            this.watchFacilityGeometry.push({
              layerIndex: layerIndex[0],
              PointValue: PointValue
            });
            console.log(this.watchFacilityGeometry);
          }
        );
      }
      if (newVal.length < oldVal.length && oldVal.length > 0) {
        changeFacility = _.difference(oldVal, newLevel)[0];
        this.formLabelAlign.facility.push(
          this.facilityData[changeFacility].layerName
        );
        this.formLabelAlign.facilityNum.push(
          this.facilityData[changeFacility].layerIndex
        );
        this.$bus.emit(
          "setSpatialSearchOnMap",
          false,
          this.formLabelAlign.facilityNum,
          this.formLabelAlign.facility,
          this.FeatureData,
          (layerIndex, PointValue) => {
            console.log("删除", layerIndex, PointValue);
            /*this.watchFacilityGeometry =  _.filter(this.watchFacilityGeometry,function(el){
              return el.layerIndex != layerIndex[0]
            })
            console.log(this.watchFacilityGeometry)*/
          }
        );
      }
    }
  },
  beforeMount() {
    this.GetEquipment();
  },
  beforeDestroy() {
    this.$bus.emit("setBusinessLayerGroupVisible", false); //关闭业务图层
    this.$bus.emit("setVectorLayerVisible", true); //关闭矢量图层
    //this.$bus.emit("setSpatialSearchLayerGroupDisplay", true, true);
  },

  mounted() {
    this.onLoadData();
    this.GetData(1);
    this.DeptData();
  },
  computed: {
    formLabelAlignName() {
      //计划名称
      return (
        this.formLabelAlign.areaName + "_" + this.formLabelAlign.patrolType
      );
    }
  },
  methods: {
    currentChange(row) {
      this.currentRow = row;
    },
    searchBtn() {
      //根据条件查询
      this.GetData(1);
    },
    //计划分派弹窗
    PlanAssign() {
      if (this.currentRow) {
        this.assignDialogVisible = true;
        this.alignNameChangeValue = this.currentRow.PlanName;
        this.alignNameChangeTime =
          new Date().getMonth() + 1 + "月_" + this.currentRow.PlanName;
        this.DeptData();
        this.AdminNameData(19);
        this.getMonthLastDay();
      } else {
        this.$message({
          type: "warning",
          message: "请选择要编辑的行",
          showClose: true
        });
      }
    },
    //确认计划分派
    submitPlanAssign() {
      PlanManage.AddPlanManageAssign(
        this.alignNameChangeTime,
        this.fromAssignDept,
        this.fromAssignPlan.deptId,
        this.fromAssignStaff,
        this.fromAssignStaffId,
        this.fromAssignPlan.starTime,
        this.fromAssignPlan.endTime,
        this.fromAssignPlan.descript,
        this.currentRow.PlanId,
        this.currentRow.PlanName
      ).then(res => {
        this.assignDialogVisible = false;
        this.$message({
          type: "success",
          message: "分派成功",
          showClose: true
        });
      });
    },

    onChangeAreaName(el) {
      this.watchFacilityNew = [];
      this.alignNameChangeValue = this.formLabelAlignName;
      //change地图区域
      if (this.formLabelAlign.patrolType == "区域巡检") {
        let newAreaSelect = _.filter(this.areaNameData, res => {
          return res.PlanAreaId == el;
        });

        let newGeoText = [JSON.parse(newAreaSelect[0].GeoText)];
        this.$bus.emit(
          "setPolygonOnMap",
          newGeoText,
          [newAreaSelect[0].PlanAreaName],
          false,
          res => {
            console.log(res);
            this.FeatureData = res;
          }
        );
        GeoTextCenter(newAreaSelect[0].GeoText, res => {
          this.$bus.emit("setCenter", res);
        });
      } else {
        //change地图路线
        let newLineSelect = _.filter(this.areaNameData, res => {
          return res.PlanLineId == el;
        })[0];
        let GeoTextDataLine = JSON.parse(newLineSelect.GeoText);
        let PlanAreaNameLine = newLineSelect.PlanLineName;
        let PatroGeoText = JSON.parse(newLineSelect.PatroGeoText);
        this.$bus.emit(
          "setLineStringOnMap",
          [GeoTextDataLine],
          [PlanAreaNameLine],
          false,
          (res, func) => {
            console.log("change地图路线");
          },
          [PatroGeoText]
        );
        GeoTextCenter(newLineSelect.GeoText, res => {
          this.$bus.emit("setCenter", res);
        });
      }
    },
    onChangeStarTime(val) {
      console.log(val);
    },
    //改变部门人员
    deptDataChange(val) {
      this.fromAssignPlan.deptId = _.filter(this.deptData, res => {
        return res.cDepName == val;
      })[0].iDeptID;
      this.AdminNameData(this.fromAssignPlan.deptId);
    },

    //查询部门信息
    DeptData() {
      InsDepartmentUserCycle.DeptData().then(res => {
        this.deptData = res.data.Data.Result;
        this.fromAssignDept = this.deptData[0].cDepName;
        this.fromAssignPlan.deptId = _.filter(this.deptData, item => {
          return item.cDepName == this.fromAssignDept;
        })[0].iDeptID;
        this.AdminNameData(this.fromAssignPlan.deptId);
      });
    },
    //查询人员信息
    AdminNameData(val) {
      InsDepartmentUserCycle.AdminNameData(val).then(res => {
        this.staffData = res.data.Data.Result;
        if (this.staffData.length > 0) {
          this.fromAssignStaff = this.staffData[0].cAdminName;
          this.fromAssignStaffId = _.filter(this.staffData, item => {
            return item.cAdminName == this.fromAssignStaff;
          })[0].iAdminID;
        } else {
          this.fromAssignStaff = "无";
          this.fromAssignStaffId = 0;
        }
      });
    },
    onLoadData() {
      this.isNomalPlan = this.attrList[0].value;
    },

    //改变计划实体
    onChangeFacility(val) {
      this.watchFacilityNew = val;
    },

    GetPlanType(numb) {
      //类别筛选
      if (numb == 0) {
        numb = null;
      }
      this.planTypeId = numb;
      this.GetData(1);
    },
    attrChange(item) {
      //类型筛选
      this.isNomalPlan = item.value;
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
      PlanManage.GetPlanManage(
        this.currentPageSize,
        this.currentPageNumber,
        this.planTypeId,
        this.isNomalPlan,
        this.serachCondition
      ).then(res => {
        this.loading = false;
        this.squareQueryRawTableData = res.data.Data.Result;
        console.log(res.data.Data.Result);
        _.forEach(this.squareQueryRawTableData, item => {
          if (!item.PlanAreaName) {
            item.PlanAreaName = item.PlanLineName;
          }
        });
        this.squareQueryTotal = res.data.Data.TotalRows;
      });
    },
    resetBtn() {
      this.attrChange({ text: "全部", value: null });
      this.serachCondition = "";
      this.planTypeId = null;
      this.GetPlanType(0);
    },
    //更改弹窗巡检类型
    ChangePatrolType(val) {
      this.$bus.emit("setBusinessLayerGroupVisible", false);
      if (this.formLabelAlign.patrolType == "区域巡检") {
        this.$bus.emit("setBusinessLayerGroupVisible", true);
        this.AddPlanData(1);
      } else {
        this.$bus.emit("setBusinessLayerGroupVisible", true);
        this.AddPlanData(2);
      }
    },

    //初始化弹窗数据
    AddPlanData(num) {
      this.GetPlanTypeRoute(num);
      this.GetPlanTypeClass(num);
      this.GetPlanCycle();
      if (num == 1) {
        this.GetRegionalData();
      } else {
        this.GetPlanLine();
      }
    },

    //添加数据
    addItem() {
      this.$bus.emit("setBusinessLayerGroupVisible", false); //关闭业务图层
      this.$bus.emit("setSpatialSearchLayerGroupDisplay", true, true);
      this.isEditPattern = false;
      this.dialogVisible = true;
      this.watchFacilityNew = [];
      this.formLabelAlign.planType = "";
      this.formLabelAlign.planCycle = "";
      this.dialogTitle = "新增";
      this.AddPlanData(1); //加载初始化数据
    },

    //提交添加数据
    SubmitPlanData() {
      this.formLabelAlign.facility = [];
      this.formLabelAlign.facilityNum = [];
      for (var i = 0; i < this.watchFacilityNew.length; i++) {
        this.formLabelAlign.facility.push(
          this.facilityData[this.watchFacilityNew[i]].layerCName
        );
        this.formLabelAlign.facilityNum.push(
          this.facilityData[this.watchFacilityNew[i]].layerIndex
        );
      }
      console.log(this.formLabelAlign.facility);
      console.log(this.formLabelAlign.facilityNum);

      let DateNew = new Date();
      let equipmentIdNameList = "";
      let equipmentIdList = "";
      if (this.formLabelAlign.facility.length > 0) {
        equipmentIdNameList = this.formLabelAlign.facility.toString();
      } else {
        equipmentIdNameList = "未填写";
      }
      if (this.formLabelAlign.facilityNum.length > 0) {
        equipmentIdList = this.formLabelAlign.facilityNum.toString();
      } else {
        equipmentIdList = "1111";
      }
      let formLabelAlignPatrolType = 0;
      if (this.formLabelAlign.patrolType == "区域巡检") {
        formLabelAlignPatrolType = 1;
      } else {
        formLabelAlignPatrolType = 2;
      }
      let formLabelAlignAreaName = "";
      let formLabelAlignrouteName = "";
      console.log(this.formLabelAlign.areaName);
      if (formLabelAlignPatrolType == 1) {
        formLabelAlignAreaName = this.formLabelAlign.areaName;
      } else {
        formLabelAlignrouteName = this.formLabelAlign.areaName;
      }

      // if (this.formLabelAlign.patrolType == "区域巡检") {
      //   formLabelAlignAreaName = _.filter(this.areaNameData, item => {
      //     return item.PlanAreaName == this.formLabelAlign.areaName;
      //   })[0].PlanAreaId;
      // } else {
      //   formLabelAlignAreaName = _.filter(this.areaNameData, item => {
      //     return item.PlanLineName == this.formLabelAlign.areaName;
      //   })[0].PlanLineId;
      // }

      if (this.formLabelAlign.planType == "") {
        this.$message({
          type: "warning",
          message: "请选择计划类型",
          showClose: true
        });
        return;
      }
      if (this.formLabelAlign.planCycle == "") {
        this.$message({
          type: "warning",
          message: "请选择计划周期",
          showClose: true
        });
        return;
      }
      //console.log(this.watchFacilityGeometry)
      let watchFacilityGeometryAdd = [];
      _.map(this.watchFacilityGeometry, res => {
        watchFacilityGeometryAdd.push(res.PointValue);
      });
      console.log(
        "watchFacilityGeometryAdd.length",
        watchFacilityGeometryAdd.length
      );
      watchFacilityGeometryAdd = watchFacilityGeometryAdd[0];

      //watchFacilityGeometryAdd = JSON.stringify(watchFacilityGeometryAdd).replace(/\[|\]/g,"");
      watchFacilityGeometryAdd = JSON.stringify(watchFacilityGeometryAdd);
      console.log(this.alignNameChangeValue);
      PlanManage.AddPlanManage(
        this.alignNameChangeValue,
        formLabelAlignPatrolType,
        this.formLabelAlign.planType, //计划类别
        this.formLabelAlign.planCycle, //计划周期
        this.formLabelAlign.isFeedback, //是否需要反馈 1反馈 0不反馈
        this.formLabelAlign.planTypeslect, //1常规 0临时
        this.formLabelAlign.patrolWay, //1车寻 2步行
        equipmentIdList, //设备实体对应的id ','分割例如 1,3
        equipmentIdNameList, //设备实体对应的Name ','分割例如 阀门,消防栓
        DateNew, //date-time                          --------未确定
        formLabelAlignAreaName, //区域id
        formLabelAlignrouteName, //路线id
        "ddddd", //string
        // '{"SmID":"136","SmX":"109.700891937","SmY":"39.581281124","EquType":1},{"SmID":"138","SmX":"109.700250492","SmY":"39.581299358","EquType":"阀门@供水设施"}' //后期添加的设备json
        watchFacilityGeometryAdd
      ).then(res => {
        this.dialogVisible = false;
        this.GetData(1);
        this.$message({
          type: "success",
          message: "新增成功",
          showClose: true
        });
        this.watchFacilityNew = [];
        this.watchFacilityGeometry = [];
      });
    },
    //编辑区域或路线
    editItem() {
      this.tableDbClick(this.currentRow);
      console.log(this.currentRow);
      if (this.currentRow) {
        this.dialogVisible = true;
        this.dialogTitle = "编辑";
        this.dialogData = this.currentRow;
        this.alignNameChangeValue = this.currentRow.PlanName;
        this.formLabelAlign.patrolType = this.currentRow.PlanTypeName;
        if (this.currentRow.PlanAreaName) {
          this.formLabelAlign.areaName = this.currentRow.PlanAreaName;
        } else {
          this.formLabelAlign.areaName = this.currentRow.PlanLineName;
        }
        this.formLabelAlign.planType = this.currentRow.PlanTypeNameLB;
        this.formLabelAlign.planCycle = this.currentRow.PlanCycleName;
        this.formLabelAlign.isFeedback =
          this.currentRow.BoolFeedBack == "需反馈" ? "1" : "0";
        this.formLabelAlign.planTypeslect =
          this.currentRow.BoolNormalPlan == "常规" ? "1" : "0";
        this.formLabelAlign.patrolWay =
          this.currentRow.MoveType == "车巡" ? "1" : "2";
        this.isEditPattern = true;
        //console.log(this.currentRow)
        this.watchFacilityNew = this.currentRow.EquipmentName.split(",");
      } else if (!this.tableIndex.length || this.tableIndex.length > 1) {
        this.$message({
          type: "warning",
          message: "请选择要编辑的数据",
          showClose: true
        });
        return;
      } else {
        this.dialogVisible = true;
        this.dialogTitle = "编辑";
      }
    },

    //确认修改
    EditPlanManage() {
      PlanManage.EditPlanManage(
        this.currentRow.PlanId,
        this.alignNameChangeValue,
        this.formLabelAlign.planTypeslect,
        this.formLabelAlign.patrolWay
      ).then(res => {
        this.dialogVisible = false;
        this.$message({
          type: "success",
          message: "编辑成功",
          showClose: true
        });
        this.GetData(1);
      });
    },
    //删除数据
    delItem() {
      if (!(this.tableIndex.length || this.currentRow)) {
        this.$message({
          type: "warning",
          message: "请选择要删除的数据",
          showClose: true
        });
        return;
      }

      let tableIndex = _.map(this.tableIndex, item => {
        return item.PlanId;
      });
      console.log(tableIndex);
      if (this.tableIndex.length) {
        this.$confirm("确认删除多选数据？")
          .then(() => {
            PlanManage.DeletePlanManage(tableIndex.join(",")).then(res => {
              this.GetData(1);
              this.$message({
                type: "success",
                message: "删除成功",
                showClose: true
              });
            });
          })
          .catch(_ => {});
        return;
      }
      this.$confirm("确认删除？")
        .then(() => {
          PlanManage.DeletePlanManage(this.currentRow.PlanId).then(res => {
            this.$message({
              type: "success",
              message: "删除成功",
              showClose: true
            });
            this.GetData(1);
          });
        })
        .catch(_ => {});
    },
    //获取巡检类型
    GetPlanTypeRoute(num) {
      InsPlanType.PlanTypeLoad().then(res => {
        this.patrolTypeData = res.data.Data.Result;
        this.formLabelAlign.patrolType = this.patrolTypeData[
          num - 1
        ].PlanTypeName;
        this.alignNameChangeValue = this.formLabelAlignName;
      });
    },

    //获取计划类别
    GetPlanTypeClass(num) {
      InsPlanType.PlanTypeSearch(20, 1, num).then(res => {
        this.planTypeData = res.data.Data.Result;
        //this.formLabelAlign.planType = this.planTypeData[0].PlanTypeName
      });
    },

    //获取区域名称
    GetRegionalData() {
      InsPlanArea.RegionalData().then(res => {
        this.areaNameData = res.data.Data.Result;
        this.formLabelAlign.areaName = res.data.Data.Result[0].PlanAreaId;
        this.alignNameChangeValue = this.formLabelAlignName;
        //地图上显示区域
        this.$bus.emit("setBusinessLayerGroupVisible", true); //开启业务图层
        let GeoTextData = JSON.parse(res.data.Data.Result[0].GeoText);
        let PlanAreaName = res.data.Data.Result[0].PlanAreaName;
        this.$bus.emit(
          "setPolygonOnMap",
          [GeoTextData],
          [PlanAreaName],
          false,
          res => {
            this.FeatureData = res;
          }
        );
        GeoTextCenter(res.data.Data.Result[0].GeoText, res => {
          this.$bus.emit("setCenter", res);
        });
      });
    },
    //获取路线名称
    GetPlanLine() {
      InsPlanLine.GetPlanLine().then(res => {
        console.log(res.data.Data.Result);
        this.$bus.emit("setBusinessLayerGroupVisible", true); //关闭业务图层
        this.areaNameData = res.data.Data.Result;
        console.log("//获取路线名称", res.data.Data.Result);
        this.formLabelAlign.areaName = this.areaNameData[0];
        this.formLabelAlign.areaName = res.data.Data.Result[0].PlanLineId;
        this.alignNameChangeValue = this.formLabelAlignName;
        //地图显示路线
        let GeoTextDataLine = JSON.parse(res.data.Data.Result[0].GeoText);
        let PlanAreaNameLine = res.data.Data.Result[0].PlanLineName;
        let PatroGeoText = JSON.parse(res.data.Data.Result[0].PatroGeoText);
        this.$bus.emit(
          "setLineStringOnMap",
          [GeoTextDataLine],
          [PlanAreaNameLine],
          false,
          (res, func) => {
            console.log(res);
          },
          [PatroGeoText]
        );

        GeoTextCenter(res.data.Data.Result[0].GeoText, res => {
          this.$bus.emit("setCenter", res);
        });
      });
    },
    //获取日期
    getMonthLastDay() {
      let newDate = new Date();
      let d = new Date(newDate);
      console.log(d);
      // 将日期设置为下月一号
      d.setMonth(d.getMonth() + 1);
      d.setDate("1");
      // 获取本月最后一天
      d.setDate(d.getDate() - 1);
      this.fromAssignPlan.endTime =
        newDate.getFullYear() +
        "-" +
        (newDate.getMonth() + 1) +
        "-" +
        d.getDate();

      this.fromAssignPlan.starTime =
        newDate.getFullYear() +
        "-" +
        (newDate.getMonth() + 1) +
        "-" +
        newDate.getDate();
    },
    //获取设备实体
    GetEquipment() {
      _.map(MapConfigure.LayerConfiguration, res => {
        if (res.isSpatialSearch) {
          this.facilityData.push(res);
        }
      });
    },
    //查询计划周期
    GetPlanCycle() {
      InsDepartmentUserCycle.GetPlanCycle().then(res => {
        this.planCycleData = res.data.Data.Result;
      });
    },
    //双击查询行信息
    tableDbClick(row) {
      this.$bus.emit("removeInteractions");
      this.$bus.emit("setVectorLayerVisible", false);
      this.$bus.emit("setTempLayerGroupVisible", false);
      this.$bus.emit("setBusinessLayerGroupVisible", false);
      this.$bus.emit("setSpatialSearchLayerGroupDisplay", true, true);
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
        this.$bus.emit("setBusinessLayerGroupVisible", true);
        if (row.PlanTypeName == "区域巡检") {
          this.areaTableDbClick(row, GeoTextData);
        }
        if (row.PlanTypeName == "路线巡检") {
          this.routeTableDbClick(row, GeoTextData);
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
          this.mapSearch(res, row);
        }
      );
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
          //this.mapSearch(res, row)
        },
        [PatroGeoText]
      );
      //画点
      InsPlanLineDetail.GetPlanLineDetail(20, 1, row.PlanLineId).then(res => {
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
      });
      GeoTextCenter(row.GeoText, res => {
        this.$bus.emit("setCenter", res);
      });
    },
    //空间查询
    mapSearch(res, row) {
      let EquipmentListData = row.EquipmentList.split(",");
      let EquipmentLayerData = [];
      for (let i = 0; i < EquipmentListData.length; i++) {
        _.map(this.facilityData, resMap => {
          if (resMap.layerIndex == Number(EquipmentListData[i])) {
            EquipmentLayerData.push(resMap.layerName);
          }
        });
      }
      for (let i = 0; i < EquipmentListData.length; i++) {
        this.$bus.emit(
          "setSpatialSearchOnMap",
          true,
          Number(EquipmentListData[i]),
          EquipmentLayerData[i],
          res
        );
      }
    }
  }
};
</script>


