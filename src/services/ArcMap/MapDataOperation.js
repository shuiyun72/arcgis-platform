/**
 *直接通过ArcGis Server进行空间数据查询
 */
import * as esriLoader from 'esri-loader';
import _ from 'lodash';
import {
    MapConfigure,
    FeatureLayerOperation,
    ArcgisJS,
    ArcgisCSS
} from "@common/consts/GisConst/MapConfigure";

import {
    truncate
} from 'fs';

//加载CSS样式文件
// esriLoader.loadCss(`https://js.arcgis.com/${JS_API_VERSION}/esri/css/esri.css`);
// const LOAD_MODULES_OPTIONS = {
//     url: `https://js.arcgis.com/${JS_API_VERSION}/`
// };
//加载CSS样式文件
esriLoader.loadCss(ArcgisCSS);
const LOAD_MODULES_OPTIONS = {
    url: ArcgisJS
};

/*地图浏览基本操作类*/
class MapDataOperation {
    //构造函数
    constructor() {
        this.modules = {}
    }

    //快捷菜单初始化
    async init() {
        const [
            SpatialReference,
            SimpleMarkerSymbol,
            SimpleLineSymbol,
            Color,
            graphic,
            geometryEngine,
            Point,
            query,
            QueryTask,
            StatisticDefinition,
            Geoprocessor,
            FeatureSet
        ] =
            await esriLoader.loadModules([
                "esri/SpatialReference",
                "esri/symbols/SimpleMarkerSymbol",
                "esri/symbols/SimpleLineSymbol",
                "esri/Color",
                "esri/graphic",
                "esri/geometry/geometryEngine",
                "esri/geometry/Point",
                "esri/tasks/query",
                "esri/tasks/QueryTask",
                "esri/tasks/StatisticDefinition",
                "esri/tasks/Geoprocessor",
                "esri/tasks/FeatureSet",
                "dojo/domReady!"
            ], LOAD_MODULES_OPTIONS);
        // 在这里将模块变量绑定到实例
        this.modules = {
            SpatialReference,
            SimpleMarkerSymbol,
            SimpleLineSymbol,
            Color,
            graphic,
            geometryEngine,
            Point,
            query,
            QueryTask,
            StatisticDefinition,
            Geoprocessor,
            FeatureSet
        };
    }

    //构建点数据
    createPoint(x, y) {
        let point = new this.modules.Point(x, y, new this.modules.SpatialReference({
            wkid: MapConfigure.MapExtent.SpatialReference
        }));
        return point;
    }

    /**
     *查询和统计功能中筛选出相应的数据集合，查询出来的内容主要作为查询条件用 
     例如： 管径：80，90，100
           材质：PE，球墨铸铁
           道路：梧桐街，碧桃路
     * @param {*} _GroupField 聚合对应的数据列
     * @param {*} _layerUrl   对应的图层名称
     * @param {*} allDoneCallback 回调函数
     */
    searchOrCountCondition(_GroupField, _layerUrl, allDoneCallback) {
        //图层不能为空
        if (_.isNull(_layerUrl) || _layerUrl === "") {
            console.log("图层字段为空", _layerUrl);
            return;
        }
        //构造查询条件
        let query = new this.modules.query();
        query.outFields = [_GroupField];
        query.returnGeometry = false;
        query.where = "1=1";
        query.groupByFieldsForStatistics = [_GroupField];
        query.orderByFields = [_GroupField];
        query.returnDistinctValues = true;


        let taskList = []
        if (_layerUrl instanceof Array) {
            _.forEach(_layerUrl, objvalue => {
                let queryTask = new this.modules.QueryTask(objvalue);
                //进行组合开始
                let groupQuery = new Promise((resolve, reject) => {
                    queryTask.execute(query, handleQueryResult => {
                        resolve(handleQueryResult);
                    }, errorHandler => {
                        reject(errorHandler);
                    });
                });
                taskList.push(groupQuery);
            });
        } else {
            let queryTask = new this.modules.QueryTask(_layerUrl);
            //进行组合开始
            let groupQuery = new Promise((resolve, reject) => {
                queryTask.execute(query, handleQueryResult => {
                    resolve(handleQueryResult);
                }, errorHandler => {
                    reject(errorHandler);
                });
            });
            taskList.push(groupQuery);
        }
        //返回查询数据集合
        Promise.all(taskList).then(result => {
            let resultFeatures = _.map(result, "features")[0];
            let returnValue = _.map(resultFeatures, resultValue => {
                return resultValue.attributes
            });
            allDoneCallback(returnValue);
        }).catch(err => {
            console.log("数据查询错误", err);
        });
    }

