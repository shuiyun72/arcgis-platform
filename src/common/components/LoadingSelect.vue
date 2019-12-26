
<template>
  <el-select
    size="mini"
    v-model="listValue"
    :filterable="true"
    :default-first-option="true"
    v-el-select-loadmore="loadmore"
    :placeholder="placeholder"
    :disabled="disabled"
    @change="listValueEmit"
  ><el-option label="全部" value size="mini" v-if="all"></el-option>
    <el-option
      v-for="(item,index) in userItems"
      :label="lableStr ? item[lableStr] :item"
      :value="valueStr ? item[valueStr] :item "
      :key="index"
    ></el-option>
  </el-select>
</template>
<script>
import _ from "lodash";
export default {
  name: "el-loading-select",
  props: {
    //是否可以选择
    disabled: {
      type: Boolean,
      default: false
    },
    //是否展示全部
    all: {
      type: Boolean,
      default: false
    },
    //总数组
    list: {
      type: Array,
      default: []
    },
    placeholder: {
      type: String,
      default: "请选择用户"
    },
    listValue: {
      default: ""
    },
    //下拉的lable
    lableStr: {
      type: String,
      default: ""
    },
    //下拉的value
    valueStr: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      userItems: [], //下拉数组
      formData: {
        //下拉参数
        pageIndex: 1,
        pageSize: 20
      }
    };
  },
  created(){
    this.getUsers()
  },
  watch:{
    list(){
      this.list.length && this.getUsers()
    }
  },
  methods: {
    loadmore() {
      this.formData.pageIndex++;
      this.getUsers(this.formData);
    },

    getUsers(v) {
      let num = ~~this.formData.pageIndex * ~~this.formData.pageSize;
      this.userItems = this.list.filter((item, index, arr) => {
        return index < num;
      });
    },
    listValueEmit(){
      this.$emit("update:listValue",this.listValue)
    }
  }
};
</script>