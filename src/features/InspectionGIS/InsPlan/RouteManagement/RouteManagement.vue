<template>
  <div class="table_style formItem" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'巡检路线管理'" :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="48px">
      <el-row>
        <el-col span="16" style="padding-left: 20px;text-align: left;">
          <el-button class="my-allArea" size="mini" @click="allAreaShow" v-if="$options.filters.btnTree('/api/PlanLine/Get' ,$route.meta.iFunID)">全部区域</el-button>
          <el-button class="my-closeChoose" size="mini" @click="clearArea" v-if="$options.filters.btnTree('clear' ,$route.meta.iFunID)">关闭选择</el-button>
        </el-col>
      </el-row>
      <div class="table-btn-control">
        <el-row type="flex" justify="start">
          <el-button class="my-tableout" plain size="mini" @click="AddRowMsg" v-if="$options.filters.btnTree('/api/PlanLine/Post' ,$route.meta.iFunID)">
            <i class="iconfont icon-xinzeng"></i>新增
          </el-button>
          <el-button class="my-tableout" size="mini" @click="EditRowMsg" v-if="$options.filters.btnTree('/api/PlanLine/Put' ,$route.meta.iFunID)">
            <i class="iconfont icon-bianji"></i>编辑
          </el-button>
          <el-button class="my-tableout" size="mini" @click="DelectPlanArea" v-if="$options.filters.btnTree('/api/PlanLine/Delete' ,$route.meta.iFunID)">
            <i class="iconfont icon-shanchu"></i>删除
          </el-button>
        </el-row>
      </div>
    </el-form>
    <InsTable
      ref="InsPlanTable"
      :layerListName="'Ins_RouteManage_Columns'"
      :tableHeight="'calc(100vh - 581px)'"
      :columnListData="squareQueryRawTableData"
      :loading.sync="loading"
      :pageSize.sync="currentPageSize"
      :pageNumber.sync="currentPageNumber"
      :dataTotal="squareQueryTotal"
      :layeName="'RouteManagement'"
      :tableIndex.sync = "tableIndex"
      :addShow="$options.filters.btnTree('/api/PlanLineDetail/Post' ,$route.meta.iFunID)"
      @tableDbClick = "tableDbClick"
      @GetData="GetData"
      @currentChange = "currentChange"
      @deltableItem="deltableItem"
      @tableClick = "tableClick"
      @addPoint = "addPoint"
    ></InsTable>
    <!-- 编辑行信息 -->
    <el-dialog
      title="编辑"
      :modal-append-to-body="false"
      :lock-scroll="false"
      :modal="false"
      :visible.sync="addDialogVisible"
      :before-close="cancelBtn"
      customClass="el_add_dialog"
      class="myDialog insPlanDialog"
      :fullscreen="false"
      >
      <el-form label-width="80px" size="small">
        <el-form-item label="名称：">
          <el-input size="mini" placeholder="请输入名称" v-model="PlanAreaNameSelect"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="my-dialog-cancel" @click="cancelBtn" size="mini">取消</el-button>
        <el-button class="my-dialog-submit" @click="EditPlanLine" size="mini">提交</el-button>
      </div>
    </el-dialog>
    <!-- 编辑行信息 end -->
    <bottom-table
      :currentRow="currentRow"
      :layerDataValue="'RouteManagement'"
      ref="bottomTable"
      :editShow="$options.filters.btnTree('/api/PlanLineDetail/Put' ,$route.meta.iFunID)"
      :delShow="$options.filters.btnTree('/api/PlanLineDetail/Delete' ,$route.meta.iFunID)"
      @tableClick="tableClick"
      @endDrawRoint="endDrawRoint"
      @tableDbClick ="tableDbClick"
    ></bottom-table>
  </div>
