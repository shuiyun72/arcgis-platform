<template>
  <!-- <el-scrollbar class="table-scroll"> -->
  <el-row class="table-flex-wraper">
    <div class="table-contain-wrapper">
      <el-table
        stripe
        border
        ref="InsTable"
        class="exportTable"
        v-loading="loading"
        :data="columnListData"
        highlight-current-row
        :height="'100%'"
        :span-method="tableSpanMethod"
        @row-dblclick="tableDbClick"
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentChange"
        @row-click="tableClick"
      >
        <!-- 巡检计划部分 -->
        <!-- <el-table-column 
        v-if=" layeName == 'InsEven' ||layeName == 'RouteManagement' ||layeName == 'RegionalManagement'  " 
        type="index" 
        width="30" 
        fixed 
        align="center"
        ></el-table-column>-->
        <!-- 区域管理选择点列 -->
        <el-table-column
          v-if=" addShow && (layeName == 'RouteManagement' || layeName == 'RegionalManagement' )"
          label="添加关键点"
          width="120"
          fixed
          align="center"
        >
          <template slot-scope="scope">
            <el-button size="mini" class="my-add-point" @click="addPoint(scope)">
              <i class="iconfont icon-tianjiaguanjiandian"></i>
              <span class="text">添加关键点</span>
            </el-button>
          </template>
        </el-table-column>
        <!-- 循环部分 -->
        <el-table-column
          v-for="column in columnList"
          :key="column.field"
          :type="column.type"
          :prop="column.field"
          :width="column.width"
          :fixed="column.fixed"
          :label="column.text"
          :align="column.align"
          :sortable="column.sortable"
        ></el-table-column>
        <!-- 事件管理部分 -->
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          width="120"
          v-if="layeName == 'InsEven' && ($options.filters.btnTree('/api/EventManage/Delete' ,$route.meta.iFunID) || $options.filters.btnTree('detail' ,$route.meta.iFunID))"
        >
          <template slot-scope="scope" >
            <el-button size="mini" class="my-table-detail" @click="detailBtn(scope.row)" v-if="$options.filters.btnTree('detail' ,$route.meta.iFunID) ">
              <i class="iconfont icon-xiangqing-copy"></i>
            </el-button>
            <el-button size="mini" class="my-table-del" @click="deltableItem(scope.row)" v-if="$options.filters.btnTree('/api/EventManage/Delete' ,$route.meta.iFunID) ">
              <i class="iconfont icon-shanchu"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      v-show="!(layeName == 'InsAnalysis' || layeName == 'EvenTrend')"
      @size-change="onPageSizeChange"
      @current-change="onPageChange"
      :current-page.sync="pageNumber"
      :page-sizes="[1,50,100, 200]"
      :page-size="pageSize"
      :pager-count="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="dataTotal"
    ></el-pagination>
  </el-row>
  <!-- </el-scrollbar> -->
</template>
<script>
import _ from "lodash";
import * as InsTableColumn from "@common/consts/inseasyui-table";
import { MapConfigure } from "@common/consts/GisConst/MapConfigure";
export default {
  /*       *全部数据*       *表格高度*     *表头信息对应列表* *表格加载*  *是否展示添加关键点*  */
  props: [
    "columnListData",
    "tableHeight",
    "layerListName",
    "loading",
    "dataTotal",
    "pageNumber",
    "pageSize",
    "layeName",
    "tableIndex",
    "addShow"
  ],
  data() {
    return {};
  },
  computed: {
    //同步当前图层的表头信息
    columnList() {
      if (this.layeName == "EvenTrend") {
        return this.layerListName;
      }
      return InsTableColumn[this.layerListName];
    }
  },
  methods: {
    handleCurrentChange(objvalue) {
      this.$emit("currentChange", objvalue);
    },
    // 分页相关
    onPageChange(objvalue) {
      this.$emit("GetData", objvalue, this.pageSize);
    },
    //当前页数据变化
    onPageSizeChange(objvalue) {
      this.$emit("GetData", 1, objvalue);
    },
    onRowClick(row, column, event) {
      this.$emit("TableRowClick", row, column, event);
    },
    //select
    handleSelectionChange(val) {
      this.$emit("update:tableIndex", val);
    },
    //行内删除
    deltableItem(row) {
      this.$emit("deltableItem", row);
    },
    //双击
    tableDbClick(row) {
      this.$emit("tableDbClick", row);
    },

    //单击
    tableClick(row) {
      this.$emit("tableClick", row);
    },
    addPoint(row) {
      this.$emit("addPoint", row);
    },
    setCurrentRow(row) {
      this.$refs.InsTable.setCurrentRow(row);
    },
    detailBtn(row) {
      this.$emit("detailBtn", row);
    },
    //事件趋势合并单元格
    tableSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.layeName == "EvenTrend") {
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      }
    }
  }
};
</script>

