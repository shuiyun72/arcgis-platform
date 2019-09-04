import instance from  './index'
export default {
    taskCount(startTime,endTime){
        return instance.get('/TaskManage/GetCount', {
            params: {
                startTime: startTime,
                endTime: endTime
            }
        })
    }
}