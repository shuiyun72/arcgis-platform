/** 地图数据列表展示 *  */
//横断面
export const E_hd_Columns = [
  { field: "OBJECTID", text: "编号", width: 90, align: "center" },
  { field: "length", text: "长度", sortable: true, align: "center" },
  { field: "caliber", text: "口径", sortable: true, align: "center" },
  { field: "startingpoint_elevation", text: "起点高程", sortable: true, align: "center" },
  { field: "endpoint_elevation", text: "终点高程", sortable: true, align: "center" },
];
//纵断面
export const E_zd_Columns = [
  { field: "OBJECTID", text: "设备编号", width: 90, align: "center" },
  { field: "equipment_type", text: "设备类型", width: 90, align: "center" },
  { field: "SHAPE_Length", text: "长度", sortable: true, align: "center" },
  //{field: "caliber",text: "口径",sortable: true,align: "center"},
  { field: "startingpoint_elevation", text: "起点高程", sortable: true, align: "center" },
  { field: "endpoint_elevation", text: "终点高程", sortable: true, align: "center" },
];

//普通给水管线
export const E_Pipe_Columns = [
  // {field: "equipment_number",text: "管线编号",width: 90,align: "left" },
  { field: "OBJECTID", text: "编号", width: 90, align: "center" },
  { field: "material_science", text: "材质", sortable: true, align: "center" },
  { field: "caliber", text: "口径", sortable: true, align: "center", type: "Number" },
  { field: "length", text: "长度", sortable: true, align: "center", type: "Number" },
  { field: "startingpoint_elevation", text: "起点高程", sortable: true, align: "center", type: "Number" },
  { field: "endpoint_elevation", text: "终点高程", sortable: true, align: "center", type: "Number" },
  { field: "Installation_address", text: "道路名", sortable: true, align: "center" },
  { field: "construction_unit", text: "施工单位", sortable: true, align: "center" },
  { field: "management_unit", text: "管理单位", sortable: true, align: "center" },
  { field: "completion_date", text: "竣工日期", sortable: true, align: "center", type: "Date" },
  { field: "laying_age", text: "敷设年代", sortable: true, align: "center" },
  { field: "startingpoint_depth", text: "起点埋深", sortable: true, align: "center", type: "Number" },
  { field: "endpoint_depth", text: "终点埋深", sortable: true, align: "center", type: "Number" },
  { field: "embedding_mode", text: "埋设方式", sortable: true, align: "center" },
  { field: "Interface_form", text: "接口形式", sortable: true, align: "center" },
  { field: "remarks", text: "备注", sortable: true, align: "center" }
];
//阀门
export const E_Valve_Columns = [
  // {field: "equipment_number",text: "阀门编号",width: 90,align: "center"},  
  { field: "OBJECTID", text: "编号", width: 90, align: "center" },
  { field: "material_science", text: "材质", sortable: true, align: "center" },
  { field: "caliber", text: "口径", sortable: true, align: "center", type: "Number" },
  { field: "elevation", text: "高程", sortable: true, align: "center", type: "Number" },
  { field: "depth", text: "埋深", sortable: true, align: "center", type: "Number" },
  { field: "Installation_address", text: "安装地址", sortable: true, align: "center" },
  { field: "construction_unit", text: "管理单位", sortable: true, align: "center" },
  { field: "completion_date", text: "竣工日期", sortable: true, align: "center", type: "Date" },
  { field: "laying_age", text: "敷设年代", sortable: true, align: "center" },
  { field: "embedding_mode", text: "埋设方式", sortable: true, width: 120, align: "center" },
  { field: "coordinate_x", text: "横坐标", sortable: true, align: "center", type: "Number" },
  { field: "coordinate_y", text: "纵坐标", sortable: true, align: "center", type: "Number" },
  { field: "switch_type", text: "开关类型", sortable: true, align: "center" },
  { field: "equipment_type", text: "设备类型", sortable: true, align: "center" },
  { field: "switchingstate", text: "开关状态", sortable: true, align: "center" },
  { field: "Interface_form", text: "接口形式", sortable: true, align: "center" },
  { field: "businessarea", text: "营业片区", sortable: true, align: "center" }
];

