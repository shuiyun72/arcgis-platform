 /* 巡检设置*/
 //手持端设置
 export const Ins_HandSet_Columns = [
    { type:"selection",width: 90,align: "center",fixed:true},
    { field:"1",text: "所属人员",align: "center",fixed:true},
    { field:"2",text: "操作系统",align: "center",fixed:false},
    { field:"3",text: "设备名称",align: "center",fixed:false},
    { field:"4",text: "设备类型",align: "center",fixed:false},
    { field:"5",text: "设备购买日期",align: "center",fixed:false}, 
    { field:"6",text: "最后更新时间",align: "center",fixed:false,width:500},
 ]

//事件内容管理
export const Ins_EvenContent_Columns = [
    { field:"ParentTypeName",text: "上报类型",align: "center",fixed:false},
    { field:"EventTypeName",text: "上报内容",align: "center",fixed:false},
    { field:"ExecTime",text: "处理时间(小时)",align: "center",fixed:false},
 ]


//工作时段管理
export const Ins_TimeSet_Columns = [
   { field:"IntervalId",text: "编号",align: "center",fixed:false,sortable:true,width: 60},
   { field:"StartTime",text: "开始时间",align: "center",fixed:false,width: 100},
   { field:"EndTime",text: "结束时间",align: "center",fixed:false,width: 100},
   { field:"Remarks",text: "备注",align: "center",fixed:false,class:'text_ellipsis'}
]
//事件类型管理
export const Ins_EvenType_Columns = [
    { field:"EventTypeName",text: "事件类型",align: "center",fixed:false},
   //  { field:"ExecTime",text: " 处理时间(小时)",align: "center",fixed:false},
 ]


//计划类别管理
export const Ins_PlanType_Columns = [
    { field:"PlanTypeName",text: "类型名称",align: "center",fixed:false},
    { field:"PlanTypeId",text: "类别编号",align: "center",fixed:false,sortable:true},
    { field:"ParPlanTypeName",text: "类别名称",align: "center",fixed:false},
    { field:"PersonName",text: "添加人",align: "center",fixed:false},
    { field:"OperateDate",text: "添加时间",align: "center",fixed:false,width:200},
 ]



/* 巡检计划*/
//计划管理
export const Ins_PlanManage_Columns = [
   // { type:"selection",align: "center",fixed:true},
   { field:"PlanName",text: "计划名称",align: "center",fixed:true,width:180},
   { field:"PlanTypeNameLB",text: "计划类别",align: "center",fixed:false,sortable:true},
   { field:"PlanTypeName",text: "巡检类型",align: "center",fixed:false},
   { field:"PlanAreaName",text: "区域/路线名称",align: "center",fixed:false,width:140},
   { field:"BoolNormalPlan",text: "计划类型",align: "center",fixed:false},
   { field:"BoolFeedBack",text: "到位反馈",align: "center",fixed:false},
   { field:"PlanCycleName",text: "计划周期",align: "center",fixed:false},
   { field:"MoveType",text: "行进方式",align: "center",fixed:false},
   { field:"EquipmentName",text: "巡检对象",align: "center",fixed:false},
   { field:"Operator",text: "创建人",align: "center",fixed:false},
   { field:"OperateDate",text: "创建时间",align: "center",fixed:false,width:180},
]

//巡线任务
export const Ins_PatrolTask_Columns = [
   { field:"TaskName",text: "计划名称",align: "left",fixed:false,sortable:true,width:280},
   { field:"ProraterName",text: "巡检员",align: "center",fixed:false},
   { field:"TaskCode",text: "任务编号",align: "center",fixed:false,width:120},
   { field:"BoolNormalPlan",text: "计划类型",align: "center",fixed:false},
   { field:"PlanCycleName",text: "巡检周期",align: "center",fixed:false},
   { field:"VisitStarTime",text: "开始时间",align: "center",fixed:false,width:160},
   { field:"VisitOverTime",text: "结束时间",align: "center",fixed:false,width:160},
   { field:"ProraterDeptName",text: "部门",align: "center",fixed:false},
   { field:"Operator",text: "创建人",align: "center",fixed:false},
   { field:"OperateDate",text: "创建时间",align: "center",fixed:false,width:160},
]

//区域管理
export const Ins_RegionalManagement_Columns = [
   { field:"PlanAreaName",text: "片区名称",align: "center",fixed:false,sortable:true},
   { field:"DeptName",text: "责任部门",align: "center",fixed:false},
   { field:"PersonName",text: "区域负责人",align: "center",fixed:false},
   { field:"OperateAddTime",text: "创建日期",align: "center",fixed:false,sortable:true,width:160}
]

export const Ins_RegionalManagementBottom_Columns = [
   { field:"PointName",text: "区域关键点",align: "center",fixed:false,sortable:true},
   { field:"AddTime",text: "创建日期",align: "center",fixed:false}
]

//路线管理
export const Ins_RouteManage_Columns = [
   // { field:"Pos",width: 30,align: "center",fixed:false},
   { field:"PlanLineName",text: "路线名称",align: "center",fixed:false,sortable:true},
   { field:"AddTime",text: "创建日期",align: "center",fixed:false}
]

