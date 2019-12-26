<template>
  <div class="table_style InsAnalysis event-trend" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'事件趋势分析'" :flexible.sync="flexible"></TableFormTitle>
    <el-form>
      <el-row type="flex" justify="space-between">
        <el-col :span="11" :xs="16" :sm="16" :lg="13">
          <el-form-item label="具体时间：" class="month-select-wraper">
            <el-col :span="6">
              <el-date-picker
                value-format="yyyy"
                size="mini"
                class="month-select"
                v-model="year"
                type="year"
                placeholder="选择年"
              ></el-date-picker>
            </el-col>
            <el-col :span="5">
              <el-select v-model="minMonth" @change="minChange" size="mini">
                <el-option
                  v-for="item in 12"
                  :key="item"
                  :label="item + '月'"
                  :value="item"
                  v-show="item < maxMonth"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="2" class="division">
              <span>-</span>
            </el-col>
            <el-col :span="5">
              <el-select v-model="maxMonth" @change="minChange" size="mini">
                <el-option
                  v-for="item in 12"
                  :key="item"
                  :label="item + '月'"
                  :value="item"
                  v-show="item > minMonth"
                ></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="5" :xs="8" :sm="8" :lg="7">
          <el-row type="flex" justify="end" style="padding:0">
          <el-button class="my-search" size="mini" @click="GetData" 
          v-if="$options.filters.btnTree('/api/InspectionStatistics/GetEventTypeTrendTable' ,$route.name) && $options.filters.btnTree('/api/InspectionStatistics/GetEventTypeTrendLineChart' ,$route.name)">查询</el-button>
          <el-button class="my-export" size="mini" @click="exportExcel" v-if="$options.filters.btnTree('export' ,$route.name)">导出</el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <InsTable
      :layerListName="columnList"
      :tableHeight="'calc(100vh - 531px)'"
      :columnListData="squareQueryRawTableData"
      :loading.sync="loading"
      :layeName="'EvenTrend'"
      class="complexTable"
    ></InsTable>
    <ins-chart ref="insChart" :data="squareQueryRawTableData"></ins-chart>
  </div>
</template>
<script>
import _ from "lodash";
import * as EasyTable from "@common/consts/inseasyui-table";
import { ExportExcel } from "@util";
import InspectionStatistics from "@api/Inspection/InspectionStatistics";
import utilData from "@util/utilData";
import TableFormTitle from "@common/components/TableFormTitle";
import InsTable from "@features/InspectionGIS/components/InsTable";
import InsChart from "@features/InspectionGIS/InsAnalysis/components/InsChart.vue";
export default {
  components: {
    TableFormTitle,
    InsTable,
    InsChart
  },
  data() {
    return {
      loading: false,
      flexible: false, //是否收缩左侧表格
      squareQueryRawTableData: [], //搜索结果数据
      columnList: [],
      currentYear: "",
      clumItem: { field: "1月", text: "1月", align: "center", fixed: false }, //月份单行表头信息
      year: "", //选取的时间年份
      minMonth: 1, //选取时间月份区间最小
      maxMonth: 12 //选取时间月份区间最大
      // //对时间月份下拉框进行过滤
      // pickerOptionsMin: {
      //   disabledDate: time => {
      //     if (this.value2 != "") {
      //       return time.getTime() > this.value2;
      //     }
      //   }
      // },
      // pickerOptionsMax: {
      //   disabledDate: time => {
      //     if (this.value1 != "") {
      //       return time.getTime() < this.value1;
      //     }
      //   }
      // }
    };
  },
  created() {
    this.loadData();
  },
  computed: {},
  methods: {
    loadData() {
      let currentData = utilData.getCurrentDate();
      this.year = String(currentData.year);
      this.maxMonth = currentData.month;
      this.columnList = _.cloneDeep(EasyTable.Ins_EvenTrendAnalysis_Columns);
      this.GetData();
    },
    GetData(year) {
      this.loading = true
      let _year = this.year;
      let _startMonth = this.minMonth;
      let _endMonth = this.maxMonth;
         if(_year =="" || _year == null){
          this.$myMessage("warning", "请选择年");
          this.loading = false;
          return;
      }
      //处理表头信息
      let columnList = _.cloneDeep(EasyTable.Ins_EvenTrendAnalysis_Columns);
      for (let i = _startMonth; i <= _endMonth; i++) {
        let clumItem = _.assign({}, this.clumItem);
        clumItem.field = i + "月";
        clumItem.text = i + "月";
        columnList.push(clumItem);
      }
      //get数据
      InspectionStatistics.EventTrendExcel(_year, _startMonth, _endMonth).then(res => {
        this.columnList =  columnList
        this.loading = false;
        this.squareQueryRawTableData = res.data.Data.Result;
        this.chatDataInit(res.data.Data.Result);
      });
    },
    chatDataInit(res) {
      let chartData = {};
      chartData.xAxis = [];
      for (let i = this.minMonth; i <= this.maxMonth; i++) {
        chartData.xAxis.push(this.year + "-" + i);
      }

      chartData.series = [];
      _.forEach(res, item => {
        if (item.类型 == "数量") {
          let data = [];
          _.forIn(item, (value, key) => {
            if (!isNaN(parseInt(key))) {
              if (value) {
                data.push(value);
              } else {
                data.push(0);
              }
            }
          });
          chartData.series.push({
            name: item.事件类型,
            value: data
          });
        }
      });
      if(this.$refs.insChart){
        this.$refs.insChart.chartInit(chartData, "value", "name", chartData);
      }
      
    },
    exportExcel() {
      ExportExcel("div .exportTable", "事件趋势分析");
    }
  }
};
</script>