//消防栓
export const E_Firehydrant_Columns = [
  // {field: "equipment_number",text: "编号",width: 90,align: "center"},
  { field: "OBJECTID", text: "编号", width: 90, align: "center" },
  { field: "material_science", text: "材质", sortable: true, align: "center" },
  { field: "caliber", text: "口径", sortable: true, align: "center", type: "Number" },
  { field: "elevation", text: "高程", sortable: true, align: "center", type: "Number" },
  { field: "depth", text: "埋深", sortable: true, align: "center", type: "Number" },
  { field: "Installation_address", text: "安装地址", sortable: true, align: "center" },
  { field: "management_unit", text: "管理单位", sortable: true, align: "center" },
  { field: "completion_date", text: "竣工日期", sortable: true, align: "center", type: "Date" },
  { field: "laying_age", text: "敷设年代", sortable: true, align: "center" },
  { field: "embedding_mode", text: "埋设方式", sortable: true, align: "center" },
  { field: "equipment_type", text: "设备类型", sortable: true, align: "center" },
  { field: "coordinate_x", text: "横坐标", sortable: true, align: "center", type: "Number" },
  { field: "coordinate_y", text: "纵坐标", sortable: true, align: "center", type: "Number" },
  { field: "Interface_form", text: "接口形式", sortable: true, align: "center" },
  { field: "businessarea", text: "营业片区", sortable: true, align: "center" }
];

//排气阀
export const E_Exhaustvalve_Columns = [
  // {field: "equipment_number",text: "编号",width: 90,align: "center"},
  { field: "OBJECTID", text: "编号", width: 90, align: "center" },
  { field: "material_science", text: "材质", sortable: true, align: "center" },
  { field: "caliber", text: "口径", sortable: true, align: "center", type: "Number" },
  { field: "elevation", text: "高程", sortable: true, align: "center", type: "Number" },
  { field: "depth", text: "埋深", sortable: true, align: "center", type: "Number" },
  { field: "Installation_address", text: "安装地址", sortable: true, align: "center" },
  { field: "management_unit", text: "管理单位", sortable: true, align: "center" },
  { field: "completion_date", text: "竣工日期", sortable: true, align: "center", type: "Date" },
  { field: "laying_age", text: "敷设年代", sortable: true, align: "center" },
  { field: "embedding_mode", text: "埋设方式", sortable: true, align: "center" },
  { field: "equipment_type", text: "设备类型", sortable: true, align: "center" },
  { field: "coordinate_x", text: "横坐标", sortable: true, align: "center", type: "Number" },
  { field: "coordinate_y", text: "纵坐标", sortable: true, align: "center", type: "Number" },
  { field: "Interface_form", text: "接口形式", sortable: true, align: "center" },
  { field: "specifications", text: "规格", sortable: true, align: "center" },
  { field: "manufacturer", text: "生产厂家", sortable: true, align: "center" },
  { field: "businessarea", text: "营业片区", sortable: true, align: "center" }
];

//水表井
export const E_Watermeterwell_Columns = [
  // {field: "equipment_number",text: "编号",width: 90,align: "center"},
  { field: "OBJECTID", text: "编号", width: 90, align: "center" },
  { field: "material_science", text: "材质", sortable: true, align: "center" },
  { field: "caliber", text: "口径", sortable: true, align: "center", type: "Number" },
  { field: "elevation", text: "高程", sortable: true, align: "center", type: "Number" },
  { field: "depth", text: "埋深", sortable: true, align: "center", type: "Number" },
  { field: "Installation_address", text: "安装地址", sortable: true, align: "center" },
  { field: "management_unit", text: "管理单位", sortable: true, align: "center" },
  { field: "completion_date", text: "竣工日期", sortable: true, align: "center", type: "Date" },
  { field: "laying_age", text: "敷设年代", sortable: true, align: "center" },
  { field: "embedding_mode", text: "埋设方式", sortable: true, align: "center" },
  { field: "equipment_type", text: "设备类型", sortable: true, align: "center" },
  { field: "coordinate_x", text: "横坐标", sortable: true, align: "center", type: "Number" },
  { field: "coordinate_y", text: "纵坐标", sortable: true, align: "center", type: "Number" },
  { field: "Interface_form", text: "接口形式", sortable: true, align: "center" },
  { field: "specifications", text: "规格", sortable: true, align: "center" },
  { field: "manufacturer", text: "生产厂家", sortable: true, align: "center" },
  { field: "businessarea", text: "营业片区", sortable: true, align: "center" },
  { field: "totallisthouseholds", text: "总表户", sortable: true, align: "center" },
  { field: "tablenumber", text: "表号", sortable: true, align: "center" },
  { field: "username", text: "用户名", sortable: true, align: "center" }
];

