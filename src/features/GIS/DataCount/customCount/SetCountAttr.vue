<template>
  <el-dialog
    title="设置统计字段"
    :visible.sync="setDialog"
    width="300"
    :before-close="handleClose"
    customClass="el_add_dialog"
    class="myDialog modularDialog"
  >
    <el-form label-width="80px" size="small">
      <el-form-item label="统计类别：">
        <el-select size="mini" v-model="attrDataValue" @change="layerChange" multiple>
          <el-option
            v-for="item in attrList"
            :key="item.field"
            :label="item.text"
            :value="item.field"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="my-dialog-cancel" @click="dialogClose">取 消</el-button>
      <el-button class="my-dialog-submit" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
 
<script>
import {
  MapConfigure,
  LAYER_NAME_MAP,
  FeatureLayerOperation,
  LayerType
} from "@common/consts/GisConst/MapConfigure";
import * as GisTableColumn from "@common/consts/GisConst/GisTableColumn";
export default {
  props: ["setDialog", "attrList"],
  data() {
    return {
      attrDataValue: [], //当前图层的表格信息选中的信息
      activeItem: [], //当前图层对象
      CheckedAllNodes: [] //选中的包含父节点的数据
    };
  },
  methods: {
    handleClose(done) {
      this.attrDataValue = [];
      this.$emit("update:setDialog", false);
      done();
    },
    dialogClose() {
      this.attrDataValue = [];
      this.$emit("update:setDialog", false);
    },
    submit() {
      if (!this.attrDataValue.length) {
        this.$myMessage("warning", "至少选择一个属性");
        return;
      }
      this.$emit("setSubmit", this.attrDataValue);
      this.dialogClose();
    }
  }
};
</script>