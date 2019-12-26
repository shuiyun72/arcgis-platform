<template>
  <div class="table_style formItem calcHeight" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'巡检区域管理'" :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="48px">
      <el-row>
        <el-col :span="16" style="text-align: left;">
          <el-button class="my-allArea" size="mini" @click="showAllArea" v-if="$options.filters.btnTree('/api/PlanArea/Get' ,$route.name)">全部区域</el-button>
          <el-button class="my-closeChoose" size="mini" @click="closeAllArea" v-if="$options.filters.btnTree('clear' ,$route.name)">关闭选择</el-button>
        </el-col>
      </el-row>
      <div class="table-btn-control">
        <el-row type="flex" justify="start">
          <el-button class="my-tableout" plain size="mini" @click="addRow" v-if="$options.filters.btnTree('/api/PlanArea/Post' ,$route.name)">
            <i class="iconfont icon-xinzeng"></i>新增
          </el-button>
          <el-button class="my-tableout" size="mini" @click="editRow" v-if="$options.filters.btnTree('/api/PlanArea/Put' ,$route.name)">
            <i class="iconfont icon-bianji"></i>编辑
          </el-button>
          <el-button class="my-tableout" size="mini" @click="DelectRow" v-if="$options.filters.btnTree('/api/PlanArea/Delete' ,$route.name)">
            <i class="iconfont icon-shanchu"></i>删除
          </el-button>
        </el-row>
      </div>
    </el-form>
    <InsTable
      ref="InsPlanTable"
      :layerListName="'Ins_RegionalManagement_Columns'"
      :tableHeight="'calc(100vh - 584px)'"
      :columnListData="squareQueryRawTableData"
      :loading.sync="loading"
      :pageSize.sync="currentPageSize"
      :pageNumber.sync="currentPageNumber"
      :dataTotal="squareQueryTotal"
      :layeName="'RegionalManagement'"
      :tableIndex.sync="tableIndex"
      :addShow="$options.filters.btnTree('/api/PointArea/Post' ,$route.name)"
      @tableDbClick="tableDbClick"
      @GetData="GetData"
      @currentChange="currentChange"
      @deltableItem="deltableItem"
      @tableClick="tableClick"
      @addPoint="addPoint"
    ></InsTable>
    <!-- 编辑行信息 end -->
    <bottom-table
      :currentRow="currentRow"
      :layerDataValue="'RegionalManagement'"
      ref="bottomTable"
      :editShow="$options.filters.btnTree('/api/PointArea/Put' ,$route.name)"
      :delShow="$options.filters.btnTree('/api/PointArea/Delete' ,$route.name)"
      @tableClick="tableClick"
      @endDrawRoint="endDrawRoint"
      @tableDbClick="tableDbClick"
    ></bottom-table>
    <el-dialog
      center
      v-dialogDrag
      :title="dialogType"
      :visible.sync="dialogVisible"
      customClass="el_add_dialog"
      class="myDialog insPlanDialog"
      :before-close="closeDialogBtn"
      :modal-append-to-body="false"
      :modal="false"
    >
      <el-form label-width="86px" size="small">
        <el-form-item label="名称：">
          <el-input :placeholder="请输入标题" v-model="PlanAreaName"></el-input>
        </el-form-item>
        <el-form-item label="责任部门：">
          <el-select v-model="DeptIdSelect" placeholder="请选择管理人" @change="onChangeDept">
            <el-option
              v-for="item in deptData"
              :key="item.iDeptID"
              :label="item.cDepName"
              :value="item.iDeptID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="责任人：">
          <el-select v-model="adminNameDataSelect" placeholder="择管理人名称">
            <el-option
              v-for="item in adminNameData"
              :key="item.iAdminID"
              :label="item.cAdminName"
              :value="item.iAdminID"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="my-dialog-cancel" size="mini" @click="closeDialogBtn">取 消</el-button>
        <el-button class="my-dialog-submit" size="mini" @click="SubmitArea">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import _ from "lodash";
