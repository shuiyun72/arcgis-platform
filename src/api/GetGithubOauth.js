import axios from 'axios'
import { Message } from 'element-ui';
import config from '@config/config.js'
import store from '@store'
let UniWaterUrl = config.apiPath.UniWaterUrl 
//地图数据操作
const instance = axios.create({
    baseURL: UniWaterUrl,
    //解决跨域
    crossDomain: true,
    timeout: 30000,
    //转换res为json
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json'
    },
    transformRequest: [function (data) {
        data = JSON.stringify(data)
        return data
    }],
});


instance.interceptors.response.use(
    response => {  //成功请求到数据
        // //这里根据后端提供的数据进行对应的处理
        if (response.status === 200) {
            return response;
        } else {
            Message({  //常规错误处理
                type: "error",
                message: response.statusText,
                showClose: true,
                duration: 1000,
            });
            return Promise.reject(response)
        }
    },
    error => {  //响应错误处理
        console.log(error);
        Message({
            type: "warn",
            message: '网络异常，请重试',
            showClose: true
        });

        return Promise.reject(error)
    }
);




export default {
    // 授权登录
    authorize(client_id, client_secret) {
        return instance({
            method: 'post',
            url: "/hdl/oauth/v1.0/access.json",
            data: {
                "grant_type": "client_credentials",
                "client_id": client_id,
                "client_secret": client_secret
            }
        })
    },


    // 刷新token
    refreshToken(client_secret, refresh_token) {
        return instance({
            method: 'post',
            url: "/hdl/oauth/v1.0/access.json",
            data: {
                "grant_type": "refresh_token",
                "client_id": client_id,
                "client_secret": client_secret,
                "refresh_token": refresh_token
            }
        })
    },
    // 获取code
    getCode() {
        return instance.post('/UniWaterRequest/AccessLogin?url=' + UniWaterUrl + '/hdl/oauth/v1.0/login')
    },
    // 获取access_token
    getUserInfo(client_secret, client_id, redirect_uri, code) {
        return instance({
            method: 'post',
            url: "/hdl/oauth/v1.0/access.json",
            data: {
                "grant_type": "authorization_code",
                "client_id": client_id,
                "client_secret": client_secret,
                "code": code,
                redirect_uri: redirect_uri
            }
        })
    },
    //菜单树（用户权限）
    getMenu(currentUser ,access_token) {
        return instance({
            method: 'post',
            url: "/hdl/uniwater/v1.0/menu/tree.json",
            data: {
                "access_token": access_token,
                "userid":currentUser._id,
                "uid":currentUser._id
            }
        })
    },
}