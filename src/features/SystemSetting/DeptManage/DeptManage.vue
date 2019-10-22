<template>
  <div class="table_style">
    <el-row type="flex" class="modularWrapper">
      <el-scrollbar style="min-width:200px;">
        <el-tree
          highlight-current
          class="black"
          :data="deptList"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :default-expanded-keys="[this.nodeID]"
          node-key="iDeptID"
        ></el-tree>
      </el-scrollbar>
      <el-col class="table-flex-wraper">
        <div class="table-btn-control" style="border:none">
          <el-row type="flex" justify="strat">
            <el-button
              class="my-tableout"
              plain
              size="mini"
              @click="addDept"
              v-if="$options.filters.btnTree('/api/Department/Post' ,$route.meta.iFunID)"
            >
              <i class="iconfont icon-xinzeng"></i>新增
            </el-button>
            <el-button
              class="my-tableout"
              size="mini"
              @click="editDept"
              v-if="$options.filters.btnTree('/api/Department/Put' ,$route.meta.iFunID)"
            >
              <i class="iconfont icon-bianji"></i>编辑
            </el-button>
            <el-button
              class="my-tableout"
              size="mini"
              @click="delDept"
              v-if="$options.filters.btnTree('/api/Department/Delete' ,$route.meta.iFunID)"
            >
              <i class="iconfont icon-shanchu"></i>删除
            </el-button>
          </el-row>
        </div>
        <SysTable
          :tableData="tableData"
          :loading="loading"
          :layerListName="'DeptManage_Columns'"
          :paginationShow="false"
          @currentChange="currentChange"
        ></SysTable>
      </el-col>
    </el-row>
    <el-dialog
      :title="dialogtype ?'编辑部门' :'新增部门'"
      :visible.sync="dialogVisible"
      width="300"
      :before-close="handleClose"
      customClass="el_add_dialog"
      class="myDialog"
    >
      <el-form label-width="100px" ref="formDialog" size="small" :rules="rules" :model="formValue">
        <el-form-item label="上级部门：">
          <el-input v-model="nodeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="部门名称：" prop="cAdminTel">
          <el-input v-model="formValue.cDepName" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="部门电话：" prop="cDepTel">
          <el-input v-model="formValue.cDepTel" placeholder="请输入部门电话"></el-input>
        </el-form-item>
        <el-form-item label="部门邮件：" prop="cDepEmail">
          <el-input v-model="formValue.cDepEmail" placeholder="请输入部门邮件"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="my-dialog-cancel" @click="dialogVisible = false">取 消</el-button>
        <el-button class="my-dialog-submit" @click="editFormSubmit" :loading="sunBtnLoad">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
 
