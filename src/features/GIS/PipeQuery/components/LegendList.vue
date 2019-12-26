<template>
  <!-- 图例控制 -->
  <div class="Map_Action_Bar_Layer_Win">
    <div class="Win_Title">
      <span class="text">图例展示</span>
      <span @click="closeLayer('tuli')" class="icon">
        <i class="iconfont icon-shousuo"></i>
      </span>
    </div>
    <ul class="Tuli_List" v-loading="loading">
      <el-scrollbar>
        <div class="Tuli-Pipe_Item" v-for="item in tuliPipeList" :key="item.name">
          <div class="pipe-name">{{item.layerName}}</div>
          <!-- <img :src="item.url" class="pipe-icon"/>  -->
          <div :style="{'background-image': 'url(' + item.url +')'}" class="pipe-icon"></div>
          <!-- <span class="pipe-icon" :style ="{'background-color':item.html}"></span> -->
        </div>

        <div class="Tuli_List_Item" v-for="item in tuliList" :key="item.name">
          <template v-if=" item.html != 'displayNone' ">
            <span>
              <img :src="item.url" />
            </span>
            <span>{{item.layerName}}</span>
          </template>
        </div>
      </el-scrollbar>
    </ul>
  </div>
</template>
<script>
import _ from "lodash";
import axios from "axios";
import { Legend_Json } from "@common/consts/GisConst/MapConfigure";
export default {
  props: ["searchType"],
  data() {
    return {
      loading: false, //加载中
      tuliList: [], //图例的数据列表
      tuliPipeList: []
    };
  },
  methods: {
    closeLayer(val) {
      this.$emit("closeLayer", val);
    },
    //通过dom的操作取出实例信息
    getTuliList() {
      this.loading = true;
      if (this.tuliList.length || this.tuliPipeList.length) {
        this.loading = false;
        return
      };
      axios.get(Legend_Json).then(response => {
        _.forEach(response.data.layers, item => {
          if (item.legend.length > 1) {
            _.forEach(item.legend, pipeItem => {
              if (pipeItem.imageData && pipeItem.label) {
                pipeItem.url = "data:image/png;base64," + pipeItem.imageData;
                pipeItem.layerName = pipeItem.label + item.layerName;
                let pipeName = pipeItem.label.split("-");
                if (pipeName.length > 1) {
                  pipeName[0] = parseInt(pipeName[0].replace(/[^0-9]/gi, ""));
                  pipeName[1] = parseInt(pipeName[1].replace(/[^0-9]/gi, ""));
                  pipeItem.layerName =
                    pipeName.join("-") + " " + item.layerName;
                }
              }
            });
            if (item.layerName.indexOf("管网") > -1) {
              this.tuliPipeList.push(...item.legend);
            } else {
              this.tuliList.push(...item.legend);
            }
          } else if (item.layerName.indexOf("管网") > -1 ) {
            if (item.legend[0] && item.legend[0].imageData) {
              item.url = "data:image/png;base64," + item.legend[0].imageData;
              let coincidence = 0;
              _.some(this.tuliPipeList, tuli => {
                if (tuli.url === item.url) {
                  coincidence = 1;
                  if (tuli.layerName.length > item.layerName.length) {
                    tuli.layerName = item.layerName;
                  }
                  return true;
                }
              });
              coincidence || this.tuliPipeList.push(item);
            }
          } else {
            if (item.legend[0] && item.legend[0].imageData) {
              item.url = "data:image/png;base64," + item.legend[0].imageData;
              this.tuliList.push(item);
            }
          }
        });
        this.loading = false;
      });
    }
  }
};
</script>