//三通
export const E_Tee_Columns = [
  // {field: "equipment_number",text: "编号",width: 90,align: "center"},
  { field: "OBJECTID", text: "编号", width: 90, align: "center" },
  { field: "material_science", text: "材质", sortable: true, align: "center" },
  { field: "caliber", text: "口径", sortable: true, align: "center", type: "Number" },
  { field: "elevation", text: "高程", sortable: true, align: "center", type: "Number" },
  { field: "depth", text: "埋深", sortable: true, align: "center", type: "Number" },
  { field: "Installation_address", text: "安装地址", sortable: true, align: "center" },
  { field: "management_unit", text: "管理单位", sortable: true, align: "center" },
  { field: "completion_date", text: "竣工日期", sortable: true, align: "center", type: "Date" },
  { field: "laying_age", text: "敷设年代", sortable: true, align: "center" },
  { field: "embedding_mode", text: "埋设方式", sortable: true, align: "center" },
  { field: "equipment_type", text: "设备类型", sortable: true, align: "center" },
  { field: "coordinate_x", text: "横坐标", sortable: true, align: "center", type: "Number" },
  { field: "coordinate_y", text: "纵坐标", sortable: true, align: "center", type: "Number" },
  { field: "Interface_form", text: "接口形式", sortable: true, align: "center" },
  { field: "specifications", text: "规格", sortable: true, align: "center" },
  { field: "manufacturer", text: "生产厂家", sortable: true, align: "center" },
  { field: "businessarea", text: "营业片区", sortable: true, align: "center" }
];

//弯头
export const E_Elbow_Columns = [
  // {field: "equipment_number",text: "编号",width: 90,align: "center"},
  { field: "OBJECTID", text: "编号", width: 90, align: "center" },
  { field: "material_science", text: "材质", sortable: true, align: "center" },
  { field: "caliber", text: "口径", sortable: true, align: "center", type: "Number" },
  { field: "elevation", text: "高程", sortable: true, align: "center", type: "Number" },
  { field: "depth", text: "埋深", sortable: true, align: "center" },
  { field: "Installation_address", text: "安装地址", sortable: true, align: "center" },
  { field: "management_unit", text: "管理单位", sortable: true, align: "center" },
  { field: "completion_date", text: "竣工日期", sortable: true, align: "center", type: "Date" },
  { field: "laying_age", text: "敷设年代", sortable: true, align: "center" },
  { field: "embedding_mode", text: "埋设方式", sortable: true, align: "center" },
  { field: "equipment_type", text: "设备类型", sortable: true, align: "center" },
  { field: "coordinate_x", text: "横坐标", sortable: true, align: "center", type: "Number" },
  { field: "coordinate_y", text: "纵坐标", sortable: true, align: "center", type: "Number" },
  { field: "Interface_form", text: "接口形式", sortable: true, align: "center" },
  { field: "specifications", text: "规格", sortable: true, align: "center" },
  { field: "manufacturer", text: "生产厂家", sortable: true, align: "center" },
  { field: "businessarea", text: "营业片区", sortable: true, align: "center" }
];

//减压阀
export const E_Pressurereliefvalve_Columns = [
  // {field: "equipment_number",text: "编号",width: 90,align: "center"},
  { field: "OBJECTID", text: "编号", width: 90, align: "center" },
  { field: "material_science", text: "材质", sortable: true, align: "center" },
  { field: "caliber", text: "口径", sortable: true, align: "center", type: "Number" },
  { field: "elevation", text: "高程", sortable: true, align: "center", type: "Number" },
  { field: "depth", text: "埋深", sortable: true, align: "center", type: "Number" },
  { field: "Installation_address", text: "安装地址", sortable: true, align: "center" },
  { field: "management_unit", text: "管理单位", sortable: true, align: "center" },
  { field: "completion_date", text: "竣工日期", sortable: true, align: "center", type: "Date" },
  { field: "laying_age", text: "敷设年代", sortable: true, align: "center" },
  { field: "embedding_mode", text: "埋设方式", sortable: true, align: "center" },
  { field: "equipment_type", text: "设备类型", sortable: true, align: "center" },
  { field: "coordinate_x", text: "横坐标", sortable: true, align: "center", type: "Number" },
  { field: "coordinate_y", text: "纵坐标", sortable: true, align: "center", type: "Number" },
  { field: "Interface_form", text: "接口形式", sortable: true, align: "center" },
  { field: "specifications", text: "规格", sortable: true, align: "center" },
  { field: "manufacturer", text: "生产厂家", sortable: true, align: "center" },
  { field: "businessarea", text: "营业片区", sortable: true, align: "center" }
];

