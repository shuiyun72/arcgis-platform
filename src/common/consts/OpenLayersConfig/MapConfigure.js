export const MapConfigure = {
    //地图地址配置
    url: {

        //遥感
        urlSatell: "http://39.100.62.29:6080/arcgis/rest/services/zz/ZZ_yxt/MapServer",
        //管线
        urlPipeLine: "http://39.100.62.29:6080/arcgis/rest/services/zz/ZZ_pipe/MapServer",
    },
    //坐标类型定义
    CoordinateDefinition: [
        // {
         
        //     DeFineName: "1233",
        //     DefineContent: "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
        //     IsDeFault: false
        // },
        // {
        //     DeFineName: "EPSG:4490",
        //     DefineContent: "+proj=longlat +ellps=GRS80 +no_defs",
        //     IsDeFault: false
        // }
    ],
    //地图中心点
    MapCenter: {
        Center_X: 113.563439,
        Center_Y: 34.823981,
        Center_Zoom: 3
    },
    MapExtent: {
        XMin: 113.35975811932538,
        YMin: 34.7501362981023,
        XMax: 113.71391131426837,
        YMax: 34.876861366065775,
        SpatialReference: 4326
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
            layerCName: "阀门孔", //图层中文名称
            layerName: 'Valvehole', //图层编号
            IconName: 'Valvehole', //icon
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
            layerCName: "阀门", //图层中文名称
            layerName: 'valve', //图层编号
            IconName: 'valve', //icon
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
            layerCName: "水表", //图层中文名称
            layerName: 'Watermeter', //图层编号
            IconName: 'Watermeter', //icon
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
            layerCName: "阀门井", //图层中文名称
            layerName: 'valvewell', //图层编号
            IconName: 'valvewell', //icon
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
            layerCName: "检修井 ", //图层中文名称
            layerName: 'Servicingwell', //图层编号
            IconName: 'Servicingwell', //icon
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
            layerCName: "排污井", //图层中文名称
            layerName: 'Drainwell', //图层编号
            IconName: 'Drainwell', //icon
            layerIndex: 6, //对应ArcGis图层编号
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
            layerIndex: 7, //对应ArcGis图层编号
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
            layerCName: "排气阀", //图层中文名称
            layerName: 'Exhaustvalve', //图层编号
            IconName: 'Exhaustvalve', //icon
            layerIndex: 8, //对应ArcGis图层编号
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
            layerIndex: 9, //对应ArcGis图层编号
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
            layerCName: "消防井", //图层中文名称
            layerName: 'Firefightingwell', //图层编号
            IconName: 'Firefightingwell', //icon
            layerIndex: 10, //对应ArcGis图层编号
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
            layerCName: "消防栓", //图层中文名称
            layerName: 'FireHydrant', //图层编号
            IconName: 'FireHydrant', //icon
            layerIndex: 11, //对应ArcGis图层编号
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
            layerCName: "变材点", //图层中文名称
            layerName: 'Variablematerialpoint', //图层编号
            IconName: 'Variablematerialpoint', //icon
            layerIndex: 12, //对应ArcGis图层编号
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
            layerCName: "加压泵站", //图层中文名称
            layerName: 'Pressurizedstation', //图层编号
            IconName: 'Pressurizedstation', //icon
            layerIndex: 13, //对应ArcGis图层编号
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
            layerCName: "变径", //图层中文名称
            layerName: 'Variablediameter', //图层编号
            IconName: 'Variablediameter', //icon
            layerIndex: 14, //对应ArcGis图层编号
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
            layerName: 'Meterwell', //图层编号
            IconName: 'Meterwell', //icon
            layerIndex: 15, //对应ArcGis图层编号
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
            layerCName: "出水口", //图层中文名称
            layerName: 'Outlet', //图层编号
            IconName: 'Outlet', //icon
            layerIndex: 16, //对应ArcGis图层编号
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
            layerCName: "管堵", //图层中文名称
            layerName: 'Pipeplugging', //图层编号
            IconName: 'Pipeplugging', //icon
            layerIndex: 17, //对应ArcGis图层编号
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
            layerCName: "弯头", //图层中文名称
            layerName: 'Elbow', //图层编号
            IconName: 'Elbow', //icon
            layerIndex: 18, //对应ArcGis图层编号
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
            layerCName: "三通", //图层中文名称
            layerName: 'Tee', //图层编号
            IconName: 'Tee', //icon
            layerIndex: 19, //对应ArcGis图层编号
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
            layerCName: "四通", //图层中文名称
            layerName: 'Fourlinks', //图层编号
            IconName: 'Fourlinks', //icon
            layerIndex: 20, //对应ArcGis图层编号
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
            layerCName: "非普查区", //图层中文名称
            layerName: 'NonCensusArea', //图层编号
            IconName: 'NonCensusArea', //icon
            layerIndex: 21, //对应ArcGis图层编号
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
            layerIndex: 22, //对应ArcGis图层编号
            isSpatialSearch: true,
            isActive: true, //是否显示
            featureColumn: [ //点选显示
                {
                    field: "OBJECTID ",
                    text: "编号",
                },
            ]
        },
        // //结尾
        // {
        //     layerCName: "点位",
        //     layerName: 'ExhaustvalveLayer',
        //     layerIndex: 1,
        //     isSpatialSearch: true,
        //     layerTableName: "Exhaustvalve",
        //     listViewColumn: "E_Exhaustvalve_Columns",
        //     isActive: true,
        //     viewIndex: 2,
        //     featureColumn: [{
        //         field: "equipment_number",
        //         text: "编号",
        //         type: "Number"
        //     },
        //     {
        //         field: "material_science",
        //         text: "材质"
        //     },
        //     {
        //         field: "caliber",
        //         text: "口径",
        //         type: "Number"
        //     },
        //     {
        //         field: "elevation",
        //         text: "高程",
        //         type: "Number"
        //     },
        //     {
        //         field: "depth",
        //         text: "埋深",
        //         type: "Number"
        //     },
        //     {
        //         field: "Installation_address",
        //         text: "安装地址"
        //     },
        //     {
        //         field: "management_unit",
        //         text: "管理单位"
        //     },
        //     {
        //         field: "completion_date",
        //         text: "竣工日期",
        //         type: "Data"
        //     },
        //     {
        //         field: "laying_age",
        //         text: "敷设年代",
        //         type: "Number"
        //     },
        //     {
        //         field: "embedding_mode",
        //         text: "埋设方式"
        //     },
        //     {
        //         field: "equipment_type",
        //         text: "设备类型"
        //     },
        //     {
        //         field: "coordinate_x",
        //         text: "横坐标",
        //         type: "Number"
        //     },
        //     {
        //         field: "coordinate_y",
        //         text: "纵坐标",
        //         type: "Number"
        //     },
        //     {
        //         field: "Interface_form",
        //         text: "接口形式"
        //     },
        //     {
        //         field: "specifications",
        //         text: "规格"
        //     },
        //     {
        //         field: "manufacturer",
        //         text: "生产厂家"
        //     },
        //     {
        //         field: "businessarea",
        //         text: "营业片区"
        //     }
        //     ]
        // }
    ]

}
export default MapConfigure;