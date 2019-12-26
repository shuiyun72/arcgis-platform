<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="300"
    :before-close="handleClose"
    customClass="el_add_dialog"
    class="myDialog"
  >
    <el-form label-width="80px">
      <el-row
        v-for="item  in editClumn"
        :key="item"
        class="form-row margin0 condinary-row"
        gutter="10"
      >
        <el-form-item :label="item.text + '：'">
          <el-date-picker
            style="width:95%;"
            v-if="item.type === 'Date'"
            v-model="formObj[item.field]"
            type="date"
            value-format="yyyy-MM-dd"
            size="mini"
          ></el-date-picker>
          <el-select v-else-if="item.type === 'Boolean'" v-model="formObj[item.field]" size="mini">
            <el-option label="开启" value="true"></el-option>
            <el-option label="关闭" value="false"></el-option>
          </el-select>
          <el-input
            :disabled="item.disabled"
            v-else-if="item.dom === 'TextArea'"
            size="mini"
            v-model="formObj[item.field]"
            :placeholder="'请输入' + item.text"
            type="textarea"
            :rows="2"
          ></el-input>
          <el-input-number
            v-else-if="item.type === 'Number'"
            size="mini"
            :min="item.min"
            :max="item.max"
            controls-position="right"
            v-model="formObj[item.field]"
            :placeholder="'请输入' + item.text"
          ></el-input-number>
          <el-upload
            v-else-if="item.dom === 'Upload' && item.type === 'img'"
            class="avatar-uploader"
            ref="Upload"
            :http-request="option => httpRequest(option , item)"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :show-file-list="false"
          >
            <img v-if="filesUrl" :src="IPUrl + filesUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-upload
            v-else-if="item.dom === 'Upload'"
            ref="Upload"
            :http-request="option => httpRequest(option , item)"
            :on-change="handleChange"
            :on-preview=" file => handlePreview(file , item)"
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-success="successUpload(item)"
          >
            <el-button size="mini" class="my-upload">上传图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
          <el-input v-else v-model="formObj[item.field]" style="width:95%;" v-filter-special-char></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="my-dialog-cancel" @click="cancelBtn">取 消</el-button>
      <el-button
        class="my-dialog-submit"
        @click="editFormSubmit"
        :disabled="imageUpload"
        :loading="btnLoading"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import _ from "lodash";
import * as GisTableColumn from "@common/consts/GisConst/GisTableColumn";
import { FeatureLayerOperation } from "@common/consts/GisConst/MapConfigure";
import MapDataOperation from "@services/ArcMap/MapDataOperation";
import config from "@config/config.js";
import axios from "axios";
import { mapState } from "vuex";
export default {
  props: {
    //是否显示
    dialogVisible: {
      type: Boolean,
      default: false
    },
    //需要编辑的信息
    editClumn: {
      type: Array,
      default: []
    },
    layerDataValue: {
      type: String,
      default: ""
    },
    currentRow: {
      type: Object,
      default: {}
    }
  },
  created() {
    //地图数据操作
    this._MapDataOperation = new MapDataOperation();
    this._MapDataOperation.init().then(() => {
      //this.onLayerSelectChange();
    });
  },
  computed: {
    ...mapState("login", ["iAdminID", "cAdminName", "userToken"])
  },
  watch: {
    editClumn() {
      this.formObj = {};
      _.forEach(this.editClumn, item => {
        if (item.dom === "Upload" && item.type === "img") {
          this.filesUrl = this.currentRow[item.field];
        }
        this.$set(this.formObj, item.field, this.currentRow[item.field]);
      });
    }
  },
  data() {
    return {
      imageUpload: false,
      btnLoading: false,
      fileList: [],
      formObj: [],
      attrValueList: {},
      filesUrl: "", //返回结果集
      IPUrl: config.apiPath.insURL, //图片的ip前缀
      uploadUrl: config.apiPath.insURL + "/api/UpLoadFile/UpLoad"
    };
  },

  methods: {
    handleChange(file, fileList) {
      this.fileList = file;
    },
    handleRemove() {
      this.filesUrl = "";
    },
    //自定义文件上传
    httpRequest(options, item) {
      if (!options.file) return;
      let file = options.file;
      let formData = new FormData();
      formData.append("file", file);
      let config = {
        url: this.uploadUrl,
        method: "post",
        //
        headers: {
          token: this.$store.state.login.userToken
        },
        data: formData,
        file: file,
        timeout: 10000,
        onUploadProgress: function(progressEvent) {
          progressEvent.percent =
            (progressEvent.loaded / progressEvent.total) * 100;
          options.onProgress(progressEvent, file);
        }
      };
      axios(config)
        .then(res => {
          if (res.data.ErrorType === 3) {
           
            this.filesUrl = res.data.Msg.split("|")[0];
            this.formObj[item.field] = this.filesUrl;
            options.onSuccess(res, file);
          } else {
            this.$myMessage("error", res.data.Msg);
            options.onError(err);
          }
        })
        .catch(err => {
          options.onError(err);
        });
    },

    //关闭弹窗
    handleClose(done) {
      this.fileList = [];
      this.formObj = {};
      this.attrValueList = {};
      this.filesUrl = "";
      done();
    },
    //form取消按钮
    cancelBtn() {
      this.fileList = [];
      this.formObj = {};
      this.attrValueList = {};
      this.filesUrl = "";
      this.$emit("update:dialogVisible", false);
    },
    //form确定按钮
    editFormSubmit() {
      this.btnLoading = true;
      //图层新增编辑属性删除操作方法
      let pipeURL = FeatureLayerOperation.getLayerURLByName(
        this.layerDataValue
      );
      this._MapDataOperation.featureQuery(
        null,
        "OBJECTID = '" + this.currentRow.OBJECTID + "'",
        pipeURL,
        resultValue => {
          let editInfo = resultValue[0];
          Object.assign(editInfo.attributes, this.formObj);
          this.$bus.$emit(
            "featureLayerApplyEdits",
            this.layerDataValue,
            editInfo,
            "edit",
            () => {
              this.btnLoading = false;
              this.$myMessage("success", "编辑成功");
              this.$emit("loadData");
              this.cancelBtn();
            },
            err => {
              this.btnLoading = false;
              this.$myMessage("error", "编辑失败请重试");
              this.cancelBtn();
            }
          );
        }
      );
    },
    //查询下拉的属性的列表LSIt
    searchMethods(GroupField, index) {
      let pipeURL = FeatureLayerOperation.getLayerURLByName(
        this.layerDataValue
      );
      this.MapDataOperation.searchOrCountCondition(
        GroupField,
        pipeURL,
        resultValue => {
          let attrValueList = _.map(resultValue, item => {
            return item[GroupField];
          });
          attrValueList = _.filter(attrValueList, item => {
            if (item) {
              return item.trim();
            }
          });
          if (attrValueList.length) {
            this.$set(this.attrValueList, GroupField, _.sortBy(attrValueList));
          } else {
            this.attrValueList[GroupField] = [];
          }
        }
      );
    }
  }
};
</script>










