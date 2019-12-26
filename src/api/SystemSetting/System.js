import instance from './index'

export default {

    getUserAuthority(iAdminID) {
        return instance.get('/System/GetUserAuthority', {
            params: {
                iAdminID: Number(iAdminID),
                systemType: -1
            }
        })
    },

    getRoleAuthority(iRoleID) {
        return instance.get('/System/GetRoleAuthority', {
            params: {
                iRoleID: iRoleID,
                systemType: -1
            }
        })
    },
    CreateAuthention: (query) => {
        return instance.post('/System/CreateAuthentionNew', {
            iAdminID: query._id,
            cAdminName: query.name,
            cAdminSex: query.sex,
            cAdminTel: query.mobile,
        })
    },




}