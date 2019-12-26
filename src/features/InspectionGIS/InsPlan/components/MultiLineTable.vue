<template>
  <!-- <el-scrollbar class="table-scroll"> -->
    <el-row class="table-flex-wraper">
      <div class="table-contain-wrapper  complexTable">
        <el-table
          v-loading="loading"
          class="MaintainGIS"
          :data="columnListData"
          stripe
          border
          :height="tableHeight"
          @row-dblclick = "tableDbClick"
          @selection-change="handleSelectionChange"
          :span-method="objectSpanMethod"
        >
          <el-table-column width="22" fixed>
            <template slot-scope="scope">
              <div v-if="(scope.$index+1)%2 == 0" class="multi-line-row">
                任务：设备量
                <span
                  class="blue-span color-span"
                >{{columnListData[(scope.$index)-1].allEquCount || '暂无'}}</span>
                巡检区域名称：
                <span
                  class="blue-span color-span"
                >{{columnListData[(scope.$index)-1].PlanAreaName ? columnListData[(scope.$index)-1].PlanAreaName : columnListData[(scope.$index)-1].PlanLineName}}</span>
                备注：
                <span>{{columnListData[(scope.$index)-1].Descript}}</span>
              </div>
              <div v-if="(scope.$index+1)%2 != 0">{{((scope.$index)+2)/2}}</div>
            </template>
          </el-table-column>
          <el-table-column fixed type="selection" width="30" align="center"></el-table-column>
          <el-table-column fixed align="center">
            <template slot-scope="scope">
              <span
                :style="{'background-color':eventStatusFliter(columnListData[(scope.$index)].AssignState)}"
                plain
                size="mini"
                class="main-table-btn"
              >{{columnListData[(scope.$index)].AssignState | assignStage}}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="column in columnList"
            :type="column.type"
            :fixed="column.fixed"
            :key="column.field"
            :prop="column.field"
            :label="column.text"
            :width="column.width"
            :align="column.align"
          ></el-table-column>
        </el-table>
      </div>
      <el-pagination
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
import * as EasyTable from "@common/consts/inseasyui-table";
import EvenType from "@api/Inspection/EvenType";
export default {
  /*       *全部数据*       *表格高度*     *表头信息对应列表* *表格加载*  */
  props: [
    "columnListData",
    "tableHeight",
    "loading",
    "dataTotal",
    "pageNumber",
    "pageSize",
    "tableIndex"
  ],
  data() {
    return {
      columnList: EasyTable.Ins_PatrolTask_Columns,
      colorList: ["#2ca179", "#c67a3c"]
    };
  },
  filters: {
    assignStage(val) {
      switch (val) {
        case 1:
          return "已派发";
          break;
        default:
          return "未派发";
          break;
      }
    }
  },
  methods: {
    // tableClick(row,index,a){
    //   if(!_.keys(row).length){
    //     row = null
    //   }
    //   this.$emit("tableClick",row);
    // },
    //双击
    tableDbClick(row){
      console.log(row.GeoText)
      if(!row.GeoText){
        let index = _.indexOf(this.columnListData,row)
        row = this.columnListData[index -1]
      }
      this.$emit("tableDbClick", row);
    },
    eventStatusFliter(el) {
      if (el) {
        return this.colorList[0];
      } else {
        return this.colorList[1];
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //合并表格
      if (columnIndex <= 2) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 1,
            colspan: this.columnList.length
          };
        }
      }
    },
    //选择点选框值
    handleSelectionChange(val) {
      console.log(val);
      this.$emit("changeAttr", "tableIndex", val);
    },
    handleCurrentChange(objvalue) {
      this.$emit("currentChange", objvalue);
    },
    // 分页相关
    onPageChange(objvalue) {
      this.$emit("GetData", objvalue, this.pageSize);
    },
    //当前页数据变化
    onPageSizeChange(objvalue) {
      this.$emit("GetData", this.pageNumber, objvalue);
    },
    //select
    handleSelectionChange(val) {
      this.$emit("update:tableIndex", val);
    }
  }
};
</script>

<style lang="stylus">
.el-table__row.el-table__row--striped .cell {
  visibility: initial;
}

.multi-line-row {
   text-align: left;
    padding-left: 20px;
  .color-span {
    padding: 2px 5px;
    color: #fff;
    border-radius: 2px;
    margin: 0 20px 0 5px;
  }

  .orange-span {
    background: #FF6738;
  }

  .blue-span {
    background: #3289cc;
  }
}

.main-table-btn {
  display: inline-block;
  padding: 0px 6px;
  line-height: 24px;
  border-radius: 2px;
  color: #fff;
}
</style>