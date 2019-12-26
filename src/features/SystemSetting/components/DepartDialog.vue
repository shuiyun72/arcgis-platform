<template>
  <el-dialog
    title="部门选择"
    :visible.sync="modularDialogVisable"
    width="300"
    :before-close="handleClose"
    customClass="el_add_dialog"
    class="myDialog modularDialog"
  >
    <el-scrollbar style="height:400px" v-loading="loading">
      <el-tree
        ref="tree"
        highlight-current
        :data="deptList"
        :props="defaultProps"
        :default-expand-all="true"
        :default-checked-keys="nodeID"
        node-key="iDeptID"
        show-checkbox
      ></el-tree>
    </el-scrollbar>
    <div slot="footer" class="dialog-footer">
      <el-button
        class="my-dialog-cancel"
        @click="departDialogSubmit"
        :loading="modulaBtnVisable"
      >修 改</el-button>
      <el-button class="my-dialog-submit" @click="modularFormClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>
 
<script>
import Dept from "@api/SystemSetting/Department";
export default {
  props: ["modularDialogVisable", "nodeID", "modulaBtnVisable"],
  data() {
    return {
      loading: true, //加载tree
      deptList: [],
      defaultProps: {
        children: "children",
        label: "cDepName"
      },
      FatherList: [], //由fatherId组成system的对象
      CheckedAllNodes: [] //选中的包含父节点的数据
    };
  },
  watch: {
    nodeID() {
      if (this.nodeID) {
        this.$refs.tree && this.$refs.tree.setCheckedNodes(this.nodeID);
      }
    }
  },
  created() {
    this.getDeptList();
  },
  methods: {
    getDeptList() {
      this.loading = true;
      Dept.getDeptList()
        .then(res => {
          this.FatherList = {};
          _.forEach(res.data.Data.Result, item => {
            if (this.FatherList[item.PiDeptID]) {
              this.FatherList[item.PiDeptID].push(item);
            } else {
              this.FatherList[item.PiDeptID] = [item];
            }
          });
          this.deptList = [
            {
              cDepName: "公司",
              iDeptID: 1,
              children: []
            }
          ];
          this.DeptSerialize(this.deptList);
          this.loading = false;
          // this.deptList = this.deptList.children
          this.$store.dispatch("system/SetDeptListFnc", this.deptList);
        })
        .catch(() => {
          this.loading = false;
          this.$myMessage("error", "获取数据失败");
        });
    },
    //treeData序列化
    DeptSerialize(arr) {
      _.map(arr, item => {
        if (this.FatherList[item.iDeptID]) {
          item.children = this.FatherList[item.iDeptID];
          this.DeptSerialize(item.children);
        } else {
          return;
        }
      });
    },
    handleClose(done) {
      this.$emit("update:modularDialogVisable", false);
      done();
    },
    modularFormClose() {
      this.$emit("update:modularDialogVisable", false);
    },
    departDialogSubmit() {
      this.$emit("update:modulaBtnVisable", true);
      let CheckedNodes = this.$refs.tree.getCheckedNodes();
      CheckedNodes = _.map(CheckedNodes, "iDeptID");
      this.CheckedAllNodes = CheckedNodes.join(",");
      this.$emit("departDialogSubmit", this.CheckedAllNodes);
    }
  }
};
</script>