import instance from  './index'
export default {
     //计划类别下拉框数据
     UserInfo(){
        return instance.get('/User/GetInspectorInfo ')
    },
    //获取播放所需位置
    UserRoute(startTime,endTime,iAdminID){
        return instance.get('/User/GetInspectorRoute',{
            params: {
                iAdminID:iAdminID,
                startTime: startTime,
                endTime: endTime
            }
        })
    },
     //查询人员数据
    AdminNameData(deptId,roleId) {
        return instance.get('/User/GetUserComboboxList', {
            params: {
                deptId: deptId==null?'': Number(deptId),
                roleId:roleId==null?'': Number(roleId)
            }
        })
    },
    
}