//管线Feature显示详细内容
export const PipeFeatureColumn= [ //点选显示
    {field: "equipment_number",text: "物探编号"},
    {field: "material_science",text: "材质"},
    {field: "caliber",text: "口径",type: "Number"},
    {field: "length",text: "长度",type: "Number"},
    {field: "startingpoint_elevation",text: "起点高程",type: "Number"},
    {field: "endpoint_elevation",text: "终点高程",type: "Number"},
    {field: "Installation_address",text: "道路名"},
    {field: "construction_unit",text: "施工单位"},
    {field: "management_unit",text: "管理单位"},
    {field: "completion_date",text: "竣工日期"},
    {field: "laying_age",text: "敷设年代"},
    {field: "startingpoint_depth",text: "起点埋深",type: "Number"},
    {field: "endpoint_depth",text: "终点埋深",type: "Number"},
    {field: "embedding_mode",text: "埋设方式"},
    {field: "Interface_form",text: "接口形式"}
  ];

//阀门Feature显示详细内容
export const ValveFeatureColumn=[
  {field: "equipment_number",text: "阀门编号"},
  {field: "material_science",text: "材质"},
  {field: "caliber",text: "口径",type: "Number"},
  {field: "elevation",text: "高程",type: "Number"},
  {field: "depth",text: "埋深",type: "Number"},
  {field: "Installation_address",text: "安装地址"},
  {field: "construction_unit",text: "管理单位"},
  {field: "completion_date",text: "竣工日期",type: "Data"},
  {field: "laying_age",text: "敷设年代"},
  {field: "embedding_mode",text: "埋设方式",sortable: true,width: 120,align: "center"},
  {field: "coordinate_x",text: "横坐标",type: "Number"},
  {field: "coordinate_y",text: "纵坐标",type: "Number"},
  {field: "switch_type",text: "开关类型"},
  {field: "equipment_type",text: "设备类型"},
  {field: "switchingstate",text: "开关状态"},
  {field: "Interface_form",text: "接口形式"},
  {field: "businessarea",text: "营业片区"}
];

//消火栓Feature显示详细内容
export const FirehydrantFeatureColumn= [
  {field: "equipment_number",text: "物探编号"},
  {field: "material_science",text: "材质"},
  {field: "caliber",text: "口径",type: "Number"},
  {field: "elevation",text: "高程",type: "Number"},
  {field: "depth",text: "埋深",type: "Number"},
  {field: "Installation_address",text: "安装地址"},
  {field: "management_unit",text: "管理单位"},
  {field: "completion_date",text: "竣工日期"},
  {field: "laying_age",text: "敷设年代"},
  {field: "embedding_mode",text: "埋设方式"},
  {field: "equipment_type",text: "设备类型"},
  {field: "coordinate_x",text: "横坐标",type: "Number"},
  {field: "coordinate_y",text: "纵坐标",type: "Number"},
  {field: "Interface_form",text: "接口形式"},
  {field: "businessarea",text: "营业片区"}
];

//排气阀Feature显示详细内容
export const ExhaustvalveFeatureColumn= [
    {field: "equipment_number",text: "物探编号"},
    {field: "material_science",text: "材质"},
    {field: "caliber",text: "口径",type: "Number"},
    {field: "elevation",text: "高程",type: "Number"},
    {field: "depth",text: "埋深",type: "Number"},
    {field: "Installation_address",text: "安装地址"},
    {field: "management_unit",text: "管理单位"},
    {field: "completion_date",text: "竣工日期"},
    {field: "laying_age",text: "敷设年代"},
    {field: "embedding_mode",text: "埋设方式"},
    {field: "equipment_type",text: "设备类型"},
    {field: "coordinate_x",text: "横坐标",type: "Number"},
    {field: "coordinate_y",text: "纵坐标",type: "Number"},
    {field: "Interface_form",text: "接口形式"},
    {field: "specifications",text: "规格"},
    {field: "manufacturer",text: "生产厂家"},
    {field: "businessarea",text: "营业片区"}
  ];

//水表井Feature显示详细内容
export const WatermeterwellFeatureColumn= [
  {field: "equipment_number",text: "物探编号"},
  {field: "material_science",text: "材质"},
  {field: "caliber",text: "口径",type: "Number"},
  {field: "elevation",text: "高程",type: "Number"},
  {field: "depth",text: "埋深",type: "Number"},
  {field: "Installation_address",text: "安装地址"},
  {field: "management_unit",text: "管理单位"},
  {field: "completion_date",text: "竣工日期"},
  {field: "laying_age",text: "敷设年代"},
  {field: "embedding_mode",text: "埋设方式"},
  {field: "equipment_type",text: "设备类型"},
  {field: "coordinate_x",text: "横坐标",type: "Number"},
  {field: "coordinate_y",text: "纵坐标",type: "Number"},
  {field: "Interface_form",text: "接口形式"},
  {field: "specifications",text: "规格"},
  {field: "manufacturer",text: "生产厂家"},
  {field: "businessarea",text: "营业片区"},
  {field: "totallisthouseholds",text: "总表户"},
  {field: "tablenumber",text: "表号"},
  {field: "username",text: "用户名"}
  ];

