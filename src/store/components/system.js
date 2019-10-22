import _ from "lodash";


export default {
    namespaced: true,
    state: {
        departAllList: [],
        departList: [], 
        roleList: [],
        userList: [], 
        modular: [],
        hashMode: false, //是否是哈希路由                                                                                                                                                                                                                                                                                              
    },
    mutations: {
        setDeptList(state, obj) {
            state.departAllList = obj.departAllList
            state.departList = obj.departList
        },
        setDeptListFnc(state, departList) {
            state.departList = departList[0].children
            let departAllList = _.cloneDeep(departList[0].children);
            departAllList.unshift({
              cDepName: "全部",
              iDeptID: ""
            });
            state.departAllList = departAllList
        },
        setState(state, obj) {
            state[obj.name] = obj.value
            console.log(state[obj.name])
        },
    },
    actions: {
        SetDeptList(contex, obj) {
            contex.commit('setDeptList',obj)
        },
        SetDeptListFnc(contex, departList) {
            contex.commit('setDeptListFnc', departList)
        },
        setState(contex, obj) {
            contex.commit('setState',obj)
        },

    }
};