<template>
  <el-row>
    <el-form-item label="事件状态：" class="event_status_btn">
        <el-button
          class="table-state-btn"
          size="mini"
          v-for="item in EventStatus"
          :key="item.OperName2"
          :class="{active:EventStatusSelect==item.OperName2}"
          @click="nowStatus(item.OperId,item.OperName2)"
        >
          {{item.OperName2}}
          <!-- {{item.OperName2}}(<span>{{item.num}}</span>) -->
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
    nowStatus(EventFromID,EventType){
      this.EventStatusSelect = EventType;
      this.$emit("nowStatus",EventFromID,EventType)
    }
  },
  computed: {},
  created() {
    MaApiStatus.GetStatusForMantain().then(res => {
      this.EventStatus = res.data.Data.Result;
      let obj = {
        OperId: "",
        OperName: "全 部",
        OperName2: "全 部",
        rank: 0
      };
      let inVailid = {
        OperId: 0,
        OperName: "无 效",
        OperName2: "无 效",
        rank: 0
      };
      this.EventStatus.unshift(obj);
      this.EventStatus.push(inVailid);
      //this.FlowPath = res
    });
  },
  
  components: {}
};
</script>
<style lang="stylus" scoped>
.MaintainGIS .event_status_btn .table-state-btn {
    width:66px;
}
</style>