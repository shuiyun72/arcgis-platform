import instance from  './index'

export default {
   //查询路线关键点
   GetPlanLineDetail(num, page,planLineId,ordering,sort) {
        planLineId = planLineId || null
        sort = sort || 'PlanLineDetaiId'
        ordering = ordering || "desc"
        num = num || 15
        page = page || 1
        if (planLineId) {
            return instance.get('/PlanLineDetail/Get', {
                params: {
                    planLineId: String(planLineId),
                    sort: String(sort),
                    ordering: String(ordering),
                    num: Number(num),
                    page: Number(page),
                }
            })
        } else {
            return instance.get('/PlanLineDetail/Get', {
                params: {
                    sort: String(sort),
                    ordering: String(ordering),
                    num: Number(num),
                    page: Number(page),
                }
            })
        }
    },

    //添加路线关键点
    AddPlanLineDetail(PlanLineId, X, Y, ImportPointType, ImportPointName) {
        ImportPointType = ImportPointType || null
        if (ImportPointType) {
            return instance.post('/PlanLineDetail/Post', {
                PlanLineId: Number(PlanLineId),
                X: String(X),
                Y: String(Y),
            })
        } else {
            return instance.post('/PlanLineDetail/Post', {
                PlanLineId: Number(PlanLineId),
                X: String(X),
                Y: String(Y),
                ImportPointType: Number(ImportPointType),
                ImportPointName: String(ImportPointName)
            })
        }
    },

    //修改路线关键点
    EditPlanLineDetail(PlanLineDetaiId, PlanLineId, X, Y, ImportPointType, ImportPointName) {
        ImportPointType = ImportPointType || 1
        return instance.put('/PlanLineDetail/Put?planLineDetailId=' + PlanLineDetaiId, {
            PlanLineDetaiId: Number(PlanLineDetaiId),
            PlanLineId: Number(PlanLineId),
            X: String(X),
            Y: String(Y),
            ImportPointType: Number(ImportPointType),
            ImportPointName: String(ImportPointName)
        })
    },

    //删除路线数据
    DeletePlanLineDetail(PlanLineDetaiId) {
        return instance.delete('/PlanLineDetail/Delete', {
            params: {
                planLineId: Number(PlanLineDetaiId)
            }
        })
    },

}