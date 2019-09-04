<template>
 <el-row type="flex" justify="end">
    <el-col :span="10"  :offset="5">
        <el-button-group>
          <el-button type="primary" size="mini" @click="addItem" icon="el-icon-plus">新增</el-button>
          <el-button type="primary" size="mini" @click="editItem" icon="el-icon-edit">编辑</el-button>
          <el-button type="primary" size="mini" @click="delItem" icon="el-icon-delete">删除</el-button>
        </el-button-group>
        <el-dialog
          :title="dialogTitle"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose"
        >
          <el-form label-width="80px" size="small">
            <el-form-item label="名称">
              <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>
            <el-form-item label="活动区域">
              <el-input v-model="formLabelAlign.region"></el-input>
            </el-form-item>
            <el-form-item label="活动形式">
              <el-input v-model="formLabelAlign.type"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
    </el-col>
 </el-row>
</template>
<script>
import _ from "lodash";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogTitle: "",
      dialogData: null,
      formLabelAlign: {
        name: "",
        region: "",
        type: ""
      }
    };
  },
  props: {
    tableIndex: {
      type: Array
    },
    currentRow: {
      type: Object
    }
  },
  created() {},
  methods: {
    handleClose(done) {
          done();
    },
    addItem() {
      this.dialogVisible = true;
      this.dialogTitle = "新增";
    },
    editItem() {
      if (this.currentRow) {
        this.dialogVisible = true;
        this.dialogTitle = "编辑";
        this.dialogData = this.currentRow;
      } else if (!this.tableIndex.length) {
        this.$message({
                type: "warning",
                message: "请选择要编辑的数据"
              });
        return;
      } else if (this.tableIndex.length > 1) {
        this.$message({
                type: "warning",
                message: "请选择要编辑的数据"
              });
        return;
      } else {
        this.dialogVisible = true;
        this.dialogTitle = "编辑";
      }
    },
    delItem() {
      if (!(this.tableIndex.length||this.currentRow)) {
        console.log(this.tableIndex);
        this.$message({
                type: "warning",
                message: "请选择要删除的数据"
              });
        return;
      }
      this.$confirm("确认删除？")
        .then(() => {
          console.log(this.tableIndex);
          done(tableIndex);
        })
    }
  }
};
</script>