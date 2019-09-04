<template>
  <div class="table_style w700 Inset" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'计划类别管理'" :flexible.sync="flexible"></TableFormTitle>
    <el-form >
    <el-row>
      <el-col :span="8" :xs="12" :sm="12" :lg="8">
      <el-form-item label="类别：" label-width="56px" class="formItemNone">
        <el-select v-model="attRListValue" size="mini" @change="AttrChange">
          <el-option
            v-for="item in attRList"
            :key="item.PlanTypeId"
            :label="item.PlanTypeName"
            :value="item.PlanTypeId"
          ></el-option>
        </el-select>
      </el-form-item>
      </el-col>
     
    </el-row>
    <div class="table-btn-control">
      <el-row type="flex" justify="start">
      <el-button class="my-tableout" plain size="mini" @click="addItem" v-if="$options.filters.btnTree('/api/PlanType/Post' ,$route.meta.iFunID)">
        <i class="iconfont icon-xinzeng"></i>新增
      </el-button>
      <el-button class="my-tableout" size="mini" @click="editItem" v-if="$options.filters.btnTree('/api/PlanType/Put' ,$route.meta.iFunID)">
        <i class="iconfont icon-bianji"></i>编辑
      </el-button>
      <el-button class="my-tableout" size="mini" @click="delItem" v-if="$options.filters.btnTree('/api/PlanType/Delete' ,$route.meta.iFunID)">
        <i class="iconfont icon-shanchu"></i>删除
      </el-button>
    </el-row>
    </div>
     </el-form>
    
    
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      customClass="el_add_dialog"
      class="myDialog"
      >
      <el-form label-width="120px" size="small">
        <el-form-item label="计划类型：">
          <el-select v-model="formValue.ParentTypeId">
            <el-option
              v-for="item in attRList"
              :key="item.PlanTypeId"
              :label="item.PlanTypeName"
              :value="item.PlanTypeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划类别：">
          <el-input v-model="formValue.PlanTypeName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="my-dialog-cancel" @click="dialogVisible = false">取 消</el-button>
        <el-button class="my-dialog-submit" @click="editFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <InsTable
      :layerListName="'Ins_PlanType_Columns'"
      :tableHeight="'calc(100vh - 224px)'"
      :columnListData="columnListData"
      :loading.sync="loading"
      :pageSize.sync="pageSize"
      :pageNumber.sync="pageNumber"
      :dataTotal="dataTotal"
      @delItem="delItem"
      @currentChange="currentChange"
      @GetData="GetData"
    ></InsTable>
  </div>
</template>
<script>
import _ from "lodash";
import PlanType from "@api/Inspection/PlanType";
import InsTable from "@features/InspectionGIS/components/InsTable";
import TableFormTitle from "@common/components/TableFormTitle";
export default {
  components: {
    InsTable,
    TableFormTitle
  },
  data() {
    return {
      loading: true,
      columnListData: [], //表格全部数据
      dataTotal: 1, //表格数据个数
      pageNumber: 1, //表格页码
      pageSize: 50, //表格页size
      currentRow: null, //当前表格选中项
      flexible: false, //是否收缩左侧表格
      dialogVisible: false, //弹框显示
      dialogTitle: "", //弹框标题
      formValue: {
        PlanTypeName: "",
        ParentTypeId: ""
      }, //弹框value
      attRList: [], //类别列表
      attRListValue: 1 //类别选中值
    };
  },
  created() {
    this.onLoadData();
    this.GetData();
  },
  methods: {
    //初始化数据
    onLoadData() {
      PlanType.PlanTypeLoad().then(res => {
        console.log(res.data.Data.Result)
        this.attRList = res.data.Data.Result;
        this.attRListValue = this.attRList[0].PlanTypeId;
      });      
    },
    //获取表格数据
    GetData(pageNumber, pageSize) {
      this.loading = true;
      if (typeof pageNumber == "number") {
        //如果传值更新父页面的表格页码为1，切换数据调用data时使用，
        //因为getdata初始查询页码为1
        this.pageNumber = pageNumber;
      }
      if (typeof pageSize == "number") {
        this.pageSize = pageSize;
      }

      PlanType.PlanTypeSearch(this.pageSize, this.pageNumber, this.attRListValue).then(
        res => {
          this.loading = false;
          this.columnListData = res.data.Data.Result;
          this.dataTotal = res.data.Data.TotalRows;
        }
      );
    },
    //新增修改提交方法
    editFormSubmit() {
      let _PlanTypeName = this.formValue.PlanTypeName;
      let _ParentTypeId = this.formValue.ParentTypeId;
      let _PlanTypeId = this.formValue.PlanTypeId;
      if (!_PlanTypeName) {
        this.$message({
          type: "error",
          message: "请输入计划类别名称",
          showClose: true
        });
        return;
      }
      //修改提交方法
      if (_PlanTypeId) {
        PlanType.PlanTypeEdit(_PlanTypeName, _ParentTypeId, _PlanTypeId).then(
          res => {
            this.dialogVisible = false;
            this.$message({
              type: "success",
              message: "修改成功",
              showClose: true
            });
            this.GetData();
          }
        );
        return;
      }
      //新增提交方法
      PlanType.PlanTypeAdd(_PlanTypeName, _ParentTypeId).then(res => {
        this.dialogVisible = false;
        this.$message({
          type: "success",
          message: "添加成功",
          showClose: true
        });
        this.GetData();
      });
    },
    //关闭弹窗X
    handleClose(done) {
      done();
    },
    //新增按钮，显示弹窗
    addItem() {
      this.formValueSet();
      this.dialogVisible = true;
      this.dialogTitle = "新增";
    },
    //修改编辑按钮，显示弹窗
    editItem() {
      if (this.currentRow) {
        this.dialogVisible = true;
        this.dialogTitle = "编辑";
        this.formValueSet(this.currentRow);
      } else {
        this.$message({
          type: "warning",
          message: "请选择要编辑的数据",
          showClose: true
        });
        return;
      }
    },
    //formValue值设置
    formValueSet(row) {
      if (row) {
        this.formValue.PlanTypeName = row.PlanTypeName;
        this.formValue.ParentTypeId = row.ParentTypeId;
        this.formValue.PlanTypeId = row.PlanTypeId;
      } else {
        this.formValue = {
          PlanTypeName: "",
          ParentTypeId: this.attRListValue,
          PlanTypeId: ""
        };
      }
    },
    //删除操作及弹窗
    delItem() {
      if (!this.currentRow) {
        this.$message({
          type: "warning",
          message: "请选择要删除的数据",
          showClose: true
        });
        return;
      }
      this.$confirm("确认删除？").then(() => {
        PlanType.PlanTypeDel(this.currentRow.PlanTypeId).then(res => {
          this.dialogVisible = false;
          this.$message({
            type: "success",
            message: "删除成功",
            showClose: true
          });
          this.GetData();
        });
      });
    },
    //类别选中值更改时，更新table
    AttrChange() {
      this.loading = true
      this.GetData(1);
    },
    currentChange(row){
      this.currentRow = row
    },
  }
};
</script>
