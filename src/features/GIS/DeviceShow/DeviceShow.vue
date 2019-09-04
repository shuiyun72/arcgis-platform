<template>
  <div class="senior-search-style table_style" :class="{flexible:flexible}">
    <TableFormTitle 
    :titleName = "'设备展示'" 
    :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="83px" label-position="right" size="mini">
      <el-row type="flex" justify="space-between">
        <el-col :span="9"  class="table-left" :xs="12" :sm="12" :lg="9">
          <layerSelect
            :loading.sync="loading"
            :layerGroupLen.sync="layerGroupLen"
            :layerData.sync="seniorData"
            :groupLayerDataValue.sync="groupLayerDataValue"
            :layerDataValue.sync="layerDataValue"
            :layerListName.sync="layerListName"
            @onLayerSelectChange="onLayerSelectChange"
            @onGroupLayerSelectChange="onLayerSelectChange"
          ></layerSelect>
        </el-col>
        <el-col :span="15">
          <el-row type="flex" justify="end" style="padding:0">
            <el-button class="my-show" size="mini" @click="seniorSearch" v-if="$options.filters.btnTree('normalShow' ,$route.meta.iFunID)">普通展示</el-button>
            <el-button class="my-filter-show" size="mini" @click="filterSearch" v-if="$options.filters.btnTree('filterShow' ,$route.meta.iFunID)">过滤展示</el-button>
            <el-button class="my-reset hidden-md-and-down" size="mini" @click="seniorReset" v-if="$options.filters.btnTree('reset' ,$route.meta.iFunID)">重置</el-button>
            <el-button class="my-export" size="mini" @click="exportExcel" v-if="$options.filters.btnTree('export' ,$route.meta.iFunID)">导出</el-button>
          </el-row>
        </el-col>
      </el-row>
      <div class="fatorClass">
        <el-col :span="9"  class="table-left" :xs="12" :sm="12" :lg="9">
          <el-row>
            <el-form-item label="属性：">
              <el-select
                v-model="fatorObj.attRListValue"
                placeholder="编号"
                @change="onAttRChange(fatorObj.attRListValue)"
                size="mini"
              >
                <el-option
                  v-for="item in attRList"
                  :key="item.field"
                  :label="item.text"
                  :value="item.field"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="关系：">
              <el-select v-model="fatorObj.mathDataValue" size="mini">
                <el-option
                  v-for="item in mathData"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="值：">
              <el-select
                v-if="fatorObjSelect"
                v-model="fatorObj.detailDataValue"
                placeholder
                size="mini"
              >
                <el-option v-for="item in attrValueList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <el-input v-else v-model="fatorObj.detailDataValue" style="width:95%;"></el-input>
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="4" class="flexCol">
          <div class="sql-btn-warpper">
            <el-button class="my-SeniorSearch" @click="addOrSql('and')">add条件</el-button>
            <el-button class="my-SeniorSearch" @click="addOrSql('or')">or条件</el-button>
            <el-button class="my-SeniorSearch" @click="clearSql">清空</el-button>
          </div>
        </el-col>
        <el-col :span="10" :xs="6" :sm="6" :lg="10">
          <el-form-item  label-width="0px">
            <el-input type="textarea" v-model="sqlValue"></el-input>
          </el-form-item>
        </el-col>
      </div>
    </el-form>
    
       <GisTable
      :loading="loading"
      @TableRowClick="onTableRowClick"
      :layerListName="layerListName"
      :columnListData="columnListData"
    ></GisTable>
   
  </div>
