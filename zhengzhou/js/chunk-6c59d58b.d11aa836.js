(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6c59d58b"],{"00c9":function(e,t,i){"use strict";i.r(t);var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"table_style"},[i("el-row",{staticClass:"modularWrapper",attrs:{type:"flex"}},[i("el-scrollbar",{staticStyle:{"min-width":"200px"}},[i("el-tree",{attrs:{"highlight-current":"",data:e.deptList,props:e.defaultProps,"default-expanded-keys":[this.nodeID],"node-key":"iDeptID"},on:{"node-click":e.handleNodeClick}})],1),i("el-col",{staticClass:"table-flex-wraper"},[i("div",{staticClass:"table-btn-control",staticStyle:{border:"none"}},[i("el-row",{attrs:{type:"flex",justify:"strat"}},[e.$options.filters.btnTree("/api/Department/Post",e.$route.meta.iFunID)?i("el-button",{staticClass:"my-tableout",attrs:{plain:"",size:"mini"},on:{click:e.addDept}},[i("i",{staticClass:"iconfont icon-xinzeng"}),e._v("新增\n          ")]):e._e(),e.$options.filters.btnTree("/api/Department/Put",e.$route.meta.iFunID)?i("el-button",{staticClass:"my-tableout",attrs:{size:"mini"},on:{click:e.editDept}},[i("i",{staticClass:"iconfont icon-bianji"}),e._v("编辑\n          ")]):e._e(),e.$options.filters.btnTree("/api/Department/Delete",e.$route.meta.iFunID)?i("el-button",{staticClass:"my-tableout",attrs:{size:"mini"},on:{click:e.delDept}},[i("i",{staticClass:"iconfont icon-shanchu"}),e._v("删除\n          ")]):e._e()],1)],1),i("SysTable",{attrs:{tableData:e.tableData,loading:e.loading,layerListName:"DeptManage_Columns",paginationShow:!1},on:{currentChange:e.currentChange}})],1)],1),i("el-dialog",{staticClass:"myDialog",attrs:{title:e.dialogtype?"编辑部门":"新增部门",visible:e.dialogVisible,width:"300","before-close":e.handleClose,customClass:"el_add_dialog"},on:{"update:visible":function(t){e.dialogVisible=t}}},[i("el-form",{ref:"formDialog",attrs:{"label-width":"100px",size:"small",rules:e.rules,model:e.formValue}},[i("el-form-item",{attrs:{label:"上级部门："}},[i("el-input",{attrs:{disabled:""},model:{value:e.nodeName,callback:function(t){e.nodeName=t},expression:"nodeName"}})],1),i("el-form-item",{attrs:{label:"部门名称：",prop:"cAdminTel"}},[i("el-input",{attrs:{placeholder:"请输入部门名称"},model:{value:e.formValue.cDepName,callback:function(t){e.$set(e.formValue,"cDepName",t)},expression:"formValue.cDepName"}})],1),i("el-form-item",{attrs:{label:"部门电话：",prop:"cDepTel"}},[i("el-input",{attrs:{placeholder:"请输入部门电话"},model:{value:e.formValue.cDepTel,callback:function(t){e.$set(e.formValue,"cDepTel",t)},expression:"formValue.cDepTel"}})],1),i("el-form-item",{attrs:{label:"部门邮件：",prop:"cDepEmail"}},[i("el-input",{attrs:{placeholder:"请输入部门邮件"},model:{value:e.formValue.cDepEmail,callback:function(t){e.$set(e.formValue,"cDepEmail",t)},expression:"formValue.cDepEmail"}})],1)],1),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{staticClass:"my-dialog-cancel",on:{click:function(t){e.dialogVisible=!1}}},[e._v("取 消")]),i("el-button",{staticClass:"my-dialog-submit",attrs:{loading:e.sunBtnLoad},on:{click:e.editFormSubmit}},[e._v("确 定")])],1)],1)],1)},n=[],l=(i("ac6a"),i("bd86")),o=(i("c5f6"),i("0f1a")),r={getDeptList:function(){return o["a"].get("/Department/GetUserComboboxList")},addDept:function(e){return o["a"].post("/Department/Post",{iDeptID:Number(e.iDeptID),PiDeptID:Number(e.PiDeptID),iAdminID:Number(e.iAdminID),cDepName:e.cDepName,cDepTel:e.cDepTel,cDepEmail:e.cDepEmail,iIsLocked:Number(e.iIsLocked),iIsAllowChangePWD:Number(e.iIsAllowChangePWD)})},editDept:function(e){return o["a"].put("/Department/Put?iDeptID="+Number(e.iDeptID),{iDeptID:Number(e.iDeptID),PiDeptID:Number(e.PiDeptID),iAdminID:Number(e.iAdminID),cDepName:e.cDepName,cDepTel:e.cDepTel,cDepEmail:e.cDepEmail,iIsLocked:Number(e.iIsLocked),iIsAllowChangePWD:Number(e.iIsAllowChangePWD)})},delDept:function(e){return o["a"].delete("/Department/Delete",{params:{iDeptID:Number(e)}})}},s=i("ccc3"),c={name:"Department",components:{SysTable:s["a"]},data:function(){return Object(l["a"])({rules:{cDepName:[{required:!0,message:"请输入部门名称",trigger:"blur"}],cDepTel:[{pattern:/^1[34578]\d{9}$/,message:"请输入正确的手机号",trigger:"blur"}],cDepEmail:[{type:"email",message:"请输入正确的邮箱地址",trigger:["blur"]}]},deptList:[],defaultProps:{children:"children",label:"cDepName"},FatherList:[],tableData:[],currentRow:null,nodeID:null,nodeName:null,dialogVisible:!1,dialogtype:0,formValue:{iAdminID:0,PiDeptID:void 0,cDepName:void 0,cDepTel:void 0,cDepEmail:void 0},loading:!0,sunBtnLoad:!1},"sunBtnLoad",!1)},created:function(){this.getDeptList()},methods:{getDeptList:function(){var e=this;this.loading=!0,r.getDeptList().then(function(t){e.FatherList={},_.forEach(t.data.Data.Result,function(t){e.FatherList[t.PiDeptID]?e.FatherList[t.PiDeptID].push(t):e.FatherList[t.PiDeptID]=[t]}),e.deptList=[{cDepName:"公司",iDeptID:1,children:[]}],e.nodeID&&e.nodeName||(e.nodeName="公司",e.nodeID=1),e.DeptSerialize(e.deptList),e.tableData=e.FatherList[e.nodeID],e.loading=!1,e.$store.dispatch("system/SetDeptListFnc",e.deptList)}).catch(function(){e.loading=!1,e.$message({type:"error",message:"获取数据失败",showClose:!0})})},DeptSerialize:function(e){var t=this;_.map(e,function(e){t.FatherList[e.iDeptID]&&(e.children=t.FatherList[e.iDeptID],t.DeptSerialize(e.children))})},handleNodeClick:function(e){this.tableData=e.children,this.nodeID=e.iDeptID,this.nodeName=e.cDepName},currentChange:function(e){this.currentRow=e},delDept:function(){var e=this;this.currentRow?this.$confirm("确定删除么").then(function(){1!==e.currentRow.iDeptID?(e.loading=!0,r.delDept(e.currentRow.iDeptID).then(function(){e.loading=!1,e.$message({type:"success",message:"成功删除数据",showClose:!0}),e.getDeptList()}).catch(function(){e.$message({type:"error",message:"删除数据失败",showClose:!0})})):e.$message({type:"error",message:"禁止删除系统分类",showClose:!0})}).catch(function(){e.$message({type:"warning",message:"取消删除数据",showClose:!0})}):this.$message({type:"warning",message:"请选择需要删除的数据",showClose:!0})},editDept:function(){this.currentRow?(this.formValue=_.assign({},this.currentRow),this.formValue.iFunMenuIsShow=Boolean(this.formValue.iFunMenuIsShow),this.dialogVisible=!0,this.dialogtype=1):this.$message({type:"warning",message:"请选择需要编辑的数据",showClose:!0})},addDept:function(){this.dialogVisible=!0,this.dialogtype=0,this.formValue={iAdminID:this.$store.state.login.iAdminID,PiDeptID:this.nodeID,cDepName:void 0,cDepTel:void 0,cDepEmail:void 0},this.formValue.iFunFatherID=this.nodeID},handleClose:function(e){e()},editFormSubmit:function(){var e=this;this.$refs.formDialog.validate(function(t){if(!t)return!1;e.sunBtnLoad=!0,e.dialogtype?r.editDept(e.formValue).then(function(t){e.dialogVisible=!1,e.sunBtnLoad=!1,e.getDeptList()}).catch(function(){e.dialogVisible=!1,e.sunBtnLoad=!1,e.$message({type:"error",message:"编辑数据失败，请重试"})}):r.addDept(e.formValue).then(function(t){e.sunBtnLoad=!1,e.dialogVisible=!1,e.getDeptList()}).catch(function(){e.sunBtnLoad=!1,e.dialogVisible=!1,e.$message({type:"error",message:"新增数据失败，请重试"})})})}}},u=c,d=i("2877"),p=Object(d["a"])(u,a,n,!1,null,null,null);p.options.__file="DeptManage.vue";var m=p.exports;t["default"]=m},"454f":function(e,t,i){i("46a7");var a=i("584a").Object;e.exports=function(e,t,i){return a.defineProperty(e,t,i)}},"46a7":function(e,t,i){var a=i("63b6");a(a.S+a.F*!i("8e60"),"Object",{defineProperty:i("d9f6").f})},"85f2":function(e,t,i){e.exports=i("454f")},bd86:function(e,t,i){"use strict";i.d(t,"a",function(){return l});var a=i("85f2"),n=i.n(a);function l(e,t,i){return t in e?n()(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}},ccc3:function(e,t,i){"use strict";var a={};i.r(a),i.d(a,"DeptManage_Columns",function(){return o}),i.d(a,"UserManage_Columns",function(){return r}),i.d(a,"Modular_Columns",function(){return c}),i.d(a,"RoleManage_Columns",function(){return u}),i.d(a,"AppUpload_Columns",function(){return d});var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"table-contain-wrapper"},[i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"outDataSerchExcel exportTable",attrs:{stripe:"",border:"",height:"100%",data:e.tableData,"highlight-current-row":""},on:{"current-change":e.handleCurrentChange}},[e._l(e.columnList,function(t){return[t.template?i("el-table-column",{key:t.text,attrs:{fit:"true",prop:t.field,label:t.text,width:t.width,align:t.align,sortable:t.sortable,formatter:t.formatter},scopedSlots:e._u([{key:"default",fn:function(a){var n=a.row;return[i("span",{domProps:{innerHTML:e._s(t.template(n))}})]}}])}):i("el-table-column",{key:t.text,attrs:{fit:"true",prop:t.field,label:t.text,width:t.width,align:t.align,sortable:t.sortable,formatter:t.formatter}})]}),e.$options.filters.btnTree("/api/FunPurview/RefreshFunPurview",e.$route.meta.iFunID)&&e.modularDialog?i("el-table-column",{attrs:{prop:"iRoleID",label:"功能权限",align:"center",fixed:"right",width:"140px"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row;return[i("span",{staticClass:"my-detail",on:{click:function(t){e.modularDialogOpen(a)}}},[e._v("功能权限")])]}}])}):e._e()],2),e.paginationShow?i("el-pagination",{attrs:{"current-page":e.pageNumber,"page-size":e.pageSize,"page-sizes":[1,50,100,200],"pager-count":5,layout:"total, sizes, prev, pager, next, jumper",total:e.dataTotal},on:{"size-change":e.onPageSizeChange,"current-change":e.onPageChange,"update:currentPage":function(t){e.pageNumber=t}}}):e._e()],1)},l=[],o=[{field:"cDepName",text:"部门名称",align:"center",fixed:!1},{field:"cDepTel",text:"电话",align:"center",fixed:!1},{field:"cDepEmail",text:"邮件",align:"center",fixed:!1}],r=[{field:"cAdminName",text:"姓名",align:"center",fixed:!1},{field:"CJobNumber",text:"工号",align:"center",fixed:!1},{field:"cDepName",text:"部门",align:"center",fixed:!1},{field:"cRoleName",text:"岗位",align:"center",fixed:!1},{field:"cAdminSex",text:"性别",align:"center",fixed:!1},{field:"cAdminTel",text:"电话",align:"center",fixed:!1},{field:"cAdminEmail",text:"邮件",align:"center",fixed:!1},{field:"iIsLocked",text:"是否锁定",formatter:function(e,t,i,a){return i?"是":"否"},align:"center",fixed:!1},{field:"dExpireDate",text:"过期日期",align:"center",fixed:!1},{field:"iIsAllowChangePWD",text:"密码修改",formatter:function(e,t,i,a){return i?"允许":"不允许"},align:"center",fixed:!1}],s={1:"B/S 显示",3:"手机app",4:"C/S 显示"},c=[{field:"iFunID",text:"ID",align:"center",fixed:!1},{field:"cFunName",text:"功能名称",align:"center",fixed:!1},{field:"cFunUrl",text:"功能URl",align:"center",fixed:!1},{field:"cFunIcon",text:"icon名称",align:"center",fixed:!1},{field:"iFunOrder",text:"排序",align:"center",fixed:!1,sortable:!0},{field:"iFunMenuIsShow",text:"是否显示",template:function(e){return"<span class='"+(e.iFunMenuIsShow?"my-show-span":"")+"'>"+(e.iFunMenuIsShow?"显示":"隐藏")+"</span>"},align:"center",fixed:!1},{field:"System_Type",text:"系统类型",formatter:function(e,t,i,a){return s[i]},align:"center",fixed:!1},{field:"FunctionType",text:"点击类型",formatter:function(e,t,i,a){return 1===i?"页面":"按钮"},align:"center",fixed:!1}],u=[{field:"cRoleName",text:"岗位名称",align:"center",fixed:!1},{field:"isSuperAdmin",text:"是否是超级管理员",formatter:function(e,t,i,a){return i?"是":"否"},align:"center",fixed:!1}],d=[{field:"APKNAME",text:"APK名称",align:"center",fixed:!1},{field:"VERSIONID",text:"版本号",align:"center",fixed:!1},{field:"UPLOADTIME",text:"上传时间",align:"center",fixed:!1}],p={props:["tableData","layerListName","loading","dataTotal","pageNumber","pageSize","paginationShow","modularDialog"],data:function(){return{}},computed:{columnList:function(){return a[this.layerListName]}},methods:{handleCurrentChange:function(e){this.$emit("currentChange",e)},onPageChange:function(e){this.$emit("onPageChange",e)},onPageSizeChange:function(e){this.$emit("onPageSizeChange",e)},modularDialogOpen:function(e){this.$emit("modularDialogOpen",e)}}},m=p,f=i("2877"),D=Object(f["a"])(m,n,l,!1,null,null,null);D.options.__file="SysTable.vue";t["a"]=D.exports}}]);
//# sourceMappingURL=chunk-6c59d58b.d11aa836.js.map