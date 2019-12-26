<template>
  <div class="data">
    <el-row type="flex" justify="start" style="padding: 0;" v-if="FastChoosedate">
      <el-row class="radio-wrapper">
        <el-form-item :label="dataTitle" v-if="dataTitle" style="margin:0">
          <el-radio
            v-model="timeListValue"
            class="row-select-btn"
            v-for="item in FasttimeList"
            :class="item.class"
            size="mini"
            :label="item.value"
            :key="item.value"
            @change="typeChoose(item.value ,'timeListValue')"
          >{{item.text}}</el-radio>
        </el-form-item>
        <el-row v-else type="flex" justify="start" style="padding:0">
          <el-radio
            v-model="timeListValue"
            class="row-select-btn"
            :class="item.class"
            v-for="item in FasttimeList"
            :label="item.value"
            :key="item.value"
            v-show="dataTitle?true:item.large"
            @change="typeChoose(item.value ,'timeListValue')"
          >{{item.text}}</el-radio>
        </el-row>
      </el-row>
    </el-row>
    <el-row type="flex" justify="between" style="padding: 0;" v-else>
      <el-col
        :span="spanNum"
        class="data-btn-wrapper"
        :style="{top:top , right:'34px'}"
        :xs="18"
        :sm="18"
        :lg="14"
        :xl="spanNum"
      >
        <el-form-item :label="dataTitle" v-if="dataTitle">
          <el-row type="flex" justify="end" style="padding:0">
            <el-radio
              v-model="timeListValue"
              class="row-select-btn"
              v-for="item in timeList"
              :class="item.class"
              size="mini"
              :label="item.value"
              :key="item.value"
              @change="typeChoose(item.value ,'timeListValue')"
            >{{item.text}}</el-radio>
          </el-row>
        </el-form-item>
        <el-row v-else type="flex" justify="end" style="padding:0">
          <el-radio
            v-model="timeListValue"
            class="row-select-btn"
            :class="item.class"
            v-for="item in timeList"
            :label="item.value"
            :key="item.value"
            v-show="dataTitle?true:item.large"
            @change="typeChoose(item.value ,'timeListValue')"
          >{{item.text}}</el-radio>
        </el-row>
      </el-col>
      <el-col
        :span="dataSpan"
        v-show="timeListValue == 'custom'"
        :style="{left:dataLeft}"
        :xs="14"
        :sm="14"
        :lg="11"
        :xl="dataSpan"
        class="data-select-wrapper"
      >
        <el-form-item label="日期：" label-width="83px">
          <el-date-picker
            @change="GetData"
            value-format="yyyy-MM-dd"
            size="mini"
            v-model="timeArray"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="- -"
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
          large: false,
          class: "hidden-md-and-down"
        },
        {
          text: "本月",
          value: "thisMonth",
          large: true,
          class: "hidden-md-and-down"
        },
        {
          text: "自定义",
          value: "custom",
          large: true
        }
      ],
      FasttimeList: [
        {
          text: "全部",
          value: "all",
          large: true
        },
        {
          text: "上年度",
          value: "lastYear",
          large: true
        },
        {
          text: "本年度",
          value: "thisYear",
          large: true
        },
        {
          text: "上季度",
          value: "lastQuarter",
          large: true
        },
        {
          text: "本季度",
          value: "thisQuarter",
          large: true
        },
        {
          text: "上月",
          value: "lastMonth",
          large: true
        },
        {
          text: "本月",
          value: "thisMonth",
          large: true
        }
      ],
      timeListValue: ""
    };
  },
  props: {
    FastChoosedate: {
      type: Boolean,
      default: false
    },
    dataTitle: {
      type: String,
      default: ""
    },
    spanNum: {
      type: Number,
      default: 14
    },
    top: {
      type: String,
      default: "-31px"
    },
    dataLeft: {
      type: String,
      default: "0px"
    },
    dataSpan: {
      type: Number,
      default: 10
    }
  },
  mounted() {},
  created() {
    this.onLoadData();
    this.GetData();
  },
  watch: {
    dataSpanPosition() {
      console.log(this.dataSpanPosition);
    }
  },
  methods: {
    reset(){
      this.timeListValue = this.timeList[0].value
    },
    onLoadData() {
      this.timeListValue = this.timeList[0].value;
    },
    GetData() {
      let data, _startTime, _endTime;
      switch (this.timeListValue) {
        case "lastYear":
          data = utilData.getLastYear();
          _startTime = data.begin;
          _endTime = data.over;
          break;
        case "thisYear":
          data = utilData.getYear();
          _startTime = data.begin;
          _endTime = data.over;
          break;
        case "lastQuarter":
          data = utilData.getLastQuarter();
          _startTime = data.begin;
          _endTime = data.over;
          break;
        case "thisQuarter":
          data = utilData.getQuarter();
          _startTime = data.begin;
          _endTime = data.over;
          break;
          ;
        case "thisMonth":
          data = utilData.getMonth();
          _startTime = data.begin;
          _endTime = data.over;
          break;
        case "lastMonth":
          data = utilData.getLastMonth(); 
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
      if (this.$route.name === "MaAnalysis") {
        if (this.timeListValue === "custom") {
          this.$emit("controlTableHeight", true);
        } else {
          this.$emit("controlTableHeight", false);
        }
      }
      this.GetData();
    }
  }
};
</script>
<style lang="stylus">
@media screen and (max-width: 1200px) {
  .data-select-wrapper {
    position: relative !important;
    top: 0 !important;
  }
}

.radio-wrapper {
  .el-form-item .el-form-item__content {
    line-height: 30px;
  }

  .el-radio {
    margin-right: 12px;
    color: #fff;
  }

  .el-radio__input.is-checked+.el-radio__label {
    color: #fff;
  }

  .el-radio__label {
    padding-left: 6px;
  }
}
</style>

