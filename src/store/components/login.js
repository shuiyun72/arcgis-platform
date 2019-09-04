
import VueRoute from "@router/route";
import _ from "lodash";

let cFunUrl
let iFunOrder
let iFunID
let routeFilter = (array) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].name) {
            let indexName = _.indexOf(cFunUrl, array[i].name)
            if (indexName <= -1) {
                array.splice(i, 1)
                i--
            } else {
                array[i].iFunOrder = iFunOrder[indexName]
                array[i].meta = { iFunID : iFunID[indexName]}
                if (array[i].children) {
                    routeFilter(array[i].children)
                }
            }
        } else if (array[i].children && array[i].children.length) {
            routeFilter(array[i].children)
            if (array[i].children[0]) {
                array[i].iFunOrder || (array[i].iFunOrder = array[i].children[0].iFunOrder)
            }

        }

    }
    routeSort(array)
}
let routeSort = (array) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].children) {
            if (array[i].children.length) {
                array[i].children = routeSort(array[i].children)
                let name = array[i].children[0].name
                if (!name && array[i].children[0].children && array[i].children[0].children.length) {
                    name = array[i].children[0].children[0].name
                }
                !array[i].name && (array[i].redirect = { name: name })
            } else {
                array.splice(i, 1)
                i--
            }

        }
    }
    array = _.orderBy(array, ['iFunOrder']);
    return array
}


export default {
    namespaced: true,
    state: {
        currentUser: '',
        userToken: '',
        cAdminName: '',
        iAdminID: '',
        UserAuthority: [],
                                                                                                                                                                                                                                                                                                              
    },
    getters: {
        addRoute(state) {
            cFunUrl = _.filter(state.UserAuthority, { 'iFunMenuIsShow': true, 'FunctionType': 1 })
            cFunUrl = _.map(state.UserAuthority, 'cFunUrl')
            iFunOrder = _.map(state.UserAuthority, 'iFunOrder')
            iFunID = _.map(state.UserAuthority, 'iFunID')
            routeFilter(VueRoute)
            VueRoute.push({
                path: '*',
                redirect: {
                    name: '404'
                }
            })

            return VueRoute
        },
        btnTree(state) {
            let tree = {}
            _.forEach(state.UserAuthority, item => {
                if (item && item.System_Type == 1 && item.FunctionType == 2 && item.iFunMenuIsShow) {
                    if (tree[item.iFunFatherID]) {
                        tree[item.iFunFatherID].push(item)
                    } else {
                        tree[item.iFunFatherID] = [item]
                    }
                }
            })
            _.forEach(tree, (item, key) => {
                tree[key] = _.orderBy(item, ['iFunOrder']);
            })
            return tree
        },

        routeTree(state) {
            let tree = {}
            _.forEach(state.UserAuthority, item => {
                if (item && item.System_Type == 1 && item.FunctionType == 1 && item.iFunMenuIsShow) {
                    if (tree[item.iFunFatherID]) {
                        tree[item.iFunFatherID].push(item)
                    } else {
                        tree[item.iFunFatherID] = [item]
                    }
                }
            })
            _.forEach(tree, (item, key) => {
                tree[key] = _.orderBy(item, ['iFunOrder']);
            })
            return tree
        },


        MenusTreeData(state, getters) {
            let top = getters.routeTree[0]
            let menu = {}
            _.forEach(top, item => {
                if (getters.routeTree[item.iFunID]) {
                    menu[item.cFunUrl] = getters.routeTree[item.iFunID]
                    _.forEach(menu[item.cFunUrl], clumn => {
                        if (getters.routeTree[clumn.iFunID]) {
                            clumn.children = getters.routeTree[clumn.iFunID]
                        }
                    })
                }
            })
            return menu
        }
    },
    mutations: {
        UserAuthority(state, UserAuthority) {
            state.UserAuthority = UserAuthority
        },
        userStatus(state, currentUser) {
            if (currentUser) {
                state.cAdminName = currentUser.cAdminName
                state.userToken = currentUser.Token ? currentUser.Token  : currentUser.userToken
                state.iAdminID = currentUser.iAdminID
                state.UserAuthority = currentUser.UserAuthority
                state.currentUser = true
            } else {
                state.currentUser =false
                state.cAdminName = ''
                state.userToken = ''
                state.iAdminID = ''
                state.UserAuthority = []
            }
        },
    },
    actions: {
        userStatus(contex, currentUser) {
            contex.commit('userStatus', currentUser)
        },
        UserAuthority(contex, UserAuthority) {
            contex.commit('UserAuthority', UserAuthority)
        },

    }
};