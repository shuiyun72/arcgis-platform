
import VueRoute from "@router/route";
import _ from "lodash";

let cFunUrl
let iFunOrder
let iFunID
let routeName = []
let UniwaterMenu = {} //uniwater路由
let UniwaterTree = {} //uniwater路由
let routeFilter = (array) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].name) {
            let indexName = _.indexOf(cFunUrl, array[i].name)
            if (indexName <= -1) {
                array[i].redirect = { name: 'NoPermission' }
                array[i].hidden = true
                if (array[i].children && array[i].children.length) {
                    routeFilter(array[i].children)
                }
                // i--
            } else {
                routeName.push(array[i].name)
                array[i].iFunOrder = iFunOrder[indexName]
                array[i].meta = { iFunID: iFunID[indexName] }
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
                let name = ''
                _.some(array[i].children, item => {
                    if (item.hidden) {
                        return false
                    } else {
                        name = item.name
                        if (!name && item.children && item.children.length) {
                            _.some(item.children, child => {
                                if (child.hidden) {
                                    return false
                                } else {
                                    name = child.name
                                    return true
                                }
                            })
                        }
                        return true
                    }
                })
                !array[i].name && name && (array[i].redirect = { name: name })
            } else {
                array.splice(i, 1)
                i--
            }

        }
    }
    array = _.orderBy(array, ['iFunOrder']);
    return array
}

//递归循环
let treeCircle = (menu, getters) => {
    _.forEach(menu, clumn => {
        if (getters.routeTree[clumn.iFunID]) {
            clumn.children = getters.routeTree[clumn.iFunID]
            treeCircle(clumn.children, getters)
        } else {
            return
        }
    })
}


//递归循环
let UniwaterMenuCircle = (TreeMenu, getters) => {
    let filterData = _.filter(TreeMenu.children, child => {
        if (child.children && child.children instanceof Array && child.children.length) {
            let childMenu = UniwaterMenuCircle(child)
            if (childMenu.length) {
                child.children = childMenu
            } else {
                delete child.children
            }
        }
        if (child.type !== 'page') {
            if (UniwaterTree[TreeMenu.value]) {
                UniwaterTree[TreeMenu.value].push(child)
            } else {
                UniwaterTree[TreeMenu.value] = [child]
            }
            return false
        } else {
            return UniwaterMenu[child.cFunUrl] ? true : false
        }

    })
    return filterData
}

//UniWater路由
let UniWaterRouteFilter = (Route, menu) => {
    if (menu && menu instanceof Array && menu.length) {
        _.forEach(menu, menuItem => {
            menuItem.cFunName = menuItem.name
            menuItem.cFunIcon = menuItem.icon
            menuItem.cFunUrl = menuItem.value || menuItem.code
        })
        let name = _.map(menu, item => {
            return item.cFunUrl
        })
        if (Route.children && Route.children instanceof Array && Route.children.length) {
            let len = Route.children.length
            for (let i = 0; i < len; i++) {
                let route = Route.children[i]
                let num = -1
                let menuItem = {}
                if (route.name) {
                    let title = route.name
                    num = _.indexOf(name, title)
                    if (num >= 0) {
                        menuItem = _.filter(menu, item => {
                            if (item.type === "page") {
                                return item.cFunUrl === title
                            }
                        })[0]
                        UniwaterMenu[menuItem.cFunUrl] = menuItem
                        UniWaterRouteFilter(Route.children[i], menuItem.children)
                    }
                }

                if (num < 0 && route.children && route.children instanceof Array && route.children[0].name) {
                    let title = route.children[0].name
                    num = _.indexOf(name, title)
                    if (num >= 0) {
                        menuItem = _.filter(menu, item => {
                            // if (item.type === "page") {
                            return item.cFunUrl === title
                            // }
                        })[0]
                        UniwaterMenu[menuItem.cFunUrl] = menuItem
                        UniWaterRouteFilter(Route.children[i].children[0], menuItem.children)
                    }
                }
                if (num < 0) {
                    Route.children[i].redirect = { name: 'NoPermission' }
                    if (Route.children[i].children && Route.children[i].children.length) {
                        UniWaterRouteFilter(Route.children[i].children, menu)
                    }
                }
            }
        }
    }
}


