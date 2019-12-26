import instance from  './index'
export default {
    //查询部门数据
    DeptData() {
        return instance.get('/Department/GetUserComboboxList')
    },

    //查询人员数据
    AdminNameData(deptId) {
        return instance.get('/User/GetUserComboboxList', {
            params: {
                deptId: Number(deptId)
            }
        })
    },
    //查询人员数据
    GetUserComboboxListNoDelete(deptId) {
        return instance.get('/User/GetUserComboboxListNoDelete', {
            params: {
                deptId: Number(deptId),
            }
        })
    },

    //查询计划周期
    GetPlanCycle() {
        return instance.get('/PlanCycle/GetCombobox')
    },
}