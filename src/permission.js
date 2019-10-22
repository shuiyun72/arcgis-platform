import Vue from "@vue";
import router from "./router"
import store from './store';
import loginSystem from "@api/SystemSetting/loginSystem";
import System from "@api/SystemSetting/System";
import VueRoute from "@router/route";
import { Message, Loading } from 'element-ui';
//引入加密方法
import * as Des from "@util/des.js";
//引入cookei方法
import Cookies from 'js-cookie'



let loading
router.beforeEach((from, to, next) => {
    startLoading()
    singleHdLogin(from, to, next)
    // next()
})
router.afterEach(() => {
    endLoading()
})

let loginUrl = '/login'
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
    if (query.iframe) {
        sessionStorage.setItem("iframe", true);
        store.dispatch('login/iframeState',query.iframe)
    } else if(!store.state.login.iframe){
        if (sessionStorage.getItem("iframe")) {
            store.dispatch('login/iframeState',true)
        }
    }
    

    if (query.HDACC && query.HDSTAMP && query.HDSSOKEY) {
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
            if(query.iframe){
                next({name:to.name})
            }
            location.replace('/')
            // router.addRoutes(store.getters['login/addRoute']);
            // loginSuccessSet(next, true)
        }).catch(err => {
            loginError(next)
        })
    } else if (to.name == 'Login') {
        loading.close()
        next()
    } else if (!iAdminID) {
        endLoading()
        next({ name: 'Login' })
    } else {
        iAdminID = JSON.parse(iAdminID)
        let date = new Date()
        let dateTime = date.getTime()
        if (dateTime > iAdminID.dExpireDate || !iAdminID.iAdminID || dateTime > iAdminID.exprise) {
            loginError(next)
        } else {
            date.setDate(date.getDate() + 1)
            iAdminID.exprise = date.getTime()
            localStorage.setItem("iAdminID", JSON.stringify(iAdminID))
            if (!sessionStorage.getItem('store')) {
                System.getUserAuthority(iAdminID.iAdminID).then(res => {
                    store.dispatch('login/userStatus', iAdminID)
                    store.dispatch('login/UserAuthority', res.data.Data.Result)
                    router.addRoutes(store.getters['login/addRoute']);
                    sessionStorage.setItem('store', JSON.stringify(store.state.login))
                    loginSuccessSet(next, true, to)
                })
            } else {
                loginSuccessSet(next)
            }
        }
    }
}
function loginSuccessSet(next, first, to) {
    if (first) {
        next({ path: to.path })
    }

    let allowStamptime = new Date()
    allowStamptime.setMinutes(allowStamptime.getMinutes() + 5)
    let allowStamptimeDes = allowStamptime.getTime()
    Cookies.set('allowStamp', allowStamptimeDes, { expires: allowStamptime })
    next()
}

function loginError(next, Message) {
    localStorage.removeItem("iAdminID")
    // let loginUrl = 'http://www.baidu.com'
    // let loginUrl = 'http://114.215.126.11:5009/user/login.html?reload#/static/spread/index.html?sys=gtwenty&other=true&hebi=true'
    endLoading()
    Cookies.remove('allowStamp')
    if (Message) {
        alert(Message)
    } else {
        alert('登陆已过期，请重新登陆')
    }
    next({ name: 'Login' })
    // location.href = '/'
}

Vue.prototype.$startLoading = startLoading;
Vue.prototype.$endLoading = endLoading;
