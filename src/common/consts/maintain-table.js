 /* 维修养护设置*/
 //上报时间
 export const Mai_ReportTime_Columns = [
    { field:"1",text: "全部"},
    { field:"2",text: "今天"},
    { field:"3",text: "昨天"},
    { field:"4",text: "本周"},
    { field:"5",text: "上周"},
    { field:"6",text: "本月"},
    { field:"7",text: "自定义"}
 ]
 //时间状态
 export  const Mai_OrderStatus_Columns = [
    { field:"1",text: "全部",num:191},
    { field:"2",text: "待处理",num:104},
    { field:"3",text: "待分派",num:121},
    { field:"4",text: "待接受",num:191},
    { field:"5",text: "待处置",num:91},
    { field:"6",text: "处置中",num:91},
    { field:"7",text: "待审核",num:19},
    { field:"8",text: "已审核",num:11},
    { field:"9",text: "已回复",num:11},
    { field:"10",text: "无效",num:0},
 ]
 //事件分析
 export  const Mai_Analysis_Columns = [
    //{ field:"1",text:"",width:20,align: "center"},
    { field:"2",text: "上报人员",align: "center"},
    { field:"3",text: "上报事件次数",align: "center"},

 ]

  //事件工单
  export const Mai_EventBills_Columns = [
    // { name: "上报时间", value: "UpTime", field: 'UpTime' },
	{ text: "上报类型", value: "EventFromName", field: 'EventFromName' },
	{ text: "事件编号", value: "EventCode", width: 100, field: 'EventCode' },
	{ text: "处理时间", value: "ExecTime", field: "ExecTime" },
	// { text: "紧急状态", value: "UrgencyId", field: 'UrgencyId' },
	{ text: "紧急状态", value: "UrgencyName", field: 'UrgencyName' },
	// { text: "事件状态", value: "OperId", field: 'OperId' },
	{ text: "事件状态", value: "IsValidName", field: 'IsValidName' },
	{
		// text: "事件类型", value: "EventTypeName", field: '8', templet: function (row) {
		// 	return `<span class="el-tag">${row.EventTypeName}</span>`
		// }
		text: "事件类型", value: "EventTypeName", field: 'EventTypeName', templet: function (row) {
			return `<span class="el-tag">${row.EventTypeName}</span>`
		}
	},
	{ text: "事件内容", value: "EventTypeName2", field: 'EventTypeName2' },
	{ text: "上报人", value: "PersonName", field: 'PersonName' },
	{ text: "步骤处理人", value: "ExecPersonName", field: 'ExecPersonName' },
	{ text: "处理单位", value: "ExecDetpName", field: 'ExecDetpName' },
	// { text: "联系人", value: "LinkMan", field: 'LinkMan' },
	{ text: "保修人", value: "LinkMan", field: 'LinkMan' },
	// { text: "联系电话", value: "LinkCall", width: 96, field: 'LinkCall' },
	{ text: "保修电话", value: "LinkCall", width: 96, field: 'LinkCall' },
	{ text: "更新时间", value: "EventUpdateTime", field: 'EventUpdateTime' }
 ]


 //待办工单
 export const Mai_WaitDoneBills_Columns = [
   // { name: "上报时间", value: "UpTime", field: 'UpTime' },
	{ text: "上报类型", value: "EventFromName", field: 'EventFromName' },
	{ text: "事件编号", value: "EventCode", width: 100, field: 'EventCode' },
	{ text: "处理时间", value: "ExecTime", field: 'ExecTime' },
	{ text: "紧急状态", value: "UrgencyId", field: 'UrgencyId' },
	{ text: "事件状态", value: "OperId", field: 'OperId' },
	{
		text: "事件类型", value: "EventTypeName", field: '8', templet: function (row) {
			return `<span class="el-tag">${row.EventTypeName}</span>`
		}
	},
	{ text: "事件内容", value: "EventTypeName2", field: 'EventTypeName2' },
	{ text: "上报人", value: "PersonName", field: 'PersonName' },
	{ text: "步骤处理人", value: "ExecPersonName", field: 'ExecPersonName' },
	{ text: "处理单位", value: "ExecDetpName", field: 'ExecDetpName' },
	{ text: "联系人", value: "LinkMan", field: 'LinkMan' },
	{ text: "联系电话", value: "LinkCall", width: 96, field: 'LinkCall' },
	// { text: "更新时间", value: "EventUpdateTime", field: 'EventUpdateTime' }
 ]

  //已办工单
  export const Mai_DoneOrderBills_Columns = [
    // { name: "上报时间", value: "UpTime", field: 'UpTime' },
	{ text: "上报类型", value: "EventFromName", field: 'EventFromName' },
	{ text: "事件编号", value: "EventCode", width: 100, field: 'EventCode' },
	{ text: "处理时间", value: "ExecTime", field: 'ExecTime' },
	{ text: "紧急状态", value: "UrgencyId", field: 'UrgencyId' },
	{ text: "事件状态", value: "OperId", field: 'OperId' },
	{
		text: "事件类型", value: "EventTypeName", field: '8', templet: function (row) {
			return `<span class="el-tag">${row.EventTypeName}</span>`
		}
	},
	{ text: "事件内容", value: "EventTypeName2", field: 'EventTypeName2' },
	{ text: "上报人", value: "PersonName", field: 'PersonName' },
	{ text: "步骤处理人", value: "ExecPersonName", field: 'ExecPersonName' },
	{ text: "处理单位", value: "ExecDetpName", field: 'ExecDetpName' },
	{ text: "联系人", value: "LinkMan", field: 'LinkMan' },
	{ text: "联系电话", value: "LinkCall", width: 96, field: 'LinkCall' },
	{ text: "更新时间", value: "EventUpdateTime", field: 'EventUpdateTime' }
 ]
 
   //工单审核 
   export const Mai_BillsReview_Columns = [
    // { type:"selection",width: 90,align: "center",fixed:true},
    // { field:"1",text: "上报时间",align: "center",fixed:true},
    { field:"3",text: "上报类型",align: "center",fixed:false},
    { field:"4",text: "事件编号",align: "center",fixed:false},
    { field:"5",text: "处理时间",align: "center",fixed:false}, 
	{ field:"6",text: "紧急状态",align: "center",fixed:false},
	{ field:"7",text: "事件状态",align: "center",fixed:true},
    { field:"8",text: "事件类型",align: "center",fixed:false},
    { field:"9",text: "事件内容",align: "center",fixed:false},
    { field:"10",text: "上报人",align: "center",fixed:false},
    { field:"11",text: "步骤处理人",align: "center",fixed:false}, 
	{ field:"12",text: "处理单位",align: "center",fixed:false},
	{ field:"13",text: "联系人",align: "center",fixed:false}, 
    { field:"14",text: "联系电话",align: "center",fixed:false},
    { field:"15",text: "更新时间",align: "center",fixed:false},
 ]

  //工单作废
  export const Mai_BillsDelete_Columns = [
    // { type:"selection",width: 90,align: "center",fixed:true},
    // { field:"1",text: "上报时间",align: "center",fixed:true},
    // { field:"2",text: "操作",align: "center",fixed:false},
    { field:"3",text: "上报类型",align: "center",fixed:false},
    { field:"4",text: "事件编号",align: "center",fixed:false},
    { field:"5",text: "处理时间",align: "center",fixed:false}, 
	{ field:"6",text: "紧急状态",align: "center",fixed:false},
	{ field:"7",text: "事件状态",align: "center",fixed:true},
    { field:"8",text: "事件类型",align: "center",fixed:false},
    { field:"9",text: "事件内容",align: "center",fixed:false},
    { field:"10",text: "上报人",align: "center",fixed:false},
    { field:"11",text: "步骤处理人",align: "center",fixed:false}, 
	{ field:"12",text: "处理单位",align: "center",fixed:false},
	{ field:"13",text: "联系人",align: "center",fixed:false}, 
    { field:"14",text: "联系电话",align: "center",fixed:false},
 ]