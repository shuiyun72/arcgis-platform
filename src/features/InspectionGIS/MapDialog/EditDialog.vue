<template>
  <div class="insplan_dialog">
    <el-dialog
      center
      v-dialogDrag
      :title="dialogType"
      :visible.sync="dialogType.length>0"
      customClass="el_add_dialog"
      class="myDialog insPlanDialog"
      :before-close="closeDialogBtn"
      :modal-append-to-body="false"
      :modal="false"
      :close-on-click-modal="false"
      >
      <!-- 添加编辑区域 -->
      <el-form label-width="86px" size="small" v-show="dialogType == '编辑区域'">
        <el-form-item label="名称：">
          <el-input :placeholder="请输入标题" v-model="PlanAreaName"></el-input>
        </el-form-item>
        <el-form-item label="责任部门：">
          <el-select v-model="DeptIdSelect" placeholder="请选择管理人" @change="onChangeDept">
            <el-option
              v-for="item in deptData"
              :key="item.iDeptID"
              :label="item.cDepName"
              :value="item.iDeptID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="责任人：">
          <el-select v-model="adminNameDataSelect" placeholder="择管理人名称">
            <el-option
              v-for="item in adminNameData"
              :key="item.iAdminID"
              :label="item.cAdminName"
              :value="item.iAdminID"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 添加编辑区域 end -->
      <!-- 添加修改关键点 -->
      <el-form label-width="66px" size="small" v-show="dialogType != '编辑区域'">
        <el-form-item label="名称：">
          <el-input :placeholder="请输入标题" v-model="AreaPointName"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加修改关键点 end -->
      <div slot="footer" class="dialog-footer">
        <el-button class="my-dialog-cancel" size="mini" @click="closeDialogBtn">取 消</el-button>
        <el-button class="my-dialog-submit" size="mini" @click="SubmitArea">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import _ from "lodash";
import InsPlanArea from "@api/Inspection/PlanArea";
import InsPointArea from "@api/Inspection/PointArea";
import InsDepartmentUserCycle from "@api/Inspection/DepartmentUserCycle";

export default {
  data() {
    return {
      deptData: [], //管理部门数据
      adminNameDataSelect: 0, //管理人
      PlanAreaName: "", //区域名称
      DeptIdSelect: 0, //部门Id
      adminNameData: [], //人员名称数据
      paginatedTableData: [], //区域管理数据
      AreaPointName: "", //关键点名称
      dialogType: "",
      currentRow: []
    };
  },
  created() {},
  beforeDestroy() {},
  props: [],
  mounted() {},
  methods: {
    //编辑区域
    editDialogType(dialogType, currentRow) {
      this.currentRow = currentRow;
     
      var geomArray = [];
      if (dialogType == "编辑区域") {
          this.PlanAreaName = currentRow.PlanAreaName;
          this.DeptIdSelect = currentRow.DeptId;
          this.axiosDeptData();
          this.axiosAdminNameData(this.DeptIdSelect, res => {});
          this.adminNameDataSelect = currentRow.PersonId;        
          this.dialogType = dialogType;
      } else {
        //区域关键点及路线关键点
        if (dialogType == "编辑区域关键点") {
          this.dialogType = dialogType;
          this.AreaPointName = currentRow.PointName;
        }
        if (dialogType == "编辑路线关键点") {
          this.dialogType = dialogType;
          this.AreaPointName = currentRow.ImportPointName;
        }
      }
    },
    //提交数据
    SubmitArea() {
      if(this.dialogType == "编辑区域"){
        this.$emit(
          "setAreaArray", 
          this.PlanAreaName,
          this.DeptIdSelect,
          this.adminNameDataSelect,
        );
      }else{  //区域关键点及路线关键点
        this.$emit(
          "setPointArray",
          this.AreaPointName,
        );
      }
      this.dialogType = ""
    },
    //取消弹框
    closeDialogBtn() {
      this.dialogType = "";
      this.PlanAreaName = ""; //区域名称
      this.AreaPointName = ""; //关键点名称
      this.$emit("closeDialogBtn")
      console.log("quxiao1")
      this.dialogType = ""
      this.$bus.emit("setEditFeatureState",false); 
    },
    //查询部门数据
    axiosDeptData() {
      InsDepartmentUserCycle.DeptData().then( res => {
        this.deptData = res.data.Data.Result;
      });
    },
    //刷新人员数据联动
    onChangeDept(val) {
      this.axiosAdminNameData(val, res => {
        if (res.length > 0) {
          this.adminNameDataSelect = res[0].iAdminID;
        } else {
          this.adminNameDataSelect = "无数据";
        }
      });
    },
    //获取人员数据
    axiosAdminNameData(idNum, callback) {
      if (idNum) {
        InsDepartmentUserCycle.AdminNameData(idNum).then( res => {
          this.adminNameData = res.data.Data.Result;
          callback instanceof Function && callback(res.data.Data.Result);
        });
      }
    }
  }
};
</script>


