import instance from  './index'
export default {
     // 事件内容
     EventContentAll(numValue, pageValue,sortName, orderingValue) {
        sortName = sortName || 'EventTypeId'
        orderingValue = orderingValue || ' desc'
        return instance.get('/EventContent/Get', {
            params: {
                sort: String(sortName),
                ordering: String(orderingValue),
                num: Number(numValue),
                page: Number(pageValue),
            }
        })
    },
    //事件内容条件查询
    EventContentSearch( numValue, pageValue,eventTypeId,sortName, orderingValue) {
        sortName = sortName || 'EventTypeName'
        orderingValue = orderingValue || 'asc'
        return instance.get('/EventContent/GetByEventTypeId', {
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
    EventContentAdd( ParentTypeId,EventTypeName,ExecTime) {
        return instance.post('/EventContent/Post', {
            ParentTypeId:Number(ParentTypeId),
            EventTypeName:String(EventTypeName),
            ExecTime:Number(ExecTime),
        })
    },
    //事件内容修改
    //eventTypeId事件分类内容/EventTypeName 事件名称/ExecTime 执行时间/ParentTypeId 上级分类Id/
    EventContentEdit(ParentTypeId,EventTypeName,ExecTime,EventTypeId){
        return instance.put('/EventContent/Put?eventTypeId='+Number(EventTypeId), {  
            ParentTypeId:Number(ParentTypeId),
            EventTypeName:String(EventTypeName),
            ExecTime:Number(ExecTime),
        })
    },
    //事件内容删除
    EventContentDel(eventTypeId){
        return instance.delete('/EventContent/Delete', {
            params:{
                eventTypeId:Number(eventTypeId),
            }
        })
    },
}