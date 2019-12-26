<template>
  <div class="Login_container">
    <img src="@assets/hedalogo.png" alt class="logo" />
    <div class="login-form-wrapper">
      <el-form label-width="0" :model="formData" ref="formRule" :rules="rules" class="loginForm">
        <el-form-item prop="loginContent">
          <el-input placeholder="请输入用户名" v-model="formData.loginContent"></el-input>
          <span class="left-form-icon">
            <i class="iconfont icon-denglu-"></i>
          </span>
        </el-form-item>
        <el-form-item prop="password" style="padding-top:10px;">
          <el-input
            placeholder="请输入密码"
            v-model="formData.password"
            @keyup.enter.native="loginSubmit"
            type="password"
          ></el-input>
          <span class="left-form-icon">
            <i class="iconfont icon-denglu-1"></i>
          </span>
        </el-form-item>
        <el-form-item class="Login-submit-wrapper">
          <el-button class="Login-submit" @click="loginSubmit" :loading="loginLoading">提 交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import loginSystem from "@api/SystemSetting/loginSystem";
import { mapState, mapActions, mapGetters } from "vuex";
import VueRoute from "@router/route";

export default {
  data() {
    return {
      loginLoading: false,
      rules: {
        loginContent: [
          { required: true, message: "请输入账户名称", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      formData: {
        loginContent: "",
        password: ""
      }
    };
  },
  created() {
    localStorage.removeItem("iAdminID");
    this.userStatus(undefined);
  },
  computed: {
    ...mapState("login", ["cAdminName", "userToken"]),
    ...mapGetters("login", ["addRoute", "MenusTreeData"])
  },
  methods: {
    ...mapActions("login", ["userStatus"]),
    loginSubmit() {
      this.$refs.formRule.validate(valid => {
        if (valid) {
          this.loginLoading = true;
          loginSystem.loginSystem(this.formData).then(res => {
            this.loginLoading = false;
            if (res.data.ErrorType == 3) {
              let currentUser = res.data.Data.Result;
              let allowStamptime = new Date();
              let UserID = {};
              UserID.iAdminID = currentUser.iAdminID;
              allowStamptime.setDate(allowStamptime.getDate() + 1);
              UserID.Token = currentUser.Token;
              UserID.cAdminName = currentUser.cAdminName;
              UserID.exprise = allowStamptime.getTime();
              UserID.iDeptID = currentUser.iDeptID;
              localStorage.setItem("iAdminID", JSON.stringify(UserID));
              this.userStatus(currentUser);
              let addRoute = this.addRoute
              sessionStorage.setItem("store", true);
              if (_.keys(this.MenusTreeData).length) {
                this.$router.addRoutes(this.addRoute);
                location.replace("/");
              } else {
                this.$router.push({ name: "NoPermission" });
                return;
              }
            } else {
              localStorage.removeItem("iAdminID");
              sessionStorage.setItem("store", false);
              this.userStatus(undefined);
              this.formData = {
                loginContent: "",
                password: ""
              };
              this.$myMessage("error", res.data.Msg);
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="stylus"></style>
