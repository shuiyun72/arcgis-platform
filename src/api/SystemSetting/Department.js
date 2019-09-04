import instance from  './index'

/**
  岗位增删改
**/
export default {

    getDeptList(){
        return instance.get('/Department/GetUserComboboxList')
    },

    addDept(query){
        return instance.post('/Department/Post', {
            "iDeptID": Number(query.iDeptID),
            "PiDeptID": Number(query.PiDeptID),
            "iAdminID": Number(query.iAdminID),
            "cDepName": query.cDepName,
            "cDepTel": query.cDepTel,
            "cDepEmail": query.cDepEmail,
            "iIsLocked": Number(query.iIsLocked),
            "iIsAllowChangePWD": Number(query.iIsAllowChangePWD)
        })
    },

    editDept(query){
        return instance.put('/Department/Put?iDeptID=' + Number(query.iDeptID), {
            "iDeptID": Number(query.iDeptID),
            "PiDeptID": Number(query.PiDeptID),
            "iAdminID": Number(query.iAdminID),
            "cDepName": query.cDepName,
            "cDepTel": query.cDepTel,
            "cDepEmail": query.cDepEmail,
            "iIsLocked": Number(query.iIsLocked),
            "iIsAllowChangePWD": Number(query.iIsAllowChangePWD)
        })
    },


    //删除模块管理数据
    delDept(id) {
        return instance.delete("/Department/Delete", {
            params: {
                iDeptID: Number(id),
            }
        });
    },

}