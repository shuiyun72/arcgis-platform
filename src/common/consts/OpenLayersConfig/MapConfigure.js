  export const MapConfigure = {
      //地图地址配置
      url: {
          
          //遥感
          urlSatell: "http://39.100.62.29:6080/arcgis/rest/services/zz/ZZ_yxt/MapServer",
          //管线
          urlPipeLine: "http://39.100.62.29:6080/arcgis/rest/services/zz/ZZ_pipe/MapServer",
         
      },
      //坐标类型定义
      CoordinateDefinition: [{
              DeFineName: "EPSG:4547",
              DefineContent: "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
              IsDeFault: true
          },
          {
              DeFineName: "EPSG:4490",
              DefineContent: "+proj=longlat +ellps=GRS80 +no_defs",
              IsDeFault: false
          }
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
          MapZoomLevel: 10
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
      LayerConfiguration: [{
        layerCName: "标识", //图层中文名称
        layerName: 'PipeMarkLayer', //图层编号
        layerIndex: 0, //对应ArcGis图层编号
        isSpatialSearch:false,
        layerTableName: "PipeMark", //数据库表名
        listViewColumn: "E_PipeMark_Columns", //对应前端列表控件列
        viewIndex: 1, //图层显示顺序
        isActive: true, //是否显示
        featureColumn: [ //点选显示
            {
                field: "equipment_number",
                text: "管线编号",
                type: "Number"
            },
            {
                field: "material_science",
                text: "材质"
            },
            {
                field: "caliber",
                text: "口径",
                type: "Number"
            },
            {
                field: "length",
                text: "长度",
                type: "Number"
            },
            {
                field: "startingpoint_elevation",
                text: "起点高程",
                type: "Number"
            },
            {
                field: "endpoint_elevation",
                text: "终点高程",
                type: "Number"
            },
            {
                field: "Installation_address",
                text: "道路名"
            },
            {
                field: "construction_unit",
                text: "施工单位"
            },
            {
                field: "management_unit",
                text: "管理单位"
            },
            {
                field: "completion_date",
                text: "竣工日期",
                type: "Data"
            },
            {
                field: "laying_age",
                text: "敷设年代",
                type: "Number"
            },
            {
                field: "startingpoint_depth",
                text: "起点埋深",
                type: "Number"
            },
            {
                field: "endpoint_depth",
                text: "终点埋深",
                type: "Number"
            },
            {
                field: "embedding_mode",
                text: "埋设方式"
            },
            {
                field: "Interface_form",
                text: "接口形式"
            }
        ]
    },{
          layerCName: "管线", //图层中文名称
          layerName: 'PipeLineLayer', //图层编号
          layerIndex: 2, //对应ArcGis图层编号
          isSpatialSearch:false,
          layerTableName: "Pipe", //数据库表名
          listViewColumn: "E_Pipe_Columns", //对应前端列表控件列
          viewIndex: 1, //图层显示顺序
          isActive: true, //是否显示
          featureColumn: [ //点选显示
              {
                  field: "equipment_number",
                  text: "管线编号",
                  type: "Number"
              },
              {
                  field: "material_science",
                  text: "材质"
              },
              {
                  field: "caliber",
                  text: "口径",
                  type: "Number"
              },
              {
                  field: "length",
                  text: "长度",
                  type: "Number"
              },
              {
                  field: "startingpoint_elevation",
                  text: "起点高程",
                  type: "Number"
              },
              {
                  field: "endpoint_elevation",
                  text: "终点高程",
                  type: "Number"
              },
              {
                  field: "Installation_address",
                  text: "道路名"
              },
              {
                  field: "construction_unit",
                  text: "施工单位"
              },
              {
                  field: "management_unit",
                  text: "管理单位"
              },
              {
                  field: "completion_date",
                  text: "竣工日期",
                  type: "Data"
              },
              {
                  field: "laying_age",
                  text: "敷设年代",
                  type: "Number"
              },
              {
                  field: "startingpoint_depth",
                  text: "起点埋深",
                  type: "Number"
              },
              {
                  field: "endpoint_depth",
                  text: "终点埋深",
                  type: "Number"
              },
              {
                  field: "embedding_mode",
                  text: "埋设方式"
              },
              {
                  field: "Interface_form",
                  text: "接口形式"
              }
          ]
      }, {
          layerCName: "点位",
          layerName: 'ExhaustvalveLayer',
          layerIndex: 1,
          isSpatialSearch:true,
          layerTableName: "Exhaustvalve",
          listViewColumn: "E_Exhaustvalve_Columns",
          isActive: true,
          viewIndex: 2,
          featureColumn: [{
                  field: "equipment_number",
                  text: "编号",
                  type: "Number"
              },
              {
                  field: "material_science",
                  text: "材质"
              },
              {
                  field: "caliber",
                  text: "口径",
                  type: "Number"
              },
              {
                  field: "elevation",
                  text: "高程",
                  type: "Number"
              },
              {
                  field: "depth",
                  text: "埋深",
                  type: "Number"
              },
              {
                  field: "Installation_address",
                  text: "安装地址"
              },
              {
                  field: "management_unit",
                  text: "管理单位"
              },
              {
                  field: "completion_date",
                  text: "竣工日期",
                  type: "Data"
              },
              {
                  field: "laying_age",
                  text: "敷设年代",
                  type: "Number"
              },
              {
                  field: "embedding_mode",
                  text: "埋设方式"
              },
              {
                  field: "equipment_type",
                  text: "设备类型"
              },
              {
                  field: "coordinate_x",
                  text: "横坐标",
                  type: "Number"
              },
              {
                  field: "coordinate_y",
                  text: "纵坐标",
                  type: "Number"
              },
              {
                  field: "Interface_form",
                  text: "接口形式"
              },
              {
                  field: "specifications",
                  text: "规格"
              },
              {
                  field: "manufacturer",
                  text: "生产厂家"
              },
              {
                  field: "businessarea",
                  text: "营业片区"
              }
          ]
      }]
  }
  export default MapConfigure;