export const Ins_RouteManageBottom_Columns = [
   { field:"ImportPointName",text: "关键点名称",align: "center",fixed:false,sortable:true},
   { field:"AddTime",text: "创建日期",align: "center",fixed:false}
]



/*事件管理 */
//事件总览
export const Ins_EvenOverview_Columns = [
   { field:"ET1",text: "上报类型",align: "center",fixed:false},
   { field:"OrderCode",text: "工单编号",align: "center",fixed:false,sortable:true,width:120},
   { field:"EventCode",text: "事件编号",align: "center",fixed:false,sortable:true,width:120},
   { field:"statusName",text: "事件状态",align: "center",fixed:false},
   { field:"PName",text: "上报人",align: "center",fixed:false},
   { field:"DeptName",text: "上报部门",align: "center",fixed:false},
   { field:"EventUpdateTime",text: "上报时间",align: "center",fixed:false,width:160},
   { field:"UpTime",text: "更新时间",align: "center",fixed:false,width:160},
]


/*考勤管理 */
export const Ins_TimeCard_Columns = [
   { field:"PersonName",text: "上报人",align: "center",fixed:false},  
   { field:"cDepName",text: "所属部门",align: "center",fixed:false},
   { field:"work_start",text: "上班时间",align: "center",fixed:false,sortable:true,width:200},
   { field:"work_over",text: "下班时间",align: "center",fixed:false,width:200},
   { field:"times",text: "工作时长（小时）",align: "center",fixed:false},
]


/*统计分析 */
//事件类型分析
export const Ins_EvenTypeAnalysis_Columns = [
   { field:"事件类型名称",text: "事件类型",align: "center",fixed:false},
   { field:"事件内容",text: "事件内容",align: "center",fixed:false,sortable:true},
   { field:"数量",text: "数量",align: "center",fixed:false},
   { field:"bili",text: "比例",align: "center",fixed:false},
   { field:"小计",text: "小计",align: "center",fixed:false},
   { field:"biliAll",text: "比例",align: "center",fixed:false}
]
//事件趋势分析
export const Ins_EvenTrendAnalysis_Columns = [
   { field:"事件类型",text: "事件类型",align: "center",fixed:false},
   { field:"类型",text: "类型",align: "center",fixed:false,sortable:true},
   { field:"小计",text: "小计",align: "center",fixed:false},
]

//人员上报分析
export const Ins_ReportAnalysis_Columns = [
   { field:"PersonName",text: "上传人员",align: "center",fixed:false},
   { field:"ECount",text: "上传事件数",align: "center",fixed:false,sortable:true}
]

//执行率分析
export const Ins_ImplementAnalysis_Columns = [
   { field:"1",text: "巡检人员",align: "center",fixed:false},
   { field:"2",text: "所属部门",align: "center",fixed:false,sortable:true},
   { field:"3",text: "到位率",align: "center",fixed:false},
   { field:"4",text: "反馈率",align: "center",fixed:false},
   { field:"5",text: "上报事件总数",align: "center",fixed:false},
]

//巡检任务统计
export const Ins_TaskAnalysis_Columns = [
   { field:"1",text: "部门",align: "center",fixed:false},
   { field:"2",text: "巡检人员",align: "center",fixed:false,sortable:true},
   { field:"3",text: "任务名称",align: "center",fixed:false},
   { field:"4",text: "开始时间",align: "center",fixed:false},
   { field:"5",text: "结束时间",align: "center",fixed:false},
   { field:"6",text: "巡检周期",align: "center",fixed:false},
   { field:"7",text: "巡检对象",align: "center",fixed:false},
   { field:"8",text: "管线覆盖长度",align: "center",fixed:false},
   { field:"9",text: "管线总长度",align: "center",fixed:false},
   { field:"10",text: "管线覆盖率",align: "center",fixed:false},
   { field:"11",text: "到位点数",align: "center",fixed:false},
   { field:"12",text: "需到位点数",align: "center",fixed:false},
   { field:"13",text: "到位率",align: "center",fixed:false},
   { field:"14",text: "反馈点数",align: "center",fixed:false},
   { field:"15",text: "需反馈点数",align: "center",fixed:false},
   { field:"16",text: "反馈率",align: "center",fixed:false}
]

//巡检工作量统计
export const Ins_WorkloadAnalysis_Columns = [
   { field:"1",text: "站点",align: "center",fixed:false},
   { field:"2",text: "巡检人员",align: "center",fixed:false,sortable:true},
   { field:"3",text: "上报事件数量",align: "center",fixed:false},
   { field:"4",text: "覆盖管线长度（公里）",align: "center",fixed:false},
   { field:"5",text: "累计在线时长（小时）",align: "center",fixed:false},
   { field:"6",text: "累计在线里程（公里）",align: "center",fixed:false},
   { field:"7",text: "到位点数",align: "center",fixed:false},
   { field:"8",text: "反馈点数",align: "center",fixed:false},
   { field:"9",text: "日均在线时长（小时）",align: "center",fixed:false},
   { field:"10",text: "日均在线里程（公里）",align: "center",fixed:false},
   { field:"11",text: "工作量统计时间",align: "center",fixed:false},
]