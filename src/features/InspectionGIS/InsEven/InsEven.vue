<template>
  <div class="table_style" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'事件管理'" :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="83px" label-position="right" size="mini" gutter="20px">
      <date-btn-choose @DateBtn="dateBtn" :dataSpan="9" :dataLeft="'10px'"></date-btn-choose>
      <el-row>
        <el-col :span="7" :xs="11" :sm="11" :lg="7">
          <el-form-item label="事件类型：">
            <el-select v-model="typeListValue" placeholder="编号">
              <el-option
                v-for="item in typeList"
                :key="item.EventTypeId"
                :label="item.EventTypeName"
                :value="item.EventTypeId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7" :xs="11" :sm="11" :lg="7">
          <el-form-item label="事件状态：">
            <el-select v-model="StateListValue">
              <el-option
                v-for="item in StateList"
                :key="item.OperId"
                :label="item.OperName2"
                :value="item.OperId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7" :xs="11" :sm="11" :lg="7">
          <el-form-item label="事件查找："  @keyup.enter.native="GetData">
            <el-input v-model="detailValue" placeholder="上报人、编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-button
          class="my-search"
          size="mini"
          @click="GetData"
          v-if="$options.filters.btnTree('/api/EventManage/Get' ,$route.name)"
        >查询</el-button>
        <el-button
          class="my-export"
          @click="exportExcel"
          size="mini"
          v-if="$options.filters.btnTree('export' ,$route.name)"
        >导出</el-button>
      </el-row>
    </el-form>
    <InsTable
      :layerListName="'Ins_EvenOverview_Columns'"
      :tableHeight="'calc(100vh - 243px)'"
      :columnListData="squareQueryRawTableData"
      :loading.sync="loading"
      :pageSize.sync="currentPageSize"
      :pageNumber.sync="currentPageNumber"
      :dataTotal="squareQueryTotal"
      :layeName="'InsEven'"
      @GetData="GetData"
      @deltableItem="deltableItem"
      @detailBtn="detailBtn"
      @tableDbClick="tableDbClick"
    ></InsTable>
    <el-dialog
      class="myDialog"
      :visible.sync="detailDialogVisible"
      :before-close="handleClose"
      width="50%"
      custom-class="order_detail_dialog eventMapDetal"
      title="事件工单详情"
      center
    >
      <el-scrollbar class="dialog-scroll">
        <div id="dialogPrint" class="dialogPrint">
          <table border="1" class="dialog-table" style="border-collapse: collapse;">
            <tr v-for="(item,index) in detailDialogTwo" :key="index" class="wrapperCol">
              <td class="dialog-table-lable">{{item[0]}}</td>
              <td>{{item[1]}}</td>
              <td class="dialog-table-lable">{{item[2]}}</td>
              <td>{{item[3]}}</td>
            </tr>
            <tr
              v-for="(item,index) in detailDialogOne"
              :key="index"
              class="wrapperCol"
              :class="{'dialog_img-wrapper': isarray(item) && item.length}"
            >
                     
              <td class="dialog-table-lable">{{item.name}}</td>
              <td colspan="3" class="dialog_img dialog_img_small" v-if="isarray(item.val)">
                <a :href="imgUrl+image" target="_blank" v-for="(image,index) in item.val" :key="index">
                  <img :src="imgUrl+image" alt style="height:60px;vertical-align: middle;padding: 6px 2px;"/>
                </a>
              </td>
              <td colspan="3" v-else>{{item.val}}</td>
            </tr>
          </table>
          <p v-show="mapHide" style="line-height:40px;">没有点数据，暂不展示地图</p>
          <div v-show="!mapHide" id="dialogDetailMap" class="dialogDetailMap"></div>
        </div>
        <el-row class="dialogPrintBtn" type="flex" justify="end">
          <el-button size="mini" @click="print" class="my-print">打印</el-button>
        </el-row>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>
<script>
import _ from "lodash";
import config from "@config/config.js";
import printJS from "print-js";
import BaseMap from "@services/OpenLayers/BaseMap";
import MapNavigate from "@services/OpenLayers/MapNavigate";
import * as EasyTable from "@common/consts/inseasyui-table";
import { ExportExcel, FixFloat } from "@util";
import EvenType from "@api/Inspection/EvenType";
import EventManage from "@api/Inspection/EventManage";
import DateBtnChoose from "@features/InspectionGIS/components/DateBtnChoose";
import TableFormTitle from "@common/components/TableFormTitle";
import InsTable from "@features/InspectionGIS/components/InsTable";
import utilData from "@util/utilData";