//连接点
export const E_Connectionpoint_Columns = [
  // {field: "equipment_number",text: "编号",width: 90,align: "center"},
  { field: "OBJECTID", text: "编号", width: 90, align: "center" },
  { field: "material_science", text: "材质", sortable: true, align: "center" },
  { field: "caliber", text: "口径", sortable: true, align: "center", type: "Number" },
  { field: "elevation", text: "高程", sortable: true, align: "center", type: "Number" },
  { field: "depth", text: "埋深", sortable: true, align: "center", type: "Number" },
  { field: "Installation_address", text: "安装地址", sortable: true, align: "center" },
  { field: "management_unit", text: "管理单位", sortable: true, align: "center" },
  { field: "completion_date", text: "竣工日期", sortable: true, align: "center", type: "Date" },
  { field: "laying_age", text: "敷设年代", sortable: true, align: "center" },
  { field: "embedding_mode", text: "埋设方式", sortable: true, align: "center" },
  { field: "equipment_type", text: "设备类型", sortable: true, align: "center" },
  { field: "coordinate_x", text: "横坐标", sortable: true, align: "center", type: "Number" },
  { field: "coordinate_y", text: "纵坐标", sortable: true, align: "center", type: "Number" },
  { field: "Interface_form", text: "接口形式", sortable: true, align: "center" },
  { field: "specifications", text: "规格", sortable: true, align: "center" },
  { field: "manufacturer", text: "生产厂家", sortable: true, align: "center" },
  { field: "businessarea", text: "营业片区", sortable: true, align: "center" }
];

//水表
export const E_WaterMeter_Columns = [
  // {field: "equipment_number",text: "编号",width: 90,align: "center"},
  { field: "OBJECTID", text: "编号", width: 90, align: "center" },
  { field: "material_science", text: "材质", sortable: true, align: "center" },
  { field: "caliber", text: "口径", sortable: true, align: "center", type: "Number" },
  { field: "elevation", text: "高程", sortable: true, align: "center", type: "Number" },
  { field: "depth", text: "埋深", sortable: true, align: "center", type: "Number" },
  { field: "Installation_address", text: "安装地址", sortable: true, align: "center" },
  { field: "management_unit", text: "管理单位", sortable: true, align: "center" },
  { field: "completion_date", text: "竣工日期", sortable: true, align: "center", type: "Date" },
  { field: "laying_age", text: "敷设年代", sortable: true, align: "center" },
  { field: "embedding_mode", text: "埋设方式", sortable: true, align: "center" },
  { field: "equipment_type", text: "设备类型", sortable: true, align: "center" },
  { field: "coordinate_x", text: "横坐标", sortable: true, align: "center", type: "Number" },
  { field: "coordinate_y", text: "纵坐标", sortable: true, align: "center", type: "Number" },
  { field: "Interface_form", text: "接口形式", sortable: true, align: "center" },
  { field: "specifications", text: "规格", sortable: true, align: "center" },
  { field: "manufacturer", text: "生产厂家", sortable: true, align: "center" },
  { field: "businessarea", text: "营业片区", sortable: true, align: "center" }
];