import InsPlanArea from "@api/Inspection/PlanArea";
import InsPointArea from "@api/Inspection/PointArea";
import InsDepartmentUserCycle from "@api/Inspection/DepartmentUserCycle";
import { GeoTextCenter } from "@util/index";
import TableFormTitle from "@common/components/TableFormTitle";
import InsTable from "@features/InspectionGIS/components/InsTable";
import BottomTable from "@features/InspectionGIS/InsPlan/components/BottomTable.vue";
export default {
  components: {
    TableFormTitle,
    InsTable,
    BottomTable
  },
  data() {
    return {
      loading: true,
      squareQueryRawTableData: [], //表格全部数据
      dataTotal: 1, //表格数据个数
      currentPageNumber: 1, //表格页码
      currentPageSize: 50, //表格页size
      currentRow: null, //当前表格选中项
      flexible: false, //是否收缩左侧表格
      tableIndex: [], //多选列表
      dialogType: "", //弹框标题
      dialogVisible: false,
      DoneDrawPolygon: undefined,
      allAreaData: [],
      allAreaGeoTextData: [],
      allAreaNamesData: [],
      AreaArrayStandby: "",
      isShowAllArea: true,
      allAreaPoint: [], //所有关键点集合
      pointObjArray: [], //
      //dialog
      deptData: [], //管理部门数据
      adminNameDataSelect: 0, //管理人
      PlanAreaName: "", //区域名称
      DeptIdSelect: 0, //部门Id
      adminNameData: [] //人员名称数据
    };
  },
  created() {
    this.GetData();
    this.$bus.on("resteRegionalData", this.GetData); //重置数据
  },
  beforeDestroy() {
    this.$bus.off("resteRegionalData", this.GetData); //重置数据
    this.$bus.emit("removeInteractions");
    this.isShowAllArea = true;
    this.$bus.emit("CloseModifyInteraction");
    this.$bus.emit("onPointermoveControl");
    this.$bus.emit("setBusinessLayerGroupVisible", false); //开启业务图层
    if (this.DoneDrawPolygon instanceof Function) {
      this.DoneDrawPolygon();
    }
  },
  mounted() {
    // this.$bus.emit("setVectorLayerVisible", true);  //开启矢量图层
  },
  watch: {
    allAreaPoint() {
      this.$bus.emit(
        "setPointOnMap",
        this.allAreaPoint,
        false,
        () => {},
        "RegionalPoint",
        this.pointObjArray
      );
    }
  },

  methods: {
    currentChange(row) {
      this.currentRow = row;
    },
    //初始化区域管理数据
    GetData(pageNumber, pageSize) {
      this.loading = true;
      if (typeof pageNumber == "number") {
        //如果传值更新父页面的表格页码为1，切换数据调用data时使用，
        //因为getdata初始查询页码为1
        this.currentPageNumber = pageNumber;
      }
      if (typeof pageSize == "number") {
        this.currentPageSize = pageSize;
      }
      InsPlanArea.RegionalData(
        this.currentPageSize,
        this.currentPageNumber
      ).then(res => {
        console.log(res)
        //区域管理数据
        this.loading = false;
        this.squareQueryRawTableData = res.data.Data.Result;
        this.squareQueryTotal = res.data.Data.TotalRows;
        this.allAreaData = res.data.Data.Result;
        if (this.isShowAllArea) {
          this.showAllArea();
        }
      });
    },
    //显示全部区域
    showAllArea() {
      this.$bus.emit("CloseModifyInteraction");
      this.allAreaGeoTextData = [];
      this.allAreaNamesData = [];

     // this.$bus.emit("setCenter",[115.16432404518437, 33.034719228745395]);

      for (let i = 0; i < this.allAreaData.length; i++) {
        try {
          JSON.parse(this.allAreaData[i].GeoText);
        } catch (e) {
          continue;
        }
        this.allAreaGeoTextData.push(JSON.parse(this.allAreaData[i].GeoText));
        this.allAreaNamesData.push(this.allAreaData[i].PlanAreaName);
      }
      let allAreaId = _.map(this.allAreaData, point => {
        return point.PlanAreaId;
      });

      for (let i = 0; i < allAreaId.length; i++) {
        InsPointArea.GetPointArea(20, 1, allAreaId[i]).then(res => {
          _.map(res.data.Data.Result, ele => {
            this.allAreaPoint.push([Number(ele.PointX), Number(ele.PointY)]);
            this.pointObjArray.push({
              PointName: ele.PointName
            });
          });
        });
      }
      this.$bus.emit(
        "setPolygonOnMap",
        this.allAreaGeoTextData,
        this.allAreaNamesData,
        false,
        res => {
          this.$bus.emit("setBusinessLayerGroupVisible", true); //关闭业务图层
        }
      );
    },
    //关闭所有区域
    closeAllArea() {
      this.$bus.emit("CloseModifyInteraction");
      this.$bus.emit("setPolygonOnMap", [], [], false, res => {});
      this.$bus.emit("setBusinessLayerGroupVisible", false); //关闭业务图层
      this.$bus.emit("onPointermoveControl");
    },
    //删除行
    DelectRow() {
      this.$bus.emit("CloseModifyInteraction");
      this.$bus.emit("onPointermoveControl");
      if (this.currentRow) {
        this.$confirm("确认删除？")
          .then(_ => {
            InsPlanArea.DeletePlanArea(this.currentRow.PlanAreaId).then(res => {
              this.GetData();
              this.$message({
                type: "success",
                message: "删除成功！",
                showClose: true
              });
              this.tableClick();
            });
          })
          .catch(_ => {
            this.$message({
              type: "info",
              message: "已取消删除！",
              showClose: true
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择要删除的区域!",
          showClose: true
        });
      }
    },
    addRow() {
      //添加区域 点》面
      this.$bus.emit("OffPointermoveControl");
      this.$bus.emit("removeInteractions");
      /* this.$bus.emit("addInteractions", "Point", false, res => {
        this.$bus.emit(
          "setOverlay",
          res,
          document.getElementById("popup"),
          "添加区域",
          res2 => {
            if (res2 == "1") {*/
      this.$bus.emit("addInteractions", "Polygon", false, res3 => {
        this.$bus.emit(
          "setOverlay",
          res3[0][0],
          document.getElementById("popup"),
          "添加区域",
          res4 => {
            //判断是否画多边形
            //  console.dir(JSON.stringify(res4.dialogData[0]));
            if (res4.AreaName.replace(/(^\s*)|(\s*$)/g, "") != "") {
              InsPlanArea.AddPlanArea(
                res4.AreaName,
                JSON.stringify(res4.dialogData[0]),
                res4.DeptId,
                res4.adminName
              ).then(res5 => {
                this.GetData();
                this.$bus.emit("cancelBtn");
                this.$bus.emit("setTempLayerGroupVisible", false);
                this.$bus.emit("onPointermoveControl");
                this.$message({
                  type: "success",
                  message: "区域添加成功!",
                  showClose: true
                });
                //this.isShowAllArea = true
              });
            } else {
              this.$message({
                type: "warning",
                message: "区域名称不能为空!",
                showClose: true
              });
            }
          }
        );
      });
      /*} else {
              this.$message({
                type: "warning",
                message: "请点击多边形添加范围!"
              });
            }
          }
        );
      });*/
    },
    editRow(el) {
      this.$bus.emit("onPointermoveControl");
      this.$bus.emit("CloseModifyInteraction");
      if (this.currentRow) {
        this.AreaArrayStandby = this.currentRow.GeoText;
        this.isModifyArea(true);
        this.isShowAllArea = false;
        GeoTextCenter(this.currentRow.GeoText, res => {
          this.$bus.emit("setCenter", res);
        });
      } else {
        this.$message({
          type: "warning",
          message: "请选择要编辑的区域!",
          showClose: true
        });
      }
    },
    //双击区域行
    tableDbClick(row) {
      this.$bus.emit("onPointermoveControl");
      this.$bus.emit("CloseModifyInteraction");
      if (this.DoneDrawPolygon instanceof Function) {
        this.DoneDrawPolygon();
      }
      this.isModifyArea(false);
      GeoTextCenter(this.currentRow.GeoText, res => {
        this.$bus.emit("setCenter", res);
      });
    },
    //是否编辑区域
    isModifyArea(isModify) {
      try {
        JSON.parse(this.currentRow.GeoText);
      } catch (e) {
        this.$message({
          type: "error",
          message: "您选择了未知错误的区域!!!",
          showClose: true
        });
        return;
      }
      if (this.DoneDrawPolygon instanceof Function) {
        this.DoneDrawPolygon();
      }
      let GeoTextData = [JSON.parse(this.currentRow.GeoText)];
      this.AreaArrayStandby = this.currentRow.GeoText;
      if (isModify) {
        this.editDialogFnc(GeoTextData);
      } else {
        this.$bus.emit(
          "setPolygonOnMap",
          GeoTextData,
          [this.currentRow.PlanAreaName],
          isModify,
          res => {
            // console.log(res);
            //this.AreaArray = res;
          }
        );
      }
      //显示地图区域

      //显示区域关键点
      InsPointArea.GetPointArea(20, 1, this.currentRow.PlanAreaId).then(res => {
        let pointArrayData = []; //点坐标的集合
        let pointObjArray = [];
        _.map(res.data.Data.Result, res => {
          pointArrayData.push([Number(res.PointX), Number(res.PointY)]);
          pointObjArray.push({
            PointName: res.PointName
          });
        });
        this.$bus.emit("onPointermoveControl");
        this.$bus.emit(
          "setPointOnMap",
          pointArrayData,
          false,
          (res, fun) => {},
          "RegionalPoint",
          pointObjArray
        );
      });
    },

    /***********   dialog弹框部分   ************* */
    //编辑区域
    editDialogFnc(GeoTextData) {
      this.$bus.emit("setBusinessLayerGroupVisible", true); //开启业务图层
      this.dialogType = "编辑区域";
      this.axiosDeptData();
      this.PlanAreaName = this.currentRow.PlanAreaName;
      this.DeptIdSelect = this.currentRow.DeptId;
      this.adminNameDataSelect = this.currentRow.PersonId;
      this.axiosAdminNameData(this.currentRow.DeptId);
      this.dialogVisible = true;
      this.$bus.emit(
        "setPolygonOnMap",
        GeoTextData,
        [this.currentRow.PlanAreaName],
        true,
        (res, func) => {
          this.AreaArray = res;
          this.DoneDrawPolygon = func;
        }
      );
    },
    //提交数据   获取编辑后区域数组
    SubmitArea() {    
      let AreaArrayGeoText;
      if (!_.isEmpty(this.AreaArray)) {
        AreaArrayGeoText = this.AreaArrayStandby;
      } else {
        AreaArrayGeoText = JSON.stringify(this.AreaArray[0]);
      }
      this.dialogVisible = false;
      if (this.PlanAreaName.replace(/(^\s*)|(\s*$)/g, "") != "") {
        InsPlanArea.EditPlanArea(
          this.currentRow.PlanAreaId,
          this.PlanAreaName,
          AreaArrayGeoText,
          this.DeptIdSelect,
          this.adminNameDataSelect
        ).then(() => {
          this.isShowAllArea = true;
          this.GetData();
          if (this.AreaArray != undefined) {
            if( this.DoneDrawPolygon instanceof Function){
              this.DoneDrawPolygon();
            }  
          }
        });
      } else {
        this.$message({
          type: "warning",
          message: "区域名称不能为空!",
          showClose: true
        });
      }
    },
    //取消弹窗
    closeDialogBtn() {
      if (this.DoneDrawPolygon instanceof Function) {
        this.DoneDrawPolygon();
      }
      this.dialogVisible = false;
      this.$bus.emit("onPointermoveControl");
      this.$bus.emit("setEditFeatureState", false);
    },
    //查询部门数据
    axiosDeptData() {
      InsDepartmentUserCycle.DeptData().then(res => {
        this.deptData = res.data.Data.Result;
      });
    },
    //刷新人员数据联动
    onChangeDept(val) {
      this.axiosAdminNameData(val, res => {
        if (res.length > 0) {
          this.adminNameDataSelect = res[0].iAdminID;
        } else {
          this.adminNameDataSelect = "无数据";
        }
      });
    },
    //获取人员数据
    axiosAdminNameData(idNum, callback) {
      if (idNum) {
        InsDepartmentUserCycle.AdminNameData(idNum).then(res => {
          this.adminNameData = res.data.Data.Result;
          callback &&
            callback instanceof Function &&
            callback(res.data.Data.Result);
        });
      }
    },

    //单击表格操作
    tableClick(row) {
      console.log(row)
      row = row || { PlanAreaId: null };
      this.$refs.bottomTable.GetData(row.PlanAreaId);
      row && this.$refs.InsPlanTable.setCurrentRow(row);

      let GeoTextData = [JSON.parse(this.currentRow.GeoText)];
      this.AreaArrayStandby = this.currentRow.GeoText;
   
        this.$bus.emit(
          "setPolygonOnMap",
          GeoTextData,
          [this.currentRow.PlanAreaName],
          false,
          (res, func) => {
            this.AreaArray = res;
          }
        );
      
      // this.$bus.emit("onPointermoveControl");
      // this.$bus.emit("CloseModifyInteraction");
      // if (this.DoneDrawPolygon instanceof Function) {
      //   this.DoneDrawPolygon();
      // }
      // this.isModifyArea(false);
      // GeoTextCenter(this.currentRow.GeoText, res => {
      //   this.$bus.emit("setCenter", res);
      // });


    },
    //添加关键点
    addPoint(val) {
      if(this.AreaArray){
        this.$refs.bottomTable.addPoint(val.row,res=>{},this.AreaArray);
      }else{
        this.$message({
          type:'warning',
          message:'区域加载中，请重新添加'
        })
      }
    }
  }
};
</script>