    /**
     * 空间数据统计
     * @param {*} statisticType         定义统计类型 'count'|'sum'|'min'|'max'|'avg'|'stddev'
     * @param {*} onStatisticField      用于计算统计信息的字段名或标准SQL表达式。  
     * @param {*} outStatisticFieldName 指定输出字段名称.
     */
    featureStatisticDefinition(statisticType, onStatisticField, outStatisticFieldName) {
        let countStatDef = new this.modules.StatisticDefinition();
        countStatDef.statisticType = statisticType;
        countStatDef.onStatisticField = onStatisticField;
        countStatDef.outStatisticFieldName = outStatisticFieldName;
        return countStatDef;
    }

    /**
     * 空间数据统计功能
     * @param {*} _GData              空间数据
     * @param {*} _SearchCondition    统计条件
     * @param {*} _GroupStaticesField 统计字段
     * @param {*} _GroupField         统计字段
     * @param {*} _layerUrl           选择图层
     * @param {*} allDoneCallback     回调函数
     * _GroupStaticesField 参数传输格式
     *         _GroupStaticesField = [{
                statisticType: 'count',
                onStatisticField: 'equipment_number',
                outStatisticFieldName: 'equipment_number'
            },
            {
                statisticType: 'sum',
                onStatisticField: 'length',
                outStatisticFieldName: 'length'
            }
        ];
        _GroupField：参数传输格式
        _GroupField=["caliber","equipment_number"]
     */
    featureQueryGroup(_GData, _SearchCondition, _GroupStaticesField, _GroupField, _layerUrl, allDoneCallback) {
        //图层不能为空
        if (_.isNull(_layerUrl) || _layerUrl === "") {
            console.log("图层字段为空", _layerName);
            return;
        }
        //构造查询条件
        let query = new this.modules.query();
        //定义条件
        let outStatistics = [];
        let gisField = [];
        _.forEach(_GroupStaticesField, objValue => {
            outStatistics.push(this.featureStatisticDefinition(objValue.statisticType, objValue.onStatisticField, objValue.outStatisticFieldName));
            gisField.push(objValue.outStatisticFieldName);
        });
        query.outFields = gisField; //输出字段
        query.outStatistics = outStatistics; //统计字段
        //添加空间数据
        if (!_.isNull(_GData)) {
            query.geometry = _GData;
        }
        //搜索条件
        if (!_.isNull(_SearchCondition)) {
            query.where = _SearchCondition;
        }
        //分组字段
        if (!_.isNull(_GroupField)) {
            query.groupByFieldsForStatistics = _GroupField;
        }
        let taskList = []
        if (_layerUrl instanceof Array) {
            _.forEach(_layerUrl, objvalue => {
                let queryTask = new this.modules.QueryTask(objvalue);
                //进行组合开始
                let groupQuery = new Promise((resolve, reject) => {
                    queryTask.execute(query, handleQueryResult => {
                        resolve(handleQueryResult);
                    }, errorHandler => {
                        reject(errorHandler);
                    });
                });
                taskList.push(groupQuery);
            });
        } else {
            let queryTask = new this.modules.QueryTask(_layerUrl);
            //进行组合开始
            let groupQuery = new Promise((resolve, reject) => {
                queryTask.execute(query, handleQueryResult => {
                    resolve(handleQueryResult);
                }, errorHandler => {
                    reject(errorHandler);
                });
            });
            taskList.push(groupQuery);
        }

        Promise.all(taskList).then(result => {
            let resultFeatures = _.map(result, "features")[0];
            let returnValue = _.map(resultFeatures, resultValue => {
                return resultValue.attributes
            })
            allDoneCallback(returnValue);
            // allDoneCallback(result);
        }).catch(err => {
            console.log("数据统计", err);
        });
    }

    /**
     * 空间数据查询
     * @param {*} _GData            空间数据
     * @param {*} _SearchCondition  查询条件 
     * @param {*} _layerUrl         选择图层
     * @param {*} allDoneCallback   回调函数
     */
    featureQuery(_GData, _SearchCondition, _layerUrl, allDoneCallback) {
        //声明空间数据查询条件
        let query = this.modules.query();
        query.outFields = ["*"];
        //图层不能为空
        if (!_.isNull(_GData)) {
            query.geometry = _GData;
        }
        //是否返回查询结果的空间几何信息
        query.returnGeometry = true;
        //查询的where条件，可以是任何合法的SQL语句，可以不设置
        if (!_.isNull(_SearchCondition) && _SearchCondition.trim() != "") {
            query.where = _SearchCondition;
        } else {
            query.where = " 1=1 ";
        }
        let queryTask = new this.modules.QueryTask(_layerUrl);
        //进行组合开始
        let SearchQuery = new Promise((resolve, reject) => {
            queryTask.execute(query, handleQueryResult => {
                resolve(handleQueryResult);
            }, errorHandler => {
                reject(errorHandler);
            });
        });
        //返回查询数据集合
        SearchQuery.then(result => {
            allDoneCallback(result.features);
        }).catch(err => {
            console.log("数据查询错误", err);
        });
    }

