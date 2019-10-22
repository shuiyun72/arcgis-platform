import Vue from "@vue";
import Vuex from "vuex";
import login from "./components/login";
import system from "./components/system";
import mapStation from "./components/mapStation"
import gisCount from './components/gisCount'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    PipeStaitcsData: [],
  },
  modules:{
    login,
    system,
    mapStation,
    gisCount
  }
});