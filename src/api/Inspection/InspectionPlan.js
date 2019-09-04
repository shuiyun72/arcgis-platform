import instance from  './index'
export default {
    PatrolTaskSearch(isAssigned,serachCondition,isNomalPlan,iAdminID,startTime,endTime,sort,ordering,num,page){
        return instance.get('/InspectionPlan/TaskManage/GetPlanManageInfo', {
            params: {
                isAssigned: isAssigned,
                serachCondition: serachCondition,
                isNomalPlan: isNomalPlan,
                iAdminID: iAdminID,
                startTime: startTime,
                endTime: endTime,
                sort: sort,
                ordering: ordering,
                num: Number(num),
                page: Number(page),
            }
        })
    },
    //分派任务
    PatrolTaskAssign(taskIds) {
        return instance.post('/InspectionPlan/TaskManage/AssignTask?taskIds='+taskIds)
    },
     //删除任务
    PatrolTaskDel(taskIds) {
        return instance.delete('/InspectionPlan/TaskManage/Delete', {
            params: {
                taskIds: taskIds
            }
        })
    },
}