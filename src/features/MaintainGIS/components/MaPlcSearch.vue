<template>
  <div>
    <el-row>
      <el-col :span="8" :xs="12" :sm="12" :lg="8">
        <el-form-item label="事件来源：">
          <el-select v-model="eventSourceSelect" placeholder="请选择" size="mini"  @change="changeEvevtType">
            <el-option
              v-for="item in eventSource"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8" :xs="12" :sm="12" :lg="8">
        <el-form-item label="事件类型：">
          <el-select v-model="evevtTypeSelect" placeholder="请选择" size="mini" @change="changeEvevtType">
            <el-option
              v-for="item in evevtType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8" :xs="12" :sm="12" :lg="8">
        <el-form-item label="上报部门：">
          <el-select v-model="deptDataSelect" placeholder="请选择" size="mini"  @change="changeEvevtType">
            <el-option
              v-for="item in deptData"
              :key="item.value"
              :label="item.cDepName"
              :value="item.iDeptID"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between">
      <el-col :span="8" :xs="12" :sm="12" :lg="8">
        <el-form-item label="事件查找：">
          <el-input placeholder="类型、上报人、编号" v-model="eventContentName" size="mini"></el-input>
        </el-form-item>
      </el-col>

        <div>
          <el-button size="mini" class="my-search" @click="SubmitSearchBTn">查询</el-button>
          <el-button size="mini" class="my-reset hidden-md-and-down" @click="resetSearchBTn">重置</el-button>
          <el-button size="mini" class="my-del" @click="deleteSearchBTn">作废 </el-button>
          <el-button size="mini" class="my-export" @click="ExportSearchBTn">导出</el-button>
        </div>
 
    </el-row>
  </div>
</template>
<script>
import _ from "lodash";
import MaDepartmentUserCycle from "@api/Inspection/DepartmentUserCycle";

export default {
  created() {
    //console.log(this.$route.path)
    this.init()
  },
  components: {
    
  },
 
  data() {
    return {
      eventSource: [   //事件来源Data
        {
          value: "",
          label: "全部"
        },
        {
          value: "source1",
          label: "接电上报"
        },
        {
          value: "source2",
          label: "热线系统"
        },
        {
          value: "source3",
          label: "巡检上报"
        },
        {
          value: "source4",
          label: "临时工作"
        },
        {
          value: "source5",
          label: "日常工作处理"
        },
        {
          value: "source6",
          label: "调度事件"
        }
      ],
      deptData: [     //部门Data
        { value: "", label: "全部" },
        { value: "2", label: "困难用水" },
        { value: "3", label: "表井问题" }
      ], 
      evevtType: [     //事件类型data
        { value: "", label: "全部" },
        { value: "2", label: "困难用水" },
        { value: "3", label: "表井问题" }
      ],
      eventSourceSelect: "", //事件来源    
      deptDataSelect:"",    //上报部门  
      evevtTypeSelect: "", //事件类型    
      eventContentName:"",   //事件查找内容
    };
  },
  computed: {
    isDeleteBtn(){
      if(this.$route.path == "/MaintainGIS/MaBillsDelete"){
        return true
      }else{
        return false
      }
    }
  },
  mounted(){
     this.init()
  },
  methods: {
    //初始化
    init(){
      this.axiosDeptData()
     
    },
    //查询部门数据
    axiosDeptData() {  
      // console.log("查询部门数据") 
      MaDepartmentUserCycle.DeptData().then( res => {
        this.deptData = res.data.Data.Result;
        // console.log(res.data.Data)
        //  console.log("查询部门数据") 
      });
    },
    //改变事件来源/上报部门/事件类型
    changeEvevtType(){
      this.maPlcSearch();
    },
    //点击查询
    SubmitSearchBTn(){
      this.maPlcSearch(true)
    },
    //点击重置
    resetSearchBTn(){
      this.eventSourceSelect = "" ;   //事件来源
      this.deptDataSelect = "" ;    //上报部门
      this.evevtTypeSelect = "" ;   //事件类型
      this.eventContentName = "" ; 
      this.$emit("resetSearchBTn");
    },
    //点击导出
    ExportSearchBTn(){
      this.$bus.emit("ExportSearchBTn");
    },
    //传递数据
    /*
     * true 发送请求 fasle 传递数据不发送请求 isSubmit
    */
    maPlcSearch(isSubmit){    
      isSubmit = isSubmit || false;
      this.$emit("maPlcSearch",
        this.eventSourceSelect,   //事件来源
        this.deptDataSelect,      //上报部门
        this.evevtTypeSelect,    //事件类型
        this.eventContentName,     //事件查找
        isSubmit   //是否发送请求
      )
    },
    //工单作废
    deleteSearchBTn(){
      this.$emit("deleteSearchBTn");
    }
  },
  beforeDestroy(){
   
  }
};
</script>
<style lang="stylus"></style>