    /**
     * 连通性分析结果
     * @param {连通点集合} featureCollection 
     * @param {图层名称} layerName 
     * @param {分组名称} groupName 
     * @param {回调函数} allDoneCallback 
     */
    gpJoinAnalysis(featureCollection, layerName, groupName, allDoneCallback) {
        let layerURL = FeatureLayerOperation.getLayerURLByName(layerName); //取得图层URL地址
        let groupLayer = _.filter(MapConfigure.FeatureLayerGroup, filterValue => {
            return filterValue.groupName === groupName;
        });
        if (groupLayer.length <= 0) {
            console.log("分析图层不存在！");
            return [];
        }
        let GPServices = new this.modules.Geoprocessor(groupLayer[0].GPService);
        GPServices.setOutputSpatialReference(new this.modules.SpatialReference({
            wkid: MapConfigure.MapExtent.SpatialReference
        }));
        let pointSymbol = new this.modules.SimpleMarkerSymbol();
        pointSymbol.setSize(14);
        pointSymbol.setOutline(new this.modules.SimpleLineSymbol(this.modules.SimpleLineSymbol.STYLE_SOLID, new this.modules.Color([255, 0, 0]), 1));
        pointSymbol.setColor(new this.modules.Color([0, 255, 0, 0.25]));

        //执行任务列表
        let taskList = []
        let FeaturequeryTask = new this.modules.QueryTask(layerURL); //构建图层查询任务
        let handleQueryResultAll = [] //两端的管线
        //管线图加载
        _.forEach(featureCollection, objValue => {
            let queryTask = new Promise((resolve, reject) => {
                //缓冲池
                console.log(objValue.geometry)
                let buffer = this.modules.geometryEngine.buffer([objValue.geometry], [1], "meters", true);
                //空间查询条件
                let query = this.modules.query();
                query.outFields = ["*"];
                query.geometry = buffer[0];
                query.returnGeometry = true;
                query.where = " 1=1 ";
                //进行组合开始
                FeaturequeryTask.execute(query, handleQueryResult => {
                    let ResultValue = [];
                    if (handleQueryResult.features.length > 0) {
                        handleQueryResultAll.push(handleQueryResult.features[0])
                        let coordition = handleQueryResult.features[0].geometry.paths[0][0];
                        let coordition1 = handleQueryResult.features[0].geometry.paths[0][1];

                        // ResultValue.push(this.modules.Point(coordition[0], coordition[1], new this.modules.SpatialReference({
                        //     wkid: MapConfigure.MapExtent.SpatialReference
                        // })));

                        // ResultValue.push(this.modules.Point(coordition1[0], coordition1[1], new this.modules.SpatialReference({
                        //     wkid: MapConfigure.MapExtent.SpatialReference
                        // })));

                        ResultValue = this.modules.Point(coordition[0], coordition[1], new this.modules.SpatialReference({
                            wkid: MapConfigure.MapExtent.SpatialReference
                        }));
                    }
                    resolve(ResultValue);
                }, errorHandler => {
                    reject(errorHandler);
                });
            });
            taskList.push(queryTask)
        });
        //执行连通分析
        Promise.all(taskList).then(result => {
            let features = [];
            _.forEach(result, objValue => {
                if (_.isArray(objValue)) {
                    _.forEach(objValue, dOBJValue => {
                        let graphic = new this.modules.graphic(dOBJValue, pointSymbol);
                        features.push(graphic);
                    });
                } else {
                    let graphic = new this.modules.graphic(objValue, pointSymbol);
                    features.push(graphic);
                }

            });
            let featureSet = new this.modules.FeatureSet();
            featureSet.features = features;
            let params = {
                "要分析的点数据": featureSet,
            };
            //连通分析执行
            GPServices.execute(params, resultValue => {
                // resultValue.push(...handleQueryResultAll)
                let distinctValue = []
                _.forEach(resultValue, objvalue => {
                    distinctValue.push(...objvalue.value.features)
                });
                _.forEach(distinctValue, objvalue => {
                    objvalue.attributes.OBJECTID = objvalue.attributes.equipment_number
                });
                distinctValue.push(...handleQueryResultAll)
                allDoneCallback instanceof Function && allDoneCallback(distinctValue);
            }, err => {
                allDoneCallback instanceof Function && allDoneCallback([]);
                console.log("分析错误结果：", err);
            });
        }).catch(err => {
            console.log('有一個task出錯', err);
        });
    }
}

export default MapDataOperation;