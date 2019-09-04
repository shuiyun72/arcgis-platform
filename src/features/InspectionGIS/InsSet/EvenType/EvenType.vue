<template>
  <div class="table_style w700" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'事件类型管理'" :flexible.sync="flexible"></TableFormTitle>
    <el-row type="flex" justify="start" class="insSetControl">
      <el-button
        class="my-tableout"
        plain
        size="mini"
        @click="addItem"
        v-if="$options.filters.btnTree('/api/EventType/Post' ,$route.meta.iFunID)"
      >
        <i class="iconfont icon-xinzeng"></i>新增
      </el-button>
      <el-button
        class="my-tableout"
        size="mini"
        @click="editItem"
        v-if="$options.filters.btnTree('/api/EventType/Put' ,$route.meta.iFunID)"
      >
        <i class="iconfont icon-bianji"></i>编辑
      </el-button>
      <el-button
        class="my-tableout"
        size="mini"
        @click="delItem"
        v-if="$options.filters.btnTree('/api/EventType/Delete' ,$route.meta.iFunID)"
      >
        <i class="iconfont icon-shanchu"></i>删除
      </el-button>
    </el-row>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      customClass="el_add_dialog"
      class="myDialog"
    >
      <el-form label-width="80px" size="small">
        <el-form-item label="事件名称：">
          <el-input v-model="formValue.EventTypeName" placeholder="请输入事件名称"></el-input>
        </el-form-item>
        <el-form-item label=" 处理小时：">
          <!-- <el-input v-model="formValue.ExecTime" type="number"></el-input> -->
          <el-input-number
            ref="numberInput"
            v-if="dialogTitle == '新增'"
            @change="ExecTimeChange"
            controls-position="right"
            placeholder="请输入执行时间"
          ></el-input-number>
          <el-input-number
            v-else
            v-model="formValue.ExecTime"
            controls-position="right"
            placeholder="请输入执行时间"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="my-dialog-cancel" @click="dialogVisible = false">取 消</el-button>
        <el-button class="my-dialog-submit" @click="editFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <InsTable
      :layerListName="'Ins_EvenType_Columns'"
      :tableHeight="'calc(100vh - 194px)'"
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
import EvenType from "@api/Inspection/EvenType";
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
        EventTypeName: "",
        ExecTime: ""
      } //弹框数据
    };
  },
  created() {
    this.GetData();
  },
  watch: {
    currentPageSize() {
      this.GetData();
    }
  },
  methods: {
    //input输入框绑定事件
    ExecTimeChange(value) {
      this.formValue.ExecTime = value;
    },
    //formValue值设置
    formValueSet(row) {
      if (row) {
        this.formValue.EventTypeName = row.EventTypeName;
        this.formValue.ExecTime = row.ExecTime;
        this.formValue.EventTypeId = row.EventTypeId;
      } else {
        this.$refs.numberInput.currentValue = undefined;
        this.formValue = {
          EventTypeName: "",
          ExecTime: ""
        };
      }
    },
    //获取表格列表
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
      EvenType.EventTypeAll(this.pageSize, this.pageNumber).then(res => {
        this.loading = false;
        this.columnListData = res.data.Data.Result;
        this.dataTotal = res.data.Data.TotalRows;
      });
    },
    //新增修改提交方法
    editFormSubmit() {
      let _EventTypeName = this.formValue.EventTypeName;
      let _ExecTime = _.floor(this.formValue.ExecTime);
      if (!_EventTypeName) {
        this.$message({
          type: "error",
          message: "请输入事件名称",
          showClose: true
        });
        return;
      } else if (!_ExecTime) {
        this.$message({
          type: "error",
          message: "请输入处理小时",
          showClose: true
        });
        return;
      } else if (_ExecTime <= 0) {
        this.$message({
          type: "error",
          message: "请输入正确的处理小时",
          showClose: true
        });
        return;
      }
      let _EventTypeId = this.formValue.EventTypeId;
      //修改提交方法
      if (_EventTypeId) {
        EvenType.EventTypeEdit(_EventTypeName, _ExecTime, _EventTypeId).then(
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
      EvenType.EventTypeAdd(_EventTypeName, _ExecTime).then(res => {
        this.dialogVisible = false;
        this.$message({
          type: "success",
          message: "添加成功",
          showClose: true
        });
        this.GetData();
      });
    },
    handleClose(done) {
      done();
    },
    //新增弹框控制
    addItem() {
      this.dialogVisible = true;
      this.dialogTitle = "新增";
      this.formValueSet();
    },
    currentChange(row) {
      this.currentRow = row;
    },
    //编辑弹窗控制
    editItem() {
      if (!this.currentRow) {
        this.$message({
          type: "warning",
          message: "请选择需要编辑的数据",
          showClose: true
        });
        return;
      }
      this.dialogVisible = true;
      this.dialogTitle = "编辑";
      this.formValueSet(this.currentRow);
    },
    //删除操作
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
        EvenType.EventTypeDel(this.currentRow.EventTypeId).then(res => {
          this.dialogVisible = false;
          this.$message({
            type: "success",
            message: "删除成功",
            showClose: true
          });
          this.GetData();
        });
      });
    }
  }
};
</script>
