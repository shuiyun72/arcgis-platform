import instance from './index'

/**
  模块增删改
**/
export default {
    /***
     * 修改权限
     * iPurviewType：1用户 2角色
     * iPurviewID ： 用户或角色id
     * functionIds：权限id数组
     *  */
    editAuthority(formData) {
        return instance({
            method: 'post',
            url: '/FunPurview/RefreshFunPurview',
            params: {
                iPurviewType: Number(formData.iPurviewType),
                iPurviewID: Number(formData.iPurviewID),  
            },
            data: formData.functionIds
        });
    },

}