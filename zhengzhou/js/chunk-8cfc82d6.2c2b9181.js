(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-8cfc82d6"],{"49f3":function(e,t,a){"use strict";var n=a("e70e"),i=a.n(n);i.a},"804c":function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"table_style"},[a("el-row",{staticClass:"modularWrapper",attrs:{type:"flex"}},[a("el-col",{staticClass:"table-flex-wraper"},[a("el-form",{attrs:{"label-width":"80px"}},[a("el-row",[a("el-col",{attrs:{span:"5",xs:14,lg:3}},[a("el-form-item",{attrs:{label:"版本号："}},[a("el-input",{attrs:{size:"mini"},model:{value:e.VersionId,callback:function(t){e.VersionId=t},expression:"VersionId"}})],1)],1),a("el-col",{attrs:{span:"19",xs:24}},[a("el-row",{staticStyle:{padding:"0"},attrs:{type:"flex",justify:"start"}},[a("el-form-item",{attrs:{"label-width":"20px"}},[a("el-upload",{ref:"upload",staticClass:"uploadWrapper",attrs:{action:e.appUploadList+"?VersionId="+e.VersionId,headers:e.uploadHeaders,"on-remove":e.handleRemove,"auto-upload":!1,name:"filds","on-exceed":e.handleExceed,limit:1,"on-success":e.successUpload,"on-error":e.errorUpload,"on-change":e.handleChange}},[a("el-button",{staticClass:"my-choose-point",attrs:{slot:"trigger",size:"mini",type:"primary"},slot:"trigger"},[e._v("选取文件")]),a("div",{staticStyle:{"padding-left":"20px"}},[a("el-button",{staticClass:"my-search",attrs:{size:"mini",loading:e.sunBtnLoad},on:{click:e.submitUpload}},[e._v("上传到服务器")])],1),a("div",{directives:[{name:"show",rawName:"v-show",value:!e.fileList.length,expression:"!fileList.length"}],staticClass:"el-upload__tip",attrs:{slot:"tip"},slot:"tip"},[a("p",[e._v("只能上传apk文件，且文件名为V x.x.x格式")])])],1)],1)],1)],1)],1)],1),a("SysTable",{attrs:{tableData:e.tableData,loading:e.loading,layerListName:"AppUpload_Columns",paginationShow:!0,pageNumber:e.GetformValue.page,pageSize:e.GetformValue.num,dataTotal:e.dataTotal},on:{currentChange:e.currentChange,onPageSizeChange:e.onPageSizeChange,onPageChange:e.onPageChange}})],1)],1)],1)},i=[],r=(a("c5f6"),a("d255")),l=a("39c6"),s={getAppList:function(e){return r["a"].get("CellphoneManage/Get",{params:{num:Number(e.num),page:Number(e.page)}})},appUploadList:l["a"].apiPath.insURL+"/api/CellphoneManage/UploadApk"},o=a("ccc3"),u={components:{SysTable:o["a"]},data:function(){return{loading:!1,appUploadList:s.appUploadList,uploadHeaders:{},VersionId:"",fileList:[],tableData:[],dataTotal:1,currentRow:null,sunBtnLoad:!1,GetformValue:{num:50,page:1}}},created:function(){this.$store.state.login.userToken&&(this.uploadHeaders.Token=this.$store.state.login.userToken),this.getAppList()},computed:{},methods:{filePreview:function(e){console.log(e)},handleRemove:function(e,t){this.fileList=t},handleChange:function(e,t){this.fileList=t},getAppList:function(){var e=this;this.loading=!0,s.getAppList(this.GetformValue).then(function(t){e.loading=!1,e.dataTotal=t.data.Data.TotalRows,e.tableData=t.data.Data.Result})},handleExceed:function(e,t){this.$message.warning("当前限制选择 1 个文件，本次选择了 ".concat(e.length," 个文件，共选择了 ").concat(e.length+t.length," 个文件"))},successUpload:function(e){this.sunBtnLoad=!1,3===e.ErrorType?(this.$message({type:"success",message:"上传成功"}),this.$refs.upload.clearFiles(),this.getAppList()):(this.$message({type:"error",message:e.Msg}),this.$refs.upload.clearFiles())},errorUpload:function(e){this.sunBtnLoad=!1,this.$message({type:"error",message:e.Msg}),this.$refs.upload.clearFiles()},submitUpload:function(){console.log(this.fileList),this.VersionId?this.fileList.length?(this.sunBtnLoad=!0,this.$refs.upload.submit()):this.$message({type:"warning",message:"文件未选择",showClose:!0}):this.$message({type:"warning",message:"版本号为必填项",showClose:!0})},currentChange:function(e){this.currentRow=e},onPageSizeChange:function(e){this.GetformValue.num=e,this.GetformValue.page=1,this.getAppList()},onPageChange:function(e){this.GetformValue.page=e,this.getAppList()}}},c=u,d=(a("49f3"),a("2877")),p=Object(d["a"])(c,n,i,!1,null,null,null);p.options.__file="AppUpload.vue";var g=p.exports;t["default"]=g},ccc3:function(e,t,a){"use strict";var n={};a.r(n),a.d(n,"DeptManage_Columns",function(){return l}),a.d(n,"UserManage_Columns",function(){return s}),a.d(n,"Modular_Columns",function(){return u}),a.d(n,"RoleManage_Columns",function(){return c}),a.d(n,"AppUpload_Columns",function(){return d});var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"table-contain-wrapper"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"outDataSerchExcel exportTable",attrs:{stripe:"",border:"",height:"100%",data:e.tableData,"highlight-current-row":""},on:{"current-change":e.handleCurrentChange}},[e._l(e.columnList,function(t){return[t.template?a("el-table-column",{key:t.text,attrs:{fit:"true",prop:t.field,label:t.text,width:t.width,align:t.align,sortable:t.sortable,formatter:t.formatter},scopedSlots:e._u([{key:"default",fn:function(n){var i=n.row;return[a("span",{domProps:{innerHTML:e._s(t.template(i))}})]}}])}):a("el-table-column",{key:t.text,attrs:{fit:"true",prop:t.field,label:t.text,width:t.width,align:t.align,sortable:t.sortable,formatter:t.formatter}})]}),e.$options.filters.btnTree("/api/FunPurview/RefreshFunPurview",e.$route.meta.iFunID)&&e.modularDialog?a("el-table-column",{attrs:{prop:"iRoleID",label:"功能权限",align:"center",fixed:"right",width:"140px"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row;return[a("span",{staticClass:"my-detail",on:{click:function(t){e.modularDialogOpen(n)}}},[e._v("功能权限")])]}}])}):e._e()],2),e.paginationShow?a("el-pagination",{attrs:{"current-page":e.pageNumber,"page-size":e.pageSize,"page-sizes":[1,50,100,200],"pager-count":5,layout:"total, sizes, prev, pager, next, jumper",total:e.dataTotal},on:{"size-change":e.onPageSizeChange,"current-change":e.onPageChange,"update:currentPage":function(t){e.pageNumber=t}}}):e._e()],1)},r=[],l=[{field:"cDepName",text:"部门名称",align:"center",fixed:!1},{field:"cDepTel",text:"电话",align:"center",fixed:!1},{field:"cDepEmail",text:"邮件",align:"center",fixed:!1}],s=[{field:"cAdminName",text:"姓名",align:"center",fixed:!1},{field:"CJobNumber",text:"工号",align:"center",fixed:!1},{field:"cDepName",text:"部门",align:"center",fixed:!1},{field:"cRoleName",text:"岗位",align:"center",fixed:!1},{field:"cAdminSex",text:"性别",align:"center",fixed:!1},{field:"cAdminTel",text:"电话",align:"center",fixed:!1},{field:"cAdminEmail",text:"邮件",align:"center",fixed:!1},{field:"iIsLocked",text:"是否锁定",formatter:function(e,t,a,n){return a?"是":"否"},align:"center",fixed:!1},{field:"dExpireDate",text:"过期日期",align:"center",fixed:!1},{field:"iIsAllowChangePWD",text:"密码修改",formatter:function(e,t,a,n){return a?"允许":"不允许"},align:"center",fixed:!1}],o={1:"B/S 显示",3:"手机app",4:"C/S 显示"},u=[{field:"iFunID",text:"ID",align:"center",fixed:!1},{field:"cFunName",text:"功能名称",align:"center",fixed:!1},{field:"cFunUrl",text:"功能URl",align:"center",fixed:!1},{field:"cFunIcon",text:"icon名称",align:"center",fixed:!1},{field:"iFunOrder",text:"排序",align:"center",fixed:!1,sortable:!0},{field:"iFunMenuIsShow",text:"是否显示",template:function(e){return"<span class='"+(e.iFunMenuIsShow?"my-show-span":"")+"'>"+(e.iFunMenuIsShow?"显示":"隐藏")+"</span>"},align:"center",fixed:!1},{field:"System_Type",text:"系统类型",formatter:function(e,t,a,n){return o[a]},align:"center",fixed:!1},{field:"FunctionType",text:"点击类型",formatter:function(e,t,a,n){return 1===a?"页面":"按钮"},align:"center",fixed:!1}],c=[{field:"cRoleName",text:"岗位名称",align:"center",fixed:!1},{field:"isSuperAdmin",text:"是否是超级管理员",formatter:function(e,t,a,n){return a?"是":"否"},align:"center",fixed:!1}],d=[{field:"APKNAME",text:"APK名称",align:"center",fixed:!1},{field:"VERSIONID",text:"版本号",align:"center",fixed:!1},{field:"UPLOADTIME",text:"上传时间",align:"center",fixed:!1}],p={props:["tableData","layerListName","loading","dataTotal","pageNumber","pageSize","paginationShow","modularDialog"],data:function(){return{}},computed:{columnList:function(){return n[this.layerListName]}},methods:{handleCurrentChange:function(e){this.$emit("currentChange",e)},onPageChange:function(e){this.$emit("onPageChange",e)},onPageSizeChange:function(e){this.$emit("onPageSizeChange",e)},modularDialogOpen:function(e){this.$emit("modularDialogOpen",e)}}},g=p,f=a("2877"),m=Object(f["a"])(g,i,r,!1,null,null,null);m.options.__file="SysTable.vue";t["a"]=m.exports},d255:function(e,t,a){"use strict";var n=a("795b"),i=a.n(n),r=a("bc3a"),l=a.n(r),s=a("5c96"),o=a("39c6"),u=a("4360"),c=o["a"].apiPath.insURL,d=l.a.create({baseURL:c+"/api",crossDomain:!0,timeout:3e4,responseType:"json"});d.interceptors.request.use(function(e){var t=localStorage.getItem("iAdminID");return u["a"].state.login.userToken?e.headers.Token=u["a"].state.login.userToken:t&&(e.headers.Token=JSON.parse(t).Token),e},function(e){return i.a.reject(e)}),d.interceptors.response.use(function(e){return 3===e.data.ErrorType?e:(Object(s["Message"])({type:"error",message:e.data.Msg,showClose:!0}),i.a.reject(e))},function(e){return console.log(e),Object(s["Message"])({type:"warn",message:"网络异常，请重试",showClose:!0}),i.a.reject(e)}),t["a"]=d},e70e:function(e,t,a){}}]);
//# sourceMappingURL=chunk-8cfc82d6.2c2b9181.js.map