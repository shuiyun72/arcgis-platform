<template>
  <div class="table_style">
    <el-row type="flex" class="modularWrapper">
      <el-scrollbar style="min-width:200px;">
        <el-tree
          highlight-current
          class="black"
          :data="modularList"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :default-expanded-keys="[this.nodeID]"
          node-key="iFunID"
        ></el-tree>
      </el-scrollbar>
      <el-col class="table-flex-wraper">
        <div class="table-btn-control" style="border:none">
          <el-row type="flex" justify="strat">
            <el-button
              class="my-tableout"
              plain
              size="mini"
              @click="addModular"
              v-if="$options.filters.btnTree('/api/Function/Post' ,$route.meta.iFunID)"
            >
              <i class="iconfont icon-xinzeng"></i>新增
            </el-button>
            <el-button
              class="my-tableout"
              size="mini"
              @click="editModular"
              v-if="$options.filters.btnTree('/api/Function/Put' ,$route.meta.iFunID)"
            >
              <i class="iconfont icon-bianji"></i>编辑
            </el-button>
            <el-button
              class="my-tableout"
              size="mini"
              @click="delModular"
              v-if="$options.filters.btnTree('/api/Function/Delete' ,$route.meta.iFunID)"
            >
              <i class="iconfont icon-shanchu"></i>删除
            </el-button>
          </el-row>
        </div>
        <SysTable
          :tableData="tableData"
          :loading="loading"
          :layerListName="'Modular_Columns'"
          :paginationShow="false"
          :modularDialog="true"
          @currentChange="currentChange"
          @modularDialogOpen="modularDialogOpen"
        ></SysTable>
      </el-col>
    </el-row>
    <el-dialog
      :title="dialogtype ?'修改模块' :'新增模块'"
      :visible.sync="dialogVisible"
      width="300"
      :before-close="handleClose"
      customClass="el_add_dialog"
      class="myDialog"
    >
      <el-form label-width="100px" ref="formDialog" size="small" :rules="rules" :model="formValue">
        <el-form-item label="功能名称：" prop="cFunName">
          <el-input v-model="formValue.cFunName" placeholder="请输入功能名称"></el-input>
        </el-form-item>
        <el-form-item label="功能URl：" prop="cFunUrl">
          <el-input v-model="formValue.cFunUrl" placeholder="请输入功能URl"></el-input>
        </el-form-item>
        <el-form-item label="系统类型：">
          <el-select v-model="formValue.System_Type" disabled>
            <el-option
              v-for=" item in typeListArr"
              :key="item.iFunID"
              :label="item.cFunName"
              :value="item.iFunID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="icon名称：" prop="cFunIcon">
          <el-input v-model="formValue.cFunIcon" placeholder="请输入icon名称"></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input-number v-model="formValue.iFunOrder" controls-position="right" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="是否显示：">
          <el-switch
            v-model="formValue.iFunMenuIsShow"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="点击类型：">
          <el-radio-group v-model="formValue.FunctionType">
            <el-radio :label="1">页面</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
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
//接口
import Modular from "@api/SystemSetting/Modular";

//模块
import SysTable from "@features/SystemSetting/components/SysTable";

export default {
  components: { SysTable },
  data() {
    return {
      rules: {
        cFunName: [
          { required: true, message: "请输入功能名称", trigger: "blur" }
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
      typeList: {
        1: "B/S 显示",
        3: "手机app",
        4: "C/S 显示"
      }, //系统状态过滤
      typeListArr: [
        {
          cFunName: "B/S 显示",
          iFunID: 1
        },
        {
          cFunName: "手机app",
          iFunID: 3
        },
        {
          cFunName: "C/S 显示",
          iFunID: 4
        }
      ], //select框选择列表过滤
      formValue: {
        cFunName: "",
        cFunUrl: "",
        iFunOrder: undefined,
        iFunMenuIsShow: true,
        System_Type: 1,
        FunctionType: 1,
        cFunIcon: undefined
      }, //弹窗变量
      loading: true, //表格加载
      sunBtnLoad: false, //form提交加载
      sunBtnLoad: false //form提交加载
    };
  },
  created() {
    this.getModularList();
  },
  methods: {
    getModularList() {
      this.loading = true;
      Modular.getModular()
        .then(res => {
          this.FatherList = {};
          let resList = res.data.Data.Result;
          _.forEach(resList, item => {
            if (!this.FatherList[item.System_Type]) {
              this.FatherList[item.System_Type] = {
                iFunID: "0#" + item.System_Type
              };
              this.FatherList[item.System_Type].cFunName = this.typeList[
                item.System_Type
              ];
              this.FatherList[item.System_Type];
              this.FatherList[item.System_Type].System_Type = item.System_Type;
            }
            if (this.FatherList[item.System_Type][item.iFunFatherID]) {
              this.FatherList[item.System_Type][item.iFunFatherID].push(item);
            } else {
              this.FatherList[item.System_Type][item.iFunFatherID] = [item];
            }
          });
          let modularList = _.cloneDeep(this.FatherList);
          this.modularList = [
            {
              iFunID: -1,
              cFunName: "智慧水务管理系统",
              children: []
            }
          ];
          _.forEach(modularList, (item, index) => {
            this.ModularSerialize([item], item.System_Type);
            this.modularList[0].children.push(item);
          });
          let active = _.isString(this.nodeID)
            ? Number(this.nodeID.split("#")[0])
            : this.nodeID;
          if (active === -1) {
            this.tableData = this.typeListArr;
          } else {
            this.tableData = this.FatherList[this.System_Type][active];
          }

          this.loading = false;
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
    ModularSerialize(arr, System_Type) {
      _.map(arr, item => {
        let iFunID = _.isString(item.iFunID)
          ? Number(item.iFunID.split("#")[0])
          : item.iFunID;
        if (this.FatherList[System_Type][iFunID]) {
          item.children = this.FatherList[System_Type][iFunID];
          let parent = {};
          parent.iFunID = iFunID;
          if (item.parent) {
            parent.parent = item.parent;
          }

          item.children = _.map(this.FatherList[System_Type][iFunID], child => {
            child.parent = parent;
            return child;
          });
          this.ModularSerialize(
            this.FatherList[System_Type][iFunID],
            System_Type
          );
        } else {
          return;
        }
      });
    },
    //tree点击事件
    handleNodeClick(data) {
      this.tableData = data.children;
      this.nodeID = data.iFunID;
      this.System_Type = data.System_Type;
    },
    //表格点击事件
    currentChange(val) {
      this.currentRow = val;
    },
    //删除按钮点击
    delModular() {
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
          if (_.isString(this.currentRow.iFunID)) {
            this.$message({
              type: "error",
              message: "禁止删除系统分类",
              showClose: true
            });
            return;
          }
          this.loading = true;
          Modular.delModular(this.currentRow.iFunID)
            .then(() => {
              this.loading = false;
              this.$message({
                type: "success",
                message: "成功删除数据",
                showClose: true
              });
              this.getModularList();
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
    editModular() {
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
    addModular() {
      this.dialogVisible = true;
      this.dialogtype = 0;
      this.formValue = {
        cFunName: "",
        cFunUrl: "",
        iFunOrder: 1,
        iFunMenuIsShow: true,
        System_Type: this.System_Type,
        FunctionType: 1,
        cFunIcon: undefined
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
          Modular.editModular(this.formValue)
            .then(res => {
              this.dialogVisible = false;
              this.sunBtnLoad = false;
              this.getModularList();
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
          Modular.addModular(this.formValue)
            .then(res => {
              this.sunBtnLoad = false;
              this.dialogVisible = false;
              this.getModularList();
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
