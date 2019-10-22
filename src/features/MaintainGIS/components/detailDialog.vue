<template>
  <el-dialog
    v-loading="loading"
    class="myDialog"
    :visible.sync="centerDialogVisible"
    :before-close="handleClose"
    width="780px"
    custom-class="order_detail_dialog"
    title="工单详情"
    center
  >
    <div class="step_hidden_left_title" v-if="currentRow">
      <span class="header_title">处理状态：</span>
      <el-steps :active="currentRow.OperId" simple class="table-state">
        <template v-if="currentRow.OperId != 11">
          <el-step
            v-for=" ( item , index ) in FlowPath"
            :key="item"
            :title="item.OperName"
            :class="{normal:index > currentRow.OperId}"
          >
            <span
              class="teble-state-span"
              slot="title"
              :style="{color: '#fff' ,'background-color':( index <= currentRow.OperId - 1 ? colorList[index] : '#abb0b3')}"
              @click="handleClick(item.rank - 1)"
            >{{item.OperName}}</span>
          </el-step>
        </template>
        <template v-else>
          <el-step
            v-for=" ( item , index ) in FlowPath"
            :key="item"
            :title="item.OperName"
            :class="{normal:index > currentRow.OperId}"
          >
            <span
              class="teble-state-span"
              slot="title"
              :style="{color: '#fff' ,'background-color':( index <= 0 ? colorList[index] : '#abb0b3')}"
              @click="handleClick(item.rank - 1)"
            >{{item.OperName}}</span>
          </el-step>
        </template>
      </el-steps>
    </div>
    <div v-if="currentRow.isBtn">
      <!--上报  -->
      <div v-if="currentRow.OperId == -1" class="operateBtnPar">
        <el-button type="info" class="operateBtn" @click="zhuanP(0)">删除</el-button>
        <el-button type="info" class="operateBtn" @click="zhuanP(1)">转派</el-button>
      </div>
      <!-- 处理 -->
      <div v-if="currentRow.OperId == 11" class="operateBtnPar">
        <!-- <el-button type="info" class="operateBtn fenpai" @click="zhuanP(2)">回复</el-button> -->
        <el-button
          type="info"
          v-if="currentRow.ExecPersonId == currentRow.adminID"
          class="operateBtn"
          @click="fenpai"
        >分派工单</el-button>
        <!-- <el-button type="info" class="operateBtn" @click="zhuanP(4)">退回</el-button> -->
      </div>

      <!-- 分派 -->
      <div v-if="currentRow.OperId == 2" class="operateBtnPar">
        <el-button
          type="info"
          v-if="currentRow.ExecPersonId == currentRow.adminID"
          class="operateBtn"
          @click="acceptOrder"
        >接单</el-button>
      </div>

      <!-- 接受 -->
      <div v-if="currentRow.OperId == 3" class="operateBtnPar">
        <template v-if="currentRow.IsValid != 5">
          <el-button
            type="info"
            v-if="currentRow.ExecPersonId == currentRow.adminID"
            class="operateBtn"
            @click="arrive"
          >到场</el-button>
          <el-button
            type="info"
            v-if="currentRow.ExecPersonId == currentRow.adminID"
            class="operateBtn"
            @click="exitOrder"
          >退单</el-button>
          <el-button
            type="info"
            v-if="currentRow.ExecPersonId == currentRow.adminID"
            class="operateBtn"
            @click="timeout"
          >延期</el-button>
        </template>
        <template v-else>
          <el-button
            v-if="localDispathPersonID == currentRow.adminID"
            type="info"
            class="operateBtn"
            @click="timeout"
          >延期确认</el-button>
        </template>
      </div>

      <!-- 到场 -->
      <div v-if="currentRow.OperId == 4" class="operateBtnPar">
        <template v-if="currentRow.IsValid != 5">
          <el-button
            type="info"
            v-if="currentRow.ExecPersonId == currentRow.adminID"
            class="operateBtn"
            @click="operate"
          >处置</el-button>
          <el-button
            type="info"
            v-if="currentRow.ExecPersonId == currentRow.adminID"
            class="operateBtn"
            @click="exitOrder"
          >退单</el-button>
          <el-button
            type="info"
            v-if="currentRow.ExecPersonId == currentRow.adminID"
            class="operateBtn"
            @click="timeout"
          >延期</el-button>
        </template>
        <template v-else>
          <el-button
            v-if="localDispathPersonID == currentRow.adminID"
            type="info"
            class="operateBtn"
            @click="timeout"
          >延期确认</el-button>
        </template>
      </div>
      <!-- 处置 -->
      <div v-if="currentRow.OperId == 5" class="operateBtnPar">
        <template v-if="currentRow.IsValid != 5">
          <el-button
            type="info"
            v-if="currentRow.ExecPersonId == currentRow.adminID"
            class="operateBtn"
            @click="finish"
          >完工</el-button>
          <el-button
            type="info"
            v-if="currentRow.ExecPersonId == currentRow.adminID"
            class="operateBtn"
            @click="exitOrder"
          >退单</el-button>
          <el-button
            type="info"
            v-if="currentRow.ExecPersonId == currentRow.adminID"
            class="operateBtn"
            @click="timeout"
          >延期</el-button>
        </template>
        <template v-else>
          <el-button
            v-if="localDispathPersonID == currentRow.adminID"
            type="info"
            class="operateBtn"
            @click="timeout"
          >延期确认</el-button>
        </template>
      </div>
      <!-- 审核 -->
      <div v-if="currentRow.OperId == 6" class="operateBtnPar">
        <el-button
          type="info"
          v-if="currentRow.ExecPersonId == currentRow.adminID"
          class="operateBtn fenpai"
          @click="examine"
        >审核</el-button>
      </div>
    </div>
    <!-- 完工 -->
    <!-- 审核 -->
    <!-- 完成 -->
    <!-- 转派 -->
    <!-- 转派 -->
    <el-dialog
      title="转派"
      :visible.sync="centerDialog"
      width="20%"
      center
      append-to-body
      customClass="el_add_dialog"
      class="myDialog insPlanDialog"
    >
      <el-form label-width="100px" size="small">
        <el-form-item label="转派部门:">
          <el-select v-model="zpUserID" @focus="zpUserChange" placeholder="请选择">
            <el-option
              v-for="item in optionsZpUser"
              :key="item.iAdminID"
              :label="item.cAdminName"
              :value="item.iAdminID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转派人员:">
          <el-select v-model="zpUserID" @focus="zpUserChange" placeholder="请选择">
            <el-option
              v-for="item in optionsZpUser"
              :key="item.iAdminID"
              :label="item.cAdminName"
              :value="item.iAdminID"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="my-dialog-cancel" @click="centerDialog = false">取 消</el-button>
        <el-button
          class="my-dialog-submit"
          type="primary"
          @click="zhuanPSure"
          :loading="sunBtnLoad"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 回复 -->
    <el-dialog
      title="回复"
      :visible.sync="backDialog"
      center
      append-to-body
      customClass="el_add_dialog"
      class="myDialog insPlanDialog"
    >
      <el-form>
        <el-form-item label="回复内容：">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="backInfo"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="my-dialog-cancel" @click="backDialog = false">取 消</el-button>
        <el-button
          class="my-dialog-submit"
          type="primary"
          @click="backSure"
          :loading="sunBtnLoad"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分派 -->
    <el-dialog
      title="分派"
      :visible.sync="fenpaiDialog"
      center
      append-to-body
      customClass="el_add_dialog"
      class="myDialog insPlanDialog"
    >
      <el-form label-width="100px" size="small">
        <el-form-item label="分派部门:">
          <el-select v-model="fpID" @change="zpChange" placeholder="请选择">
            <el-option
              v-for="item in optionsZpPart"
              :key="item.iDeptID"
              :label="item.cDepName"
              :value="item.iDeptID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分派人员:">
          <el-select v-model="fpUserID" @focus="fpUserChange" placeholder="请选择">
            <el-option
              v-for="item in optionsZpUser"
              :key="item.iAdminID"
              :label="item.cAdminName"
              :value="item.iAdminID"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="my-dialog-cancel" @click="fenpaiDialog = false">取 消</el-button>
        <el-button
          class="my-dialog-submit"
          type="primary"
          @click="fenpaiSure"
          :loading="sunBtnLoad"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 回复 -->
    <el-dialog
      title="退回"
      :visible.sync="goBackDialog"
      center
      append-to-body
      customClass="el_add_dialog"
      class="myDialog insPlanDialog"
    >
      <el-form>
        <el-form-item label="退回内容：">
          <el-input :rows="5" placeholder="请输入内容" v-model="goBackInfo"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="my-dialog-cancel" @click="goBackDialog = false">取 消</el-button>
        <el-button
          class="my-dialog-submit"
          type="primary"
          @click="goBackSure"
          :loading="sunBtnLoad"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 退单 -->
    <el-dialog
      title="退单备注"
      :visible.sync="exitOrderDialog"
      center
      append-to-body
      customClass="el_add_dialog"
      class="myDialog insPlanDialog"
    >
      <el-form>
        <el-form-item label="退单内容：">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="exitOrderInfo"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="my-dialog-cancel" @click="exitOrderDialog = false">取 消</el-button>
        <el-button
          class="my-dialog-submit"
          type="primary"
          @click="exitOrderSure"
          :loading="sunBtnLoad"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 延期or延期确认 -->
    <el-dialog
      :title="(localDispathPersonID == currentRow.adminID && currentRow.IsValid == 5) ?'延期确认':'延期'"
      :visible.sync="timeoutDialog"
      center
      append-to-body
      customClass="el_add_dialog"
      class="myDialog insPlanDialog"
    >
      <el-form>
        <el-form-item label="延时完成日期:">
          <el-date-picker
            v-model="timeoutValue"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="IsTimeoutSure"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="延时完成内容:">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="timeoutContent"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="my-dialog-cancel"
          @click="WorkListDelayReturn"
          v-if="localDispathPersonID == currentRow.adminID && currentRow.IsValid == 5"
          :loading="sunBtnLoad"
        >退回</el-button>
        <el-button class="my-dialog-cancel" @click="timeoutDialog = false" v-else>取 消</el-button>
        <el-button
          class="my-dialog-submit"
          type="primary"
          @click="timeoutSure"
          :loading="sunBtnLoad"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 审核 -->
    <el-dialog
      title="审核"
      :visible.sync="examineDialog"
      center
      append-to-body
      customClass="el_add_dialog_new"
      class="myDialog insPlanDialog"
    >
      <el-form>
        <el-form-item label="反馈内容：">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="examineContent"></el-input>
        </el-form-item>
        <el-form-item label="满意度：">
          <el-radio-group v-model="radio">
            <el-radio label="非常满意" value="非常满意"></el-radio>
            <el-radio label="满意" value="满意"></el-radio>
            <el-radio label="不满意" value="不满意"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button class="my-dialog-cancel" @click="examineDialog = false">取 消</el-button>
        <el-button
          class="my-dialog-submit"
          type="primary"
          @click="examineSure"
          :loading="sunBtnLoad"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-tabs v-model="DialogTab" type="card" @tab-click="changeDialog">
      <el-tab-pane label="工单处理信息" name="first" class="event_order_pane">
        <!-- <el-scrollbar>
            <dialog-report class="event_order_pane-item" :color="colorList[0]" ref="report" :currentRow="currentRow"></dialog-report>
            <dialog-dispose :TitleName="'处理'" class="event_order_pane-item" :color="colorList[1]" :currentRow="currentRow"></dialog-dispose>
            <dialog-dispose :TitleName="'分派'" class="event_order_pane-item" :color="colorList[2]" :currentRow="currentRow"></dialog-dispose>
            <dialog-dispose :TitleName="'接受'" class="event_order_pane-item" :color="colorList[3]" :currentRow="currentRow"></dialog-dispose>
            <dialog-dispose :TitleName="'到场'" class="event_order_pane-item" :color="colorList[4]" :currentRow="currentRow"></dialog-dispose>
            <dialog-dispose :TitleName="'处置'" class="event_order_pane-item" :color="colorList[5]" :currentRow="currentRow"></dialog-dispose>
            <dialog-dispose :TitleName="'完工'" class="event_order_pane-item" :color="colorList[6]" :currentRow="currentRow"></dialog-dispose>
        <dialog-dispose :TitleName="'审核'" class="event_order_pane-item" :color="colorList[7]" :currentRow="currentRow"></dialog-dispose>-->

        <el-scrollbar id="scrollbarM">
          <dialog-report
            class="event_order_pane-item"
            :color="colorList[0]"
            :currentRow="currentRow"
          ></dialog-report>

          <template>
            <template v-for="Statu in stepDetail">
              <dialog-dispose
                class="event_order_pane-item"
                :TitleName=" Statu.OperName "
                :colorList="colorList"
                :currentRow="currentRow"
                :stepDetail="Statu"
                :key="Statu.HistoryId"
              ></dialog-dispose>
            </template>
          </template>
          <!-- <dialog-dispose :TitleName="'分派'" v-if="currentRow.OperId == 11" class="event_order_pane-item" :color="colorList[2]" :stepDetail="stepDetail"></dialog-dispose> -->
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="处理位置" name="second" class="event_order_pane">
        <div id="MDialogDetailMap" style="height: 50vh;"></div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import _ from "lodash";
