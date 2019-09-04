<template>
  <el-dialog
    class="myDialog"
    :visible.sync="centerDialogVisible"
    :before-close="handleClose"
    width="780px"
    custom-class="order_detail_dialog"
    title="工单详情"
    center
  >
    <div class="step_hidden_left_title" v-if="currentRow">
      <span class="header_title">处理状态：</span>
      <el-steps :active="currentRow.EventStatus" simple class="table-state">
        <el-step
          v-for=" ( item , index ) in FlowPath"
          :key="item"
          :title="item.OperName"
          :class="{normal:index > currentRow.EventStatus}"
        >
          <span
            class="teble-state-span"
            slot="title"
            :style="{color: '#fff' ,'background-color':( index <= currentRow.EventStatus ? colorList[index] : '#abb0b3')}"
            @click="handleClick(item.rank)"
          >{{item.OperName}}</span>
        </el-step>
      </el-steps>
    </div>
    <el-tabs v-model="DialogTab" type="card" @tab-click="changeDialog">
      <el-tab-pane label="工单处理信息" name="first" class="event_order_pane">
        <el-scrollbar id="scrollbarM">
          <dialog-report class="event_order_pane-item" :color="colorList[0]"></dialog-report>
          <dialog-dispose
            class="event_order_pane-item"
            :TitleName="FlowPath[Statu].OperName"
            :color="colorList[Statu]"
            v-for="Statu in currentRow.EventStatus"
            :key="Statu"
          ></dialog-dispose>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="处理位置" name="second" class="event_order_pane">
        <div id="MDialogDetailMap" style="height: 50vh;"></div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import _ from "lodash";
import BaseMap from "@services/OpenLayers/BaseMap";
import MapNavigate from "@services/OpenLayers/MapNavigate";
//弹窗组件
import DialogReport from "../components/DialogReport";
import DialogDispose from "../components/DialogDispose";
//Api
import MaApiStatus from "@api/Maintain/GetStatusForMantain";
export default {
  components: {
    DialogReport,
    DialogDispose
  },
  props: ["centerDialogVisible", "currentRow"],
  created() {
    this.init();
  },
  watch: {
    centerDialogVisible() {
      if (this.centerDialogVisible) {
        this.mapCreat();
      } else {
        this.DialogTab = "first";
      }
    },
    currentRow() {
      this.pointChange = true;
    }
  },
  data() {
    return {
      pointChange: false, //点是否改变需要重新
      MapMethods: null, //地图示例
      DialogTab: "first",
      colorList: [
        "#cd3e3e",
        "#3289cc",
        "#c67a3c",
        "#2ca179",
        "#3289cc",
        "#3289cc",
        "#cd3e3e",
        "#c67a3c",
        "#2ca179",
        "#505761"
      ], //step颜色列
      FlowPath: [
        //处理流程
        "上报",
        "处理",
        "分派",
        "接受",
        "到场",
        "处置",
        "完工",
        "审核",
        "完成"
      ]
    };
  },
  methods:{
     mapCreat() {
      this.$nextTick(() => {
        console.log(
          document.querySelector("#MDialogDetailMap"),
          this.MapMethods
        );
        if (
          !(
            this.centerDialogVisible &&
            this.DialogTab === "second" &&
            this.pointChange
          )
        ) {
          return;
        }
        if (!this.MapMethods) {
          let _mapController = new BaseMap();
          _mapController
            .createMap("MDialogDetailMap")
            .then(ResultObject => {
              console.log(ResultObject);
              this.MapMethods = new MapNavigate(ResultObject);
              this.MapMethods.setPointOnMap(
                [[113.52334821796903, 34.77318724078378]],
                false,
                () => {},
                "RoutePoint",
                "desript"
              );
              this.MapMethods.setCenter([
                113.52334821796903,
                34.77318724078378
              ]);
              // this.MapMethods.pointermoveControl(
              //   document.getElementById("popup"),
              //   (res, title) => {
              //     console.log(this.dialogType)
              //     this.dialogShow = 'mapLayer'
              //     // document.getElementById('popup').inner
              //     this.htmlString = res;
              //     this.layerTtitle = title;
              //   }
              // );
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          this.MapMethods.setPointOnMap(
            [[113.52334821796903, 34.77318724078378]],
            false,
            () => {},
            "RoutePoint",
            "desript"
          );
          this.MapMethods.setCenter([113.52334821796903, 34.77318724078378]);
        }
        this.pointChange = false;
      });
    },
    handleClick(num){
      if(num <= this.currentRow.EventStatus){
        let scrollbarFromS = document.querySelectorAll("#scrollbarM .el-scrollbar__view .el-form");
        document.getElementById("scrollbarM")
          .getElementsByClassName("el-scrollbar__wrap")[0]
            .scrollTop = scrollbarFromS[num].offsetTop;
      }
    },
    //切换数据/地图
    changeDialog(tab, event) {
      this.mapCreat();
    },
    init() {
      MaApiStatus.GetStatusForMantain().then(res => {
        this.FlowPath = res.data.Data.Result;
        this.FlowPath.unshift({
          OperId: 0,
          OperName: "上报",
          OperName2: "上报",
          rank: 0
        });
        this.FlowPath.push({
          OperId: 8,
          OperName: "完成",
          OperName2: "完成",
          rank: 8
        });
        console.log(this.FlowPath);
      });
    },
    handleClose(){
      this.$emit("update:centerDialogVisible",false)
      document.getElementById("scrollbarM")
          .getElementsByClassName("el-scrollbar__wrap")[0]
            .scrollTop = 0;
    }
  }
};
</script>
<style>
#scrollbarM .el-scrollbar__view {
  padding-bottom: 400px;
}
</style>