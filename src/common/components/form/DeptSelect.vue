


<template>
  <el-select :value="valueTitle" class="selectTree" ref="sel">
    <el-option :value="valueTitle" :label="valueTitle" v-loading="loading">
      <el-scrollbar style="height: 260px;" class="selectTreeScroll">
        <el-tree
          id="tree-option"
          ref="selectTree"
          :data="treeData"
          :props="selectTreeProps"
          :node-key="selectTreeProps.value"
          :default-expanded-keys="defaultExpandedKey"
          @node-click="handleNodeClick"
        ></el-tree>
      </el-scrollbar>
    </el-option>
  </el-select>
</template>
<script>
import DepartmentUserCycle from "@api/Inspection/DepartmentUserCycle";
export default {
  props: ["selectValue", "name", "allState"],
  data() {
    return {
      selectTreeProps: {
        value: "iDeptID", // ID字段名
        label: "cDepName", // 显示名称
        children: "children" // 子级字段名
      },
      departAllList: [],
      departList: [],
      loading: true,
      valueId: this.selectValue, // 初始值
      valueTitle: "",
      defaultExpandedKey: []
    };
  },
  created() {
    if (this.$store.state.system.departAllList.length) {
      this.departAllList = this.$store.state.system.departAllList;
      this.departList = this.$store.state.system.departList;
      this.loading = false;
      this.$nextTick(() => {
        this.initHandle();
      });
    } else {
      this.getDepartList();
    }
  },
  watch: {
    selectValue() {
      this.valueId = this.selectValue;
      this.initHandle();
    }
  },
  computed: {
    treeData() {
      return this.allState ? this.departAllList : this.departList;
    }
  },
  methods: {
    getChildChange(name, valueId) {
      this.$emit("getChildChange", name, valueId);
    },
    //获取部门数据
    getDepartList() {
      this.loading = true;
      DepartmentUserCycle.DeptData()
        .then(res => {
          // this.departList = res.data.Data.Result;
          let fatherList = {};
          _.forEach(res.data.Data.Result, item => {
            if (fatherList[item.PiDeptID]) {
              fatherList[item.PiDeptID].push(item);
            } else {
              fatherList[item.PiDeptID] = [item];
            }
          });
          let departList = [
            {
              cDepName: "公司",
              iDeptID: 1,
              children: []
            }
          ];
          this.DeptSerialize(departList, fatherList);
          this.departList = departList[0].children;
          this.departAllList = _.cloneDeep(this.departList);
          this.departAllList.unshift({
            cDepName: "全部",
            iDeptID: ""
          });
          this.loading = false;
          this.$store.dispatch("system/SetDeptList", {
            departAllList: this.departAllList,
            departList: this.departList
          });
          this.$nextTick(() => {
            this.initHandle();
          });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "获取数据失败",
            showClose: true
          });
        });
    },
    //treeData序列化
    DeptSerialize(arr, fatherList) {
      _.map(arr, item => {
        if (fatherList[item.iDeptID]) {
          item.children = fatherList[item.iDeptID];
          let parent = {};
          parent.cDepName = item.cDepName;
          if (item.parent) {
            parent.parent = item.parent;
          }
          if (item.iDeptID !== 1) {
            _.forEach(item.children, child => {
              child.parent = parent;
            });
          }
          this.DeptSerialize(item.children, fatherList);
        } else {
          return;
        }
      });
    },
    // 初始化值
    initHandle() {
      console.log("initHandle", this.valueId);
      if (this.valueId) {
        this.$refs.selectTree.setCurrentKey(this.valueId); // 设置默认选中
        this.defaultExpandedKey = [this.valueId]; // 设置默认展开
        if (!this.$refs.selectTree.getNode(this.valueId)) {
          return;
        }
        this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data[
          this.selectTreeProps.label
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
      this.valueId = node[this.selectTreeProps.value];
      this.$emit("getChildChange", this.name, this.valueId);
      this.defaultExpandedKey = [];
      this.$refs.sel.blur();
    },
    valueTitleParent(node, parentTitle) {
      if (node) {
        parentTitle.push(node[this.selectTreeProps.label]);
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