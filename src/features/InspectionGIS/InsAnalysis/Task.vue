<template>
  <div>
      <date-btn-choose @DateBtn = "GetData" :dataTitle="'任务日期:'"></date-btn-choose>
      <el-row class="row-bg-white" type="flex" justify="space-between">
        <el-col :sm="10" :md="5" :lg="4" :xl="3"  :offset="1">
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
        <el-col :sm="10" :md="5" :lg="4" :xl="3" :offset="1">
          <el-form-item label="巡检员：">
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
        <el-col :xs="10" :sm="10" :md="5" :lg="4" :xl="3"  :offset="1">
          <el-form-item label="巡检周期：">
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
        <el-col :sm="10" :md="5" :lg="5" :xl="3"  :offset="1" :xs-offset="8">
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
      
    };
  },
  props: ['loading'],
  mounted(){
  },
  components:{
    DateBtnChoose
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
    }
  }
};
</script>

