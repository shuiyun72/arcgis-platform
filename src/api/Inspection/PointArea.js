import instance from  './index'

export default {
    //区域管理--关键点
    //查询关键点
    GetPointArea(numValue, pageValue, planAreaId, orderingValue,sortName) {
        orderingValue = orderingValue || 'asc'
        sortName = sortName || "PointId"
        return instance.get('/PointArea/Get', {
            params: {
                planAreaId: Number(planAreaId),
                sort: String(sortName),
                ordering: String(orderingValue),
                num: Number(numValue),
                page: Number(pageValue),
            }
        })
    },

    //添加关键点
    AddNewPoint(PointX, PointY, PointName, PlanAreaId) {
        return instance.post('/PointArea/Post', {
            PlanAreaId: PlanAreaId,
            PointName: String(PointName),
            PointX: String(PointX),
            PointY: String(PointY)
        })
    },

    //删除关键点
    DeletePoint(PointId) {
        return instance.delete('/PointArea/Delete', {
            params: {
                PointId: Number(PointId)
            }
        })
    },

    //修改关键点
    EditMapPlane(PointId, PointName, PointX, PointY) {
        return instance.put('/PointArea/Put?pointId=' + PointId, {
            PointId: Number(PointId),
            PointName: String(PointName),
            PointX: String(PointX),
            PointY: String(PointY)
        })
    },
}