<template>
  <div class="formItem  table_style w700" :class="{flexible:flexible}">
    <TableFormTitle 
    :titleName = "'拆迁分析'" 
    :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="100px" label-position="right" size="mini">
      <el-row>
        <el-col :span="4">
          <el-button
            size="mini"
            class="my-choose-point"
            @click="selectRemovePoint"
          >选择拆迁点</el-button>
        </el-col>
        <el-col :span="9" :offset="1">
          <el-form-item label="缓冲区范围：">
            <el-input
              v-model="bufferRange"
              placeholder="默认100米"
              @keyup.enter.native="removeAnalysis"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
            <el-button size="mini" class="my-analysis" @click="removeAnalysis">分析</el-button>
            <el-button size="mini"  class="my-export" @click="exportExcel">导出</el-button>
            <el-button
              size="mini"
              class="my-clean"
              @click="clearRemoveAnalysis"
            >清除</el-button>
        </el-col>
      </el-row>
    </el-form>
    <GisTable
      :loading = "loading"
      :tableHeight ="`calc(100vh - 240px)`"
      @TableRowClick = "onPipeRowClick"
      :layerListName = "`all`"
      :columnListData = "RemoveDataTotal"
    ></GisTable>
  </div>
</template>
<script>
import _ from "lodash";
import * as EasyTable from "@common/consts/GisConst/GisTableColumn";
import { ExportExcel } from "@util";
import SearchGroupDialog from "@features/GIS/components/SearchGroupDialog";
import {
  FeatureLayerOperation,
  MapConfigure,
  LayerType
} from "@common/consts/GisConst/MapConfigure";
import GisTable from "@features/GIS/components/GisTable";
import TableFormTitle from "@common/components/TableFormTitle";
export default {
  components:{
    GisTable,
    TableFormTitle
  },
  data() {
    return {
      flexible:false,//是否收缩左侧表格
      loading: false,//表格加载
      RemoveDataTotal: [],//表格全部数据
      bufferRange: 100, //缓冲区范围值
      selGData: null, //选中火灾点
    };
  },
  beforeDestroy() {
    this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
    this.$bus.emit('clearGraphics') //取消绘制方法
  },
  methods: {
    //导出表格
    exportExcel() {
      ExportExcel("div .exportTable", "拆迁分析");
    },
    //点击选择拆迁点
    selectRemovePoint() {
      this.$bus.emit("getMapPoint", false, _GData => {
        this.selGData = _GData;
        //通过空间数据信息，获取拆迁数据列表
        this.DemolitionSearchFnc();
      });
    },
    //高亮选中区域
    heightLight(resultValue, layerIcon) {
      if (!layerIcon) {
        // //展示线
        this.$bus.emit("pipeLineView", resultValue); //线高亮
      } else {
        // //展示消防栓
        layerIcon && this.$bus.emit("facilitiesView", resultValue, layerIcon);
      }
    },
    //获取拆迁数据列表
    DemolitionSearchFnc() {
      this.loading = true;
      let taskList = [];
      _.forEach(MapConfigure.FeatureLayerGroup, groupValue => {
        _.forEach(groupValue.featureLayers, featureValue => {
          let queryTask = new Promise((resolve, reject) => {
            this.$bus.emit(
              "bufferAnalysis",
              featureValue.layerName,
              this.selGData,
              this.bufferRange,
              resultValue => {
                //this.RemoveDataTotal = _.map(resultValue, "attributes");
                this.heightLight(resultValue ,featureValue.iconName)
                resolve({ 
                  layerName: featureValue.layerName,
                  layerCName: featureValue.layerCName,
                  layerType: featureValue.layerType,
                  listViewColumn: featureValue.listViewColumn,
                  layerData: _.map(resultValue, "attributes")
                });
              }
            );
          });
          taskList.push(queryTask);
        });
      });
      //取得最终结果
      Promise.all(taskList)
        .then(result => {
          let listAllArray = []
          _.forEach(result , item => {
           let allArray = _.map(item.layerData , layer => {
             return _.assign({},layer, {
              allType:item.layerCName,
              clumnValue:item.layerName
            })
           })
            listAllArray.push(...allArray)
          })
          this.loading = false
          this.RemoveDataTotal = listAllArray
          if(!listAllArray.length){
            this.$message({
              type:'warning',
              message:"此范围没有数据",
              showClose:true
            })
          }
        })
        .catch(err => {
          console.log("拆过程空间数据查询错误", err);
        });
    },
    //分析btn的方法
    removeAnalysis() {
      if (!this.selGData) {
        this.$message({
          type: "warning",
          message: "请选择区域",
          showClose: true
        });
        return;
      }
      this.DemolitionSearchFnc();
    },
    //点击选择事件
    onPipeRowClick(row, column, event) {
      this.$bus.emit(
        "setMapLocation",
        row.OBJECTID,
        row.clumnValue,
        resultValue => {
          console.log(resultValue);
          // this.RemoveData = 
        }
      );
    },
    //清空表格和地图
    clearRemoveAnalysis() {
      this.RemoveDataTotal = [];
      this.selGData = null;
      this.$bus.emit("clearGDataLayer");
      this.$bus.emit('clearGraphics') //取消绘制方法
    }
  }
};
</script>
