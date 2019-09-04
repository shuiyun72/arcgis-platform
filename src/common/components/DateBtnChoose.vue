<template>
    <el-row class="row-bg-blue">
      <el-col :span="14">
        <el-form-item :label="dataTitle" v-if="dataTitle">
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
        <el-button-group v-else>
          <el-button
            class="row-select-btn"
            :type="item.value == timeListValue ? 'primary' : ''"
            size="mini"
            v-for="item in timeList"
            :key="item.value"
             v-show="dataTitle?true:item.large"
            @click="typeChoose(item.value ,'timeListValue')"
          >{{item.text}}</el-button>
        </el-button-group>
      </el-col>
      <el-col :span="10"  v-show="timeListValue == 'custom'">
        <el-form-item label="日期：">
          <el-date-picker
            @change="GetData"
            value-format="yyyy-MM-dd"
            size="mini"
            v-model="timeArray"
            width="80%"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2"
          ></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
</template>
<script>
import _ from "lodash";
import  utilData  from "@util/utilData";
export default {
  data() {
    return {
      timeArray: [],
      timeList: [
        {
          text: "全部",
          value: "all",
          large:true
        },
        {
          text: "本日",
          value: "today",
          large:true
        },
        {
          text: "本周",
          value: "thisWeek",
          large:true
        },
        {
          text: "上周",
          value: "lastWeek",
          large:false
        },
        {
          text: "本月",
          value: "thisMonth",
          large:true
        },
        {
          text: "自定义",
          value: "custom",
          large:true
        }
      ],
      timeListValue: ""
    };
  },
  props: ["dataTitle"],
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
    },
  }
};
</script>