//阀门井
export const E_Valvewell_Columns = [
  // {field: "equipment_number",text: "编号",width: 90,align: "center"},
  { field: "OBJECTID", text: "编号", width: 90, align: "center" },
  { field: "material_science", text: "材质", sortable: true, align: "center" },
  { field: "caliber", text: "口径", sortable: true, align: "center", type: "Number" },
  { field: "elevation", text: "高程", sortable: true, align: "center", type: "Number" },
  { field: "depth", text: "埋深", sortable: true, align: "center", type: "Number" },
  { field: "Installation_address", text: "安装地址", sortable: true, align: "center" },
  { field: "management_unit", text: "管理单位", sortable: true, align: "center" },
  { field: "completion_date", text: "竣工日期", sortable: true, align: "center", type: "Date" },
  { field: "laying_age", text: "敷设年代", sortable: true, align: "center" },
  { field: "embedding_mode", text: "埋设方式", sortable: true, align: "center" },
  { field: "equipment_type", text: "设备类型", sortable: true, align: "center" },
  { field: "coordinate_x", text: "横坐标", sortable: true, align: "center", type: "Number" },
  { field: "coordinate_y", text: "纵坐标", sortable: true, align: "center", type: "Number" },
  { field: "Interface_form", text: "接口形式", sortable: true, align: "center" },
  { field: "businessarea", text: "营业片区", sortable: true, align: "center" }
];

//消防井
export const E_Firefightingwell_Columns = [
  // {field: "equipment_number",text: "编号",width: 90,align: "center"},
  { field: "OBJECTID", text: "编号", width: 90, align: "center" },
  { field: "material_science", text: "材质", sortable: true, align: "center" },
  { field: "caliber", text: "口径", sortable: true, align: "center", type: "Number" },
  { field: "elevation", text: "高程", sortable: true, align: "center", type: "Number" },
  { field: "depth", text: "埋深", sortable: true, align: "center", type: "Number" },
  { field: "Installation_address", text: "安装地址", sortable: true, align: "center" },
  { field: "management_unit", text: "管理单位", sortable: true, align: "center" },
  { field: "completion_date", text: "竣工日期", sortable: true, align: "center", type: "Date" },
  { field: "laying_age", text: "敷设年代", sortable: true, align: "center" },
  { field: "embedding_mode", text: "埋设方式", sortable: true, align: "center" },
  { field: "equipment_type", text: "设备类型", sortable: true, align: "center" },
  { field: "coordinate_x", text: "横坐标", sortable: true, align: "center", type: "Number" },
  { field: "coordinate_y", text: "纵坐标", sortable: true, align: "center", type: "Number" },
  { field: "Interface_form", text: "接口形式", sortable: true, align: "center" },
  { field: "businessarea", text: "营业片区", sortable: true, align: "center" }
];

//检修井
export const E_Servicingwell_Columns = [
  // {field: "equipment_number",text: "编号",width: 90,align: "center"},
  { field: "OBJECTID", text: "编号", width: 90, align: "center" },
  { field: "material_science", text: "材质", sortable: true, align: "center" },
  { field: "caliber", text: "口径", sortable: true, align: "center", type: "Number" },
  { field: "elevation", text: "高程", sortable: true, align: "center", type: "Number" },
  { field: "depth", text: "埋深", sortable: true, align: "center", type: "Number" },
  { field: "Installation_address", text: "安装地址", sortable: true, align: "center" },
  { field: "management_unit", text: "管理单位", sortable: true, align: "center" },
  { field: "completion_date", text: "竣工日期", sortable: true, align: "center", type: "Date" },
  { field: "laying_age", text: "敷设年代", sortable: true, align: "center" },
  { field: "embedding_mode", text: "埋设方式", sortable: true, align: "center" },
  { field: "equipment_type", text: "设备类型", sortable: true, align: "center" },
  { field: "coordinate_x", text: "横坐标", sortable: true, align: "center", type: "Number" },
  { field: "coordinate_y", text: "纵坐标", sortable: true, align: "center", type: "Number" },
  { field: "Interface_form", text: "接口形式", sortable: true, align: "center" },
  { field: "businessarea", text: "营业片区", sortable: true, align: "center" }
];