<script>
import Dept from "@api/SystemSetting/Department";
import SysTable from "@features/SystemSetting/components/SysTable";
export default {
  name: "Department",
  components: { SysTable },
  data() {
    return {
      rules: {
        cDepName: [
          { required: true, message: "请输入部门名称", trigger: "blur" }
        ],
        cDepTel: [
          {
            pattern: /^1[34578]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        cDepEmail: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur"]
          }
        ]
      },
      deptList: [],
      defaultProps: {
        children: "children",
        label: "cDepName"
      },
      FatherList: [], //由fatherId组成的对象
      tableData: [], //表格显示数据
      currentRow: null, //表格当前行
      nodeID: null, //当前的tree展开行
      nodeName: null, //当前的tree展开行信息
      dialogVisible: false, //弹窗是否展示
      dialogtype: 0, //弹窗标题0:新增1：修改
      formValue: {
        iAdminID: 0,
        PiDeptID: undefined,
        cDepName: undefined,
        cDepTel: undefined,
        cDepEmail: undefined
      }, //弹窗变量
      loading: true, //表格加载
      sunBtnLoad: false, //form提交加载
      sunBtnLoad: false //form提交加载
    };
  },
  created() {
    this.getDeptList();
  },
  methods: {
    getDeptList() {
      this.loading = true;
      Dept.getDeptList()
        .then(res => {
          this.FatherList = {};
          _.forEach(res.data.Data.Result, item => {
            if (this.FatherList[item.PiDeptID]) {
              this.FatherList[item.PiDeptID].push(item);
            } else {
              this.FatherList[item.PiDeptID] = [item];
            }
          });
          this.deptList = [
            {
              cDepName: "公司",
              iDeptID: 1,
              children: []
            }
          ];
          if (!this.nodeID || !this.nodeName) {
            this.nodeName = "公司";
            this.nodeID = 1;
          }
          this.DeptSerialize(this.deptList);
          this.tableData = this.FatherList[this.nodeID];
          this.loading = false;
          this.$store.dispatch('system/SetDeptListFnc' , this.deptList)
        })
        .catch(() => {
          this.loading = false;
          this.$message({
            type: "error",
            message: "获取数据失败",
            showClose: true
          });
        });
    },
    //treeData序列化
    DeptSerialize(arr) {
      _.map(arr, item => {
        if (this.FatherList[item.iDeptID]) {
          item.children = this.FatherList[item.iDeptID];
          this.DeptSerialize(item.children);
        } else {
          return;
        }
      });
    },
    //tree点击事件
    handleNodeClick(data) {
      this.tableData = data.children;
      this.nodeID = data.iDeptID;
      this.nodeName = data.cDepName;
    },
    //表格点击事件
    currentChange(val) {
      this.currentRow = val;
    },
    //删除按钮点击
    delDept() {
      if (!this.currentRow) {
        this.$message({
          type: "warning",
          message: "请选择需要删除的数据",
          showClose: true
        });
        return;
      }
      this.$confirm("确定删除么")
        .then(() => {
          if (this.currentRow.iDeptID === 1) {
            this.$message({
              type: "error",
              message: "禁止删除系统分类",
              showClose: true
            });
            return;
          }
          this.loading = true;
          Dept.delDept(this.currentRow.iDeptID)
            .then(() => {
              this.loading = false;
              this.$message({
                type: "success",
                message: "成功删除数据",
                showClose: true
              });
              this.getDeptList();
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "删除数据失败",
                showClose: true
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "取消删除数据",
            showClose: true
          });
        });
    },
    //编辑按钮点击
    editDept() {
      if (!this.currentRow) {
        this.$message({
          type: "warning",
          message: "请选择需要编辑的数据",
          showClose: true
        });
        return;
      }
      this.formValue = _.assign({}, this.currentRow);
      this.formValue.iFunMenuIsShow = Boolean(this.formValue.iFunMenuIsShow);
      this.dialogVisible = true;
      this.dialogtype = 1;
    },
    //新增按钮点击
    addDept() {
      this.dialogVisible = true;
      this.dialogtype = 0;
      this.formValue = {
        iAdminID: this.$store.state.login.iAdminID,
        PiDeptID: this.nodeID,
        cDepName: undefined,
        cDepTel: undefined,
        cDepEmail: undefined
      };
      this.formValue.iFunFatherID = this.nodeID;
    },
    handleClose(done) {
      done();
    },
    //新增修改提交
    editFormSubmit() {
      this.$refs.formDialog.validate(valid => {
        if (!valid) {
          return false;
        }
        this.sunBtnLoad = true;
        if (this.dialogtype) {
          Dept.editDept(this.formValue)
            .then(res => {
              this.dialogVisible = false;
              this.sunBtnLoad = false;
              this.getDeptList();
            })
            .catch(() => {
              this.dialogVisible = false;
              this.sunBtnLoad = false;
              this.$message({
                type: "error",
                message: "编辑数据失败，请重试"
              });
            });
          return;
        } else {
          Dept.addDept(this.formValue)
            .then(res => {
              this.sunBtnLoad = false;
              this.dialogVisible = false;
              this.getDeptList();
            })
            .catch(() => {
              this.sunBtnLoad = false;
              this.dialogVisible = false;
              this.$message({
                type: "error",
                message: "新增数据失败，请重试"
              });
            });
        }
      });
    }
  }
};
</script>
