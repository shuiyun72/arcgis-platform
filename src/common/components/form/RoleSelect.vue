


<template>
  <el-select v-model="valueId" placeholder="请选择岗位" @change="selectChange">
    <el-option key="全部" label="全部" value="''" v-show="allState"></el-option>
    <el-option
      v-for="item in RoleList"
      :key="item.iRoleID"
      :label="item.cRoleName"
      :value="item.iRoleID"
    ></el-option>
  </el-select>
</template>
<script>
import Role from "@api/SystemSetting/Role";
export default {
  props: ["selectValue", "name", "allState"],
  data() {
    return {
      RoleList: [],
      loading: true,
      valueId: this.selectValue // 初始值
    };
  },
  created() {
    this.getRoleList();
  },
  watch: {
    selectValue() {
      this.valueId = this.selectValue;
    }
  },
  methods: {
    selectChange() {
      this.$emit("update:selectValue", this.valueId);
    },
    getRoleList() {
      if (this.$store.state.system.roleList.length) {
        this.RoleList = this.$store.state.system.roleList;
        this.loading = false;
      } else {
        this.loading = true;
        Role.getRoleList().then(res => {
          this.loading = false;
          this.RoleList = res.data.Data.Result;
          this.$store.dispatch("system/setState", {
            name: "roleList",
            value: res.data.Data.Result
          });
        });
      }
    }
  }
};
</script>