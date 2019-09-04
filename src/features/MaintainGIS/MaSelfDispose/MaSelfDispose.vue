<template>
  <div class="MaintainGIS table_style" :class="{flexible:flexible}">
    <TableFormTitle 
    :titleName = "titleName" 
    :flexible.sync="flexible"></TableFormTitle>
      <el-form label-width="83px" label-position="right" size="small" gutter="20px">
        <el-row>
          <el-col :span="8" :xs="12" :sm="12" :lg="8">
            <el-form-item label="个人处理：" label-width="70px">
              <el-select v-model="titleName" @change="onAttRChange" size="mini">
                <el-option
                  v-for="(item,index) in DisposePages"
                  :label="item.name"
                  :value="item.name"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3" :offset="1">
            <el-button
              v-if="this.titleName != '发起事件'"
              size="mini"
              @click="isTitleDis?disposeMsgBtn():queryMsgBtn()"
              :class="isTitleDis?'my-process':'my-search'"
            >
              {{isTitleDis?'处理':'查询'}}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
      <!-- 公用table -->
      <main-tain-table
        v-if="titleName == '待办处理'||titleName == '已办工单'"
        :entrustData="entrustData"
        :columnList="columnList"
        @tableClick="tableClick"
        @tableDbClick="tableDbClick"
      ></main-tain-table>
      <initiate v-if="titleName == '发起事件'"></initiate>
  </div>
</template>
<script>
import _ from "lodash";
import axios from "axios";
import * as disposeData from "../components/config.js";
import * as TableData from "@common/consts/maintain-table.js";
//组件
import MainTainTable from "../components/MainTainTable";
import Initiate from "./component/Initiate";
import TableFormTitle from "@common/components/TableFormTitle";
export default {
  components: {
    Initiate,
    MainTainTable,
    TableFormTitle
  },
  data() {
    return {
      flexible:false,//是否收缩左侧表格
      titleName: "待办处理",
      currentRow: undefined,
      DisposePages: [
        { name: "待办处理", urlTo: "Entrust" },
        { name: "发起事件", urlTo: "Initiate" },
        { name: "已办工单", urlTo: "HaveDone" }
      ] //图层下拉框数据
    };
  },
  created() {
    this.init();
  },
  computed: {
    isTitleDis() {
      //是否为代办处理
      if (this.titleName == "代办处理") {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    init() {
      //初始化
      this.columnList = TableData.Mai_WaitDoneBills_Columns;
      this.entrustData = {
        num: 1,
        page: 50,
        sum: 186,
        Result: disposeData.DataDispose
      };
    },
    //个人处理切换页面
    onAttRChange(el) {
      this.currentRow = undefined;
      this.init();
    },
    //单击行
    tableClick(row) {
      this.currentRow = row;
    },
    //双击行
    tableDbClick(row) {
      this.currentRow = row;
    },
    //处理
    disposeMsgBtn() {
      if (this.currentRow) {
        console.log("处理");
      } else {
        this.$message({
          type: "error",
          message: "请选择要处理的工单"
        });
      }
    },
    //查看
    queryMsgBtn() {
      if (this.currentRow) {
        console.log("查看");
      } else {
        this.$message({
          type: "error",
          message: "请选择要查看的工单"
        });
      }
    }
  }
};
</script>