import _ from "lodash";
import * as FeatureColumn from "@common/consts/GisConst/MapFeatureConfiguration";
import * as GisTableColumn from "@common/consts/GisConst/GisTableColumn";
import config from '@config/config.js'

//图层类别
export const GISWebData = [
  // {
  //   name:'站点',
  //   id:'Businesslayer',
  //   methoud:'HeDaWebSite',
  //   iconName:'observe.png',
  //   HdLng:'HdLng',
  //   HdLat:'HdLat',
  //   HdTitle:'Station.Name',
  //   PopClumn:'',
  //   ShowStation:false,//显示状态
  //   ControlShow:true,//是否可以控制显示隐藏
  //   SpatialReference:4547
  // },
  // {
  //   name:'管网事件',
  //   id:'EventTypeLayer',
  //   methoud:'HeDaPipeEventInfo',
  //   iconName:'',
  //   HdLng:'longitude',
  //   HdLat:'latitude',
  //   HdTitle:'typeName',
  //   PopClumn:'HeDaEvenType_Columns',
  //   ShowStation:false,//显示状态
  //   ControlShow:true,//是否可以控制显示隐藏
  //   SpatialReference:4547
  // },
]
export const LayerType = {
  PipeTypeNO: 1, //管线
  ExhaustvalveTypeNO: 2, //排气阀
  FirefightingwellTypeNO: 3, //消防井
  FirehydrantTypeNO: 4, //消火栓
  ServicingwellTypeNO: 5, //检修井
  ValveTypeNO: 6, //阀门
  ValvewellTypeNO: 7, //阀门井
  WatermeterwellTypeNO: 8, //水表井
  WaterMeterTypeNO: 9, //水表
  PressurereliefvalveTypeNO: 10, //减压阀
  TeeTypeNO: 11, //三通
  ElbowTypeNO: 12, //弯头
  ConnectionpointTypeNO: 13, //连接点
  WatermeterboxTypeNO: 14,//水表箱
  ReducersTypeNO: 15,//变径
  FourTypeNO: 16,//四通
  ModificationTypeNO: 17,//变材
  MonitoringPointTypeNO: 18,//监测点
  DischargePortTypeNO: 20,//排放口
  ReservedPortTypeNO: 21,//预留口
  SewagePlantTypeNO: 22,//污水处理厂
  WaterSourcePointTypeNO: 23,//水源点
  ManholeTypeNO: 24,//窨井
  RainGrateTypeNO: 25,//雨水篦
  GateWellTypeNO: 26,//闸门井
  StructureTypeNO: 27,//构造物
  InterceptingStationTypeNO: 28,//截流泵站
  SewageStationTypeNO: 29,//污水泵站
  ProcessingPoolTypeNO: 30,//处理池
  NetworkEnterpriseTypeNO: 31,//入网企业
  ValveholeTypeNO: 32, //阀门孔
  DrainWellTypeNO: 33,//排污井
  BlowOffChamberTypeNO: 34,//排泥井
  ExhaustShaftTypeNO: 35,//排气井
  PumpingStationTypeNO: 36,//加压泵站
  OutletTypeNO: 37,//出水口
  PipePluggingTypeNO: 38,//管堵
  NonCensusAreaTypeNO: 39,//非普查区
};
export const Legend_Json = 'http://58.218.184.194:6080/arcgis/rest/services/fx/FX_pipe/MapServer/legend?f=pjson'
//地图配置
export const MapConfigure = {
  lods: [
    { "level": 0, "resolution": 0.00118973050291514, "scale": 500000 },
    { "level": 1, "resolution": 5.9486525145757E-4, "scale": 250000 },
    { "level": 2, "resolution": 2.97432625728785E-4, "scale": 125000 },
    { "level": 3, "resolution": 1.5228550437313792E-4, "scale": 64000 },
    { "level": 4, "resolution": 7.614275218656896E-5, "scale": 32000 },
    { "level": 5, "resolution": 3.807137609328448E-5, "scale": 16000 },
    { "level": 6, "resolution": 1.903568804664224E-5, "scale": 8000 },
    { "level": 7, "resolution": 9.51784402332112E-6, "scale": 4000 },
    { "level": 8, "resolution": 4.75892201166056E-6, "scale": 2000 },
    { "level": 9, "resolution": 2.37946100583028E-6, "scale": 1000 },
    { "level": 10, "resolution": 1.18973050291514E-6, "scale": 500 },
    { "level": 11, "resolution": 5.9486525145757E-7, "scale": 250 },
    // { "level": 12, "resolution": 2.9743262572878E-7, "scale": 125 },
    // { "level": 13, "resolution": 0.0330729825, "scale": 64 },
    // { "level": 14, "resolution": 0.01653649125, "scale": 32 },
    // { "level": 15, "resolution": 0.008268245625, "scale": 16 },
    // {"level" : 16, "resolution" : 0.0041341228125, "scale" : 16},
    // {"level" : 17, "resolution" : 0.0020670614062, "scale" : 8},
    // {"level" : 18, "resolution" : 0.0010335307031, "scale" : 4},
    // {"level" : 19, "resolution" : 0.0005167653515, "scale" : 2},
    // {"level" : 20, "resolution" : 0.000258382675, "scale" : 1},
  ],
  //基础图层
  BaseLayers: [
    // {
    //   layerCName: "影像图", //图层中文名称
    //   layerName: 'SatellLayer', //图层编号
    //   viewIndex: 1, //图层显示顺序
    //   transValue: 100, //透明度
    //    iconName: "Layer-Yaogan.png", //图层缩略图
    //   layerURL: "http://39.100.62.29:6080/arcgis/rest/services/xx/XX_vector_BS/MapServer", //空间数据地址
    //   isActive: true //默认显示与隐藏
    // },
    {
      layerCName: "街道图", //图层中文名称
      layerName: 'StreetLayer', //图层编号
      viewIndex: 2, //图层显示顺序
      transValue: 100, //透明度
      iconName: "Layer-JieDao.png", //图层缩略图
      layerURL: "http://58.218.184.194:6080/arcgis/rest/services/fx/FX_jdt/MapServer", //空间数据地址
      isActive: true,//默认显示与隐藏
      layertype: 1, //1:切片图层，2:矢量图层
    },
    {
      layerCName: "地形图", //图层中文名称
      layerName: 'TerrainLayer', //图层编号
      viewIndex: 3, //图层显示顺序
      transValue: 100, //透明度
      iconName: "Layer-Dixing.png", //图层缩略图
      layerURL: "http://58.218.184.194:6080/arcgis/rest/services/fx/FX_yxt/MapServer", //空间数据地址
      isActive: false,//默认显示与隐藏
      layertype: 2, //1:切片图层，2:矢量图层
    }
  ],
  //POI数据定位查询
  POILayers: {
    groupCName: "POI查询图层", //图层中文名称
    groupName: 'GroupPOI', //图层编号
    layerURL: "http://58.218.184.194:6080/arcgis/rest/services/fx/FX_poi/MapServer", //空间数据地址
    featureLayers: [{
      layerCName: "点", //图层中文名称
      layerName: 'POILayer', //图层编号
      NAME: "name",
      layerType: 1, //点查询
      layerIndex: 0, //对应ArcGis图层编号
      viewIndex: 1 //图层显示顺序
    }]
  },
  //空间数据查询
  SpatialAnalysisURL: {
    //编辑
    urlbianji: "http://106.3.45.220:6080/arcgis/rest/services/china_region/MapServer",
    //几何服务=》
    GeometryService: "http://39.100.62.29:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer",
    //打印服务
    PrintService: "http://39.100.62.29:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
    //等高线服务
    dgxService: "http://39.100.62.29:6080/arcgis/rest/services/xx/XX_elevation_BS/MapServer/0",
  },
  FeatureLayerGroup: [
    {
      groupCName: "管网数据", //特征图层中文名称
      groupName: "ColdWaterLayer", //英文名称
      layerURL: "http://58.218.184.194:6080/arcgis/rest/services/fx/FX_pipe/MapServer", //图层基础URL地址
      GPService: "http://58.218.184.194:6080/arcgis/rest/services/fx/连通性分析/GPServer/连通性分析", //分析服务地址
      isActive: true, //默认显示与隐藏
      isEnable: true, //是否启用
      isDeFault: true,
      isHide: false,//是否在layer图层管理中隐藏
      viewIndex: 1, //分组显示顺序
      featureLayers: [{
        layerCName: "管网", //图层中文名称
        iconName: ["#006FFF"],
        layerName: 'PipeLineLayer', //图层编号
        layerIndex: 6, //对应ArcGis图层编号
        layerTableName: "Pipe", //数据库表名
        listViewColumn: "E_Pipe_Columns", //对应前端列表控件列
        special: ['count', 'show', 'KPI', 'LianTongXing', 'HengDuanMian', 'ChaiQian'], //特殊页面需要筛选属性
        layerType: LayerType.PipeTypeNO, //图层类别
        viewIndex: 1, //图层显示顺序
        isActive: true, //是否显示
        featureColumn: FeatureColumn["PipeFeatureColumn"] //Feature内容显示列
      }, {
        layerCName: "阀门",
        iconName: "valve.png",
        layerName: 'ValveLayer',
        layerIndex: 0,
        layerTableName: "Valve",
        listViewColumn: "E_Valve_Columns",
        special: ['count', 'show', 'KPI'],
        layerType: LayerType.ValveTypeNO, //图层类别
        viewIndex: 3,
        isActive: true,
        featureColumn: FeatureColumn["ValveFeatureColumn"]
      }, {
        layerCName: "排泥井 ",
        iconName: "Soildischargingwell.png",
        layerName: 'BlowOffChamberLayer',
        layerIndex: 1,
        layerTableName: "Servicingwell",
        listViewColumn: "E_Servicingwell_Columns",
        layerType: LayerType.BlowOffChamberTypeNO, //图层类别
        viewIndex: 8,
        isActive: true,
        featureColumn: FeatureColumn['ServicingwellFeatureColumn']
      }, {
        layerCName: "排气井",
        iconName: "Exhaustwell.png",
        layerName: 'ExhaustShaftLayer',
        layerIndex: 2,
        layerTableName: "Exhaustvalve",
        listViewColumn: "E_Servicingwell_Columns",
        layerType: LayerType.ExhaustShaftTypeNO, //图层类别
        isActive: true,
        viewIndex: 10,
        featureColumn: FeatureColumn["ValveFeatureColumn"]
      }, {
        layerCName: "水表井",
        iconName: "Meterwell.png",
        layerName: 'WatermeterwellLayer',
        layerIndex: 3,
        layerTableName: "Watermeterwell",
        listViewColumn: "E_Watermeterwell_Columns",
        layerType: LayerType.WatermeterwellTypeNO, //图层类别
        viewIndex: 16,
        isActive: true,
        featureColumn: FeatureColumn['WatermeterwellFeatureColumn']
      }, {
        layerCName: "测流井",
        iconName: "FlowMeasuringwell.png",
        layerName: 'FlowMeasuringwellLayer',
        layerIndex: 4,
        layerTableName: "Valvewell",
        listViewColumn: "E_Valvewell_Columns",
        layerType: LayerType.ValvewellTypeNO, //图层类别
        viewIndex: 5,
        isActive: true,
        featureColumn: FeatureColumn['ValveWellFeatureColumn']
      }, {
        layerCName: "阀门井",
        iconName: "valvewell.png",
        layerName: 'ValvewellLayer',
        layerIndex: 5,
        layerTableName: "Valvewell",
        listViewColumn: "E_Valvewell_Columns",
        layerType: LayerType.ValvewellTypeNO, //图层类别
        viewIndex: 6,
        isActive: true,
        featureColumn: FeatureColumn['ValveWellFeatureColumn']
      },]
    }
  ],
  //地图中心点
  MapCenter: {
    Center_X: 462243.0952028196,
    Center_Y: 3841259.9288588683,
    Center_Zoom: 4
  },
  MapExtent: {
    XMin: 433715.02683222864,
    YMin: 3805779.2912019757,
    XMax: 490370.2181425005,
    YMax: 3870170.1127892,
    SpatialReference: 4548,
    isCurved: false,//是否是曲面
  },
  //比例尺缩放到哪个级别时切换地图
  MapChange: {
    MapZoomLevel: 20
  },
  //坐标l类型
  Coordinates_Type: {
    Map_Coordinates: 1
  },
};

