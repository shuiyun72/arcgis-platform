<template>
  <div class="Device_Management_container table_style" component="DeviceManagement">
    <el-form label-width="83px" label-position="right" size="mini" gutter="20px">
      <el-row>
        <el-col :span="9">
           <layerSelect
            :layerGroupLen.sync= "layerGroupLen"
            :layerData.sync = "layerData"
            :loading.sync = "loading"
            :groupLayerDataValue.sync = "groupLayerDataValue"
            :layerDataValue.sync = "layerDataValue"
            :layerListName.sync = "layerListName"
            @onLayerSelectChange = "onLayerSelectChange"
            @onGroupLayerSelectChange = "onGroupLayerSelectChange"
            ></layerSelect>
        </el-col>
      </el-row>
      <!-- 
        //查询模块
        <el-row>
        <el-col :span="9">
          <el-form-item label="属性：">
            <el-select v-model="attRListValue" placeholder="编号" @change="onAttRChange" size="mini">
              <el-option
                v-for="item in attRList"
                :key="item.field"
                :label="item.text"
                :value="item.field"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="20px">
            <el-select v-model="mathDataValue" size="mini" @change="mathDataValueChange">
              <el-option
                v-for="item in mathData"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="20px" @keyup.enter.native="GetData">
            <el-input v-model="detailDataValue" size="mini" :type="inputType"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" size="mini" @click="GetData">查询</el-button>
        </el-col>
      </el-row> -->
    </el-form>
    <GisTable
      :loading = "loading"
      :tableHeight ="`calc(100vh - 133px)`"
      @TableRowClick = "onTableRowClick"
      :layerListName = "layerListName"
      :columnListData = "squareQueryRawTableData"
    ></GisTable>
  </div>
</template>
<script>
import axios from "axios";
import _ from "lodash";
import { MapConfigure, LAYER_NAME_MAP ,FeatureLayerOperation,LayerType} from "@common/consts/GisConst/MapConfigure";
import MapDataOperation from "@services/ArcMap/MapDataOperation";
import * as EasyTable from "@common/consts/GisConst/GisTableColumn";
import { exportExcel, FixFloat } from "@util";
import layerSelect from "@features/GIS/components/layerSelect";
import GisTable from "@features/GIS/components/GisTable";
export default {
  components:{
    layerSelect,
    GisTable
  },
  data() {
    return {
      activeItem:{},//当前选中的图层信息
      layerGroupLen:1,//layerData组别 是否为多组数据，若为多组渲染多组select
      groupLayerDataValue:[],//多选select的值
      loading:false,
      layerData: [], //图层下拉框数据
      layerDataValue: "PipeLineLayer", //图层选中值
      layerListName: "全部", //getData 查询所需的图层编号
      attRList: [], //属性列表
      attRListValue: "全部", //属性选中值
      //关系比较数组
      mathData: [
        {
          text: "类似",
          value: "like"
        },
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
        },
        
        {
          text: "空值",
          value: "null"
        }
      ],
      mathDataValue: "like", //关系比较选中值
      detailDataValue: "", //input框输入值
      squareQueryRawTableData: [], //搜索结果数据
      // 分页相关
      inputType:'text',//输入框是否为数字类型
    };
  },
  computed: {
    inputType(){
      return this.attRList.filter(ele => {
        return ele.field == this.attRListValue;
      })[0].type;
    }
  },
  created() {
     this.loading = true
    //初始化数据
    this.loadLayerData();
  },
  mounted() {
    //空间数据查询
    this._MapDataOperation = new MapDataOperation();
    this._MapDataOperation.init().then(() => {
      this.GetData(); //调取数据
    });
  },
  methods: {
    onGroupLayerSelectChange(val){
      this.activeItem = FeatureLayerOperation.getLayerFeatureByName(this.layerDataValue)
      this.GetData(); 
    },
    //高亮选中区域
    heightLight(resultValue){
      if(this.activeItem.layerType == LayerType.PipeTypeNO){
         // //展示线
        this.$bus.emit("pipeLineView", resultValue); //线高亮
      }else{
         // //展示消防栓
         this.$bus.emit("facilitiesView", resultValue , this.activeItem.iconName);
      }
    },
    //双击点击选择事件
    onTableRowClick(row, column, event) {
      this.$bus.emit("setMapLocation", row.OBJECTID, this.layerDataValue);
    },
    //初始化相关数据
    loadLayerData() {
      let needLayer = FeatureLayerOperation.getNeedLayer()
      this.layerData = needLayer[1]
      this.layerGroupLen =needLayer[0].length
       
      this.layerDataValue = needLayer[2];
      this.activeItem = FeatureLayerOperation.getLayerFeatureByName(this.layerDataValue)
      this.groupLayerDataValue = needLayer[3]
      this.layerListName = needLayer[0][0].featureLayers[0].listViewColumn//表头
      this.attRList = MapConfigure.FeatureLayerGroup[0].featureLayers[0].featureColumn;
      this.attRListValue = this.attRList[0].field;
      this.mathDataValue = this.mathData[0].value;
    },
    // 查询操作
    GetData() {
      
      /** 条件sql语句查询 */
      let sqlData = " 1 = 1 ";
      if (this.detailDataValue) {
        sqlData = `${this.attRListValue} `;
        if (isNaN(parseInt(this.detailDataValue))) {
          sqlData += `like '%${this.detailDataValue.toUpperCase()}%'`;
        } else if(this.inputType == 'text'){
           sqlData += `${this.mathDataValue} '${this.detailDataValue}'`;
        }
        else {
          sqlData += `${this.mathDataValue} ${this.detailDataValue}`;
        }
      }
      if( sqlData != " 1 = 1 "){
        this.$bus.emit("clearGDataLayer");//清除绘制过的图层数据信息
      }
       
      let pipeURL = FeatureLayerOperation.getLayerURLByName(this.layerDataValue)
      this._MapDataOperation.featureQuery(
        null,
        sqlData,
        pipeURL,
        resultValue => {
          let ResultData = _.map(resultValue, objValue => {
            return objValue.attributes;
          });
          this.squareQueryRawTableData = FixFloat(ResultData);
          this.loading = false
          if(sqlData != " 1 = 1 "){
            this.heightLight(resultValue)
          }
        }
      );
    },
    //选择图层改变操作
    onLayerSelectChange(objvalue) {
      this.activeItem = FeatureLayerOperation.getLayerFeatureByName(this.layerDataValue)
      //获取选中列
      let activeLayer = FeatureLayerOperation.getLayerFeatureByName(this.layerDataValue)
      this.squareQueryRawTableData = []
      //设置选中列的前端列表控件列
      
      //设置选中列列的对应属性列表(点选显示)
      this.attRList = activeLayer.featureColumn;
      this.attRListValue = this.attRList[0].field;
      this.onAttRChange();
      this.GetData();
    },
    //比较关系改变操作
    mathDataValueChange() {
      this.detailDataValue = "";
    },
    //属性改变操作
    onAttRChange() {
      this.mathDataValue = this.mathData[0].value;
      //控制输入框类型
      let type = this.attRList.filter(ele => {
        return ele.field == this.attRListValue;
      })[0].type;
      type ? this.inputType = type : this.inputType = 'text'
      this.mathDataValueChange();
    }
  }
};
</script>
