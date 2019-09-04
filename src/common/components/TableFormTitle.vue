<template>
  <el-row class="page-title" type="flex" justify="space-between">
      <span class="text">{{titleName}}</span>   
      <span  @click="flexibleFnc" class="icon">
        <span v-show="flexible">展开 </span><i class="iconfont icon-shousuo"></i>
      </span>
    </el-row>
</template>
<script>
import _ from "lodash";
import { setTimeout } from 'timers';
export default {
  props: ["flexible","titleName"],
  data() {
    return {
    };
  },
  methods: {
     //是否收缩左侧表格
    flexibleFnc(){
      let val = !this.flexible;
      this.$emit("update:flexible",val)
      this.$bus.emit("flexibleControl",val )
    },
  }
};
</script>
