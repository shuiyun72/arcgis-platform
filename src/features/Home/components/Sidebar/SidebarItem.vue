<template>
  <div v-if="item">
    <template v-if="!item.children ||  (item.children && !item.children.length) ">
      <router-link :to="{name : item.cFunUrl }" :key="item.cFunUrl" active-class="active-route">
        <el-menu-item
          :index="item.cFunUrl"
          :data-tooltip="item.cFunName "
          data-tooltip-positions="right"
          @click.native="routeClick(item)"
          v-if="!isCollapse"
        >
          <i class="iconfont" :class="item.cFunIcon"></i>
        </el-menu-item>
        <el-menu-item :index="item.cFunUrl" v-else>
          <i class="iconfont" :class="item.cFunIcon"></i>
          <span class="title">{{item.cFunName}}</span>
        </el-menu-item>
      </router-link>
    </template>

    <el-submenu
      v-else
      :index="item.cFunUrl"
      :key="item.cFunUrl"
      :class="{'active-route': leftMenuDataIndex(item.children)}"
    >
      <template slot="title">
        <i class="iconfont" :class="item.cFunIcon"></i>
        <span class="title">{{item.cFunName}}</span>
      </template>
      <template v-for="child in item.children">
        <sidebar-item v-if="child.children && child.children instanceof Array && child.children.length" :item="child" :key="child.cFunUrl" />
        <router-link
          v-else
          :to="{name:child.cFunUrl}"
          :key="child.cFunUrl"
          active-class="active-route"
          @click.native="routeClick(child)"
        >
          <el-menu-item :index="child.cFunUrl">{{child.cFunName}}</el-menu-item>
        </router-link>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SidebarItem",
  inject: ["reload"],
  props: ["isCollapse", "item", "leftMenuData"],
  data() {
    return {
      olderRoute: "" //
    };
  },
  created() {
    this.olderRoute = this.$route.name;
  },
  computed: {
    ...mapState("login", [
      "iframe",
      "cAdminName",
      "iIsAllowChangePWD",
      "UniWater"
    ])
  },
  methods: {
    leftMenuDataIndex(list) {
      return _.findIndex(list, { cFunUrl: this.leftMenuData }) >= 0;
    },
    routeClick(item) {
      if (this.olderRoute === item.cFunUrl) {
        this.reload();
      } else {
        this.olderRoute = item.cFunUrl;
      }
    }
  }
};
</script>
