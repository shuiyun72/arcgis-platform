import Vue from "@vue";
import router from "./router"
import store from './store';
import loginSystem from "@api/SystemSetting/loginSystem";
import System from "@api/SystemSetting/System";
import GetGithubOauth from "@api/GetGithubOauth";
import config from '@config/config.js'
import VueRoute from "@router/route";
import { Message, Loading } from 'element-ui';
//引入加密方法
import * as Des from "@util/des.js";

let loading
router.beforeEach((from, to, next) => {
    startLoading()
    singleHdLogin(from, to, next)
    // next()
})
router.afterEach(() => {
    endLoading()
})

function startLoading(option) { //使用Element loading-start 方法 
    let loadOption = Object.assign({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)'
    }, option)
    loading = Loading.service(loadOption)
}
function endLoading() {
    //使用Element loading-close 方法 
    loading.close()
}
function singleHdLogin(to, from, next) {
    let query = to.query
    let iAdminID = localStorage.getItem("iAdminID")
    let UniWaterLoginState = sessionStorage.getItem("UniWaterLoginState")
    if (query.iframe) {
        sessionStorage.setItem("iframe", true);
        store.dispatch('login/iframeState', true)
    } else if (!store.state.login.iframe) {
        if (sessionStorage.getItem("iframe")) {
            store.dispatch('login/iframeState', true)
        }
    }
    if (query.UniWater) {
        sessionStorage.setItem("UniWater", true);
        store.dispatch('login/setState', {
            key: 'UniWater',
            value: true
        })
    } else if (sessionStorage.getItem("UniWater")) {
        store.dispatch('login/setState', {
            key: 'UniWater',
            value: true
        })
    }

    //获取总部的code唯一标识
    if (query.code) {
        if (store.state.login.Uniwatercode) {
            next()
        } else {
            store.dispatch('login/setState', {
                key: 'Uniwatercode',
                value: query.code
            })
            saveUser(query.code, next, to);
        }
        //单点登陆的必要参数
    } else if (query.HDACC && query.HDSTAMP && query.HDSSOKEY) {
        loginSystem.loginHDSystem(query).then(res => {
            if (res.data.ErrorType !== 3) {
                loginError(next, res.data.Msg)
                return
            }
            let Result = res.data.Data.Result
            let UserID = {}
            store.dispatch('login/userStatus', res.data.Data.Result, query)
            let date = new Date()
            date.setDate(date.getDate() + 1)
            UserID.Token = Result.Token
            UserID.cAdminName = Result.cAdminName
            UserID.exprise = date.getTime();
            UserID.iAdminID = Result.iAdminID
            UserID.dExpireDate = Result.dExpireDate
            localStorage.setItem("iAdminID", JSON.stringify(UserID))
            sessionStorage.setItem('store', JSON.stringify(store.state.login))
            if (query.iframe) {
                next({ name: to.name })
            }
            location.replace('/')
        }).catch(err => {
            loginError(next, '请重新登陆')
        })
        //系统登陆页面
    } else if (to.name == 'Login') {
        loading.close()
        next()
        //如果是UniWater系统对接
    } else if (query.UniWater) {
        UniWaterLogin(to, from, next)
        //本系统如果已经暂存了信息,则获取路由
    } else if (UniWaterLoginState) {
        next()
    } else if (iAdminID) {
        iAdminID = JSON.parse(iAdminID)
        let date = new Date()
        let dateTime = date.getTime()
        if (!iAdminID.iAdminID || dateTime > iAdminID.exprise) {
            loginError(next, '登陆已过期，请重新登陆')
        } else {
            date.setDate(date.getDate() + 1)
            iAdminID.exprise = date.getTime()
            localStorage.setItem("iAdminID", JSON.stringify(iAdminID))
            if (!sessionStorage.getItem('store')) {
                System.getUserAuthority(iAdminID.iAdminID).then(res => {
                    store.dispatch('login/userStatus', iAdminID)
                    store.dispatch('login/UserAuthority', res.data.Data.Result)
                    let addRoute = store.getters['login/addRoute']
                    if (!res.data.Data.Result.length) {
                        next({ name: 'NoPermission' })
                        return
                    }
                    if (addRoute[0].children && addRoute[0].children instanceof Array && addRoute[0].children.length) {
                        router.addRoutes(addRoute);
                    } else {
                        next({ name: 'NoPermission' })
                    }
                    sessionStorage.setItem('store', JSON.stringify(store.state.login))
                    loginSuccessSet(next, true, to)
                })
            } else {
                loginSuccessSet(next, false, to)
            }
        }
    } else {
        endLoading()
        loginError(next, '请登陆系统')
        next({ name: 'Login' })
    }
}
//单点和本系统的登陆成功
function loginSuccessSet(next, first, to) {
    if (first) {
        next({ path: to.path })
        return
    }

    let iAdminID = localStorage.getItem("iAdminID")
    if (iAdminID) {
        iAdminID = JSON.parse(iAdminID)
        let allowStamptime = new Date()
        allowStamptime.setDate(allowStamptime.getDate() + 1);
        iAdminID.exprise = allowStamptime.getTime()
        localStorage.setItem("iAdminID", JSON.stringify(iAdminID))
        next()
    } else {
        loginError(next, '请登录系统')
    }
}
//单点和本系统的登陆错误
function loginError(next, message) {
    // location.replace('http://10.1.12.76:8080/user/login.html')
    // return
    localStorage.removeItem("iAdminID")
    endLoading()
    if (message) {
        Message({
            type: 'error',
            message: message,
            duration: 1000,
            showClose: true,
        })
    }
    next({ name: 'Login' })
}


