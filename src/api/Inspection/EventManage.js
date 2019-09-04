import instance from  './index'
export default {
    //事件类型全部查询
    EventManageAll(numValue,pageValue,startTime, endTime,eventType, eventStatus,searchCondition,sortName,orderingValue){
        sortName = sortName || 'EventID'
        orderingValue = orderingValue || 'asc'
        return instance.get('/EventManage/Get', {
            params: {
                startTime: startTime,
                endTime: endTime,
                eventType: eventType,
                eventStatus: eventStatus,
                searchCondition:String(searchCondition),
                sort: String(sortName),
                ordering: String(orderingValue),
                num: Number(numValue),
                page: Number(pageValue),
            }
        })
    },
    //事件类型删除
    EventManageDel(eventId){
        return instance.delete('/EventManage/Delete' , {
            params:{
                eventId: Number(eventId)
            }
        })
    },
    EventManageCount(startTime,endTime){
        return instance.get('/EventManage/GetCount', {
            params: {
                startTime: startTime,
                endTime: endTime
            }
        })
    },

}