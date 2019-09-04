  export const MapConfigure = {
      //地图地址配置
      url: {
          //街道
          urlStreet: "http://192.168.0.123:6080/arcgis/rest/services/hb/HB_jdt/MapServer",
          //遥感
          urlSatell: "http://192.168.0.123:6080/arcgis/rest/services/hb/HB_yxt/MapServer",
          //管线
          urlPipeLine: "http://192.168.0.123:6080/arcgis/rest/services/hb/HB_pipe/MapServer",
          //地形图
          urlTerrain: "http://192.168.0.123:6080/arcgis/rest/services/hb/HB_vector_new/MapServer",

          //编辑
          urlbianji: "http://106.3.45.220:6080/arcgis/rest/services/china_region/MapServer",
          //几何服务=》
          GeometryService: "http://192.168.0.123:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer",
          //打印服务
          PrintService: "http://192.168.0.123:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
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
          Center_X: 525044.2472089946,
          Center_Y: 3958462.448799199,
          Center_Zoom: 3
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
          layerCName: "管线", //图层中文名称
          layerName: 'PipeLineLayer', //图层编号
          layerIndex: 9, //对应ArcGis图层编号
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
          layerCName: "排气阀",
          layerName: 'ExhaustvalveLayer',
          layerIndex: 8,
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
      }, {
          layerCName: "消防井",
          layerName: 'FirefightingwellLayer',
          layerIndex: 7,
          isSpatialSearch:true,
          layerTableName: "Firefightingwell",
          listViewColumn: "E_Firefightingwell_Columns",
          isActive: true,
          viewIndex: 3,
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
                  field: "businessarea",
                  text: "营业片区"
              }
          ]
      }, {
          layerCName: "消火栓",
          layerName: 'FirehydrantLayer',
          layerIndex: 6,
          isSpatialSearch:true,
          layerTableName: "Firehydrant",
          listViewColumn: "E_Firehydrant_Columns",
          isActive: true,
          viewIndex: 4,
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
                  field: "businessarea",
                  text: "营业片区"
              }
          ]
      }, {
          layerCName: "检修井 ",
          layerName: 'ServicingwellLayer',
          layerIndex: 5,
          isSpatialSearch:true,
          layerTableName: "Servicingwell",
          listViewColumn: "E_Servicingwell_Columns",
          isActive: true,
          viewIndex: 5,
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
                  field: "businessarea",
                  text: "营业片区"
              }
          ]
      }, {
          layerCName: "阀门 ",
          layerName: 'ValveLayer',
          layerIndex: 4,
          isSpatialSearch:true,
          layerTableName: "Valve",
          listViewColumn: "E_Valve_Columns",
          isActive: true,
          viewIndex: 6,
          featureColumn: [{
                  field: "equipment_number",
                  text: "阀门编号",
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
                  field: "construction_unit",
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
                  text: "埋设方式",
                  sortable: true,
                  width: 120,
                  align: "center"
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
                  field: "switch_type",
                  text: "开关类型"
              },
              {
                  field: "equipment_type",
                  text: "设备类型"
              },
              {
                  field: "switchingstate",
                  text: "开关状态"
              },
              {
                  field: "Interface_form",
                  text: "接口形式"
              },
              {
                  field: "businessarea",
                  text: "营业片区"
              }
          ]
      }, {
          layerCName: "阀门井 ",
          layerName: 'ValvewellLayer',
          layerIndex: 3,
          isSpatialSearch:true,
          layerTableName: "Valvewell",
          listViewColumn: "E_Valvewell_Columns",
          isActive: true,
          viewIndex: 7,
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
                  field: "businessarea",
                  text: "营业片区"
              }
          ]
      }, {
          layerCName: "水表井",
          layerName: 'WatermeterwellLayer',
          layerIndex: 2,
          isSpatialSearch:true,
          layerTableName: "Watermeterwell",
          listViewColumn: "E_Watermeterwell_Columns",
          isActive: true,
          viewIndex: 8,
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
              },
              {
                  field: "totallisthouseholds",
                  text: "总表户"
              },
              {
                  field: "tablenumber",
                  text: "表号"
              },
              {
                  field: "username",
                  text: "用户名"
              }
          ]
      }, {
          layerCName: "水表",
          layerName: 'WaterMeterLayer',
          layerIndex: 1,
          isSpatialSearch:true,
          layerTableName: "WaterMeter",
          listViewColumn: "E_WaterMeter_Columns",
          isActive: true,
          viewIndex: 9,
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