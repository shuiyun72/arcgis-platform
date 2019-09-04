<template>
  <div class="ins-chart">
    <span class="title">数量统计</span>
    <div class="charWraper bar" style="width: 100%;height:40vh;padding:0;"></div>
    <resize-observer @notify="handleResize" />
  </div>
</template>
<script>
import _ from "lodash";
import echarts from "echarts";
import { ChartBarZoomGIS } from "@util/echart";
export default {
  data() {
    return {
      colorList: [
        "#00a1c5",
        "#00c4ad",
        "#49bc6c",
        "#ff9000",
        "#2fd4c0",
        "#e746da",
        "#ffc700",
        "#9946e7"
      ],
      barSeriesItem: { type: "bar", name: "降水量", data: [1, 2] },
      echarsDom: null //方便控制resize
    };
  },
  props: ["data"],
  computed: {},
  methods: {
    handleResize() {
      if (this.echarsDom) {
        this.echarsDom.resize();
      }
    },
    chartInit(chartDataList, num, attr, arryData) {
      let chartBar = _.cloneDeep(ChartBarZoomGIS);
      chartBar.title = [];
      //两种种颜色的bar
      if (arryData) {
        chartBar.xAxis[0].data = arryData.xAxis;
        let len = arryData.series.length;

        let legendData = [];
        chartBar.series = _.map(arryData.series, (item, index) => {
          let itemValue = _.cloneDeep(chartBar.series[0]);
          itemValue.data = item[num];
          itemValue.name = item[attr];
          legendData.push({
            icon: "circle",
            name: item[attr]
          });
          if (len > 1) {
            itemValue.markPoint.itemStyle = {};
            itemValue.itemStyle = {
              normal: {
                color: this.colorList[index]
              }
            };
          }
          return itemValue;
        });
        chartBar.grid = {
          top: "60px",
          left: "20px",
          right: "40px",
          bottom: "60px",
          containLabel: true
        };
      } else {
        (chartBar.grid = {
          top: "80px",
          left: "30px",
          right: "30px",
          bottom: "55px",
          containLabel: true
        }),
          //一种颜色的bar
          (chartBar.xAxis[0].data = _.map(chartDataList, item => {
            return item[attr];
          }));
        chartBar.series[0].data = _.map(chartDataList, item => {
          return item[num];
        });
      }
      this.echarsDom = echarts.init(document.querySelector(".charWraper.bar"));
      this.echarsDom.setOption(chartBar, true);
    }
  }
};
</script>


