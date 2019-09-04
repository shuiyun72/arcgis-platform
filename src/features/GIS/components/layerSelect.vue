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
  created() {
  },
  data() {
    return {};
  },
  methods: {
    dbSelectChange() {
      this.$emit("update:groupLayerDataValue", this.groupLayerDataValue);
      this.$emit("update:layerDataValue", this.groupLayerDataValue[1]);
      this.$emit("update:loading", true);
      if (this.groupLayerDataValue[1] != "all") {
        this.$emit(
          "update:layerListName",
          FeatureLayerOperation.getLayerFeatureByName(this.groupLayerDataValue[1])
            .listViewColumn
        );
      } else {
         this.$emit("update:layerListName", "all");
      }

      this.$emit("onGroupLayerSelectChange");
    },
    oneSelectChange() {
      
      this.$emit("update:layerDataValue", this.layerDataValue);
      if( this.$route.name === 'BufferSearch' ){
         return 
      }
      if(this.$route.name === 'NormalSearch'||this.$route.name === 'SeniorSearch' || this.$route.name === 'DeviceShow' || this.$route.name === 'DataCount'){
        this.$emit("onLayerSelectChange");
        return
      }
      this.$emit("update:loading", true);
      if (this.layerDataValue == "all") {
        this.$emit("update:layerListName", "all");
      } else {
        this.$emit(
          "update:layerListName",
          FeatureLayerOperation.getLayerFeatureByName(this.layerDataValue)
            .listViewColumn
        );
      }
      this.$emit("onLayerSelectChange");
    }
  }
};
</script>

