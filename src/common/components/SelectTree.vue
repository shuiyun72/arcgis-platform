
<template>
  <el-select :value="valueTitle" class="selectTree">
    <el-option :value="valueTitle" :label="valueTitle" v-loading="loading">
      <el-scrollbar style="height: 260px;" class="selectTreeScroll">
        <el-tree
          id="tree-option"
          ref="selectTree"
          :accordion="accordion"
          :data="options"
          :props="props"
          :node-key="props.value"
          :default-expanded-keys="defaultExpandedKey"
          @node-click="handleNodeClick"
        ></el-tree>
      </el-scrollbar>
    </el-option>
  </el-select>
</template>
<script>
import _ from "lodash";
export default {
  name: "el-tree-select",
  props: {
    /* 配置项 */
    props: {
      type: Object,
      default: () => {
        return {
          value: "id", // ID字段名
          label: "label", // 显示名称
          children: "children" // 子级字段名
        };
      }
    },
    //
    loading: {
      type: Boolean
    },
    /* 选项列表数据(树形结构的对象数组) */
    options: {
      type: Array,
      default: () => {
        return [];
      }
    },
    /* 同步value的父级变量名称 */
    name: {
      type: String
    },
    /* 初始值 */
    selectValue: {
      type: Number,
      default: null
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => {
        return true;
      }
    }
  },
  data() {
    return {
      valueId: this.selectValue, // 初始值
      valueTitle: "",
      defaultExpandedKey: []
    };
  },
  watch: {
    selectValue() {
      this.valueId = this.selectValue;
      this.initHandle();
    }
  },
  mounted(){
    this.initHandle();
  },
  methods: {
    // 初始化值
    initHandle() {
      if (this.valueId) {
         console.log(this.$refs.selectTree ,this.$refs.selectTree.getNode(this.valueId) )
        this.$refs.selectTree.setCurrentKey(this.valueId); // 设置默认选中
        this.defaultExpandedKey = [this.valueId]; // 设置默认展开
        if(!this.$refs.selectTree.getNode(this.valueId)){
        
          return
        }
        this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data[
          this.props.label
        ]; // 初始化显示
        
      } else if (_.isUndefined(this.valueId) || _.isNull(this.valueId)) {
        this.valueTitle = "";
        this.$refs.selectTree.setCurrentKey(null); // 设置默认选中
        this.defaultExpandedKey = []; // 设置默认展开
      }
      this.$nextTick(() => {
        let scrollWrap = document.querySelectorAll(
          ".el-scrollbar .el-select-dropdown__wrap"
        )[0];
        let scrollBar = document.querySelectorAll(
          ".el-scrollbar .el-scrollbar__bar"
        );
        scrollWrap.style.cssText =
          "margin: 0px; max-height: none; overflow: hidden;";
        scrollBar.forEach(ele => (ele.style.width = 0));
      });
    },
    // 切换选项
    handleNodeClick(node) {
      let parentTitle = [];
      this.valueTitleParent(node, parentTitle);
      this.valueTitle = parentTitle.join("-");
      this.valueId = node[this.props.value];
      this.$emit("getChildChange", this.name, this.valueId);
      this.defaultExpandedKey = [];
    },
    valueTitleParent(node, parentTitle) {
      if (node) {
        parentTitle.push(node[this.props.label]);
        this.valueTitleParent(node.parent, parentTitle);
      } else {
        parentTitle = _.reverse(parentTitle);
      }
    },
    /* 清空选中样式 */
    clearSelected() {
      let allNode = document.querySelectorAll("#tree-option .el-tree-node");
      allNode.forEach(element => element.classList.remove("is-current"));
    }
  }
};
</script>
<style lang="stylus" scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  padding: 0;
  max-height: 260px;
  overflow: hidden;
  overflow-y: auto;
}

.el-select-dropdown__item.selected {
  font-weight: normal;
}

ul li >>> .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}

.el-tree-node__label {
  font-weight: normal;
}

.el-tree >>> .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}

.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
</style>