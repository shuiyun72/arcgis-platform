<template>
  <div class="layer-wraper" v-if="htmlString">
    <div class="layer-content">
      <div class="title">{{title}}</div>
      <div v-html="htmlString" class="layer-message"></div>
    </div>
    <div class="sanjiao">
      <span></span>
      <span></span>
    </div>

  </div>
</template>
<script>
import _ from "lodash";
export default {
  data() {
    return {};
  },
  props: ["title", "htmlString"],
  mounted() {},
  created() {},
  methods: {}
};
</script>
<style lang="stylus" scoped>
$bgColor = #fff;
.layer-wraper {
  width: 1px;
  height: 1px;
  position: relative;
  bottom: 20px;
  left: -4px;

  .sanjiao {

    position: relative;

    & span {
      display: block;
      position: absolute;
      left: -10px;
      top: 0;
      content: '';
      width: 0px;
      height: 0px;
      border-width: 16px 12px 0;
      border-style: solid;
      border-color: #fff transparent transparent;
      z-index: 2;
    }

    & span:nth-child(2) {
      left: -11px;
      z-index: 1;
      position: absolute;
      top: 0;
      border-width: 17px 13px 0;
      border-style: solid;
      border-color: #667e86 transparent transparent;
    }
  }

  .layer-content {
    border: 1px solid #667e86;
    background: $bgColor;
    width: 300px;
    position: absolute;
    bottom: 0;
    left: -30px;

    .title {
      line-height: 24px;
      padding: 4px 10px;
      background: #347f8a;
      color: #fff;
    }

    .layer-message {
      color: #000;
      padding: 2px 10px;
    }

    & > div {
      line-height: 30px;
      padding: 0 10px;

      span {
        color: red;
        font-weight: bolder;
      }
    }
  }
}
</style>


