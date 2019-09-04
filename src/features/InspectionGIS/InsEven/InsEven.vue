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
          <el-form-item label="事件查找：" placeholder="类型、上报人、编号" @keyup.enter.native="GetData">
            <el-input v-model="detailValue"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-button class="my-search" size="mini" @click="GetData" v-if="$options.filters.btnTree('/api/EventManage/Get' ,$route.meta.iFunID)">查询</el-button>
        <el-button class="my-export" @click="exportExcel" size="mini"  v-if="$options.filters.btnTree('export' ,$route.meta.iFunID)">导出</el-button>
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
    ></InsTable>
    <el-dialog
      class="myDialog"
      :visible.sync="detailDialogVisible"
      :before-close="handleClose"
      width="780px"
      custom-class="order_detail_dialog"
      title="事件工单详情"
      center
    >
      <el-scrollbar class="dialog-scroll">
        <div id="dialogPrint">
          <!-- <el-row class="dialog-table" style="padding:0">
            <el-col
              v-for="(item,index) in detailDialogTwo"
              :key="index"
              :span="12"
              class="wrapperCol"
            >
              <el-col :span="6" class="dialog-table-lable">{{index}}</el-col>
              <el-col :span="18">{{item}}</el-col>
            </el-col>
            <el-col
              :span="24"
              v-for="(item,index) in detailDialogOne"
              :key="index"
              class="wrapperCol"
              :class="{'dialog_img-wrapper': isarray(item)}"
            >
              <el-col :span="3" class="dialog-table-lable">{{index}}</el-col>
              <el-col :span="21" class="dialog_img" v-if="isarray(item)">
                <img :src="image" alt v-for="(image,index) in item" :key="index" />
              </el-col>
              <el-col :span="21" class="textalign_left" v-else>{{item}}</el-col>
            </el-col>
          </el-row> -->
          <table border="1" class="dialog-table" style="border-collapse: collapse;">
              <tr  v-for="(item,index) in detailDialogTwo" :key="index"  class="wrapperCol">
                  <td class="dialog-table-lable">{{item[0]}}</td>
                  <td>{{item[1]}}</td>
                  <td class="dialog-table-lable">{{item[2]}}</td>
                  <td>{{item[3]}}</td>
              </tr>
              <tr  v-for="(item,index) in detailDialogOne" :key="index" class="wrapperCol" 
                :class="{'dialog_img-wrapper': isarray(item) && item.length}">
                <td class="dialog-table-lable">{{index}}</td>
                <td colspan="3" class="dialog_img" v-if="isarray(item)">
                  <a :href="image"  target="_blank" v-for="(image,index) in item" :key="index" ><img :src="image" alt  /></a>
                </td>
                <td colspan="3" v-else>{{item}}</td>
              </tr>
            </table>
          <div id="dialogDetailMap" class="dialogDetailMap"></div>
        </div>
        <el-row>
          <el-button  @click="print">打印</el-button>
        </el-row>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>
<script>
import _ from "lodash";
import config from '@config/config.js'
import printJS from 'print-js'
import BaseMap from "@services/OpenLayers/BaseMap";
import MapNavigate from "@services/OpenLayers/MapNavigate";
import * as EasyTable from "@common/consts/inseasyui-table";
import { ExportExcel, FixFloat } from "@util";
import EvenType from "@api/Inspection/EvenType";
import EventManage from "@api/Inspection/EventManage";
import DateBtnChoose from "@features/InspectionGIS/components/DateBtnChoose";
import TableFormTitle from "@common/components/TableFormTitle";
import InsTable from "@features/InspectionGIS/components/InsTable";
export default {
  components: {
    DateBtnChoose,
    TableFormTitle,
    InsTable
  },
  data() {
    return {
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
      MapMethods: null //地图
    };
  },
  computed: {},

  created() {
    //初始化数据
    this.loadLayerData();
    this.GetData()
  },
  methods: {
    print(){
      printJS({
        printable:'dialogPrint',
        type: 'html',
        header: '<h3 class="custom-h3">智慧水务控管一体化平台</h3>',
        CSS:''
        
      })
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
      });
    },
    detailBtn(row) {
      this.detailDialogVisible = true;
      this.detailDialogTwo = [
        ['事件编号',row.EventCode,'上报人',row.PName],
        ['上报时间',row.UpTime,'所属部门',row.DeptName],
        ['事件内容',,row.ET1,'事件类型',row.ET1],
        ['紧急程度',row.HandlerLevelName,'事件来源',row.EventFromName],
        ['处理级别',row.UrgencyName,'派单员',row.DispatchPerson]
      ];
      let EventPictures = row.EventPictures.split('|')
      EventPictures = _.map(EventPictures, item => {
        return config.apiPath.insURL + item
      })
      this.detailDialogOne = {
        事件地址: row.EventAddress,
        现场照片: EventPictures,
        // 缩略图预览: [],
        事件描述: row.EventDesc
      };
      //声明地图对象
      this.$nextTick(() => {
        if (!this.MapMethods) {
          let _mapController = new BaseMap();
          _mapController.createMap("dialogDetailMap").then(ResultObject => {
            this.MapMethods = new MapNavigate(ResultObject);
            this.MapMethods.setPointOnMap(
              [[113.52334821796903, 34.77318724078378]],
              false,
              () => {},
              "RoutePoint",
              "desript"
            );
            this.MapMethods.setCenter([113.52334821796903, 34.77318724078378]);
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
            [[113.52334821796903, 34.77318724078378]],
            false,
            () => {},
            "RoutePoint",
            "desript"
          );
          this.MapMethods.setCenter([113.52334821796903, 34.77318724078378]);
        }
      });
    },
    printMap() {
      this.MapMethods.printMap(res => {
        //console.log(res);
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
    dateBtn(startTime, endTime) {
      this.startTime = startTime;
      this.endTime = endTime;
      //this.GetData();
    },
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
