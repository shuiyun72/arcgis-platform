<template>
  <div class="table_style">
    <el-row type="flex" class="modularWrapper">
      <el-col class="table-flex-wraper">
        <el-form label-width="80px" label-position="right" size="mini" gutter="20px">
          <el-row>
            <el-col span="6" :lg="4">
              <el-form-item label="部门：" label-width="46px">
                <DeptSelect
                  :allState="true"
                  :name="'GetformValue'"
                  :selectValue="GetformValue.deptId"
                  @getChildChange="getChildChange"
                ></DeptSelect>
              </el-form-item>
            </el-col>
            <el-col span="6" :lg="4">
              <el-form-item label="岗位：">
                <RoleSelect :selectValue.sync="GetformValue.roleId" :allState="true"></RoleSelect>
              </el-form-item>
            </el-col>
            <el-col span="6" :lg="4">
              <el-form-item label="用户查找：" @keyup.enter.native="getUserList">
                <el-input v-model="GetformValue.userName" placeholder="姓名、工号、联系方式"></el-input>
              </el-form-item>
            </el-col>
            <el-col span="5" :lg="2">
              <el-row type="flex" justify="start" style="padding:0;padding-left:20px">
                <el-button
                  class="my-search"
                  size="mini"
                  @click="getUserList"
                  v-if="$options.filters.btnTree('/api/User/Get' ,$route.name)"
                >查询</el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-form>

        <div class="table-btn-control">
          <el-row type="flex" justify="strat">
            <el-button
              class="my-tableout"
              plain
              size="mini"
              @click="addUser"
              v-if="$options.filters.btnTree('/api/User/Post' ,$route.name)"
            >
              <i class="iconfont icon-xinzeng"></i>新增
            </el-button>
            <el-button
              class="my-tableout"
              size="mini"
              @click="editUser"
              v-if="$options.filters.btnTree('/api/User/Put' ,$route.name)"
            >
              <i class="iconfont icon-bianji"></i>编辑
            </el-button>
            <el-button
              class="my-tableout"
              size="mini"
              @click="delUser"
              v-if="$options.filters.btnTree('/api/User/Delete' ,$route.name)"
            >
              <i class="iconfont icon-shanchu"></i>删除
            </el-button>
            <el-button
              class="my-tableout"
              size="mini"
              @click="resertUserPassWard"
              v-if="$options.filters.btnTree('/api/User/ResetPassword' ,$route.name)"
            >
              <i class="iconfont icon-chushihuamima"></i>初始化密码
            </el-button>
          </el-row>
        </div>
        <SysTable
          :departDialog="true"
          :tableData="tableData"
          :loading="loading"
          :layerListName="'UserManage_Columns'"
          :paginationShow="true"
          :modularDialog="true"
          @currentChange="currentChange"
          @modularDialogOpen="modularDialogOpen"
          @onPageSizeChange="onPageSizeChange"
          @onPageChange="onPageChange"
          :pageNumber="GetformValue.page"
          :pageSize="GetformValue.num"
          :dataTotal="dataTotal"
        ></SysTable>
      </el-col>
    </el-row>
    <el-dialog
      :title="dialogtype ?'修改用户' :'新增用户'"
      :visible.sync="dialogVisible"
      width="500"
      :before-close="handleClose"
      customClass="el_add_dialog"
      class="myDialog"
    >
      <el-form :model="formValue" label-width="100px" size="small" :rules="rules" ref="formDialog">
        <el-form-item label="用户名称：" prop="cAdminName">
          <el-input v-model="formValue.cAdminName" placeholder="请输入用户名称" v-filter-special-char></el-input>
        </el-form-item>
        <el-form-item label="工号：" prop="CJobNumber">
          <el-input v-filter-special-char v-model="formValue.CJobNumber" placeholder="请输入工号"></el-input>
        </el-form-item>
        <el-form-item label="所属部门：" prop="iDeptID">
          <DeptSelect
            :allState="false"
            :name="'formValue'"
            :selectValue="formValue.iDeptID"
            @getChildChange="getChildChange"
          ></DeptSelect>
        </el-form-item>
        <el-form-item label="所属岗位：" prop="iRoleID">
          <RoleSelect :selectValue.sync="formValue.iRoleID" :allState="false"></RoleSelect>
        </el-form-item>
        <el-form-item label="性别：" v-show="!dialogtype">
          <el-radio-group v-model="formValue.cAdminSex">
            <el-radio label="男" value="男"></el-radio>
            <el-radio label="女" value="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系电话：" prop="cAdminTel">
          <el-input v-model="formValue.cAdminTel" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件：" prop="cAdminEmail">
          <el-input v-model="formValue.cAdminEmail" placeholder="请输入电子邮件"></el-input>
        </el-form-item>
        <el-form-item label="锁定：">
          <el-switch v-model="formValue.iIsLocked" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
        <el-form-item label="修改密码：">
          <el-switch
            v-model="formValue.iIsAllowChangePWD"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="my-dialog-cancel" @click="editFormSubmitCancle">取 消</el-button>
        <el-button class="my-dialog-submit" @click="editFormSubmit" :loading="sunBtnLoad">确 定</el-button>
      </div>
    </el-dialog>
    <modularDialog
      :modulaBtnVisable.sync="modulaBtnVisable"
      :modularDialogVisable.sync="modularDialogVisable"
      @modularDialogSubmit="modularDialogSubmit"
      :nodeID="dialognodeID"
    ></modularDialog>
    <DepartDialog
      :modulaBtnVisable.sync="modulaBtnVisable"
      :modularDialogVisable.sync="departDialogVisable"
      @departDialogSubmit="departDialogSubmit"
      :nodeID="iDeptIDs"
    />
  </div>
