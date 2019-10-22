<template>
  <div class="InsMinitor table_style" :class="{flexible:flexible}">
    <TableFormTitle :titleName="'巡检监控'" :flexible.sync="flexible"></TableFormTitle>
    <el-form label-width="83px" label-position="right" size="small" gutter="20px">
      <el-row>
        <el-form-item label="日期：">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="dateValue"
            type="date"
            placeholder="选择日期"
            @change="changeCondition"
          ></el-date-picker>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="时间：">
          <el-time-picker
            value-format="HH:mm:ss"
            is-range
            v-model="timeValue"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            @change="changeCondition"
          ></el-time-picker>
        </el-form-item>
      </el-row>
      <el-row class="slider-wraper">
        <el-form-item label="播放速度：">
          <el-row type="flex" justify="space-around" class="slider">
            <el-slider
              :max="2000"
              :min="50"
              v-model="speedValue"
              style="width:100% "
              :show-tooltip="true"
            ></el-slider>
            <span class="slide-value" :style="{left: (speedValue/(2000 - 50) *100 - 2) +  '%'}">
              {{speedValue}}
              <i class="el-icon-caret-top"></i>
            </span>
          </el-row>
          <div class="label-wrapper">
            <span class="slide-title">快</span>
            <span class="slide-title">慢</span>
          </div>
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="end" class="btn-div">
        <span
          v-if="$options.filters.btnTree('play' ,$route.meta.iFunID) && $options.filters.btnTree('suspend' ,$route.meta.iFunID)"
        >
          <span @click=" ()=> palying ? pause() : play()">
            <svg class="icon" aria-hidden="true" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="17" fill="#2fb8ee" opacity="0.56"/>
              <circle cx="18" cy="18" r="14" fill="#2f3239" />
              <path :class="{pause :palying}" />

              <!-- <use :xlink:href="palying ? '#icon-zanting' : '#icon-bofang'" /> -->
            </svg>
            {{palying ? '暂停' : '播放' }}
          </span>
        </span>
      </el-row>
    </el-form>
    <el-row class="ins-collapse">
      <el-scrollbar>
        <el-collapse accordion v-model="activeNames">
          <el-collapse-item
            :name="item.DepName"
            v-for="item in  userList"
            :key="item.DepName"
            class="avatList"
          >
            <template slot="title">
              <div>
                <i class="iconfont icon-bumen"></i>
                {{item.DepName}}(
                <span class="blue-text">{{item.OnLineCount}}</span>
                /{{item.Persons.length}})
              </div>
            </template>
            <div class="uesr-info-warpper">
              <div
                v-for="uesrInfo in item.Persons"
                :key="uesrInfo.iAdminID"
                v-show="stateValue?uesrInfo.IsOnline == stateValue:true"
                class="avatListItem"
                :class="{active:uesrInfo.iAdminID == userlistValue,online:uesrInfo.IsOnline == 'Y'}"
                @click="getRoute(uesrInfo)"
              >
                <div class="img-wraper" style="background:none;width:unset;height:unset;"> 
                <!-- <i class="img-shadow" v-show="uesrInfo.IsOnline == 'N'"></i> -->
                <div style="background-color:#b3b3b3;width:10px;height:10px;opacity:0.6;" v-show="uesrInfo.IsOnline == 'N'"></div>
                <div style="background-color:#5bc863;width:10px;height:10px" v-show="uesrInfo.IsOnline == 'Y'"></div>
                <!-- <img
                src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1555167380380&di=347b5f13b120723a41ca6cfa3edc3d03&imgtype=0&src=http%3A%2F%2Fuserimg.yingyonghui.com%2Fhead%2F56%2F1431005490560%2F2210156.png-thumb"
              > -->
                </div>

                <span style="font-size: 14px;">{{uesrInfo.cAdminName}}</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </el-row>
    <el-row class="stateChoose">
      <el-col
        :span="8"
        @click.native="typeChoose(item.value,'stateValue')"
        :class="{active:item.value == stateValue}"
        v-for="item in stateList"
        :key="item.value"
      >
        <i class="iconfont" :class="item.icon"></i>
        {{item.text}}
      </el-col>
    </el-row>
  </div>
