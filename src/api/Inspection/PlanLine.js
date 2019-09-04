import instance from  './index'

export default {
   //查询路线数据
   GetPlanLine(num, page , ordering,sort ) {
        sort = sort || 'PlanLineId'
        ordering = ordering || "desc"
        num = num || 15
        page = page || 1
        return instance.get('/PlanLine/Get', {
            params: {
                sort: String(sort),
                ordering: String(ordering),
                num: Number(num),
                page: Number(page),
            }
        })
    },

    //添加路线数据
    AddPlanLine(PlanLineName, GeoText, PatroGeoText) {
        return instance.post('/PlanLine/Post', {
            PlanLineName: String(PlanLineName),
            GeoText: String(GeoText),
            PatroGeoText: String(PatroGeoText),
        })
    },

    //修改路线数据
    EditPlanLine(PlanLineId, PlanLineName, GeoText, PatroGeoText) {
        return instance.put('/PlanLine/Put?planLineId=' + PlanLineId, {
            PlanLineName: String(PlanLineName),
            GeoText: String(GeoText),
            PatroGeoText: String(PatroGeoText),
        })
    },

    //删除路线数据
    DeletePlanLine(planLineId) {
        return instance.delete('/PlanLine/Delete', {
            params: {
                planLineId: Number(planLineId)
            }
        })
    },

}