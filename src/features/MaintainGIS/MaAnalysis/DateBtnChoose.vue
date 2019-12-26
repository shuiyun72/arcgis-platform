<template>
  <el-row class="row-bg-blue1">
    <el-col :span="21" style="display:flex">
      <el-form-item :label="dataTitle" class="date-time-width date-time-width-small">
        <el-button-group>
          <el-button
            class="row-select-btn"
            :type="item.value == timeListValue ? 'primary' : ''"
            size="mini"
            v-for="item in timeList"
            :key="item.value"
            @click="typeChoose(item.value ,'timeListValue')"
          >{{item.text}}</el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item label="日期：" v-show="timeListValue == 'custom'" class="time-time-width">
        <el-date-picker
          @change="GetData"
          value-format="yyyy-MM-dd"
          size="mini"
          v-model="timeArray"
          width="180"
          type="daterange"
          align="left"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions2"
        ></el-date-picker>
      </el-form-item>
    </el-col>
    <el-col :span="3" class="event_order"  v-show="timeListValue == 'custom'">
      <el-button size="mini"  class="el-orange-btn">
            <i class="iconfont icon-sousuo"></i>查询
      </el-button>
    </el-col>  
  </el-row>
</template>
<script>
import _ from "lodash";
import utilData from "@util/utilData";
export default {
  data() {
    return {
      timeArray: [],
      timeList: [
        {
          text: "全部",
          value: "all",
          large: true
        },
        {
          text: "本日",
          value: "today",
          large: true
        },
        {
          text: "本周",
          value: "thisWeek",
          large: true
        },
        {
          text: "上周",
          value: "lastWeek",
          large: false
        },
        {
          text: "本月",
          value: "thisMonth",
          large: true
        },
        {
          text: "自定义",
          value: "custom",
          large: true
        }
      ],
      timeListValue: ""
    };
  },
  props: {
    "dataTitle":{
      default:""
    },
    "labelWidth":{}
  },
  mounted() {},
  created() {
    this.onLoadData();
    this.GetData();
  },
  methods: {
    onLoadData() {
      this.timeListValue = this.timeList[0].value;
    },
    GetData() {
      let data, _startTime, _endTime;
      switch (this.timeListValue) {
        case "thisMonth":
          data = utilData.getMonth();
          _startTime = data.begin;
          _endTime = data.over;
          break;
        case "today":
          let current = utilData.getCurrentDate();
          data = utilData.myformatStr(current);
          _startTime = data;
          _endTime = data;
          break;
        case "thisWeek":
          data = utilData.getDayAndWeek("week");
          _startTime = data.begin;
          _endTime = data.over;
          break;
        case "lastWeek":
          data = utilData.getDayAndWeek("lastWeek");
          _startTime = data.begin;
          _endTime = data.over;
          break;
        case "custom":
          _startTime = this.timeArray[0];
          _endTime = this.timeArray[1];
          break;
        default:
          break;
      }
      this.$emit("DateBtn", _startTime, _endTime);
    },
    typeChoose(item, type) {
      this[type] = item;
      this.GetData();
    }
  }
};
</script>
<style lang="stylus">
.row-bg-blue1{
  .el-button-group .el-button--mini{
    padding: 7px 10px;
  } 
  .date-time-width .el-form-item__content{
    width:340px;
  }  
  .time-time-width{
    width :248px
    .el-form-item__label{
      width:54px; 
      padding:0;
    } 
    .el-form-item__content .el-date-editor--daterange.el-input__inner{
      width:190px;
    }    
  }
}
</style>


