<template>
  <div class="table_style">
    <el-row type="flex" class="modularWrapper">
      <el-col class="table-flex-wraper">
        <el-form label-width="80px">
          <el-row>
            <el-col span="5" :xs="14" :lg="3">
              <el-form-item label="版本号：">
                <el-input v-model="VersionId" size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col span="19" :xs="24" >
              <el-row type="flex" justify="start" style="padding:0">
                <el-form-item label-width="20px">
                  <el-upload
                    class="uploadWrapper"
                    ref="upload"
                    :action="appUploadList + '?VersionId=' + VersionId "
                    :headers="uploadHeaders"
                    :on-remove="handleRemove"
                    :auto-upload="false"
                    name="filds"
                    :on-exceed="handleExceed"
                    :limit="1"
                    :on-success="successUpload"
                    :on-error="errorUpload"
                    :on-change="handleChange"
                  >
                    <el-button
                      slot="trigger"
                      size="mini"
                      class="my-choose-point"
                      type="primary"
                    >选取文件</el-button>
                    <div style="padding-left:20px;">
                      <el-button
                        class="my-search"
                        size="mini"
                        @click="submitUpload"
                        :loading="sunBtnLoad"
                      >上传到服务器</el-button>
                    </div>
                    <div slot="tip" class="el-upload__tip" v-show="!fileList.length">
                      <p>只能上传apk文件，且文件名为V x.x.x格式</p>
                    </div>
                  </el-upload>
                </el-form-item>
              </el-row>
            </el-col>
            <!-- <el-button
                class="my-search"
                size="mini"
                @click="submitUpload"
                :loading="sunBtnLoad"
            >上传到服务器</el-button>-->
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
      VersionId: "",
      fileList: [],
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
    filePreview(filds) {
      console.log(filds);
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    //获取app列表
    getAppList() {
      this.loading = true;
      CellphoneManage.getAppList(this.GetformValue).then(res => {
        this.loading = false;
        this.dataTotal = res.data.Data.TotalRows;
        this.tableData = res.data.Data.Result;
      });
    },
    //限制上传一个
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    //上传成功
    successUpload(res) {
      this.sunBtnLoad = false;
      if (res.ErrorType === 3) {
        this.$message({
          type: "success",
          message: "上传成功"
        });
        this.$refs.upload.clearFiles()
        this.getAppList();
      } else {
        this.$message({
          type: "error",
          message: res.Msg
        });
        this.$refs.upload.clearFiles()
      }
    },
    //上传失败
    errorUpload(res) {
      this.sunBtnLoad = false;
      this.$message({
        type: "error",
        message: res.Msg
      });
      this.$refs.upload.clearFiles()
    },
    //上传事件
    submitUpload() {
      console.log(this.fileList)
      if (!this.VersionId) {
        this.$message({
          type: "warning",
          message: "版本号为必填项",
          showClose: true
        });
      } else if(!this.fileList.length){
        this.$message({
          type: "warning",
          message: "文件未选择",
          showClose: true
        });
      }else {
        this.sunBtnLoad = true;
        this.$refs.upload.submit();
      }
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
