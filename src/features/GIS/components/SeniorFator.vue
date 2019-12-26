<template>
  <div class="fatorClass" v-show="seniorState" v-loading="loadingSelect">
    <el-row type="flex" class="select-wrapper">
      <div class="select-content">
        <el-form-item label="属性：" label-width="49px">
          <el-select
            v-model="fatorObj.attRListValue"
            placeholder="编号"
            @change="onAttRChange(fatorObj.attRListValue)"
            size="mini"
          >
            <el-option
              v-for="item in attRList"
              :key="item.field"
              :label="item.text"
              :value="item.field"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关系：" label-width="49px">
          <el-select v-model="fatorObj.mathDataValue" size="mini">
            <el-option
              v-for="math in mathData"
              :key="math.value"
              :label="math.text"
              :value="math.value"
              v-show=" !math.type || fatorObj.type === math.type || 
                      ( fatorObj.dom === 'Date' && math.type === 'Number')||
                       (!fatorObj.type && math.type === 'String')"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="值：" label-width="40px">
          <el-select
            v-if="fatorObj.dom === 'Select'"
            v-model="fatorObj.detailDataValue"
            placeholder
            size="mini"
          >
            <el-option v-for="item in attrValueList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-date-picker
            style="width:95%;"
            v-else-if="fatorObj.dom === 'Date'"
            v-model="fatorObj.detailDataValue"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini"
          ></el-date-picker>
          <el-select
            v-else-if="fatorObj.type === 'Boolean'"
            v-model="fatorObj.detailDataValue"
            size="mini"
          >
            <el-option label="开启" :value="true"></el-option>
            <el-option label="关闭" :value="false"></el-option>
          </el-select>
          <el-input v-else v-model="fatorObj.detailDataValue" style="width:95%;"></el-input>
        </el-form-item>
      </div>
      <el-button size="mini my-tianjia" @click="addOrSql('and')">添加</el-button>
    </el-row>
    <div class="condition-wrapper">
      <el-row class="title">
        <el-col span="6">属性</el-col>
        <el-col span="3">关系</el-col>
        <el-col span="6">值</el-col>
        <el-col span="6">条件</el-col>
        <el-col span="3">操作</el-col>
      </el-row>
      <el-scrollbar>
        <el-row v-for="(item , index ) in sqlCValue" :key="index">
          <el-col span="6">{{item.attRListValue}}</el-col>
          <el-col span="3">{{item.mathDataValue}}</el-col>
          <el-col span="6">{{item.detailDataValue}}</el-col>
          <el-col span="6">
            <el-radio-group v-model="item.type" @change="value => typeChange(index , value)">
              <el-radio label="and">与</el-radio>
              <el-radio label="or">或</el-radio>
            </el-radio-group>
          </el-col>
          <el-col span="3">
            <i class="iconfont icon-shanchu" @click="delCondition(index)"></i>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
    <div class="bottom-wrapper">
      <span class="clear-all" @click="clearSql">清空所有条件</span>
      <img
        src="@assets/toolIcon/UI/seniorTop.png"
        alt
        @click="seniorStateChange(false , true)"
        v-show="showSeniorTop"
      />
    </div>
  </div>
