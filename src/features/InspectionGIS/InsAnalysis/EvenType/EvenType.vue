<template>
  <div class="table_style InsAnalysis w700" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'事件类型分析'" :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="74px">
      <el-row>
        <el-col :span="11" :xs="16" :sm="16" :lg="11">
          <el-form-item label="具体时间：" style="padding-left:-10px;">
            <el-date-picker
              value-format="yyyy-MM-dd"
              size="mini"
              unlink-panels
              v-model="dataValue"
              type="daterange"
              range-separator="- -"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="GetData"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="3" :offset="1">
          <el-button class="my-search" size="mini" @click="GetData" 
          v-if="$options.filters.btnTree('/api/InspectionStatistics/GetEventTypeTable' ,$route.name) && $options.filters.btnTree('/api/InspectionStatistics/GetEventTypePieChart' ,$route.name)">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <InsTable
      :layerListName="'Ins_EvenTypeAnalysis_Columns'"
      :tableHeight="'calc(100vh - 531px)'"
      :columnListData="squareQueryRawTableData"
      :loading.sync="loading"
      :layeName="'InsAnalysis'"
    ></InsTable>
    <ins-chart
      ref="insChart"
      :data="squareQueryRawTableData"
    ></ins-chart>
  </div>
</template>
<script>
import _ from "lodash";
import * as EasyTable from "@common/consts/inseasyui-table";
import InspectionStatistics from "@api/Inspection/InspectionStatistics";
import { ExportExcel } from "@util";
import TableFormTitle from "@common/components/TableFormTitle";
import InsTable from "@features/InspectionGIS/components/InsTable";
import InsChart from "@features/InspectionGIS/InsAnalysis/components/InsChart.vue";
import utilData from "@util/utilData";

export default {
  components: {
    TableFormTitle,
    InsTable,
    InsChart
  },
  data() {
    return {
      loading:false,
      flexible:false,//是否收缩左侧表格
      squareQueryRawTableData: [], //搜索结果数据
      dataValue: ["2018-01-01", "2026-12-31"]
    };
  },
  props: ["loading"],
  created() {
    let current = utilData.getCurrentDate();
    let dataTime = utilData.myformatStr(current);
    this.dataValue = ["2001-01-02",dataTime];
    this.GetData();
  },
  // updated(){
  //   this.GetData()
  // },
  methods: {
    GetData() {
         debugger;
      this.loading = true;
      let _startTime = this.dataValue && this.dataValue[0];
      let _endTime = this.dataValue &&  this.dataValue[1];
   
      if(_startTime ==null || _endTime == null){
          this.$myMessage("warning", "请选择时间");
          this.loading = false;
          return;
      }
      InspectionStatistics.EventTypeExcel(_startTime, _endTime).then(res => {
        this.loading = false;
        this.squareQueryRawTableData = res.data.Data.Result;
      });
      InspectionStatistics.EventTypeChart(_startTime, _endTime).then(res => {
        this.$refs.insChart.chartInit(res.data.Data.Result, "num", "EventTypeName");
      });
    }
  }
};
</script>

