import matance from  '../Inspection'

export default {
    //事件工单查询(个人处理-待办处理)
    get(startTime,endTime,EventFromId,eventType,OperId,DeptId,EventContenct,ExecPersonId,num,page){
        return matance.get('/EventManageForMaintain/Get',{
            params:{
                startTime:startTime,
                endTime:endTime,
                EventFromId:EventFromId,
                eventType:eventType,
                OperId:OperId,
                DeptId:DeptId,
                EventContenct:EventContenct,
                ExecPersonId:ExecPersonId,
                num:num,
                page:page
            }
        })
    },
    getCurrentOrder(num,page,startTime,endTime,ExecPersonId){
        return matance.get('/EventManageForMaintain/Get',{
            params:{
                startTime:startTime,
                endTime:endTime,
                num:num,
                page:page,
                ExecPersonId:ExecPersonId
            }
        })

    },
    //事件工单处理信息
    GetEventWorkorder(EventID){
        return matance.get('/EventManageForMaintain/GetEventWorkorderStepForMaintain',{
            params:{
                EventID:EventID
            }
        })

    },
    //事件工单作废
    WorkorderInvalid(EventID,OrderId,OperId,DispatchPersonID){
        return matance({
            method: 'post',
            url: '/EventManageForMaintain/WorkorderInvalid',
            params: {
                EventID:EventID,
                OrderId:OrderId,
                OperId:OperId,
                DispatchPersonID:DispatchPersonID,
            }
        })
    },
    //事件工单流转操作（审核)
    WorkListAudit(EventID,OrderId,DeptId,iAdminID){
        return matance({
            method: 'post',
            url: '/EventManageForMaintain/WorkListAudit',
            params: {
                EventID:EventID,
                OrderId:OrderId,
                iDetpID:DeptId,
                iAdminID:iAdminID
            }
        })
    },
    //事件工单流转操作（接单)
    WorkListReceipt(EventID,ExecDetpID,ExecPersonId,OrderId){
        return matance({
            method: 'post',
            url: '/EventManageForMaintain/WorkListReceipt',
            params: {
                EventID:EventID,
                // OrderId:OrderId,
                ExecDetpID:ExecDetpID,
                ExecPersonId:ExecPersonId,
                OrderId:OrderId
                // DispatchPersonID:DispatchPersonID,
            }
        })
    },
    //事件工单流转操作（到场)
    WorkListPresent(EventID,ExecDetpID,ExecPersonId,OrderId){
        return matance({
            method: 'post',
            url: '/EventManageForMaintain/WorkListPresent',
            params: {
                EventID:EventID,
                ExecDetpID:ExecDetpID,
                ExecPersonId:ExecPersonId,
                OrderId:OrderId
            },
            data:{
                base64Image:["|"]
            }
        })
    },
    //事件工单流转操作（处置)
    WorkListChuZhi(EventID,ExecDetpID,ExecPersonId,OrderId){
        return matance({
            method: 'post',
            url: '/EventManageForMaintain/WorkListChuZhi',
            params: {
                EventID:EventID,
                ExecDetpID:ExecDetpID,
                ExecPersonId:ExecPersonId,
                OrderId:OrderId
            },
            data:{
                base64Image:["|"]
            }
        })
    },
    //事件工单流转操作（完工)
    WorkListFinished(EventID,DeptId,iAdminID,OrderId){
        return matance({
            method: 'post',
            url: '/EventManageForMaintain/WorkListFinished',
            params: {
                EventID:EventID,
                DeptId:DeptId,
                iAdminID:iAdminID,
                OrderId:OrderId
            },
            data:{
                base64Image:["|"]
            }
        })
    },
    //事件工单流转操作（转派工单)
    WorkListReAssign(EventID,ExecDetpID,ExecPersonId,DispatchPersonID){
        return matance.post('/EventManageForMaintain/WorkListReAssign',{
            EventID:EventID,
            ExecDetpID:ExecDetpID,
            ExecPersonId:ExecPersonId,
            DispatchPersonID:DispatchPersonID
        })
    },
    //事件工单流转操作（分派工单)
    WorkListAssign(EventID,ExecDetpID,ExecPersonId,DispatchPersonID,ExecTime,OrderId){
        return matance({
            method: 'post',
            url: '/EventManageForMaintain/WorkListAssign',
            params: {
                EventID:EventID,
                ExecDetpID:ExecDetpID,
                ExecPersonId:ExecPersonId,
                DispatchPersonID:DispatchPersonID,
                ExecTime:ExecTime,
                OrderId:OrderId
            }
        })
    },
    //事件工单流转操作（退回 热线退单)
    WorkListBackToOper(EventID,iAdminID,BackDesc,PersonId,DeptId){
        return matance.post('/EventManageForMaintain/WorkListBackToOper',{
            EventID:EventID,
            iAdminID:iAdminID,
            BackDesc:BackDesc,
            PersonId:PersonId,
            DeptId:DeptId
        })
    },
    //事件工单流转操作(退单)工单生成后，退单
    WordListBackExec(EventID,OrderId,iAdminID,BackDesc,iDeptID){
        return matance({
            method: 'post',
            url: '/EventManageForMaintain/WordListBackExec',
            params: {
                EventID:EventID,
                OrderId:OrderId,
                iAdminID:iAdminID,
                BackDesc:BackDesc,
                iDeptID:iDeptID
            }
        })
    },
    //事件工单流转操作（延期)
    WordListDelay(EventID,OrderId,OperRemarks,complishTime,DeptId,iAdminID){
        return matance({
            method: 'post',
            url: '/EventManageForMaintain/WordListDelay',
            params: {
                EventID:EventID,
                OrderId:OrderId,
                OperRemarks:OperRemarks,
                complishTime:complishTime,
                DeptId:DeptId,
                iAdminID:iAdminID
            }
        })
    },
    //事件工单流转操作（延期确认)
    WorkListDelayExec(EventID,OrderId,complishTime,iDeptID,iAdminID){
        return matance({
            method: 'post',
            url: '/EventManageForMaintain/WorkListDelayExec',
            params: {
                EventID:EventID,
                OrderId:OrderId,
                complishTime:complishTime,
                iDeptID:iDeptID,
                iAdminID:iAdminID
            }
        })
    },
    //事件工单处理(回复)按钮
    WorkListEventReply(EventID,OrderId,OperRemarks){
        return matance({
            method: 'post',
            url: '/EventManageForMaintain/WorkListEventReply',
            params: {
                EventID:EventID,
                OrderId:OrderId,
                OperRemarks:OperRemarks
            }
        })
    },
    //个人处理-已办处理
    GetEventListOwn(startTime,endTime,OwnID,num,page){
        return matance.get('/EventManageForMaintain/GetEventListOwn',{
            params:{
                startTime:startTime,
                endTime:endTime,
                OwnID:OwnID,
                num:num,
                page:page
            }
        }) 
    },
    // 统计分析 柱状图POST
    EChatbar(startTime,endTime){
        return matance({
            method: 'post',
            url: '/MainTainStatistics/EChatEventFromStatistics',
            params: {
                startTime:startTime,
                endTime:endTime,
            }
        })
    },
    // 统计分析 折线图POST
    EChatLine(startTime,endTime){
        return matance({
            method: 'post',
            url: '/MainTainStatistics/EChatLineEventFromStatistics',
            params: {
                startTime:startTime,
                endTime:endTime,
            }
        })
    },
    //按照上报人员统计上报事件数
    GetEvents(startTime,endTime,sort,ordering,num,page){
        return matance.get('/MainTainStatistics/Get',{
            params:{
                startTime:startTime,
                endTime:endTime,
                sort:sort,
                ordering:ordering,
                num:num,
                page:page
            }
        }) 
    },
}