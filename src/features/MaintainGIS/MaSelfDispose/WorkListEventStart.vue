<template>
  <div class="MaintainGIS table_style" :class="{flexible:flexible}">
    <TableFormTitle :titleName="titleName" :flexible.sync="flexible"></TableFormTitle>
    
    <!-- <el-form label-width="83px" label-position="right" size="small" gutter="20px">
      <date-btn-choose @DateBtn="SubmitTime" ref="dateBtnChoose" :dataSpan="10"></date-btn-choose>
    </el-form> -->
    <initiate></initiate>
  </div>
</template>
<script>
import _ from "lodash";
import axios from "axios";
import * as disposeData from "../components/config.js";
import Initiate from "./component/Initiate";
import TableFormTitle from "@common/components/TableFormTitle";
export default {
  components: {
    Initiate,
    TableFormTitle
  },
  data(){
    return{
      flexible:false,
      titleName:"发起事件"
    }
  }
};
</script>
<style lang="stylus" scoped>
.Home_container .mian-wrapper .main-body .leftContain {
    width: 15%;
}
</style>