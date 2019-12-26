import _ from "lodash";


export default {
    namespaced: true,
    state: {
        tollbarStation: false,
        mapEditStation: false,                                                                                                                                                                                                                                                                                               
    },
    mutations: {
        setTollbarStation(state) {
            state.tollbarStation = true
        },
        setEditStation(state) {
            state.mapEditStation = true
        },
    },
    actions: {
        setTollbarStation(contex) {
            contex.commit('setTollbarStation')
        },
        setEditStation(contex) {
            contex.commit('setEditStation')
        },
    }
};