//获取特性图层
export const FeatureLayerOperation = {
  /**
  *根据图层名称获取图层ID
  * @param {图层名称} LayerTypeID
  */
  getLayerIDByType(LayerTypeID, menuFeature) {
    return this.getLayerURLByType(LayerTypeID, menuFeature, '_layerName')
  },
  /**
   *根据图层名称获取图层URL
   * @param {图层名称} LayerTypeID
   */
  getLayerURLByName(layerName) {
    let layerCollection = _.map(MapConfigure.FeatureLayerGroup, objValue => {
      let fResult = _.filter(objValue.featureLayers, objLayerName => {
        return objLayerName.layerName === layerName;
      });
      return (
        fResult.length > 0 && {
          layerURL: objValue.layerURL,
          layerIndex: fResult[0].layerIndex
        }
      );
    });
    let _FeatureURL = "";
    _.forEach(layerCollection, item => {
      if (item) {
        if (!_.endsWith(item.layerURL, "/")) {
          _FeatureURL = item.layerURL + "/";
        }
        _FeatureURL = _FeatureURL + item.layerIndex;
      }
    });
    return _FeatureURL;
  },
  /**
   *根据图层类别获取图层URL
   * @param {图层类别} LayerTypeID
   * @menuFeature {是否为功能图层}
   */
  getLayerURLByType(LayerTypeID, menuFeature, returnType) {
    let layerCollection = _.map(MapConfigure.FeatureLayerGroup, objValue => {
      let fResult = []
      if (menuFeature) {
        fResult = _.filter(objValue.featureLayers, objLayerName => {
          if (!objLayerName.layerTypeCountHide) {
            return objLayerName.layerType === LayerTypeID;
          }

        });
      }
      else {
        if (objValue.isEnable) {
          fResult = _.filter(objValue.featureLayers, objLayerName => {
            if (!objLayerName.layerTypeCountHide) {
              return objLayerName.layerType === LayerTypeID;
            }
          });
        }
      }
      return (fResult.length > 0 && {
        layerURL: objValue.layerURL,
        layerIndex: fResult
      })
    })
    layerCollection = _.filter(layerCollection, item => { return item })
    //图层URL
    let _layerUrl = [];
    let attrObj = {
      _layerName: []
    }
    _.forEach(layerCollection, objValue => {
      let _FeatureURL = "";
      if (objValue != false) {
        if (!_.endsWith(objValue.layerURL, "/")) {
          _FeatureURL = objValue.layerURL + "/";
        }
        _.forEach(objValue.layerIndex, item => {
          _layerUrl.push(_FeatureURL + item.layerIndex);
          attrObj._layerName.push(item.layerName)
        })

      }
    });
    if (returnType) {
      return attrObj[returnType]
    }
    return _layerUrl;
  },
  //获得所有特性图层信息
  getLayer(_featurType) {
    let returnLayers = [];

    _.forEach(MapConfigure.FeatureLayerGroup, objValue => {
      if (objValue.isHide) {
        return
      }
      let layerNode = {};
      layerNode.value = objValue.groupName;
      layerNode.id = objValue.groupName;
      layerNode.label = objValue.groupCName;
      layerNode.type = 0; //0：代表分组 1：代表分组下的图层
      layerNode.viewIndex = objValue.viewIndex;
      if (_.isNull(_featurType) || _.isUndefined(_featurType)) {
        layerNode.children = this.GetALLFeatureChild(objValue.featureLayers);
      } else {
        layerNode.children = this.GetFeatureByType(objValue.featureLayers, _featurType);
      }
      layerNode.children.length > 0 && returnLayers.push(layerNode);
    });
    return returnLayers;
  },
  //取得特定类型的图层集合
  GetFeatureByType(featrueLayers, _featurType) {
    let returnLayers = [];
    _.forEach(featrueLayers, objValue => {
      if (objValue.layerTypeCountHide) return
      let layerNode = {};
      layerNode.value = objValue.layerName;
      layerNode.id = objValue.layerName;
      layerNode.label = objValue.layerCName;
      layerNode.type = 1; //0：代表分组 1：代表分组下的图层
      layerNode.isActive = objValue.isActive;
      layerNode.iconName = objValue.iconName;
      layerNode.listViewColumn = objValue.listViewColumn,
        layerNode.layerIndex = objValue.layerIndex;
      layerNode.viewIndex = objValue.viewIndex;
      if (_featurType === objValue.layerType) {
        returnLayers.push(layerNode);
      }
    });
    return returnLayers;
  },
  //取得分组下的所有图层
  GetALLFeatureChild(featrueLayers) {
    let returnLayers = [];
    _.forEach(featrueLayers, objValue => {
      if (objValue.layerTypeCountHide) return
      let layerNode = {};
      layerNode.value = objValue.layerName;
      layerNode.id = objValue.layerName;
      layerNode.label = objValue.layerCName;
      layerNode.type = 1; //0：代表分组 1：代表分组下的图层
      layerNode.isActive = objValue.isActive;
      layerNode.iconName = objValue.iconName;
      layerNode.listViewColumn = objValue.listViewColumn,
        layerNode.layerIndex = objValue.layerIndex;
      layerNode.viewIndex = objValue.viewIndex;
      returnLayers.push(layerNode);
    });
    return returnLayers;
  },
  /**
   * 根据分组名称获取，当前分组下的对应的图层
   * @param {图层组名称} groupName 
   * @param {图层类型} layerType 
   */
  getGroupLayerByType(groupName, layerType) {
    let layerGroup = _.filter(MapConfigure.FeatureLayerGroup, groupValue => {
      return groupValue.groupName === groupName;
    });

    let retrunValue = "";
    if (layerGroup.length > 0) {
      _.forEach(layerGroup[0].featureLayers, featureValue => {
        if (featureValue.layerType === layerType) {
          retrunValue = featureValue.layerName;
        }
      });
    }
    return retrunValue;
  },
  //根据图层名称获取图层
  getLayerFeatureByName(layerName) {
    let layerFeature
    let layerCollection = _.map(
      MapConfigure.FeatureLayerGroup,
      objValue => {
        let fResult = _.filter(objValue.featureLayers, objLayerName => {
          return objLayerName.layerName === layerName;
        });
        return fResult.length > 0 && fResult;
      }
    );
    _.forEach(layerCollection, item => {
      if (item) {
        layerFeature = item[0]
      }
    })
    return layerFeature
  },
  //根据图层typr获取图层
  getLayerFeatureByType(type) {
    let layerFeature
    let layerCollection = _.map(
      MapConfigure.FeatureLayerGroup,
      objValue => {
        let fResult = _.filter(objValue.featureLayers, objLayerName => {
          return objLayerName.layerType === type;
        });
        return fResult.length > 0 && fResult;
      }
    );
    layerFeature = []
    _.forEach(layerCollection, item => {
      if (item) {
        layerFeature.push(...item)
      }
    })
    return layerFeature
  },
  //是否获取可以编辑属性的图层
  getNeedLayerChildren(item, edit) {
    let featureLayers = _.filter(item.featureLayers, item => {
      return !item.layerTypeCountHide
    })


    if (edit) {
      featureLayers = _.filter(featureLayers, featureLayer => {
        return _.filter(GisTableColumn[featureLayer.listViewColumn], clumn => {
          return clumn.isEdit
        }).length
      })
    }

    return _.map(featureLayers, ele => {
      return {
        listViewColumn: ele.listViewColumn,
        iconName: ele.iconName,
        layerType: ele.layerType,
        value: ele.layerName,
        label: ele.layerCName,
        type: 1, //0：代表分组 1：代表分组下的图层
        layerNode: ele.viewIndex,
      }
    })
  },
  //根据页面获取相应需要展示的图层 所在页面标识  是否为功能图层（非普通图层） 是否获取可以编辑属性的图层
  getNeedLayer(type, menuFeature, edit) {
    let layerCollection = _.filter(MapConfigure.FeatureLayerGroup, objValue => {
      return menuFeature ? !objValue.isEnable : objValue.isEnable;
    });
    if (type) {
      if (type instanceof Array) {
        layerCollection = _.map(layerCollection, objValue => {
          let fResult = _.filter(objValue.featureLayers, objLayerName => {
            if (!objLayerName.layerTypeCountHide || menuFeature) {
              return _.indexOf(type, objLayerName.layerType) + 1;
            }
          });
          return Object.assign({}, objValue, {
            featureLayers: fResult
          });
        });
      } else {
        layerCollection = _.map(layerCollection, objValue => {
          let fResult = _.filter(objValue.featureLayers, objLayerName => {
            if (!objLayerName.layerTypeCountHide || menuFeature) {
              return objLayerName.layerType === type
            }
          });
          return Object.assign({}, objValue, {
            featureLayers: fResult
          });
        });
      }
    }
    let layerData = layerCollection[0].featureLayers //图层下拉数组信息
    let layerDataValue = layerData[0].layerName //图层下拉数组选中信息
    let groupLayerDataValue = [layerCollection[0].groupName, layerDataValue] //联动select下拉数组选中信息
    layerData = _.map(layerCollection, item => {
      let children = this.getNeedLayerChildren(item, edit)
      return {
        layerNode: item.viewIndex,
        type: 0, //0：代表分组 1：代表分组下的图层
        value: item.groupName,
        label: item.groupCName,
        children: children
      }
    })
    layerDataValue = layerData[0].children[0].value
    groupLayerDataValue[1] = layerDataValue

    layerCollection.length == 1 && (layerData = layerData[0].children)
    return [layerCollection, layerData, layerDataValue, groupLayerDataValue]
  }
};
//地图操作常量数据
export const LAYER_NAME_MAP = {
  NodeLayer: "NodeLayer", //节点图层
  PipeLineLayer: "PipeLineLayer", //管线图层
  pipe: '管线',
  node: '节点'
}

//ArcGIS 版本号
export const JS_API_VERSION = 3.29;
let ArcgisCSSUrl = config.apiPath.ArcgisCSSUrl
export const ArcgisCSS = `${ArcgisCSSUrl}/library/${JS_API_VERSION}/${JS_API_VERSION}/esri/css/esri.css`;
export const ArcgisJS = `${ArcgisCSSUrl}/library/${JS_API_VERSION}/${JS_API_VERSION}/init.js`;