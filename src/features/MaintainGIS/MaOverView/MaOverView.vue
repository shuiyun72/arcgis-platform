<template>
    <div class="InsOverView">
		  <div class="inspectiongis_fixed" :class="{flexible:flexible}">
    		  <span class="control-show-btn" @click="flexible = false" v-show="flexible">
    		    显示图表
    		    <i class="iconfont icon-shousuo"></i>
    		  </span>
    		  <div class="overview-card" v-show="!flexible">
    		    <TableFormTitle :titleName="'事件来源分析'" :flexible.sync="flexible"></TableFormTitle>
    		    <el-row class="car-list-wrapper" type="flex">
					<el-col  class="title">事件管理</el-col>
					<el-col >
						<el-col
    		        span="8"
    		        v-for="item in PandectNav"
    		        :key="item.name"
    		        :class="item.class"
    		        class="btn-item"
    		      >
    		        <p>{{item.name}} ({{item.num}})</p>
    		      </el-col>
					</el-col>
    		      
    		    </el-row>
    		    <div class="event_pie" label="数据图表" style="height:300px;"></div>
    		  </div>
    		</div>
    </div>
</template>
<script>
import axios from "axios";
import _ from "lodash";
import { exportExcel, FixFloat } from "@util";
import NavCom from "../components/NavCom";
import echarts from "echarts";
import { ChartPie, ChartPieLight } from "@util/echart";
import TableFormTitle from "@common/components/TableFormTitle";
export default {
  components: {
    NavCom,
    TableFormTitle
  },
  data() {
    return {
		flexible:false,//是否收缩左侧表格
      PandectNav: [
        { name: "全部", num: 150 },
        { name: "待分派", num: 87 },
        { name: "待接受", num: 34 },
        { name: "待处理", num: 3 },
        { name: "处理中", num: 1 },
        { name: "待审核", num: 11 },
        { name: "已处理", num: 7 },
        { name: "无效", num: 0 }
      ],
      PandectNavSelect: "全部事件",
      MaintainCardData: {
        title: "事件来源分析",
        titleColor: "#DF3939",
        contentColor: "#fff",
        titleIcon: "icon-xiaoshoutongji"
      },
      EventSourceAnalysis: [
        { name: "热线系统", value: "70" },
        { name: "接电上报", value: "28" },
        { name: "临时工作", value: "30" }
      ]
    };
  },

  created() {},
  mounted() {
    this.charInitPie();
  },
  methods: {
    charInitPie() {
      var chartPie = _.cloneDeep(ChartPieLight);
      chartPie.series[0].name = "材质-长度";
      chartPie.series[0].data = this.EventSourceAnalysis;
      chartPie.tooltip = { formatter: "{a} <br/>{b} : {c} ({d}%)" };
      chartPie.title = {
        text: "事件来源分析",
        x: "center",
        textStyle: {
          color: "#000",
          fontWeight: 400,
          fontSize: 18,
          fontFamily: "AdobeHeitiStd-Regular",
          letterSpacing: 0.9
        }
      };
      // (chartPie.legend = {
      //   type: "scroll",
      //   orient: "horizontal",
      //   bottom: "2px",
      //   data: _.map(this.EventSourceAnalysis, item => {
      //     item.icon = "circle";
      //     return item;
      //   })
      // }),
        echarts
          .init(document.querySelector(".event_pie"))
          .setOption(chartPie);
    },
    onNavHandle(el) {
      this.PandectNavSelect = el;
    }
  }
};
</script>