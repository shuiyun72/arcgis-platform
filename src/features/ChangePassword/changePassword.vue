<template>
  <div class="Login_container">
    <img src="@assets/hedalogo.png" alt class="logo" />
    <div class="login-form-wrapper" style="padding:0">
       <div class="title">修改密码</div>
      <el-form
        label-width="0"
        :model="formData"
        ref="formRule"
        :rules="rules"
        class="password-form"
      >
       <p class="input-title">原密码</p>
        <el-form-item prop="oldcAdminPassWord">
          <el-input size="mini" placeholder="请输入原始密码" v-model="formData.oldcAdminPassWord"></el-input>
        </el-form-item>
        <p class="input-title">新密码</p>
        <el-form-item prop="cAdminPassWord" style="margin-bottom:10px">
          <el-input size="mini" placeholder="请输入新密码" v-model="formData.cAdminPassWord" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="repeatPassWord2">
          <el-input size="mini" placeholder="请输入重新输入密码" v-model="formData.repeatPassWord2" type="password"></el-input>
        </el-form-item>
        <el-row >
          <el-button class="password-submit" @click="ChangePassword" style="margin-right:20px">保 存</el-button>
          <el-button class="password-cancel" @click="cancleClick">取 消</el-button>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import User from "@api/SystemSetting/User";
export default {
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value !== this.formData.cAdminPassWord) {
        callback(new Error("密码错误!"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        oldcAdminPassWord: [
          { required: true, message: "请输入原始密码", trigger: "blur" },
        ],
        cAdminPassWord: [
          { required: true, message: "请输入新密码", trigger: "blur" }
        ],
        repeatPassWord2: [
          { required: true, message: "请输入重新输入密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" }
        ]
      },
      formData: {
        iAdminID: "",
        cAdminName:'',
        cAdminPassWord: "",
        repeatPassWord2: "",
        oldcAdminPassWord: ""
      }
    };
  },
  created() {
    this.getOldcAdminPassWord();
  },
  methods: {
    getOldcAdminPassWord() {
      let currentUser = JSON.parse(localStorage.getItem("iAdminID"));
      if (currentUser) {
        this.formData.iAdminID = currentUser.iAdminID;
        this.formData.cAdminName = currentUser.cAdminName;
      }else{
        this.$route,push({name:'login'})
      }
    },
    cancleClick() {
      this.$router.push("/");
    },
    ChangePassword() {
      this.$refs.formRule.validate(valid => {
        if (valid) {
          User.ChangePassword(this.formData).then(res => {
            if (res.data.ErrorType === 3) {
              this.$message({
                type: "success",
                message: "成功修改密码"
              });
            } else {
              this.$message({
                type: "error",
                message: "系统错误请重试"
              });
            }
            this.formData.cAdminPassWord = "";
            this.formData.repeatPassWord2 = "";
            this.formData.oldcAdminPassWord = "";
          });
        }
      });
    }
  }
};
</script>
