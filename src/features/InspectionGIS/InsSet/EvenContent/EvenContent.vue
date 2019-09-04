<template>
  <div class="table_style w700" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'事件内容管理'" :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="83px" label-position="right" size="small" gutter="20px">
      <el-row>
        <el-col :span="8" :xs="12" :sm="12" :lg="8">
          <el-form-item label="上报类型：">
            <el-select v-model="attRListValue" size="mini">
              <el-option
                v-for="item in attRList"
                :key="item.EventTypeId"
                :label="item.EventTypeName"
                :value="item.EventTypeId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16" :xs="10" :sm="10" :lg="16">
          <el-row type="flex" justify="start" style="padding:0;padding-left:10px">
            <el-button
              class="my-search"
              size="mini"
              @click="GetData(1)"
              v-if="$options.filters.btnTree('/api/EventContent/Get' ,$route.meta.iFunID)"
            >查询</el-button>
            <el-button
              class="my-reset"
              size="mini"
              @click="onLoadData"
              v-if="$options.filters.btnTree('/api/EventContent/Get' ,$route.meta.iFunID)"
            >重置</el-button>
          </el-row>
        </el-col>
      </el-row>
      <div class="table-btn-control">
        <el-row type="flex" justify="start">
          <el-button
            class="my-tableout"
            plain
            size="mini"
            @click="addItem"
            v-if="$options.filters.btnTree('/api/EventContent/Post' ,$route.meta.iFunID)"
          >
            <i class="iconfont icon-xinzeng"></i>新增
          </el-button>
          <el-button
            class="my-tableout"
            size="mini"
            @click="editItem"
            v-if="$options.filters.btnTree('/api/EventContent/Put' ,$route.meta.iFunID)"
          >
            <i class="iconfont icon-bianji"></i>编辑
          </el-button>
          <el-button
            class="my-tableout"
            size="mini"
            @click="delItem"
            v-if="$options.filters.btnTree('/api/EventContent/Delete' ,$route.meta.iFunID)"
          >
            <i class="iconfont icon-shanchu"></i>删除
          </el-button>
        </el-row>
      </div>
    </el-form>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="300"
      :before-close="handleClose"
      customClass="el_add_dialog"
      class="myDialog"
    >
      <el-form label-width="80px" size="small">
        <el-form-item label="事件分类：">
          <el-select v-model="formValue.ParentTypeId">
            <el-option
              v-for="item in attRFormList"
              :key="item.EventTypeId"
              :label="item.EventTypeName"
              :value="item.EventTypeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件名称：">
          <el-input v-model="formValue.EventTypeName" placeholder="请输入事件名称"></el-input>
        </el-form-item>
        <el-form-item label="执行时间：">
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
            placeholder="请输入执行时间（小时）"
          ></el-input-number>
          <!--  <el-input v-model="formValue.ExecTime" type="number"  placeholder="请输入执行时间"></el-input> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="my-dialog-cancel" @click="cancelBtn">取 消</el-button>
        <el-button class="my-dialog-submit" @click="editFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <InsTable
      :layerListName="'Ins_EvenContent_Columns'"
      :tableHeight="'calc(100vh - 237px)'"
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
import EventContent from "@api/Inspection/EventContent";
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
      dialogTitle: "", //弹框表格标题
      formValue: {
        ParentTypeId: "",
        ExecTime: null,
        EventTypeName: ""
      }, //弹框formvalue
      attRFormList: [], //弹框form的上报类型列表(去除全部选项)
      attRList: [], //上报类型列表
      attRListValue: "all" //上报类型选中值
    };
  },
  ///**select选择列信息 *//**点击高亮行信息 *//**表格一页显示的行数 *//**表格页码 *///
  created() {
    this.onLoadData(); //加载默认数据及调用接口获取默认数据
  },
  watch: {},
  methods: {
    onLoadData() {
      //获取上报类型下拉seclect数据
      EvenType.EventContentLoad().then(res => {
        this.attRList = _.cloneDeep(res.data.Data.Result);
        this.attRFormList = _.cloneDeep(res.data.Data.Result);
        this.attRList.unshift({
          EventTypeId: "all",
          EventTypeName: "全部"
        });
      });
      //默认上报类型值为全部
      this.attRListValue = "all";
      this.GetData(); //调用接口加载数据
    },
    //input输入框绑定事件
    ExecTimeChange(value) {
      this.formValue.ExecTime = value;
    },
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
      //全部查询使用全部查询的接口
      if (!this.attRListValue || this.attRListValue == "all") {
        EventContent.EventContentAll(this.pageSize, this.pageNumber).then(
          res => {
            this.columnListData = res.data.Data.Result;
            this.dataTotal = res.data.Data.TotalRows;
            this.loading = false;
            //this.attRListValue = this.attRListValue;
          }
        );
      } else {
        //根据id查询使用id查询的接口
        EventContent.EventContentSearch(
          this.pageSize,
          this.pageNumber,
          this.attRListValue
        ).then(res => {
          this.loading = false;
          this.columnListData = res.data.Data.Result;
          this.dataTotal = res.data.Data.TotalRows;
        });
      }
    },
    //新增修改提交方法
    editFormSubmit() {
      let _ParentTypeId = this.formValue.ParentTypeId;
      let _ExecTime = _.floor(this.formValue.ExecTime);
      let _EventTypeName = this.formValue.EventTypeName;
      if (!_ParentTypeId) {
        this.$message({
          type: "error",
          message: "请选择事件分类",
          showClose: true
        });
        return;
      } else if (!_EventTypeName) {
        this.$message({
          type: "error",
          message: "请输入事件名称",
          showClose: true
        });
        return;
      } else if (!_ExecTime) {
        this.$message({
          type: "error",
          message: "请输入执行时间",
          showClose: true
        });
        return;
      } else if (_ExecTime <= 0) {
        this.$message({
          type: "error",
          message: "请输入正确的执行时间",
          showClose: true
        });
        return;
      }
      //修改提交方法
      if (this.formValue.edit) {
        let _EventTypeId = this.formValue.EventTypeId;
        EventContent.EventContentEdit(
          _ParentTypeId,
          _EventTypeName,
          _ExecTime,
          _EventTypeId
        ).then(res => {
          this.dialogVisible = false;
          this.$message({
            type: "success",
            message: "修改成功",
            showClose: true
          });
          this.loading = true;
          this.GetData();
        });
        return;
      }
      //新增提交方法
      EventContent.EventContentAdd(
        _ParentTypeId,
        _EventTypeName,
        _ExecTime
      ).then(res => {
        this.dialogVisible = false;
        this.$message({
          type: "success",
          message: "添加成功",
          showClose: true
        });
        this.GetData();
      });
    },
    //关闭弹窗方法
    handleClose(done) {
      done();
    },
    //新增按钮，显示弹窗
    addItem() {
      this.dialogVisible = true;
      this.dialogTitle = "新增";
      this.formValueSet();
    },
    //修改编辑按钮，显示弹窗
    editItem() {
      if (!this.currentRow) {
        this.$message({
          type: "warning",
          message: "请选择需要操作的数据",
          showClose: true
        });
        return;
      }
      this.dialogVisible = true;
      this.dialogTitle = "编辑";
      this.formValueSet(this.currentRow);
      this.formValue.edit = true;
    },
    //formValue值设置
    formValueSet(row) {
      if (row) {
        this.formValue.ExecTime = row.ExecTime;
        this.formValue.EventTypeName = row.EventTypeName;
        this.formValue.EventTypeId = row.EventTypeId;
        this.formValue.ParentTypeId = row.ParentTypeId;
      } else {
        this.$refs.numberInput.currentValue = undefined;
        this.formValue = {
          ExecTime: "", //时间
          EventTypeName: "", //上报内容
          EventTypeId: "",
          ParentTypeId: ""
        };
      }
    },
    currentChange(row) {
      this.currentRow = row;
    },
    //删除操作
    delItem() {
      if (!this.currentRow) {
        this.$message({
          type: "warning",
          message: "请选择需要操作的数据",
          showClose: true
        });
        return;
      }
      this.$confirm("确认删除？").then(() => {
        this.loading = true;
        EventContent.EventContentDel(this.currentRow.EventTypeId).then(res => {
          this.$message({
            type: "success",
            message: "删除成功",
            showClose: true
          });
          this.GetData();
        });
      });
    },
    cancelBtn() {
      this.dialogVisible = false;
      this.formValueSet();
    },
    //改变上报类型属性时，更新数据列表
    AttrChange() {
      this.loading = true;
      this.GetData(1);
    }
  }
};
</script>