<template>
  <div class="InsOverView">
    <div class="inspectiongis_fixed" :class="{flexible:flexible}">
      <span class="control-show-btn" @click="flexible = false" v-show="flexible">
        显示图表
        <i class="iconfont icon-shousuo"></i>
      </span>
      <div class="overview-card picker-date-overview" v-show="!flexible">
        <TableFormTitle :titleName="'事件管理'" :flexible.sync="flexible"></TableFormTitle>
        <el-row>
          <el-col>
            <el-radio-group v-model="dateDataSelect" size="mini" @change="changeDataSelect">
              <el-radio-button
                v-for="date in dateData"
                :label="date.value"
                :key="date.value"
              >{{date.label}}</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-date-picker v-model="dateDataStart" type="date" placeholder="查询开始日期"></el-date-picker>
            <el-date-picker v-model="dateDataEnd" type="date" placeholder="查询结束日期"></el-date-picker>
            <el-button size="mini" @click="getData()">查询</el-button>
          </el-col>
        </el-row>
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
      dateDataSelect: 0,
      dateDataStart:"",
      dateDataEnd:"",
      dateData:[
        {label:"全部",value:0},
        {label:"今天",value:1},
        {label:"昨天",value:2},
        {label:"本周",value:3},
        {label:"上周",value:4},
        {label:"本月",value:5},
        {label:"本年",value:6}
      ],
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
    this.getData(this.dateDataStart,this.dateDataEnd);
    this.getEventManageAll(this.dateDataStart,this.dateDataEnd);
  },
  methods: {
    changeDataSelect(){
      let getDate = new Date().getDate();
      let FullYear = new Date().getFullYear();
      let month = new Date().getMonth();
      let yesterday = new Date().setDate(getDate- 1);
      let weekday = new Date().getDay() || 7;

      let thisWeekStart = new Date().setDate(getDate -  weekday + 1);
      let thisWeekEnd = new Date().setDate(getDate  - weekday + 7 );

      let lastWeekStart = new Date().setDate(getDate - weekday -6);
      let lastWeekEnd = new Date().setDate(getDate - weekday);

      let thisMouthStart = new Date(FullYear,month,1);
      let thisMouthEnd = new Date(FullYear,month+1,0);

      let thisYearStart = FullYear+'-01-01';
      let thisYearEnd = FullYear+'-12-31';

      if(this.dateDataSelect == 0){
        this.dateDataStart = "";
        this.dateDataEnd = "";
      }else if(this.dateDataSelect == 1){  //今天
        this.dateDataStart = new Date();
        this.dateDataEnd = new Date();
      }else if(this.dateDataSelect == 2){  //昨天
        this.dateDataStart = new Date(yesterday);
        this.dateDataEnd = new Date(yesterday);
      }else if(this.dateDataSelect == 3){  //本周
        this.dateDataStart = new Date(thisWeekStart);
        this.dateDataEnd = new Date(thisWeekEnd);
      }else if(this.dateDataSelect == 4){  //上周
        this.dateDataStart = new Date(lastWeekStart);
        this.dateDataEnd = new Date(lastWeekEnd);
      }else if(this.dateDataSelect == 5){  //本月
        this.dateDataStart = thisMouthStart;
        this.dateDataEnd = new Date(thisMouthEnd);
      }else if(this.dateDataSelect == 6){   //本年
        this.dateDataStart = new Date(thisYearStart);
        this.dateDataEnd = new Date(thisYearEnd);
      }
      this.getEventManageAll(this.dateDataStart,this.dateDataEnd);
      this.getData();
    },
    convertTimeFormat(data){
      return data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate()
    },
    //查询全部事件
    getEventManageAll(firstDate, lastDate) {
      firstDate = firstDate ? this.convertTimeFormat(firstDate) : "";
      lastDate = lastDate ? this.convertTimeFormat(lastDate) : "";
      EventManage.EventManageAll(5000, 1, firstDate, lastDate).then(res => {
        console.log("使用这个值", res.data.Data.Result);
        let Result = res.data.Data.Result;
        let DataForPosition = [];
        let trueResult = [];
        _.map(Result, res => {
          //DataForMap.push({"EventPosition":[res.EventX,res.EventY],"EventFromName":res.EventFromName})
          if (Number(res.EventX) > 10 && Number(res.EventX) < 500) {
            DataForPosition.push([res.EventX, res.EventY]);
            trueResult.push(res);
          }
        });
        this.$bus.emit("setBusinessLayerGroupVisible", false); //关闭业务图层
        console.log(DataForPosition);
        this.$bus.emit(
          "setPointOnMap",
          DataForPosition,
          false,
          () => {},
          "DatailEvent",
          trueResult
        );
      });
    },
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
      this.getCharData(this.dateDataStart,this.dateDataEnd);
      this.getTaskData();
    },
    getCharData(firstDate,lastDate) {
      firstDate = firstDate ? this.convertTimeFormat(firstDate) : "";
      lastDate = lastDate ? this.convertTimeFormat(lastDate) : "";
      if(!firstDate){
        let data = utilData.getMonth();
        firstDate = data.begin;
        lastDate = data.over;
      }
      InspectionStatistics.EventTypeChart(firstDate, lastDate).then(res => {
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

.picker-date-overview {
  .el-radio-button--mini .el-radio-button__inner {
    padding: 7px 10px;
  }

  .el-date-editor.el-input {
    margin-top: 6px;
    width: 120px;
    margin-right: 8px;
  }

  .el-date-editor .el-input__icon {
    top: -6px;
  }

  .el-input--prefix .el-input__inner {
    padding-left: 10px;
  }
}

.InsOverView .inspectiongis_fixed {
  left: 60px;
}

.InsOverView .inspectiongis_fixed.flexible .control-show-btn {
  position: fixed;
  bottom: 10px;
}

.el-radio-button__orig-radio:checked+.el-radio-button__inner {
  color: #fff;
  background-color: #367bc7;
  border-color: #367bc7;
}

.el-button {
  background: #367bc7;
  border: none;
  color: white;
}

.InsOverView .inspectiongis_fixed .overview-card .car-list-wrapper .btn-item {
  padding: 0px 3px;
}

.picker-date-overview .el-date-editor.el-input {
  width: 137px;
}

.picker-date-overview .el-radio-button--mini .el-radio-button__inner {
  padding: 7px 12px;
}
</style>
