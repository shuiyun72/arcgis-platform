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
          <el-button class="Login-submit" @click="IsLocked" :loading="loginLoading">提 交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import loginSystem from "@api/SystemSetting/loginSystem";
import User from "@api/SystemSetting/User";
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
    ...mapGetters("login", ["addRoute"])
  },
  methods: {
    ...mapActions("login", ["userStatus"]),
    // 判断用户是否被锁定
    IsLocked() {
      this.$refs.formRule.validate(valid => {
        if (valid) {
          // User.getUserList(res=>{
          //   console.log(res.data.Data.result);
          //   let temp = res.data.Data.result;
          //   let user = temp.filter(res => {
          //     return item.cAdminName == this.formData.loginContent;
          //   });
          //   if (user.iIsLocked) {
          //     this.loginSubmit();
          //   } else {
          //     this.$message("此账号已被锁定,请联系管理员");
          //   }
          // })
          this.loginSubmit();
        }
      });
    },
    loginSubmit() {
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
          UserID.dExpireDate = currentUser.dExpireDate;
          UserID.iDeptID = currentUser.iDeptID;
          localStorage.setItem("iAdminID", JSON.stringify(UserID));
          this.userStatus(currentUser);
          sessionStorage.setItem(
            "store",
            JSON.stringify(this.$store.state.login)
          );
          this.$router.addRoutes(this.addRoute);
          location.replace("/");
        } else {
          localStorage.removeItem("iAdminID");
          this.userStatus(undefined);
          this.formData = {
            loginContent: "",
            password: ""
          };
          this.$message({
            type: "error",
            message: "用户名或密码错误，请重新登陆"
          });
        }
      });
    }
  }
};
</script>

<style lang="stylus"></style>
