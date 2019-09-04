import axios from 'axios'
import config from '@config/config.js'
let systemUrl = config.apiPath.systemUrl

export default {
    loginSystem: (query) => {
        return axios({
            url: systemUrl + '/api/System/Login',
            method: 'post',
            params: {
                loginContent: query.loginContent,
                password: query.password,
                systemType: 1,
            }
        })
    },
    loginHDSystem: (query) => {
        return axios({
            url: systemUrl + '/api/System/HDLogin',
            method: 'post',
            params: {
                hdAcc: query.HDACC,
                hdStamp: query.HDSTAMP,
                hdSSOKey: query.HDSSOKEY,
                systemType: 1,
            }
        })
    }

}