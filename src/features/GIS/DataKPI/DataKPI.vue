<template>
  <div class="data_kpi">
    <el-scrollbar>
      <el-row justify="space-around" type="flex" class="flexWrapper">
        <!--组件1 位置1-1-1-->
        <easy-card :easyCardData="EasyCard.pipeLength"></easy-card>
        <!--组件1 位置1-1-2-->
        <easy-card :easyCardData="EasyCard.pipeNumber"></easy-card>
        <!--组件1 位置1-1-3-->
        <easy-card :easyCardData="EasyCard.valueNumber"></easy-card>
        <!--组件3  位置1-1-4-->
        <easy-card :easyCardData="EasyCard.hydrantNumber"></easy-card>
      </el-row>
      <el-row justify="space-around" type="flex" class="flexWrapper">
        <!--组件3  位置1-3-1-->
        <roundness-card :roundnessCardData="RoundnessCardData.matealriLength">
          <div class="char-wraper pie1" label="数据图表" style="width: 100%;height:234px;"></div>
        </roundness-card>

        <!--组件3  位置1-3-2-->
        <roundness-card :roundnessCardData="RoundnessCardData.matealriNumber">
          <div class="char-wraper pie2" label="数据图表" style="width: 100%;height:234px;"></div>
        </roundness-card>

        <!--组件1  位置2-2-1-->
        <roundness-card :roundnessCardData="RoundnessCardData.DN150AllLength">
          <div class="char-wraper gauge1" label="数据图表" style="width: 100%;height:234px;"></div>
        </roundness-card>

        <!--组件1 位置2-2-2-->
        <roundness-card :roundnessCardData="RoundnessCardData.DN400AllLength">
          <div class="char-wraper gauge2" label="数据图表" style="width: 100%;height:234px;"></div>
        </roundness-card>
      </el-row>
      <el-row justify="space-around" type="flex" class="flexWrapper">
        <!--组件2  位置1-2-1-->
        <statistics-card :statisticsCardData="StatisticsCardData.caliberLength">
          <div class="char-wraper bar1" label="数据图表" style="width: 100%;height:300px;"></div>
        </statistics-card>
        <!--组件2 位置2-3-1-->
        <statistics-card :statisticsCardData="StatisticsCardData.caliberNumber">
          <div class="char-wraper bar2" label="数据图表" style="width: 100%;height:300px;"></div>
        </statistics-card>
      </el-row>
    </el-scrollbar>
  </div>
</template>
<script>
import axios from "axios";
import _ from "lodash";
import {
  MapConfigure,
  LAYER_NAME_MAP,
  LayerType,
  FeatureLayerOperation
} from "@common/consts/GisConst/MapConfigure";
import * as easyuiTable from "@common/consts/GisConst/GisTableColumn";
import echarts from "echarts";
import MapDataOperation from "@services/ArcMap/MapDataOperation";
import {
  ChartBar,
  ChartPie,
  ChartGauge,
  ChartPieGIS,
  ChartBarGIS
} from "@util/echart";
import { ExportExcel, FixFloat } from "@util";

import EasyCard from "./DataCard/EasyCard";
import StatisticsCard from "./DataCard/StatisticsCard";
import RoundnessCard from "./DataCard/RoundnessCard";

