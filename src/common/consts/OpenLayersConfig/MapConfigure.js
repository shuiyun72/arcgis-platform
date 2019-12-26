export const MapConfigure = {
    //地图地址配置
    url: {
        //遥感图
        urlSatell: "http://58.218.184.194:6080/arcgis/rest/services/fx/FX_yxt/MapServer",
        //街道图
        urlStreet: "http://58.218.184.194:6080/arcgis/rest/services/fx/FX_jdt/MapServer",
        //管线
        urlPipeLine: "http://58.218.184.194:6080/arcgis/rest/services/fx/FX_pipe/MapServer",
        urlCADVector: "http://58.218.184.194:6080/arcgis/rest/services/fx/FX_yxt/MapServer",
    },
    //坐标类型定义
    CoordinateDefinition: [
        {
            DeFineName: "EPSG:4548",
            DefineContent: "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
            IsDeFault: true
        }
    ],
    //地图中心点
    MapCenter: {
        Center_X: 462243.0952028196,
        Center_Y: 3841259.9288588683,
        Center_Zoom: 6,
        Min_Zoom: 1,
    },
    MapExtent: {
        XMin: 433715.02683222864,
        YMin: 3805779.2912019757,
        XMax: 490370.2181425005,
        YMax: 3870170.1127892,
        SpatialReference: 4548
    },
    //比例尺缩放到哪个级别时切换地图
    MapChange: {
        MapZoomLevel: 20
    },
    //坐标l类型
    Coordinates_Type: {
        Map_Coordinates: 1
    },
    //坐标l类型
    Coordinates_Type: {
        Map_Coordinates: 1
    },
    //绘图或修改图层配置
    DrawAndModifyConfiguration: {
        source: undefined
    },

    //图层配置
    LayerConfiguration: [
        {
            layerCName: "阀门", //图层中文名称
            layerName: 'valve', //图层编号
            IconName: 'valve', //icon
            layerIndex: 0, //对应ArcGis图层编号
            isSpatialSearch: true,
            isActive: true, //是否显示
            featureColumn: [ //点选显示
                {
                    field: "OBJECTID ",
                    text: "编号",
                },
            ]
        },

        {
            layerCName: "排泥井", //图层中文名称
            layerName: 'Soildischargingwell', //图层编号
            IconName: 'Soildischargingwell', //icon
            layerIndex: 1, //对应ArcGis图层编号
            isSpatialSearch: true,
            isActive: true, //是否显示
            featureColumn: [ //点选显示
                {
                    field: "OBJECTID ",
                    text: "编号",
                },
            ]
        },
        {
            layerCName: "排气井", //图层中文名称
            layerName: 'Exhaustwell', //图层编号
            IconName: 'Exhaustwell', //icon
            layerIndex: 2, //对应ArcGis图层编号
            isSpatialSearch: true,
            isActive: true, //是否显示
            featureColumn: [ //点选显示
                {
                    field: "OBJECTID ",
                    text: "编号",
                },
            ]
        },
        {
            layerCName: "水表井", //图层中文名称
            layerName: 'Watermeter', //图层编号
            IconName: 'Meterwell', //icon
            layerIndex: 3, //对应ArcGis图层编号
            isSpatialSearch: true,
            isActive: true, //是否显示
            featureColumn: [ //点选显示
                {
                    field: "OBJECTID ",
                    text: "编号",
                },
            ]
        },
        {
            layerCName: "测流井", //图层中文名称
            layerName: 'FlowMeasuringwell', //图层编号
            IconName: 'FlowMeasuringwell', //icon
            layerIndex: 4, //对应ArcGis图层编号
            isSpatialSearch: true,
            isActive: true, //是否显示
            featureColumn: [ //点选显示
                {
                    field: "OBJECTID ",
                    text: "编号",
                },
            ]
        },
        {
            layerCName: "阀门井", //图层中文名称
            layerName: 'valvewell', //图层编号
            IconName: 'valvewell', //icon
            layerIndex: 5, //对应ArcGis图层编号
            isSpatialSearch: true,
            isActive: true, //是否显示
            featureColumn: [ //点选显示
                {
                    field: "OBJECTID ",
                    text: "编号",
                },
            ]
        },
        {
            layerCName: "管网 ", //图层中文名称
            layerName: 'Pipenetwork', //图层编号
            IconName: 'pipe', //icon
            layerIndex: 6, //对应ArcGis图层编号
            isSpatialSearch: true,
            isActive: true, //是否显示
            featureColumn: [ //点选显示
                {
                    field: "OBJECTID ",
                    text: "编号",
                },
            ]
        }
    ]
}
export default MapConfigure;