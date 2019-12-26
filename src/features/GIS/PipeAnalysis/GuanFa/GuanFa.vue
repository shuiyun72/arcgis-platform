<template>
  <div class="formItem table_style" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'关阀分析'" :flexible.sync="flexible"></TableFormTitle>
    <el-form>
      <el-row class="tab-btn-wraper">
        <AnalysisSelect
          v-if="$options.filters.btnTree('choose' ,$route.name)"
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
            v-if="$options.filters.btnTree(item.model ,$route.name)"
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
            :layerListName="`E_Valvewell_Columns`"
            :doubleAnalysisState="true"
            :columnListData="ValveWellDataTotal"
          ></GisTable>
        </el-tab-pane>
        <el-tab-pane label="阀门孔结果" name="four">
          <GisTable
            class="four"
            :loading="loading"
            :tableHeight="`calc(100vh - 299px)`"
            @doubleAnalysis="doubleAnalysis"
            @TableRowClick="onValveHoleRowClick"
            @currentChange="handleCurrentChange"
            :layerListName="`E_Valvewell_Columns`"
            :doubleAnalysisState="true"
            :columnListData="ValveHoleDataTotal"
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
    if (this.clickID) {
      this.clickID.remove();
    }
    this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
    this.$bus.emit("clearGraphics"); //取消绘制方法
  },
  data() {
    return {
      clickID: null, //图层的监听点击事件
      listViewColumn: "", //表格表头
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
      ValveHoleDataTotal: [],
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
          model: "/api/SpatialSearch/GetRealatedValveAndPipeByPipeId"
        },
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
      this.listViewColumn = this.layerData[0].children[0].listViewColumn;
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
      if (this.clickID) {
        this.clickID.remove();
      }
      if (
        !(
          this.PipeDataTotal.length ||
          this.ValveDataTotal.length ||
          this.ValveWellDataTotal.length ||
          this.ValveHoleDataTotal.length
        )
      ) {
        this.$myMessage("warning", "请先进行爆管分析");
        return;
      }
      this.$bus.emit("facilitiesViewClick", (click, res) => {
        this.clickID = click;
        if (res && !res.graphic.attributes) {
          this.AnalysisFnc(res.graphic.geometry);
          this.$bus.emit("addMapPoint", res.graphic.geometry);
          click.remove();
        } else {
          this.$myMessage("warning", "请选择阀门进行双击操作");
        }
      });
    },
    //二次关阀分析
    doubleAnalysis(currentRow) {
      // if (!this.currentRow) {
      //this.$myMessage('warning','请选择需要分析的数据')
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
    onValveHoleRowClick(row, column, event) {
      this.$bus.emit(
        "setMapLocation",
        row.OBJECTID,
        //"ValvewellLayer"
        FeatureLayerOperation.getGroupLayerByType(
          this.selectLayerValue[0],
          LayerType.ValveholeTypeNO
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
          this.$myMessage("warning", "此处没有爆管数据");
        }
      });
    },
    SquibSearchFnc() {
      this.loading = true;
      let sType = "";
      let pipeType = this.selectLayerValue[1];
      let methodsName = "SquibAnalysis";
      if (this.layerData.length > 1) {
        let fResult = _.filter(MapConfigure.FeatureLayerGroup, objValue => {
          return objValue.groupName === this.selectLayerValue[0];
        });
        fResult.length > 0 && (sType = fResult[0].sTypeL);
        methodsName = "SquibAnalysisByType";
      }
      //调用爆管接口
      SpatialSearch[methodsName](this.PID.join(","), sType)
        .then(objValue => {
          if (objValue.data.Flag) {
            //取得管线数据集合
            let PipeDataTotal = objValue.data.Data.Result.pipesInfo || [];
            let ValveDataTotal = objValue.data.Data.Result.valvesInfo || [];
            let ValveWellDataTotal =
              objValue.data.Data.Result.vavleWellInfo || [];
            let ValveHoleDataTotal =
              objValue.data.Data.Result.vavleHoleInfo || [];
            PipeDataTotal = _.sortBy(PipeDataTotal, "OBJECTID");
            ValveDataTotal = _.sortBy(ValveDataTotal, "OBJECTID");
            ValveWellDataTotal = _.sortBy(ValveWellDataTotal, "OBJECTID");
            ValveHoleDataTotal = _.sortBy(ValveHoleDataTotal, "OBJECTID");
            this.PipeDataTotal = _.uniqBy(PipeDataTotal, "OBJECTID");
            this.ValveDataTotal = _.uniqBy(ValveDataTotal, "OBJECTID");
            this.ValveWellDataTotal = _.uniqBy(ValveWellDataTotal, "OBJECTID");
            this.ValveHoleDataTotal = _.uniqBy(ValveHoleDataTotal, "OBJECTID");
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
            let ValveHoleList = _.map(this.ValveHoleDataTotal, item => {
              let a = [];
              a[0] = item.Shape._geometry.m_points[0].x;
              a[1] = item.Shape._geometry.m_points[0].y;
              return a;
            });
            coordinateList.push(...ValveHoleList);

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
            let activeValveItem = FeatureLayerOperation.getLayerFeatureByType(LayerType.ValveTypeNO);
            this.$bus.emit("facilitiesView", this.ValveDataTotal, activeValveItem[0].iconName);
            let activeValveHoleItem = FeatureLayerOperation.getLayerFeatureByType(LayerType.ValveholeTypeNO);
            this.$bus.emit(
              "facilitiesView",
              this.ValveHoleDataTotal,
              activeValveHoleItem[0].iconName
            );
            let activeValveWellItem = FeatureLayerOperation.getLayerFeatureByType(LayerType.ValvewellTypeNO);
            this.$bus.emit(
              "facilitiesView",
              this.ValveWellDataTotal,
              activeValveHoleItem[0].iconName
            );
          } else {
            this.loading = false;
            this.$myMessage('error',objValue.data.ExceptionMsg)
            console.log("爆管错误：", objValue.data.ExceptionMsg);
          }
        })
        .catch(err => {
          this.loading = false;
          this.$myMessage("error", "系统发生内部错误,请联系管理员");
          console.log(err);
        });
    },
    //清楚结果
    clearResult() {
      this.PID = [];
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


