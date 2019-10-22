<template>
  <span style="display: flex;justify-content: center;align-items: center;">
    <el-select v-model="searchFactor" class="search-factor" @change="changeSelect">
      <el-option
        :value="item.value"
        :label="item.lable"
        v-for="item in selectObj"
        :key="item.value"
      ></el-option>
    </el-select>
    <!-- 坐标查询 -->
    <span class="input-Wraper between" v-show="searchFactor === 'coordinate'">
      <el-input-number v-model="searchCoordinate.X" controls-position="right" placeholder="X"></el-input-number>
      <el-input-number v-model="searchCoordinate.Y" controls-position="right" placeholder="Y"></el-input-number>
    </span>
    <span
      class="input-Wraper"
      v-show="searchFactor ==='watermeter' || searchFactor ==='grid' || searchFactor ==='pipe'"
    >
      <el-input v-model="topSearchDataValue" controls-position="right" placeholder="编号"></el-input>
    </span>

    <!-- POI查询 -->
    <el-select
      class="input-Wraper"
      v-show="searchFactor === 'POI'"
      v-model="topSearchDataValue"
      filterable
      remote
      reserve-keyword
      :loading="POILoading"
      placeholder="请输入需要查询的POI"
      :remote-method="remoteMethod"
    >
      <el-option
        v-for="item in remoteData"
        :key="item.OBJECTID"
        :label="item.NAME"
        :value="item.OBJECTID"
      ></el-option>
    </el-select>

    <div class="search" @click="mapSearchClick()">
      <span class="iconfont icon-sousuo" v-show="!searchLoading"></span>
      <span class="el-icon-loading" v-show="searchLoading"></span>
    </div>
  </span>
