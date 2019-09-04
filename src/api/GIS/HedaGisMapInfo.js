import axios from "axios";
import utilData from "@util/utilData"
/**
 * type: 事件类型，可选bg\ld\yh
 */
export default {
    //事件发生类型接口数据处理
    HeDaPipeEventInfo(){
        return new Promise((resolve , reject) => {
            this.HeDaPipeEventApi().then( res => {
                let typeInfo = {
                    ld: {
                        name: '漏点',
                        icon:'dingwei.png'
                    },
                    bg: {
                        name: '爆管',
                        icon:'dingweiend.png'
                    },
                    yh: {
                        name: '隐患',
                        icon:'dingweistart.png'
                    },
                }
                let resData = res.data.Response.datas
                _.forEach(resData, item => {
                    item.typeName = typeInfo[item.type].name
                    item.mapIcon = typeInfo[item.type].icon
                    item.picture = 'http://114.215.126.11:5009' + item.picture
                    item.created = utilData.myformatStr(utilData.getCurrentDate(item.created))
                    item.changed = utilData.myformatStr(utilData.getCurrentDate(item.changed))
                    item.submittime = utilData.myformatStr(utilData.getCurrentDate(item.submittime))
                    item.time = utilData.myformatStr(utilData.getCurrentDate(item.time))
                })
                resolve(resData)
            }).catch(error => {
                reject(error)
            })
        })
       
    },
    //事件发生类型接口
    HeDaPipeEventApi() {
        return axios.post('http://114.215.126.11:5009/hebi/pipeEvent/query.json')     
    },
    //和达系统登陆获取token
    HeDaAuth() {
        return axios.post('http://111.75.54.230:8086/hd/user/auth.json', JSON.stringify({
            "Cid": "5c22e3deebd9df077c613965",
            "UserName": "admin",
            "Password": "Admin123",
            "Aid": "dyhjk"
        }))
    },
    //站点类型接口
    HeDaStationList(Token, Size) {
        return axios.post('http://111.75.54.230:8086/hd/station/list.json', JSON.stringify({
            'Token': Token,
            'Size': Size
        }))
    },
    //站点类型接口数据处理
    HeDaWebSite(){
        return new Promise((resolve, reject) =>{
            this.HeDaAuth().then(res => {
                this.HeDaStationList(res.data.Response.Token).then(all => {
                    this.HeDaStationList(res.data.Response.Token, all.data.Response.Total).then(list => {
                        _.forEach(list.data.Response.Data, item => {
                            let Sensors = _.map(item.Sensors, Sensor => {
                                return Sensor.Name + ':' + Sensor.Value
                            })
                            item.HdLng = item.Station.Position.Lng
                            item.HdLat = item.Station.Position.Lat
                            item.value = Sensors.join("<br/>")
                        })
                        resolve(list.data.Response.Data)
                     })
                })
            }).catch( error=>{
                reject(error)
            })
        })
    }

}