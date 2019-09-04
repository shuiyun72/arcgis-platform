<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import store from "./store";
import router from "./router";
export default {
  name: 'App',
  created() {
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('store') && JSON.parse(sessionStorage.getItem('store')).UserAuthority) {
      store.dispatch('login/userStatus', JSON.parse(sessionStorage.getItem('store')) )
      router.addRoutes(store.getters['login/addRoute']);
    }
     
    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload',function(e){
      if(store.state.login.UserAuthority){
        sessionStorage.setItem('store', JSON.stringify(store.state.login))
      }else{
        sessionStorage.clear()
      }
      
    })
  }
}
</script>

<style lang="stylus">
#app {
  font-family: AdobeHeitiStd-Regular,'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
}

*{
  padding:0;
  margin:0;
}
</style>