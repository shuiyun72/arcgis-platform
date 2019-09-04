<template>
  <div class="formItem table_style" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'关阀分析'" :flexible.sync="flexible"></TableFormTitle>
    <el-form>
      <el-row class="tab-btn-wraper" >
        <AnalysisSelect
          v-if="$options.filters.btnTree('choose' ,$route.meta.iFunID)"
          :btnMessage="{text:'选择爆管点'}"
          :layerData="layerData"
          :selectLayerValue.sync="selectLayerValue"
          :listViewColumn.sync="listViewColumn"
          @searchFnc="sqluibAnalysis"
        ></AnalysisSelect>
        <template v-for="item in btnList">
          <el-button
            :key="item.text"
            size="mini"
            @click="btnChange(item.text)"
            v-if="$options.filters.btnTree(item.model ,$route.meta.iFunID)"
            :class="item.class"
          >{{item.text}}</el-button>
        </template>
      </el-row>
    </el-form>

    <el-row class="tab-wraper">
      <el-tabs v-model="tabActiveName" @tab-click="handleClick" type="card">
        <el-tab-pane label="阀门结果" name="first">
          <GisTable
            class="first"
            :loading="loading"
            :tableHeight="`calc(100vh - 299px)`"
            @TableRowClick="onValveRowClick"
            @doubleAnalysis="doubleAnalysis"
            @currentChange="handleCurrentChange"
            :layerListName="`E_Valve_Columns`"
            :doubleAnalysisState="true"
            :columnListData="ValveDataTotal"
          ></GisTable>
        </el-tab-pane>
        <el-tab-pane label="阀门井结果" name="second">
          <GisTable
            class="second"
            :loading="loading"
            :tableHeight="`calc(100vh - 299px)`"
            @doubleAnalysis="doubleAnalysis"
            @TableRowClick="onValveWellRowClick"
            @currentChange="handleCurrentChange"
            :layerListName="`E_Pipe_Columns`"
            :doubleAnalysisState="true"
            :columnListData="ValveWellDataTotal"
          ></GisTable>
        </el-tab-pane>
        <el-tab-pane label="影响管线" name="third">
          <GisTable
            class="third"
            :loading="loading"
            :tableHeight="`calc(100vh - 299px)`"
            @TableRowClick="onPipeRowClick"
            :doubleAnalysisState="false"
            :layerListName="listViewColumn"
            :columnListData="PipeDataTotal"
          ></GisTable>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>
