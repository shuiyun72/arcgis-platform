import Vue from "@vue";
// import Vue from "@vue";
// import Vue from "vue/dist/vue.min.js";
import Router from "vue-router";
import HomeDataMain from "@features/Home/HomeDataMain.vue";
import store from '../store';
Vue.use(Router);
store.dispatch('system/setState', {
  name: 'hashMode',
  value: true
})
export default new Router({
  //mode: 'history',
  routes: [
    {
      path: "/login",
      name: "Login",
      component: (res) => require(['@features/Login'], res),
      meta: {}
    },
    {
      path: "/ChangePassword",
      name: "ChangePassword",
      component: (res) => require(['@features/ChangePassword'], res),
      meta: {}
    },
    {
      path: "/home",
      name: "home",
      component: (res) => require(['@features/Home'], res),
      meta: {}
    },
    {
      path: "/404",
      name: '404',
      component: (res) => require(['@features/NoFind'], res),
    },
    // {
    //   path: "*",
    //   redirect: {
    //     name:'Login'
    //   }
    // }
  ]
});