//水表箱
export const E_Watermeterbox_Columns = [
  // {field: "equipment_number",text: "编号",width: 90,align: "center"},
  { field: "OBJECTID", text: "编号", width: 90, align: "center" },
  { field: "material_science", text: "材质", sortable: true, align: "center" },
  { field: "caliber", text: "口径", sortable: true, align: "center", type: "Number" },
  { field: "elevation", text: "高程", sortable: true, align: "center", type: "Number" },
  { field: "depth", text: "埋深", sortable: true, align: "center", type: "Number" },
  { field: "Installation_address", text: "安装地址", sortable: true, align: "center" },
  { field: "management_unit", text: "管理单位", sortable: true, align: "center" },
  { field: "completion_date", text: "竣工日期", sortable: true, align: "center", type: "Date" },
  { field: "laying_age", text: "敷设年代", sortable: true, align: "center" },
  { field: "embedding_mode", text: "埋设方式", sortable: true, align: "center" },
  { field: "equipment_type", text: "设备类型", sortable: true, align: "center" },
  { field: "coordinate_x", text: "横坐标", sortable: true, align: "center", type: "Number" },
  { field: "coordinate_y", text: "纵坐标", sortable: true, align: "center", type: "Number" },
  { field: "Interface_form", text: "接口形式", sortable: true, align: "center" },
  { field: "specifications", text: "规格", sortable: true, align: "center" },
  { field: "manufacturer", text: "生产厂家", sortable: true, align: "center" },
  { field: "businessarea", text: "营业片区", sortable: true, align: "center" },
  { field: "totallisthouseholds", text: "总表户", sortable: true, align: "center" },
  { field: "tablenumber", text: "表号", sortable: true, align: "center" },
  { field: "username", text: "用户名", sortable: true, align: "center" }
];

export const Count_Caliber = [
  { field: "caliber", text: "管径", align: "center" },
  { field: "length", text: "管长(m)", sortable: true, align: "center", type: 'Number', show: 'PipeLineLayer' },
  { field: "equipment_number", text: "数目(个)", sortable: true, align: "center", type: 'Number' },
  { field: "lengthPercent", text: "管长比例", sortable: true, align: "center", type: 'Number', show: 'PipeLineLayer' },
  { field: "equipment_numberPercent", text: "数目比例", sortable: true, align: "center", type: 'Number' }
];

export const Count_Material = [
  { field: "material_science", text: "设备名称", align: "center" },
  { field: "length", text: "管长(m)", sortable: true, align: "center", type: 'Number', show: 'PipeLineLayer' },
  { field: "equipment_number", text: "数目(个)", sortable: true, align: "center", type: 'Number' },
  { field: "lengthPercent", text: "管长比例", sortable: true, align: "center", type: 'Number', show: 'PipeLineLayer' },
  { field: "equipment_numberPercent", text: "数目比例", sortable: true, align: "center", type: 'Number' }
];

export const Count_Road = [
  { field: "Installation_address", text: "道路名称", align: "center" },
  { field: "length", text: "管长(m)", sortable: true, align: "center", type: 'Number', show: 'PipeLineLayer' },
  { field: "equipment_number", text: "数目(个)", sortable: true, align: "center", type: 'Number' },
  { field: "lengthPercent", text: "管长比例", sortable: true, align: "center", type: 'Number', show: 'PipeLineLayer' },
  { field: "equipment_numberPercent", text: "数目比例", sortable: true, align: "center", type: 'Number' }
];

// 全设备查询
export const Count_All = [
  { field: "all", text: "设备名称", align: "center" },
  { field: "equipment_number", text: "数目(个)", sortable: true, align: "center", type: 'Number' },
  { field: "equipment_numberPercent", text: "数目比例", sortable: true, align: "center", type: 'Number' }
];
export const ZongDuanMian_Columns = [
  { field: "OBJECTID", text: "编号", width: 90, align: "center" },
  { field: "startingpoint_depth", text: "起点埋深", sortable: true, align: "center" },
  { field: "endpoint_depth", text: "终点埋深", sortable: true, align: "center" },
  { field: "length", text: "管长(m)", sortable: true, align: "center" },
  { field: "startingpoint_elevation", text: "起点高程", sortable: true, align: "center" },
  { field: "endpoint_elevation", text: "终点高程", sortable: true, align: "center" },
];


//隐患yh/漏点ld/爆管bg等事件信息
export const HeDaEvenType_Columns = [
  { field: "typeName", text: "事件类别"},
  { field: "pipe", text: "管线编号"},
  { field: "time", text: "发生时间"},
  { field: "longitude", text: "经度"},
  { field: "latitude", text: "纬度"},
  { field: "submituser", text: "提交人"},
  { field: "submittime", text: "提交时间"},
  { field: "picture", text: "图片地址",type:"image"},
  { field: "remark", text: "备注"},
];
