<template>
  <div class="InsOverView">
    <div class="inspectiongis_fixed" :class="{flexible:flexible}">
      <span class="control-show-btn" @click="flexible = false" v-show="flexible">
        显示图表
        <i class="iconfont icon-shousuo"></i>
      </span>
      <div class="overview-card picker-date-overview" v-show="!flexible">
        <TableFormTitle :titleName="'事件来源分析'" :flexible.sync="flexible"></TableFormTitle>
        <el-row>
          <el-col>
            <el-radio-group v-model="dateDataSelect" size="mini" @change="changeDataSelect">
              <el-radio-button v-for="date in dateData" :label="date.value" :key="date.value">{{date.label}}</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-date-picker v-model="dateDataStart" type="date" placeholder="查询开始日期"></el-date-picker>
            <el-date-picker v-model="dateDataEnd" type="date" placeholder="查询结束日期"></el-date-picker>
            <el-button size="mini" @click="getInitData">查询</el-button>
          </el-col>
        </el-row>
        <el-row class="car-list-wrapper" type="flex">
          <el-col class="title">事件管理</el-col>
          <el-col>
            <el-col
              span="8"
              v-for="item in PandectNav"
              :key="item.rank"
              :class="item.class"
              class="btn-item"
            >
              <p>{{item.OperName2}} ({{item.sumcount}})</p>
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
import EventManageForMaintain from "@api/Maintain/EventManageForMaintain";
import GetStatusForMantain from "@api/Maintain/GetStatusForMantain";

export default {
  components: {
    NavCom,
    TableFormTitle
  },
  beforeDestroy() {
    this.$bus.emit("setBusinessLayerGroupVisible", false); //关闭业务图层
  },
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
      PandectNav: [],
      DataForPosition:[],
      TotalRows:0,   //当前事件总数
      PandectNavSelect: "全部事件",
      MaintainCardData: {
        title: "事件来源分析",
        titleColor: "#DF3939",
        contentColor: "#fff",
        titleIcon: "icon-xiaoshoutongji"
      },
      EventSourceAnalysis: []
    };
  },

  created() {},
  mounted() {
    //页面初始化
    this.getInit();
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
      this.getInit(this.dateDataStart,this.dateDataEnd)
    },
    //按条件查询
    getInitData(){
      this.getInit(this.dateDataStart,this.dateDataEnd)
    },
    //页面初始化
    getInit(firstDate,lastDate){
      firstDate = firstDate ? this.convertTimeFormat(firstDate) : "";
      lastDate = lastDate ? this.convertTimeFormat(lastDate) : "";
      this.initData(firstDate,lastDate)
      this.GetEventFrom(firstDate,lastDate)
    },
    //获取地图点位数据
    initData(firstDate,lastDate){
      EventManageForMaintain.get(firstDate, lastDate,"","","","","","",4000).then(res => {
        this.TotalRows = res.data.Data.TotalRows;
        let Result = res.data.Data.Result;
        let DataForPositionArray = [];
        let trueResult = [];
        let IsValidNum = 0;
        _.map(Result, res => {
          //DataForMap.push({"EventPosition":[res.EventX,res.EventY],"EventFromName":res.EventFromName})
          if (Number(res.EventX) > 10 && Number(res.EventX) < 500) {
            DataForPositionArray.push([res.EventX, res.EventY]);
            trueResult.push(res);
          }
          if(res.IsValid == 0){
            IsValidNum++
          }
        });
        this.DataForPosition = DataForPositionArray;

        this.getEventManage(firstDate,lastDate,IsValidNum);
        this.$bus.emit("setBusinessLayerGroupVisible", false); //关闭业务图层
        this.$bus.emit(
          "setPointOnMap",
          this.DataForPosition,
          false,
          () => {},
          "DatailEvent",
          trueResult
        );
      });
    },
    //获取事件管理状态及数量
    getEventManage(startTime,endTime,IsValidNum){
      startTime = startTime || "";
      endTime = endTime || "";
      GetStatusForMantain.GetStatusForMantain(startTime,endTime).then(res=>{
        let PandectNavPre = res.data.Data.Result;
        let PandectNavSumcount = 0;
        _.map(PandectNavPre,item => {
          if(item.OperName2 == "处理"){
            item.OperName2 = "处理中"
          }
          PandectNavSumcount += item.sumcount
        })
        console.log(PandectNavSumcount)
        PandectNavSumcount = PandectNavSumcount+IsValidNum;
        PandectNavPre.unshift({OperName2:"全部",sumcount:PandectNavSumcount,rank:20})
        PandectNavPre.push({OperName2:"无效",sumcount:IsValidNum,rank:0})
        this.PandectNav = PandectNavPre;
      })
    },
    //事件来源分析
    GetEventFrom(startTime,endTime){
      startTime = startTime || "";
      endTime = endTime || "";
      GetStatusForMantain.GetEventFrom(startTime,endTime).then(res=>{
        let EventSourceAnaly = [];
        _.map(res.data.Data.Result , result => {
          EventSourceAnaly.push({ name: result.EventFromName, value: result.SUMCOUNT })
        }) ;
        this.EventSourceAnalysis = EventSourceAnaly;
        this.charInitPie();
      })
    },
    convertTimeFormat(data){
      return data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate()
    },
    charInitPie() {
      var chartPie = _.cloneDeep(ChartPieLight);
      chartPie.series[0].name = "事件-来源";
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
      echarts.init(document.querySelector(".event_pie")).setOption(chartPie);
    },
    onNavHandle(el) {
      this.PandectNavSelect = el;
    },
    //获取当前月份最后一天
    getLastDay(year, month) {
      var d = new Date(0);
      if (month == 12) {
        d.setUTCFullYear(year + 1);
        d.setUTCMonth(0);
      } else {
        d.setUTCFullYear(year);
        d.setUTCMonth(month);
      }
      d.setTime(d.getTime() - 1);
      return year + "-" + month + "-" + d.getUTCDate();
    }
  }
};
</script>
<style lang="stylus">
.picker-date-overview{
  .el-radio-button--mini .el-radio-button__inner{
    padding: 7px 10px;
  }
  .el-date-editor.el-input{
    margin-top:6px;
    width:120px;
    margin-right:8px;
  }
  .el-date-editor .el-input__icon{
    top:-6px;  
  }
  .el-input--prefix .el-input__inner{
    padding-left:10px;  
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