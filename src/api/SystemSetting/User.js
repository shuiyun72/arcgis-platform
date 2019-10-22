import instance from  './index'

/**
  用户增删改
**/
export default {

    getUserList(query){
        return instance.get('/User/Get', {
            params: {
                deptId:query.deptId || '',
                userName: query.userName || '',
                roleId: query.roleId==null? '': Number(query.roleId),
                num: query.num ? Number(query.num) : '',
                page: query.page ? Number(query.page) : '',
            }
        })
    },


    //删除模块管理数据
    delUser(iAdminID) {
        return instance.delete("/User/Delete", {
            params: {
                iAdminID: Number(iAdminID),
            }
        });
    },
    //新增模块管理数据
    addUser(formData) {
        return instance.post("/User/Post", {
            cAdminName: formData.cAdminName,
            CJobNumber: formData.CJobNumber,
            iDeptID: Number(formData.iDeptID),
            iRoleID: Number(formData.iRoleID),
            Level: formData.Level,
            cAdminSex: formData.cAdminSex,
            cAdminTel: formData.cAdminTel,
            iIsLocked: Number(formData.iIsLocked),
            iIsAllowChangePWD: Number(formData.iIsAllowChangePWD),
            IsAssignment: Number(formData.IsAssignment),
            dExpireDate: formData.dExpireDate,
            cAdminPassWord:'123',//随便写后台重置
            P_Role: {},
            UserAuthority: [],
            cAdminEmail:formData.cAdminEmail,
        });
    },
    //
    editUser(formData){
        return instance.put("/User/Put?iAdminID="+formData.iAdminID,  {
            cAdminName: formData.cAdminName,
            CJobNumber: formData.CJobNumber,
            iDeptID: Number(formData.iDeptID),
            iRoleID: Number(formData.iRoleID),
            Level: formData.Level,
            cAdminSex: formData.cAdminSex,
            cAdminTel: formData.cAdminTel,
            iIsLocked: Number(formData.iIsLocked),
            iIsAllowChangePWD: Number(formData.iIsAllowChangePWD),
            IsAssignment:Number(formData.IsAssignment),
            dExpireDate: formData.dExpireDate,
            cAdminPassWord:'123',
            P_Role: {},
            UserAuthority: [],
            cAdminEmail:formData.cAdminEmail,
        });
    },
    ResetUser(iAdminID){
        return instance.put("/User/ResetPassword?iAdminID="+iAdminID)
    },

    ChangePassword(formData){
        return instance.put("/User/ChangePassword",{
            iAdminID:Number(formData.iAdminID),
            cAdminName:formData.cAdminName,
            cAdminPassWord:formData.cAdminPassWord,
            oldcAdminPassWord:formData.oldcAdminPassWord,
        })
    }

    

}