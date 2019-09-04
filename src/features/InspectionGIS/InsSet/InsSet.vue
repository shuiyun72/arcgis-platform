<template>
    <router-view style="height:100%"></router-view>
</template>
<script>
import _ from "lodash";
import MapDataOperation from "@services/ArcMap/MapDataOperation";
import * as EasyTable from "@common/consts/inseasyui-table";
import { ExportExcel , FixFloat } from "@util";
// import HandSet from "@features/InspectionGIS/InsSet/HandSet.vue"
// import EvenContent from "@features/InspectionGIS/InsSet/EvenContent.vue"
// import EvenType from "@features/InspectionGIS/InsSet/EvenType.vue"
// import PlanType from "@features/InspectionGIS/InsSet/PlanType.vue"
// import TimeSet from "@features/InspectionGIS/InsSet/TimeSet.vue"
import TableFormTitle from "@common/components/TableFormTitle";
export default {
   components:{
    // HandSet,
    // EvenContent,
    // EvenType,
    // PlanType,
    // TimeSet,
    TableFormTitle
  },
  data() {
    return {
      flexible:false,//是否收缩左侧表格
      layerData: '全部', //图层下拉框数据
      layerDataValue: '全部' , //图层选中值
    };
  },
  created() {
    //初始化数据
    this.loadLayerData()
  },
  methods: { 
    //初始化相关数据
    loadLayerData() {
      //图层信息
      this.layerData = [{
      //     layerCName:"手持端设置",
      //     layerName:"handSet",
      //     layTem:'hand-set',
      //     listViewColumn:'Ins_HandSet_Columns',
      //     viewIndex:0
      //   },{
          layerCName:"事件内容管理",
          layerName:"evenContent",
          layTem:'even-content',
          viewIndex:0,
          listViewColumn:'Ins_EvenContent_Columns'
        },{
          layerCName:"工作时段管理",
          layerName:"timeSet",
          layTem:'time-set',
          viewIndex:0,
          listViewColumn:'Ins_TimeSet_Columns'
        },{
          layerCName:"事件类型管理",
          layerName:"evenType",
          layTem:'even-type',
          viewIndex:0,
          listViewColumn:'Ins_EvenType_Columns'
        },{
          layerCName:"计划类别管理",
          layerName:"planType",
          layTem:'plan-type',
          viewIndex:0,
          listViewColumn:'Ins_PlanType_Columns'
        } ]
    },
  }
};
</script>