</template>
<script>
import * as GisTableColumn from "@common/consts/GisConst/GisTableColumn";
import {
  MapConfigure,
  LAYER_NAME_MAP,
  FeatureLayerOperation,
  LayerType
} from "@common/consts/GisConst/MapConfigure";
import MapDataOperation from "@services/ArcMap/MapDataOperation";
export default {
  props: {
    //当前查询的图层
    layerDataValue: {
      type: String,
      value: ""
    },
    //属性列表
    attRList: {
      type: Array,
      default: []
    },
    showSeniorTop: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      sqlValue: [], //查询所用的条件
      sqlCValue: [], //展示所用的条件
      attrValueList: [], //select下拉查询到的属性
      loadingSelect: false,
      fatorObj: {
        detailDataValue: "",
        mathDataValue: "",
        attRListValue: "",
        type: "", //是字符还是数字
        dom: "" //是下拉框还是时间选择，默认input
      }, //sql查询
      mathData: [
        {
          text: "等于",
          value: "="
        },
        {
          text: "大于",
          value: ">",
          type: "Number"
        },
        {
          text: "小于",
          value: "<",
          type: "Number"
        },
        {
          text: "大于等于",
          value: ">=",
          type: "Number"
        },
        {
          text: "小于等于",
          value: "<=",
          type: "Number"
        },
        {
          text: "不等于",
          value: "<>",
          type: "Number"
        },
        {
          text: "类似",
          value: "like",
          type: "String"
        }
      ],
      seniorState: false
    };
  },
  mounted() {
    this.fatorObj.mathDataValue = this.mathData[0].value;
    this.fatorObj.attRListValue = this.attRList[0] && this.attRList[0].field;
    this.onAttRChange();
    this._MapDataOperation = new MapDataOperation();
    this._MapDataOperation.init().then(() => {
      //this.onLayerSelectChange();
    });
  },
  watch: {
    attRList() {
      this.fatorObj.mathDataValue = this.mathData[0].value;
      this.fatorObj.attRListValue = this.attRList[0] && this.attRList[0].field;
      this.onAttRChange();
    }
  },
  methods: {
    //选中属性后控制输入框类型
    onAttRChange() {
      if (!this.attRList.length) return;
      let slectItem = _.filter(this.attRList, ele => {
        return ele.field === this.fatorObj.attRListValue;
      })[0];
      this.fatorObj.type = slectItem.type;
      this.fatorObj.dom = slectItem.dom;
      this.fatorObj.detailDataValue = "";
      if (slectItem.dom === "Select") {
        this.searchMethods();
      }
    },
    //属性值下拉选择数据
    searchMethods(GroupField, callBack) {
      this.attrValueList = [];
      let _GroupField = GroupField || this.fatorObj.attRListValue;
      let pipeURL = FeatureLayerOperation.getLayerURLByName(
        this.layerDataValue
      );
      this.loadingSelect = true;
      this._MapDataOperation.searchOrCountCondition(
        _GroupField,
        pipeURL,
        resultValue => {
          this.loadingSelect = false;
          if (_.isFunction(callBack)) {
            callBack(resultValue);
            return;
          }
          let attrValueList = _.map(resultValue, item => {
            return item[_GroupField];
          });
          attrValueList = _.filter(attrValueList, item => {
            if (item) {
              return _(item).trim();
            }
          });
          if (attrValueList.length) {
            this.attrValueList = _.sortBy(attrValueList);
          } else {
            this.attrValueList = [];
          }
        }
      );
    },
    //高级查询部分sql计算
    addOrSql(type) {
      let CForm = {
        type: type,
        attRListValue: "",
        mathDataValue: "",
        detailDataValue: this.fatorObj.detailDataValue
      };

      CForm.mathDataValue = _.filter(this.mathData, math => {
        return math.value === this.fatorObj.mathDataValue;
      })[0].text;
      CForm.attRListValue = _.filter(this.attRList, attR => {
        return attR.field === this.fatorObj.attRListValue;
      })[0].text;

      if (!this.fatorObj.detailDataValue) {
        this.$message({
          type: "warning",
          message: "请输入查询条件",
          showclose: true
        });
        return;
      }
      let detailDataValue = this.fatorObj.detailDataValue;
      if (this.fatorObj.mathDataValue == "like") {
        detailDataValue = `'%${detailDataValue}%'`;
      } else if (this.fatorObj.dom === "Date") {
        detailDataValue = `date '${detailDataValue}'`;
      } else if (this.fatorObj.type != "Number") {
        detailDataValue = `'${detailDataValue}'`;
      }

      this.sqlValue.push({
        value: `${this.fatorObj.attRListValue} ${this.fatorObj.mathDataValue} ${detailDataValue} `,
        type: type
      });
      this.sqlCValue.push(CForm);
    },
    //表格与或关系更改
    typeChange(index, value) {
      this.sqlValue[index].type = value;
    },
    //删除条件行
    delCondition(index) {
      this.sqlValue.splice(index, 1);
      this.sqlCValue.splice(index, 1);
    },
    //计算whereGIScondition的方法
    whereGISconditionFnc() {
      let whereGIScondition = "";
      if (this.sqlValue.length) {
        let orState = 0;

        let len = this.sqlValue.length;
        if (len === 1) {
          whereGIScondition = this.sqlValue[0].value;
        } else {
          _.forEach(this.sqlValue, (item, index) => {
            if (index) {
              if (item.type === "or") {
                whereGIScondition += ") or (" + item.value;
              } else {
                whereGIScondition += " " + item.type + " " + item.value;
              }
              if (index === len - 1) {
                whereGIScondition += ")";
              }
            } else {
              whereGIScondition += "(" + item.value;
            }
          });
        }
      }

      return whereGIScondition;
    },
    //控制组件显示隐藏 value edit确定使用value修改
    seniorStateChange(value, edit) {
      if (edit) {
        this.seniorState = value;
      } else {
        this.seniorState = !this.seniorState;
      }
      if (!this.seniorState) {
        this.cleanSeniorContion();
      } else {
        this.onAttRChange();
      }
    },
    //清空状态
    cleanSeniorContion() {
      this.clearSql();
      this.fatorObj = {
        mathDataValue: this.mathData[0].value,
        attRListValue: this.attRList[0].field,
        detailDataValue: ""
      };
    },
    //清空sql查询
    clearSql() {
      this.sqlValue = [];
      this.sqlCValue = [];
    }
  }
};
</script>