import axios from 'axios'
import config from '@config/config.js'
import { Message } from 'element-ui';
import store from '@store'
let gisURL = config.apiPath.gisURL
//地图数据操作
const instance = axios.create({
    baseURL: gisURL  +'/api',
    timeout: 30000,
    crossDomain: true,
    responseType: 'json',
    // // 该函数指定响应数据进行的预处理，return的值会填到response.data
    // transformResponse: function (resXmlData) {
    //     // 将相应数据从xml格式转换为js Object，返回值即为then回调中的res.data
    //     let parser = new window.DOMParser()
    //     let xmlDoc = parser.parseFromString(resXmlData, 'text/xml')
    //     let jsonStr = xmlDoc.getElementsByTagName('string')[0].innerHTML
    //     let parsedResData = JSON.parse(jsonStr)
    //     return parsedResData
    // }
    // 该函数指定响应数据进行的预处理，return的值会填到response.data
    transformResponse: function (resJsonData) {
        if (typeof (resJsonData) === "object") {
            return resJsonData
        } else {
            return JSON.parse(resJsonData);
        }
        // return JSON.parse(resJsonData.replace(/\\/g, '').slice(1, -1))
    }
});


// request拦截器
instance.interceptors.request.use(
    config => {
        // 每次发送请求之前检测都vuex存有token,那么都要放在请求头发送给服务器
        let iAdminID = localStorage.getItem('iAdminID')
        if(store.state.login.userToken){
             config.headers.Token = store.state.login.userToken
        }else if(iAdminID ){ 
            config.headers.Token = JSON.parse(iAdminID).Token
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)
export default instance