<template>
  <div class="table_style">
    <el-row type="flex" class="modularWrapper">
      <el-col class="table-flex-wraper">
        <el-form label-width="50px">
          <el-row>
            <el-col span="6" :lg="4">
              <el-form-item label="岗位：" prop="FormcRoleName">
                <el-input placeholder="请输入岗位名称" v-model="FormcRoleName" v-filter-special-char  @keyup.enter.native="getRoleList"></el-input>
              </el-form-item>
            </el-col>
            <el-col span="4">
              <div type="flex" justify="start" style="padding:0;padding-left:20px">
                <el-button
                  class="my-search"
                  size="mini"
                  @click="getRoleList"
                  v-if="$options.filters.btnTree('/api/Role/Get' ,$route.name)"
                >查询</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <div class="table-btn-control">
          <el-row type="flex" justify="strat">
            <el-button
              class="my-tableout"
              plain
              size="mini"
              @click="addRole"
              v-if="$options.filters.btnTree('/api/Role/Post' ,$route.name)"
            >
              <i class="iconfont icon-xinzeng"></i>新增
            </el-button>
            <el-button
              class="my-tableout"
              size="mini"
              @click="editRole"
              v-if="$options.filters.btnTree('/api/Role/Put' ,$route.name)"
            >
              <i class="iconfont icon-bianji"></i>编辑
            </el-button>
            <el-button
              class="my-tableout"
              size="mini"
              @click="delRole"
              v-if="$options.filters.btnTree('/api/Role/Delete' ,$route.name)"
            >
              <i class="iconfont icon-shanchu"></i>删除
            </el-button>
          </el-row>
        </div>
        <SysTable
          :tableData="tableData"
          :loading="loading"
          :layerListName="'RoleManage_Columns'"
          :paginationShow="false"
          :modularDialog="true"
          @currentChange="currentChange"
          @modularDialogOpen ="modularDialogOpen"
        ></SysTable>
      </el-col>
    </el-row>
    <el-dialog
      :title="dialogtype ?'编辑岗位' :'新增岗位'"
      :visible.sync="dialogVisible"
      width="300"
      :before-close="handleClose"
      customClass="el_add_dialog"
      class="myDialog"
    >
      <el-form label-width="100px" ref="formDialog" size="small" :rules="rules" :model="formValue">
        <el-form-item label="岗位名称：" prop="cRoleName">
          <el-input v-model="formValue.cRoleName" placeholder="请输入岗位名称" v-filter-special-char></el-input>
        </el-form-item>
        <el-form-item label="超级管理员：">
          <el-switch
            v-model="formValue.isSuperAdmin"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="是否巡检员：" prop="cRoleName">
          <el-switch
            v-model="formValue.IsInspector"
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
      :modularDialogVisable.sync="modularDialogVisable"
      @modularDialogSubmit="modularDialogSubmit"
      :nodeID="dialognodeID"
      :modulaBtnVisable.sync="modulaBtnVisable"
    ></modularDialog>
  </div>
</template>
 
<script>
//接口
import Modular from "@api/SystemSetting/Modular";
import Role from "@api/SystemSetting/Role";
import System from "@api/SystemSetting/System";
import FunPurview from "@api/SystemSetting/FunPurview";

