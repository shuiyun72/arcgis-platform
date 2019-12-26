<template>
  <div class="initiate_table">
    <div class="header_title_">事件基本信息</div>
    <el-form label-width="80px">
      <el-row>
        <el-col :xs="12" :sm="12">
          <el-form-item label="事件来源：">
            <el-select v-model="EventSourceDataSelect" size="small">
              <el-option
                v-for="item in eventSource"
                :label="item.EventFromName"
                :value="item.EventFromId"
                :key="item.EventFromId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12">
          <el-form-item label="紧急程度：">
            <el-select v-model="UrgencyDataSelect" size="small">
              <el-option
                v-for="item in UrgencyList"
                :label="item.UrgencyName"
                :value="item.UrgencyId"
                :key="item.UrgencyId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="12" :sm="12">
          <el-form-item label="事件类型：">
            <el-select v-model="EvevtClassDataSelect" size="small" @change="EvevtClassDataSelectC">
              <el-option
                v-for="item in evevtType"
                :label="item.EventTypeName"
                :value="item.EventTypeId"
                :key="item.EventTypeId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12">
          <el-form-item label="事件内容：">
            <el-select
              v-model="EvevtContentDataSelect"
              @focus="operateEventContent"
              size="small"
            >
              <el-option
                v-for="item in EvevtContentData"
                :label="item.EventTypeName"
                :value="item.EventTypeId"
                :key="item.EventTypeId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="12" :sm="12">
          <el-form-item label="报 修 人：">
            <el-input v-model="Linkman" size="mini" placeholder="请输入报修人(10个字符内)" class="width_bi80"   maxlength=10 @blur="LinkmanC"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12">
          <el-form-item label="报修电话：">
            <el-input v-model="Phone" size="mini" placeholder="请输入报修电话" class="width_bi80" @blur="PhoneC"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :xs="12" :sm="12">
          <el-form-item label="处理部门：">
            <el-select v-model="UnitDataSelect" @change="onAttRChange" size="small">
              <el-option
                v-for="(item,index) in deptData"
                :label="item.cDepName"
                :value="item.iDeptID"
                :key="index.iDeptID"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12">
          <el-form-item label="处 理 人：">
            <el-select
              v-model="DisposeUserSelect"
              size="small"
            >
              <el-option
                v-for="item in DisposeUser"
                :label="item.cAdminName"
                :value="item.iAdminID"
                :key="item.iAdminID"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="事件地址：">
            <el-input v-model="EventAddress" size="mini" placeholder="请输入事件地址(限制50字符内)" maxlength=50></el-input>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
        <el-col :span="24">
          <el-form-item label="位置坐标：">
            <el-col :span="7"> 
              <el-input v-model="Coordinate.x" size="mini" maxlength=20 type="number"></el-input>
            </el-col>
            <el-col :span="1">
              <span>_</span>
            </el-col>
            <el-col :span="7">
              <el-input v-model="Coordinate.y" size="mini" maxlength=20 type="number"></el-input>
            </el-col>
            <el-col :span="4" :offset="1">
              <el-button size="mini" class="my-setCoordinate" @click="settingPosition">设定位置</el-button>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24" style="height: auto;">
          <el-form-item label="事件备注：">
            <el-input
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 20}"
              placeholder="请输入内容(限制160字符内)"
              v-model="EventNote"
              maxlength=160
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row type="flex" justify="end">
      <el-button size="mini" class="my-evenReport" @click="eventUpload">事件上报</el-button>
    </el-row>
  </div>
</template>

