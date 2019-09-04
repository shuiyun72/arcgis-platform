<template>
  <el-dialog
    title="框选查询"
    ref="dialog__wrapper"
    v-dialogDrag
    width="800px"
    :modal="false"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :visible.sync="squareQueryDialogVisible"
    center
    class="myDialog PipeQueryDialog"
  >
    <div class="square_query_dialog_content">
      <div class="left_tree_wrapper">
        <el-scrollbar>
        <el-collapse accordion v-model="FeatureLayerCollapse" v-if="groupLength > 1">
          <el-collapse-item v-for=" group in featureGroup" :key="group.groupName" :name="group.groupName">
            <template slot="title" class="left-tree-title">
             <i class="el-icon-caret-bottom el-icon--right"></i> {{group.groupCName}}
            </template>
            <div 
              class="left-tree-lable"
              :class="{active: searchType == item.labelValue}"
              v-for=" item in group.featureLayers" 
              :key="item.labelValue"
              @click="onTreeLabelClick(item)"
              >{{item.label}}({{item.num}})</div>
          </el-collapse-item>
        </el-collapse>
        <template v-else >
          <div class="left-tree-title">{{featureLayersOne.groupCName}}</div>
          <div 
            class="left-tree-lable"
            :class="{active: searchType == item.labelValue}"
            v-for=" item in featureLayersOne.featureLayers" 
            :key="item.labelValue"
            @click="onTreeLabelClick(item)"
          >{{item.label}}({{item.num}})</div>
        </template>
        </el-scrollbar>
        <!-- <el-tree
          ref="boxTree"
          class="district_tree"
          default-expand-all
          highlight-current
          node-key="labelValue"
          :data="treeData"
          :props="{
              children: 'children',
              label: 'label',
              labelValue:'labelValue',
              iconName:'iconName',
              layerType:'layerType'
            }"
          @node-click="onTreeNodeClick"
        ></el-tree> -->
      </div>
      <div class="district_table_container">
        <el-table
        border
        stripe
          :data="paginatedTableData"
          highlight-current-row
          height="calc(50vh + 50px)"
          class="district_table"
          @cell-dblclick="onTableRowClick"
        >
          <el-table-column
            v-for="column in columnList"
            :key="column.field"
            :prop="column.field"
            :width="column.width"
            :fixed="column.fixed"
            :label="column.text"
            align="center"
          ></el-table-column>
        </el-table>
        <el-pagination
          :current-page.sync="currentPageNumber"
          :page-sizes="[100, 200, 300, 400]"
          :page-size.sync="currentPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="squareQueryTotal"
        ></el-pagination>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import _ from "lodash";