export default {
  components: {
    DateBtnChoose,
    TableFormTitle,
    InsTable
  },
  data() {
    return {
      imgUrl:config.apiPath.insURL,
      flexible: false, //是否收缩左侧表格
      loading: true,
      // 分页相关
      currentPageNumber: 1,
      currentPageSize: 50,
      columnList: EasyTable.Ins_EvenOverview_Columns, //同步当前图层的表头信息
      squareQueryRawTableData: [], //搜索结果数据
      squareQueryTotal: [], //表格数据总数
      typeList: [], //事件类型列表
      typeListValue: "", //事件类型值
      StateList: [], //事件状态列表
      StateListValue: "", //事件状态列表
      detailValue: "", //事件查找
      startTime: "", //开始时间
      endTime: "", //结束时间
      detailDialogVisible: false, //弹框控制
      detailDialogTwo: null, //一列数据
      detailDialogOne: null, //两列数据
      MapMethods: null, //地图
      mapHide: false //根据是否有点决定是否展示地图
    };
  },
  computed: {},

  created() {
    //初始化数据
    this.loadLayerData();
   
  },
  mounted(){
    let queryDate = this.$route.query.date;
    if(queryDate && queryDate == 4){
      let data = utilData.getMonth();
      this.startTime = data.begin;
      this.endTime = data.over;
    }
    this.GetData();
    this.$bus.emit("setBusinessLayerGroupVisible", true);
  },
  beforeDestroy() {
    this.$bus.emit("removeInteractions");
    this.$bus.emit("CloseModifyInteraction");
    this.$bus.emit("OffPointermoveControl");
    this.$bus.emit("setBusinessLayerGroupVisible", false);
    //this.$bus.emit("setBusinessLayerGroupVisible", false); //开启业务图层
  },
  methods: {
    //打印
    print() {
      printJS({
        printable: "dialogPrint",
        type: "html",
        header: '<h3 class="custom-h3">智慧水务控管一体化平台</h3>',
        CSS: ""
      });
    },
    isarray(val) {
      return _.isArray(val);
    },
    //初始化相关数据
    loadLayerData() {
      this.getType();
      this.getState();
    },
    //获取事件类型select列表
    getType() {
      EvenType.EventContentLoad().then(res => {
        this.typeList = _.cloneDeep(res.data.Data.Result);
        this.typeList.unshift({
          EventTypeId: "",
          EventTypeName: "全部"
        });
      });
      //默认上报类型值为全部
      this.typeListValue = "";
    },
    //获取事件状态select列表
    getState() {
      EvenType.EventStateLoad().then(res => {
        this.StateList = _.cloneDeep(res.data.Data.Result);
        this.StateList.unshift({
          OperId: "",
          OperName2: "全部"
        });
      });

      //默认上报类型值为全部
      this.StateListValue = "";
    },
    // 查询操作
    GetData(pageNumber, pageSize) {
      this.loading = true;
      if (typeof pageNumber == "number") {
        //如果传值更新父页面的表格页码为1，切换数据调用data时使用，
        //因为getdata初始查询页码为1
        this.currentPageNumber = pageNumber;
      }
      if (typeof pageSize == "number") {
        this.currentPageSize = pageSize;
      }
      let _numValue = this.currentPageSize;
      let _pageValue = this.currentPageNumber;
      let _startTime = this.startTime;
      let _endTime = this.endTime;
      let _eventType = this.typeListValue;
      let _eventStatus = this.StateListValue;
      let _searchCondition = this.detailValue;
      EventManage.EventManageAll(
        _numValue,
        _pageValue,
        _startTime,
        _endTime,
        _eventType,
        _eventStatus,
        _searchCondition
      ).then(res => {
        this.loading = false;
        this.squareQueryRawTableData = res.data.Data.Result;
        this.squareQueryTotal = res.data.Data.TotalRows;
        this.drawPoint(res.data.Data.Result);
      });
    },
    //双击
    tableDbClick(row) {
      console.log(row);
      this.drawPoint(row);
    },
    drawPoint(data) {
      //点坐标的集合
      let pointArrayData = [];
      let objArray = [];
      if (_.isArray(data)) {
        _.map(data, res => {
          if (res.EventX && res.EventY) {
            pointArrayData.push([Number(res.EventX), Number(res.EventY)]);
            let EventPictures = [];
            if (res.EventPictures) {
              EventPictures = res.EventPictures.split("|");
              EventPictures = _.map(EventPictures, item => {
                return config.apiPath.insURL + item;
              });
            }
            objArray.push({
              EventCode: res.EventCode,
              DeptName: res.DeptName,
              PName: res.PName,
              ET1: res.ET1,
              EventFromName: res.EventFromName,
              HandlerLevelName: res.HandlerLevelName,
              eventAddress: res.eventAddress,
              eventDesc: res.eventDesc || "数据最后上传时间" + res.UpTime,
              EventPictures: EventPictures
            });
          }
        });
      } else if (data.EventX && data.EventY) {
        pointArrayData.push([Number(data.EventX), Number(data.EventY)]);
        let EventPictures = [];
        if (data.EventPictures) {
          EventPictures = data.EventPictures.split("|");
          EventPictures = _.map(EventPictures, item => {
            return config.apiPath.insURL + item;
          });
        }
        objArray.push({
          EventCode: data.EventCode,
          DeptName: data.DeptName,
          PName: data.PName,
          ET1: data.ET1,
          EventFromName: data.EventFromName,
          HandlerLevelName: data.HandlerLevelName,
          eventAddress: data.eventAddress,
          eventDesc: data.eventDesc || "数据最后上传时间" + data.UpTime,
          EventPictures: EventPictures
        });
        this.$bus.emit("setCenter", ...pointArrayData);
      }else{
        this.$message({
          type:'error',
          message:'此事件未上传点位',
          showClose:false,
        })
      }

      //开启地图hover点
      this.$bus.emit("onPointermoveControl");
      //绘点
      this.$bus.emit(
        "setPointOnMap",
        pointArrayData,
        false,
        () => {},
        "EventPoint",
        objArray
      );
    },
    //详情
    detailBtn(row) {
      console.log(row, row.EventX, row.EventY);
      let point = [];
      this.detailDialogVisible = true;
      this.detailDialogTwo = [
        ["事件编号", row.EventCode, "上报人", row.LinkMan],
        ["上报时间", row.UpTime, "所属部门", row.DeptName],
        ["事件内容", row.ET2, "事件类型", row.ET1],
        ["紧急程度", row.UrgencyName, "事件来源", row.EventFromName],
        ["处理级别", row.UrgencyName, "派单员", row.PName]
      ];
      let EventPictures = row.EventPictures.split("|");
      EventPictures = _.map(EventPictures, item => {
        return config.apiPath.insURL + item;
      });
      // this.detailDialogOne = [
      //   "事件地址",row.EventAddress,
      //   "现场照片",row.EventPictures,
      //   // 缩略图预览: [],
      //   "事件描述",row.EventDesc
      // ];
      let EventPicturesArray = _.without(row.EventPictures.split("|"),"");
      console.log(EventPicturesArray);
      this.detailDialogOne = [{
          "name":"事件地址",
          "val":row.EventAddress
        },{
           "name":"现场照片",
          "val":EventPicturesArray
        },{
           "name":"事件描述",
          "val":row.EventDesc
        }    
      ];
      if (row.EventX && row.EventY) {
        point = [Number(row.EventX), Number(row.EventY)];
        this.mapHide = false;
      } else {
        point = [];
        this.mapHide = true;
        return;
      }
      //声明地图对象
      this.$nextTick(() => {
        if (!this.MapMethods) {
          let _mapController = new BaseMap();
          _mapController.createMap("dialogDetailMap").then(ResultObject => {
            this.MapMethods = new MapNavigate(ResultObject);
            this.MapMethods.setPointOnMap(
              [point],
              false,
              () => {},
              "RoutePoint",
              "desript"
            );
            this.MapMethods.setCenter(point);
            // this.MapMethods.pointermoveControl(
            //   document.getElementById("popup"),
            //   (res, title) => {
            //     console.log(this.dialogType)
            //     this.dialogShow = 'mapLayer'
            //     // document.getElementById('popup').inner
            //     this.htmlString = res;
            //     this.layerTtitle = title;
            //   }
            // );
          });
        } else {
          this.MapMethods.setPointOnMap(
            [point],
            false,
            () => {},
            "RoutePoint",
            "desript"
          );
          this.MapMethods.setCenter(point);
        }
      });
    },
    handleClose() {
      this.detailDialogVisible = false;
    },
    // 分页相关
    onPageChange(objvalue) {
      this.currentPageNumber = objvalue;
      this.GetData();
    },
    //当前页数据变化
    onPageSizeChange(objvalue) {
      this.currentPageSize = objvalue;
      this.GetData();
    },
    exportExcel() {
      ExportExcel("div .exportTable", "事件管理");
    },
    //日期选择
    dateBtn(startTime, endTime) {
      console.log(startTime, endTime)
      this.startTime = startTime;
      this.endTime = endTime;
     // this.GetData();
    },
    //删除
    deltableItem(row) {
      this.$confirm("确认删除？")
        .then(_ => {
          EventManage.EventManageDel(row.EventID).then(res => {
            this.GetData();
            this.$message({
              type: "success",
              message: "删除成功"
            });
          });
        })
        .catch(_ => {});
      //console.log(row);
    }
  }
};
</script>
