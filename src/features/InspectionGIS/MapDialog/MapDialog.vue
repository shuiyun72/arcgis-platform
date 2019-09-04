<template>
  <div class="map_dialog" v-if=" dialogType.length > 0 ">
    <el-card class="box-card">
      <el-row slot="header" type="flex" justify="space-between">
        <span>{{dialogType}}</span>
        <i class="el-icon-close" @click="cancelBtn"></i> 
      </el-row>
      <div class="text item">
        <!-- 添加编辑区域 -->
        <el-form label-width="76px" size="small" v-show="dialogType == '添加区域' ">
          <el-form-item label="区域名称：">
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
        <el-form label-width="50px" size="small" v-show="dialogType == '添加关键点'">
          <el-form-item label="名称：">
            <el-input :placeholder="请输入标题" v-model="AreaPointName"  @keyup.enter.native="SubmitArea"></el-input>
          </el-form-item>
        </el-form>
        <!-- 添加巡检路线 -->
        <el-form label-width="86px" size="small" v-show="dialogType == '添加巡检路线'">
          <el-form-item label="路线名称：">
            <el-input :placeholder="请输入标题" v-model="formData.name" @keyup.enter.native="SubmitArea"></el-input>
          </el-form-item>
        </el-form>
        <!-- 添加修改关键点 end -->
        <div slot="footer" class="dialog-footer">
          <!-- <i
            class="iconfont icon-duobianxingxuanze"
            @click="affirmAddArea"
            v-if="dialogType == '添加区域'"
          ></i> -->
          <el-button class="my-dialog-cancel" size="mini" @click="cancelBtn">取 消</el-button>
          <el-button class="my-dialog-submit" size="mini" @click="SubmitArea">确认</el-button>
        </div>
      </div>
    </el-card>
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
      AreaArray: [], //区域数据
      PointArray: [], //关键点数据
      AreaPointName: "", //关键点名称
      formData: {}
    };
  },
  created() {
    this.$bus.on("cancelBtn", this.cancelBtn); //关闭弹窗
  },
  beforeDestroy() {
    this.$bus.off("cancelBtn", this.cancelBtn); //关闭弹窗
    this.cancelBtn();
  },
  watch: {
    $route: "cancelBtn"
  },
  props: {
    dialogType: {
      //弹窗title
      default: ""
    },
    dialogData: {
      //返回坐标值
      default: []
    },
    planAreaId: {
      //区域id
      default: 0
    },
    onSubmit: undefined //后续操作
  },
  mounted() {
    this.initDialog();
  },
  methods: {
    affirmAddArea() {
      //添加区域范围
      if (this.dialogData.length == 1) {
        this.$message({
          type: "warning",
          message: "区域已绘制请点击确认!"
        });
      } else {
        this.dialogType = "";
        this.onSubmit instanceof Function && this.onSubmit("1");
      }
    },
    //提交数据
    SubmitArea() {
      switch (this.dialogType) {
        case "添加区域": {
          console.log(this.dialogData)
          let dataCallback = {
            AreaName: this.PlanAreaName,
            dialogData: this.dialogData,
            DeptId: this.DeptIdSelect,
            adminName: this.adminNameDataSelect
          };
          this.onSubmit instanceof Function && this.onSubmit(dataCallback);
          break;
        }
        case "添加关键点": {
          this.onSubmit instanceof Function &&
            this.onSubmit(this.AreaPointName);
          break;
        }
        default: {
          this.onSubmit instanceof Function && this.onSubmit(this.formData);
        }
      }
    },
    //取消弹框
    cancelBtn() {
      this.$bus.emit("onPointermoveControl");
      this.dialogType = "";
      this.PlanAreaName = ""; //区域名称
      this.AreaPointName = ""; //关键点名称
      this.$bus.emit('removeInteractions')
      this.$bus.emit("setTempLayerGroupVisible",false)
    },
    //初始化部门-人员
    initDialog() {
      this.axiosDeptData();
    },
    //查询部门数据
    axiosDeptData() {
      InsDepartmentUserCycle.DeptData().then( res => {
        this.deptData = res.data.Data.Result;
        this.DeptIdSelect = this.deptData[0].iDeptID;
        this.axiosAdminNameData(this.DeptIdSelect);
      });
    },
    //刷新人员数据联动
    onChangeDept(val) {
      this.axiosAdminNameData(val);
    },
    //获取人员数据
    axiosAdminNameData(idNum) {
      if (idNum) {
        InsDepartmentUserCycle.AdminNameData(idNum).then( res => {
          this.adminNameData = res.data.Data.Result;
          if (res.data.Data.Result.length > 0) {
            this.adminNameDataSelect = res.data.Data.Result[0]["iAdminID"];
          } else {
            this.adminNameDataSelect = "无数据";
          }
        });
      }
    }
  }
};
</script>
<style lang="stylus">
.map_dialog {
  width: 260px;
  .el-form{
    width: 90%; margin:  0 auto;
    }

  .el-card__header {
    padding: 6px 6px 4px;
  }

  .el-card__body {
    padding: 2px;
  }
  .dialog-footer{
    padding: 4px 0;
    text-align: center;
    }

  .el-form-item--small.el-form-item {
    margin-bottom: 4px;
  }
  .el-button--mini+.el-button--mini {
    margin-left: 10px;
  }

  .icon-duobianxingxuanze {
    color: #1f1;
    position: relative;
    top: 4px;
    left: 32px;
  }

  .el-form-item__label {
    padding: 0;
  }
}
</style>


