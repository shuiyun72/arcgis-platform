import instance from  './index'
export default {
    //工作时间段全部查询
    TimeSetAll(numValue, pageValue,sortName, orderingValue){
        sortName = sortName || 'IntervalId'
        orderingValue = orderingValue || 'desc'
        return instance.get('/WorkTimeInterval/Get', {
            params: {
                sort: String(sortName),
                ordering: String(orderingValue),
                num: Number(numValue),
                page: Number(pageValue),
            }
        })
    },
    //工作时间段添加
    TimeSetAdd(StartTime,EndTime,Remarks){
        return instance.post('/WorkTimeInterval/Post' , {
            IntervalId: 0,
            StartTime: StartTime,
            EndTime: EndTime,
            Remarks:String(Remarks)
        })
    },
    //工作时间段修改
    TimeSetEdit(StartTime,EndTime,Remarks,intervalId){
        return instance.put('/WorkTimeInterval/Put?intervalId='+Number(intervalId) , {
            IntervalId: 0,
            StartTime: StartTime,
            EndTime: EndTime,
            Remarks:String(Remarks)
        })
    },
    //工作时间段删除
    TimeSetDel(intervalId){
        return instance.delete('/WorkTimeInterval/Delete' , {
            params:{
                intervalId : Number(intervalId)
            }
        })
    },
}