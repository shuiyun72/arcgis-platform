(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7e6afc14"],{"0e8b":function(e,t,a){"use strict";var i=a("3a59"),l=a.n(i);l.a},1520:function(e,t,a){"use strict";a("c5f6");var i=a("d255");t["a"]={DeptData:function(){return i["a"].get("/Department/GetUserComboboxList")},AdminNameData:function(e){return i["a"].get("/User/GetUserComboboxList",{params:{deptId:Number(e)}})},GetUserComboboxListNoDelete:function(e){return i["a"].get("/User/GetUserComboboxListNoDelete",{params:{deptId:Number(e)}})},GetPlanCycle:function(){return i["a"].get("/PlanCycle/GetCombobox")}}},"28a5":function(e,t,a){"use strict";var i=a("aae3"),l=a("cb7c"),n=a("ebd6"),r=a("0390"),s=a("9def"),o=a("5f1b"),u=a("520a"),c=a("79e5"),d=Math.min,m=[].push,h="split",f="length",p="lastIndex",g=4294967295,b=!c(function(){RegExp(g,"y")});a("214f")("split",2,function(e,t,a,c){var v;return v="c"=="abbc"[h](/(b)*/)[1]||4!="test"[h](/(?:)/,-1)[f]||2!="ab"[h](/(?:ab)*/)[f]||4!="."[h](/(.?)(.?)/)[f]||"."[h](/()()/)[f]>1||""[h](/.?/)[f]?function(e,t){var l=String(this);if(void 0===e&&0===t)return[];if(!i(e))return a.call(l,e,t);var n,r,s,o=[],c=(e.ignoreCase?"i":"")+(e.multiline?"m":"")+(e.unicode?"u":"")+(e.sticky?"y":""),d=0,h=void 0===t?g:t>>>0,b=new RegExp(e.source,c+"g");while(n=u.call(b,l)){if(r=b[p],r>d&&(o.push(l.slice(d,n.index)),n[f]>1&&n.index<l[f]&&m.apply(o,n.slice(1)),s=n[0][f],d=r,o[f]>=h))break;b[p]===n.index&&b[p]++}return d===l[f]?!s&&b.test("")||o.push(""):o.push(l.slice(d)),o[f]>h?o.slice(0,h):o}:"0"[h](void 0,0)[f]?function(e,t){return void 0===e&&0===t?[]:a.call(this,e,t)}:a,[function(a,i){var l=e(this),n=void 0==a?void 0:a[t];return void 0!==n?n.call(a,l,i):v.call(String(l),a,i)},function(e,t){var i=c(v,e,this,t,v!==a);if(i.done)return i.value;var u=l(e),m=String(this),h=n(u,RegExp),f=u.unicode,p=(u.ignoreCase?"i":"")+(u.multiline?"m":"")+(u.unicode?"u":"")+(b?"y":"g"),D=new h(b?u:"^(?:"+u.source+")",p),I=void 0===t?g:t>>>0;if(0===I)return[];if(0===m.length)return null===o(D,m)?[m]:[];var y=0,x=0,C=[];while(x<m.length){D.lastIndex=b?x:0;var N,L=o(D,b?m:m.slice(x));if(null===L||(N=d(s(D.lastIndex+(b?0:x)),m.length))===y)x=r(m,x,f);else{if(C.push(m.slice(y,x)),C.length===I)return C;for(var w=1;w<=L.length-1;w++)if(C.push(L[w]),C.length===I)return C;x=y=N}}return C.push(m.slice(y)),C}]})},"2ace":function(e,t,a){"use strict";a("c5f6");var i=a("0f1a");t["a"]={getUserList:function(e){return i["a"].get("/User/Get",{params:{deptId:e.deptId||"",userName:e.userName||"",roleId:null==e.roleId?"":Number(e.roleId),num:e.num?Number(e.num):"",page:e.page?Number(e.page):""}})},delUser:function(e){return i["a"].delete("/User/Delete",{params:{iAdminID:Number(e)}})},addUser:function(e){return i["a"].post("/User/Post",{cAdminName:e.cAdminName,CJobNumber:e.CJobNumber,iDeptID:Number(e.iDeptID),iRoleID:Number(e.iRoleID),Level:e.Level,cAdminSex:e.cAdminSex,cAdminTel:e.cAdminTel,iIsLocked:Number(e.iIsLocked),iIsAllowChangePWD:Number(e.iIsAllowChangePWD),dExpireDate:e.dExpireDate,cAdminPassWord:"123",P_Role:{},UserAuthority:[],cAdminEmail:e.cAdminEmail})},editUser:function(e){return i["a"].put("/User/Put?iAdminID="+e.iAdminID,{cAdminName:e.cAdminName,CJobNumber:e.CJobNumber,iDeptID:Number(e.iDeptID),iRoleID:Number(e.iRoleID),Level:e.Level,cAdminSex:e.cAdminSex,cAdminTel:e.cAdminTel,iIsLocked:Number(e.iIsLocked),iIsAllowChangePWD:Number(e.iIsAllowChangePWD),dExpireDate:e.dExpireDate,cAdminPassWord:"123",P_Role:{},UserAuthority:[],cAdminEmail:e.cAdminEmail})},ResetUser:function(e){return i["a"].put("/User/ResetPassword?iAdminID="+e)},ChangePassword:function(e){return i["a"].put("/User/ChangePassword",{iAdminID:Number(e.iAdminID),cAdminName:e.cAdminName,cAdminPassWord:e.cAdminPassWord,oldcAdminPassWord:e.oldcAdminPassWord})}}},"2b53":function(e,t,a){"use strict";a("c5f6");var i=a("0f1a");t["a"]={getRoleList:function(e){return i["a"].get("/Role/Get",{params:e})},addRole:function(e){return i["a"].post("/Role/Post",{cRoleName:e.cRoleName,isSuperAdmin:e.isSuperAdmin})},editRole:function(e){return i["a"].put("/Role/Put?iRoleID="+Number(e.iRoleID),e)},delRole:function(e){return i["a"].delete("/Role/Delete",{params:{iRoleID:Number(e)}})}}},"3a59":function(e,t,a){},6009:function(e,t,a){"use strict";var i=a("a298"),l=a.n(i);l.a},"99db":function(e,t,a){"use strict";a("c5f6");var i=a("0f1a");t["a"]={getModular:function(){return i["a"].get("/Function/Get")},delModular:function(e){return i["a"].delete("/Function/Delete",{params:{iFunId:Number(e)}})},addModular:function(e){return i["a"].post("/Function/Post",{System_Type:Number(e.System_Type),FunctionType:Number(e.FunctionType),cFunName:e.cFunName,cFunUrl:e.cFunUrl,iFunFatherID:Number(e.iFunFatherID),iFunMenuIsShow:Number(e.iFunMenuIsShow),iFunOrder:Number(e.iFunOrder),cFunIcon:e.cFunIcon})},editModular:function(e){return i["a"].put("/Function/Put",{iFunID:Number(e.iFunID),System_Type:Number(e.System_Type),FunctionType:Number(e.FunctionType),cFunName:e.cFunName,cFunUrl:e.cFunUrl,iFunFatherID:Number(e.iFunFatherID),iFunMenuIsShow:Number(e.iFunMenuIsShow),iFunOrder:Number(e.iFunOrder),cFunIcon:e.cFunIcon})}}},a298:function(e,t,a){},ccc3:function(e,t,a){"use strict";var i={};a.r(i),a.d(i,"DeptManage_Columns",function(){return r}),a.d(i,"UserManage_Columns",function(){return s}),a.d(i,"Modular_Columns",function(){return u}),a.d(i,"RoleManage_Columns",function(){return c}),a.d(i,"AppUpload_Columns",function(){return d});var l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"table-contain-wrapper"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"outDataSerchExcel exportTable",attrs:{stripe:"",border:"",height:"100%",data:e.tableData,"highlight-current-row":""},on:{"current-change":e.handleCurrentChange}},[e._l(e.columnList,function(t){return[t.template?a("el-table-column",{key:t.text,attrs:{fit:"true",prop:t.field,label:t.text,width:t.width,align:t.align,sortable:t.sortable,formatter:t.formatter},scopedSlots:e._u([{key:"default",fn:function(i){var l=i.row;return[a("span",{domProps:{innerHTML:e._s(t.template(l))}})]}}])}):a("el-table-column",{key:t.text,attrs:{fit:"true",prop:t.field,label:t.text,width:t.width,align:t.align,sortable:t.sortable,formatter:t.formatter}})]}),e.$options.filters.btnTree("/api/FunPurview/RefreshFunPurview",e.$route.meta.iFunID)&&e.modularDialog?a("el-table-column",{attrs:{prop:"iRoleID",label:"功能权限",align:"center",fixed:"right",width:"140px"},scopedSlots:e._u([{key:"default",fn:function(t){var i=t.row;return[a("span",{staticClass:"my-detail",on:{click:function(t){e.modularDialogOpen(i)}}},[e._v("功能权限")])]}}])}):e._e()],2),e.paginationShow?a("el-pagination",{attrs:{"current-page":e.pageNumber,"page-size":e.pageSize,"page-sizes":[1,50,100,200],"pager-count":5,layout:"total, sizes, prev, pager, next, jumper",total:e.dataTotal},on:{"size-change":e.onPageSizeChange,"current-change":e.onPageChange,"update:currentPage":function(t){e.pageNumber=t}}}):e._e()],1)},n=[],r=[{field:"cDepName",text:"部门名称",align:"center",fixed:!1},{field:"cDepTel",text:"电话",align:"center",fixed:!1},{field:"cDepEmail",text:"邮件",align:"center",fixed:!1}],s=[{field:"cAdminName",text:"姓名",align:"center",fixed:!1},{field:"CJobNumber",text:"工号",align:"center",fixed:!1},{field:"cDepName",text:"部门",align:"center",fixed:!1},{field:"cRoleName",text:"岗位",align:"center",fixed:!1},{field:"cAdminSex",text:"性别",align:"center",fixed:!1},{field:"cAdminTel",text:"电话",align:"center",fixed:!1},{field:"cAdminEmail",text:"邮件",align:"center",fixed:!1},{field:"iIsLocked",text:"是否锁定",formatter:function(e,t,a,i){return a?"是":"否"},align:"center",fixed:!1},{field:"dExpireDate",text:"过期日期",align:"center",fixed:!1},{field:"iIsAllowChangePWD",text:"密码修改",formatter:function(e,t,a,i){return a?"允许":"不允许"},align:"center",fixed:!1}],o={1:"B/S 显示",3:"手机app",4:"C/S 显示"},u=[{field:"iFunID",text:"ID",align:"center",fixed:!1},{field:"cFunName",text:"功能名称",align:"center",fixed:!1},{field:"cFunUrl",text:"功能URl",align:"center",fixed:!1},{field:"cFunIcon",text:"icon名称",align:"center",fixed:!1},{field:"iFunOrder",text:"排序",align:"center",fixed:!1,sortable:!0},{field:"iFunMenuIsShow",text:"是否显示",template:function(e){return"<span class='"+(e.iFunMenuIsShow?"my-show-span":"")+"'>"+(e.iFunMenuIsShow?"显示":"隐藏")+"</span>"},align:"center",fixed:!1},{field:"System_Type",text:"系统类型",formatter:function(e,t,a,i){return o[a]},align:"center",fixed:!1},{field:"FunctionType",text:"点击类型",formatter:function(e,t,a,i){return 1===a?"页面":"按钮"},align:"center",fixed:!1}],c=[{field:"cRoleName",text:"岗位名称",align:"center",fixed:!1},{field:"isSuperAdmin",text:"是否是超级管理员",formatter:function(e,t,a,i){return a?"是":"否"},align:"center",fixed:!1}],d=[{field:"APKNAME",text:"APK名称",align:"center",fixed:!1},{field:"VERSIONID",text:"版本号",align:"center",fixed:!1},{field:"UPLOADTIME",text:"上传时间",align:"center",fixed:!1}],m={props:["tableData","layerListName","loading","dataTotal","pageNumber","pageSize","paginationShow","modularDialog"],data:function(){return{}},computed:{columnList:function(){return i[this.layerListName]}},methods:{handleCurrentChange:function(e){this.$emit("currentChange",e)},onPageChange:function(e){this.$emit("onPageChange",e)},onPageSizeChange:function(e){this.$emit("onPageSizeChange",e)},modularDialogOpen:function(e){this.$emit("modularDialogOpen",e)}}},h=m,f=a("2877"),p=Object(f["a"])(h,l,n,!1,null,null,null);p.options.__file="SysTable.vue";t["a"]=p.exports},d255:function(e,t,a){"use strict";var i=a("795b"),l=a.n(i),n=a("bc3a"),r=a.n(n),s=a("5c96"),o=a("39c6"),u=a("4360"),c=o["a"].apiPath.insURL,d=r.a.create({baseURL:c+"/api",crossDomain:!0,timeout:3e4,responseType:"json"});d.interceptors.request.use(function(e){var t=localStorage.getItem("iAdminID");return u["a"].state.login.userToken?e.headers.Token=u["a"].state.login.userToken:t&&(e.headers.Token=JSON.parse(t).Token),e},function(e){return l.a.reject(e)}),d.interceptors.response.use(function(e){return 3===e.data.ErrorType?e:(Object(s["Message"])({type:"error",message:e.data.Msg,showClose:!0}),l.a.reject(e))},function(e){return console.log(e),Object(s["Message"])({type:"warn",message:"网络异常，请重试",showClose:!0}),l.a.reject(e)}),t["a"]=d},f400:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"table_style"},[a("el-row",{staticClass:"modularWrapper",attrs:{type:"flex"}},[a("el-col",{staticClass:"table-flex-wraper"},[a("el-form",{attrs:{"label-width":"70px","label-position":"right",size:"mini",gutter:"20px"}},[a("el-row",[a("el-col",{attrs:{span:"6",lg:4}},[a("el-form-item",{attrs:{label:"部门：","label-width":"46px"}},[a("DeptSelect",{attrs:{allState:!0,name:"GetformValue",selectValue:e.GetformValue.deptId},on:{getChildChange:e.getChildChange}})],1)],1),a("el-col",{attrs:{span:"6",lg:4}},[a("el-form-item",{attrs:{label:"岗位："}},[a("RoleSelect",{attrs:{selectValue:e.GetformValue.roleId,allState:!0},on:{"update:selectValue":function(t){e.$set(e.GetformValue,"roleId",t)}}})],1)],1),a("el-col",{attrs:{span:"6",lg:4}},[a("el-form-item",{attrs:{label:"姓名："}},[a("el-input",{model:{value:e.GetformValue.userName,callback:function(t){e.$set(e.GetformValue,"userName",t)},expression:"GetformValue.userName"}})],1)],1),a("el-col",{attrs:{span:"5",lg:2}},[a("el-row",{staticStyle:{padding:"0","padding-left":"20px"},attrs:{type:"flex",justify:"start"}},[e.$options.filters.btnTree("/api/User/Get",e.$route.meta.iFunID)?a("el-button",{staticClass:"my-search",attrs:{size:"mini"},on:{click:e.getUserList}},[e._v("查询")]):e._e()],1)],1)],1)],1),a("div",{staticClass:"table-btn-control"},[a("el-row",{attrs:{type:"flex",justify:"strat"}},[e.$options.filters.btnTree("/api/User/Post",e.$route.meta.iFunID)?a("el-button",{staticClass:"my-tableout",attrs:{plain:"",size:"mini"},on:{click:e.addUser}},[a("i",{staticClass:"iconfont icon-xinzeng"}),e._v("新增\n          ")]):e._e(),e.$options.filters.btnTree("/api/User/Put",e.$route.meta.iFunID)?a("el-button",{staticClass:"my-tableout",attrs:{size:"mini"},on:{click:e.editUser}},[a("i",{staticClass:"iconfont icon-bianji"}),e._v("编辑\n          ")]):e._e(),e.$options.filters.btnTree("/api/User/Delete",e.$route.meta.iFunID)?a("el-button",{staticClass:"my-tableout",attrs:{size:"mini"},on:{click:e.delUser}},[a("i",{staticClass:"iconfont icon-shanchu"}),e._v("删除\n          ")]):e._e(),e.$options.filters.btnTree("/api/User/ResetPassword",e.$route.meta.iFunID)?a("el-button",{staticClass:"my-tableout",attrs:{size:"mini"},on:{click:e.resertUserPassWard}},[a("i",{staticClass:"iconfont icon-chushihuamima"}),e._v("初始化密码\n          ")]):e._e()],1)],1),a("SysTable",{attrs:{tableData:e.tableData,loading:e.loading,layerListName:"UserManage_Columns",paginationShow:!0,modularDialog:!0,pageNumber:e.GetformValue.page,pageSize:e.GetformValue.num,dataTotal:e.dataTotal},on:{currentChange:e.currentChange,modularDialogOpen:e.modularDialogOpen,onPageSizeChange:e.onPageSizeChange,onPageChange:e.onPageChange}})],1)],1),a("el-dialog",{staticClass:"myDialog",attrs:{title:e.dialogtype?"修改用户":"新增用户",visible:e.dialogVisible,width:"500","before-close":e.handleClose,customClass:"el_add_dialog"},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("el-form",{ref:"formDialog",attrs:{model:e.formValue,"label-width":"100px",size:"small",rules:e.rules}},[a("el-form-item",{attrs:{label:"用户名称：",prop:"cAdminName"}},[a("el-input",{attrs:{placeholder:"请输入用户名称"},model:{value:e.formValue.cAdminName,callback:function(t){e.$set(e.formValue,"cAdminName",t)},expression:"formValue.cAdminName"}})],1),a("el-form-item",{attrs:{label:"工号：",prop:"CJobNumber"}},[a("el-input-number",{attrs:{placeholder:"请输入工号","controls-position":"right"},model:{value:e.formValue.CJobNumber,callback:function(t){e.$set(e.formValue,"CJobNumber",t)},expression:"formValue.CJobNumber"}})],1),a("el-form-item",{attrs:{label:"所属部门：",prop:"iDeptID"}},[a("DeptSelect",{attrs:{allState:!1,name:"formValue",selectValue:e.formValue.iDeptID},on:{getChildChange:e.getChildChange}})],1),a("el-form-item",{attrs:{label:"所属岗位：",prop:"iRoleID"}},[a("RoleSelect",{attrs:{selectValue:e.formValue.iRoleID,allState:!1},on:{"update:selectValue":function(t){e.$set(e.formValue,"iRoleID",t)}}})],1),a("el-form-item",{attrs:{label:"级别："}},[a("el-radio-group",{model:{value:e.formValue.Level,callback:function(t){e.$set(e.formValue,"Level",t)},expression:"formValue.Level"}},[a("el-radio",{attrs:{label:1}},[e._v("基层")]),a("el-radio",{attrs:{label:2}},[e._v("中层")]),a("el-radio",{attrs:{label:3}},[e._v("高层")])],1)],1),a("el-form-item",{directives:[{name:"show",rawName:"v-show",value:!e.dialogtype,expression:"!dialogtype"}],attrs:{label:"性别："}},[a("el-radio-group",{model:{value:e.formValue.cAdminSex,callback:function(t){e.$set(e.formValue,"cAdminSex",t)},expression:"formValue.cAdminSex"}},[a("el-radio",{attrs:{label:"男",value:"男"}}),a("el-radio",{attrs:{label:"女",value:"女"}})],1)],1),a("el-form-item",{attrs:{label:"联系电话：",prop:"cAdminTel"}},[a("el-input",{attrs:{placeholder:"请输入联系电话"},model:{value:e.formValue.cAdminTel,callback:function(t){e.$set(e.formValue,"cAdminTel",t)},expression:"formValue.cAdminTel"}})],1),a("el-form-item",{attrs:{label:"电子邮件：",prop:"cAdminEmail"}},[a("el-input",{attrs:{placeholder:"请输入电子邮件"},model:{value:e.formValue.cAdminEmail,callback:function(t){e.$set(e.formValue,"cAdminEmail",t)},expression:"formValue.cAdminEmail"}})],1),a("el-form-item",{attrs:{label:"锁定："}},[a("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:e.formValue.iIsLocked,callback:function(t){e.$set(e.formValue,"iIsLocked",t)},expression:"formValue.iIsLocked"}})],1),a("el-form-item",{attrs:{label:"修改密码："}},[a("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:e.formValue.iIsAllowChangePWD,callback:function(t){e.$set(e.formValue,"iIsAllowChangePWD",t)},expression:"formValue.iIsAllowChangePWD"}})],1),a("el-form-item",{attrs:{label:"过期时间：",prop:"dExpireDate"}},[a("el-date-picker",{attrs:{"value-format":"yyyy-MM-dd",type:"date",placeholder:"选择日期"},model:{value:e.formValue.dExpireDate,callback:function(t){e.$set(e.formValue,"dExpireDate",t)},expression:"formValue.dExpireDate"}})],1)],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{staticClass:"my-dialog-cancel",on:{click:function(t){e.dialogVisible=!1}}},[e._v("取 消")]),a("el-button",{staticClass:"my-dialog-submit",attrs:{loading:e.sunBtnLoad},on:{click:e.editFormSubmit}},[e._v("确 定")])],1)],1),a("modularDialog",{attrs:{modulaBtnVisable:e.modulaBtnVisable,modularDialogVisable:e.modularDialogVisable,nodeID:e.dialognodeID},on:{"update:modulaBtnVisable":function(t){e.modulaBtnVisable=t},"update:modularDialogVisable":function(t){e.modularDialogVisable=t},modularDialogSubmit:e.modularDialogSubmit}})],1)},l=[],n=(a("7f7f"),a("99db"),a("1520")),r=a("2ace"),s=a("2b53"),o=a("78cd"),u=a("fbc2"),c=a("ccc3"),d=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-select",{staticClass:"selectTree",attrs:{value:e.valueTitle}},[a("el-option",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{value:e.valueTitle,label:e.valueTitle}},[a("el-scrollbar",{staticClass:"selectTreeScroll",staticStyle:{height:"260px"}},[a("el-tree",{ref:"selectTree",attrs:{id:"tree-option",data:e.treeData,props:e.selectTreeProps,"node-key":e.selectTreeProps.value,"default-expanded-keys":e.defaultExpandedKey},on:{"node-click":e.handleNodeClick}})],1)],1)],1)},m=[],h=(a("ac6a"),{props:["selectValue","name","allState"],data:function(){return{selectTreeProps:{value:"iDeptID",label:"cDepName",children:"children"},departAllList:[],departList:[],loading:!0,valueId:this.selectValue,valueTitle:"",defaultExpandedKey:[]}},created:function(){var e=this;this.$store.state.system.departAllList.length?(this.departAllList=this.$store.state.system.departAllList,this.departList=this.$store.state.system.departList,this.loading=!1,this.$nextTick(function(){e.initHandle()})):this.getDepartList()},watch:{selectValue:function(){this.valueId=this.selectValue,this.initHandle()}},computed:{treeData:function(){return this.allState?this.departAllList:this.departList}},methods:{getChildChange:function(e,t){this.$emit("getChildChange",e,t)},getDepartList:function(){var e=this;this.loading=!0,n["a"].DeptData().then(function(t){var a={};_.forEach(t.data.Data.Result,function(e){a[e.PiDeptID]?a[e.PiDeptID].push(e):a[e.PiDeptID]=[e]});var i=[{cDepName:"公司",iDeptID:1,children:[]}];e.DeptSerialize(i,a),e.departList=i[0].children,e.departAllList=_.cloneDeep(e.departList),e.departAllList.unshift({cDepName:"全部",iDeptID:""}),e.loading=!1,e.$store.dispatch("system/SetDeptList",{departAllList:e.departAllList,departList:e.departList}),e.$nextTick(function(){e.initHandle()})}).catch(function(){e.$message({type:"error",message:"获取数据失败",showClose:!0})})},DeptSerialize:function(e,t){var a=this;_.map(e,function(e){if(t[e.iDeptID]){e.children=t[e.iDeptID];var i={};i.cDepName=e.cDepName,e.parent&&(i.parent=e.parent),1!==e.iDeptID&&_.forEach(e.children,function(e){e.parent=i}),a.DeptSerialize(e.children,t)}})},initHandle:function(){if(console.log("initHandle",this.valueId),this.valueId){if(this.$refs.selectTree.setCurrentKey(this.valueId),this.defaultExpandedKey=[this.valueId],!this.$refs.selectTree.getNode(this.valueId))return;this.valueTitle=this.$refs.selectTree.getNode(this.valueId).data[this.selectTreeProps.label]}else(_.isUndefined(this.valueId)||_.isNull(this.valueId))&&(this.valueTitle="",this.$refs.selectTree.setCurrentKey(null),this.defaultExpandedKey=[]);this.$nextTick(function(){var e=document.querySelectorAll(".el-scrollbar .el-select-dropdown__wrap")[0],t=document.querySelectorAll(".el-scrollbar .el-scrollbar__bar");e.style.cssText="margin: 0px; max-height: none; overflow: hidden;",t.forEach(function(e){return e.style.width=0})})},handleNodeClick:function(e){var t=[];this.valueTitleParent(e,t),this.valueTitle=t.join("-"),this.valueId=e[this.selectTreeProps.value],this.$emit("getChildChange",this.name,this.valueId),this.defaultExpandedKey=[]},valueTitleParent:function(e,t){e?(t.push(e[this.selectTreeProps.label]),this.valueTitleParent(e.parent,t)):t=_.reverse(t)},clearSelected:function(){var e=document.querySelectorAll("#tree-option .el-tree-node");e.forEach(function(e){return e.classList.remove("is-current")})}}}),f=h,p=(a("0e8b"),a("2877")),g=Object(p["a"])(f,d,m,!1,null,"496d6915",null);g.options.__file="DeptSelect.vue";var b=g.exports,v=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-select",{attrs:{placeholder:"请选择岗位"},on:{change:e.selectChange},model:{value:e.valueId,callback:function(t){e.valueId=t},expression:"valueId"}},[a("el-option",{directives:[{name:"show",rawName:"v-show",value:e.allState,expression:"allState"}],key:"全部",attrs:{label:"全部",value:"''"}}),e._l(e.RoleList,function(e){return a("el-option",{key:e.iRoleID,attrs:{label:e.cRoleName,value:e.iRoleID}})})],2)},D=[],I={props:["selectValue","name","allState"],data:function(){return{RoleList:[],loading:!0,valueId:this.selectValue}},created:function(){this.getRoleList()},watch:{selectValue:function(){this.valueId=this.selectValue}},methods:{selectChange:function(){this.$emit("update:selectValue",this.valueId)},getRoleList:function(){var e=this;this.$store.state.system.roleList.length?(this.RoleList=this.$store.state.system.roleList,this.loading=!1):(this.loading=!0,s["a"].getRoleList().then(function(t){e.loading=!1,e.RoleList=t.data.Data.Result,e.$store.dispatch("system/setState",{name:"roleList",value:t.data.Data.Result})}))}}},y=I,x=Object(p["a"])(y,v,D,!1,null,null,null);x.options.__file="RoleSelect.vue";var C=x.exports,N=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-select",{staticClass:"selectTree",attrs:{value:e.valueTitle}},[a("el-option",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{value:e.valueTitle,label:e.valueTitle}},[a("el-scrollbar",{staticClass:"selectTreeScroll",staticStyle:{height:"260px"}},[a("el-tree",{ref:"selectTree",attrs:{id:"tree-option",accordion:e.accordion,data:e.options,props:e.props,"node-key":e.props.value,"default-expanded-keys":e.defaultExpandedKey},on:{"node-click":e.handleNodeClick}})],1)],1)],1)},L=[],w=(a("c5f6"),a("2ef0")),S=a.n(w),A={name:"el-tree-select",props:{props:{type:Object,default:function(){return{value:"id",label:"label",children:"children"}}},loading:{type:Boolean},options:{type:Array,default:function(){return[]}},name:{type:String},selectValue:{type:Number,default:null},clearable:{type:Boolean,default:function(){return!0}},accordion:{type:Boolean,default:function(){return!0}}},data:function(){return{valueId:this.selectValue,valueTitle:"",defaultExpandedKey:[]}},watch:{selectValue:function(){this.valueId=this.selectValue,this.initHandle()}},mounted:function(){this.initHandle()},methods:{initHandle:function(){if(this.valueId){if(console.log(this.$refs.selectTree,this.$refs.selectTree.getNode(this.valueId)),this.$refs.selectTree.setCurrentKey(this.valueId),this.defaultExpandedKey=[this.valueId],!this.$refs.selectTree.getNode(this.valueId))return;this.valueTitle=this.$refs.selectTree.getNode(this.valueId).data[this.props.label]}else(S.a.isUndefined(this.valueId)||S.a.isNull(this.valueId))&&(this.valueTitle="",this.$refs.selectTree.setCurrentKey(null),this.defaultExpandedKey=[]);this.$nextTick(function(){var e=document.querySelectorAll(".el-scrollbar .el-select-dropdown__wrap")[0],t=document.querySelectorAll(".el-scrollbar .el-scrollbar__bar");e.style.cssText="margin: 0px; max-height: none; overflow: hidden;",t.forEach(function(e){return e.style.width=0})})},handleNodeClick:function(e){var t=[];this.valueTitleParent(e,t),this.valueTitle=t.join("-"),this.valueId=e[this.props.value],this.$emit("getChildChange",this.name,this.valueId),this.defaultExpandedKey=[]},valueTitleParent:function(e,t){e?(t.push(e[this.props.label]),this.valueTitleParent(e.parent,t)):t=S.a.reverse(t)},clearSelected:function(){var e=document.querySelectorAll("#tree-option .el-tree-node");e.forEach(function(e){return e.classList.remove("is-current")})}}},T=A,V=(a("6009"),Object(p["a"])(T,N,L,!1,null,"a4dc4364",null));V.options.__file="SelectTree.vue";var F=V.exports,$=a("f478"),P={components:{modularDialog:$["a"],SelectTree:F,SysTable:c["a"],DeptSelect:b,RoleSelect:C},data:function(){return{departAllList:[],selectValue:"",rules:{cAdminName:[{required:!0,message:"请输入用户名称",trigger:"blur"}],CJobNumber:[{required:!0,message:"请输入工号",trigger:"blur"}],iRoleID:[{required:!0,message:"请选择岗位",trigger:"blur"}],iDeptID:[{required:!0,message:"请选择部门",trigger:"blur"}],cAdminTel:[{required:!0,message:"请输入手机号",trigger:"blur"},{pattern:/^1[34578]\d{9}$/,message:"请输入正确的手机号",trigger:"blur"}],dExpireDate:[{required:!0,message:"请选择过期时间",trigger:"blur"}],cAdminEmail:[{type:"email",message:"请输入正确的邮箱地址",trigger:["blur"]}]},modularList:[],defaultProps:{children:"children",label:"cFunName"},FatherList:[],tableData:[],dataTotal:1,currentRow:null,nodeID:-1,System_Type:1,dialogVisible:!1,dialogtype:0,GetformValue:{num:50,page:1,userName:void 0,roleId:void 0,deptId:void 0},formValue:{cAdminName:void 0,CJobNumber:void 0,iDeptID:void 0,iRoleID:void 0,Level:1,cAdminSex:"男",cAdminTel:void 0,iIsLocked:!1,iIsAllowChangePWD:!0,dExpireDate:void 0,cAdminEmail:void 0},departList:[],selectTreeProps:{value:"iDeptID",label:"cDepName",children:"children"},RoleList:[],modularDialogVisable:!1,dialognodeID:[],loading:!0,sunBtnLoad:!1,modulaBtnVisable:!1}},created:function(){this.getUserList()},methods:{getChildChange:function(e,t){"formValue"!==e?this[e].deptId=t:this[e].iDeptID=t},getUserList:function(){var e=this;this.loading=!0,r["a"].getUserList(this.GetformValue).then(function(t){e.dataTotal=t.data.Data.TotalRows,e.tableData=t.data.Data.Result,e.tableData=e.tableData.filter(function(e){return!e.IsDelete}),e.loading=!1,e.$store.dispatch("system/setState",{name:"userList",value:e.tableData})})},currentChange:function(e){this.currentRow=e},onPageSizeChange:function(e){this.GetformValue.num=e,this.GetformValue.page=1,this.getUserList()},onPageChange:function(e){this.GetformValue.page=e,this.getUserList()},resertUserPassWard:function(){var e=this;this.currentRow?this.$confirm("确定要初始化"+this.currentRow.cAdminName+"的密码么").then(function(){e.sunBtnLoad=!0,r["a"].ResetUser(e.currentRow.iAdminID).then(function(){e.sunBtnLoad=!1,e.$message({type:"success",message:"成功初始化密码",showClose:!0}),e.getUserList()}).catch(function(){e.$message({type:"error",message:"初始化密码失败",showClose:!0})})}).catch(function(){e.$message({type:"warning",message:"取消初始化密码",showClose:!0})}):this.$message({type:"warning",message:"请选择需要初始化密码的人员",showClose:!0})},delUser:function(){var e=this;this.currentRow?this.$confirm("确定删除么").then(function(){e.sunBtnLoad=!0,r["a"].delUser(e.currentRow.iAdminID).then(function(){e.sunBtnLoad=!1,e.$message({type:"success",message:"成功删除数据",showClose:!0}),e.getUserList()}).catch(function(){e.$message({type:"error",message:"删除数据失败",showClose:!0})})}).catch(function(){e.$message({type:"warning",message:"取消删除数据",showClose:!0})}):this.$message({type:"warning",message:"请选择需要删除的数据",showClose:!0})},editUser:function(){this.currentRow?(this.formValue=_.assign({},this.currentRow),this.formValue.iIsLocked=Boolean(this.formValue.iIsLocked),this.formValue.iIsAllowChangePWD=Boolean(this.formValue.iIsAllowChangePWD),this.dialogVisible=!0,this.dialogtype=1):this.$message({type:"warning",message:"请选择需要编辑的数据",showClose:!0})},addUser:function(){this.dialogVisible=!0,this.dialogtype=0,this.formValue={cAdminName:void 0,CJobNumber:void 0,iDeptID:void 0,iRoleID:void 0,Level:1,cAdminSex:"男",cAdminTel:void 0,cAdminEmail:void 0,iIsLocked:!1,iIsAllowChangePWD:!0,dExpireDate:void 0}},handleClose:function(e){e()},editFormSubmit:function(){var e=this;this.$refs.formDialog.validate(function(t){if(!t)return!1;e.sunBtnLoad=!0,e.dialogtype?r["a"].editUser(e.formValue).then(function(t){e.sunBtnLoad=!1,e.dialogVisible=!1,e.$message({type:"success",message:"修改用户成功",showClose:!0}),e.getUserList()}).catch(function(t){e.sunBtnLoad=!1}):r["a"].addUser(e.formValue).then(function(t){e.sunBtnLoad=!1,e.dialogVisible=!1,e.$message({type:"success",message:"新增用户成功",showClose:!0}),e.getUserList()}).catch(function(t){e.sunBtnLoad=!1})})},modularDialogOpen:function(e){var t=this;o["a"].getUserAuthority(e.iAdminID).then(function(e){var a=e.data.Data.Result;t.dialognodeID=_.map(a,"iFunID")}),this.modularDialogVisable=!0,this.modulaBtnVisable=!1},modularDialogSubmit:function(e){var t=this;if(!e.length)return this.$message({type:"error",message:"权限不能为空",showClose:!0}),void(this.modulaBtnVisable=!1);var a={iPurviewID:this.currentRow.iAdminID,iPurviewType:1,functionIds:e};u["a"].editAuthority(a).then(function(e){t.modulaBtnVisable=!1,t.modularDialogVisable=!1,t.$message({type:"success",message:"修改权限成功",showClose:!0}),t.getUserList()}).catch(function(){t.modulaBtnVisable=!1})}}},k=P,R=Object(p["a"])(k,i,l,!1,null,null,null);R.options.__file="UserManage.vue";var U=R.exports;t["default"]=U},f478:function(e,t,a){"use strict";var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{staticClass:"myDialog modularDialog",attrs:{title:"模块选择",visible:e.modularDialogVisable,width:"300","before-close":e.handleClose,customClass:"el_add_dialog"},on:{"update:visible":function(t){e.modularDialogVisable=t}}},[a("el-scrollbar",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{height:"400px"}},[a("el-tree",{ref:"tree",attrs:{"highlight-current":"",data:e.modularList,props:e.defaultProps,"default-expanded-keys":[-1],"default-checked-keys":e.treeNeedNodeID,"node-key":"iFunID","show-checkbox":""}})],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{staticClass:"my-dialog-cancel",attrs:{loading:e.modulaBtnVisable},on:{click:e.modularFormSubmit}},[e._v("修 改")]),a("el-button",{staticClass:"my-dialog-submit",on:{click:e.modularFormClose}},[e._v("关 闭")])],1)],1)},l=[],n=(a("28a5"),a("c5f6"),a("ac6a"),a("99db")),r={props:["modularDialogVisable","nodeID","modulaBtnVisable"],data:function(){return{loading:!0,modularList:[],defaultProps:{children:"children",label:"cFunName"},FatherList:[],treeList:[],treeNeedNodeID:[],System_Type:1,typeList:{0:"手机app",1:"B/S 显示",4:"C/S 显示"},typeListArr:[{name:"手机app",value:0},{name:"B/S 显示",value:1},{name:"C/S 显示",value:4}],CheckedAllNodes:[]}},watch:{nodeID:function(){for(var e=_.cloneDeep(this.nodeID),t=0;t<e.length;t++)if(this.treeList[e[t]]){var a=this.treeList[e[t]].length;if(a){for(var i=0;i<e.length;i++)_.indexOf(this.treeList[e[t]],e[i])>-1&&a--;a&&(e.splice(t,1),t--)}}this.treeNeedNodeID=e,this.$refs.tree&&this.$refs.tree.setCheckedNodes(this.nodeID)}},created:function(){this.getModularList()},methods:{getModularList:function(){var e=this;this.$store.state.system.modular.length?(this.modularList=this.$store.state.system.modular,this.loading=!1):(this.loading=!0,n["a"].getModular().then(function(t){e.FatherList={},e.treeList={};var a=t.data.Data.Result;_.forEach(a,function(t){e.FatherList[t.System_Type]||(e.FatherList[t.System_Type]={iFunID:"0#"+t.System_Type},e.FatherList[t.System_Type].cFunName=e.typeList[t.System_Type],e.FatherList[t.System_Type],e.FatherList[t.System_Type].System_Type=t.System_Type),e.FatherList[t.System_Type][t.iFunFatherID]?e.FatherList[t.System_Type][t.iFunFatherID].push(t):e.FatherList[t.System_Type][t.iFunFatherID]=[t],e.treeList[t.iFunFatherID]?e.treeList[t.iFunFatherID].push(t):e.treeList[t.iFunFatherID]=[t]});var i=_.cloneDeep(e.FatherList);e.modularList=[{iFunID:-1,cFunName:"智慧水务管理系统",children:[]}],_.forEach(i,function(t,a){e.ModularSerialize([t],t.System_Type),e.modularList[0].children.push(t)}),e.$store.dispatch("system/setState",{name:"modular",value:e.modularList}),e.loading=!1}))},ModularSerialize:function(e,t){var a=this;_.map(e,function(e){var i=_.isString(e.iFunID)?Number(e.iFunID.split("#")[0]):e.iFunID;if(a.FatherList[t][i]){e.children=a.FatherList[t][i];var l={};l.iFunID=i,e.parent&&(l.parent=e.parent),_.forEach(e.children,function(e){e.parent=l}),a.ModularSerialize(a.FatherList[t][i],t)}})},handleClose:function(e){this.$emit("update:modularDialogVisable",!1),e()},modularFormClose:function(){this.$emit("update:modularDialogVisable",!1)},nodeparent:function(e){e.parent&&(this.CheckedAllNodes.push(e.iFunID),this.nodeparent(e.parent))},modularFormSubmit:function(){var e=this;this.$emit("update:modulaBtnVisable",!0);var t=this.$refs.tree.getCheckedNodes();this.CheckedAllNodes=[],_.forEach(t,function(t){e.CheckedAllNodes.push(t.iFunID),e.nodeparent(t)}),this.CheckedAllNodes=_.union(this.CheckedAllNodes),this.CheckedAllNodes=_.filter(this.CheckedAllNodes,function(e){return!_.isString(e)}),this.$emit("modularDialogSubmit",this.CheckedAllNodes)}}},s=r,o=a("2877"),u=Object(o["a"])(s,i,l,!1,null,null,null);u.options.__file="modularDialog.vue";t["a"]=u.exports},fbc2:function(e,t,a){"use strict";a("c5f6");var i=a("0f1a");t["a"]={editAuthority:function(e){return Object(i["a"])({method:"post",url:"/FunPurview/RefreshFunPurview",params:{iPurviewType:Number(e.iPurviewType),iPurviewID:Number(e.iPurviewID)},data:e.functionIds})}}}}]);
//# sourceMappingURL=chunk-7e6afc14.bf8b9e40.js.map