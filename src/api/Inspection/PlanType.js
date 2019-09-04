import instance from  './index'
export default {
     //计划类别下拉框数据
     PlanTypeLoad(){
        return instance.get('/PlanType/GetCommboboxList')
    },
    //计划类别查询
    PlanTypeSearch(numValue, pageValue,planTypeId,sortName, orderingValue){
        sortName = sortName || 'PlanTypeId'
        orderingValue = orderingValue || 'asc'
        return instance.get('/PlanType/Get' , {
            params: {
                planTypeId:Number(planTypeId),
                sort: String(sortName),
                ordering: String(orderingValue),
                num: Number(numValue),
                page: Number(pageValue),
            }
        })
    },
    //计划类别添加
    PlanTypeAdd(PlanTypeName,ParentTypeId){
        return instance.post('/PlanType/Post' , {
            PlanTypeName: String(PlanTypeName),
            ParentTypeId: Number(ParentTypeId),
        })
    },
    //计划类别修改
    PlanTypeEdit(PlanTypeName,ParentTypeId,planTypeId){
        return instance.put('/PlanType/Put?PlanTypeId='+Number(planTypeId) , {
                PlanTypeName: String(PlanTypeName),
                ParentTypeId: Number(ParentTypeId),
        })
    },
    //计划类别删除
    PlanTypeDel(planTypeId){
        return instance.delete('/PlanType/Delete' , {
            params:{
                planTypeId: Number(planTypeId)
            }
        })
    },
}