</template>
<script>
import _ from "lodash";
import * as EasyTable from "@common/consts/inseasyui-table";
import InsPlanLine from "@api/Inspection/PlanLine";
import { GeoTextCenter } from "@util/index";
import InsPlanLineDetail from "@api/Inspection/PlanLineDetail";
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
      columnListData: [], //表格全部数据
      dataTotal: 1, //表格数据个数
      currentPageNumber: 1, //表格页码
      currentPageSize: 50, //表格页size
      currentRow: null, //当前表格选中项
      flexible: false, //是否收缩左侧表格
      AllPointArray: [], //全部点集合
      closeBtnShow: false,
      addDialogVisible: false,
      PlanAreaNameSelect: "",
      submitBtn: 0,
      tableData: [],
      formData: {
        name: ""
      },
      geoText: "", //路线信息
      patroGeoText: "" //区域信息
    };
  },
  mounted() {
    this.GetData("first");
  },
  computed: {
    dialogTitle() {
      if (this.submitBtn == 1) {
        return "添加巡检路线";
      } else if (this.submitBtn == 2) {
        return "修改巡检路线";
      }
    }
  },
  beforeDestroy() {
    this.$bus.emit("removeInteractions");
    this.$bus.emit("CloseModifyInteraction");
    this.$bus.emit("OffPointermoveControl");
    this.$bus.emit("setBusinessLayerGroupVisible", false);
    //this.$bus.emit("setBusinessLayerGroupVisible", false); //开启业务图层
  },
  methods: {
    currentChange(row){
      this.currentRow = row
    },
    tableDbClick(row) {
      this.$bus.emit("CloseModifyInteraction");
      this.drawLine(row, false);
    },
    cancelBtn() {
      this.addDialogVisible = false;
      this.$bus.emit("setBusinessLayerGroupVisible", false);
    },
    //关闭选择
    clearArea() {
      this.$bus.emit("CloseModifyInteraction");
      this.$bus.emit("setBusinessLayerGroupVisible", false);
    },
    //全部显示
    allAreaShow() {
      this.$bus.emit("CloseModifyInteraction");
      let LineArray = _.map(this.tableData, item => {
        try {
        JSON.parse(item.GeoText);
        } catch (e) {
          return []
        }
        return JSON.parse(item.GeoText);
      });
      let nameArray = _.map(this.tableData, item => {
        return item.PlanLineName;
      });
      let bufferArray = _.map(this.tableData, item => {
        return JSON.parse(item.PatroGeoText);
      });
      this.$bus.emit(
        "setLineStringOnMap",
        LineArray,
        nameArray,
        false,
        () => {},
        bufferArray
      );
      let pointArray = _.map(this.tableData, "PlanLineId");
      this.drawPoint(pointArray);
    },
    // 查询操作
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
      InsPlanLine.GetPlanLine(this.currentPageSize, this.currentPageNumber).then(res => {
        //区域管理数据
        this.tableData = res.data.Data.Result;
        // _this.squareQueryRawTableData =res.data.Data.Result
        this.loading = false;
        this.squareQueryRawTableData = res.data.Data.Result;
        this.squareQueryTotal = res.data.Data.TotalRows;
        if (pageNumber && pageNumber == "first") {
          this.allAreaShow();
        }
      });
    },
    //添加巡检路线
    AddRowMsg() {
      this.$bus.emit("OffPointermoveControl");
      this.$bus.emit(
        "addInteractions",
        "LineString",
        false,
        (geoText, patroGeoText) => {
          let res = geoText;
          geoText = JSON.stringify(geoText); //添加点    绘制线数据
          patroGeoText = JSON.stringify(patroGeoText);
          let len = parseInt(res.length);
          this.$bus.emit("setCenter", res[len - 1]);
          this.$bus.emit(
            "setOverlay",
            res[len - 1],
            document.getElementById("popup"),
            "添加巡检路线",
            res2 => {
              if (!res2.name) {
                this.$message({
                  type: "warning",
                  message: "请输入巡检名称",
                  showClose: true
                });
                return;
              }
              this.$bus.emit("cancelBtn");
              this.AddPlanLine(res2.name, geoText, patroGeoText);
            }
          );
          // this.addDialogVisible = true;
          // this.submitBtn = 1;
        }
      );
    },
    //确认添加巡检路线
    AddPlanLine(PlanAreaNameSelect, geoText, patroGeoText) {
      this.$bus.emit("onPointermoveControl");
      this.$bus.emit("removeInteractions");
      let _PlanAreaNameSelect = PlanAreaNameSelect;
      let _GeoText = geoText;
      let _PatroGeoText = patroGeoText;
      InsPlanLine.AddPlanLine(
        _PlanAreaNameSelect,
        _GeoText,
        _PatroGeoText
      ).then(res => {
        //区域管理数据
        this.addDialogVisible = false;
        this.$message({
          type: "success",
          message: "添加成功",
          showClose: true
        });
        this.PlanAreaNameSelect = "";
        this.submitBtn = 0;
        this.GetData("first");
      });
    },
    closeBtn() {
      this.closeBtnShow = false;
    },
    drawLine(thisCurrentRow, isModify = true) {
      this.PlanAreaNameSelect = thisCurrentRow.PlanLineName;
      this.geoText = thisCurrentRow.GeoText;
      try {
        JSON.parse(thisCurrentRow.GeoText);
      } catch (e) {
        this.$message({
          type: "error",
          message: "您选择了未知错误的区域!!!",
          showClose: true
        });
        return false;
      }
      let geomArray = JSON.parse(thisCurrentRow.GeoText);
      let index = parseInt(geomArray.length / 2);
      index = geomArray[index];
      this.patroGeoText = thisCurrentRow.PatroGeoText;
      let patroGeoText = JSON.parse(thisCurrentRow.PatroGeoText);
      let nameArray = [thisCurrentRow.PlanLineName];
      this.formData.name = thisCurrentRow.PlanLineName;
      this.$bus.emit(
        "setLineStringOnMap",
        [geomArray],
        nameArray,
        isModify,
        (GeoText, end, PatroGeoText) => {
          if (GeoText) {
            this.geoText = JSON.stringify(GeoText);
            this.end = end;
            if (!isModify) {
              end();
            }
            this.patroGeoText = JSON.stringify(PatroGeoText);
          }
        },
        [patroGeoText]
      );
      this.drawPoint();
      //this.$bus.emit("setCenter", index);
      GeoTextCenter(this.currentRow.GeoText, res => {
        this.$bus.emit("setCenter", res);
      });
    },
    drawPoint(id = this.currentRow.PlanLineId) {
      this.AllPointArray = [];
      let objArray = [];
      let pointArrayData = [];
      if (_.isArray(id)) {
        let len = id.length - 1;
        _.forEach(id, (ele, index) => {
          InsPlanLineDetail.GetPlanLineDetail(200, 1, ele).then(res => {
            //点坐标的集合
            _.map(res.data.Data.Result, res => {
              this.AllPointArray.push(res);
              pointArrayData.push([Number(res.X), Number(res.Y)]);
              objArray.push({
                ImportPointName: res.ImportPointName,
                AddTime: res.AddTime
              });
            });
            if (index == len) {
              this.$bus.emit(
                "setPointOnMap",
                pointArrayData,
                false,
                () => {},
                "RoutePoint",
                objArray
              );
              this.$bus.emit("onPointermoveControl");
            }
          });
        });
        return;
      }

      InsPlanLineDetail.GetPlanLineDetail(200, 1, id).then(res => {
        //点坐标的集合
        _.map(res.data.Data.Result, res => {
          this.AllPointArray.push(res);
          pointArrayData.push([Number(res.X), Number(res.Y)]);
          objArray.push({
            ImportPointName: res.ImportPointName,
            AddTime: res.AddTime
          });
        });
        this.$bus.emit("onPointermoveControl");
        this.$bus.emit(
          "setPointOnMap",
          pointArrayData,
          false,
          () => {},
          "RoutePoint",
          objArray
        );
      });
    },
    //修改巡检路线
    EditRowMsg() {
      this.$bus.emit("CloseModifyInteraction");
      var thisCurrentRow = this.currentRow;
      if (thisCurrentRow) {
        this.addDialogVisible = true;
        this.drawLine(thisCurrentRow);
        // this.submitBtn = 2;
      } else {
        this.$message({
          type: "warning",
          message: "请选择要修改的路线",
          showClose: true
        });
      }
    },
    end() {},
    //确认修改巡检路线
    EditPlanLine() {
      this.end();
      this.$bus.emit("setBusinessLayerGroupVisible", false);
      this.$bus.emit("endEditFeature", false);
      // this.$bus.emit('removeInteractions')
      this.addDialogVisible = false;
      let thisCurrentRow = this.currentRow;
      InsPlanLine.EditPlanLine(
        thisCurrentRow.PlanLineId,
        this.PlanAreaNameSelect,
        this.geoText,
        this.patroGeoText
      ).then(res => {
        //区域管理数据
        this.addDialogVisible = false;
        this.$message({
          type: "success",
          message: "编辑成功",
          showClose: true
        });
        this.PlanAreaNameSelect = "";
        this.submitBtn = 0;
        this.GetData("first");
      });
    },

    //删除巡检路线
    DelectPlanArea() {
      this.$bus.emit("CloseModifyInteraction");
      var thisPlanLineId = this.currentRow.PlanLineId;
      if (thisPlanLineId) {
        this.$confirm("确认删除？")
          .then(_ => {
            InsPlanLine.DeletePlanLine(thisPlanLineId).then(res => {
              this.$message({
                type: "success",
                message: "删除成功",
                showClose: true
              });
              //区域管理数据
              this.GetData("first");
              this.tableClick()
            });
          })
          .catch(_ => {});
      } else {
        this.$message({
          type: "warning",
          message: "请选择要删除的路线",
          showClose: true
        });
      }
    },


    //单击表格操作
    tableClick(row) {
      row = row || { PlanLineId: null };
      this.$refs.bottomTable.GetData(row.PlanLineId);
      row && this.$refs.InsPlanTable.setCurrentRow(row);
    },
    //添加关键点
    addPoint(val) {
      this.currentRow = val.row
      //this.tableDbClick(val.row)
      this.$refs.bottomTable.addPoint(val.row);
    },
  }
};
</script>