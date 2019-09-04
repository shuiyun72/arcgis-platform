import axios from 'axios'
import config from '@config/config.js'

//地图数据操作
const instance = axios.create({
    // headers: {
    //     'Accept': 'text/xml',
    //     //'Token':`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVc2VySWQiOjEsIlVzZXJOYW1lIjoiYWRtaW4iLCJFeHBpcmVUaW1lIjoiMjAxOS0wNC0xMFQxMDo1MzoxMS4xOTMxMTQ0KzA4OjAwIiwiSVAiOiIifQ.b4Ucd2Rrm83JGajtf-6YC6VaeeUkZ50ojwLxL6m3P2o`
    // },
    baseURL: config.apiPath.insURL,
    crossDomain:true,
    timeout: 30000,
    responseType: 'json',
    // 该函数指定响应数据进行的预处理，return的值会填到response.data
    // transformResponse: function (resXmlData) {
    //     // 将相应数据从xml格式转换为js Object，返回值即为then回调中的res.data
    //     let parser = new window.DOMParser()
    //     let xmlDoc = parser.parseFromString(resXmlData, 'text/xml')
    //     let jsonStr = xmlDoc.getElementsByTagName('string')[0].innerHTML
    //     let parsedResData = JSON.parse(jsonStr)
    //     return parsedResData
    // }
});

// request拦截器
instance.interceptors.request.use(
    config => {
        // 每次发送请求之前检测都vuex存有token,那么都要放在请求头发送给服务器
        if (1) {
          config.headers.Token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVc2VySWQiOjEsIlVzZXJOYW1lIjoiYWRtaW4iLCJFeHBpcmVUaW1lIjoiMjAxOS0wNC0xOFQyMDoxNTo0My4wMjE3NTczKzA4OjAwIiwiSVAiOiIifQ.-GyfviJ1BQUFGH09tBV7-GmxOKImz-hT_jjv7N9MfUQ'
        }
    
        return config
    },
    err => {
    return Promise.reject(err)
    }
)
/**
  地图数据操作
**/

export default {
    //巡检设置
    // 事件内容
    EventContentAll(numValue, pageValue,sortName, orderingValue) {
        sortName = sortName || 'EventTypeName'
        orderingValue = orderingValue || 'asc'
        return instance.get('/api/EventContent/Get', {
            params: {
                sort: String(sortName),
                ordering: String(orderingValue),
                num: Number(numValue),
                page: Number(pageValue),
            }
        })
    },
    //事件内容select下拉数据
    EventContentLoad(){
        return instance.get('/api/EventType/GetCommboboxList')
    },
    //事件内容条件查询
    EventContentSearch( numValue, pageValue,eventTypeId,sortName, orderingValue) {
        sortName = sortName || 'EventTypeName'
        orderingValue = orderingValue || 'asc'
        return instance.get('/api/EventContent/GetByEventTypeId', {
            params: {
                eventTypeId: String(eventTypeId),
                sort: String(sortName),
                ordering: String(orderingValue),
                num: Number(numValue),
                page: Number(pageValue),
            }
        })
    },
    //事件内容添加
    EventContentAdd(EventTypeId,EventTypeName,ExecTime,ParentTypeId){
        return instance.put('/api/EventContent/Post', {
                EventTypeId:Number(EventTypeId), 
                EventTypeName:String(EventTypeName),
                ExecTime:Number(ExecTime),
                ParentTypeId:Number(ParentTypeId)
        })
    },
    //事件内容修改
    //eventTypeId事件分类内容/EventTypeName 事件名称/ExecTime 执行时间/ParentTypeId 上级分类Id/
    EventContentEdit(EventTypeId,EventTypeName,ExecTime,ParentTypeId){
        return instance.put('/api/EventContent/Put', {
            params:{
                eventTypeId:Number(EventTypeId),
            },
            data:{
                EventTypeId:Number(EventTypeId), 
                EventTypeName:String(EventTypeName),
                ExecTime:Number(ExecTime),
                ParentTypeId:Number(ParentTypeId)
            }
        })
    },
    //事件内容删除
    EventContentDel(eventTypeId){
        return instance.delete('/api/EventContent/Delete', {
            params:{
                eventTypeId:Number(eventTypeId),
            }
        })
    },
    //事件类型全部查询
    EventTypeAll(numValue, pageValue,sortName, orderingValue){
        sortName = sortName || 'EventTypeName'
        orderingValue = orderingValue || 'asc'
        return instance.get('/api/EventType/Get', {
            params: {
                sort: String(sortName),
                ordering: String(orderingValue),
                num: Number(numValue),
                page: Number(pageValue),
            }
        })
    },
    //事件类型添加
    EventTypeAdd(EventTypeName,ExecTime){
        return instance.post('/api/EventType/Post' , {
            EventTypeName: String(EventTypeName),
            ExecTime: Number(ExecTime)
        })
    },
    //事件类型修改
    EventTypeEdit(EventTypeName,ExecTime,EventTypeId){
        return instance.put('/api/EventType/Put' , {
            params:{
                eventTypeId: Number(EventTypeId),
            },
            data:{
                EventTypeName: Number(EventTypeName),
                ExecTime: Number(ExecTime),
            }
           
           
        })
    },
    //事件类型删除
    EventTypeDel(eventTypeId){
        return instance.delete('/api/EventType/Delete' , {
            params:{
                eventTypeId: Number(eventTypeId)
            }
        })
    },
    //计划类别下拉框数据
    PlanTypeLoad(){
        return instance.get('/api/PlanType/GetCommboboxList')
    },
    //计划类别查询
    PlanTypeSearch(numValue, pageValue,planTypeId,sortName, orderingValue){
        sortName = sortName || 'PlanTypeId'
        orderingValue = orderingValue || 'asc'
        return instance.get('/api/PlanType/Get' , {
            params: {
                planTypeId:Number(planTypeId),
                sort: String(sortName),
                ordering: String(orderingValue),
                num: Number(numValue),
                page: Number(pageValue),
            }
        })
    },
    //计划类别添加
    PlanTypeAdd(PlanTypeName,ParentTypeId){
        return instance.post('api/PlanType/Post' , {
            PlanTypeName: String(PlanTypeName),
            ParentTypeId: Number(ParentTypeId),
        })
    },
    //计划类别修改
    PlanTypeEdit(PlanTypeName,ParentTypeId,planTypeId){
        return instance.put('/api/PlanType/Put' , {
            planTypeId: Number(planTypeId),
            PlanTypeName: String(PlanTypeName),
            ParentTypeId: Number(ParentTypeId),
        })
    },
    //计划类别删除
    PlanTypeDel(planTypeId){
        return instance.delete('/api/PlanType/Delete' , {
            params:{
                planTypeId: Number(planTypeId)
            }
        })
    },

}