import { MapConfigure, LayerType } from "@common/consts/GisConst/MapConfigure";
import * as listViewColumn from "@common/consts/GisConst/GisTableColumn";
export default {
  props: [
    "searchType"
  ],
  data() {
    return {
      squareQueryDialogVisible: false, //弹窗显示
      featureLayerData: [], //查询返回的数据集合
      squareQueryRawTableData: [], //框选的数据当前layer全部集合（为分页前数据）
      treeData: [], // 弹出框左侧Tree的数据
      heightLightValue: false, //画布是否正在展示高亮的图标，正在展示则掉用清空画布
      // 分页相关
      currentPageNumber: 1,
      currentPageSize: 50,
      featureGroup:[],//多组官网数据时采用该数组作为tree的列表
      featureLayersOne:[],//单组官网数据时采用该数组作为tree的列表
      groupLength:1,//记录官网数据的组数
      FeatureLayerCollapse:'',//记多组官网是展开的面板标志
    };
  },
  computed: {
    // 表格数据总数
    squareQueryTotal() {
      return this.squareQueryRawTableData.length;
    },
    // 分页后的当前页数据
    paginatedTableData() {
      return _.chunk(
        _.cloneDeep(this.squareQueryRawTableData),
        this.currentPageSize
      )[this.currentPageNumber - 1];
    }
  },
  methods: {
    //获取treenode的数目
    getTreeNodeNnm(node,lable){
      let list = node.data.children
      let num = _.filter(list,item => {
        return item.lable = lable
      })
      if(num.length){
        return num[0].number
      }
      
    },
    handleClose(done) {
      this.$bus.emit("clearGDataLayer"); //清除操作
      this.$bus.emit("clearGraphics"); //清除操作
      done();
    },
    //框选表格双击定位
    onTableRowClick(row, column, event) {
      this.$bus.emit("setMapLocation", row.OBJECTID, this.searchType);
    },
    // 刷新树数据
    refreshTreeData() {
      // let TreeResultData = [
      //   {
      //     labelValue: 'all-data',
      //     label: "设施查询结果",
      //     children: []
      //   }
      // ];
      let featureGroup = {}
      _.forEach( MapConfigure.FeatureLayerGroup, group => {
        featureGroup[group.groupName] = {
          groupName:group.groupName,
          groupCName:group.groupCName,
          featureLayers:[]
        }
      })
      //将集合数据插入数据Tree集合中去
      _.forEach(this.featureLayerData, ObjValue => {
        if (ObjValue.layerData.length) {
          // TreeResultData[0].children.push({
          //   label: `${ObjValue.layerCName}(${ObjValue.layerData.length})`,
          //   labelValue: ObjValue.layerName,
          //   iconName: ObjValue.iconName,
          //   layerType: ObjValue.layerType
          // });
          featureGroup[ObjValue.groupName].featureLayers.push({
            label: ObjValue.layerCName,
            num:ObjValue.layerData.length,
            labelValue: ObjValue.layerName,
            iconName: ObjValue.iconName,
            layerType: ObjValue.layerType
          });
        }
      });
      

      this.featureGroup = featureGroup 
      let keys = Object.keys(featureGroup)
      this.groupLength = keys.length
      if( this.groupLength == 1){
        this.featureLayersOne = featureGroup[keys[0]]
      }
      //this.treeData = TreeResultData;
    },
    // 初始化表格列的定义
    refreshColumnList() {
      let currentData = _.filter(this.featureLayerData, layerItem => {
        return layerItem.layerName === this.searchType;
      })[0]
      this.FeatureLayerCollapse = currentData.groupName
      this.columnList = listViewColumn[currentData.listViewColumn];
    },
    boxHide() {
      if (this.featureLayerData) {
        this.$bus.emit("clearGDataLayer"); //清除操作
        this.$bus.emit("clearGraphics"); //清除操作
      }
      if(this.squareQueryDialogVisible){
        this.squareQueryDialogVisible = false;
        this.featureLayerData = [];
        this.squareQueryRawTableData = [];
      }
    },
    boxSelect(result) {
      // this.$refs.boxTree.setCheckedNodes([this.treeData.children[0]])
      this.squareQueryDialogVisible = true;
      this.featureLayerData = result;
      //判断结果集是否有数据
      if (result.length > 0) {
        //默认选择管线
        this.searchType = result[0].layerName; //"PipeLineLayer";
        let squareQueryRawTableData = _.filter(result, ObjValue => {
          return ObjValue.layerName === this.searchType;
        })[0].layerData; //result[0].layerData;
        this.squareQueryRawTableData = _.map(
          squareQueryRawTableData,
          evtValue => {
            return evtValue.attributes;
          }
        );      
        this.heightLightValue = true;  
        this.$bus.emit("pipeLineView", result[0].layerData); //线高亮
        this.refreshColumnList();
        this.refreshTreeData();
      }
    },
    //弹出框左侧菜单点击事件
    onTreeLabelClick(item){
      if (this.searchType !== item.labelValue) {
        this.searchType = item.labelValue;
        this.$emit("updated:searchType", this.searchType);
        this.refreshColumnList();
        //更新数据集
        let squareQueryRawTableData = _.filter(
          this.featureLayerData,
          ObjValue => {
            return ObjValue.layerName === this.searchType;
          }
        )[0].layerData;

        if (this.heightLightValue) {
          this.$bus.emit("clearGDataLayer"); //清除操作
          this.$bus.emit("clearGraphics"); //清除操作
          this.heightLightValue = false;
        }
        
        this.squareQueryRawTableData = _.map(
          squareQueryRawTableData,
          evtValue => {
            return evtValue.attributes;
          }
        );
        squareQueryRawTableData = _.map(squareQueryRawTableData, evtValue => {
          evtValue.objvalue = evtValue.geometry;
          return evtValue;
        });
        if (squareQueryRawTableData.length > 0) {
          this.heightLight(
            item.iconName,
            item.layerType,
            squareQueryRawTableData
          );
        }
      }
    },
    onTreeNodeClick(def, node, ref) {
      if (node.isLeaf) {
        this.searchType = node.data.labelValue;
        this.$emit("updated:searchType", this.searchType);
        this.refreshColumnList();
        //更新数据集
        let squareQueryRawTableData = _.filter(
          this.featureLayerData,
          ObjValue => {
            return ObjValue.layerName === this.searchType;
          }
        )[0].layerData;

        if (this.heightLightValue) {
          this.$bus.emit("clearGDataLayer"); //清除操作
          this.$bus.emit("clearGraphics"); //清除操作
          this.heightLightValue = false;
        }
        
        this.squareQueryRawTableData = _.map(
          squareQueryRawTableData,
          evtValue => {
            return evtValue.attributes;
          }
        );
        squareQueryRawTableData = _.map(squareQueryRawTableData, evtValue => {
          evtValue.objvalue = evtValue.geometry;
          return evtValue;
        });
        if (squareQueryRawTableData.length > 0) {
          this.heightLight(
            def.iconName,
            def.layerType,
            squareQueryRawTableData
          );
        }
      }
    },
    //高亮选中区域
    heightLight(iconName, layerType, resultValue) {
      this.heightLightValue = true;
      if (resultValue <= 0) {
        return;
      }
      if (layerType === LayerType.PipeTypeNO) {
        //线高亮
        this.$bus.emit("pipeLineView", resultValue); //线高亮
      } else {
        //其他设施高亮
        this.$bus.emit("facilitiesView", resultValue, iconName);
      }
    }
  }
};
</script>
