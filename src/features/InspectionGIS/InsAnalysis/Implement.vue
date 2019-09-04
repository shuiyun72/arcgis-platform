<template>
  <div>
    <date-btn-choose @DateBtn="GetData"></date-btn-choose>
    <el-row class="row-bg-blue">
      <el-col :span="11">
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
      </el-col>
      <el-col :span="12" :offset="1" v-show="timeListValue == 'custom'">
        <el-form-item label="日期：">
          <el-date-picker
            size="mini"
            v-model="value7"
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
  </div>
</template>
<script>
import _ from "lodash";
import * as EasyTable from "@common/consts/inseasyui-table";
import { ChartBarZoom, ChartPie } from "@util/echart";
export default {
  data() {
    return {
      value7: "",
      timeList: [
        {
          text: "全部",
          value: "all"
        },
        {
          text: "本日",
          value: "today"
        },
        {
          text: "本周",
          value: "thisWeek"
        },
        {
          text: "本月",
          value: "thisMonth"
        },
        {
          text: "自定义",
          value: "custom"
        }
      ],
      timeListValue: ""
    };
  },
  props: ['loading'],
  mounted() {},
  created() {
    this.onLoadData();
  },
  methods: {
    onLoadData() {
      this.timeListValue = this.timeList[0].value;
    },
    GetData(_startTime, _endTime) {
      this.$emit('update:loading', true)
    },
    typeChoose(item, type) {
      this[type] = item;
    }
  }
};
</script>