</template>
<script>
import axios from "axios";
import _ from "lodash";
import {
  MapConfigure,
  LAYER_NAME_MAP,
  FeatureLayerOperation,
  LayerType
} from "@common/consts/GisConst/MapConfigure";
import MapDataOperation from "@services/ArcMap/MapDataOperation";
import * as GisTableColumn from "@common/consts/GisConst/GisTableColumn";
import { ExportExcel, FixFloat } from "@util";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { constants } from "fs";
import layerSelect from "@features/GIS/components/layerSelect";
import GisTable from "@features/GIS/components/GisTable";
import TableFormTitle from "@common/components/TableFormTitle";
import { debug } from "util";
export default {
  components: {
    layerSelect,
    GisTable,
    TableFormTitle
  },
  beforeDestroy() {
    if(this.sqlValue){
      this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
    }
    if(this.filterLayer){
      this.$bus.emit('setCheckedTreeNodes',true)
      this.$bus.emit('onLayerViewAllVisibale',true)
    }
  },
  data() {
    return {
      heightLightState:false,//地图高亮状态
      filterLayer:false,//是否展示过滤图层
      flexible:false,//是否收缩左侧表格
      activeItem: {},//当前选中的图层信息
      layerListName: [],//表格表头
      layerGroupLen: 1, //layerData组别 是否为多组数据，若为多组渲染多组select
      groupLayerDataValue: [],//多选select的值
      loading: false,//表格加载
      columnListData: [], //空间数据查询出来的所有数据列
      seniorData: [] ,//非缓冲区图层数据  图层下拉框数据
      sqlValue: "", //高级查询拼接后的sql语句
      oldersqlValue:'',//上次查询的sql
      attRList: [], //sql的查询属性列表
      //关系比较数组列表
      mathData: [],
      attrValueList: [], //属性下拉选择框
      //高级查询所需的左侧单个条件输入
      fatorObj: {
        detailDataValue: '',
        mathDataValue:'',
        attRListValue:''
      }, //sql查询
      addIndex: 0, //sql第几条
      selectOrInput:[
        'material_science',
        'caliber',
        'Installation_address',
        'construction_unit',
        'management_unit',
        'embedding_mode',
        'Interface_form',
        'switch_type',
        'equipment_type',
        'switchingstate',
        'Interface_form',
        'businessarea',
        'specifications',
        'manufacturer',
      ] , //值的输入形式为下拉框的情况集合
      fatorObjSelect:true,//值的输入形式为下拉框时为true
    };
  },
  created() {
  },
  mounted() {
    this.loadLayerData();
    //地图数据操作
    this._MapDataOperation = new MapDataOperation();
    this._MapDataOperation.init().then(() => {
      // this.onLayerSelectChange();
    });
  },
  methods: {
    filterSearch(){
      if(this.sqlValue){
        this.filterLayer = true
        this.$bus.emit('setCheckedTreeNodes',false)
        this.$bus.emit('onLayerViewAllVisibale',false)
        if(this.oldersqlValue != this.sqlValue){
          this.loading = true;
          if(this.heightLightState ){
            this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
            this.heightLightState = false
          }
          this.MapDataSearch(this.sqlValue); 
        }
      }else{
        this.$message({
          type:'warning',
          message:'过滤展示仅用于筛选条件存在时',
          showclose:true
        })
      }
      
    },
    loadLayerData() {
      let needLayer = FeatureLayerOperation.getNeedLayer();
      this.seniorData = needLayer[1];
      this.layerGroupLen = needLayer[0].length;
      this.layerDataValue = needLayer[2];
      this.activeItem = FeatureLayerOperation.getLayerFeatureByName(
        this.layerDataValue
      );
      this.groupLayerDataValue = needLayer[3];
      this.layerListName = needLayer[0][0].featureLayers[0].listViewColumn; //表头
      this.attRList =
        GisTableColumn[MapConfigure.FeatureLayerGroup[0].featureLayers[0].listViewColumn]
      this.mathData = [
       
        {
          text: "等于",
          value: "="
        },
        {
          text: "大于",
          value: ">"
        },
        {
          text: "小于",
          value: "<"
        },
        {
          text: "大于等于",
          value: ">="
        },
        {
          text: "小于等于",
          value: "<="
        },
        {
          text: "不等于",
          value: "<>"
        },{
          text: "类似",
          value: "like"
        }
      ];
      this.mathDataValue = this.mathData[0].value;
      this.fatorObj = {
        detailDataValue: "",
        mathDataValue: this.mathData[0].value,
        attRListValue: this.attRList[0].field
      }; //sql查询
      this.onAttRChange()
    },
    //清空sql查询
    clearSql() {
      this.addIndex = 0;
      this.sqlValue = "";
      // this.fatorObj = {
      //   mathDataValue: this.mathData[0].value,
      //   attRListValue: this.attRList[0].field,
      //   type: "text"
      // }; //sql查询
    },
    //高级查询重置
    seniorReset() {
      this.fatorObj = {
        mathDataValue: this.mathData[0].value,
        attRListValue: this.attRList[0].field,
        detailDataValue : "",
      }; //sql查询
      this.clearSql()
      if(this.heightLightState){
        this.heightLightState = false;
        this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
      }
      if (this.layerDataValue == "all") {
        this.layerListName = 'all'
      } else {
        this.layerListName = FeatureLayerOperation.getLayerFeatureByName(this.layerDataValue).listViewColumn
      }
      this.columnListData = []
    },
    //属性值下拉选择数据
    searchMethods(GroupField, callBack) {
      this.attrValueList = []
      let _GroupField = GroupField || this.fatorObj.attRListValue;
      let pipeURL = FeatureLayerOperation.getLayerURLByName(
        this.layerDataValue
      );
      this._MapDataOperation.searchOrCountCondition(
        _GroupField,
        pipeURL,
        resultValue => {
          if (_.isFunction(callBack)) {
            callBack(resultValue);
            return;
          }
          let attrValueList = _.map(resultValue, item => {
            return item[_GroupField];
          });
          attrValueList = _.filter(attrValueList, item => {
            if (item) {
              return _(item).trim();
            }
          });
          if (attrValueList.length) {
           this.attrValueList =  _.sortBy(attrValueList); 
          }else{
            this.attrValueList = []
          }
        }
      );
    },
    //选中属性后控制输入框类型
    onAttRChange(item) {
      let type = _.filter(this.attRList, ele => {
        return ele.field == this.fatorObj.attRListValue;
      })[0].type;
      this.fatorObj.type = type;
      this.fatorObj.detailDataValue = "";
      this.fatorObjSelect = _.indexOf(this.selectOrInput,this.fatorObj.attRListValue) < 0 ? false : true;
      if(this.fatorObjSelect){
        this.searchMethods();
      }
    },
    //高亮选中区域
    heightLight(resultValue, layer) {
      this.heightLightState = true
      if(layer){
        this.activeItem = FeatureLayerOperation.getLayerFeatureByName(
          layer
        );
      } 
      if (this.activeItem.layerType == LayerType.PipeTypeNO) {
        // //展示线
        this.$bus.emit("pipeLineView", resultValue); //线高亮
      } else {
        // //展示消防栓
        this.$bus.emit("facilitiesView", resultValue, this.activeItem.iconName);
      }
    },
    //更新下拉框 的值
    updataLayerDataValue(){
      if (this.layerData[0].children) {
        this.layerDataValue = this.layerData[0].children[0].value;
        this.groupLayerDataValue = [this.layerData[0].value,this.layerData[0].children[0].value]
        this.layerListName = this.layerData[0].children[0].listViewColumn;
      } else {
        this.layerDataValue = this.layerData[0].value;
      }
    },
    //点击选择事件
    onTableRowClick(row, column, event) {
      let layer = this.layerDataValue
      if(this.layerDataValue == 'all'){
        layer = row.allTypeValue
      }
      this.$bus.emit(
        "setMapLocation",
        row.OBJECTID,
        layer,
        resultValue => {
          console.log(resultValue);
        }
      );
    },
    //导出表格
    exportExcel() {
      //下载excel导出
      ExportExcel("div .outDataSerchExcel", this.layerDataValue);
    },
    //图层下拉选择
    onLayerSelectChange(objvalue) {
      this.activeItem = FeatureLayerOperation.getLayerFeatureByName(
        this.layerDataValue
      );
      //设置选中列的前端列表控件列
      //this.columnListData = "";
      this.fatorObj = {
        detailDataValue: "",
        mathDataValue: this.mathData[0].value,
        attRListValue: this.attRList[0].field
      }; //sql查询
      this.clearSql()
      //this.seniorSearch();
      this.layerAttrChange(this.layerDataValue);
      this.fatorObjSelect = _.indexOf(this.selectOrInput,this.fatorObj.attRListValue) < 0 ? false : true;
      if(this.fatorObjSelect){
        this.searchMethods();
      }
    },
    //根据图层更新前端表头
    layerAttrChange(objvalue) {
      objvalue = objvalue || this.layerDataValue;
      //this.loading = true;
      this.columnList = [];
      let activeLayer = FeatureLayerOperation.getLayerFeatureByName(
        this.layerDataValue
      );
      //设置选中列的前端列表控件列
      //设置选中列列的对应属性列表(点选显示)
      this.attRList = GisTableColumn[activeLayer.listViewColumn]
    },
 
    //高级查询部分sql计算
    addOrSql(type) {
      if(!this.fatorObj.detailDataValue){
        this.$message({
          type:'warning',
          message:'请输入查询条件',
          showclose:true
        })
        return
      }
      let whereList;
      let detailDataValue;
      let item = this.fatorObj;
      detailDataValue = item.detailDataValue;
      if (item.mathDataValue == "like") {
        detailDataValue = `'%${detailDataValue}%'`;
      } else if (item.type != "Number") {
        detailDataValue = `'${detailDataValue}'`;
      }

      if (this.addIndex) {
        this.sqlValue += `${type} ${item.attRListValue} ${
          item.mathDataValue
        } ${detailDataValue} `;
      } else {
        this.sqlValue += `${item.attRListValue} ${
          item.mathDataValue
        } ${detailDataValue} `;
      }
      this.addIndex = 1;
    },
    //高级查询
    seniorSearch() {
      if (this.layerDataValue == "all") {
        this.layerListName = 'all'
      } else {
        this.layerListName = FeatureLayerOperation.getLayerFeatureByName(this.layerDataValue).listViewColumn
      }
      if(this.filterLayer){
        this.filterLayer = false
        this.$bus.emit('setCheckedTreeNodes',true)
        this.$bus.emit('onLayerViewAllVisibale',true)
      }
      if(this.sqlValue && this.oldersqlValue == this.sqlValue){ 
         return
      }
      if(this.heightLightState ){
        this.$bus.emit("clearGDataLayer"); //清除绘制过的图层数据信息
        this.heightLightState = false
      }
      this.loading = true;
      this.MapDataSearch(this.sqlValue); 
    },
    //调用数据查询和高级空间查询接口
    MapDataSearch(whereGIScondition, layer, callBack) {
      this.oldersqlValue = whereGIScondition
      layer = layer || this.layerDataValue;
      let pipeURL = FeatureLayerOperation.getLayerURLByName(layer);
      this._MapDataOperation.featureQuery(
        null,
        whereGIScondition,
        pipeURL,
        resultValue => {
          if (whereGIScondition && whereGIScondition != "1=1") {
            this.heightLight(resultValue);
          }
          resultValue = _.map(resultValue, objValue => {
            return objValue.attributes;
          });
          if (this.layerDataValue !== "all") {
            this.loading = false;
          }
          resultValue = FixFloat(resultValue);
          if (_.isFunction(callBack)) {
            callBack(resultValue);
            return;
          }
          this.columnListData = resultValue;
        }
      );
    }
  }
};
</script>