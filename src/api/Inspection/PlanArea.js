import instance from  './index'

export default {
    //区域管理
     //查询区域数据 
    RegionalData(num,page,sort,ordering) {
        num = num || 50
        page = page || 1
        sort = sort || 'OperateAddTime'
        ordering = ordering || 'desc'
        return instance.get('/PlanArea/Get', {
            params: {
                num: Number(num),
                page: Number(page),
                sort: String(sort),
                ordering: String(ordering),
            }
        })
    },

    //添加区域数据
    AddPlanArea(PlanAreaName, GeoText, DeptId, PersonId) {
        return instance.post('/PlanArea/Post', {
            PlanAreaName: String(PlanAreaName),
            GeoText: String(GeoText),
            DeptId: Number(DeptId),
            PersonId: Number(PersonId)
        })
    },

    //修改区域数据
    EditPlanArea(PlanAreaId, PlanAreaName, GeoText, DeptId, PersonId) {
        return instance.put('/PlanArea/Put?PointId=' + PlanAreaId, {
            PlanAreaId: Number(PlanAreaId),
            PlanAreaName: String(PlanAreaName),
            GeoText: String(GeoText),
            DeptId: Number(DeptId),
            PersonId: Number(PersonId),
        })
    },

    //删除区域数据
    DeletePlanArea(PlanAreaId) {
        return instance.delete('/PlanArea/Delete', {
            params: {
                PointId: Number(PlanAreaId)
            }
        })
    },
}