import BaseMap from "@services/OpenLayers/BaseMap";
import MapNavigate from "@services/OpenLayers/MapNavigate";
//弹窗组件
import DialogReport from "../components/DialogReport";
import DialogDispose from "../components/DialogDispose";
//Api
import MaApiStatus from "@api/Maintain/GetStatusForMantain";
//事件查询
import EventManageForMaintain from "@api/Maintain/EventManageForMaintain";
import EventStartForMaintain from "@api/Maintain/EventStartForMaintain";
export default {
  components: {
    DialogReport,
    DialogDispose
  },
  props: ["centerDialogVisible", "currentRow"],
  created() {
    this.init();
  },
  data() {
    return {
      stepDetail: [],
      loading: false,
      orderDetail: [],
      DialogTab: "first",
      // colorList: [
      //   "#cd3e3e",
      //   "#3289cc",
      //   "#c67a3c",
      //   "#2ca179",
      //   "#3289cc",
      //   "#3289cc",
      //   "#cd3e3e",
      //   "#c67a3c",
      //   "#2ca179",
      //   "#505761"
      // ], //step颜色列
      colorList: [
        "#2e8ed7",
        "#2e8ed7",
        "#2e8ed7",
        "#2e8ed7",
        "#2e8ed7",
        "#2e8ed7",
        "#2e8ed7",
        "#1ead7c",
        "#1ead7c",
        "#1ead7c"
      ],
      FlowPath: [],
      fenpaiDialog: false, //分派
      exitOrderDialog: false, //退单
      centerDialog: false, //转派
      backDialog: false, //回复
      timeoutDialog: false, //延期
      examineDialog: false, //审核
      optionsZpPart: [], //转派部门
      optionsZpUser: [], //转派人员
      backInfo: "", //回复内容
      goBackInfo: "", //退回内容
      exitOrderInfo: "", //退回内容
      timeoutValue: "", //延期时间
      timeoutContent: "", //延期内容
      examineContent: "", //审核内容
      zpID: "", //转派部门id
      fpID: "", //转派部门id
      zpUserID: "", //转派人员id
      fpUserID: "", //转派人员id,
      adminID: "", //登陆人id
      adminName: "", //登陆人姓名
      radio: "非常满意",
      sunBtnLoad: false, //form提交加载
      IsTimeoutSure:true
    };
  },
  watch: {
    centerDialogVisible() {
      if (this.centerDialogVisible) {
        this.loadData();
        this.mapCreat();
      } else {
        this.DialogTab = "first";
      }
    }
  },
  //切换数据/地图
  methods: {
    loadData(id) {
      let EventID = this.currentRow.EventID || id;
      this.loading = true;
      EventManageForMaintain.GetEventWorkorder(EventID).then(res => {
        this.stepDetail = res.data.Data.Result;
        if (this.stepDetail.length > 0) {
          this.localDispathPersonID = this.stepDetail[0].DispatchPersonID;
          _.each(this.stepDetail, (res, index) => {
            this.stepDetail[index].ExecUpDateTime = this.stepDetail[index].ExecUpDateTime.replace(/T/, " ");
            if(this.stepDetail[index].PostponeTime){
              this.stepDetail[index].PostponeTime = this.stepDetail[index].PostponeTime.replace(/T/, " ");
            }
            if (this.stepDetail[index].IsValid == 5 || this.stepDetail[index].IsValid == 6) {
              this.timeoutValue = this.stepDetail[index].PostponeTime;
              this.timeoutContent = this.stepDetail[index].OperRemarks;
            }
          });
        }
        this.loading = false;
      });
    },
    //声明地图对象 放点
    mapCreat() {
      this.$nextTick(() => {
        if (!(this.centerDialogVisible && this.DialogTab === "second")) {
          return;
        }
        let x = this.currentRow.EventX || 113.52334821796903;
        let y = this.currentRow.EventY || 34.77318724078378;
        if (!this.MapMethods) {
          let _mapController = new BaseMap();
          _mapController
            .createMap("MDialogDetailMap")
            .then(ResultObject => {
              this.MapMethods = new MapNavigate(ResultObject);
              this.MapMethods.setPointOnMap(
                [[x, y]],
                false,
                () => {},
                "RoutePoint",
                "desript"
              );
              this.MapMethods.setCenter([x, y],8);
              // this.MapMethods.pointermoveControl(
              //   document.getElementById("popup"),
              //   (res, title) => {
              //     console.log(this.dialogType)
              //     this.dialogShow = 'mapLayer'
              //     // document.getElementById('popup').inner
              //     this.htmlString = res;
              //     this.layerTtitle = title;
              //   }
              // );
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          this.MapMethods.setPointOnMap(
            [[x, y]],
            false,
            () => {},
            "RoutePoint",
            "desript"
          );
          this.MapMethods.setCenter([x, y],8);
        }
      });
    },
    handleClick(num) {
      let scrollbarFromS = document.querySelectorAll(
        "#scrollbarM .el-scrollbar__view .el-form"
      );
      document
        .getElementById("scrollbarM")
        .getElementsByClassName("el-scrollbar__wrap")[0].scrollTop =
        scrollbarFromS[num].offsetTop;
    },
    //切换数据/地图
    changeDialog(tab, event) {
      this.mapCreat();
    },
    init() {
      let admin = JSON.parse(localStorage.getItem("iAdminID"));
      this.adminID = admin.iAdminID;
      this.adminName = admin.cAdminName;
      if (this.FlowPath.length) {
        return;
      }
      MaApiStatus.GetStatusForMantain().then(res => {
        this.FlowPath = res.data.Data.Result;
        // 删除处理
        this.FlowPath.shift();
        this.FlowPath.unshift({
          OperId: 0,
          OperName: "上报",
          OperName2: "上报",
          rank: 0
        });
        // this.FlowPath.push({
        //   OperId: 8,
        //   OperName: "完成",
        //   OperName2: "完成",
        //   rank: 8
        // });
      });
    },
    handleClose() {
      this.$emit("update:centerDialogVisible", false);
      document
        .getElementById("scrollbarM")
        .getElementsByClassName("el-scrollbar__wrap")[0].scrollTop = 0;
    },
    // 专卖
    dakai() {
      this.centerDialog = true;
      this.getzhuanPpart();
    },
    //回复
    back() {
      this.backDialog = true;
    },
    //退回
    goBack() {
      this.goBackDialog = true;
    },
    exitOrder() {
      this.exitOrderDialog = true;
    },
    // 接单
    acceptOrder() {
      this.sunBtnLoad = true;
      EventManageForMaintain.WorkListReceipt(
        this.currentRow.EventID,
        this.currentRow.ExecDetpID,
        this.currentRow.ExecPersonId,
        this.currentRow.OrderId
      ).then(res => {
        this.sunBtnLoad = false;
        this.$message("接单成功");
        this.loadData();
        this.$parent.getOrder();
        this.$parent.SubmitResult();
      });
    },
    // 到场
    arrive() {
      this.sunBtnLoad = true;
      EventManageForMaintain.WorkListPresent(
        this.currentRow.EventID,
        this.currentRow.ExecDetpID,
        this.currentRow.ExecPersonId,
        this.currentRow.OrderId
      ).then(res => {
        this.sunBtnLoad = false;
        this.$message("到场成功");
        this.loadData();
        this.$parent.getOrder();
        this.$parent.SubmitResult();
      });
    },
    // 退单
    exitOrderSure() {
      this.timeoutDialog = false;
      this.sunBtnLoad = true;
      EventManageForMaintain.WordListBackExec(
        this.currentRow.EventID,
        this.currentRow.OrderId,
        this.adminID,
        this.exitOrderInfo,
        this.currentRow.DeptId
      ).then(res => {
        this.sunBtnLoad = false;
        this.$message("退单成功");
        this.loadData();
        this.$parent.getOrder();
        this.$parent.SubmitResult();
        this.exitOrderDialog = false;
      });
    },
    // 延期
    timeout() {
      this.timeoutDialog = true;
      this.IsTimeoutSure = this.currentRow.IsValid == 5 ?  true : false;
    },
    // 处置
    operate() {
      this.sunBtnLoad = true;
      EventManageForMaintain.WorkListChuZhi(
        this.currentRow.EventID,
        this.currentRow.ExecDetpID,
        this.currentRow.ExecPersonId,
        this.currentRow.OrderId
      ).then(res => {
        this.sunBtnLoad = false;
        this.$message("处置成功");
        this.loadData();
        this.$parent.getOrder();
        this.$parent.SubmitResult();
      });
    },
    // 完工
    finish() {
      this.sunBtnLoad = true;
      EventManageForMaintain.WorkListFinished(
        this.currentRow.EventID,
        this.currentRow.DeptId,
        this.adminID,
        this.currentRow.OrderId
      ).then(res => {
        this.sunBtnLoad = false;
        this.$message("完工成功");
        this.loadData();
        this.$parent.getOrder();
        this.$parent.SubmitResult();
      });
    },
    // 审核
    examine() {
      this.examineDialog = true;
    },
    timeoutSure(num) {
      if (!this.timeoutValue) {
        this.$message("请选择延期日期");
        return;
      }
      if (!this.timeoutContent) {
        this.$message("请选择延期内容");
        return;
      }
      // 5延期确认
      if (this.currentRow.IsValid != 5) {
        this.sunBtnLoad = true;
        EventManageForMaintain.WordListDelay(
          this.currentRow.EventID,
          this.currentRow.OrderId,
          this.timeoutContent,
          this.timeoutValue,
          this.currentRow.ExecDetpID,
          this.adminID
        ).then(res => {
          this.sunBtnLoad = false;
          this.$message("延期成功");
          this.loadData();
          this.$parent.getOrder();
          this.$parent.SubmitResult();
          this.timeoutDialog = false;
        });
      } else {
        this.sunBtnLoad = true;
        EventManageForMaintain.WorkListDelayExec(
          this.currentRow.EventID,
          this.currentRow.OrderId,
          this.timeoutValue,
          this.currentRow.DeptId,
          this.adminID,
          this.timeoutContent,
        ).then(res => {
          this.sunBtnLoad = false;
          this.$message("延期成功");
          this.loadData();
          this.$parent.getOrder();
          this.$parent.SubmitResult();
          this.timeoutDialog = false;
        });
      }
    },
    // 审核确认
    examineSure() {
      if (!this.examineContent) {
        this.$message("请输入反馈内容");
        return;
      }
      if (!this.radio) {
        this.$message("请选择满意度");
        return;
      }
      this.sunBtnLoad = true;
      EventManageForMaintain.WorkListAudit(
        this.currentRow.EventID,
        this.currentRow.OrderId,
        this.currentRow.DeptId,
        this.adminID,
        this.examineContent,
        this.radio
      ).then(res => {
        this.sunBtnLoad = false;
        this.$message("审核成功");
        this.loadData();
        this.$parent.getOrder();
        this.$parent.SubmitResult();
        this.examineDialog = false;
      });
    },
    //延期退回
    WorkListDelayReturn(){
      if(!this.timeoutContent){
        this.$message("请输入退回内容");
      }
      this.IsTimeoutSure = true;
      this.sunBtnLoad = true;
      EventManageForMaintain.WorkListDelayReturn(
        this.currentRow.EventID,
        this.currentRow.OrderId,
        this.timeoutValue,
        this.currentRow.DeptId,
        this.adminID,
        this.timeoutContent,
      ).then(res=>{
        this.sunBtnLoad = false;
        this.$message("退回成功");
        this.loadData();
        this.$parent.getOrder();
        this.$parent.SubmitResult();
        this.timeoutDialog = false;
      })
    },
    backSure() {
      if (this.backInfo) {
        this.sunBtnLoad = true;
        EventManageForMaintain.WorkListEventReply(
          this.currentRow.EventID,
          this.backInfo
        ).then(res => {
          this.sunBtnLoad = false;
          this.$message("回复成功");
          this.backDialog = false;
          this.loadData();
          this.$parent.getOrder();
          this.$parent.SubmitResult();
        });
      } else {
        this.$message("请输入回复内容");
      }
    },
    goBackSure() {
      if (this.goBackInfo) {
        this.sunBtnLoad = true;
        EventManageForMaintain.WorkListBackToOper(
          this.currentRow.EventID,
          this.adminID,
          this.goBackInfo,
          this.currentRow.DispatchPersonID,
          this.currentRow.DeptId
        ).then(res => {
          this.sunBtnLoad = false;
          this.goBackDialog = false;
        });
      } else {
        this.$message("请输入退回内容");
      }
    },
    //分派
    fenpai() {
      this.fenpaiDialog = true;
      this.fpID = "";
      this.fpUserID = "";
      this.getzhuanPpart();
    },
    fenpaiSure() {
      if (!this.fpID) {
        this.$message("请选择分派部门");
        return;
      }
      if (!this.fpUserID) {
        this.$message("请选择分派人员");
        return;
      }
      localStorage.setItem("fpDeptID", this.fpUserID);
      let hour = this.currentRow.ExecTime;
      if (isNaN(hour)) {
        this.hourUp = parseFloat(hour.slice(0, 2));
      } else {
        this.hourUp = hour;
      }
      this.sunBtnLoad = true;
      EventManageForMaintain.WorkListAssign(
        this.currentRow.EventID,
        this.fpID,
        this.fpUserID,
        this.adminID,
        this.hourUp,
        this.currentRow.OrderId
      ).then(res => {
        this.sunBtnLoad = false;
        this.$message("分派成功");
        this.loadData();
        this.$parent.getOrder();
        this.$parent.SubmitResult();
        this.fenpaiDialog = false;
      });
    },
    zhuanPSure() {
      // qingqiu
      if (!this.zpID) {
        this.$message("请选择转派部门");
        return;
      }
      if (!this.zpUserID) {
        this.$message("请选择转派人员");
        return;
      }
      this.sunBtnLoad = true;
      EventManageForMaintain.WorkListReAssign(
        this.currentRow.EventID,
        this.currentRow.ExecDetpID,
        this.currentRow.ExecPersonId,
        this.currentRow.DispatchPersonID,
        this.adminID
      ).then(res => {
        this.sunBtnLoad = false;
        this.$message("转派成功");
        this.loadData();
        this.$parent.getOrder();
        this.$parent.SubmitResult();
        this.centerDialog = false;
      });
    },
    zpChange(item) {
      this.fpUserID = "";
      this.getzhuanPuser(item);
    },
    zpUserChange() {
      if (this.zpID) {
        this.getzhuanPuser(this.zpID);
      } else {
        this.$message("请先选择转派部门");
      }
    },
    fpUserChange() {
      if (this.fpID) {
        this.getzhuanPuser(this.fpID);
      } else {
        this.$message("请先选择分派部门");
      }
    },
    // 获取转派部门
    getzhuanPpart() {
      EventStartForMaintain.excelPart().then(res => {
        this.optionsZpPart = res.data.Data.Result;
      });
    },
    // 获取转派人员
    getzhuanPuser(deptId) {
      EventStartForMaintain.GetUserComboboxListNoDelete(deptId).then(res => {
        this.optionsZpUser = res.data.Data.Result;
      });
    }
  }
};
</script>
<style scoped>
#scrollbarM .el-scrollbar__view {
  padding-bottom: 400px;
}
.operateBtnPar {
  position: absolute;
  right: 20px;
  top: 90px;
  z-index: 1000;
}
.operateBtn {
  float: right;
  margin-left: 10px;
  border: none;
  width: 69px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  background: #3289cc;
  border-color: #3289cc;
  color: #fff;
  border-radius: 2px;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 190px;
}

.dialog-table-lable {
  width: 82px !important;
}

.el_add_dialog_new {
  width: 400px;
}

/* .el-input__icon {
  line-height: 1;
} */

/* .el-dialog__headerbtn{
  top: 14px;
}

 .el-dialog__header {
    text-align: left;
    border-radius: 2px 2px 0 0;
    background: #404656;
    text-align: left;
    height: 42px;
    line-height: 42px;
    padding: 0 20px;
    -webkit-box-shadow: 0px 2px 6px 0px rgba(44,49,60,0.23);
}
 .el-dialog__title{
  color:white
} */
</style>