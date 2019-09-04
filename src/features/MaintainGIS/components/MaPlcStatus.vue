<template>
  <el-row>
    <el-form-item label="事件状态：" class="event_status_btn">
        <el-button
          class="table-state-btn"
          size="mini"
          v-for="item in EventStatus"
          :key="item.name"
          :class="{active:EventStatusSelect==item.name}"
          @click="nowStatus(item.name)"
        >
          {{item.name}}(<span>{{item.num}}</span>)
        </el-button>
    </el-form-item>
  </el-row>
</template>
<script>
import _ from "lodash";
import MaApiStatus from "@api/Maintain/GetStatusForMantain";

export default {
  props: {},
  data() {
    return {
      EventStatus: [
        //事件状态
        { name: "全部", num: 150 },
        { name: "待处理", num: 80 },
        { name: "待分派", num: 87 },
        { name: "待接受", num: 34 },
        { name: "待处置", num: 3 },
        { name: "处置中", num: 1 },
        { name: "待审核", num: 11 },
        { name: "已审核", num: 7 },
        { name: "已回复", num: 2 },
        { name: "无效", num: 0 }
      ],
      EventStatusSelect:"全部"
    };
  },
  methods: {
    onLoadData() {
      this.EventStatusSelect = "全部";
    },
    nowStatus(state){
      this.EventStatusSelect = state;
      this.$emit("nowStatus",state)
    }
  },
  computed: {},
  created() {
    MaApiStatus.GetStatusForMantain().then(res => {
      console.log(res.data.Data.Result);
      //this.FlowPath = res
    });
  },
  
  components: {}
};
</script>
<style lang="stylus">


</style>