export default {
  data() {
    return {
      EasyCard: {
        //---------------------------------组件1数据
        pipeLength: {
          //管网总长度
          class: "bg1",
          iconColor: "#1499b4",
          leftColor: "#00c3aa",
          rightColor: "#01aed5",
          icon: "icon-gongshuiguanwangchangdu",
          title: "供水管网总长度",
          num: "320.65",
          unit: "千米 (KM)"
        },
        pipeNumber: {
          //管网总数量
          class: "bg2",
          iconColor: "#ca5500",
          leftColor: "#e3870a",
          rightColor: "#e2640b",
          icon: "icon-gongshuiguanwangshuliang",
          title: "供水管网总数量",
          num: "7795",
          unit: "根 (PCS)"
        },
        valueNumber: {
          //阀门总数量
          class: "bg3",
          iconColor: "#3900b3",
          leftColor: "#2665e1",
          rightColor: "#4501d6",
          icon: "icon-famenshuliang",
          title: "阀门总数量",
          num: "0",
          unit: "个 (NUMBERS)"
        },
        hydrantNumber: {
          //消防栓总数量
          class: "bg4",
          iconColor: "#ad0048",
          leftColor: "#e12076",
          rightColor: "#b9024c",
          icon: "icon-xiaofangshuan1",
          title: "消防栓总数量",
          num: "1303",
          unit: "个 (NUMBERS)"
        }
      },
      StatisticsCardData: {
        //---------------------------------组件2数据
        caliberLength: {
          title: "供水管网 【口径-长度】分布",
          classNoun: "口径长度"
        },
        caliberNumber: {
          title: "供水管网 【口径-数量】分布",
          classNoun: "口径数量"
        }
      },
      RoundnessCardData: {
        //---------------------------------组件3数据
        matealriLength: {
          title: "供水管网 【材质-长度】比例"
        },
        matealriNumber: {
          title: "供水管网 【材质-数量】比例"
        },
        DN150AllLength: {
          title: "DN150以上管网总长度",
        },
        DN400AllLength: {
          title: "DN400以上管网总长度",
        }
      },
      caliberAllLength: [], //口径总数据
      layerDataValue: "caliber",
      allLength: 0, //总长度
      allNumber: 0, //总数量
      materialScienceAll: [], //材质总数据
      gt150AllLength: 0, //大于150M总长度
      gt400AllLength: 0 //大于400M总长度
    };
  },
  created() {
    this.$bus.emit("FullScren", true);
  },
  updated() {
    this.$bus.emit("FullScren", true);
  },
  beforeDestroy() {
    this.$bus.emit("FullScren", false);
  },
  components: {
    EasyCard,
    StatisticsCard,
    RoundnessCard
  },
  mounted() {
    this._MapDataOperation = new MapDataOperation();
    this._MapDataOperation.init().then(() => {
      this.getCaliberAllLength(); //调取数据
    });
  },
  methods: {
    charInitBar() {
      var chartBarZoom = _.cloneDeep(ChartBarGIS);

      let xAxisArrBarCaliber = []; //口径集合[]
      let xAxisArrBarLength = []; //长度集合[]
      let xAxisArrBarNumber = []; //数量集合[]
      this.allLength = 0;
      for (var i in this.caliberAllLength) {
        xAxisArrBarCaliber.push(this.caliberAllLength[i].caliber);
        xAxisArrBarLength.push(this.caliberAllLength[i].length);
        xAxisArrBarNumber.push(this.caliberAllLength[i].equipment_number);
        this.allLength += Number(this.caliberAllLength[i].length);
        this.allNumber += this.caliberAllLength[i].equipment_number;
      }
      if (this.$store.state.gisCount.pipeLengthNumber) {
        this.EasyCard.pipeLength.num = this.$store.state.gisCount.pipeLengthNumber;
      } else {
        this.EasyCard.pipeLength.num = (this.allLength / 1000).toFixed(2); //总长度赋值
        this.$store.dispatch("gisCount/setState", {
          eName: "pipeLengthNumber",
          number: (this.allLength / 1000).toFixed(2)
        });
      }

      if (this.$store.state.gisCount.pipeCountNumber) {
        this.EasyCard.pipeNumber.num = this.$store.state.gisCount.pipeCountNumber;
      } else {
        this.EasyCard.pipeNumber.num = this.allNumber; //总长度赋值
        this.$store.dispatch("gisCount/setState", {
          eName: "pipeCountNumber",
          number: this.allNumber
        });
      }

      // 柱形图1 配置项   -------  供水管网 【口径-长度】分布"
      chartBarZoom.title = null;
      chartBarZoom.legend.data = ["口径", "口径长度"];
      chartBarZoom.legend.top = "66px";
      chartBarZoom.toolbox.right = 10;
      chartBarZoom.toolbox.top = 16;
      chartBarZoom.grid = {
        top: "100px",
        left: "4%",
        right: "4%",
        bottom: "1%",
        containLabel: true
      };
      chartBarZoom.xAxis[0].data = xAxisArrBarCaliber;
      chartBarZoom.series[0].name = "口径长度";
      chartBarZoom.series[0].data = xAxisArrBarLength;
      echarts
        .init(document.querySelector(".char-wraper.bar1"))
        .setOption(chartBarZoom);

      // 柱形图2配置项  ------------ 供水管网 【口径-数量】分布
      chartBarZoom.series[0].data = xAxisArrBarNumber;
      chartBarZoom.series[0].name = "口径数量";
      chartBarZoom.legend.data = ["口径", "口径数量"];
      chartBarZoom.legend.top = "66px";
      echarts
        .init(document.querySelector(".char-wraper.bar2"))
        .setOption(chartBarZoom);
    },
    charInitPie() {
      //供水管网【材质-长度】比例
      var chartPie = _.cloneDeep(ChartPie);
      chartPie.toolbox = {};
      var materialScienceLengthData = []; //材质长度数据
      var materialScienceNumberData = []; //材质数量数据

      for (var k in this.materialScienceAll) {
        materialScienceLengthData.push({
          value: this.materialScienceAll[k].length,
          name: this.materialScienceAll[k].material_science
        });
        materialScienceNumberData.push({
          value: this.materialScienceAll[k].equipment_number,
          name: this.materialScienceAll[k].material_science
        });
      }

      chartPie.title = null;
      chartPie.series[0].name = "材质-长度";
      chartPie.series[0].data = materialScienceLengthData;
      chartPie.tooltip = { formatter: "{a} <br/>{b} : {c} ({d}%)" };
      chartPie.series[0].center = ["50%", "50%"];
      echarts
        .init(document.querySelector(".char-wraper.pie1"))
        .setOption(chartPie);

      //供水管网【材质-数量】比例
      chartPie.series[0].name = "材质-数量";
      chartPie.series[0].data = materialScienceNumberData;
      echarts
        .init(document.querySelector(".char-wraper.pie2"))
        .setOption(chartPie);
    },
    gtCharInitGauge() {
      var chartGauge = _.cloneDeep(ChartGauge);

      for (var i in this.caliberAllLength) {
        if (this.caliberAllLength[i].caliber >= 150) {
          this.gt150AllLength += Number(this.caliberAllLength[i].length);
        }
        if (this.caliberAllLength[i].caliber >= 400) {
          this.gt400AllLength += Number(this.caliberAllLength[i].length);
        }
      }
      //DN150以上管网总长度
      chartGauge.series[0].name = 'DN150以上管网总长度'
      chartGauge.series[0].data[0].value = (this.gt150AllLength/1000).toFixed(2);
      echarts
        .init(document.querySelector(".char-wraper.gauge1"))
        .setOption(chartGauge);

      //DN400以上管网总长度
      chartGauge.series[0].data[0].value = (this.gt400AllLength/1000).toFixed(2);
      chartGauge.series[0].name = 'DN400以上管网总长度'
      echarts
        .init(document.querySelector(".char-wraper.gauge2"))
        .setOption(chartGauge);
    },
    getCaliberAllLength() {
      let _GData = null; //空间数据
      let _SearchCondition = " 1=1 "; //查询条件
      //分组统计字段
      let _GroupStaticesField = [
        {
          statisticType: "count", //定义统计类型 'count'|'sum'|'min'|'max'|'avg'|'stddev'
          onStatisticField: "OBJECTID",
          outStatisticFieldName: "equipment_number"
        },
        {
          statisticType: "sum", //定义统计类型 'count'|'sum'|'min'|'max'|'avg'|'stddev'
          onStatisticField: "length",
          outStatisticFieldName: "length"
        }
      ];
      let pipeURL = FeatureLayerOperation.getLayerURLByType(LayerType.PipeTypeNO);
      let _GroupField = ["caliber"]; //口径分组字段
      this._MapDataOperation.featureQueryGroup(
        _GData,
        _SearchCondition,
        _GroupStaticesField,
        _GroupField,
        pipeURL,
        resultValue => {
          //保留三位小数
          let caliberAllLength = FixFloat(resultValue);
          let result = {};
          _.forEach(caliberAllLength, item => {
            if (result[item.caliber]) {
              result[item.caliber].length =
                Number(result[item.caliber].length) + Number(item.length);
              result[item.caliber].equipment_number += item.equipment_number;
            } else {
              result[item.caliber] = item;
            }
          });
          caliberAllLength = _.values(result);
          //排序
          this.caliberAllLength = _.sortBy(caliberAllLength, 'caliber');
          this.charInitBar();
          this.gtCharInitGauge();
        }
      );
      _GroupField = ["material_science"]; //材质分组字段
      this._MapDataOperation.featureQueryGroup(
        _GData,
        _SearchCondition,
        _GroupStaticesField,
        _GroupField,
        pipeURL,
        resultValue => {
          //保留三位小数
          let materialScienceAll = FixFloat(resultValue);
          let result = {};
          _.forEach(materialScienceAll, item => {
            if (result[item.material_science]) {
              result[item.material_science].length =
                Number(result[item.material_science].length) +
                Number(item.length);
              result[item.material_science].equipment_number +=
                item.equipment_number;
            } else {
              result[item.material_science] = item;
            }
          });
          materialScienceAll = _.values(result);
          //排序
          this.materialScienceAll = _.sortBy(materialScienceAll, 'caliber');
          this.charInitPie();
        }
      );
      //从vuex获取管线数据
      if (this.$store.state.gisCount.pipeCountNumber) {
        this.EasyCard.pipeNumber.num = this.$store.state.gisCount.pipeCountNumber;
      }
      if (this.$store.state.gisCount.pipeLengthNumber) {
        this.EasyCard.pipeLength.num = this.$store.state.gisCount.pipeLengthNumber;
      }

      //阀门总量
      if (this.$store.state.gisCount.ValveCountNumber) {
        this.EasyCard.valueNumber.num = this.$store.state.gisCount.ValveCountNumber;
      } else {
        let valveLayerURl = FeatureLayerOperation.getLayerURLByType(
          LayerType.ValveTypeNO
        );
        let _countGroupStaticesField = [
          {
            statisticType: "count", //定义统计类型 'count'|'sum'|'min'|'max'|'avg'|'stddev'
            onStatisticField: "OBJECTID",
            outStatisticFieldName: "equipment_number"
          }
        ];
        this._MapDataOperation.featureQueryGroup(
          _GData,
          _SearchCondition,
          _countGroupStaticesField,
          null,
          valveLayerURl,
          resultValue => {
            this.EasyCard.valueNumber.num = _.sumBy(
              resultValue,
              "equipment_number"
            );
            this.$store.dispatch("gisCount/setState", {
              eName: "ValveCountNumber",
              number: this.EasyCard.valueNumber.num
            });
          }
        );
      }

      //消防栓总量
      if (this.$store.state.gisCount.FireCountNumber) {
        this.EasyCard.hydrantNumber.num = this.$store.state.gisCount.FireCountNumber;
      } else {
        let FireLayerURl = FeatureLayerOperation.getLayerURLByType(
          LayerType.FirehydrantTypeNO
        );
        let _countGroupStaticesField = [
          {
            statisticType: "count", //定义统计类型 'count'|'sum'|'min'|'max'|'avg'|'stddev'
            onStatisticField: "OBJECTID",
            outStatisticFieldName: "equipment_number"
          }
        ];
        this._MapDataOperation.featureQueryGroup(
          _GData,
          _SearchCondition,
          _countGroupStaticesField,
          null,
          FireLayerURl,
          resultValue => {
            this.EasyCard.hydrantNumber.num = _.sumBy(
              resultValue,
              "equipment_number"
            );
            this.$store.dispatch("gisCount/setState", {
              eName: "FireCountNumber",
              number: this.EasyCard.hydrantNumber.num
            });
          }
        );
      }
    }
  }
};
</script>


