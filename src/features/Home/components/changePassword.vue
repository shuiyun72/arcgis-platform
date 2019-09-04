<template>
  <el-dialog
    title="修改密码"
    :visible.sync="userPasswordVisible"
    :before-close="handleClose"
    class="myDialog"
    :width="'400px'"
  >
    <el-form label-width="86px" :model="formData" ref="formRule" :rules="rules">
      <el-form-item label="原始密码：" prop="NowPassword">
        <el-input size="mini" placeholder="请输入原始密码" v-model="formData.NowPassword"></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="cAdminPassWord">
        <el-input size="mini" placeholder="请输入新密码" v-model="formData.cAdminPassWord"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="repeatPassWord2">
        <el-input size="mini" placeholder="请输入名称" v-model="formData.repeatPassWord2"></el-input>
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center" class="dialog-footer" slot="footer">
      <el-button class="my-dialog-submit" @click="userPasswordVisible = false" size="mini">提 交</el-button>
      <el-button class="my-dialog-cancel" @click="cancleClick" size="mini">取 消</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import User from "@api/SystemSetting/User";
import { valid } from "semver";
export default {
  props: ["userPasswordVisible"],
  data() {
    return {
      rules: {
        NowPassword: [
          { required: true, message: "请输入功能名称", trigger: "blur" }
        ],
        cAdminPassWord: [
          { required: true, message: "请输入功能URl", trigger: "blur" }
        ],
        repeatPassWord2: [
          { required: true, message: "请输入功能URl", trigger: "blur" }
        ]
      },
      NowPassword: "",
      formData: {
        iAdminID: "",
        cAdminPassWord: "",
        repeatPassWord2: "",
        NowPassword: ""
      }
    };
  },
  created() {
    this.getNowPassword();
  },
  methods: {
    getNowPassword() {
      this.iAdminID = 1258
      this.NowPassword = 123445
    },
    handleClose(done) {
      this.$emit("update:userPasswordVisible", false);
      done();
    },
    cancleClick() {
      this.$emit("update:userPasswordVisible", false);
    },
    ChangePassword() {
      this.$refs.formRule.validate(valid => {
        if (valid) {
          if (this.NowPassword !== this.formData.NowPassword) {
            return false;
          }
          
          User.ChangePassword(this.formData).then(res => {
            console.log(res);
          });
        }
      });
    }
  }
};
</script>

