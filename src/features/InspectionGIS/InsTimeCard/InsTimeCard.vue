<template>
  <div class="table_style W700" :class="{flexible:flexible}">
    <TableFormTitle 
    :titleName = "'考勤管理'" 
    :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="46px" label-position="right" size="small" gutter="20px">
      <el-row>
        <el-col :span="6" :xs="10" :sm="10" :lg="6">
          <el-form-item label="部门：">
            <el-select v-model="attRListValue" size="mini" >
              <el-option
                v-for="item in attRList"
                :key="item.iDeptID"
                :label="item.cDepName"
                :value="item.iDeptID"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="14" :sm="{span:12,offset:1}" :lg="8"> 
          <el-form-item  label="时间：" style="padding-left:10px" >
            <el-date-picker
            size="mini"
            unlink-panels
            v-model="dataValue"
            type="daterange"
            range-separator="- -"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :clearable = false
            >
          </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" :xs="24" :sm="24" :lg="{span:8,offset:1}">
          <el-row type="flex" justify="end" style="padding:0">
            <el-button class="my-add" size="mini" @click="GetData" v-if="$options.filters.btnTree('/api/AttendanceRecord/Get' ,$route.name)">查询</el-button>
            <el-button class="my-reset" size="mini" @click="reset" hidden-md-and-down v-if="$options.filters.btnTree('/api/AttendanceRecord/Get' ,$route.name)">重置</el-button>
            <el-button class="my-export" size="mini" @click="exportExcel" v-if="$options.filters.btnTree('export' ,$route.name)">导出</el-button>
            </el-row>
        </el-col>
      </el-row>
    </el-form>
    <InsTable
      :layerListName = "'Ins_TimeCard_Columns'"
      :tableHeight = "'calc(100vh - 198px)'"
      :columnListData = "paginatedTableData"
      :loading.sync ="loading"
      :pageSize.sync = "currentPageSize"
      :pageNumber.sync = "currentPageNumber"
      :dataTotal = "squareQueryTotal"
      @GetData = "GetData"
    ></InsTable>
  </div>
</template>
<script>
import _ from "lodash";
//import MapDataOperation from "@services/ArcMap/MapDataOperation";
import * as EasyTable from "@common/consts/inseasyui-table";
import { ExportExcel } from "@util";
import AttendanceRecord from "@api/Inspection/AttendanceRecord";
import DepartmentUserCycle from "@api/Inspection/DepartmentUserCycle";
import TableFormTitle from "@common/components/TableFormTitle";
import InsTable from "@features/InspectionGIS/components/InsTable"
export default {
  components:{
    TableFormTitle,
    InsTable
  },
  data() {
    return {
      flexible:false,//是否收缩左侧表格
      loading:true,
      attRList:[],  //属性列表
      attRListValue:"", //属性选中值
      columnList:EasyTable['Ins_TimeCard_Columns'],//当前图层的表头信息
      dataValue:  ["2001-01-01","2019-01-01"],//日期选择值
      squareQueryRawTableData: [],//搜索结果数据
      // 分页相关
      currentPageNumber: 1,
      currentPageSize: 50,
      paginatedTableData:[],
      squareQueryTotal:50,// 表格数据总数
    };
  },
  computed: {
    // 分页后的当前页数据
    // paginatedTableData() {
    //   return _.chunk(
    //     _.cloneDeep(this.squareQueryRawTableData),
    //     this.currentPageSize
    //   )[this.currentPageNumber - 1];
    // }
  },
  created(){
     this.createInit()
  },
  mounted() {
    this.GetData()
   
  },

  methods: {
    // 查询操作
    GetData(pageNumber,pageSize) {
      this.loading = true
      if (typeof pageNumber == "number") {
        //如果传值更新父页面的表格页码为1，切换数据调用data时使用，
        //因为getdata初始查询页码为1
        this.currentPageNumber = pageNumber;
      }
      if(typeof pageSize == "number"){
        this.currentPageSize = pageSize;
      }
      let deptId = this.attRListValue
      //查询数据
      AttendanceRecord.AttendanceRecord(this.dataValue[0],this.dataValue[1], this.currentPageSize,
      this.currentPageNumber,deptId).then(res=>{  
        this.loading = false
        this.paginatedTableData = res.data.Data.Result
        this.squareQueryTotal =  res.data.Data.TotalRows
      })
    },
    getDateTime(date){
      var newDate = new Date(date)
      return newDate.getFullYear()+"-"+(newDate.getMonth() + 1)+"-"+newDate.getDate()

    },
    createInit(){
      DepartmentUserCycle.DeptData().then( res =>{   //查询部门
        this.attRList = res.data.Data.Result
        this.attRList.unshift({
          cDepName:'全部',
          iDeptID:''
        })
      })
      this.dataValue[1] = this.getDateTime(new Date())
    },
    onChangeDeptId(val){

    },
    pickerTime(val){   //更改时间段
      this.GetData()
    },
    reset(){
      this.dataValue = ["2001-01-01",this.getDateTime(new Date())]
      this.attRListValue =  "" 
      this.GetData()
    },
    exportExcel() {
      ExportExcel('div .exportTable','考勤管理')
    }
  },
  
};
</script>

