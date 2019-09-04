<template>
  <div class="formItem  table_style" :class="{flexible:flexible}">
    <TableFormTitle 
    :titleName = "'火灾分析'" 
    :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="100px" label-position="right" size="mini">
      <el-row>
        <el-col :span="4">
          <AnalysisSelect
            :btnMessage="{text:'选择火灾点',icon:'icon-shipin',type:'warning'}"
            :layerData="layerData"
            :selectLayerValue.sync="selectLayerValue"
            @searchFnc="fireAnalysis"
          ></AnalysisSelect>
        </el-col>
        <el-col :span="9" :offset="1">
          <el-form-item label="缓冲区范围：">
            <el-input
              v-model="bufferRange"
              placeholder="默认100米"
              @keyup.enter.native="fireSearchFuc"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="1">
            <el-button size="mini"  class="my-analysis" @click="fireSearchFuc">分析</el-button>
            <el-button size="mini" class="my-export" @click="exportExcel">导出</el-button>
            <el-button
              size="mini"
              class="my-clean"
              @click="clearFireAnalysis"
            >清除</el-button>
        </el-col>
      </el-row>
    </el-form>
    <GisTable
      :loading = "loading"
      :tableHeight ="`calc(100vh - 240px)`"
      @TableRowClick = "onFireRowClick"
      :layerListName = "`E_Firehydrant_Columns`"
      :columnListData = "FireDataTotal"
    ></GisTable>
  </div>
</template>
<script>
import _ from "lodash";
import { E_Firehydrant_Columns } from "@common/consts/GisConst/GisTableColumn";
import { ExportExcel } from "@util";
import {
  LayerType,
  FeatureLayerOperation
} from "@common/consts/GisConst/MapConfigure";
import GisTable from "@features/GIS/components/GisTable";
import AnalysisSelect from "@features/GIS/components/AnalysisSelect";
import TableFormTitle from "@common/components/TableFormTitle";
export default {
  components: {
    AnalysisSelect,
    GisTable,
    TableFormTitle
  },
  created() {
    this.loadData();
  },
  beforeDestroy() {
    this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
  },
  data() {
    return {
      flexible:false,//是否收缩左侧表格
      selectLayerValue: [], //选中图层
      layerData: [], //图层集合
      loading: false,
      FireDataTotal: [],
      selGData: null, //选中火灾点
      bufferRange: 100, //缓冲区范围值
    };
  },
  methods: {
    loadData() {
      this.layerData = FeatureLayerOperation.getLayer(
        LayerType.FirehydrantTypeNO
      );
      this.selectLayerValue.push(this.layerData[0].id);
      this.selectLayerValue.push(this.layerData[0].children[0].id);
    },
    //导出表格
    exportExcel() {
      ExportExcel("div .exportTable", "火灾分析");
    },
    //选定火灾点并进行分析
    fireAnalysis() {
      //取得火灾点
      this.$bus.emit("getMapPoint", false, _GData => {
        this.selGData = _GData;
        //获取火灾附近的数据
        this.fireSearchFuc();
      });
    },
    //分析火灾数据方法
    fireSearchFuc() {
      if (!this.selGData) {
        this.$message({
          type: "warning",
          message: "请选择区域",
          showClose: true
        });
        return;
      }
      this.loading = true;
      //获取火灾附近的数据
      this.$bus.emit(
        "bufferAnalysis",
        this.selectLayerValue[1],
        this.selGData,
        this.bufferRange,
        resultValue => {
          this.loading = false;
          this.FireDataTotal = _.map(resultValue, "attributes");
          if(!this.FireDataTotal.length){
            this.$message({
              type:'warning',
              message:"此范围没有数据",
              showClose:true
            })
          }
          //展示消防栓
          this.$bus.emit("facilitiesView", this.FireDataTotal, "消火栓.png");
        }
      );
    },
    //点击选择事件
    onFireRowClick(row, column, event) {
      this.$bus.emit(
        "setMapLocation",
        row.OBJECTID,
        this.selectLayerValue[1],
        resultValue => {
          console.log(resultValue);
        }
      );
    },
    //清空表格和地图
    clearFireAnalysis() {
      this.FireDataTotal = [];
      this.selGData = null;
      this.$bus.emit("clearGDataLayer");
    }
  }
};
</script>


