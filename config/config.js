// 项目前端配置
let apiPath = {}
switch (process.env.NODE_ENV) {
    case 'development':
        apiPath = {
            gisURL: 'http://39.100.62.29:5283',
            systemUrl: 'http://192.168.88.181:8087',
            insURL: 'http://192.168.88.181:8087',
            ArcgisCSSUrl: 'http://39.100.62.29:9921',
        }
        //这里是本地的请求url
        break
    case 'production':
        apiPath = {
            gisURL: 'http://39.100.62.29:5283',
            systemUrl: 'http://39.100.62.29:9819',
            insURL: 'http://39.100.62.29:9819',
            ArcgisCSSUrl: 'http://39.100.62.29:9921',
        }   //生产环境url
        break
}
export default {
    apiPath
}