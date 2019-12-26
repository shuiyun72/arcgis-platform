<template>
  <div class="table_style">
    <el-row type="flex" class="modularWrapper">
      <el-col class="table-flex-wraper">
        <el-form label-width="80px">
          <el-row>
            <el-col span="19" :xs="24">
              <el-row type="flex" justify="start" style="padding:0">
                <el-form-item label-width="20px">
                  <!-- <el-upload
                    class="uploadWrapper"
                    :http-request="httpRequest"
                    :show-file-list="false"
                  >
                    <el-button
                      slot="trigger"
                      size="mini"
                      class="my-choose-point"
                      type="primary"
                    >上传文件</el-button>
                    <div slot="tip" class="el-upload__tip">
                      <p>只能上传apk文件，且文件名为V x.x.x格式</p>
                    </div>
                  </el-upload>-->
                  <el-upload
                    :action="appUploadList + '?VersionId=' + VersionId"
                    :auto-upload="false"
                    class="uploadWrapper"
                    ref="upload"
                    :headers="uploadHeaders"
                    name="filds"
                    :on-success="successUpload"
                    :on-error="errorUpload"
                    :on-change="handleChange"
                  >
                    <el-button
                      slot="trigger"
                      size="mini"
                      class="my-choose-point"
                      type="primary"
                    >上传文件</el-button>
                    <div slot="tip" class="el-upload__tip" v-show="!uploading" style="order: 8;">
                      <p>只能上传apk文件，且文件名为V x.x.x格式</p>
                    </div>
                  </el-upload>
                </el-form-item>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
        <SysTable
          :tableData="tableData"
          :loading="loading"
          :layerListName="'AppUpload_Columns'"
          :paginationShow="true"
          @currentChange="currentChange"
          @onPageSizeChange="onPageSizeChange"
          @onPageChange="onPageChange"
          :pageNumber="GetformValue.page"
          :pageSize="GetformValue.num"
          :dataTotal="dataTotal"
        ></SysTable>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CellphoneManage from "@api/CellphoneManage/CellphoneManage";
//模块
import SysTable from "@features/SystemSetting/components/SysTable";
export default {
  components: { SysTable },
  data() {
    return {
      loading: false,
      appUploadList: CellphoneManage.appUploadList,
      uploadHeaders: {},
      VersionId: "", //版本号
      tableData: [], //表格显示数据
      dataTotal: 1, //表格显示总数据
      currentRow: null, //表格当前行
      sunBtnLoad: false, //form提交加载
      GetformValue: {
        num: 50,
        page: 1
      } //查询变量
    };
  },
  created() {
    if (this.$store.state.login.userToken) {
      this.uploadHeaders.Token = this.$store.state.login.userToken;
    }
    this.getAppList();
  },
  computed: {},
  methods: {
    //获取app列表
    getAppList() {
      this.loading = true;
      CellphoneManage.getAppList(this.GetformValue).then(res => {
        this.loading = false;
        this.dataTotal = res.data.Data.TotalRows;
        this.tableData = res.data.Data.Result;
      });
    },
    handleChange(file, fileList) {
      if (!file) return;
      let filename = file.name;
      let pattern = /V(\d+(\.\d+){2})/;
      this.VersionId = "1.1.2";
      console.log(this.VersionId);
      if (!pattern.test(filename)) {
        this.$myMessage("error", "文件名应为V x.x.x格式");
        this.$refs.upload.clearFiles();
        return;
      } else {
        this.VersionId = filename.match(pattern)[1];
      }
      pattern = /\.apk$/;
      if (!pattern.test(filename)) {
        this.$myMessage("error", "请上传apk文件");
        this.$refs.upload.clearFiles();
        return;
      }
      this.$nextTick(() => {
        this.$refs.upload.submit();
      });
    },
    //上传成功
    successUpload(res) {
      if (res.ErrorType === 3) {
        this.$myMessage("success", "上传成功");
        this.$refs.upload.clearFiles();
        this.getAppList();
      } else {
        this.$message({
          type: "error",
          message: res.Msg,
          showClose: true
        });
        this.$refs.upload.clearFiles();
      }
    },
    //上传失败
    errorUpload(res) {
      this.$myMessage("error", res.Msg);
      this.$refs.upload.clearFiles();
    },
    //表格点击事件
    currentChange(val) {
      this.currentRow = val;
    },
    //分页change
    onPageSizeChange(val) {
      this.GetformValue.num = val;
      this.GetformValue.page = 1;
      this.getAppList();
    },
    //页码change
    onPageChange(val) {
      this.GetformValue.page = val;
      this.getAppList();
    }
  }
};
</script>

<style lang="stylus">
.uploadWrapper {
  display: flex;

  .el-upload-list__item-name [class^=el-icon], .el-upload-list__item-name {
    color: #cdcfd2;
  }

  .el-upload__tip {
    color: #cdcfd2;
    padding-left: 20px;
    display: block;
    position: relative;
    transition: all 2s 2s ease;

    p {
      position: absolute;
      white-space: nowrap;
    }
  }

  .el-upload-list__item:hover .el-icon-close {
    top: 8px;
    color: #cdcfd2;
  }

  .el-upload-list__item:first-child {
    margin-top: 0;
    margin-left: 10px;
    color: #fff;
    line-height: 2.1;
  }

  .el-upload-list__item:hover {
    border-radius: 2px;
    background-color: #41516a;
  }
}
</style>
