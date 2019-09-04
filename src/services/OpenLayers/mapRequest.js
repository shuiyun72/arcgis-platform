import axios from 'axios'
import MapConfigure from "@common/consts/OpenLayersConfig/MapConfigure";

//地图数据操作
const instance = axios.create({
    baseURL: MapConfigure.url.urlPipeLine,
    crossDomain: true,
    timeout: 30000,
    // 该函数指定响应数据进行的预处理，return的值会填到response.data
    transformResponse: function (resJsonData) {
        return resJsonData;
    }
});

/**
  地图数据请求
**/
export default {
    // 爆管分析
    GetGisReset(vectorLayer) {
        return instance.get(vectorLayer);
    }
}