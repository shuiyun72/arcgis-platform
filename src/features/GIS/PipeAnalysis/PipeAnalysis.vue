<template>
  <router-view></router-view>
</template>
<script>
import axios from "axios";
import _ from "lodash";
import { MapConfigure, LAYER_NAME_MAP } from "@common/consts/GisConst/MapConfigure";
import {
  E_Pipeline_Columns,
  E_Node_Columns
} from "@common/consts/GisConst/GisTableColumn";

import { error, debug } from "util";
export default {
  data() {
    return {
      tagActive:'',
      layerData: [
        {
          label: "关阀分析",
          link: "GuanFa"
        },
        {
          label: "连通性分析",
          link: "LianTongXing"
        },
        {
          label: "火灾分析",
          link: "HuoZai"
        },
        {
          label: "横断面分析",
          link: "HengDuanMian"
        },{
          label: "纵断面分析",
          link: "ZongDuanMian"
        },
        {
          label: "拆迁分析",
          link: "ChaiQian"
        }],//图层下拉框数据
      
    };
  },
  created(){
    this.tagActive = this.$route.name
  },
  methods: {
    pipeKPI_TagChoose(id) {
      this.tagActive = id
    }
  }
};
</script>
<style lang="stylus" scoped>
.table_style {
  .select-tag-wraper {
    padding: 0;
    height: 35px;
    line-height: 34px;
    box-sizing: border-box;

    .el-tag {
      background:#fff;
      border:none;
      height: 28px;
      line-height: 26px;
      border-radius: 0;
      color: #000;
      font-size: 14px;
      border: 1px solid #93969b;
      margin: 0 10px;

      &.active{
        height: 28px;
        line-height: 26px;
        background: rgba(93,169,197,0.28);
        color: #fff;
        font-weight:800;
      }
    }
  }
}
</style>

