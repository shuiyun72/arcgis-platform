<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>
<script>
import store from "./store";
import router from "./router";
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  created() {
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
      let sessionStoreValue = JSON.parse(sessionStorage.getItem("store"));

      if (
        sessionStoreValue.UserAuthority &&
        sessionStoreValue.UserAuthority.length
      ) {
        store.dispatch("login/userStatus", sessionStoreValue);
        router.addRoutes(store.getters["login/addRoute"]);
      } else if (
        sessionStoreValue.UniWaterRoute &&
        sessionStoreValue.UniWaterRoute.length
      ) {
        store.dispatch("login/userStatus", sessionStoreValue);
        router.addRoutes(store.getters["login/UniWaterRoute"]);
      }
    }

    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", function(e) {
      if (store.state.login.UniWaterRoute || store.state.login.UserAuthority) {
        sessionStorage.setItem("store", JSON.stringify(store.state.login));
      } else {
        sessionStorage.setItem("store", false);
      }
    });
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    }
  }
};
</script>

<style lang="stylus">
#app {
  font-family: '黑体', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
}

* {
  padding: 0;
  margin: 0;
}
</style>