import instance from  './index'
/**
  地图数据操作
**/
export default {
    // 爆管分析
    SquibAnalysis(pipeId) {
        return instance.get('/SpatialSearch/GetRealatedValveAndPipeByPipeId', {
            params: {
                pipeId: pipeId.toString()
            }
        });
    },
    // 爆管分析
    SquibAnalysisByType(pipeId, type) {
        return instance.get('/SpatialSearch/GetRealatedValveAndPipeByPipeIdandType', {
            params: {
                pipeId: pipeId.toString(),
                type: type.toString()
            }
        });
    },
    //获取POI数据
    GetPOI(POIName) {
        return instance.get('/SpatialSearch/GetPOI', {
            params: {
                name: POIName
            }
        })
    },
    //获取横断面分析图片
    getTransectionAnalysis(_GData) {
        return instance.post("/SpatialSearch/GetCurveHeng", _GData);
    },
}