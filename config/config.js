// 项目前端配置
let apiPath = {}
switch (process.env.NODE_ENV) {
    case 'development':
        apiPath = {
            gisURL: 'http://39.100.62.29:9922',
            insURL: 'http://39.100.62.29:9922',//页面请求地址
            ArcgisCSSUrl: 'http://39.100.62.29:9921',
            AccountsUrl: 'http://192.168.88.140:9923',
            UniWaterUrl: 'http://192.168.100.188:7009',
            "/GIS": {
                client_id: '5dd50ffe3dbfae000a69266b',
                client_secret: '4dceaffa',
            },
            "/InspectionGIS": {
                client_id: '5dd4d5576951c2194ca03582',
                client_secret: '95b403d5',
            },
            "/MaintainGIS": {
                client_id: '5dd2477e6951c2194ca00eed',
                client_secret: '0be7f1bc',
            },
        }
        //这里是本地的请求url
        break
    case 'production':
        apiPath = {
            gisURL: 'http://58.218.184.194:9922',
            insURL: 'http://58.218.184.194:9922',//页面请求地址
            ArcgisCSSUrl: 'http://58.218.184.194:9921',
        }   //生产环境url
        break
}
export default {
    apiPath
}