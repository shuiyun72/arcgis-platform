<template>
    <router-view style="height:100%"></router-view>
</template>
<script>
import _ from "lodash";
export default {
  methods: {
  },
  beforeDestroy() {
    this.$bus.emit("removeInteractions");
    this.$bus.emit("CloseModifyInteraction");
    this.$bus.emit("OffPointermoveControl");
  },
};
</script>

