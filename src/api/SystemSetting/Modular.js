import instance from  './index'

/**
  模块增删改
**/
export default {
    //获取模块管理数据
    getModular() {
        return instance.get("/Function/Get");
    },
    //删除模块管理数据
    delModular(iFunId) {
        return instance.delete("/Function/Delete", {
            params: {
                iFunId: Number(iFunId),
            }
        });
    },
    //新增模块管理数据
    addModular(formData) {
        return instance.post("/Function/Post", {
            System_Type: Number(formData.System_Type),
            FunctionType: Number(formData.FunctionType),
            cFunName: formData.cFunName,
            cFunUrl: formData.cFunUrl,
            iFunFatherID: Number(formData.iFunFatherID),
            iFunMenuIsShow: Number(formData.iFunMenuIsShow),
            iFunOrder: Number(formData.iFunOrder),
            cFunIcon: formData.cFunIcon,
        });
    },
    //
    editModular(formData){
        return instance.put("/Function/Put", {
            iFunID:Number(formData.iFunID),
            System_Type: Number(formData.System_Type),
            FunctionType: Number(formData.FunctionType),
            cFunName: formData.cFunName,
            cFunUrl: formData.cFunUrl,
            iFunFatherID: Number(formData.iFunFatherID),
            iFunMenuIsShow: Number(formData.iFunMenuIsShow),
            iFunOrder: Number(formData.iFunOrder),
            cFunIcon: formData.cFunIcon,
        });
    },

}