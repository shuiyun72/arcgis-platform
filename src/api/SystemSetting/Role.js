import instance from  './index'

/**
  岗位增删改
**/
export default {

    getRoleList(query){
        return instance.get('/Role/Get', {
            params: query
        })
    },

    addRole(query){
        return instance.post('/Role/Post', {
                cRoleName : query.cRoleName,
                isSuperAdmin:query.isSuperAdmin,
                IsInspector:query.IsInspector
        })
    },

    editRole(query){
        return instance.put('/Role/Put?iRoleID=' + Number(query.iRoleID), query)
    },


    //删除模块管理数据
    delRole(id) {
        return instance.delete("/Role/Delete", {
            params: {
                iRoleID: Number(id),
            }
        });
    },

}