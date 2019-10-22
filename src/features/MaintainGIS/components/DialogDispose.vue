<template>
  <el-form>
    <el-row class="title" :style="{color:color }">
      {{TitleName}}
      <span class="title_time">({{TitleTime}})</span>
    </el-row>
    <!-- <el-row  v-for="(item,index) in MaDialogDispose" :key="index"  class="dialog-table">
        <el-col :span="3" class="dialog-table-lable">{{item.name1}}</el-col>
        <el-col :span="4">{{item.val1}}</el-col>
        <el-col :span="3" class="dialog-table-lable">{{item.name2}}</el-col>
        <el-col :span="4">{{item.val2}}</el-col>
        <el-col :span="3" class="dialog-table-lable">{{item.name3}}</el-col>
        <el-col :span="7">{{item.val3}}</el-col>
    </el-row>-->
    <table border="1" class="dialog-table" v-if="MaDialogDispose">
      <tr v-for="(item,index) in MaDialogDispose" :key="index" class="wrapperCol">
        <td class="dialog-table-lable">{{item[0]}}</td>
        <td>{{item[1]}}</td>
        <td class="dialog-table-lable">{{item[2]}}</td>
        <td>{{item[3]}}</td>
        <td class="dialog-table-lable">{{item[4]}}</td>
        <td>{{item[5]}}</td>
      </tr>
      <tr
        v-for="(item,index) in MaDialogImgAndReply"
        :key="index"
        class="wrapperCol"
        :class="{'dialog_img-wrapper': isarray(item) && item.length}"
      >
        <td class="dialog-table-lable">{{index}}</td>
        <td colspan="5" class="dialog_img" v-if="isarray(item)">
          <a :href="image" target="_blank" v-for="(image,index) in item" :key="index">
            <img :src="image" alt />
          </a>
        </td>
        <td colspan="5" v-else>{{item}}</td>
      </tr>
    </table>
  </el-form>
</template>
<script>
import _ from "lodash";
//事件查询
import EventManageForMaintain from "@api/Maintain/EventManageForMaintain";
import config from "@config/config.js";
export default {
  components: {},
  props: ["TitleName", "colorList", "stepDetail"],
  // props:{
  //   TitleName:{
  //     fooMessage:String,
  //     required:true
  //   },
  //   color:{
  //     default:'#7a7e80'
  //   },
  //  /* MaDialogDisposeData:{

  //   }*/
  //   stepDetail:{
  //     default:[]
  //   }
  // },
  data() {
    return {
      color: "",
      TitleTime: ""
      // MaDialogDispose:[],
    };
  },
  computed: {
    MaDialogDispose() {
      if (!this.stepDetail) {
        return false;
      }
      this.TitleTime = this.stepDetail.ExecUpDateTime;
      let OperId = this.stepDetail.OperId;
      if (OperId == 11) OperId = 1;
      this.color = this.colorList[OperId];
      if (this.TitleName === "接受" || this.TitleName === "延期退回") {
        return [
          [
            "接受部门：",
            this.stepDetail.ExecDetpName || "未知",
            "接受人员：",
            this.stepDetail.ExecPersonName || "未知",
            "接受时间：",
            this.stepDetail.ExecUpDateTime
          ]
        ];
      } else if (this.TitleName === "无效") {
        return [
          [
            "处理部门：",
            this.stepDetail.ExecDetpName || "未知",
            "处理人员：",
            this.stepDetail.ExecPersonName || "未知",
            "处理时间：",
            this.stepDetail.ExecUpDateTime
          ]
        ];
      } else if (
        this.TitleName == "审核" ||
        this.TitleName == "作废" ||
        this.TitleName === "处理" ||
        this.TitleName == "完工" ||
        this.TitleName === "处置" ||
        this.TitleName === "分派" ||
        this.TitleName === "到场" ||
        this.TitleName === "延期申请" ||
        this.TitleName === "延期确认" ||
        this.TitleName === "退单" ||
        // this.TitleName === "无效" ||
        this.TitleName === "完成"
      ) {
        return [
          [
            "转理部门：",
            this.stepDetail.DispatchPersonDeptName,
            "转理人员：",
            this.stepDetail.DispatchPersonName,
            "处理时间：",
            this.stepDetail.ExecUpDateTime
          ],
          [
            "处理部门：",
            this.stepDetail.ExecDetpName,
            "处理人员：",
            this.stepDetail.ExecPersonName,
            "处理时间：",
            this.stepDetail.ExecUpDateTime
          ]
        ];
      } else {
        return false;
      }
    },
    MaDialogImgAndReply() {
      if (
        this.TitleName == "到场" ||
        this.TitleName == "处置" ||
        this.TitleName == "完工"
      ) {
        return {
          "上报图片：": this.imgExcel(this.stepDetail.Pictures),
          // "上报图片：": ["http://114.98.235.14:9819/upload/EventsImg/2019/9/5/2019090514152873.jpeg"],
          "处理回复：": this.stepDetail.OperRemarks
        };
      }else if (this.TitleName == "延期申请") {
        return {
          "延期时间：": this.stepDetail.PostponeTime,
          "延期内容：": this.stepDetail.OperRemarks
        };
      }else if(this.TitleName == "退单" || this.TitleName == "延期确认" || this.TitleName == "延期退回"){
        return {
          "退单内容：": this.stepDetail.OperRemarks
        };
      } else if (this.TitleName == "审核") {
        return {
          "反馈内容：": this.stepDetail.OperRemarks,
          "满意度：": this.stepDetail.Satisfaction
        };
      } else {
        return false;
      }
    }
  },
  methods: {
    isarray(val) {
      return _.isArray(val);
    },
    imgExcel(img) {
      let EventPictures = [];
      if (img) {
        EventPictures = img.split("|");
        let temp = [];
        _.forEach(EventPictures,element => {
          temp.push(config.apiPath.systemUrl + element)
        });
        return temp;
      }
    }
  }
};
</script>
<style lang="stylus">
.title_time {
  font-size: 14px;
  color: #333;
}

.dialog-table-lable {
  width: 82px !important;
}
</style>