//uniwater登陆
function UniWaterLogin(to, from, next) {
    if (typeof (sessionStorage.uniWaterToken) != "undefined" || store.state.login.uniWaterToken) {
        // token是否过期
        if (isRefreshTokenExpired()) {
            refreshToken();
        } else {
            // 有授权token未登录
            let login = config.apiPath.UniWaterUrl + "/hdl/oauth/v1.0/login?response_type=code&state=test&client_id="
                + config.apiPath[location.pathname].client_id +
                "&redirect_uri=" + location.origin + location.pathname;
            location.replace(login)
        }
    } else {
        // 没有授权token未登录
        refreshToken();
    }

    // 刷新token
    function refreshToken() {
        let pathname = location.pathname
        let client_id = config.apiPath[pathname].client_id
        GetGithubOauth.authorize(client_id, Des.encryptSHA256HD(pathname)).then(res => {
            if (res.data.access_token) {
                refreshTokenSuccess(res.data)
            } else {
                Message({
                    type: 'error',
                    message: res.data.error_description,
                    duration: 1000,
                    showClose: true,
                })
                return
            }
            setInterval(() => {
                // 定时刷新应用授权token
                GetGithubOauth.refreshToken(client_secret).then(res => {
                    if (res.Code === 0) {
                        refreshTokenSuccess(res.data)
                    } else {
                        Message({
                            type: 'error',
                            message: res.Message,
                            duration: 1000,
                            showClose: true,
                        })
                    }
                })
            }, res.data.expires_in - 1000)
            // 登录操作
            let login = config.apiPath.UniWaterUrl + "/hdl/oauth/v1.0/login?response_type=code&state=test&client_id="
                + config.apiPath[location.pathname].client_id +
                "&redirect_uri=" + location.origin + location.pathname;
            location.replace(login)
        })
    }

    //获取token成功
    function refreshTokenSuccess(resultData) {
        let loadTimeStamp = new Date();
        loadTimeStamp = loadTimeStamp.getTime() + resultData.expires_in
        sessionStorage.setItem("loadTimeStamp", loadTimeStamp);//当前时间戳
        sessionStorage.setItem("uniWaterToken", resultData.access_token);
        store.dispatch('login/setState', {
            key: 'UniWaterToken',
            value: resultData.access_token
        })
    }

    // 刷新token的过期时间判断
    function isRefreshTokenExpired() {
        // 这是在登陆时候保存的时间戳
        let oData = sessionStorage.getItem("loadTimeStamp");
        let nDta = new Date().getTime();
        return nDta > oData ? true : false;
    }
}

// 存储用户信息
function saveUser(code, next, to) {
    // 获取用户信息

    let pathname = location.pathname
    let client_id = config.apiPath[pathname].client_id;

    store.dispatch('login/setState', {
        key: 'routeName',
        value: pathname.replace('/', '')
    })
    GetGithubOauth.getUserInfo(Des.encryptSHA256HD(pathname), client_id, location.origin + pathname, code).then(res => {
        let currentUser = res.data.user;
        let UserID = {};
        UserID.iAdminID = currentUser._id;
        UserID.cAdminName = currentUser.name;
        UserID.iDeptID = currentUser.group;
        let access_token = res.data.access_token
        sessionStorage.setItem("UniWaterLoginState", true);
        store.dispatch('login/userStatus', currentUser)
        //获取巡检养护台账等所需的token
        System.CreateAuthention(currentUser).then(res => {
            // 存储访问本地接口token格式
            let token = res.data.Data.Result
            sessionStorage.setItem("userToken", token);
            store.dispatch('login/setState', {
                key: 'userToken',
                value: token
            })
            sessionStorage.setItem('store', JSON.stringify(store.state.login))

            // 设置用户权限
            UnitWaterGetMenu(currentUser, access_token, next, to)
        })
    })
}

// 设置UnitWater用户权限
function UnitWaterGetMenu(currentUser, access_token, next, to) {
    GetGithubOauth.getMenu(currentUser, access_token).then(res => {
        store.dispatch('login/setState', {
            key: 'UniWaterRoute',
            value: res.data.Response
        })
        let addRoutes = store.getters['login/UniWaterRoute']
        router.options.routes = addRoutes
        router.addRoutes(addRoutes);
        next({ path: to.path })
    })

}


Vue.prototype.$startLoading = startLoading;
Vue.prototype.$endLoading = endLoading;
