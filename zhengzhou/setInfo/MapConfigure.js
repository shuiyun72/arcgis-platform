//图层类别
var arcGisMapConfig = {
  LayerType:{
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
    WatermeterboxTypeNO: 14 //水表箱
  },
  MapConfigure:{
    lods: [
      {"level" : 0, "resolution" : 264.5838625010584, "scale" : 1000000},
      {"level" : 1, "resolution" : 132.2919312505292, "scale" : 500000},
      {"level" : 2, "resolution" : 66.1459656252646 , "scale" : 250000},
      {"level" : 3, "resolution" : 33.0729828126323, "scale" : 125000},
      {"level" : 4, "resolution" : 16.933367200067735, "scale" : 64000},
      {"level" : 5, "resolution" : 8.466683600033868, "scale" : 32000},
      {"level" : 6, "resolution" : 4.233341800016934, "scale" : 16000},
      {"level" : 7, "resolution" : 2.116670900008467, "scale" : 8000},
      {"level" : 8, "resolution" : 1.0583354500042335, "scale" : 4000},
      {"level" : 9, "resolution" : 0.5291677250021167, "scale" : 2000},
      {"level" : 10, "resolution" : 0.26458386250105836, "scale" :1000},
      {"level" : 11, "resolution" : 0.13229193125052918, "scale" :  500},
      {"level" : 12, "resolution" : 0.066145965, "scale" : 250},
      {"level" : 13, "resolution" : 0.0330729825, "scale" : 125},
      {"level" : 14, "resolution" : 0.01653649125, "scale" : 64},
      {"level" : 15, "resolution" : 0.008268245625, "scale" : 32},
      // {"level" : 16, "resolution" : 0.0041341228125, "scale" : 16},
      // {"level" : 17, "resolution" : 0.0020670614062, "scale" : 8},
      // {"level" : 18, "resolution" : 0.0010335307031, "scale" : 4},
      // {"level" : 19, "resolution" : 0.0005167653515, "scale" : 2},
      // {"level" : 20, "resolution" : 0.000258382675, "scale" : 1},
    ],
    //基础图层
    BaseLayers: [
    //   {
    //   layerCName: "遥感图", //图层中文名称
    //   layerName: 'SatellLayer', //图层编号
    //   viewIndex: 1, //图层显示顺序
    //   transValue: 100, //透明度
    //   iconName: "Layer-Diqiu.png", //图层缩略图
    //   layerURL: "http://192.168.0.123:6080/arcgis/rest/services/hb/HB_yxt/MapServer", //空间数据地址
    //   isActive: false //默认显示与隐藏
    // },
     {
      layerCName: "街道图", //图层中文名称
      layerName: 'StreetLayer', //图层编号
      viewIndex: 2, //图层显示顺序
      transValue: 100, //透明度
      iconName: "Layer-JieDao.png", //图层缩略图
      layerURL: "http://47.104.3.68:6080/arcgis/rest/services/hb/HB_jdt/MapServer", //空间数据地址
      isActive: true //默认显示与隐藏
    }, 
    {
      layerCName: "地形图", //图层中文名称
      layerName: 'TerrainLayer', //图层编号
      viewIndex: 3, //图层显示顺序
      transValue: 100, //透明度
      iconName: "Layer-GuanWang.png", //图层缩略图
      layerURL: "http://47.104.3.68:6080/arcgis/rest/services/hb/HB_vector_new/MapServer", //空间数据地址
      isActive: false //默认显示与隐藏
    }],
    //POI数据定位查询
    POILayers: {
      groupCName: "POI查询图层", //图层中文名称
      groupName: 'GroupPOI', //图层编号
      layerURL: "http://47.104.3.68:6080/arcgis/rest/services/hb/HB_POI/MapServer", //空间数据地址
      featureLayers: [{
        layerCName: "点", //图层中文名称
        layerName: 'POILayer', //图层编号
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
      GeometryService: "http://47.104.3.68:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer",
      //打印服务
      PrintService: "http://47.104.3.68:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
      //等高线服务
      dgxService: "http://47.104.3.68:6080/arcgis/rest/services/hb/HB_DGX/MapServer/0",
    },
    //特征图层配置
    FeatureLayerGroup: [
      {
        groupCName: "冷水管网", //特征图层中文名称
        groupName: "ColdWaterLayer", //英文名称
        layerURL: "http://47.104.3.68:6080/arcgis/rest/services/hb/HB_pipe/MapServer", //图层基础URL地址
        GPService: "http://47.104.3.68:6080/arcgis/rest/services/hb/连通性分析/GPServer/连通性分析", //分析服务地址
      }
    ],
    //地图中心点
    MapCenter: {
      Center_X: 525044.2472089946,
      Center_Y: 3958462.448799199,
      Center_Zoom: 7
    },
    MapExtent: {
      XMin: 518960.1425333049,
      YMin: 3949388.8184185126,
      XMax: 530552.1703603537,
      YMax: 3962982.556834628,
      SpatialReference: 4547
    },
    //比例尺缩放到哪个级别时切换地图
    MapChange: {
      MapZoomLevel:20
    },
    Coordinates_Type: {
      Map_Coordinates: 1
    },
  }
}