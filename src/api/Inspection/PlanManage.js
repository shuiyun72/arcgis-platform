import instance from  './index'
//巡检计划管理
export default {
     //计划管理列表
     GetPlanManage(num, page,planTypeId,isNomalPlan,serachCondition,sort,ordering) {
        num = num || 15
        page = page || 1
        ordering = ordering || "desc"
        sort = sort || "PlanId"
        serachCondition = serachCondition || ""  
        let Params =  {          
            serachCondition: String(serachCondition),
            sort: String(sort),
            ordering: String(ordering),
            page: Number(page),
            num: Number(num)
        }
        if(isNomalPlan != null){
            Params["isNomalPlan"] = Number(isNomalPlan)
        }
        if(planTypeId != null){
            Params["planTypeId"] = Number(planTypeId)
        } 
        return instance.get('/InspectionPlan/PlanManage/GetPlanManageInfo', {
            params:Params
        })
      
    },
    
    //添加巡检计划
    AddPlanManage(
        planName,          //计划名称
        planTypeId,        //巡检类型
        planTypeLB,        //计划类别
        planCycleId,       //计划周期
        isFeedBack,        //是否需要反馈 1反馈 0不反馈
        isNomalPlan,       //1常规 0临时
        moveType,          //1车寻 2步行
        equipmentIdList,   //设备实体对应的id ','分割例如 1,3
        equipmentNameList, //设备实体对应的Name ','分割例如 阀门,消防栓
        invalidationDate,  //date-time
        planAreaId,        //区域id
        planLineId,        //路线id
        planPath,          //string
        equmentInfo        //后期添加的设备json
    ) {
        equmentInfo = equmentInfo ? JSON.parse(equmentInfo) :[]
        return instance({
            method: 'post',
            url: '/InspectionPlan/PlanManage/Post',
            params: {
                planName: String(planName),
                planTypeId: Number(planTypeId),
                planTypeLB: Number(planTypeLB),
                planCycleId: Number(planCycleId),
                isFeedBack: Number(isFeedBack),
                isNomalPlan: Number(isNomalPlan),
                moveType: Number(moveType),
                equipmentIdList: String(equipmentIdList),
                equipmentNameList: String(equipmentNameList),
                invalidationDate: invalidationDate,
                planAreaId: Number(planAreaId),
                planLineId: Number(planLineId),
                planPath: String(planPath), 
            },
            data:equmentInfo
        })

    },
    
    //修改巡检计划
    EditPlanManage(PlanId,planName,isNomalPlan,moveType){
        return instance({
            method: 'put',
            url: '/InspectionPlan/PlanManage/Put',
            params: {
                PlanId: Number(PlanId),
                planName: String(planName),
                isNomalPlan: Number(isNomalPlan),
                moveType: Number(moveType),
            }
        })
    },

    //删除巡检计划
    DeletePlanManage(PlanId) {
        return instance.delete('/InspectionPlan/PlanManage/Delete', {
            params: {
                PlanId: Number(PlanId)
            }
        })
    },

     //巡检计划分派
    AddPlanManageAssign(
        taskName,proraterDeptName,
        proraterDeptId,proraterName,
        proraterId,starTime,
        endTime,descript,
        planId,planName
    ){
        return instance({
            method: 'post',
            url: '/InspectionPlan/PlanManage/AssignTask',
            params: {
                taskName: String(taskName),
                proraterDeptName: String(proraterDeptName),
                proraterDeptId: Number(proraterDeptId),
                proraterName: String(proraterName),
                proraterId: Number(proraterId),
                starTime: String(starTime),
                endTime: String(endTime),
                descript: String(descript),
                planId: Number(planId),
                planName: String(planName)
            }
        })
        
    },
}