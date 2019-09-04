import matance from  '../Inspection'

export default {
    //事件状态列表
    GetStatusForMantain(startTime,endTime){
        return matance.get('/EventStatus/GetStatusForMantain',{
            params:{
                startTime:startTime,
                endTime:endTime
            }
        })
    },
    //事件来源
    GetEventFrom(startTime,endTime){
        return matance.get('/EventFrom/GetEventFrom',{
            params:{
                startTime:startTime,
                endTime:endTime
            }
        })
    }
}