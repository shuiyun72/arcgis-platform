<template>
  <el-form>
    <el-row class="title" :style="{color:color }" >
        {{TitleName}}
        <span class="title_time" >({{TitleTime}})</span>
    </el-row>
    <!-- <el-row  v-for="(item,index) in MaDialogDispose" :key="index"  class="dialog-table">
        <el-col :span="3" class="dialog-table-lable">{{item.name1}}</el-col>
        <el-col :span="4">{{item.val1}}</el-col>
        <el-col :span="3" class="dialog-table-lable">{{item.name2}}</el-col>
        <el-col :span="4">{{item.val2}}</el-col>
        <el-col :span="3" class="dialog-table-lable">{{item.name3}}</el-col>
        <el-col :span="7">{{item.val3}}</el-col>
    </el-row> -->
    <table border="1" class="dialog-table">
      <tr  v-for="(item,index) in MaDialogDispose" :key="index"  class="wrapperCol">
          <td class="dialog-table-lable">{{item[0]}}</td>
          <td>{{item[1]}}</td>
          <td class="dialog-table-lable">{{item[2]}}</td>
          <td>{{item[3]}}</td>
          <td class="dialog-table-lable">{{item[4]}}</td>
          <td>{{item[5]}}</td>
      </tr>
      <tr  v-for="(item,index) in MaDialogImgAndReply" :key="index" class="wrapperCol" 
        :class="{'dialog_img-wrapper': isarray(item) && item.length}">
        <td class="dialog-table-lable">{{index}}</td>
        <td colspan="5" class="dialog_img" v-if="isarray(item)">
          <a :href="image"  target="_blank" v-for="(image,index) in item" :key="index" ><img :src="image" alt  /></a>
        </td>
        <td colspan="5" v-else>{{item}}</td>
      </tr>
    </table>
  </el-form>
</template>
<script>
import _ from "lodash";

