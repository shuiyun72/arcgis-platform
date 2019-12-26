<template>
  <div class="Map_Action_Bar_Layer_Win">
    <div class="Win_Title">
      <span class="text">打印设置</span>
      <span @click="closeLayer('print')" class="icon">
        <i class="iconfont icon-shousuo"></i>
      </span>
    </div>
    <div class="print_List">
      <el-scrollbar>
        <el-form ref="form" :model="printForm" label-width="100px" class="print-wrapper">
          <el-form-item label="文件标题：">
            <el-input v-model="printForm.label"></el-input>
          </el-form-item>
          <el-form-item label="页面设置：">
            <el-select v-model="printForm.layout">
              <el-option
                v-for="item in printLableList"
                :key="item.value"
                :value="item.value"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件格式">
            <el-select v-model="printForm.format">
              <el-option
                v-for="item in formatList"
                :key="item.value"
                :value="item.value"
                :label="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题名称：">
            <el-input v-model="printForm.options.titleText" placeholder="请输入标题名称"></el-input>
          </el-form-item>
          <el-form-item label="制作人：">
            <el-input v-model="printForm.options.authorText" placeholder="请输入制作人名称"></el-input>
          </el-form-item>
          <el-form-item label="详细信息：">
            <el-input v-model="printForm.options.copyrightText" placeholder="请输入详细信息"></el-input>
          </el-form-item>
          <el-form-item label="比例尺单位">
            <el-select v-model="printForm.options.scalebarUnit">
              <el-option
                v-for="item in scalebarUnitList"
                :key="item.value"
                :value="item.value"
                :label="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              style="font-size:14px;"
              class="my-dialog-submit"
              size="mini"
              @click="printFnc"
            >立即创建</el-button>
            <el-button
              style="font-size:14px;"
              class="my-dialog-cancel"
              size="mini"
              @click="closeLayer('print')"
            >取&nbsp;&nbsp;消</el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  props: ["toolbar"],
  data() {
    return {
      printForm: {
        label: "Landscape (PDF)",
        layout: "A4 Landscape",
        format: "pdf",
        options: {
          titleText: "",
          authorText: "",
          copyrightText: "",
          scalebarUnit: "Meters"
        }
      },
      printLableList: [
        {
          name: "A3横向",
          value: "A3 Landscape"
        },
        {
          name: "A3纵向",
          value: "A3 Portrait	"
        },
        {
          name: "A4横向",
          value: "A4 Landscape"
        },
        {
          name: "A4纵向",
          value: "A4 Portrait"
        },
        {
          name: "信纸 ANSI A 横向",
          value: "Letter Ansi A Landscape"
        },
        {
          name: "信纸 ANSI A 纵向",
          value: "Letter Ansi B Portrait"
        },
        {
          name: "文摘 ANSI B 横向",
          value: "Tabloid Ansi B Landscape"
        },
        {
          name: "文摘 ANSI B 纵向",
          value: "Tabloid Ansi B Portrait"
        }
      ],
      formatList: [
        {
          value: "pdf"
        },
        {
          value: "png32"
        },
        {
          value: "png8"
        },
        {
          value: "jpg"
        },
        {
          value: "gif"
        },
        {
          value: "eps"
        },
        {
          value: "svg"
        },
        {
          value: "svgz"
        }
      ],
      scalebarUnitList: [
        {
          value: "Miles"
        },
        {
          value: "Kilometers"
        },
        {
          value: "Meters"
        },
        {
          value: "Feet"
        }
      ],
    };
  },

  methods: {
    closeLayer(val) {
      this.$emit("closeLayer", val);
    },
    //打印方法
    printFnc() {
      this.toolbar.printMap(this.printForm);
    }
  }
};
</script>