//三通Feature显示详细内容
export const TeeFeatureColumns = [
  {field: "equipment_number",text: "物探编号"},
  {field: "material_science",text: "材质"},
  {field: "caliber",text: "口径",type: "Number"},
  {field: "elevation",text: "高程",type: "Number"},
  {field: "depth",text: "埋深",type: "Number"},
  {field: "Installation_address",text: "安装地址"},
  {field: "management_unit",text: "管理单位"},
  {field: "completion_date",text: "竣工日期"},
  {field: "laying_age",text: "敷设年代"},
  {field: "embedding_mode",text: "埋设方式"},
  {field: "equipment_type",text: "设备类型"},
  {field: "coordinate_x",text: "横坐标",type: "Number"},
  {field: "coordinate_y",text: "纵坐标",type: "Number"},
  {field: "Interface_form",text: "接口形式"},
  {field: "specifications",text: "规格"},
  {field: "manufacturer",text: "生产厂家"},
  {field: "businessarea",text: "营业片区"}
  ];

//弯头Feature显示详细内容
export const ElbowFeatureColumns = [
  {field: "equipment_number",text: "物探编号"},
  {field: "material_science",text: "材质"},
  {field: "caliber",text: "口径",type: "Number"},
  {field: "elevation",text: "高程",type: "Number"},
  {field: "depth",text: "埋深",type: "Number"},
  {field: "Installation_address",text: "安装地址"},
  {field: "management_unit",text: "管理单位"},
  {field: "completion_date",text: "竣工日期"},
  {field: "laying_age",text: "敷设年代"},
  {field: "embedding_mode",text: "埋设方式"},
  {field: "equipment_type",text: "设备类型"},
  {field: "coordinate_x",text: "横坐标",type: "Number"},
  {field: "coordinate_y",text: "纵坐标",type: "Number"},
  {field: "Interface_form",text: "接口形式"},
  {field: "specifications",text: "规格"},
  {field: "manufacturer",text: "生产厂家"},
  {field: "businessarea",text: "营业片区"}
  ];

//减压阀
export const PressurereliefvalveFeatureColumns = [
  {field: "equipment_number",text: "物探编号"},
  {field: "material_science",text: "材质"},
  {field: "caliber",text: "口径",type: "Number"},
  {field: "elevation",text: "高程",type: "Number"},
  {field: "depth",text: "埋深",type: "Number"},
  {field: "Installation_address",text: "安装地址"},
  {field: "management_unit",text: "管理单位"},
  {field: "completion_date",text: "竣工日期"},
  {field: "laying_age",text: "敷设年代"},
  {field: "embedding_mode",text: "埋设方式"},
  {field: "equipment_type",text: "设备类型"},
  {field: "coordinate_x",text: "横坐标",type: "Number"},
  {field: "coordinate_y",text: "纵坐标",type: "Number"},
  {field: "Interface_form",text: "接口形式"},
  {field: "specifications",text: "规格"},
  {field: "manufacturer",text: "生产厂家"},
  {field: "businessarea",text: "营业片区"}
  ];

//连接点
export const ConnectionpointFeatureColumns = [
  {field: "equipment_number",text: "物探编号"},
  {field: "material_science",text: "材质"},
  {field: "caliber",text: "口径",type: "Number"},
  {field: "elevation",text: "高程",type: "Number"},
  {field: "depth",text: "埋深",type: "Number"},
  {field: "Installation_address",text: "安装地址"},
  {field: "management_unit",text: "管理单位"},
  {field: "completion_date",text: "竣工日期"},
  {field: "laying_age",text: "敷设年代"},
  {field: "embedding_mode",text: "埋设方式"},
  {field: "equipment_type",text: "设备类型"},
  {field: "coordinate_x",text: "横坐标",type: "Number"},
  {field: "coordinate_y",text: "纵坐标",type: "Number"},
  {field: "Interface_form",text: "接口形式"},
  {field: "specifications",text: "规格"},
  {field: "manufacturer",text: "生产厂家"},
  {field: "businessarea",text: "营业片区"}
  ];

