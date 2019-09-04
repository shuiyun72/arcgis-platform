<template>
  <div class="table-contain-wrapper">
    <el-table
      stripe
      v-loading="loading"
      border
      height="100%"
      class="outDataSerchExcel exportTable"
      :data="tableData"
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <template v-for="column in columnList">
        <el-table-column
          v-if="column.template"
          fit="true"
          :key="column.text"
          :prop="column.field"
          :label="column.text"
          :width="column.width"
          :align="column.align"
          :sortable="column.sortable"
          :formatter="column.formatter"
        >
          <template slot-scope="{row}">
            <span v-html="column.template(row)"></span>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          fit="true"
          :key="column.text"
          :prop="column.field"
          :label="column.text"
          :width="column.width"
          :align="column.align"
          :sortable="column.sortable"
          :formatter="column.formatter"
        ></el-table-column>
      </template>

      <el-table-column
        prop="iRoleID"
        label="功能权限"
        align="center"
        fixed="right"
        width="140px"
        v-if="$options.filters.btnTree('/api/FunPurview/RefreshFunPurview' ,$route.meta.iFunID) && modularDialog"
      >
        <template slot-scope="{row}">
          <span class="my-detail" @click="modularDialogOpen(row)">功能权限</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="paginationShow"
      @size-change="onPageSizeChange"
      @current-change="onPageChange"
      :current-page.sync="pageNumber"
      :page-size="pageSize"
      :page-sizes="[1,50,100, 200]"
      :pager-count="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="dataTotal"
    ></el-pagination>
  </div>
</template>
 
<script>
import * as systemSettingColumn from "@common/consts/systemSetting-table";
export default {
  /*       *全部数据*       *表格高度*     *表头信息对应列表* *表格加载*  *是否展示添加关键点*  */
  props: [
    "tableData",
    "layerListName",
    "loading",
    "dataTotal",
    "pageNumber",
    "pageSize",
    "paginationShow",
    "modularDialog"
  ],
  data() {
    return {};
  },
  computed: {
    //同步当前图层的表头信息
    columnList() {
      return systemSettingColumn[this.layerListName];
    }
  },
  methods: {
    handleCurrentChange(objvalue) {
      this.$emit("currentChange", objvalue);
    },
    // 分页相关
    onPageChange(objvalue) {
      this.$emit("onPageChange", objvalue);
    },
    //当前页数据变化
    onPageSizeChange(objvalue) {
      this.$emit("onPageSizeChange",objvalue);
    },
    //权限
    modularDialogOpen(row) {
      this.$emit("modularDialogOpen", row);
    }
  }
};
</script>