<template>
  <div>
    <el-row border>
      <el-table
        stripe
        border
        @cell-dblclick ="bottomTableDbClick"
        @current-change="handleCurrentChange"
        @row-click="tableClick" 
        :data="squareQueryRawTableData"
        highlight-current-row
        :height="layerHeight"
        >
        <el-table-column
          v-for="column in columnList"
          :key="column.field"
          :prop="column.field"
          :width="column.width"
          :fixed="column.fixed"
          :label="column.text"
          :align="column.align"
          :sortable="column.sortable"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center" v-if="editShow || delShow">
          <template slot-scope="scope" >
            <el-button
              v-if="editShow"
              @click="editPoint(scope.row)"
              size="mini"
              class="my-table-edit"
            ><i class="iconfont icon-bianji"></i></el-button>
            <el-button
              v-if="delShow"
              @click="onDelectClick(scope.row)"
              size="mini"
              class="my-table-del"
            ><i class="iconfont icon-shanchu"></i></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page.sync="currentPageNumber"
        :page-sizes="[10,20,30]"
        :page-size="currentPageSize"
        :pager-count="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="squareQueryTotal"
      ></el-pagination>
    </el-row>
    <!-- 编辑行信息 -->
    <el-dialog
      v-dialogDrag
      :title="layerTitle"
      :visible.sync="editButtomVisible"
      width="400"
      :before-close="handleClose"
      customClass="el_add_dialog"
      class="myDialog insPlanDialog"
      :modal-append-to-body="false"
      :modal="false"
      :close-on-click-modal="false"
      >
      <el-form>
        <el-form-item label="名称：" label-width="56px">
          <el-input size="mini" :placeholder="请输入标题" v-model="impAreaName"></el-input>
        </el-form-item>          
      </el-form>
       <div slot="footer" class="dialog-footer">
        <el-button class="my-dialog-cancel" size="mini" @click="handleClose">取 消</el-button>
        <el-button class="my-dialog-submit" size="mini" @click="getPointArray">确认</el-button>
      </div>
    </el-dialog>
    <!-- 编辑行信息 end -->
    
  </div>
</template>
<script>
import _ from "lodash";
import axios from "axios";
import * as EasyTable from "@common/consts/inseasyui-table";
import InsPointArea from "@api/Inspection/PointArea";
import InsPlanLineDetail from "@api/Inspection/PlanLineDetail";

