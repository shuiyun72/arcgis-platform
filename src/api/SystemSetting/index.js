import axios from 'axios'
import config from '@config/config.js'
import { Message } from 'element-ui';
import store from '@store'
let systemUrl = config.apiPath.insURL
const instance = axios.create({
    baseURL: systemUrl +'/api',
    timeout: 30000,
    crossDomain: true,
    responseType: 'json',
});

// request拦截器
instance.interceptors.request.use(
    config => {
        // 每次发送请求之前检测都vuex存有token,那么都要放在请求头发送给服务器
        
        let iAdminID = localStorage.getItem('iAdminID')
        let Token = store.getters['login/userToken']
        if(Token){
             config.headers.Token = Token
        }else if(iAdminID ){ 
            config.headers.Token = JSON.parse(iAdminID).Token
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)


instance.interceptors.response.use(
    response => {  //成功请求到数据
        // //这里根据后端提供的数据进行对应的处理
        if (response.data.ErrorType === 3) {
            return response;
        } else {
            Message({  //常规错误处理
                type: "error",
                message: response.data.Msg,
                showClose: true
            });
            return Promise.reject(response)
        }
    },
    error => {  //响应错误处理
        console.log(error);
        console.log(JSON.stringify(error));
        Message({
            type: "warn",
            message: '网络异常，请重试',
            showClose: true
        });

        return Promise.reject(error)
    }
);
export default instance