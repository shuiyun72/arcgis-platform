import instance from  './index'
export default {
    //事件状态select下拉数据
    EventStateLoad(){
        return instance.get('/EventStatus/GetStatusForInspection')
    },
    //事件类型全部查询
    EventTypeAll(numValue, pageValue,sortName, orderingValue){
        sortName = sortName || 'EventTypeName'
        orderingValue = orderingValue || 'asc'
        return instance.get('/EventType/Get', {
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
        return instance.get('/EventType/GetCommboboxList')
    },
    //事件类型添加
    EventTypeAdd(EventTypeName,ExecTime){
        return instance.post('/EventType/Post' , {
            EventTypeName: String(EventTypeName),
            ExecTime: Number(ExecTime)
        })
    },
    //事件类型修改
    EventTypeEdit(EventTypeName,ExecTime,EventTypeId){
        return instance.put('/EventType/Put?eventTypeId='+Number(EventTypeId) , {
            EventTypeName: EventTypeName,
            ExecTime: Number(ExecTime),
        })
    },
    //事件类型删除
    EventTypeDel(eventTypeId){
        return instance.delete('/EventType/Delete' , {
            params:{
                eventTypeId: Number(eventTypeId)
            }
        })
    },
}