<script>
import _ from "lodash";
import * as EasyTable from "@common/consts/GisConst/GisTableColumn";
import MapDataOperation from "@services/ArcMap/MapDataOperation"; //空间数据查询
import {
  E_Pipe_Columns,
  E_Valve_Columns,
  E_Valvewell_Columns
} from "@common/consts/GisConst/GisTableColumn";
import SpatialSearch from "@api/GIS/SpatialSearch";
import { constants } from "fs";
import { ExportExcel } from "@util";
import {
  LayerType,
  MapConfigure,
  FeatureLayerOperation
} from "@common/consts/GisConst/MapConfigure";
import GisTable from "@features/GIS/components/GisTable";
import AnalysisSelect from "@features/GIS/components/AnalysisSelect";
import TableFormTitle from "@common/components/TableFormTitle";
export default {
  components: {
    GisTable,
    AnalysisSelect,
    TableFormTitle
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
  data() {
    return {
      listViewColumn:'',//表格表头
      equipmentPointNum: 0, //是否点选高亮设备
      flexible: false, //是否收缩左侧表格
      currentRow: null, //当前的行
      PID: [], //查询所需的pid
      selectLayerValue: [], //选中图层
      layerData: [], //图层集合
      loading: false,
      PipeDataTotal: [],
      ValveDataTotal: [],
      ValveWellDataTotal: [],
      btnList: [
        // {
        //   text: "选择爆管点",
        //   icon: "icon-dingwei"
        // },
        // {
        //   text: "表格二次关阀分析",
        //   class: "my-analysis"
        // },
        {
          text: "设备二次关阀分析",
          class: "my-analysis",
          model:'/api/SpatialSearch/GetRealatedValveAndPipeByPipeId',
        },
        {
          text: "导出",
          class: "my-export",
          model:'export',
        },
        {
          text: "清除",
          class: "my-clean",
          model:'clear',
        }
      ],
      tabActiveName: "first"
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    loadData() {
      this.layerData = FeatureLayerOperation.getLayer(LayerType.PipeTypeNO);
      this.selectLayerValue.push(this.layerData[0].id);
      this.selectLayerValue.push(this.layerData[0].children[0].id);
      this.listViewColumn = this.layerData[0].children[0].listViewColumn
    },
    btnChange(val) {
      switch (val) {
        case "设备二次关阀分析":
          this.equipmentdoubleAnalysis();
          break;
        case "表格二次关阀分析":
          this.doubleAnalysis();
          break;
        case "清除":
          this.clearResult();
          break;
        case "导出":
          this.exportExcel();
          break;
      }
    },
    //设备二次关阀分析
    equipmentdoubleAnalysis() {
      if (
        !(
          this.PipeDataTotal.length ||
          this.ValveDataTotal.length ||
          this.ValveWellDataTotal.length
        )
      ) {
        this.$message({
          type: "warning",
          message: "请先进行爆管分析",
          showclose: true
        });
        return;
      }
      this.$bus.emit("pointSelect", {
        featureQueryCompleted: res => {
          let _GData = res.geometry;
          this.$bus.emit(
            "featureQueryTask",
            _GData,
            res => {
              let layerData = [];
              _.forEach(res, item => {
                if (
                  item.layerData.length ||
                  item.layerData == LayerType.ValveTypeNO ||
                  item.layerData == LayerType.ValvewellTypeNO
                ) {
                  layerData.push(...item.layerData);
                }
              });

              if (layerData.length == 0) {
                this.$message({
                  type: "warning",
                  message: "请选择高亮设备进行分析",
                  showclose: true
                });
              } else {
                let num;
                this.equipmentPointNum = 0;
                _.forEach(layerData, layerDataItem => {
                  num = _.filter(this.ValveDataTotal, Valve => {
                    return layerDataItem.attributes.OBJECTID == Valve.OBJECTID;
                  }).length;
                  if (!num) {
                    num = _.filter(this.ValveWellDataTotal, Valve => {
                      return (
                        layerDataItem.attributes.OBJECTID == Valve.OBJECTID
                      );
                    }).length;
                  }
                  if (num) {
                    this.equipmentPointNum = num;
                  }
                });
                if (this.equipmentPointNum) {
                  this.AnalysisFnc(_GData);
                  this.$bus.emit("addMapPoint", _GData);
                } else {
                  this.$message({
                    type: "warning",
                    message: "请选择高亮设备进行分析",
                    showclose: true
                  });
                }
              }
            },
            1
          );
        }
      });
    },
    //二次关阀分析
    doubleAnalysis(currentRow) {
      // if (!this.currentRow) {
      //   this.$message({
      //     type: "warning",
      //     message: "请选择需要分析的数据",
      //     showClose: true
      //   });
      //   return;
      // }

      // let _GData = this._MapDataOperation.createPoint(
      //   this.currentRow.coordinate_x,
      //   this.currentRow.coordinate_y
      // );
      let _GData = this._MapDataOperation.createPoint(
        currentRow.coordinate_x,
        currentRow.coordinate_y
      );
      this.AnalysisFnc(_GData);
      this.$bus.emit("addMapPoint", _GData);
    },
    AnalysisFnc(_GData) {
      this.$bus.emit(
        "bufferAnalysis",
        this.selectLayerValue[1],
        _GData,
        1,
        res => {
          _.forEach(res, item => {
            this.PID.push(item.attributes.PID);
          });
          console.log(this.PID.join(","));
          this.SquibSearchFnc();
        }
      );
    },
    exportExcel() {
      ExportExcel(`.${this.tabActiveName} .exportTable`, "关阀分析");
    },
    //点击选择事件
    onValveWellRowClick(row, column, event) {
      this.$bus.emit(
        "setMapLocation",
        row.OBJECTID,
        //"ValvewellLayer"
        FeatureLayerOperation.getGroupLayerByType(
          this.selectLayerValue[0],
          LayerType.ValvewellTypeNO
        ),
        resultValue => {
          console.log(resultValue);
        }
      );
    },

    //点击选择事件
    onValveRowClick(row, column, event) {
      let layer = FeatureLayerOperation.getGroupLayerByType(
        this.selectLayerValue[0],
        LayerType.ValveTypeNO
      );
      console.log(layer, row.OBJECTID);
      this.$bus.emit(
        "setMapLocation",
        row.OBJECTID,
        // "ValveLayer"
        layer,
        resultValue => {
          console.log(resultValue);
        }
      );
    },
    //点击选择事件
    onPipeRowClick(row, column, event) {
      this.$bus.emit(
        "setMapLocation",
        row.OBJECTID,
        // "PipeLineLayer"
        FeatureLayerOperation.getGroupLayerByType(
          this.selectLayerValue[0],
          LayerType.PipeTypeNO
        ),
        resultValue => {
          console.log(resultValue);
        }
      );
    },
    //爆管分析
    sqluibAnalysis() {
      this.clearResult();
      //分析数据
      this.$bus.emit("selectSquib", this.selectLayerValue[1], resultValue => {
        if (resultValue.length > 0) {
          this.PID.push(resultValue[0].PID);
          //通过空间数据信息，获取管网数据列表
          this.SquibSearchFnc();
        } else {
          this.$message({
            type: "warning",
            message: "此处没有爆管数据",
            showClose: true
          });
        }
      });
    },
    SquibSearchFnc() {
      this.loading = true;
      let sType = "";
      let pipeType = this.selectLayerValue[1];
      console.log("length", this.selectLayerValue[0]);
      let methodsName = "SquibAnalysis";
      if (this.layerData.length > 1) {
        let fResult = _.filter(MapConfigure.FeatureLayerGroup, objValue => {
          return objValue.groupName === this.selectLayerValue[0];
        });
        fResult.length > 0 && (sType = fResult[0].sTypeL);
        methodsName = "SquibAnalysisByType";
      }

      console.log("PID", pipeType, this.PID.join(","));
      //调用爆管接口
      SpatialSearch[methodsName](this.PID.join(","), sType).then(objValue => {
        console.log(objValue);
        if (objValue.data.Flag) {
          //取得管线数据集合
          let PipeDataTotal = objValue.data.Data.Result.pipesInfo || [];
          let ValveDataTotal = objValue.data.Data.Result.valvesInfo || [];
          let ValveWellDataTotal =
            objValue.data.Data.Result.vavleWellInfo || [];
          PipeDataTotal = _.sortBy(PipeDataTotal, "OBJECTID");
          ValveDataTotal = _.sortBy(ValveDataTotal, "OBJECTID");
          ValveWellDataTotal = _.sortBy(ValveWellDataTotal, "OBJECTID");
          this.PipeDataTotal = _.uniqBy(PipeDataTotal, "OBJECTID");
          this.ValveDataTotal = _.uniqBy(ValveDataTotal, "OBJECTID");
          this.ValveWellDataTotal = _.uniqBy(ValveWellDataTotal, "OBJECTID");
          this.loading = false;
          this.$bus.emit(
            "getSpaceData",
            this.PipeDataTotal,
            this.selectLayerValue[1],
            pipeValue => {
              this.$bus.emit("pipeLineView", pipeValue);
            }
          );
          let coordinateList = _.map(this.ValveDataTotal, item => {
            let a = [];
            a[0] = item.Shape._geometry.m_points[0].x;
            a[1] = item.Shape._geometry.m_points[0].y;
            return a;
          });
          let ValveWellList = _.map(this.ValveWellDataTotal, item => {
            let a = [];
            a[0] = item.Shape._geometry.m_points[0].x;
            a[1] = item.Shape._geometry.m_points[0].y;
            return a;
          });
          coordinateList.push(...ValveWellList);

          /**
           *顺时针排列方法
           */
          let a = _.cloneDeep(coordinateList);
          let coordinatelen = coordinateList.length;
          coordinateList = _.orderBy(coordinateList, function(o) {
            return o[0];
          });
          let coordinateX =
            (coordinateList[0][0] + coordinateList[coordinatelen - 1][0]) / 2;
          coordinateList = _.orderBy(coordinateList, function(o) {
            return o[1];
          });
          let coordinateY =
            (coordinateList[0][1] + coordinateList[coordinatelen - 1][1]) / 2;
          let coorDy, coorDx, coorDs;
          _.forEach(coordinateList, (coor, index) => {
            coorDx = coor[0] - coordinateX;
            coorDy = coor[1] - coordinateY;
            coorDs = Math.sqrt(coorDx * coorDx + coorDy * coorDy);
            coordinateList[index].sinAtan = coorDy / coorDs;
            coordinateList[index].cosAtan = coorDx;
          });
          coordinateList = _.orderBy(coordinateList, function(o) {
            return o.sinAtan;
          });
          let coorTwothree = _.filter(coordinateList, item => {
            return item.cosAtan >= 0;
          });
          let coorOneFour = _.filter(coordinateList, item => {
            return item.cosAtan < 0;
          });
          coorOneFour = _.orderBy(coorOneFour, function(o) {
            return -o.sinAtan;
          });
          coordinateList = _.concat(coorOneFour, coorTwothree);
          coordinateList = _.map(coordinateList, item => {
            let array = [];
            array[0] = item[0];
            array[1] = item[1];
            return array;
          });
          let drawPolygonList = [];
          let drawPolygonListItem = [];
          drawPolygonList.push(coordinateList);
          /**
           *顺时针排列方法结束
           */
          this.$bus.emit("drawPolygon", drawPolygonList);
          this.$bus.emit("facilitiesView", this.ValveDataTotal, "阀门.png");
          this.$bus.emit("facilitiesView", this.ValveWellDataTotal, "阀门.png");
        } else {
          console.log("爆管错误：", objValue.data.ExceptionMsg);
        }
      });
    },
    //清楚结果
    clearResult() {
      this.PID = [];
      console.log(this.PID);
      this.currentRow = null;
      this.PipeDataTotal = [];
      this.ValveDataTotal = [];
      this.ValveWellDataTotal = [];
      this.$bus.emit("clearGDataLayer");
      this.$bus.emit("clearGraphics"); //取消绘制方法
    }
  }
};
</script>


