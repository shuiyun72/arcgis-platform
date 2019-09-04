<template>
  <div class="CommonMap_container" :component="componentName">
    <div :id="mapContainerId"></div>
  </div>
</template>

<script>
import Vue from "@vue";
import BaseMap from "@services/ArcMap/BaseMap";
export default {
  name: "CommonMap",
  mounted() {
  },
  computed: {
    componentName() {
      return this.$options.name;
    },
    mapContainerId() {
      return `${this.$parent.$options.name}_map_container`;
    }
  },
  methods: {
    getEventBus() {
      return this.mapEventBus;
    },
    getLayers() {
    }
  }
};


</script>

