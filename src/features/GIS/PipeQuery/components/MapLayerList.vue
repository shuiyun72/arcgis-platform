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
          <div
            class="List_Item"
            v-for="item in imgList"
            :key="item.layerName"
            :class="{active: item.layerName == MainLayeValue}"
          >
            <div class="Win_Img_List_Item" @click="onMainLayerControl(item)">
              <img :src="require('@assets/'+'toolIcon/baselayer/' +item.iconName)" />
            </div>
            <div class="Win_Text_List_Item">
              <span>{{item.layerCName}}</span>
            </div>
          </div>
        </div>
        <div class="She_Shi_Layer">
          <!-- <template v-for="item in GISWebData">
            <el-checkbox
              class="GISWebData"
              :key="item.methoud"
              :label="item.name"
              v-if="item.ControlShow"
              v-model="item.ShowStation"
              @change="axiosWebShowOrHidden(item)"
            ></el-checkbox>
          </template>-->
          <el-checkbox-group v-model="LayercheckedValue" @change="layerChange" v-if="!Checking">
            <el-collapse v-model="layerCollapse">
              <el-collapse-item v-for="layer in layerData" :key="layer.id" :name="layer.id">
                <template slot="title">
                  <div class="title-wrapper">
                    <div class="title">{{layer.label}}</div>
                    <div class="action" @click.stop="allChange(layer)">全部</div>
                  </div>
                </template>
                <div v-for="item in layer.children" :key="item" class="list-item">
                  <span>
                    <el-checkbox
                      :label="item.id"
                      @change=" (value) => layerCheckboxChange(item.id ,value)"
                    ></el-checkbox>
                    {{item.label}}
                  </span>
                  <!-- {{item}} -->
                  <div
                    v-if="item.iconName && $options.filters.isArray(item.iconName)"
                    :style="{ marginRight : item.iconName.length ?  '5px' :' 0'}"
                  >
                    <span
                      :style="{background:icon,  }"
                      v-for="icon in item.iconName"
                      :key="icon"
                      class="pipe-color"
                    ></span>
                  </div>
                  <img
                    v-else-if="item.iconName"
                    :src="require('@assets/'+'toolIcon/mapIcon/' +item.iconName)"
                    alt
                  />
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-checkbox-group>
          <el-collapse v-if="GISWebData && GISWebData.length">
            <el-collapse-item name="GISWebData">
              <template slot="title">
                <div class="title-wrapper">
                  <div class="title">其他设备</div>
                  <div class="action" @click.stop="otherAllChange()">全部</div>
                </div>
              </template>
              <template v-for="item in GISWebData">
                <div class="list-item" :key="item.methoud" v-if="item.ControlShow">
                  <span>
                    <el-checkbox
                      :label="item.name"
                      v-model="item.ShowStation"
                      @change="axiosWebShowOrHidden(item)"
                    ></el-checkbox>
                    {{item.name}}
                  </span>
                  <div
                    v-if="item.iconName && $options.filters.isArray(item.iconName)"
                    :style="{ marginRight : item.iconName.length ?  '5px' :' 0'}"
                  >
                    <span
                      :style="{background:icon,  }"
                      v-for="icon in item.iconName"
                      :key="icon"
                      class="pipe-color"
                    ></span>
                  </div>
                  <img
                    v-else-if="item.iconName"
                    :src="require('@assets/'+'toolIcon/mapIcon/' +item.iconName)"
                    alt
                  />
                </div>
              </template>
            </el-collapse-item>
          </el-collapse>
          <!-- <el-tree
            :data="layerData"
            ref="tree"
            default-expand-all
            :default-checked-keys="defaultCheckLabel"
            @check-change="tuCengChange"
            show-checkbox
            node-key="id"
            :props="defaultProps"
          ></el-tree>-->
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
  created() {
    this.loadData();
  },
  data() {
    return {
      layerCollapse: [], //当前展开图层
      Checking: false, //是否正在全选
      LayercheckedValue: [], //选中的layer
      GISWebData: GISWebData, //通过接口获取数据展示在地图上的配置信息
      imgList: _.cloneDeep(MapConfigure.BaseLayers),
      layerData: FeatureLayerOperation.getLayer(),
      defaultCheckLabel: [], //默认选中的tree图层的值
      MainLayeValue: "StreetLayer" //选中图层值
    };
  },
  filters: {
    checkedLayer(val) {
      return _.indexOf(val);
    }
  },
  methods: {
    //其他设备全部显示隐藏
    otherAllChange() {
      let GISWebData = _.filter(this.GISWebData, "ControlShow");
      let showGISWebData = _.filter(this.GISWebData, "ShowStation");
      if (GISWebData.length === showGISWebData.length) {
        _.forEach(GISWebData, item => {
          item.ShowStation = false;
          this.axiosWebShowOrHidden(item);
        });
      } else {
        _.forEach(GISWebData, item => {
          if (!item.ShowStation) {
            item.ShowStation = true;
            this.axiosWebShowOrHidden(item);
          }
        });
      }
    },
    //图层选择组改变
    layerChange(val, item) {
      console.log(val, item);
    },
    //单击checkbox改变具体图层
    layerCheckboxChange(name, val) {
      _.forEach(MapConfigure.FeatureLayerGroup, group => {
        if (group.isHide || !group.isEnable) return;
        _.forEach(group.featureLayers, item => {
          if (item.layerTypeCountHide && item.layerName.indexOf(name) > -1) {
            this.$bus.emit("onLayerViewOrHidden", item.layerName, val);
          }
        });
      });
      this.$bus.emit("onLayerViewOrHidden", name, val);
    },
    //点击全部的影响图层操作allChange
    allChange(layer) {
      this.Checking = true;
      let allChecked = this.LayercheckedValue.length;
      _.some(layer.children, child => {
        if (_.indexOf(this.LayercheckedValue, child.id) <= -1) {
          allChecked = false;
          return true;
        }
      });
      if (allChecked) {
        _.forEach(layer.children, child => {
          _.remove(this.LayercheckedValue, h => h === child.id);
          this.$bus.emit("onLayerViewOrHidden", child.id, false);
          _.forEach(MapConfigure.FeatureLayerGroup, group => {
            if (group.isHide || !group.isEnable) return;
            _.forEach(group.featureLayers, item => {
              if (
                item.layerTypeCountHide &&
                item.layerName.indexOf(name) > -1
              ) {
                this.$bus.emit("onLayerViewOrHidden", item.layerName, false);
              }
            });
          });
        });
      } else {
        _.forEach(layer.children, child => {
          if (_.indexOf(this.LayercheckedValue, child.id) <= -1) {
            this.LayercheckedValue.push(child.id);
            _.forEach(MapConfigure.FeatureLayerGroup, group => {
              if (group.isHide || !group.isEnable) return;
              _.forEach(group.featureLayers, item => {
                if (
                  item.layerTypeCountHide &&
                  item.layerName.indexOf(name) > -1
                ) {
                  this.$bus.emit("onLayerViewOrHidden", item.layerName, true);
                }
              });
            });
            this.$bus.emit("onLayerViewOrHidden", child.id, true);
          }
        });
      }
      this.$nextTick(() => {
        this.Checking = false;
      });
    },
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
      // if (type) {
      //   this.$refs.tree.setCheckedNodes(this.defaultCheckLabel);
      // } else if (addNode) {
      //   this.$refs.tree.setChecked(addNode, isDisplay);
      // } else {
      //   this.$refs.tree.setCheckedNodes([]);
      // }
      this.Checking = true;
      if (type) {
        this.LayercheckedValue = _.cloneDeep(this.defaultCheckLabel);
      } else if (addNode) {
        if (isDisplay) {
          this.LayercheckedValue.push(addNode, isDisplay);
        } else {
          _.remove(this.LayercheckedValue, h => h === addNode);
        }
      } else {
        this.LayercheckedValue = [];
      }
      this.$nextTick(() => {
        this.Checking = false;
      });
    },
    //通过dom的操作取出实例信息
    loadData() {
      this.layerData = FeatureLayerOperation.getLayer();
      _.forEach(this.layerData, item => {
        this.layerCollapse.push(item.id);
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
      this.LayercheckedValue = _.cloneDeep(this.defaultCheckLabel);
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
        if (item.layerName === activeLayer) {
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
        // _.forEach(MapConfigure.FeatureLayerGroup, group => {
        //   if (group.isHide || !group.isEnable) return;
        //   _.forEach(group.featureLayers, item => {
        //     if (
        //       item.layerTypeCountHide &&
        //       item.layerName.indexOf(data.value) > -1
        //     ) {
        //       this.$bus.emit("onLayerViewOrHidden", item.layerName, checked);
        //     }
        //   });
        // });
        // debugger
        this.$bus.emit("onLayerViewOrHidden", data.value, checked);
      }
    }
  }
};
</script>
