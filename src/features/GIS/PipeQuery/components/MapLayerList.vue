<template>
  <!-- 图层控制 -->
  <div class="Map_Action_Bar_Layer_Win">
    <div class="Win_Title">
      <span class="text">图层控制</span>
      <span @click="closeLayer('tuceng')" class="icon">
        <i class="iconfont icon-shousuo"></i>
      </span>
    </div>
    <div class="TuCeng_List">
      <el-scrollbar>
        <div class="Win_Img_List">
          <div class="List_Item" v-for="item in imgList" :key="item.layerName">
            <div
              class="Win_Img_List_Item"
              @click="onMainLayerControl(item)"
              :class="{active: item.layerName == MainLayeValue}"
            >
              <span>{{item.layerCName}}</span>
              <img :src="require('@assets/'+'toolIcon/' +item.iconName)" />
            </div>
            <div class="Win_Text_List_Item">
              <el-row type="flex" style="padding:0" justify="space-between">
                <span class="tuceng_title">透明度</span>
                <span class="Win_Range_Value">{{item.transValue}}%</span>
              </el-row>

              <el-slider v-model="item.transValue" @change="sliderHandle(item)"></el-slider>
            </div>
          </div>
        </div>
        <div class="She_Shi_Layer">
          <template v-for="item in GISWebData">
            <el-checkbox
              :key="item.methoud"
              :label="item.name"
              v-if="item.ControlShow"
              v-model="item.ShowStation"
              @change="axiosWebShowOrHidden(item)"
            ></el-checkbox>
          </template>
          <el-tree
            :data="layerData"
            ref="tree"
            default-expand-all
            :default-checked-keys="defaultCheckLabel"
            @check-change="tuCengChange"
            show-checkbox
            node-key="id"
            :props="defaultProps"
          ></el-tree>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import {
  MapConfigure,
  GISWebData,
  FeatureLayerOperation
} from "@common/consts/GisConst/MapConfigure";
export default {
  props: ["searchType", "toolbar"],
  data() {
    return {
      GISWebData: GISWebData, //通过接口获取数据展示在地图上的配置信息
      imgList: _.cloneDeep(MapConfigure.BaseLayers),
      layerData: FeatureLayerOperation.getLayer(),
      defaultCheckLabel: [], //默认选中的tree图层的值
      MainLayeValue: "StreetLayer" //选中图层值
    };
  },
  methods: {
    //关闭
    closeLayer(val) {
      this.$emit("closeLayer", val);
    },
    //通过接口展示的图层显示隐藏控制
    axiosWebShowOrHidden(item) {
      this.$emit("axiosWebShowOrHidden", item);
    },
    //false 清空  true 显示全部 addNode添加的点
    setCheckedTreeNodes(type, addNode, isDisplay) {
      if (type) {
        this.$refs.tree.setCheckedNodes(this.defaultCheckLabel);
      } else if (addNode) {
        this.$refs.tree.setChecked(addNode, isDisplay);
      } else {
        this.$refs.tree.setCheckedNodes([]);
      }
    },
    //通过dom的操作取出实例信息
    loadData() {
      this.layerData = FeatureLayerOperation.getLayer();
      _.forEach(this.layerData, item => {
        if (item.children) {
          _.forEach(item.children, idObj => {
            if (idObj.isActive) {
              this.defaultCheckLabel.push(idObj.id);
            }
          });
        } else {
          if (item.isActive) {
            this.defaultCheckLabel.push(item.id);
          }
        }
      });
      if (this.imgList.length == 1) {
        this.MainLayeValue = this.imgList[0].layerName;
      } else {
        this.MainLayeValue = _.filter(this.imgList, item => {
          return item.isActive;
        })[0].layerName;
      }
    },
    //透明度滑动方法
    sliderHandle(item) {
      if (item.layerName === this.MainLayeValue) {
        this.toolbar.layerSetOpacity(item.layerName, item.transValue / 100);
      }
    },
    //主控图层控制显示与隐藏
    onMainLayerControl(item) {
      this.MainLayeValue = item.layerName;
      if (this.imgList.length == 1) {
        return;
      }
      this.toolbar.layerSetOpacity(item.layerName, item.transValue / 100);
      this.oneLayerShow(item.layerName);
    },
    //动态控制地图只有一个显示
    oneLayerShow(activeLayer) {
      _.forEach(this.imgList, item => {
        if (item.layerName == activeLayer) {
          item.isActive = true;
          this.$bus.emit("onLayerViewOrHidden", item.layerName, true);
        } else {
          item.isActive = false;
          this.$bus.emit("onLayerViewOrHidden", item.layerName, false);
        }
      });
    },
    //更改底图选择
    tuCengChange(data, checked, indeterminate) {
      if (data.type) {
        _.forEach(MapConfigure.FeatureLayerGroup, group => {
          if (group.isHide || !group.isEnable) return;
          _.forEach(group.featureLayers, item => {
            if (item.layerTypeCountHide && item.layerName.indexOf(data.value) > -1) {
              this.$bus.emit("onLayerViewOrHidden", item.layerName, checked);
            }
          });
        });
        this.$bus.emit("onLayerViewOrHidden", data.value, checked);
      }
    }
  }
};
</script>
