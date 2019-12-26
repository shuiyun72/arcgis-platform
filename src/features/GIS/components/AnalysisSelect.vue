<template>
  <el-button class="anilaysisCascaderWraper my-choose-point" size="mini" @click="btnClick">
    {{btnMessage.text}}
    <el-cascader
      ref="select"
      v-if="this.layerData.length > 1"
      size="mini"
      :options="layerData"
      v-model="selectLayerValue"
      :show-all-levels="false"
      @change="changeSelect"
      class="anilaysisCascader"
    ></el-cascader>
    <el-select
      ref="select"
      class="anilaysisCascader"
      size="mini"
      v-model="layerDataValue"
      @change="layerChange"
      v-if="this.layerData.length == 1 && this.layerData[0].children.length != 1 "
    >
      <el-option
        v-for="item in layerData[0].children"
        :key="item.value"
        :label="item.label"
        :value="item.id"
      ></el-option>
    </el-select>
  </el-button>
</template>
<script>
import _ from "lodash";
export default {
  props: ["layerData", "selectLayerValue", "btnMessage", "listViewColumn"],
  data() {
    return {
      layerDataValue: "",
      topTotleMessage: []
    };
  },
  methods: {
    btnClick() {
      if (
        this.layerData.length == 1 &&
        this.layerData[0].children.length == 1
      ) {
        this.$emit("searchFnc");
      }
    },
    layerChange(item) {
      let layerTableName = _.filter(this.layerData[0].children, child => {
        return child.id === item;
      })[0].listViewColumn;
      this.selectLayerValue[1] = item;
      if (this.listViewColumn) {
        this.$emit("update:listViewColumn", layerTableName);
      }
      this.$emit("update:selectLayerValue", this.selectLayerValue);
      this.$emit("searchFnc");
      this.layerDataValue = "";
    },
    changeSelect(item) {
      this.$emit("update:selectLayerValue", item);
      this.$emit("searchFnc");
      this.selectLayerValue = [];
    }
  }
};
</script>
<style lang="stylus" scoped>
.anilaysisCascaderWraper {
  position: relative;
}

.anilaysisCascader {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
</style>

