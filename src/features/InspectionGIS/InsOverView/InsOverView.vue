<template>
  <div class="InsOverView">
    <div class="inspectiongis_fixed" :class="{flexible:flexible}">
      <span class="control-show-btn" @click="flexible = false" v-show="flexible">
        显示图表
        <i class="iconfont icon-shousuo"></i>
      </span>
      <div class="overview-card" v-show="!flexible">
        <TableFormTitle :titleName="'事件管理'" :flexible.sync="flexible"></TableFormTitle>
        <el-row class="car-list-wrapper">
          <router-link :to="{name:'InsEven'}">
            <el-col
              span="8"
              v-for="item in inspectionCardData"
              :key="item.title"
              :class="item.class"
              class="list-item"
            >
              <p>{{item.title}}</p>
              <p>{{item.num}} {{item.unit}}</p>
            </el-col>
          </router-link>
        </el-row>
        <div class="event_pie" label="数据图表" style="height:300px;"></div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
//import MapDataOperation from "@services/ArcMap/MapDataOperation";
import echarts from "echarts";
import { ChartPieLight } from "@util/echart";
import InspectionStatistics from "@api/Inspection/InspectionStatistics";
import TaskManage from "@api/Inspection/TaskManage";
import EventManage from "@api/Inspection/EventManage";
import TableFormTitle from "@common/components/TableFormTitle";
import utilData from "@util/utilData";
export default {
  data() {
    return {
      flexible: false, //是否收缩左侧表格
      MaintainCardData: {
        title: "事件类型分析",
        titleColor: "#DF3939",
        contentColor: "#fff",
        titleIcon: "icon-xiaoshoutongji"
      },
      EventSourceAnalysis: [
        { name: "热线系统", value: "70" },
        { name: "接电上报", value: "28" },
        { name: "临时工作", value: "30" }
      ],
      inspectionCardData: [
        {
          icon: "icon-zhexiantu",
          title: "今日任务数量",
          num: "33",
          unit: "项",
          class: "blue"
        },
        {
          icon: "icon-zhexiantu",
          title: "本月任务数量",
          num: "2",
          unit: "项",
          class: "red"
        },
        {
          icon: "icon-zhexiantu",
          title: "本月上报事件",
          num: "0",
          unit: "个",
          class: "yellow"
        }
      ]
    };
  },
  components: {
    TableFormTitle
  },
  created() {
    //初始化数据
  },
  mounted() {
    this.getData();
  },
  methods: {
    charInitPie() {
      var chartPie = _.cloneDeep(ChartPieLight);
      chartPie.series[0].name = "事件类型";
      chartPie.series[0].data = this.EventSourceAnalysis;
      chartPie.tooltip = { formatter: "{a} <br/>{b} : {c} ({d}%)" };
      chartPie.title = {
        text: "事件类型分析",
        x: "center",
        textStyle: {
          color: "#000",
          fontWeight: 400,
          fontSize: 18,
          fontFamily: "AdobeHeitiStd-Regular",
          letterSpacing: 0.9
        }
      };
      // chartPie.legend = {
      //   type: 'scroll',
      //   orient: 'horizontal',
      //   bottom: 2,
      //   left: 10,
      //   right: 10,
      //   data: _.map(this.EventSourceAnalysis,item => {
      //     item.icon = 'circle'
      //     return item
      //   })
      // },
      echarts
        .init(document.querySelector(".overview-card .event_pie"))
        .setOption(chartPie);
    },
    getData() {
      this.getCharData();
      this.getTaskData();
    },
    getCharData() {
      let data, _startTime, _endTime;
      data = utilData.getMonth();
      _startTime = data.begin;
      _endTime = data.over;
      _startTime = "2001-01-01";
      InspectionStatistics.EventTypeChart(_startTime, _endTime).then(res => {
        this.EventSourceAnalysis = _.map(res.data.Data.Result, item => {
          return {
            name: item.EventTypeName,
            value: item.num
          };
        });

        this.charInitPie();
      });
    },
    getTaskData() {
      //本日任务统计
      let current = utilData.getCurrentDate();
      current = utilData.myformatStr(current);
      TaskManage.taskCount(current, current).then(res => {
        this.inspectionCardData[0].num = res.data.Data.Result[0].count;
      });
      //本月任务统计
      let monthData = utilData.getMonth();
      let _startTime = monthData.begin;
      let _endTime = monthData.over;
      TaskManage.taskCount(_startTime, _endTime).then(res => {
        this.inspectionCardData[1].num = res.data.Data.Result[0].count;
      });
      //本月事件统计
      EventManage.EventManageCount(_startTime, _endTime).then(res => {
        this.inspectionCardData[2].num = res.data.Data.Result[0].count;
      });
    }
  }
};
</script>
<style lang="stylus">
.Pipe_Query_container {
  position: relative;
}
</style>