</template>
<script>
import _ from "lodash";
import MapDataOperation from "@services/ArcMap/MapDataOperation";
import * as GisTableColumn from "@common/consts/GisConst/GisTableColumn";
import {
  MapConfigure,
  LayerType,
  FeatureLayerOperation
} from "@common/consts/GisConst/MapConfigure";
export default {
  mounted() {
    //地图数据操作
    this._MapDataOperation = new MapDataOperation();
    this._MapDataOperation.init().then(() => {
      // this.onLayerSelectChange();
    });
  },
  props: ["toolbar"],
  data() {
    return {
      searchLoading: false, //查询按钮点击
      POILoading: false, //POI查询加载loading
      selectObj: [
        {
          lable: "POI",
          value: "POI",
          layerType: 0,
          Title: "OTITLE",
          placeholder: "请输入POI查询"
        },
        {
          lable: "坐标",
          value: "coordinate",
          layerType: 0,
          Title: "OTITLE",
          placeholder: ""
        }
        // {
        //   lable: "水表",
        //   value: "watermeter",
        //   layerType: LayerType.WaterMeterTypeNO,
        //   isEnable: true,
        //   searchName: "USERID",
        //   Title: "NAME",
        //   templeInfo: [
        //     { field: "WRITE_PERSON", text: "用户" },
        //     { field: "CID", text: "分区计量" }
        //   ],
        //   placeholder: "请输入户号查询"
        // },
        // {
        //   lable: "管网",
        //   value: "pipe",
        //   layerType: LayerType.PipeTypeNO,
        //   isEnable: true,
        //   searchName: "OBJECTID",
        //   Title: "OTITLE",
        //   templeInfo: GisTableColumn.GS_ORIGILN_Columns,
        //   placeholder: "请输入管网编号查询"
        // },
        // {
        //   lable: "网格",
        //   value: "grid",
        //   layerType: LayerType.GridTypeNO,
        //   isEnable: false,
        //   searchName: "OCODE",
        //   Title: "OTITLE",
        //   placeholder: "请输入网格编号查询"
        // }
      ],
      POISearchData: "", //POI输入框内容
      searchCoordinate: {
        X: null,
        Y: null
      }, //经纬度查询
      topSearchDataValue: undefined,
      searchFactor: "POI" //顶部查询的factor
    };
  },

  methods: {
    closeLayer(val) {
      this.$emit("closeLayer", val);
    },
    changeSelect() {
      this.remoteData = [];
      this.topSearchDataValue = undefined;
      this.searchCoordinate.X = undefined;
      this.searchCoordinate.Y = undefined;
      this.searchLoading = false;
    },
    //地图数据搜索
    mapSearchClick() {
      if (this.searchLoading) return;
      this.searchLoading = true;
      switch (this.searchFactor) {
        case "coordinate":
          if (
            !_.isNull(this.searchCoordinate.X) &&
            !_.isNull(this.searchCoordinate.Y) &&
            !_.isUndefined(this.searchCoordinate.X) &&
            !_.isUndefined(this.searchCoordinate.Y)
          ) {
            this.toolbar.setMapLocation(
              this.searchCoordinate.X,
              this.searchCoordinate.Y
            );
          } else {
            this.$message({
              type: "warning",
              message: "请输入正确的坐标",
              showClose: true
            });
          }
          this.searchLoading = false;
          break;
        case "POI":
          let selValue = _.filter(this.remoteData, objValue => {
            return objValue.OBJECTID === this.topSearchDataValue;
          });
          if (selValue.length > 0) {
            selValue = selValue[0];
            if (!selValue.geometry.x) {
              let centerPoint = selValue.geometry.getExtent();
              console.log(centerPoint);
              selValue.geometry.x = (centerPoint.xmax + centerPoint.xmin) / 2;
              selValue.geometry.y = (centerPoint.ymax + centerPoint.ymin) / 2;
            }
            this.$bus.emit("clearGraphics"); //清除操作
            let activeItem = _.filter(this.selectObj, item => {
              return item.value === this.searchFactor;
            })[0];
            let template = "";
            if (activeItem.templeInfo) {
              template = "<table>";
              _.forEach(activeItem.templeInfo, item => {
                template += `<tr> <td><b>${item.text + ":"} </b></td> <td>${
                  selValue[item.field]
                } </td></tr>`;
              });
              template += "</table>";
            }
            this.searchLoading = false;
            this.$emit("actionMapSearch", selValue, null, template);
          }
          this.searchLoading = false;
          break;
        default:
          console.log("search");
          if (!this.topSearchDataValue) {
            this.$message({
              type: "warning",
              message: "请输入需要查询的编号",
              showClose: true
            });
            this.searchLoading = false;
          }
          this.searchInfoMethod(this.topSearchDataValue, remoteData => {
            if (remoteData.length > 0) {
              let selValue = remoteData[0];
              if (!selValue.geometry.x) {
                let centerPoint = selValue.geometry.getExtent();
                selValue.geometry.x = (centerPoint.xmax + centerPoint.xmin) / 2;
                selValue.geometry.y = (centerPoint.ymax + centerPoint.ymin) / 2;
              }
              this.$bus.emit("clearGraphics"); //清除操作
              let activeItem = _.filter(this.selectObj, item => {
                return item.value === this.searchFactor;
              })[0];
              let template = "";

              if (activeItem.templeInfo) {
                template = "<table>";
                _.forEach(activeItem.templeInfo, item => {
                  template += `<tr> <td><b>${item.text + ":"} </b></td> <td>${
                    selValue[item.field]
                  } </td></tr>`;
                });
                template += "</table>";
              }
              this.searchLoading = false;
              this.$emit("actionMapSearch", selValue, null, template);
            } else {
              this.searchLoading = false;
              this.$message({
                type: "warning",
                message: "没有对应此编号的数据",
                showClose: true
              });
            }
          });
          break;
      }
    },
    //获得远端POI层
    remoteMethod(serchCondition) {
      this.POILoading = true;
      this.$emit("actionMapSearch", serchCondition, res => {
        this.POILoading = false;
        this.remoteData = _.map(res, item => {
          item.attributes.NAME =
            item.attributes[MapConfigure.POILayers.featureLayers[0].NAME];
          item.attributes.geometry = item.geometry;
          return item.attributes;
        });
      });
    },
    searchInfoMethod(serchCondition, callBack) {
      //其他设备查询
      if (this._MapDataOperation) {
        let activeItem = _.filter(this.selectObj, item => {
          return item.value === this.searchFactor;
        })[0];

        let pipeURL = FeatureLayerOperation.getLayerURLByType(
          activeItem.layerType,
          !activeItem.isEnable
        );
        this._MapDataOperation.featureQuery(
          null,
          activeItem.searchName + " = '" + serchCondition + "'",
          pipeURL,
          resultValue => {
            let remoteData = _.map(resultValue, item => {
              item.attributes.NAME = item.attributes[activeItem.Title];
              item.attributes.geometry = item.geometry;
              return item.attributes;
            });
            callBack && callBack instanceof Function && callBack(remoteData);
          }
        );
      }
    }
  }
};
</script>