</template>
 
<script>
//接口
import Modular from "@api/SystemSetting/Modular";
import DepartmentUserCycle from "@api/Inspection/DepartmentUserCycle";
import User from "@api/SystemSetting/User";
import Role from "@api/SystemSetting/Role";
import System from "@api/SystemSetting/System";
import FunPurview from "@api/SystemSetting/FunPurview";

//模块
import SysTable from "@features/SystemSetting/components/SysTable";
import DeptSelect from "@common/components/form/DeptSelect";
import RoleSelect from "@common/components/form/RoleSelect";
import SelectTree from "@common/components/SelectTree";
import modularDialog from "@features/SystemSetting/components/modularDialog";
import DepartDialog from "@features/SystemSetting/components/DepartDialog";
export default {
  components: {
    modularDialog,
    SelectTree,
    SysTable,
    DeptSelect,
    RoleSelect,
    DepartDialog
  },
  data() {
    return {
      departAllList: [],
      selectValue: "",
      rules: {
        cAdminName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { message: "长度不能超过50个字符", trigger: "blur", max: 50 }
        ],
        CJobNumber: [
          { required: true, message: "请输入工号", trigger: "blur" },
          { message: "长度不能超过50个字符", trigger: "blur", max: 50 }
        ],
        iRoleID: [{ required: true, message: "请选择岗位", trigger: "blur" }],
        iDeptID: [{ required: true, message: "请选择部门", trigger: "blur" }],
        cAdminTel: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[34578]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          },
          { message: "长度不能超过50个字符", trigger: "blur", max: 50 }
        ],
        dExpireDate: [
          { required: true, message: "请选择过期时间", trigger: "blur" }
        ],
        cAdminEmail: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur"]
          },
          { message: "长度不能超过50个字符", trigger: "blur", max: 50 }
        ]
      },
      modularList: [],
      defaultProps: {
        children: "children",
        label: "cFunName"
      },
      FatherList: [], //由fatherId组成的对象
      tableData: [], //表格显示数据
      dataTotal: 1, //表格显示总数据
      currentRow: null, //表格当前行
      nodeID: -1, //当前的tree展开行
      System_Type: 1, //当前的tree展开类别
      dialogVisible: false, //弹窗是否展示
      dialogtype: 0, //弹窗标题0:新增1：修改
      GetformValue: {
        num: 50,
        page: 1,
        userName: undefined,
        roleId: undefined,
        deptId: undefined
      }, //查询变量
      formValue: {
        cAdminName: undefined,
        CJobNumber: undefined,
        iDeptID: undefined,
        iRoleID: undefined,
        Level: 1,
        cAdminSex: "男",
        cAdminTel: undefined,
        iIsLocked: false,
        iIsAllowChangePWD: true,
        // IsAssignment: true,//是否可分派部门
        dExpireDate: undefined,
        cAdminEmail: undefined
      }, //添加弹窗信息
      departList: [], //部门数组
      selectTreeProps: {
        value: "iDeptID", // ID字段名
        label: "cDepName", // 显示名称
        children: "children" // 子级字段名
      },
      RoleList: [], //岗位数据
      modularDialogVisable: false, //功能模块弹窗
      departDialogVisable: false, //部门权限
      dialognodeID: [], //功能模块tree弹窗选中值
      loading: true, //表格加载
      sunBtnLoad: false, //form提交加载
      modulaBtnVisable: false, //弹窗权限确定按钮加载状态
      iDeptIDs: []
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //同步部门选择
    getChildChange(name, value) {
      if (name === "formValue") {
        this[name].iDeptID = value;
        return;
      }
      this[name].deptId = value;
    },
    //获取用户列表
    getUserList() {
      this.loading = true;
      User.getUserList(this.GetformValue).then(res => {
        this.dataTotal = res.data.Data.TotalRows;
        this.tableData = res.data.Data.Result;
        this.tableData = this.tableData.filter(item => {
          return !item.IsDelete;
        });
        this.loading = false;
        this.$store.dispatch("system/setState", {
          name: "userList",
          value: this.tableData
        });
      });
    },
    //表格点击事件
    currentChange(val) {
      this.currentRow = val;
    },
    //分页change
    onPageSizeChange(val) {
      this.GetformValue.num = val;
      this.GetformValue.page = 1;
      this.getUserList();
    },
    //页码change
    onPageChange(val) {
      this.GetformValue.page = val;
      this.getUserList();
    },
    //初始化密码
    resertUserPassWard() {
      if (!this.currentRow) {
        this.$myMessage("warning", "请选择需要初始化密码的用户");
        return;
      }
      this.$confirm("确定要初始化" + this.currentRow.cAdminName + "的密码么")
        .then(() => {
          this.sunBtnLoad = true;
          User.ResetUser(this.currentRow.iAdminID)
            .then(() => {
              this.sunBtnLoad = false;
              this.$message({
                type: "success",
                message: "成功初始化密码,初始化密码为123456",
                showClose: true
              });
              this.getUserList();
            })
            .catch(() => {
              this.$myMessage("error", "初始化密码失败");
            });
        })
        .catch(() => {
          this.$myMessage("warning", "取消初始化密码");
        });
    },
    //删除操作
    delUser() {
      if (!this.currentRow) {
        this.$myMessage("warning", "请选择需要删除的用户");
        return;
      }
      this.$confirm("确定删除么")
        .then(() => {
          User.delUser(this.currentRow.iAdminID)
            .then(() => {
              this.$myMessage("success", "成功删除用户");
              this.getUserList();
            })
            .catch(() => {
              this.loading = false;
            });
        })
        .catch(() => {
          this.$myMessage("warning", "取消删除用户");
        });
    },
    //编辑用户按钮点击
    editUser() {
      if (!this.currentRow) {
        this.$myMessage("warning", "请选择需要编辑的用户");
        return;
      }
      this.formValue = _.assign({}, this.currentRow);
      this.formValue.iIsLocked = Boolean(this.formValue.iIsLocked);
      this.formValue.iIsAllowChangePWD = Boolean(
        this.formValue.iIsAllowChangePWD
      );
      // this.formValue.IsAssignment = Boolean(
      //   this.formValue.IsAssignment
      // );
      this.dialogVisible = true;
      this.dialogtype = 1;
    },
    //添加用户按钮点击
    addUser() {
      this.dialogVisible = true;
      this.dialogtype = 0;
      this.formValue = {
        cAdminName: undefined,
        CJobNumber: undefined,
        iDeptID: undefined,
        iRoleID: undefined,
        Level: 1,
        cAdminSex: "男",
        cAdminTel: undefined,
        cAdminEmail: undefined,
        iIsLocked: false,
        iIsAllowChangePWD: true,
        // IsAssignment: true,
        dExpireDate: undefined
      }; //添加弹窗信息
    },
    //弹窗关闭
    handleClose(done) {
      this.$refs.formDialog.resetFields();
      this.$nextTick(() => {
        done();
      });
    },
    editFormSubmitCancle() {
      this.$refs.formDialog.resetFields();
      this.$nextTick(() => {
        this.dialogVisible = false;
      });
    },
    //修改提交
    editFormSubmit() {
      this.$refs.formDialog.validate(valid => {
        if (!valid) {
          return false;
        }
        this.sunBtnLoad = true;
        if (this.dialogtype) {
          User.editUser(this.formValue)
            .then(res => {
              this.sunBtnLoad = false;
              this.dialogVisible = false;
              this.$myMessage("success", "修改用户成功");
              this.getUserList();
            })
            .catch(res => {
              this.sunBtnLoad = false;
            });
          return;
        } else {
          User.addUser(this.formValue)
            .then(res => {
              this.sunBtnLoad = false;
              this.dialogVisible = false;
              this.$myMessage("success", "新增用户成功");
              this.getUserList();
            })
            .catch(res => {
              this.sunBtnLoad = false;
            });
        }
      });
    },
    //权限管理模块打开
    modularDialogOpen(row, type) {
      if (type === "modular") {
        System.getUserAuthority(row.iAdminID).then(res => {
          let dialognodeID = res.data.Data.Result;
          this.dialognodeID = _.map(dialognodeID, "iFunID");
        });
        this.modularDialogVisable = true;
      } else {
        this.iDeptIDs = row.iDeptIDs ? row.iDeptIDs.split(",") : [];
        this.departDialogVisable = true;
      }
      this.modulaBtnVisable = false;
    },
    //权限管理模块提交
    modularDialogSubmit(functionIds) {
      if (!functionIds.length) {
        this.$myMessage("error", "权限不能为空");
        this.modulaBtnVisable = false;
        return;
      }
      let query = {
        iPurviewID: this.currentRow.iAdminID,
        iPurviewType: 1,
        functionIds: functionIds
      };
      FunPurview.editAuthority(query)
        .then(res => {
          this.modulaBtnVisable = false;
          this.modularDialogVisable = false;
          this.$myMessage("success", "修改权限成功");
          this.getUserList();
        })
        .catch(() => {
          this.modulaBtnVisable = false;
        });
    },
    //部门权限修改
    departDialogSubmit(departID) {
      let currentRow = this.currentRow;
      currentRow.iDeptIDs = departID;
      User.editUser(currentRow)
        .then(res => {
          this.modulaBtnVisable = false;
          this.departDialogVisable = false;
          this.$myMessage("success", "修改部门权限成功");
          this.getUserList();
        })
        .catch(res => {
          this.sunBtnLoad = false;
        });
    }
  }
};
</script>

