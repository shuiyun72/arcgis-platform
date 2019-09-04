import instance from  '../Inspection'
import config from '@config/config.js'
export default {
    //获取app上传列表
    getAppList(query){
        return instance.get('CellphoneManage/Get', {
            params: {
                num:Number(query.num),
                page:Number(query.page)

            }
        })
    },
    //上传app的包文件地址
    appUploadList:config.apiPath.insURL + '/api/CellphoneManage/UploadApk',
}