<template>
  <div class="table_style w700" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'工作时间段管理'" :flexible.sync="flexible"></TableFormTitle>
    <el-row type="flex" justify="start" class="insSetControl">
      <el-button
        class="my-tableout"
        plain
        size="mini"
        @click="addItem"
        v-if="$options.filters.btnTree('/api/WorkTimeInterval/Post' ,$route.name)"
      >
        <i class="iconfont icon-xinzeng"></i>新增
      </el-button>
      <el-button
        class="my-tableout"
        size="mini"
        @click="editItem"
        v-if="$options.filters.btnTree('/api/WorkTimeInterval/Put' ,$route.name)"
      >
        <i class="iconfont icon-bianji"></i>编辑
      </el-button>
      <el-button
        class="my-tableout"
        size="mini"
        @click="delItem"
        v-if="$options.filters.btnTree('/api/WorkTimeInterval/Delete' ,$route.name)"
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
        <el-form-item label="时间：">
          <!-- <el-time-picker
            value-format="HH:mm:ss"
            is-range
            v-model="formLabelAlign.time"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker> -->
          <el-time-select
            placeholder="起始时间"
            class="select_time_width"
            @change="selectTime"
            v-model="startTime"
            :clearable = false
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:59',
              maxTime: endTime
            }">
          </el-time-select>
          --
          <el-time-select
            placeholder="结束时间"
            class="select_time_width"
            @change="selectTime"
            v-model="endTime"
            :clearable = false
            :picker-options="{
              start: '00:00',
              step: '00:15',
               end: '23:59',
              minTime: startTime
            }">
          </el-time-select>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="formLabelAlign.remark" maxlength="26"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="my-dialog-cancel" @click="dialogVisible = false">取 消</el-button>
        <el-button class="my-dialog-submit" @click="formSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <InsTable
      :layerListName="'Ins_TimeSet_Columns'"
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
import WorkTimeInterval from "@api/Inspection/WorkTimeInterval";
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
      dialogVisible: false, //弹窗显示
      dialogTitle: "", //弹窗标题
      formLabelAlign: {
        time: ["", ""],
        remark: ""
      }, //弹窗数据
      startTime:"08:00",
      endTime:"17:00"
    };
  },
  created() {
    this.GetData();
  },
  methods: {
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
      WorkTimeInterval.TimeSetAll(this.pageSize, this.pageNumber).then(res => {
        this.loading = false;
        let listData = res.data.Data.Result;
       
        _.map(listData,res=>{
          res.StartTime = res.StartTime.substring(0, 5);
          res.EndTime = res.EndTime.substring(0, 5);
          if(res.Remarks.length >= 26){
            res.Remarks = res.Remarks.substring(0, 26)+'...';
          }
        })
         console.log(listData)
        this.columnListData = listData;
        this.dataTotal = res.data.Data.TotalRows;
      });
    },
    handleClose(done) {
      done();
    },
    //选择时间段
    selectTime(){
      console.log(this.startTime);
      console.log(this.endTime)
      if(!this.startTime){
        this.$message({
          type: "warning",
          message: " 开始时间不能为空"
        });
        this.startTime = "08:00";
      }
      if(!this.endTime){
        this.$message({
          type: "warning",
          message: " 结束时间不能为空"
        });
        this.endTime = "17:00";
      }
    },
    setFormValue(row) {
      console.log(row)
      if (row) {
        this.startTime = row.StartTime.substring(0, 5);
        this.endTime = row.EndTime.substring(0, 5);
        this.formLabelAlign.remark = row.Remarks;
        this.formLabelAlign.intervalId = row.IntervalId;
      } else {
        this.startTime = "08:00";
        this.endTime = "17:00";
        this.formLabelAlign.remark = "";
        this.formLabelAlign.intervalId = "";
      }
    },
    addItem() {
      this.setFormValue();
      this.dialogVisible = true;
      this.dialogTitle = "新增";
    },
    currentChange(row) {
      this.currentRow = row;
    },
    editItem() {
      if (!this.currentRow) {
        this.$message({
          type: "warning",
          message: "请选择要编辑的数据"
        });
        return;
      }
      this.dialogVisible = true;
      this.dialogTitle = "编辑";
      this.setFormValue(this.currentRow);
    },
    delItem() {
      if (!this.currentRow) {
        this.$message({
          type: "warning",
          message: "请选择要删除的数据"
        });
        return;
      }
      this.$confirm("确认删除？").then(() => {
        WorkTimeInterval.TimeSetDel(this.currentRow.IntervalId)
          .then(res => {
            this.$message({
              type: "success",
              message: "删除成功",
              showClose: true
            });
            this.GetData();
          })
          .catch(() => {
            this.$message({
              type: "error",
              message: "删除失败",
              showClose: true
            });
          });
      });
    },
    formSubmit() {
      let _StartTime = this.startTime+':00';
      let _EndTime = this.endTime +':00';
      let _Remarks = this.formLabelAlign.remark;
      if (!(_StartTime && _EndTime)) {
        this.$message({
          type: "error",
          message: " 请选择时间范围",
          showClose: true
        });
        return;
      } else if (!_Remarks) {
        this.$message({
          type: "error",
          message: " 请添加备注",
          showClose: true
        });
        return;
      }
      if (this.formLabelAlign.intervalId) {
        //编辑时间段
        let _intervalId = this.currentRow.IntervalId;
        WorkTimeInterval.TimeSetEdit(
          _StartTime,
          _EndTime,
          _Remarks,
          _intervalId
        ).then(res => {
          this.dialogVisible = false;
          this.$message({
            type: "success",
            message: "编辑成功",
            showClose: true
          });
          this.GetData();
        });
        return;
      }
      //新增时间段
      WorkTimeInterval.TimeSetAdd(_StartTime, _EndTime, _Remarks).then(res => {
        this.dialogVisible = false;
        this.$message({
          type: "success",
          message: "添加成功",
          showClose: true
        });
        this.GetData();
      });
    }
  }
};
</script>
<style lang="stylus">
.myDialog .el-dialog .el-dialog__body .el-form .el-date-editor.el-input.select_time_width
{
  width:45%;
  input{
    padding:0 16px 0 10px;
  }
}
</style>