export default {
    namespaced: true,
    state: {
        currentUser: '',
        userToken: '',//token
        cAdminName: '',//用户名称
        iAdminID: '',//用户id
        UserAuthority: [],//用户权限
        iframe: false,//是否是全屏
        iIsAllowChangePWD: 1,//是否允许修改密码
        UniWater: false,//是否是uniwater登陆
        UniWaterToken: '',//应用授权token
        UniWaterRoute: [],
        Uniwatercode: '',//获取用户信息所需的code
        routeName: 'GIS',//所处的分类

    },
    getters: {
        //uniwater添加路由
        Uniwatercode(state) {
            return state.UniWaterRoute && state.UniWaterRoute.length
        },

        userToken(state) {
            return state.userToken
        },
        UniWaterRoute(state) {
            let vueRoute = _.cloneDeep(VueRoute)
            // if (state.UniWaterRoute.children) {
            UniWaterRouteFilter(vueRoute[0], state.UniWaterRoute)
            // } 
            // else {
            // UniWaterRouteFilter(vueRoute[0], [{
            //     code: state.routeName,
            //     children: state.UniWaterRoute
            // }])
            // }

            vueRoute.push({
                path: '*',
                redirect: {
                    name: '404'
                }
            })

            return vueRoute
        },
        //添加路由
        addRoute(state) {
            cFunUrl = _.filter(state.UserAuthority, { 'iFunMenuIsShow': true, 'FunctionType': 1 })
            cFunUrl = _.map(state.UserAuthority, 'cFunUrl')
            iFunOrder = _.map(state.UserAuthority, 'iFunOrder')
            iFunID = _.map(state.UserAuthority, 'iFunID')
            let vueRoute = _.cloneDeep(VueRoute)
            routeFilter(vueRoute)
            vueRoute.push({
                path: '*',
                redirect: {
                    name: '404'
                }
            })

            return vueRoute
        },
        //按钮权限
        btnTree(state) {
            if (state.UniWater) {
                return UniwaterTree
            }
            let tree = {}
            _.forEach(state.UserAuthority, item => {
                if (item && item.System_Type == 1 && item.FunctionType == 2 && item.iFunMenuIsShow) {
                    _.some(state.UserAuthority, father => {
                        if (item.iFunFatherID === father.iFunID) {
                            if (tree[father.cFunUrl]) {
                                tree[father.cFunUrl].push(item)
                            } else {
                                tree[father.cFunUrl] = [item]
                            }

                            return true
                        }
                    })
                }
            })
            _.forEach(tree, (item, key) => {
                tree[key] = _.orderBy(item, ['iFunOrder']);
            })
            return tree
        },
        //左侧菜单tree
        routeTree(state) {
            if (state.UniWater) {
                _.forEach(UniwaterTree, item => {
                    item = UniwaterMenuCircle(item)
                })
                return UniwaterTree

            } else {
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
                    for (let i = 0; i < tree[key].length; i++) {
                        if (_.indexOf(routeName, tree[key][i].cFunUrl) < 0) {
                            tree[key].splice(i, 1)
                            i--
                        }
                    }
                    if (!tree[key].length) {
                        delete tree[key]
                    }
                })
                return tree
            }
        },
        //顶部菜单tree
        MenusTreeData(state, getters) {
            let top = getters.routeTree[0]
            let menu = {}
            if (state.UniWater) {
                _.forEach(UniwaterMenu, item => {
                    item.children = UniwaterMenuCircle(item)
                })
                return UniwaterMenu
            } else {
                _.forEach(top, item => {
                    if (getters.routeTree[item.iFunID]) {
                        menu[item.cFunUrl] = getters.routeTree[item.iFunID]
                        treeCircle(menu[item.cFunUrl], getters)
                    }
                })
            }
            return menu
        }
    },
    mutations: {
        UserAuthority(state, UserAuthority) {
            state.UserAuthority = UserAuthority
        },
        iframeState(state, iframe) {
            state.iframe = iframe
        },
        userStatus(state, currentUser) {
            if (currentUser) {
                state.cAdminName = currentUser.cAdminName
                state.userToken = currentUser.Token ? currentUser.Token : currentUser.userToken
                state.iAdminID = currentUser.iAdminID
                state.UserAuthority = currentUser.UserAuthority
                state.UniWater = currentUser.UniWater
                state.UniWaterToken = currentUser.UniWaterToken
                state.UniWaterRoute = currentUser.UniWaterRoute
                state.Uniwatercode = currentUser.Uniwatercode
            } else {
                state.cAdminName = ''
                state.userToken = ''
                state.iAdminID = ''
                state.UserAuthority = []
                state.iIsAllowChangePWD = 0;
                state.UniWater = false
                state.UniWaterToken = ''
                state.UniWaterRoute = []
                state.Uniwatercode = ''
            }
        },
        setState(state, obj) {
            state[obj.key] = obj.value
        },
    },
    actions: {
        userStatus(contex, currentUser, query) {
            contex.commit('userStatus', currentUser, query)
        },
        UserAuthority(contex, UserAuthority) {
            contex.commit('UserAuthority', UserAuthority)
        },
        iframeState(contex, iframe) {
            contex.commit('iframeState', iframe)
        },
        setState(contex, obj) {
            contex.commit('setState', obj)
        },

    }
};