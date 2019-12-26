<template>
  <div class="statistics-card">
    <hr class="title-line" />
    <el-row class="header">
      <span v-show="loadingState">{{statisticsCardData.title}}</span>
    </el-row>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatisticsCard",
  props: ["statisticsCardData", "loadingState"],
  mounted() {},
  data() {
    return {};
  }
};
</script>