<script>
import * as disposeData from "../config.js";
// 上报部门
import MaDepartmentUserCycle from "@api/Inspection/DepartmentUserCycle";
// 事件来源
import EventStartForMaintain from "@api/Maintain/EventStartForMaintain";
// 事件类型
import EvenType from "@api/Inspection/EvenType";
// 事件查询
import EventManageForMaintain from "@api/Maintain/EventManageForMaintain";
export default {
  name: "Initiate",
  data() {
    return {
      EventSourceDataSelect: "",
      EventSourceData: [], //事件来源
      UrgencyDataSelect: "",
      UrgencyData: [], //进阶程度
      EvevtClassDataSelect: "",
      EvevtClassData: [], //事件类型
      EvevtContentDataSelect: "",
      EvevtContentData: [], //事件内容
      Linkman: "", //联系人
      Phone: "", //联系电话
      EventAddress: "",
      Coordinate: {
        x: "",
        y: ""
      },
      UnitDataSelect: "", //处理部门
      UnitData: [],
      DisposeUserSelect: "", //处理人
      DisposeUser: [],
      EventNote: "",
      evevtType: [], //事件类型
      eventSource: [], //事件类型
      deptData: [], //事件类型
      UrgencyList: [], //紧急程度
      userDeptID: "" //部门id
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      //初始化
      this.EventSourceData = ["接电上报", "部门上报", "未知"];
      this.UrgencyData = ["一般", "紧急", "非常紧急"];
      this.axiosDeptData();
      this.axiosEventFrom();
      this.axiosEventType();
      this.GetUrgencyList();
    },
    //手机号码验证
    PhoneC(){
      if(!/^1[345678]\d{9}$/.test(this.Phone)){
        this.$message("请输入正确的手机号码");
        this.Phone = "";
      }
    },
    //报修人
    LinkmanC(){
      if(/[^\u4e00-\u9fa5a-zA-Z\d]+/.test(this.Linkman)){
        this.$message("请输入正确的报修人");
        this.Linkman = "";
      }
    },
    EvevtClassDataSelectC(){
      this.EvevtContentDataSelect = "";
    },
    // 事件上报
    eventUpload() {
      this.$emit("eventUpload");
      if (!this.EventSourceDataSelect) {
        this.$message("请选择事件来源");
        return;
      }
      if (!this.UrgencyDataSelect) {
        this.$message("请选择紧急程度");
        return;
      }
      if (!this.EvevtClassDataSelect) {
        this.$message("请选择事件类型");
        return;
      }
      if (!this.EvevtContentDataSelect) {
        this.$message("请选择事件内容");
        return;
      }
      if (!this.Linkman) {
        this.$message("请输入联系人");
        return;
      }
      if (!this.Phone) {
        this.$message("请输入电话");
        return;
      }
      if (!this.EventAddress) {
        this.$message("请选择事件地址");
        return;
      }
      if (!this.UnitDataSelect) {
        this.$message("请选择处理部门");
        return;
      }
      if (!this.DisposeUserSelect) {
        this.$message("请选择处理人");
        return;
      }
      if (!this.Coordinate.x) {
        this.$message("请输入位置x坐标");
        return;
      }
      if (!this.Coordinate.y) {
        this.$message("请输入位置y坐标");
        return;
      }
      let admin = JSON.parse(localStorage.getItem("iAdminID"));
      let adminName = admin.cAdminName;
      let adminID = admin.iAdminID;
      let depid = admin.iDeptID;
      let base64Img = ["|"];
      EventStartForMaintain.eventUpload(
        adminID,
        adminName,
        depid,
        this.EventSourceDataSelect,
        this.UrgencyDataSelect,
        this.EvevtClassDataSelect,
        this.EvevtContentDataSelect,
        this.Linkman,
        this.Phone,
        this.EventAddress,
        this.Coordinate.x,
        this.Coordinate.y,
        this.UnitDataSelect,
        this.DisposeUserSelect,
        this.EventNote,
        base64Img
      ).then(res => {
        this.$message("上报成功");
        //成功后跳转待办处理
        this.$router.push({ name: "MaSelfDispose" });
      });
    },
    // //上传位置
    // settingPosition(){
    //   this.$bus.emit("OffPointermoveControl");
    //   this.$bus.emit('removeInteractions')
    //   this.$bus.emit("addInteractions", "Point", false, res => {
    //   this.Coordinate = {"x":res[0],"y":res[0]}
    //   });
    // },
    //上传位置
    settingPosition() {
      this.$bus.emit("addInteractions", "Point", false, res => {
        this.Coordinate = { x: res[0], y: res[1] };
        this.$bus.emit(
          "setPointOnMap",
          [res],
          false,
          () => {},
          "RoutePoint",
          "desript"
        );
        this.$bus.emit("setCenter", res);
      });
    },
    //查询部门数据
    axiosDeptData() {
      MaDepartmentUserCycle.DeptData().then(res => {
        this.deptData = res.data.Data.Result;
      });
    },
    //查询事件来源数据
    axiosEventFrom() {
      EventStartForMaintain.GetEventFromComboBoxList().then(res => {
        this.eventSource = res.data.Data.Result;
      });
    },
    //查询事件类型数据
    axiosEventType() {
      let pageSize = 1;
      let pageNumber = 100;
      EvenType.EventTypeAll(pageNumber, pageSize).then(res => {
        this.evevtType = res.data.Data.Result;
      });
    },
    // 查询紧急程度数据
    GetUrgencyList() {
      EventStartForMaintain.GetUrgencyComboBoxList().then(res => {
        this.UrgencyList = res.data.Data.Result;
      });
    },
    // 获取事件内容
    getEventContent(EventTypeId) {
      EventStartForMaintain.EventContent(EventTypeId).then(res => {
        this.EvevtContentData = res.data.Data.Result;
      });
    },
    operateEventContent() {
      if (!this.EvevtClassDataSelect) { 
        this.$message("请先选择事件类型");
      } else {
        this.getEventContent(this.EvevtClassDataSelect);
      }
    },
    // 获取处理人
    getUser(depid) {
      EventStartForMaintain.GetUserComboboxListNoDelete(depid).then(res => {
        this.DisposeUser = res.data.Data.Result;
      });
    },
    onAttRChange() {
      this.DisposeUserSelect = "";
      this.getUser(this.UnitDataSelect);
    }
  }
};
</script>