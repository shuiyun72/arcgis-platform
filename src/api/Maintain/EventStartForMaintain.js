import matance from '../Inspection'

export default {
    //事件来源下拉框
    GetEventFromComboBoxList() {
        return matance.get('/EventStartForMaintain/GetEventFromComboBoxList')
    },
    //紧急程度下拉框
    GetUrgencyComboBoxList() {
        return matance.get('/EventStartForMaintain/GetUrgencyComboBoxList')
    },
    //个人处理--发起事件
    AddEventStart(iAdminID, cAdminName, iDeptID, EventFromId, UrgencyId, EventTypeId, EventTypeId2, EventTypeName, EventTypeName2, EventX, EventY, ExecDetpID, ExecPersonId, EventDesc, LinkMan, LinkCall, EventAddress) {
        return matance.post('/EventStartForMaintain/AddEventStart', {
            iAdminID: iAdminID,
            cAdminName: cAdminName,
            iDeptID: iDeptID,
            EventFromId: EventFromId,
            UrgencyId: UrgencyId,
            EventTypeId: EventTypeId,
            EventTypeId2: EventTypeId2,
            EventTypeName: EventTypeName,
            EventTypeName2: EventTypeName2,
            EventX: EventX,
            EventY: EventY,
            ExecDetpID: ExecDetpID,
            ExecPersonId: ExecPersonId,
            EventDesc: EventDesc,
            LinkMan: LinkMan,
            LinkCall: LinkCall,
            EventAddress: EventAddress
        })
    },
    // 事件上报
    eventUpload(personId,adminName,deptId, eventFromId, urgencyId, eventTypeId, eventTypeId2, linkMan, linkCall, eventAddress, eventX, eventY, execDetpId, execPersonId, eventDesc,base64Image) {
        return matance({
            url:"/EventManage/Post",
            method:'post',
            params:{
                personId:personId,
                adminName:adminName,
                deptId:deptId,
                eventFromId:eventFromId,
                urgencyId:urgencyId,
                eventTypeId:eventTypeId,
                eventTypeId2:eventTypeId2,
                linkMan:linkMan,
                linkCall:linkCall,
                eventAddress:eventAddress,
                eventX:eventX,
                eventY:eventY,
                execDetpId:execDetpId,
                execPersonId:execPersonId,
                eventDesc:eventDesc
            },
            // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data:{
                base64Image: base64Image
            }
        })
    },
    //事件内容
    EventContent(eventTypeId,sort,ordering,num,page){
        return matance.get("/EventContent/GetByEventTypeId",{
            params:{
                eventTypeId:eventTypeId,
                sort:"EventTypeName",
                ordering:"desc",
                num:100,
                page:1
            }
        })
    },
    //获取处理人
    excelUser(deptId){
        return matance.get("/User/GetUserComboboxList",{
            params:{
                deptId:deptId
            }
        })
    },
    //获取处理人新增删除
    GetUserComboboxListNoDelete(deptId){
        return matance.get("/User/GetUserComboboxListNoDelete",{
            params:{
                deptId:deptId
            }
        })
    },
    //获取所有部门
    excelPart(){
        return matance.get("/Department/GetUserComboboxList")
    },
    //通过用户id获取部门
    getDeptid(){
        return matance.get("/User/Get")
    },
    // 工单删除
    orderDel(eventId){
        return matance({
            method:"DELETE",
            url:"/EventManage/Delete",
            params:{
                eventId:eventId
            }
        })
    }
}