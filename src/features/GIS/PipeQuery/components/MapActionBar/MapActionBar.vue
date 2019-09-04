<template>
  <div>
    <!-- <div class="homeDiv">
      <router-link class="iconfont icon-shouye" to="/" title="返回首页"></router-link>
    </div>-->
    <!-- 顶部查询开始 -->
    <el-row class="Map_Action_Bar_Search row" type="flex" justify="space-between">
      <div class="Text-Wraper">
        <div class="textShowWraper hidden-md-and-down">
          <span v-for="item in topTotleMessage" :key="item.name">
            <span>{{item.name}}</span>
            <span class="orange">{{item.number}}</span>
            <span>{{item.unit}}</span>
          </span>
        </div>
      </div>

      <el-row type="flex" class="row" v-show="searchShow" justify="end">
        <!--右侧菜单控制-->
        <div class="Map_Action_Bar_container" component="MapActionBar">
          <div
            class="action_item"
            v-for="action in actionList"
            :key="action.id"
            :class="{active:actionItemActiveID == action.id}"
            :name="action.name"
            :value="action.value"
            @click="onItemClick(action)"
            :title="action.name"
          >
           <el-popover
            v-if="action.id == 'FreehandPolyline'"
            placement="bottom"
            width="72"
            popper-class="Map_Action_Bar_popover"
            trigger="click">
            <div>
              
               <el-button 
              v-for="item in lengthUtilList"
              :key="item.value"
              @click="onItemClick(action,item.value)" 
              :class="{ active: lengthUtilListValue === item.value}">{{item.name}}</el-button>
            </div>
            <span slot="reference" class="iconfont" :class="action.icon"></span>
          </el-popover>

          <el-popover
            v-else-if="action.id == 'Extent'"
            placement="bottom"
            width="72"
            popper-class="Map_Action_Bar_popover"
            trigger="click">
            <div>
              <el-button 
              v-for="item in areaUtilList"
              :key="item.value"
              @click="onItemClick(action,item.value)" 
              :class=" { active: areaUtilListValue === item.value } " >{{item.name}}</el-button>
            </div>
            <span slot="reference" class="iconfont" :class="action.icon"></span>
          </el-popover>
          
            <span class="iconfont" :class="action.icon" v-else></span>
          </div>
        </div>
        <el-select v-model="searchFactor" class="search-factor">
          <el-option value="POI" label="POI"></el-option>
          <el-option value="coordinate" label="坐标"></el-option>
        </el-select>
        <!-- <input v-model="topSearchDataValue"> -->
        <span class="input-Wraper between" v-show="searchFactor == 'coordinate'">
          <el-input-number @change="handleChangeX" controls-position="right" placeholder="X"></el-input-number>
          <el-input-number @change="handleChangeY" controls-position="right" placeholder="Y"></el-input-number>
          <!-- <el-input placeholder="X" v-model="searchCoordinate.X" type = "number" ></el-input>
          <el-input placeholder="Y" v-model="searchCoordinate.Y" type = "number" ></el-input> -->
        </span> 
        <!-- <span class="input-Wraper" v-show="searchFactor == 'POI'">
          <el-input type="text" placeholder="请输入需要查询的POI" v-model="POISearchData"></el-input>
        </span>-->
        <el-select
          class="input-Wraper"
          v-show="searchFactor == 'POI'"
          v-model="topSearchDataValue"
          filterable
          remote
          reserve-keyword
          placeholder="请输入需要查询的POI"
          :remote-method="remoteMethod"
        >
          <el-option
            v-for="item in remoteData"
            :key="item.OBJECTID"
            :label="item.name"
            :value="item.OBJECTID"
          ></el-option>
        </el-select>
        <div class="search" @click="mapSearchClick()">
          <span class="iconfont icon-sousuo"></span>
        </div>
      </el-row>
    </el-row>
    <!-- 图层控制弹窗开始 -->
    <div class="Map_Action_Bar_Layer_Win" v-show="layerShow">
      <div class="Win_Title">
        <span class="text">图层控制</span>
        <span  @click="closeLayer('tuceng')" class="icon">
          <i class="iconfont icon-shousuo"></i>
        </span>
      </div>
      <div class="TuCeng_List">
        <el-scrollbar>
          <div class="Win_Img_List">
            <div class="List_Item" v-for="item in imgList" :key="item.layerName">
              <div
                class="Win_Img_List_Item"
                @click="onMainLayerControl(item)"
                :class="{active: item.layerName == MainLayeValue}"
              >
                <span>{{item.layerCName}}</span>
                <img :src="require('@assets/'+'toolIcon/' +item.iconName)">
              </div>
              <div class="Win_Text_List_Item">
                <el-row type="flex" style="padding:0" justify="space-between">
                  <span class="tuceng_title">透明度</span>
                  <span class="Win_Range_Value">{{item.transValue}}%</span>
                </el-row>
                
                <el-slider v-model="item.transValue" @change="sliderHandle(item)"></el-slider>
              </div>
            </div>
          </div>
          <div class="She_Shi_Layer">
            <template v-for="item in GISWebData">
              <el-checkbox
                :key="item.methoud"
                :label="item.name"
                v-if="item.ControlShow"
                v-model="item.ShowStation"
                @change="axiosWebShowOrHidden(item)"
            ></el-checkbox>
            </template>
            
            <el-tree
              :data="layerData"
              ref="tree"
              default-expand-all
              :default-checked-keys="defaultCheckLabel"
              @check-change="tuCengChange"
              show-checkbox
              node-key="id"
              :props="defaultProps"
            ></el-tree>
            
            <!-- <el-checkbox-group v-model="sheShiType">
              <el-checkbox
                v-for=" item in layerData"
                :key="item.viewIndex"
                :label="item.layerCName"
                :name="item.layerName"
                :checked="item.isActive"
                @change="onDynamicLayerControl(item)"
              ></el-checkbox>
            </el-checkbox-group>-->
          </div>
        </el-scrollbar>
      </div>
    </div>

    <!-- 图例控制 -->
    <div class="Map_Action_Bar_Layer_Win" v-show="tuLiShow" :class="{hidden:tuLiShow}">
      <div class="Win_Title">
        <span class="text">图例控制</span>
        <span  @click="closeLayer('tuli')" class="icon">
          <i class="iconfont icon-shousuo"></i>
        </span>
      </div>
      <ul class="Tuli_List">
        <el-scrollbar>
          <div class="Tuli-Pipe_Item" v-for="item in tuliPipeList" :key="item.name">
            <div class="pipe-name">{{item.layerName}}</div>
            <!-- <img :src="item.url" class="pipe-icon"/>  -->
            <div :style="{'background-image': 'url(' + item.url +')'}"  class="pipe-icon"></div> 
            <!-- <span class="pipe-icon" :style ="{'background-color':item.html}"></span> -->
          </div>
         
          <div class="Tuli_List_Item" v-for="item in tuliList" :key="item.name">
            <template  v-if = " item.html != 'displayNone' ">
            <span>
              <img :src="item.url"/>  
            </span>
            <span>{{item.layerName}}</span>
            </template>
          </div>
        </el-scrollbar>
      </ul>
    </div>

    <!-- 打印控制 -->
    <div class="Map_Action_Bar_Layer_Win" v-show="printShow">
      <div class="Win_Title">
        <span class="text">打印设置</span>
        <span  @click="closeLayer('print')" class="icon">
          <i class="iconfont icon-shousuo"></i>
        </span>
      </div>
      <div class="print_List ">
        <el-scrollbar>
         <el-form ref="form" :model="printForm" label-width="100px" class="print-wrapper">
          <el-form-item label="文件标题：">
            <el-input v-model="printForm.label"></el-input>
          </el-form-item>
          <el-form-item label="页面设置：">
            <el-select v-model="printForm.layout">
              <el-option v-for="item in printLableList" :key="item.value" :value="item.value" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="文件格式">
            <el-select v-model="printForm.format">
              <el-option v-for="item in formatList" :key="item.value" :value="item.value" :label="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题名称：">
            <el-input v-model="printForm.options.titleText" placeholder="请输入标题名称"></el-input>
          </el-form-item>
          <el-form-item label="制作人：">
            <el-input v-model="printForm.options.authorText" placeholder="请输入制作人名称"></el-input>
          </el-form-item>
          <el-form-item label="详细信息：">
            <el-input v-model="printForm.options.copyrightText" placeholder="请输入详细信息"></el-input>
          </el-form-item>
          <el-form-item label="比例尺单位">
            <el-select v-model="printForm.options.scalebarUnit">
              <el-option v-for="item in scalebarUnitList" :key="item.value" :value="item.value" :label="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button style="font-size:14px;" class="my-dialog-submit " size="mini" @click="printFnc">立即创建</el-button>
            <el-button style="font-size:14px;" class="my-dialog-cancel" size="mini"  @click="closeLayer('print')">取&nbsp;&nbsp;消</el-button>
          </el-form-item>
        </el-form>
        </el-scrollbar>
      </div>
    </div>

     <boxSelectTable :searchType.sync="searchType" ref="boxSelectTable"></boxSelectTable>
  </div>
