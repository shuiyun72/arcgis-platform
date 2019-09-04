<template>
  <div>
    <date-btn-choose @DateBtn = "DateBtn" :dataTitle="'具体日期:'"></date-btn-choose>
      <el-row class="row-bg-white" type="flex" justify="space-between">
        <el-col :md="10" :lg="6" :xl="3" >
          <el-form-item label="部门：">
               <el-select v-model="layerDataValue" @change="onLayerSelectChange" size="mini">
                  <el-option
                    v-for="item in layerData"
                    :key="item.viewIndex"
                    :label="item.layerCName"
                    :value="item.layerName"
                  ></el-option>
                </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="10" :lg="5" :xl="3" >
          <el-button-group class="doping-icon-btn">
            <el-button type="primary" size="mini" @click="GetData" icon="el-icon-search" >查询</el-button>
            <el-button type="primary" size="mini" @click="GetData">重置</el-button>
            <el-button type="warning" size="mini" @click="exportExcel">数据导出</el-button>
          </el-button-group>
        </el-col>
      </el-row>
  </div>
</template>
<script>
import _ from "lodash";
import DateBtnChoose from "@features/InspectionGIS/components/DateBtnChoose"
import * as EasyTable from "@common/consts/inseasyui-table";
import { ExportExcel } from "@util";
export default {
  data() {
    return {
      layerData:[],
      layerDataValue:'',
      timeList:[{
        text:'全部',
        value:'all'
      },{
        text:'今天',
        value:'today'
      },{
        text:'本周',
        value:'thisWeek'
      },{
        text:'上周',
        value:'lastWeek'
      },{
        text:'本月',
        value:'thisMonth'
      },{
        text:'自定义',
        value:'custom'
      }],
      timeListValue:'',
      
    };
  },
  props: ['loading'],
  components:{
    DateBtnChoose
  },
  mounted(){
  },
  created(){
    this.onLoadData()
  },
  methods: {
    onLoadData(){
      this.timeListValue = this.timeList[0].value
    },
    typeChoose(item,type){
      this[type] = item
    },
    GetData(){
      this.$emit('update:loading', true)
    },
    exportExcel() {
      ExportExcel('div .exportTable','123')
    },
    DateBtn(_startTime,_endTime){
      console.log(_startTime,_endTime)
    }
  }
};
</script>

