<template>
  <div :style="{height:height , background:background,}">
    <el-row class="choose-chat-type" type="flex" justify="end">
      <span
        v-for="item in chartType"
        :key="item.value"
        @click="changeChart(item)"
        :class=" {active: chartTypeValue==item.value}"
      >
        <i class="iconfont" :class="item.icon"></i>
      </span>
    </el-row>
    <div
      v-loading="loading"
      class="charWraper"
      v-for="column in chartType"
      v-show=" chartTypeValue == column.value"
      :key="column.value"
      :class="column.value"
      :style="{ height: chartTypeValue == column.value ? chartHeight : 0}"
    ></div>
    <resize-observer @notify="handleResize" />
  </div>
</template>
<script>
import { FeatureLayerOperation } from "@common/consts/GisConst/MapConfigure";
import {
  ChartBarZoom,
  ChartPie,
  ChartBarZoomGIS,
  ChartPieGIS
} from "@util/echart";
import echarts from "echarts";
import _ from "lodash";
export default {
  props: {
    //高度
    height: {
      type: String,
      default: "calc(100vh - 240px)"
    },
    //图表高度
    chartHeight: {
      type: String,
      default: "calc(100vh - 260px)"
    },
    //背景色
    background: {
      type: String,
      default: "#2f3239"
    },
    //是否加载中
    loading: {
      type: Boolean,
      default: false
    },
    //统计字段
    attrDataValue: {
      type: String,
      default: ""
    },
    //统计数量
    attrDataNum: {
      type: String,
      default: "equipment_number"
    },
    seconedAttr: {
      type: String,
      default: "length"
    },
    seconedUnit: {
      type: String,
      default: "长度"
    },
    firstUnit: {
      type: String,
      default: "长度(m)"
    }
  },
  created() {},
  data() {
    return {
      myThemeColor: [
        "#00a1c5",
        "#ec4a4c",
        "#49bc6c",
        "#ff9000",
        "#2fd4c0",
        "#e746da",
        "#ffc700",
        "#9946e7"
      ], //颜色列表
      columnListData: [], //数据
      chartType: [
        {
          label: "柱状图",
          value: "bar",
          icon: "icon-tubiao-3"
        },
        {
          label: "折线图",
          value: "line",
          icon: "icon-tubiao-"
        },
        {
          label: "饼状图",
          value: "pie",
          icon: "icon-tubiao-2"
        }
      ], //图表类型列表
      chartTypeValue: "pie", //柱状图和饼状图切换
      chartpie: null,
      chartline: null,
      chartbar: null
    };
  },
  methods: {
    changeChart(item) {
      this.chartTypeValue = item.value;
      this.$nextTick(() => {
        if (this["chart" + this.chartTypeValue]) {
          this["chart" + this.chartTypeValue].resize();
        }
      });
    },
    handleResize() {
      if (this["chart" + this.chartTypeValue]) {
        this["chart" + this.chartTypeValue].resize();
      }
    },
    charInit(data, chartTitle, doubleLine, doubleArrt) {
      this.columnListData = data;
      let chartPie = _.cloneDeep(ChartPieGIS);
      let chartBarZoom = _.cloneDeep(ChartBarZoomGIS);
      let chartDataAttr =
        this.attrDataValue === "all" ? "all" : this.attrDataValue.split(",")[0];
      //饼状图 数据设置

      //竖轴值

      let attrDataArray = this.attrDataValue.split(",");
      let chartBarZoomSeries = {};
      let chartDataseries = [];
      if (attrDataArray.length > 1) {
        _.forEach(this.columnListData, item => {
          chartBarZoomSeries[item[attrDataArray[0]]]
            ? chartBarZoomSeries[item[attrDataArray[0]]].push(item)
            : (chartBarZoomSeries[item[attrDataArray[0]]] = [item]);
        });
      }

      let XSeriesData = [];
      if (attrDataArray.length > 1) {
        _.forIn(chartBarZoomSeries, (item, key) => {
          let newItem = {};
          if (chartDataAttr === "caliber") {
            newItem.name = _.isNull(key)
              ? "未知"
              : Number(key) + "mm";
          } else {
            newItem.name = _.isNull(key)
              ? "未知"
              : key;
          }
          let sum = _.sumBy(item, o => {
            return Number(o[this.attrDataNum]);
          });
          newItem.value = sum;
          XSeriesData.push(newItem);
        });
        console.log(XSeriesData)
      } else {
        XSeriesData = _.map(this.columnListData, item => {
          let newItem = {};
          if (chartDataAttr === "caliber") {
            newItem.name = _.isNull(item[chartDataAttr])
              ? "未知"
              : Number(item[chartDataAttr]) + "mm";
          } else {
            newItem.name = _.isNull(item[chartDataAttr])
              ? "未知"
              : item[chartDataAttr];
          }
          newItem.value = item[this.attrDataNum];
          return newItem;
        });
        XSeriesData = _.uniqBy(XSeriesData, "name");
      }
      chartPie.series[0].data = XSeriesData;

      chartBarZoom.xAxis[0].data = _.uniq(
        this.columnListData.map(item => {
          if (chartDataAttr == "caliber") {
            return _.isNull(item[chartDataAttr])
              ? "未知"
              : Number(item[chartDataAttr]) + "mm";
          } else {
            return _.isNull(item[chartDataAttr]) ? "未知" : item[chartDataAttr];
          }
        })
      );
      //表标题
      //柱状图
      chartBarZoom.title.text = chartTitle;
      chartPie.title.text = chartTitle;
      //chartBarZoom横轴数据

      // chartBarZoom.series[0].type= this.chartTypeValue
      if (attrDataArray.length > 1) {
        chartBarZoom.series[0].data = [];
        _.forIn(chartBarZoomSeries, (value, key) => {
          let sum = _.sumBy(value, o => {
            return Number(o[this.attrDataNum]);
          });
          console.log(sum);
          chartBarZoom.series[0].data.push(sum);
        });
      } else {
        chartBarZoom.series[0].data = _.map(this.columnListData, item => {
          return Number(item[this.attrDataNum]);
        });
      }

      chartBarZoom.yAxis[0].name = this.firstUnit;
      //管网加长度统计

      if (doubleLine && this.attrDataValue != "all") {
        if (
          doubleArrt &&
          doubleArrt instanceof Array &&
          doubleArrt.length > 1
        ) {
          chartBarZoom.yAxis = [];
          _.forEach(doubleArrt, (item, index) => {
            if (index) {
              chartBarZoom.series[index] = _.cloneDeep(chartBarZoom.series[0]);
              chartBarZoom.series[
                index
              ].itemStyle.normal.color = this.myThemeColor[index];

              if (attrDataArray.length > 1) {
                chartBarZoom.series[index].data = [];
                _.forIn(chartBarZoomSeries, (value, key) => {
                  let sum = _.sumBy(value, o => {
                    return Number(o[item.toUpperCase()]);
                  });
                  chartBarZoom.series[index].data.push(sum);
                });
              } else {
                chartBarZoom.series[index].data = _.map(
                  this.columnListData,
                  column => {
                    return Number(column[item.toUpperCase()]);
                  }
                );
              }
              chartBarZoom.series[index].yAxisIndex = index;
            }
            chartBarZoom.yAxis.push({
              splitLine: {
                lineStyle: {
                  color: "#484d57",
                  type: "dashed"
                }
              },
              max: (_.max(chartBarZoom.series[index].data) / 100) * 100,
              min: 0,
              interval:
                ((_.max(chartBarZoom.series[index].data) / 100) * 100) / 10,
              axisLine: {
                lineStyle: {
                  color: "rgba(255,255,255,0.8)"
                }
              }
            });
          });
        } else if (this.seconedAttr) {
          chartBarZoom.series[1] = _.cloneDeep(chartBarZoom.series[0]);
          if (attrDataArray.length > 1) {
            chartBarZoom.series[1].data = [];
            _.forIn(chartBarZoomSeries, (value, key) => {
              let sum = _.sumBy(value, o => {
                return Number(o[this.seconedAttr]);
              });
              chartBarZoom.series[1].data.push(sum);
            });
          } else {
            chartBarZoom.series[1].data = this.columnListData.map(item => {
              return Number(item[this.seconedAttr]);
            });
          }
          chartBarZoom.series[1].name = this.seconedUnit;
          chartBarZoom.series[1].yAxisIndex = 1;
          (chartBarZoom.series[1].itemStyle = {
            normal: {
              color: "#00c4ad"
            }
          }),
            (chartBarZoom.yAxis = [
              {
                splitLine: {
                  lineStyle: {
                    color: "#484d57",
                    type: "dashed"
                  }
                },
                max: Math.ceil(_.max(chartBarZoom.series[0].data) / 100) * 100,
                min: 0,
                interval:
                  (Math.ceil(_.max(chartBarZoom.series[0].data) / 100) * 100) /
                  10,
                name: "数量(个)",
                axisLine: {
                  lineStyle: {
                    color: "rgba(255,255,255,0.8)"
                  }
                }
              },
              {
                splitLine: {
                  lineStyle: {
                    color: "#484d57",
                    type: "dashed"
                  }
                },
                type: "value",
                name: "长度(m)",
                max: Math.ceil(_.max(chartBarZoom.series[1].data) / 100) * 100,
                interval:
                  (Math.ceil(_.max(chartBarZoom.series[1].data) / 100) * 100) /
                  10,
                min: 0,
                axisLine: {
                  lineStyle: {
                    color: "rgba(255,255,255,0.8)"
                  }
                }
              }
            ]);
        }
      }
      //折线图
      let chartLineZoom = _.cloneDeep(chartBarZoom);
      _.forEach(chartLineZoom.series, item => {
        item.type = "line";
      });
      this.chartbar = echarts.init(document.querySelector(".charWraper.bar"));
      this.chartbar.setOption(chartBarZoom, true);
      this.chartline = echarts.init(document.querySelector(".charWraper.line"));
      this.chartline.setOption(chartLineZoom, true);
      this.chartpie = echarts.init(document.querySelector(".charWraper.pie"));
      this.chartpie.setOption(chartPie, true);
    }
  }
};
</script>