</template>
<script>
import _ from "lodash";
//import MapDataOperation from "@services/ArcMap/MapDataOperation";
import User from "@api/Inspection/User";
import * as EasyTable from "@common/consts/inseasyui-table";
import { ExportExcel, FixFloat } from "@util";
import utilData from "@util/utilData";
import TableFormTitle from "@common/components/TableFormTitle";
export default {
  components: {
    TableFormTitle
  },
  data() {
    return {
      flexible: false, //是否收缩左侧表格
      //全部离线在线筛选list
      stateList: [
        {
          text: "全部",
          icon: "icon-zaixianlixian-",
          value: ""
        },
        {
          text: "在线",
          icon: "icon-zaixianlixian-2",
          value: "Y"
        },
        {
          text: "离线",
          icon: "icon-zaixianlixian-1",
          value: "N"
        }
      ],
      //全部离线在线筛选值
      stateValue: "",
      //tab选中展开值
      activeNames: ["1"],
      //用户列表
      userList: [],
      //选中的user值的Smid
      userlistValue: "",
      dateValue: "2019", //日期选择
      timeValue: "", //时间选择
      speedValue: "", //播放速度
      pointList: [], //需要播放的点数组
      sameCondition: false, //是否是相同的条件
      oldAdminID: "", //上次选中的人员id
      palying: false //是否正在运行动画
    };
  },
  created() {
    //初始化数据
    this.loadData();
    this.GetData();
    this.$bus.emit("flexibleControl", true); //控制左侧样式
  },
  beforeDestroy() {
    this.$bus.emit(
      "plotAnimateControl",
      this.pointList,
      this.speedValue,
      "clear"
    );
    this.$bus.emit("flexibleControl", false); //控制左侧样式
  },
  methods: {
    changeCondition() {
      this.sameCondition = false;
    },
    loadData() {
      let current = utilData.getCurrentDate();
      this.dateValue = utilData.myformatStr(current);
      this.timeValue = ["08:00:00", "17:00:00"];
    },
    getRoute(item) {
      this.palying = false;
      this.userlistValue = item.iAdminID;
      if (!this.dateValue) {
        this.$message({
          type: "error",
          message: "请选择执行日期"
        });
        return;
      } else if (!this.timeValue) {
        this.$message({
          type: "error",
          message: "请选择执行时间"
        });
        return;
      }
      let _startTime = this.dateValue + " " + this.timeValue[0];
      let _endTime = this.dateValue + " " + this.timeValue[1];
      let _iAdminID = this.userlistValue;
      let _speedValue = this.speedValue;
      if (
        this.sameCondition &&
        (_iAdminID == this.oldAdminID || !this.oldAdminID)
      ) {
        return;
      } else {
        User.UserRoute(_startTime, _endTime, _iAdminID).then(res => {
          let _point = [];
          if (res.data.Data.Result.length == 0) {
            this.$message({
              type: "error",
              message: "该人员当天没有考勤信息"
            });
            _point = [
              [113.51035296287657, 34.77596460456578],
              [113.49965459003813, 34.754936752283285],
              [113.52492489050651, 34.75272329692581],
              [113.4972566721516, 34.76692632060681]
            ];
          } else {
            _point = _.map(res.data.Data.Result, item => {
              return [item.PositionX, item.PositionY];
            });
          }
          console.log(_point);
          this.pointList = _point;
          this.$bus.emit(
            "plotAnimateControl",
            this.pointList,
            _speedValue,
            "showRoute"
          );
        });
      }
      this.sameCondition = true;
      this.oldAdminID = _iAdminID;
    },
    play() {
      if (!this.userlistValue) {
        this.$message({
          type: "error",
          message: "请选择人员"
        });
        return;
      }
      this.palying = true;
      this.$bus.emit(
        "plotAnimateControl",
        this.pointList,
        this.speedValue,
        "start",
        () => {
          this.palying = false;
        }
      );
    },
    pause() {
      this.palying = false;
      this.$bus.emit(
        "plotAnimateControl",
        this.pointList,
        this.speedValue,
        "pause"
      );
    },
    GetData() {
      User.UserInfo().then(res => {
        this.userList = res.data.Data.Result;
        console.log(this.userList);
        // this.userList[0].Persons[0].IsOnline = "Y";
        this.loadLayerData();
      });
    },

    typeChoose(item, type) {
      this[type] = item;
    },
    //初始化相关数据
    loadLayerData() {
      //登陆状态默认全部
      this.stateValue = this.stateList[0].value;
      //tab页默认第一行展开
      this.activeNames = this.userList[0].DepName;
    }
  }
};
</script>