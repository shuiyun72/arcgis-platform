<template>
  <el-container style="width:100%;height:100%">
    <!-- fullScreen是全屏, horizontal是左右水平布局 -->
    <router-view class="leftContain"></router-view>
    <el-main style="padding:0px;" class="mapWraperWidthResize" ref="mapWraperWidthResize">
      <keep-alive>
        <router-view name="HomeMap"></router-view>
      </keep-alive>
      <keep-alive>
        <router-view name="OpenLMap"></router-view>
      </keep-alive>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>

