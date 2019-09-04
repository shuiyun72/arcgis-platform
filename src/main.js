// import Vue from "vue/dist/vue.min.js";
import Vue from "@vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
//添加全局过滤器
import filters from "./filter/filters";
Object.keys(filters).forEach(key => {  
  Vue.filter(key, filters[key])  
}) 
import VueBus from '@/vue-bus/EventBus';
Vue.use(VueBus);
Vue.config.productionTip = false;

// 引入elementUI组件库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
Vue.use(ElementUI)

//引入tooltip插件
var tooltip = require('tooltip')
let config  = {
  showDelay: 10,
  style: {
    padding: 6,
    'font-size':'12px',
    'z-index': 2500,
    background:'#2f3239',
    color: '#fff',
    'border-radius': '2px',
    border:'none',
    'margin-left': '-15px',
  }
}
tooltip(config)

//引入resize组件
import 'vue-resize/dist/vue-resize.css'
import { ResizeObserver } from 'vue-resize'
Vue.component('resize-observer', ResizeObserver)

import "nprogress/nprogress.css";
import "@common/styles/common/custom-nprogress.styl";
import NProgress from "nprogress";
Vue.prototype.$progress = NProgress;

// import EventBus from "@src/vue-bus/EventBus"
// Vue.prototype.$bus = EventBus;

//引入全局css样式
import "@common/styles"
import './permission'


// 引入自定义指令
import '@util/directives.js';


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");