//水表Feature显示详细内容
export const WaterMeterFeatureColumn=[
  {field: "equipment_number",text: "物探编号"},
  {field: "material_science",text: "材质"},
  {field: "caliber",text: "口径",type: "Number"},
  {field: "elevation",text: "高程",type: "Number"},
  {field: "depth",text: "埋深",type: "Number"},
  {field: "Installation_address",text: "安装地址"},
  {field: "management_unit",text: "管理单位"},
  {field: "completion_date",text: "竣工日期"},
  {field: "laying_age",text: "敷设年代"},
  {field: "embedding_mode",text: "埋设方式"},
  {field: "equipment_type",text: "设备类型"},
  {field: "coordinate_x",text: "横坐标",type: "Number"},
  {field: "coordinate_y",text: "纵坐标",type: "Number"},
  {field: "Interface_form",text: "接口形式"},
  {field: "specifications",text: "规格"},
  {field: "manufacturer",text: "生产厂家"},
  {field: "businessarea",text: "营业片区"}
  ];
  
//阀门井Feature显示详细内容
export const ValveWellFeatureColumn=[
  {field: "equipment_number",text: "物探编号"},
  {field: "material_science",text: "材质"},
  {field: "caliber",text: "口径",type: "Number"},
  {field: "elevation",text: "高程",type: "Number"},
  {field: "depth",text: "埋深",type: "Number"},
  {field: "Installation_address",text: "安装地址"},
  {field: "management_unit",text: "管理单位"},
  {field: "completion_date",text: "竣工日期"},
  {field: "laying_age",text: "敷设年代"},
  {field: "embedding_mode",text: "埋设方式"},
  {field: "equipment_type",text: "设备类型"},
  {field: "coordinate_x",text: "横坐标",type: "Number"},
  {field: "coordinate_y",text: "纵坐标",type: "Number"},
  {field: "Interface_form",text: "接口形式"},
  {field: "businessarea",text: "营业片区"}
];

//消防井Feature显示详细内容
export const FirefightingwellFeatureColumn= [
    {field: "equipment_number",text: "物探编号"},
    {field: "material_science",text: "材质"},
    {field: "caliber",text: "口径",type: "Number"},
    {field: "elevation",text: "高程",type: "Number"},
    {field: "depth",text: "埋深",type: "Number"},
    {field: "Installation_address",text: "安装地址"},
    {field: "management_unit",text: "管理单位"},
    {field: "completion_date",text: "竣工日期"},
    {field: "laying_age",text: "敷设年代"},
    {field: "embedding_mode",text: "埋设方式"},
    {field: "equipment_type",text: "设备类型"},
    {field: "coordinate_x",text: "横坐标",type: "Number"},
    {field: "coordinate_y",text: "纵坐标",type: "Number"},
    {field: "Interface_form",text: "接口形式"},
    {field: "businessarea",text: "营业片区"}
  ];

//检修井Feature显示详细内容
export const ServicingwellFeatureColumn=[
    {field: "equipment_number",text: "物探编号"},
    {field: "material_science",text: "材质"},
    {field: "caliber",text: "口径",type: "Number"},
    {field: "elevation",text: "高程",type: "Number"},
    {field: "depth",text: "埋深",type: "Number"},
    {field: "Installation_address",text: "安装地址"},
    {field: "management_unit",text: "管理单位"},
    {field: "completion_date",text: "竣工日期"},
    {field: "laying_age",text: "敷设年代"},
    {field: "embedding_mode",text: "埋设方式"},
    {field: "equipment_type",text: "设备类型"},
    {field: "coordinate_x",text: "横坐标",type: "Number"},
    {field: "coordinate_y",text: "纵坐标",type: "Number"},
    {field: "Interface_form",text: "接口形式"},
    {field: "businessarea",text: "营业片区"}
    ];

//水表箱
export const WatermeterboxFeatureColumns = [
  {field: "equipment_number",text: "物探编号"},
  {field: "material_science",text: "材质"},
  {field: "caliber",text: "口径",type: "Number"},
  {field: "elevation",text: "高程",type: "Number"},
  {field: "depth",text: "埋深",type: "Number"},
  {field: "Installation_address",text: "安装地址"},
  {field: "management_unit",text: "管理单位"},
  {field: "completion_date",text: "竣工日期"},
  {field: "laying_age",text: "敷设年代"},
  {field: "embedding_mode",text: "埋设方式"},
  {field: "equipment_type",text: "设备类型"},
  {field: "coordinate_x",text: "横坐标",type: "Number"},
  {field: "coordinate_y",text: "纵坐标",type: "Number"},
  {field: "Interface_form",text: "接口形式"},
  {field: "specifications",text: "规格"},
  {field: "manufacturer",text: "生产厂家"},
  {field: "businessarea",text: "营业片区"},
  {field: "totallisthouseholds",text: "总表户"},
  {field: "tablenumber",text: "表号"},
  {field: "username",text: "用户名"}
  ];