//模块
import SysTable from "@features/SystemSetting/components/SysTable";
import modularDialog from "@features/SystemSetting/components/modularDialog";
export default {
  components: {
    modularDialog,
    SysTable
  },
  data() {
    return {
      rules: {
        cRoleName: [
          { required: true, message: "请输入岗位名称", trigger: "blur" },
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
      currentRow: null, //表格当前行
      nodeID: -1, //当前的tree展开行
      System_Type: 1, //当前的tree展开类别
      dialogVisible: false, //弹窗是否展示
      dialogtype: 0, //弹窗标题0:新增1：修改
      FormcRoleName: "", //查询岗位的筛选字段
      formValue: {
        cRoleName: "",
        isSuperAdmin: false,
        IsInspector:false
      }, //弹窗变量
      modularDialogVisable: false, //功能模块弹窗
      dialognodeID: [], //功能模块tree弹窗选中值
      loading: true, //表格加载
      sunBtnLoad: false, //form提交加载
      modulaBtnVisable: false //弹窗权限确定按钮加载状态
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    //获取角色列表
    getRoleList() {
      this.loading = true;
      Role.getRoleList({ roleName: String(this.FormcRoleName) }).then(res => {
        this.loading = false;
        this.tableData = res.data.Data.Result;
        this.$store.dispatch('system/setState' , {
          name:'roleList',
          value:res.data.Data.Result
        })
      });
    },
    //表格点击事件
    currentChange(val) {
      this.currentRow = val;
    },
    //删除按钮点击
    delRole() {
      if (!this.currentRow) {
        this.$myMessage('warning','请选择需要删除的岗位');
        return;
      }
      this.$confirm("确定删除么")
        .then(() => {
          this.loading = true;
          Role.delRole(this.currentRow.iRoleID)
            .then(() => {
              this.loading = true;
              this.$myMessage('success','删除岗位成功');
              this.getRoleList();
            })
            .catch(() => {
               this.loading = false;
            });
        })
        .catch(() => {
          this.$myMessage('warning','取消删除岗位');
        });
    },
    //编辑按钮点击
    editRole() {
      if (!this.currentRow) {
        this.$myMessage('warning','请选择需要编辑的数据');
        return;
      }
      this.currentRow.IsInspector = this.currentRow.IsInspector == 0 ? false :true;
      this.formValue = _.assign({}, this.currentRow);
      this.dialogVisible = true;
      this.dialogtype = 1;
    },
    //添加按钮点击
    addRole() {
      this.dialogVisible = true;
      this.dialogtype = 0;
      this.formValue = {
        cRoleName: "",
        isSuperAdmin: false,
        IsInspector:false
      };
    },
    //提交修改新增
    editFormSubmit() {
      this.$refs.formDialog.validate(valid => {
        if (!valid) {
          return false;
        }

        this.sunBtnLoad = true;
        this.formValue.IsInspector = this.formValue.IsInspector ? 1 :0;
        if (!this.dialogtype) {
          Role.addRole(this.formValue)
            .then(res => {
              this.dialogVisible = false;
              this.sunBtnLoad = false;
              this.$myMessage('success','新增岗位成功');
              this.getRoleList();
            })
            .catch(res => {
              this.sunBtnLoad = false;
            });
          return;
        } else {
          Role.editRole(this.formValue)
            .then(res => {
              this.sunBtnLoad = false;
              this.dialogVisible = false;
              this.$myMessage('success','编辑岗位成功');
              this.getRoleList();
            })
            .catch(res => {
              this.sunBtnLoad = false;
            });
        }
      });
    },
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
    //权限管理模块打开
    modularDialogOpen(row) {
      this.loading = true;
      System.getRoleAuthority(row.iRoleID).then(res => {
        let dialognodeID = res.data.Data.Result;
        this.dialognodeID = _.map(dialognodeID, "iFunID");
        this.modularDialogVisable = true;
        this.modulaBtnVisable = false;
        this.loading = false;
      });
    },
    //权限管理模块提交
    modularDialogSubmit(functionIds) {
      if (!functionIds.length) {
        this.$myMessage('error','权限不能为空');
        this.modulaBtnVisable = false;
        return;
      }
      let query = {
        iPurviewID: this.currentRow.iRoleID,
        iPurviewType: 2,
        functionIds: functionIds
      };
      FunPurview.editAuthority(query)
        .then(res => {
          this.modulaBtnVisable = false;
          this.modularDialogVisable = false;
          this.getRoleList();
        })
        .catch(() => {
          this.modulaBtnVisable = false;
        });
    }
  }
};
</script>