export default {
  data() {
    return {
      layerTitle: '修改关键点', //弹窗按钮
      bottomRow: "", //top表格点击行
      parentColum: "",
      squareQueryRawTableData: [],
      squareQueryTotal: 1,
      editButtomVisible: false, //弹框显示隐藏
      // 编辑信息
      impAreaName: "", //区域关键点
      PlanLineDetaiIdSelect: undefined,
      PointId: 0,
      PointArray:[],
      PointArrayStandby:[],
      defPlanAreaId: "",
      // 分页相关
      currentPageNumber: 1,
      currentPageSize: 10,
      paginatedTableData: [],
      bottomType: "", //底部提交显示区域或路线
      DoneDrawPoint:undefined
    };
  },
  created() {
    this.$bus.on("resteRegionalPointData", this.resteRegionalPointData); //更新数据
  },
  beforeDestroy() {
    this.$bus.off("resteRegionalPointData", this.resteRegionalPointData); //更新数据
  },
  watch: {
    layerDataValue() {
      this.squareQueryRawTableData = [];
    }
  },
  props: ["layerDataValue", "currentRow","delShow" ,"editShow"],
  computed: {
    columnList() {
      if (this.layerDataValue == "RouteManagement") {
        return EasyTable.Ins_RouteManageBottom_Columns;
      } else {
        return EasyTable.Ins_RegionalManagementBottom_Columns;
      }
    },
    layerHeight() {
      if (this.layerDataValue == "RouteManagement") {
        return "275px";
      } else {
        return "278px";
      }
    }
  },
  methods: {
    //双击事件
    bottomTableDbClick(currentRow){
      let geomArray
      if (this.layerDataValue == "RegionalManagement") {
          geomArray =[Number(currentRow.PointX), Number(currentRow.PointY)];
        }
      else{
           geomArray = [Number(currentRow.X),Number( currentRow.Y)];
        }
      this.$bus.emit('setCenter',geomArray)
      this.drawPoint([geomArray],false)
    },
    //画点
    drawPoint(geomArray,isModify){
      isModify = isModify || true
      this.$bus.emit("setPointOnMap", geomArray, isModify, (res, func) => {
          this.PointArray = res;
          this.DoneDrawPoint = func
        });
    },
    // 查询关键点
    GetData(data) {
      if(data == null){
        this.squareQueryRawTableData =[]
        return
      }
      this.parentColum = data;
      if (this.layerDataValue == "RouteManagement") {
        this.RoutePlanGet(data);
      } else {
        this.GetPointArea(data);
      }
    },

    //区域管理数据
    //查询区域关键点
    GetPointArea(data) {
      InsPointArea.GetPointArea(
        this.currentPageSize,
        this.currentPageNumber,
        data
      ).then(res => {
        this.squareQueryRawTableData = res.data.Data.Result;
        this.squareQueryTotal = res.data.Data.TotalRows;
      });
    },

    //修改关键点--区域
    editPoint(el) {
      this.$bus.emit("onPointermoveControl");
      this.$bus.emit("CloseModifyInteraction");
      let geomArray = [];
      if (this.layerDataValue == "RegionalManagement") {
        this.bottomType = "编辑区域关键点";  
        geomArray =[[Number(el.PointX), Number(el.PointY)]];
        this.PointArray = geomArray;
        this.editButtomVisible = true
        this.impAreaName = el.PointName
        this.$bus.emit("setPointOnMap", geomArray, true, (res, func) => {
          this.PointArray = res;
          this.DoneDrawPoint = func
          this.$emit("endDrawRoint",func)
        });
      } 
      else{
        this.bottomType = "编辑路线关键点";
        geomArray = [[Number(el.X),Number(el.Y)]]; 
        this.PointArray = geomArray;
        this.editButtomVisible = true;
        this.impAreaName = el.ImportPointName
        this.$bus.emit("setPointOnMap", geomArray, true, (res, func) => {
          this.PointArray = res;
          this.DoneDrawPoint = func 
          this.$emit("endDrawRoint",func)
        });  
      }  
      let [geomArrayCenter] = geomArray
      this.$bus.emit('setCenter',geomArrayCenter)  
    },
    //确认修改关键点--区域
    getPointArray(){
      // this.$bus.emit('endEditFeature',false)
      // this.$bus.emit('setBusinessLayerGroupVisible',false)
      if(!this.impAreaName){
        this.$message({
          type:'warning',
          message:'请输入正确的名称',
          showbtn:true
        })
      }
      if(this.bottomType == "编辑区域关键点"){
        InsPointArea.EditMapPlane(this.bottomRow.PointId, this.impAreaName, this.PointArray[0], this.PointArray[1]).then(
           res => {
            this.$emit("tableClick",this.currentRow)
            this.$emit("tableDbClick", this.currentRow);
            this.editButtomVisible = false
            this.DoneDrawPoint instanceof Function && this.DoneDrawPoint()
          }
        );
      }else{
        InsPlanLineDetail.EditPlanLineDetail(this.bottomRow.PlanLineDetaiId,this.bottomRow.PlanLineId, this.PointArray[0], this.PointArray[1],0,this.impAreaName).then(
           res => {
            this.$emit("tableClick",this.currentRow)
            this.$emit("tableDbClick", this.currentRow);
            this.editButtomVisible = false
            this.DoneDrawPoint instanceof Function &&  this.DoneDrawPoint()  
          }
        );
      }
    },
    //删除关键点--区域
    onDelectClick(el) {
      this.$bus.emit("onPointermoveControl");
      let delPointId = el.PointId;
      if (this.layerDataValue == "RegionalManagement") {
        this.$confirm(
          "确定要删除【" + el.PlanAreaName + "-" + el.PointName + "】关键点",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            InsPointArea.DeletePoint(el.PointId).then( res => {
              this.GetData(this.parentColum);
              this.$emit("tableDbClick", this.parentColum);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }else{
        this.DeletePlanLineDetail()
      }
    },

    //删除关键点--路线
    DeletePlanLineDetail() {
        this.$confirm("确定要删除路线关键点", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            InsPlanLineDetail.DeletePlanLineDetail(
              this.bottomRow.PlanLineDetaiId
            ).then( res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.PlanLineDetaiIdSelect = undefined;
              this.GetData(this.parentColum);
              this.$emit("tableDbClick", this.currentRow);
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      
    },
    //路线管理数据
    //查询关键点---路线
    RoutePlanGet(data) {
      InsPlanLineDetail.GetPlanLineDetail(15, 1, data).then(res => {
        this.squareQueryRawTableData = res.data.Data.Result;
        this.squareQueryTotal = res.data.Data.TotalRows;
      });
    },
    addPoint(val,callBack) {
      this.$bus.emit("OffPointermoveControl");
     this.$bus.emit('removeInteractions')
      this.$bus.emit("addInteractions", "Point", false, res1 => {
        this.$bus.emit(
          "setOverlay",
          res1,
          document.getElementById("popup"),
          "添加关键点",
          res2 => {
            if (res2.replace(/(^\s*)|(\s*$)/g, "") != "") {
              this.$bus.emit("onPointermoveControl");
              if (this.layerDataValue == "RegionalManagement") {
                InsPointArea.AddNewPoint(
                  //添加关键点--区域
                  res1[0],
                  res1[1],
                  res2,
                  val.PlanAreaId
                ).then(res3 => {
                  this.$message({
                    type: "success",
                    message: "添加关键点成功!"
                  });
                  this.$bus.emit("cancelBtn");
                  this.$emit("tableClick", val);
                  this.$emit("tableDbClick", val);
                });
              } else {
                InsPlanLineDetail.AddPlanLineDetail(
                  //添加关键点--路线
                  val.PlanLineId,
                  res1[0],
                  res1[1],
                  0,
                  res2
                ).then(res3 => {
                  this.$message({
                    type: "success",
                    message: "巡检路线关键点添加!"
                  }); 
                  this.$bus.emit("cancelBtn");
                  this.$emit("tableClick", val);
                  this.$emit("tableDbClick", val);
                });
              }
            } else {
              this.$message({
                type:'warning',
                message:'关键点名称不能为空'
              })
            }
          }
        );
      });
    },
    
    //更新操作
    loadData() {
      this.squareQueryRawTableData = [];
      this.squareQueryTotal = 1;
    },

    // 分页相关
    onPageChange(objvalue) {
      this.currentPageNumber = objvalue;
      this.GetData(this.parentColum);
    },
    //当前页数据变化
    onPageSizeChange(objvalue) {
      this.currentPageSize = objvalue;
      this.GetData(this.parentColum);
    },
    //单击高亮行值
    handleCurrentChange(val) {
      this.bottomRow = val;
      this.$bus.emit("onPointermoveControl");
    },
    //点击行触发
    tableClick(val) {
      this.$bus.emit("CloseModifyInteraction");
      this.PointArrayStandby = [parseFloat(val.PointX),parseFloat(val.PointY)];   //关键点坐标备用
      if(this.layerDataValue != 'RouteManagement' ){
        this.PointArray = [Number(val.PointX),Number(val.PointY)]
      }else{
        this.PointArray = [Number(val.X),Number(val.Y)]
      }
      this.bottomRow = val;
      this.PlanLineDetaiIdSelect = val.PlanLineDetaiId;
    },
    //取消弹窗
    handleClose() {
      this.$bus.emit("CloseModifyInteraction");
      this.impAreaName = "";
      this.editButtomVisible = false;
      this.$bus.emit("onPointermoveControl");
      if(this.DoneDrawPoint instanceof Function){
         this.DoneDrawPoint()
      }
      this.$bus.emit("setEditFeatureState",false);
      this.$bus.emit("onPointermoveControl");
      this.GetData(this.parentColum )
    },
    resteRegionalPointData(row) {
      //更新数据
      this.GetData(row);
    }
  }
};
</script>