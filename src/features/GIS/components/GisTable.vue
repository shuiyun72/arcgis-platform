<template>
  <el-row class="table-flex-wraper">
    <div class="table-contain-wrapper">
    <el-table
      stripe
      border
      v-loading="loading"
      :data="paginatedTableData"
      highlight-current-row
      :height="'100%'"
      class="outDataSerchExcel exportTable"
      @row-dblclick="onRowClick"
      @current-change ="currentChange"
    >
      <el-table-column
        label="操作"
        align="center"
        width="130"
        v-if="this.doubleAnalysisState"
        >
          <template slot-scope="scope">
            <span
              size="mini"
              class="my-detail"
              @click="doubleAnalysis(scope.row)">二次关阀分析</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
        label="操作"
        align="center"
        width="130"
        v-if="this.$route.name === 'BufferSearch'"
        >
          <template slot-scope="scope">
            <span
              size="mini"
              class="my-detail"
              @click="doubleAnalysis(scope.row)">二次分析</span>
          </template>
        </el-table-column> -->
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
    </div>
    <el-pagination
      :current-page.sync="pageNumber"
      :pager-count="5"
      :page-sizes="[10,50,100, 200]"
      :page-size.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="squareQueryTotal"
    ></el-pagination>
  </el-row>
</template>
<script>
import _ from "lodash";
import * as GisTableColumn from "@common/consts/GisConst/GisTableColumn";
import {
  MapConfigure
} from "@common/consts/GisConst/MapConfigure";
export default {
  /*       *全部数据*        *当前图层*        *表格高度*     *表头信息对应列表*  *表格加载*  */
  props: ["columnListData", "tableHeight", "layerListName", "loading","doubleAnalysisState"],
  data() {
    return {
      topTotleMessage: [],
      pageSize: 50,
      pageNumber: 1,
      allClumnList:null,
    };
  },
  watch:{
    doubleAnalysisState(){
      console.log('doubleAnalysisState' , this.doubleAnalysisState)
    }
  },
  created(){
    console.log('doubleAnalysisState', this.doubleAnalysisState)
  },
  computed:{
      //同步当前图层的表头信息
    columnList() {
      if (this.layerListName == "all") {
        return this.allClumnList || this.allClumn();
      }
      return GisTableColumn[this.layerListName];
    },
      // 表格数据总数
    squareQueryTotal() {
      return this.columnListData.length;
    },
    // 分页后的当前页数据
    paginatedTableData() {
      return _.chunk(_.cloneDeep(this.columnListData), this.pageSize)[
        this.pageNumber - 1
      ];
    }
  },
  methods: {
    currentChange(val){
      this.$emit('currentChange',val)
    },
      //整合表头信息
    allClumn() {
      let listViewColumn = [];
      _.forEach(MapConfigure.FeatureLayerGroup, group => {
        _.forEach(group.featureLayers, item => {
          if (_.indexOf(listViewColumn, item.listViewColumn < 0)) {
            listViewColumn.push(item.listViewColumn);
          }
        });
      });
      let len;
      let okColumn = _.cloneDeep(GisTableColumn[listViewColumn[0]]);
      let allColumn = _.cloneDeep(GisTableColumn[listViewColumn[0]]);
      _.forEach(listViewColumn, column => {
        _.forEach(allColumn, (item, index) => {
          len = _.filter(GisTableColumn[column], easy => {
            return easy.field == item.field;
          })[0];
          if (!len) {
            okColumn.splice(index, 1);
          }
        });
      });
      this.allClumnList = okColumn
      this.allClumnList.unshift({
        field:'allType',
        text:'类型'
      })      
      return okColumn;
    },
    onRowClick(row, column, event){
      this.$emit("TableRowClick",row, column, event)
    },
    //二次关阀分析
    doubleAnalysis(row){
      this.$emit("doubleAnalysis",row)
    }
  }
};
</script>

