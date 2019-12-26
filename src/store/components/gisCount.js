import _ from "lodash";


export default {
    namespaced: true,
    state: {
        pipeCountNumber: 0,//管网统计
        pipeLengthNumber: 0, //管网长度
        FireCountNumber: 0,//消防栓总量
        ValveCountNumber: 0,//阀门总量      
        caliberAllLength: [],//管网阀门列表    
        materialScienceAll: [],//  管网长度列表                                                                                                                                                                                                                                                                                     
    },
    mutations: {
        setState(state, obj) {
            state[obj.eName] = obj.number
        },
    },
    actions: {
        setState(contex, obj) {
            contex.commit('setState', obj)
        },

    }
};