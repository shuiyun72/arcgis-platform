(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-581ad33b"],{"1d1f":function(e,t,a){"use strict";var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-row",{staticClass:"page-title",attrs:{type:"flex",justify:"space-between"}},[a("span",{staticClass:"text"},[e._v(e._s(e.titleName))]),a("span",{staticClass:"icon",on:{click:e.flexibleFnc}},[a("span",{directives:[{name:"show",rawName:"v-show",value:e.flexible,expression:"flexible"}]},[e._v("展开 ")]),a("i",{staticClass:"iconfont icon-shousuo"})])])},i=[],l=(a("2ef0"),a("5118"),{props:["flexible","titleName"],data:function(){return{}},methods:{flexibleFnc:function(){var e=!this.flexible;this.$emit("update:flexible",e),this.$bus.emit("flexibleControl",e)}}}),s=l,o=a("2877"),r=Object(o["a"])(s,n,i,!1,null,null,null);r.options.__file="TableFormTitle.vue";t["a"]=r.exports},"29b6":function(e,t,a){"use strict";var n=a("eeb4"),i=a.n(n);i.a},"32d9":function(e,t,a){"use strict";a("6b54");var n=a("795b"),i=a.n(n),l=a("7618"),s=a("bc3a"),o=a.n(s),r=a("39c6"),c=(a("5c96"),a("4360")),u=r["a"].apiPath.gisURL,f=o.a.create({baseURL:u+"/api",timeout:3e4,crossDomain:!0,responseType:"json",transformResponse:function(e){return"object"===Object(l["a"])(e)?e:JSON.parse(e)}});f.interceptors.request.use(function(e){var t=localStorage.getItem("iAdminID");return c["a"].state.login.userToken?e.headers.Token=c["a"].state.login.userToken:t&&(e.headers.Token=JSON.parse(t).Token),e},function(e){return i.a.reject(e)});var p=f;t["a"]={SquibAnalysis:function(e){return p.get("/SpatialSearch/GetRealatedValveAndPipeByPipeId",{params:{pipeId:e.toString()}})},SquibAnalysisByType:function(e,t){return p.get("/SpatialSearch/GetRealatedValveAndPipeByPipeIdandType",{params:{pipeId:e.toString(),type:t.toString()}})},GetPOI:function(e){return p.get("/SpatialSearch/GetPOI",{params:{name:e}})},getTransectionAnalysis:function(e){return p.post("/SpatialSearch/GetCurveHeng",e)}}},5118:function(e,t,a){(function(e){var n="undefined"!==typeof e&&e||"undefined"!==typeof self&&self||window,i=Function.prototype.apply;function l(e,t){this._id=e,this._clearFn=t}t.setTimeout=function(){return new l(i.call(setTimeout,n,arguments),clearTimeout)},t.setInterval=function(){return new l(i.call(setInterval,n,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(e){e&&e.close()},l.prototype.unref=l.prototype.ref=function(){},l.prototype.close=function(){this._clearFn.call(n,this._id)},t.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},t.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},t._unrefActive=t.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout(function(){e._onTimeout&&e._onTimeout()},t))},a("6017"),t.setImmediate="undefined"!==typeof self&&self.setImmediate||"undefined"!==typeof e&&e.setImmediate||this&&this.setImmediate,t.clearImmediate="undefined"!==typeof self&&self.clearImmediate||"undefined"!==typeof e&&e.clearImmediate||this&&this.clearImmediate}).call(this,a("c8ba"))},"5d58":function(e,t,a){e.exports=a("d8d6")},6017:function(e,t,a){(function(e,t){(function(e,a){"use strict";if(!e.setImmediate){var n,i=1,l={},s=!1,o=e.document,r=Object.getPrototypeOf&&Object.getPrototypeOf(e);r=r&&r.setTimeout?r:e,"[object process]"==={}.toString.call(e.process)?h():m()?y():e.MessageChannel?d():o&&"onreadystatechange"in o.createElement("script")?b():g(),r.setImmediate=c,r.clearImmediate=u}function c(e){"function"!==typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),a=0;a<t.length;a++)t[a]=arguments[a+1];var s={callback:e,args:t};return l[i]=s,n(i),i++}function u(e){delete l[e]}function f(e){var t=e.callback,n=e.args;switch(n.length){case 0:t();break;case 1:t(n[0]);break;case 2:t(n[0],n[1]);break;case 3:t(n[0],n[1],n[2]);break;default:t.apply(a,n);break}}function p(e){if(s)setTimeout(p,0,e);else{var t=l[e];if(t){s=!0;try{f(t)}finally{u(e),s=!1}}}}function h(){n=function(e){t.nextTick(function(){p(e)})}}function m(){if(e.postMessage&&!e.importScripts){var t=!0,a=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage("","*"),e.onmessage=a,t}}function y(){var t="setImmediate$"+Math.random()+"$",a=function(a){a.source===e&&"string"===typeof a.data&&0===a.data.indexOf(t)&&p(+a.data.slice(t.length))};e.addEventListener?e.addEventListener("message",a,!1):e.attachEvent("onmessage",a),n=function(a){e.postMessage(t+a,"*")}}function d(){var e=new MessageChannel;e.port1.onmessage=function(e){var t=e.data;p(t)},n=function(t){e.port2.postMessage(t)}}function b(){var e=o.documentElement;n=function(t){var a=o.createElement("script");a.onreadystatechange=function(){p(t),a.onreadystatechange=null,e.removeChild(a),a=null},e.appendChild(a)}}function g(){n=function(e){setTimeout(p,0,e)}}})("undefined"===typeof self?"undefined"===typeof e?this:e:self)}).call(this,a("c8ba"),a("4362"))},"67bb":function(e,t,a){e.exports=a("f921")},7618:function(e,t,a){"use strict";a.d(t,"a",function(){return r});var n=a("5d58"),i=a.n(n),l=a("67bb"),s=a.n(l);function o(e){return o="function"===typeof s.a&&"symbol"===typeof i.a?function(e){return typeof e}:function(e){return e&&"function"===typeof s.a&&e.constructor===s.a&&e!==s.a.prototype?"symbol":typeof e},o(e)}function r(e){return r="function"===typeof s.a&&"symbol"===o(i.a)?function(e){return o(e)}:function(e){return e&&"function"===typeof s.a&&e.constructor===s.a&&e!==s.a.prototype?"symbol":o(e)},r(e)}},"90de":function(e,t,a){"use strict";var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-button",{staticClass:"anilaysisCascaderWraper my-choose-point",attrs:{size:"mini"},on:{click:e.btnClick}},[e._v("\n  "+e._s(e.btnMessage.text)+"\n  "),this.layerData.length>1?a("el-cascader",{staticClass:"anilaysisCascader",attrs:{size:"mini",options:e.layerData,"show-all-levels":!1},on:{change:e.changeSelect},model:{value:e.selectLayerValue,callback:function(t){e.selectLayerValue=t},expression:"selectLayerValue"}}):e._e(),1==this.layerData.length&&1!=this.layerData[0].children.length?a("el-select",{staticClass:"anilaysisCascader",attrs:{size:"mini"},on:{change:e.layerChange},model:{value:e.layerDataValue,callback:function(t){e.layerDataValue=t},expression:"layerDataValue"}},e._l(e.layerData[0].children,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.id}})}),1):e._e()],1)},i=[],l=a("2ef0"),s=a.n(l),o={props:["layerData","selectLayerValue","btnMessage","listViewColumn"],data:function(){return{layerDataValue:"",topTotleMessage:[]}},methods:{btnClick:function(){1==this.layerData.length&&1==this.layerData[0].children.length&&this.$emit("searchFnc")},layerChange:function(e){var t=s.a.filter(this.layerData[0].children,function(t){return t.id===e})[0].listViewColumn;this.selectLayerValue[1]=e,this.listViewColumn&&this.$emit("update:listViewColumn",t),this.$emit("update:selectLayerValue",this.selectLayerValue),this.$emit("searchFnc")},changeSelect:function(e){this.$emit("update:selectLayerValue",e),this.$emit("searchFnc")}}},r=o,c=(a("29b6"),a("2877")),u=Object(c["a"])(r,n,i,!1,null,"56fdffac",null);u.options.__file="AnalysisSelect.vue";t["a"]=u.exports},c912:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"formItem table_style",class:{flexible:e.flexible}},[a("TableFormTitle",{attrs:{titleName:"关阀分析",flexible:e.flexible},on:{"update:flexible":function(t){e.flexible=t}}}),a("el-form",[a("el-row",{staticClass:"tab-btn-wraper"},[e.$options.filters.btnTree("choose",e.$route.meta.iFunID)?a("AnalysisSelect",{attrs:{btnMessage:{text:"选择爆管点"},layerData:e.layerData,selectLayerValue:e.selectLayerValue,listViewColumn:e.listViewColumn},on:{"update:selectLayerValue":function(t){e.selectLayerValue=t},"update:listViewColumn":function(t){e.listViewColumn=t},searchFnc:e.sqluibAnalysis}}):e._e(),e._l(e.btnList,function(t){return[e.$options.filters.btnTree(t.model,e.$route.meta.iFunID)?a("el-button",{key:t.text,class:t.class,attrs:{size:"mini"},on:{click:function(a){e.btnChange(t.text)}}},[e._v(e._s(t.text))]):e._e()]})],2)],1),a("el-row",{staticClass:"tab-wraper"},[a("el-tabs",{attrs:{type:"card"},on:{"tab-click":e.handleClick},model:{value:e.tabActiveName,callback:function(t){e.tabActiveName=t},expression:"tabActiveName"}},[a("el-tab-pane",{attrs:{label:"阀门结果",name:"first"}},[a("GisTable",{staticClass:"first",attrs:{loading:e.loading,tableHeight:"calc(100vh - 299px)",layerListName:"E_Valve_Columns",doubleAnalysisState:!0,columnListData:e.ValveDataTotal},on:{TableRowClick:e.onValveRowClick,doubleAnalysis:e.doubleAnalysis,currentChange:e.handleCurrentChange}})],1),a("el-tab-pane",{attrs:{label:"阀门井结果",name:"second"}},[a("GisTable",{staticClass:"second",attrs:{loading:e.loading,tableHeight:"calc(100vh - 299px)",layerListName:"E_Pipe_Columns",doubleAnalysisState:!0,columnListData:e.ValveWellDataTotal},on:{doubleAnalysis:e.doubleAnalysis,TableRowClick:e.onValveWellRowClick,currentChange:e.handleCurrentChange}})],1),a("el-tab-pane",{attrs:{label:"影响管线",name:"third"}},[a("GisTable",{staticClass:"third",attrs:{loading:e.loading,tableHeight:"calc(100vh - 299px)",doubleAnalysisState:!1,layerListName:e.listViewColumn,columnListData:e.PipeDataTotal},on:{TableRowClick:e.onPipeRowClick}})],1)],1)],1)],1)},i=[],l=a("75fc"),s=(a("ac6a"),a("2ef0")),o=a.n(s),r=(a("2c12"),a("af9c")),c=a("32d9"),u=(a("3e8f"),a("1b9e")),f=a("7a10"),p=a("8ed9"),h=a("90de"),m=a("1d1f"),y={components:{GisTable:p["a"],AnalysisSelect:h["a"],TableFormTitle:m["a"]},created:function(){this.loadData()},mounted:function(){this._MapDataOperation=new r["a"],this._MapDataOperation.init()},beforeDestroy:function(){this.$bus.emit("clearGDataLayer"),this.$bus.emit("clearGraphics")},data:function(){return{listViewColumn:"",equipmentPointNum:0,flexible:!1,currentRow:null,PID:[],selectLayerValue:[],layerData:[],loading:!1,PipeDataTotal:[],ValveDataTotal:[],ValveWellDataTotal:[],btnList:[{text:"设备二次关阀分析",class:"my-analysis",model:"/api/SpatialSearch/GetRealatedValveAndPipeByPipeId"},{text:"导出",class:"my-export",model:"export"},{text:"清除",class:"my-clean",model:"clear"}],tabActiveName:"first"}},methods:{handleCurrentChange:function(e){this.currentRow=e},loadData:function(){this.layerData=f["c"].getLayer(f["e"].PipeTypeNO),this.selectLayerValue.push(this.layerData[0].id),this.selectLayerValue.push(this.layerData[0].children[0].id),this.listViewColumn=this.layerData[0].children[0].listViewColumn},btnChange:function(e){switch(e){case"设备二次关阀分析":this.equipmentdoubleAnalysis();break;case"表格二次关阀分析":this.doubleAnalysis();break;case"清除":this.clearResult();break;case"导出":this.exportExcel();break}},equipmentdoubleAnalysis:function(){var e=this;this.PipeDataTotal.length||this.ValveDataTotal.length||this.ValveWellDataTotal.length?this.$bus.emit("pointSelect",{featureQueryCompleted:function(t){var a=t.geometry;e.$bus.emit("featureQueryTask",a,function(t){var n,i=[];(o.a.forEach(t,function(e){(e.layerData.length||e.layerData==f["e"].ValveTypeNO||e.layerData==f["e"].ValvewellTypeNO)&&i.push.apply(i,Object(l["a"])(e.layerData))}),0==i.length)?e.$message({type:"warning",message:"请选择高亮设备进行分析",showclose:!0}):(e.equipmentPointNum=0,o.a.forEach(i,function(t){n=o.a.filter(e.ValveDataTotal,function(e){return t.attributes.OBJECTID==e.OBJECTID}).length,n||(n=o.a.filter(e.ValveWellDataTotal,function(e){return t.attributes.OBJECTID==e.OBJECTID}).length),n&&(e.equipmentPointNum=n)}),e.equipmentPointNum?(e.AnalysisFnc(a),e.$bus.emit("addMapPoint",a)):e.$message({type:"warning",message:"请选择高亮设备进行分析",showclose:!0}))},1)}}):this.$message({type:"warning",message:"请先进行爆管分析",showclose:!0})},doubleAnalysis:function(e){var t=this._MapDataOperation.createPoint(e.coordinate_x,e.coordinate_y);this.AnalysisFnc(t),this.$bus.emit("addMapPoint",t)},AnalysisFnc:function(e){var t=this;this.$bus.emit("bufferAnalysis",this.selectLayerValue[1],e,1,function(e){o.a.forEach(e,function(e){t.PID.push(e.attributes.PID)}),console.log(t.PID.join(",")),t.SquibSearchFnc()})},exportExcel:function(){Object(u["a"])(".".concat(this.tabActiveName," .exportTable"),"关阀分析")},onValveWellRowClick:function(e,t,a){this.$bus.emit("setMapLocation",e.OBJECTID,f["c"].getGroupLayerByType(this.selectLayerValue[0],f["e"].ValvewellTypeNO),function(e){console.log(e)})},onValveRowClick:function(e,t,a){var n=f["c"].getGroupLayerByType(this.selectLayerValue[0],f["e"].ValveTypeNO);console.log(n,e.OBJECTID),this.$bus.emit("setMapLocation",e.OBJECTID,n,function(e){console.log(e)})},onPipeRowClick:function(e,t,a){this.$bus.emit("setMapLocation",e.OBJECTID,f["c"].getGroupLayerByType(this.selectLayerValue[0],f["e"].PipeTypeNO),function(e){console.log(e)})},sqluibAnalysis:function(){var e=this;this.clearResult(),this.$bus.emit("selectSquib",this.selectLayerValue[1],function(t){t.length>0?(e.PID.push(t[0].PID),e.SquibSearchFnc()):e.$message({type:"warning",message:"此处没有爆管数据",showClose:!0})})},SquibSearchFnc:function(){var e=this;this.loading=!0;var t="",a=this.selectLayerValue[1];console.log("length",this.selectLayerValue[0]);var n="SquibAnalysis";if(this.layerData.length>1){var i=o.a.filter(f["g"].FeatureLayerGroup,function(t){return t.groupName===e.selectLayerValue[0]});i.length>0&&(t=i[0].sTypeL),n="SquibAnalysisByType"}console.log("PID",a,this.PID.join(",")),c["a"][n](this.PID.join(","),t).then(function(t){if(console.log(t),t.data.Flag){var a,n=t.data.Data.Result.pipesInfo||[],i=t.data.Data.Result.valvesInfo||[],s=t.data.Data.Result.vavleWellInfo||[];n=o.a.sortBy(n,"OBJECTID"),i=o.a.sortBy(i,"OBJECTID"),s=o.a.sortBy(s,"OBJECTID"),e.PipeDataTotal=o.a.uniqBy(n,"OBJECTID"),e.ValveDataTotal=o.a.uniqBy(i,"OBJECTID"),e.ValveWellDataTotal=o.a.uniqBy(s,"OBJECTID"),e.loading=!1,e.$bus.emit("getSpaceData",e.PipeDataTotal,e.selectLayerValue[1],function(t){e.$bus.emit("pipeLineView",t)});var r=o.a.map(e.ValveDataTotal,function(e){var t=[];return t[0]=e.Shape._geometry.m_points[0].x,t[1]=e.Shape._geometry.m_points[0].y,t}),c=o.a.map(e.ValveWellDataTotal,function(e){var t=[];return t[0]=e.Shape._geometry.m_points[0].x,t[1]=e.Shape._geometry.m_points[0].y,t});(a=r).push.apply(a,Object(l["a"])(c));o.a.cloneDeep(r);var u=r.length;r=o.a.orderBy(r,function(e){return e[0]});var f=(r[0][0]+r[u-1][0])/2;r=o.a.orderBy(r,function(e){return e[1]});var p,h,m,y=(r[0][1]+r[u-1][1])/2;o.a.forEach(r,function(e,t){h=e[0]-f,p=e[1]-y,m=Math.sqrt(h*h+p*p),r[t].sinAtan=p/m,r[t].cosAtan=h}),r=o.a.orderBy(r,function(e){return e.sinAtan});var d=o.a.filter(r,function(e){return e.cosAtan>=0}),b=o.a.filter(r,function(e){return e.cosAtan<0});b=o.a.orderBy(b,function(e){return-e.sinAtan}),r=o.a.concat(b,d),r=o.a.map(r,function(e){var t=[];return t[0]=e[0],t[1]=e[1],t});var g=[];g.push(r),e.$bus.emit("drawPolygon",g),e.$bus.emit("facilitiesView",e.ValveDataTotal,"阀门.png"),e.$bus.emit("facilitiesView",e.ValveWellDataTotal,"阀门.png")}else console.log("爆管错误：",t.data.ExceptionMsg)})},clearResult:function(){this.PID=[],console.log(this.PID),this.currentRow=null,this.PipeDataTotal=[],this.ValveDataTotal=[],this.ValveWellDataTotal=[],this.$bus.emit("clearGDataLayer"),this.$bus.emit("clearGraphics")}}},d=y,b=a("2877"),g=Object(b["a"])(d,n,i,!1,null,null,null);g.options.__file="GuanFa.vue";var v=g.exports;t["default"]=v},eeb4:function(e,t,a){}}]);
//# sourceMappingURL=chunk-581ad33b.3f3e06b3.js.map