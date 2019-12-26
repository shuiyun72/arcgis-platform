<template>
  <el-form-item label="设备：" size="mini">
    <el-cascader
      v-if="layerGroupLen > 1"
      expand-trigger="hover"
      :options="layerData"
      v-model="groupLayerDataValue"
      @change="dbSelectChange"
    ></el-cascader>
    <el-select
      :disabled="layerData.length === 1"
      v-else
      v-model="layerDataValue"
      placeholder="关阀展示"
      @change="oneSelectChange"
      size="mini"
    >
      <el-option
        v-for="item in layerData"
        :key="item.layerNode"
        :value="item.value"
        :label="item.label"
      ></el-option>
    </el-select>
  </el-form-item>
</template>
<script>
import { FeatureLayerOperation } from "@common/consts/GisConst/MapConfigure";
import _ from "lodash";
export default {
  props: [
    "layerGroupLen",
    "layerData",
    "groupLayerDataValue",
    "layerDataValue",
    "loading",
    "layerListName"
  ],
  created() {},
  data() {
    return {};
  },
  methods: {
    dbSelectChange() {
      this.$emit("update:groupLayerDataValue", this.groupLayerDataValue);
      this.$emit("update:layerDataValue", this.groupLayerDataValue[1]);
      // this.$emit("update:loading", true);
      if (this.layerListName) {
        if (this.groupLayerDataValue[1] != "all") {
          this.$emit(
            "update:layerListName",
            FeatureLayerOperation.getLayerFeatureByName(
              this.groupLayerDataValue[1]
            ).listViewColumn
          );
        } else {
          this.$emit("update:layerListName", "all");
        }
      }

      this.$emit("onGroupLayerSelectChange");
    },
    oneSelectChange(item) {
      this.$emit("update:layerDataValue", this.layerDataValue);
      if (this.layerListName) {
        if (this.layerDataValue == "all") {
          this.$emit("update:layerListName", "all");
        } else {
          this.$emit(
            "update:layerListName",
            FeatureLayerOperation.getLayerFeatureByName(this.layerDataValue)
              .listViewColumn
          );
        }
      }

      this.$emit("onLayerSelectChange", item);
    }
  }
};
</script>