</template>

<script>
import _ from "lodash";
import boxSelectTable from "../boxSelectTable";
import { DEFAULT_ACTION_LIST } from "./consts";
import {
  MapConfigure,
  LAYER_NAME_MAP,
  LayerType,
  FeatureLayerOperation,
  Legend_Json,
  GISWebData
} from "@common/consts/GisConst/MapConfigure";
import SpatialSearch from "@api/GIS/SpatialSearch";
import axios from 'axios'
export default {
  components: { boxSelectTable },
  props: {
    customizeActionFunc: {
      type: Function
    },
    toolbar:{
      type:Object
    }
  },
  computed: {
    winValue() {
      let winValue = {};
      winValue.img = this.imgList;
      winValue.type = this.sheShiType;
      return winValue;
    }
  },
  created() {
    this.loadData();
    this.actionList = this.customizeActionFunc
      ? this.customizeActionFunc(_.cloneDeep(DEFAULT_ACTION_LIST))
      : DEFAULT_ACTION_LIST;
    window.oo = this.openDialog;
    this.getTuliList()
    this.$bus.on("setCheckedTreeNodes", this.setCheckedTreeNodes); //控制tree的节点
  },
  beforeDestroy() {
    this.$bus.off("setCheckedTreeNodes", this.setCheckedTreeNodes); //控制tree的节点
  },
  data() {
    return {
      GISWebData:GISWebData,//通过接口获取数据展示在地图上的配置信息
      boxSelectState:false,//框选状态
      tuliList:[],//图例的数据列表
      PolylineActive:'m',//米千米选择
      actionItemActiveID: "", //地图操作图标选中
      POISearchData: "", //POI输入框内容
      searchCoordinate: {
        X: null,
        Y: null
      }, //经纬度查询
      searchFactor: "POI", //顶部查询的factor
      layerData: FeatureLayerOperation.getLayer(),
      defaultCheckLabel: [], //默认选中的tree图层的值
      topTotleMessage: [
        {
          name: "管网总数",
          number: 100,
          unit: "根",
          layerType: LayerType.PipeTypeNO,
          math: "count"
        },
        {
          name: "管网总长",
          number: 100,
          unit: "米",
          layerType: LayerType.PipeTypeNO,
          math: "length"
        },
        {
          name: "消防栓总数",
          number: 100,
          unit: "个",
          layerType: LayerType.FirehydrantTypeNO,
          math: "count"
        },
        {
          name: "阀门总数",
          number: 100,
          unit: "个",
          layerType: LayerType.ValveTypeNO,
          math: "count"
        }
      ], //顶部管网总数等统计结果集
      MainLayeValue: "StreetLayer", //选中图层值
      imgList: _.cloneDeep(MapConfigure.BaseLayers),
      // layerData: _.cloneDeep(MapConfigure.LayerConfiguration), //初始化图层数据
      topSearchDataValue: "",
      remoteData: [], //远程数据集合
      sheShiType: [],
      actionList: [],
      layerShow: false,
      tuLiShow: false,
      printShow: false,
      searchShow: true,
      actionValue: null,
      printForm: {
        label: "Landscape (PDF)",
        layout: "A4 Landscape",
        format: "pdf",
        options: {
            titleText: "",
            authorText: "",
            copyrightText: "",
            scalebarUnit: "Meters",           
        }
      },
      printLableList:[
        {
          name: 'A3横向',
          value: 'A3 Landscape'
        },
        {
          name: 'A3纵向',
          value: 'A3 Portrait	'
        },
        {
          name: 'A4横向',
          value: 'A4 Landscape'
        },
        {
          name: 'A4纵向',
          value: 'A4 Portrait'
        },
        {
          name: '信纸 ANSI A 横向',
          value: 'Letter Ansi A Landscape'
        },
        {
          name: '信纸 ANSI A 纵向',
          value: 'Letter Ansi B Portrait'
        },
        {
          name: '文摘 ANSI B 横向',
          value: 'Tabloid Ansi B Landscape'
        },
        {
          name: '文摘 ANSI B 纵向',
          value: 'Tabloid Ansi B Portrait'
        }
      ],
      formatList :[
        {
          value:'pdf'
        },{
          value:'png32'
        },{
          value:'png8'
        },{
          value:'jpg'
        },{
          value:'gif'
        },{
          value:'eps'
        },{
          value:'svg'
        },{
          value:'svgz'
        },
      ],
      scalebarUnitList:[
        {
          value:'Miles'
        },
        {
          value:'Kilometers'
        },
        {
          value:'Meters'
        },
        {
          value:'Feet'
        },
      ],
      lengthUtilList:[
        {
          name:'米',
          value: 'm'
        },
        {
          name:'千米',
          value: 'km'
        },
      ],
      lengthUtilListValue:'m',
      areaUtilListValue:'m',
      areaUtilList:[
        {
          name:'平方米',
          value: 'm'
        },
        {
          name:'平方公里',
          value: 'km'
        },
        //{
        //  name:'平方英里',
        //  value: 'miles'
        //},
      ],
      tuliPipeList:[]

    };
  },
  filters: {
    // 截取当前数据到小数点后两位
    numFilter(value) {
      let realVal = parseFloat(value).toFixed(3);
      return parseFloat(realVal);
    }
  },
  methods: {
    axiosWebShowOrHidden(item){
      this.$emit('axiosWebShowOrHidden',item)
    },
    //更改官网等设备显示树
    //false 清空  true 显示全部
    setCheckedTreeNodes(type){
      if(type){
        // console.log(this.layerData)
        // this.$refs.tree.setCheckedNodes(this.defaultCheckLabel)
        this.$refs.tree.setCheckedNodes( this.layerData)
        
      }else{
        this.$refs.tree.setCheckedNodes([])
      }
      
    },
    //更改横坐标查询
    handleChangeX(value){
      this.searchCoordinate.X = value
    },
    //更改纵坐标查询
    handleChangeY(value){
      this.searchCoordinate.Y = value
    },
    //打印方法
    printFnc(){
      this.toolbar.printMap(this.printForm)
      this.printShow = false
    },
    //通过dom的操作取出实例信息
    getTuliList(){
      axios.get(Legend_Json).then(response => {
           _.forEach(response.data.layers,item =>{
             if(item.legend.length > 1){
                _.forEach(item.legend, pipeItem => {
                  if( pipeItem.imageData && pipeItem.label){
                    pipeItem.url = 'data:image/png;base64,' + pipeItem.imageData
                  
                    pipeItem.layerName = pipeItem.label + item.layerName
                    let pipeName = pipeItem.label.split('-')
                    if(pipeName.length > 1){
                      pipeName[0] = parseInt(pipeName[0])
                      pipeName[1] = parseInt(pipeName[1])
                      pipeItem.layerName = pipeName.join('-') +' '+ item.layerName
                    }
                  }
                })
                this.tuliPipeList.push(...item.legend)
             }else if(item.layerName.indexOf('管线') > -1){
               if( item.legend[0] && item.legend[0].imageData){
                item.url = 'data:image/png;base64,' + item.legend[0].imageData
                this.tuliPipeList.push(item)
               }
             }else{
               if( item.legend[0] && item.legend[0].imageData){
                  item.url = 'data:image/png;base64,' + item.legend[0].imageData
                  this.tuliList.push(item)
               }
             }
           })
        }    
      )
    },
    loadData() {
      
      // let BaseLayers = _.filter(MapConfigure.BaseLayers,item => {
      //       return !item.hidden
      //   })
      // this.imgList = BaseLayers
      this.layerData = FeatureLayerOperation.getLayer();
      _.forEach(this.layerData, item => {
        if (item.children) {
          _.forEach(item.children, idObj => {
            if (idObj.isActive) {
              this.defaultCheckLabel.push(idObj.id);
            }
          });
        } else {
          if (item.isActive) {
            this.defaultCheckLabel.push(item.id);
          }
        }
      });
      if(this.imgList.length == 1){
        this.MainLayeValue = this.imgList[0].layerName
      }else{
        this.MainLayeValue = _.filter(this.imgList , item => {
          return item.isActive
        })[0].layerName
      }
      
    },
    //更改底图选择
    tuCengChange(data, checked, indeterminate) {
      if (data.type) {
        this.$emit("layer-click", data.value, checked);
      }
    },
    //map toolbar  点击事件
    onItemClick(action,operVal='m') {
      if (action.value != "框选" ) {
        if(this.boxSelectState){
          this.boxSelectState = false
          this.$refs.boxSelectTable.boxHide();
        }
              
      }else{
        this.$bus.emit("clearGDataLayer"); //清除操作
      }
      if(action.value != "点选"){
        this.$bus.emit("clearGraphics"); //清除绘制过的图层数据信息
      }
      this.actionItemActiveID = action.id;
      this.actionValue = action
       switch (action.id) {
        case "FreehandPolyline":
        case "Extent":
        case "Polyline":
        case "PointSelect":
        case "RangleSelect":
        case "Point":
        case "Circle":
        case "fastMap":
        case "zoomout":
        case "zoomin":
          this.printShow = false
          this.tuLiShow = false; //显示和关闭
          this.layerShow = false; //图例显示=》图层关闭
          break;
        case "Print":
          this.printShow = true
          this.tuLiShow = false; //显示和关闭
          this.layerShow = false; //图例显示=》图层关闭
          break;
        case "Lengend":
          this.$emit("layer-ActionClear", true);
          this.printShow = false
          this.tuLiShow = this.tuLiShow ? false : true; //显示和关闭
          this.layerShow = false; //图例显示=》图层关闭
          break;
        case "maplayer":
          this.printShow = false
          this.$emit("layer-ActionClear", true);
          this.layerShow = this.layerShow ? false : true; //显示和关闭
          this.tuLiShow = false; //图层显示=》图例关闭
          break;
       }
      switch (action.id) {
        case "FreehandPolyline":
          this.lengthUtilListValue = operVal
          this.toolbar.distanceMeasure(operVal);
          break;
        case "Extent":
          this.areaUtilListValue = operVal
          let areaName = _.filter(this.areaUtilList,item => {
            return item.value === this.areaUtilListValue
          })[0].name
          this.toolbar.areaMeasure({area:operVal,areaName:areaName});
           break;
        case "Polyline":
          this.toolbar.Polyline()
          break;
        case "PointSelect":
          this.toolbar.pointSelect()
          break;
        case "RangleSelect":
          this.toolbar.rangleSelect({
            featureQueryCompleted: result => {
              this.boxSelectState = true
              this.$refs.boxSelectTable.boxSelect(result);
            }
          })
          break;
        case "Point":
          this.toolbar.mapPointMove()
          break;
        case "Circle":
          this.toolbar.mapClean()
          break; 
        case "zoomout":
          this.toolbar.zoomout()
          break;
        case "zoomin":
          this.toolbar.zoomin()
          break;
        case "fastMap":
        case "Print":
        case "Lengend":
        case "maplayer":
          break;
      }
    },
    //地图数据搜索
    mapSearchClick() {
      switch (this.searchFactor) {
        case "POI":
          let selValue = _.filter(this.remoteData, objValue => {
            return objValue.OBJECTID === this.topSearchDataValue;
          });
          if (selValue.length > 0) {
            this.$emit("action-mapSearch", selValue[0]);
          }
          break;
        case "coordinate":
          if (
            !_.isNull(this.searchCoordinate.X) && !_.isNull(this.searchCoordinate.Y) &&
             !_.isUndefined(this.searchCoordinate.X) && !_.isUndefined(this.searchCoordinate.Y)
          ) {
            this.$emit(
              "coordinateSearch",
              this.searchCoordinate.X,
              this.searchCoordinate.Y
            );
          } else {
            this.$message({
              type: "warning",
              message: "请输入正确的坐标",
              showClose: true
            });
          }

          break;
      }
    },
    //获得远端POI层
    remoteMethod(serchCondition) {
      SpatialSearch.GetPOI(serchCondition).then(objValue => {
        this.remoteData = objValue.data.Data.Result;
      });
    },
    //透明度滑动方法
    sliderHandle(item) {
      if (item.layerName == this.MainLayeValue) {
        this.$emit("layerSetOpacity", item.layerName, item.transValue / 100);
      }
    },
    //主控图层控制显示与隐藏
    onMainLayerControl(item) {
      this.MainLayeValue = item.layerName;
      if(this.imgList.length == 1){
        return
      }
      this.$emit("layerSetOpacity", item.layerName, item.transValue / 100);
      this.oneLayerShow(item.layerName)
      // switch () {
      //   case "StreetLayer":
      //     // this.$emit("layer-click", "StreetLayer", true);
      //     // this.$emit("layer-click", "SatellLayer", false);
      //     // this.$emit("layer-click", "TerrainLayer", false);
      //      this.oneLayerShow("StreetLayer")
      //     // _.filter(this.imgList, function(objValue) {
      //     //   return objValue.layerName === "StreetLayer";
      //     // })[0].isActive = true;
      //     // _.filter(this.imgList, function(objValue) {
      //     //   return objValue.layerName === "SatellLayer";
      //     // })[0].isActive = false;
      //     break;
      //   case "SatellLayer":
      //     // this.$emit("layer-click", "SatellLayer", true);
      //     // this.$emit("layer-click", "StreetLayer", false);
      //     // this.$emit("layer-click", "TerrainLayer", false);
      //      this.oneLayerShow("SatellLayer")
      //     // _.filter(this.imgList, function(objValue) {
      //     //   return objValue.layerName === "StreetLayer";
      //     // })[0].isActive = false;
      //     // _.filter(this.imgList, function(objValue) {
      //     //   return objValue.layerName === "SatellLayer";
      //     // })[0].isActive = true;
      //     break;
      //   case "TerrainLayer":
      //     // this.$emit("layer-click", "TerrainLayer", true);
      //     // this.$emit("layer-click", "SatellLayer", false);
      //     // this.$emit("layer-click", "StreetLayer", false);
      //     this.oneLayerShow("TerrainLayer")
      //     // item.isActive = !item.isActive;
      //     // this.$emit("layer-click", item.layerName, item.isActive);
      //     break;
      // }
    },
    //动态控制地图只有一个显示
    oneLayerShow(activeLayer){
      _.forEach(this.imgList,item => {
        if(item.layerName == activeLayer){
          item.isActive = true
          this.$emit("layer-click", item.layerName, true);
        }else{
          item.isActive = false
          this.$emit("layer-click", item.layerName, false);
        }
      })
    },
    //控制底图显示方法
    onDynamicLayerControl(item) {
      item.isActive = !item.isActive;
      this.$emit("layer-click", item.layerName, item.isActive);
    },
    //关闭图例、图层、打印弹窗
    closeLayer(closeType) {
      switch (closeType) {
        case "tuceng":
          this.layerShow = false;
          break;
        case "tuli":
          this.tuLiShow = false;
          break;
        case "print":
          this.printShow = false;
          break;
      }
    },
    getCount(fnc) {
      this._MapDataOperation = fnc;
      let _GroupStaticesField = {
        count: {
          statisticType: "count", //定义统计类型 'count'|'sum'|'min'|'max'|'avg'|'stddev'
          onStatisticField: "OBJECTID",
          outStatisticFieldName: "equipment_number"
        },
        length: {
          statisticType: "sum", //定义统计类型 'count'|'sum'|'min'|'max'|'avg'|'stddev'
          onStatisticField: "length",
          outStatisticFieldName: "length"
        }
      };
      _.forEach(this.topTotleMessage, item => {
        this.countMethods(
          item.layerType,
          [_GroupStaticesField[item.math]],
          res => {
            item.number = _.floor(
              res[0][_GroupStaticesField[item.math].outStatisticFieldName]
            );
          }
        );
      });
    },
    countMethods(layerType, _GroupStaticesField, callBack) {
      let StatURLCollection = FeatureLayerOperation.getLayerURLByType(
        layerType
      );
      //统计
      this._MapDataOperation.featureQueryGroup(
        null,
        "1=1",
        _GroupStaticesField,
        null,
        StatURLCollection,
        resultValue => {
          callBack instanceof Function && callBack(resultValue);
          return;
        }
      );
    }
  }
};
</script>
<style lang="stylus" scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
