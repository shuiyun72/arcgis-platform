<template>
  <div class="formItem table_style" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'连通性分析'" :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="100px" label-position="right" size="mini">
      <el-row class="tab-btn-wraper">
        <AnalysisSelect
          :btnMessage="{text:'选择管点',icon:'icon-dingwei',type:'warning'}"
          :layerData="layerData"
          :selectLayerValue.sync="selectLayerValue"
          @searchFnc="choosePipe"
          :listViewColumn.sync="listViewColumn"
          v-if="$options.filters.btnTree('choose' ,$route.name)"
        ></AnalysisSelect>
        <template v-for="item in btnList">
          <el-button
            size="mini"
            class="my-yellow"
            :key="item.text"
            :class="item.class"
            @click="btnChange(item.text)"
            v-if="$options.filters.btnTree(item.model ,$route.name)"
          >
            <i class="iconfont" :class="item.icon"></i>
            {{item.text}}
          </el-button>
        </template>

        <!-- <el-button size="mini" type="primary" class="iconfont icon-SWANfenxi">分析结果</el-button>
        <el-button size="mini" icon="el-icon-delete" type="primary">清除</el-button>-->
      </el-row>
    </el-form>
    <GisTable
      :loading="loading"
      :tableHeight="`calc(100vh - 238px)`"
      @TableRowClick="onTableRowClick"
      :layerListName="listViewColumn"
      :columnListData="ConnectedDataTotal"
    ></GisTable>
  </div>
</template>
<script>
import _ from "lodash";
import { E_Pipe_Columns } from "@common/consts/GisConst/GisTableColumn";
import { ExportExcel } from "@util";
import MapDataOperation from "@services/ArcMap/MapDataOperation"; //空间数据查询
import {
  FeatureLayerOperation,
  LayerType
} from "@common/consts/GisConst/MapConfigure";
import AnalysisSelect from "@features/GIS/components/AnalysisSelect";
import GisTable from "@features/GIS/components/GisTable";
import TableFormTitle from "@common/components/TableFormTitle";
export default {
  components: {
    AnalysisSelect,
    GisTable,
    TableFormTitle
  },
  data() {
    return {
      loading: false,
      listViewColumn: "", //表格表头
      flexible: false, //是否收缩左侧表格
      gpJoinAnalysisData: [],
      selectLayerValue: [], //选中图层
      layerData: [], //图层集合
      ConnectedDataTotal: [],
      btnList: [
        // {
        //   text: "选择管点",
        //   icon: "icon-dingwei"
        // },
        // {
        //   text: "分析结果",
        //   icon: "icon-analyzefenxi"
        // },
        {
          text: "导出",
          class: "my-export",
          model: "export"
        },
        {
          text: "清除",
          class: "my-clean",
          model: "clear"
        }
      ]
    };
  },
  created() {
    this.loadData();
  },
  mounted() {
    this._MapDataOperation = new MapDataOperation();
    this._MapDataOperation.init(); //初始化
  },
  beforeDestroy() {
    this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
    this.$bus.emit("clearGraphics"); //取消绘制方法
  },
  methods: {
    loadData() {
      this.layerData = FeatureLayerOperation.getLayer(LayerType.PipeTypeNO);
      this.selectLayerValue.push(this.layerData[0].id);
      this.selectLayerValue.push(this.layerData[0].children[0].id);
      this.listViewColumn = this.layerData[0].children[0].listViewColumn;
    },
    btnChange(val) {
      switch (val) {
        case "导出":
          this.exportExcel();
          break;
        case "清除":
          this.clearResult();
          break;
        default:
          break;
      }
    },
    choosePipe() {
      if (this.gpJoinAnalysisData) {
        this.$bus.emit("clearGDataLayer");
      }
      this.$bus.emit("gpJoinAnalysis", ResultValue => {
        this.loading = true;
        this._MapDataOperation.gpJoinAnalysis(
          ResultValue,
          this.selectLayerValue[1], //图层名称
          this.selectLayerValue[0], //图层分组名称
          GPResult => {
            this.loading = false;
            this.gpJoinAnalysisData = GPResult;
            this.ConnectivitySearchFnc();
            console.log(GPResult);
            //获取数据
            if (GPResult.length === 0) {
              this.$message({
                type: "warning",
                message: "两点之间没有连通的管线",
                showClose: true
              });
            }
          }
        );
      });
    },
    ConnectivitySearchFnc() {
      this.$bus.emit("pipeLineView", this.gpJoinAnalysisData); //高亮管线
      this.ConnectedDataTotal = _.map(this.gpJoinAnalysisData, "attributes");
    },
    clearResult() {
      this.ConnectedDataTotal = [];
      this.$bus.emit("clearGDataLayer");
      this.$bus.emit("clearGraphics"); //取消绘制方法
    },
    exportExcel() {
      ExportExcel("div .exportTable", "连通性分析");
    },
    //点击选择事件
    onTableRowClick(row, column, event) {
      this.$bus.emit(
        "setMapLocation",
        { PID: row.PID },
        this.selectLayerValue[1],
        resultValue => {
          console.log(resultValue);
        }
      );
    }
  }
};
</script>


