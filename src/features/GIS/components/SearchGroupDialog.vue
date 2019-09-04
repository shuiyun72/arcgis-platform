<template>
  <el-dialog
    title="请选择要展示的类别"
    :visible.sync="dialogVisible"
    width="400px"
    :before-close="cancelBtn"
    class="add_point_dialog"
  >
    <el-row>
      <el-col :span="5">名称：</el-col>
      <el-col :span="16">
        <el-cascader :options="layerData" v-model="selectLayerValue"  :show-all-levels="false" @change="onLayerChange"></el-cascader>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type @click="cancelBtn" size="mini">取消</el-button>
      <el-button type="primary" @click="submitDialog" size="mini">提交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import _ from "lodash";
export default {
  props: ["layerData", "selectLayerValue", "dialogVisible"],
  data() {
    return {
      topTotleMessage: []
    };
  },
  methods: {
    onLayerChange(item) {
      this.$emit("update:selectLayerValue", item);
    },
    cancelBtn() {
      this.$bus.emit("clearGraphics");
      this.$emit("update:loading", false);
      this.$emit("update:dialogVisible", false);
    },
    submitDialog() {
      this.$emit("update:dialogVisible", false);
      this.$emit("searchFnc");
    }
  }
};
</script>
