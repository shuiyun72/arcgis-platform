<template>
  <div class="inputRange">
    <el-input-number v-model="min" @change="inputChange(0)" :controls="false"></el-input-number>
    <span style="padding:0 4px;">—</span>
    <el-input-number v-model="max" @change="inputChange(1)" :controls="false"></el-input-number>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  data() {
    return {
      min: undefined,
      max: undefined
    };
  },
  props: ["rangeValue", "minValue"],
  watch: {
    rangeValue() {
      if (this.rangeValue.length === 0) {
        this.min = this.max = "";
      }
    }
  },
  methods: {
    inputChange(type) {
      if (type && this.min >= this.max) {
        this.min = this.max - 1;
      } else if (!type && this.max <= this.min) {
        this.max = this.min + 1;
      }
      this.$emit("update:rangeValue", [this.min, this.max]);
    }
  }
};
</script>
<style lang="stylus">
.inputRange {
  display: flex;
  align-items: baseline;

  .el-input input {
    padding: 0 2px;
  }

  .el-input-number.is-without-controls .el-input__inner {
    padding: 0;
  }
}
</style>