export default {
  components: {},
  props:{
    TitleName:{
      fooMessage:String,
      required:true
    },
    color:{
      default:'#7a7e80'
    }
   /* MaDialogDisposeData:{

    }*/
  },
  data() {
    return {
      TitleName: "处理",
      TitleTime: "2019/4/19 17:12:26",
      // WorkListInfo.aspx?EventID=516 
      MaDialogDisposeData: {      
        EventID: 516,
        EventCode: "LS190000516",
        EventAddress: "天隆嘉苑南区",
        UpTime: "2019-04-19T17:12:26",
        DeptId: 44,
        PersonId: 378,
        PersonName: "索凯龙",
        cDepName: "监控中心",
        cRoleName: "科员",
        EventTypeId: 1127,
        EventTypeId2: 1152,
        EventTypeName: "水压",
        EventTypeName2: "其他",
        EventFromId: 4,
        EventFromName: "临时工作",
        UrgencyId: 1,
        UrgencyName: "一般",
        DispatchPerson: 378,
        DispatchPersonName: "索凯龙",
        EventPictures: "/image/2019/4/19/201904191712259604.jpeg",
        EventDesc: null,
        EventX: "109.74807679674996",
        EventY: "39.57844197728264",
        EventUpdateTime: "2019-04-19T17:12:44",
        IsValid: 1,
        IsValidName: "正常",
        Devicesmid: null,
        DevicesType: null,
        DeleteStatus: "0",
        TaskId: -1,
        Remark_Back: null,
        OtherSysEventId: null,
        ExecTime: 36,
        OperId: 7,
        OperName: "审核",
        OrderId: 254,
        IsFinish: 1,
        LinkMan: "索凯龙",
        LinkCall: "12345678910",
        EventStatus: 0,
        StatusName: "正常",
        ExecPersonId: null,
        ExecUpDateTime: "2019-04-22T10:28:55.567",
        ExecDetpID: null,
        ExecDetpName: null,
        ExecPersonName: null,
        DispatchPersonID: 1,
        DispatchPersonName2: "admin",
        DispatchPersonDeptName: "维修养护部",
        OperName2: "完成",
        OperRemarks: null,
        DispatchPersonTelePhone: "18004819187"
      }
    };
  },
  computed: {
    MaDialogDispose() {
      if(this.TitleName == '处理'){
        return [
          [ "转理部门:", this.MaDialogDisposeData.cDepName ,
            "转理人员:", this.MaDialogDisposeData.PersonName,
            "处理时间:", this.MaDialogDisposeData.UpTime 
          ],
          [
            "处理部门：", this.MaDialogDisposeData.cDepName ,
            "处理人员：", this.MaDialogDisposeData.PersonName ,
            "处理时间：", this.MaDialogDisposeData.UpTime
          ]
        ];
      }
      else if(this.TitleName == '分派'){
        return [
         [ "转理部门：", this.MaDialogDisposeData.cDepName ,
           "转理人员：", this.MaDialogDisposeData.PersonName,
           "处理时间：", this.MaDialogDisposeData.EventUpdateTime ],
          ["分派部门：",  this.MaDialogDisposeData.cDepName ,
          "分派人员：",  this.MaDialogDisposeData.PersonName ,
          "分派时间：",  this.MaDialogDisposeData.EventUpdateTime ] 
        ];
      }
      else if(this.TitleName == '接受'){
        return [
          ["接受部门：", this.MaDialogDisposeData.cDepName ,
            "接受人员：",  this.MaDialogDisposeData.PersonName,
            "接受时间：",  this.MaDialogDisposeData.EventUpdateTime ]
        ];
      }
      else if(this.TitleName == '到场'){
        return [
          [ "转理部门：", "" ,
           "转理人员：",  "",
           "处理时间：",  this.MaDialogDisposeData.EventUpdateTime ],
          [ "处理部门：",  this.MaDialogDisposeData.cDepName ,
          "处理人员：",  this.MaDialogDisposeData.PersonName ,
         "处理时间：", this.MaDialogDisposeData.ExecUpDateTime ]
          ];
      }
      else if(this.TitleName == '处置'){
        return [
          [ "转理部门：", "" ,
           "转理人员：", "",
           "处理时间：", this.MaDialogDisposeData.EventUpdateTime ],
          [ "处理部门：",  this.MaDialogDisposeData.cDepName ,
           "处理人员：", this.MaDialogDisposeData.PersonName ,
           "处理时间：",  this.MaDialogDisposeData.ExecUpDateTime ] 
        ];
      }
      else if(this.TitleName == '完工'){
        return [
          [ "转理部门：",  this.MaDialogDisposeData.DispatchPersonDeptName ,
           "转理人员：",  this.MaDialogDisposeData.DispatchPersonName2,
           "处理时间：",  this.MaDialogDisposeData.ExecUpDateTime ],
          [  "处理部门：",  this.MaDialogDisposeData.cDepName ,
           "处理人员：",  this.MaDialogDisposeData.PersonName ,
           "处理时间：",  this.MaDialogDisposeData.ExecUpDateTime ]
        ];
      } 
      else if(this.TitleName == '审核'){
        return [
          [ "转理部门：", this.MaDialogDisposeData.DispatchPersonDeptName ,
           "转理人员：",  this.MaDialogDisposeData.DispatchPersonName2,
           "处理时间：", this.MaDialogDisposeData.ExecUpDateTime],
          [ "处理部门：",  this.MaDialogDisposeData.cDepName ,
           "处理人员：", this.MaDialogDisposeData.PersonName ,
           "处理时间：", this.MaDialogDisposeData.ExecUpDateTime ] 
        ];
      }    
    },
    MaDialogImgAndReply(){
      if(this.TitleName == '到场'){
        return {
         // {name:"上报图片",val:this.MaDialogDisposeData.EventPictures},
          "上报图片：": ['http://116.117.157.176:30599//image/2019/4/19/201904191715363530.jpeg'],
          "处理回复：":"this.MaDialogDisposeData.EventPictures暂未找到"
        }
      }else
      if(this.TitleName == '处置'){
        return {
          // {name:"上报图片",val:this.MaDialogDisposeData.EventPictures},
         "上报图片：": ['http://116.117.157.176:30599//image/2019/4/19/201904191715363530.jpeg'],
         "处理回复：":"this.MaDialogDisposeData.EventPictures暂未找到",
        }
      }else
      if(this.TitleName == '完工'){
        return {
         // {name:"上报图片",val:this.MaDialogDisposeData.EventPictures},
          "上报图片：": ['http://116.117.157.176:30599//image/2019/4/19/201904191715363530.jpeg'],
          "处理回复：":"this.MaDialogDisposeData.EventPictures暂未找到",
        }
      }else{
        return false
      }

    } 
  },
  created() {
    this.TitleTime = this.MaDialogDisposeData.UpTime
  },
  methods: {
    isarray(val) {
      return _.isArray(val);
    },
  }
};
</script>
<style lang="stylus">
.title_time{
  font-size:14px;
  color:#333  
}
</style>