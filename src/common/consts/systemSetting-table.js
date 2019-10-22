//部门
export const DeptManage_Columns = [
	{ field: "cDepName", text: "部门名称", align: "center", fixed: false },
	{ field: "cDepTel", text: "电话", align: "center", fixed: false },
	{ field: "cDepEmail", text: "邮件", align: "center", fixed: false },
]


//用户
export const UserManage_Columns = [
	{ field: "cAdminName", text: "姓名", align: "center", fixed: false },
	{ field: "CJobNumber", text: "工号", align: "center", fixed: false },
	{ field: "cDepName", text: "部门", align: "center", fixed: false },
	{ field: "cRoleName", text: "岗位", align: "center", fixed: false },
	{ field: "cAdminSex", text: "性别", align: "center", fixed: false },
	{ field: "cAdminTel", text: "电话", align: "center", fixed: false },
	{ field: "cAdminEmail", text: "邮件", align: "center", fixed: false },
	{ field: "iIsLocked", text: "是否锁定",formatter: function (row, column, cellValue, index) {
		return cellValue ? '是' : '否'
	}, align: "center", fixed: false },
	{ field: "dExpireDate", text: "过期日期", align: "center", fixed: false },
	{ field: "iIsAllowChangePWD", text: "密码修改",formatter: function (row, column, cellValue, index) {
		return cellValue ? '允许' : '不允许'
	}, align: "center", fixed: false },
	{ field: "IsAssignment", text: "分派部门",formatter: function (row, column, cellValue, index) {
		return cellValue ? '允许' : '不允许'
	}, align: "center", fixed: false },
]
//系统状态过滤
const typeList = {
	1: "B/S 显示",
	3: "手机app",
	4: "C/S 显示"
  }


//模块
export const Modular_Columns = [
	{ field: "iFunID", text: "ID", align: "center", fixed: false },
	{ field: "cFunName", text: "功能名称", align: "center", fixed: false },
	{ field: "cFunUrl", text: "功能URl", align: "center", fixed: false },
	{ field: "cFunIcon", text: "icon名称", align: "center", fixed: false },
	{ field: "iFunOrder", text: "排序", align: "center", fixed: false ,sortable:true},
	{ field: "iFunMenuIsShow", text: "是否显示", template: function (row) {
		return "<span class='" + (row.iFunMenuIsShow ? "my-show-span" : "") + "'>" + (row.iFunMenuIsShow ? "显示" : "隐藏") + "</span>"
	}, align: "center", fixed: false },
	{ field: "System_Type", text: "系统类型", formatter:function (row, column, cellValue, index) {
		return typeList[cellValue]
	}, align: "center", fixed: false },
	{ field: "FunctionType", text: "点击类型", formatter:function (row, column, cellValue, index) {
		return cellValue === 1 ? "页面" : "按钮"
	}, align: "center", fixed: false },
]

//角色
export const RoleManage_Columns = [
	{ field: "cRoleName", text: "岗位名称", align: "center", fixed: false },
	{ field: "isSuperAdmin", text: "是否是超级管理员",formatter: function (row, column, cellValue, index) {
		return cellValue ? '是' : '否'
	}, align: "center", fixed: false },
]

//上传
export const AppUpload_Columns = [
	{ field: "APKNAME", text: "APK名称", align: "center", fixed: false },
	{ field: "VERSIONID", text: "版本号", align: "center", fixed: false },
	{ field: "UPLOADTIME", text: "上传时间", align: "center", fixed: false },
]