<template>
  <el-dialog
    :title="'模块选择'"
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
        :data="modularList"
        :props="defaultProps"
        :default-expanded-keys="[-1]"
        :default-checked-keys="treeNeedNodeID"
        node-key="iFunID"
        show-checkbox
      ></el-tree>
    </el-scrollbar>
    <div slot="footer" class="dialog-footer">
      <el-button class="my-dialog-cancel" @click="modularFormSubmit" :loading="modulaBtnVisable">修 改</el-button>
      <el-button class="my-dialog-submit" @click="modularFormClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>
 
<script>
import Modular from "@api/SystemSetting/Modular";
export default {
  props: ["modularDialogVisable", "nodeID", "modulaBtnVisable"],
  data() {
    return {
      loading: true, //加载tree
      modularList: [],
      defaultProps: {
        children: "children",
        label: "cFunName"
      },
      FatherList: [], //由fatherId组成system的对象
      treeList: [], //由fatherId组成的对象
      treeNeedNodeID: [], //tree组件所需要的nodeID
      System_Type: 1, //当前的tree展开类别
      typeList: {
        3: "手机app",
        1: "B/S 显示",
        4: "C/S 显示"
      }, //系统状态过滤
      typeListArr: [
        {
          name: "手机app",
          value: 3
        },
        {
          name: "B/S 显示",
          value: 1
        },
        {
          name: "C/S 显示",
          value: 4
        }
      ], //select框选择列表过滤
      CheckedAllNodes: [] //选中的包含父节点的数据
    };
  },
  watch: {
    nodeID() {
      let nodeID = _.cloneDeep(this.nodeID);
      for (let i = 0; i < nodeID.length; i++) {
        if (this.treeList[nodeID[i]]) {
          let len = this.treeList[nodeID[i]].length;
          if (len) {
            for (let j = 0; j < nodeID.length; j++) {
              if (_.indexOf(this.treeList[nodeID[i]], nodeID[j]) > -1) {
                len--;
              }
            }
            if (len) {
              nodeID.splice(i, 1);
              i--;
            }
          }
        }
      }
      this.treeNeedNodeID = nodeID;
      this.$refs.tree && this.$refs.tree.setCheckedNodes(this.nodeID);
    }
  },
  created() {
    this.getModularList();
  },
  methods: {
    //获取模块列表
    getModularList() {
      this.loading = true;
      Modular.getModular().then(res => {
        this.FatherList = {};
        this.treeList = {};
        let resList = res.data.Data.Result;
        _.forEach(resList, item => {
          if (!this.FatherList[item.System_Type]) {
            this.FatherList[item.System_Type] = {
              iFunID: "0#" + item.System_Type
            };
            this.FatherList[item.System_Type].cFunName = this.typeList[
              item.System_Type
            ];
            this.FatherList[item.System_Type];
            this.FatherList[item.System_Type].System_Type = item.System_Type;
          }
          if (this.FatherList[item.System_Type][item.iFunFatherID]) {
            this.FatherList[item.System_Type][item.iFunFatherID].push(item);
          } else {
            this.FatherList[item.System_Type][item.iFunFatherID] = [item];
          }
          if (this.treeList[item.iFunFatherID]) {
            this.treeList[item.iFunFatherID].push(item);
          } else {
            this.treeList[item.iFunFatherID] = [item];
          }
        });
        let modularList = _.cloneDeep(this.FatherList);
        this.modularList = [
          {
            iFunID: -1,
            cFunName: "智慧水务管理系统",
            children: []
          }
        ];
        _.forEach(modularList, (item, index) => {
          this.ModularSerialize([item], item.System_Type);
          this.modularList[0].children.push(item);
        });
        this.loading = false;
      });
    },
    //treeData序列化
    ModularSerialize(arr, System_Type) {
      _.map(arr, item => {
        let iFunID = _.isString(item.iFunID)
          ? Number(item.iFunID.split("#")[0])
          : item.iFunID;
        if (this.FatherList[System_Type][iFunID]) {
          // item.children = this.FatherList[System_Type][iFunID];
          let parent = {};
          parent.iFunID = iFunID;
          if (item.parent) {
            parent.parent = item.parent;
          }

          item.children = _.map(this.FatherList[System_Type][iFunID], child => {
            child.parent = parent;
            return child;
          });
          this.ModularSerialize(
            this.FatherList[System_Type][iFunID],
            System_Type
          );
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
    nodeparent(node) {
      if (node.parent) {
        this.CheckedAllNodes.push(node.parent.iFunID);
        this.nodeparent(node.parent);
      }
    },
    modularFormSubmit() {
      this.$emit("update:modulaBtnVisable", true);

      let CheckedNodes = this.$refs.tree.getCheckedNodes();
      this.CheckedAllNodes = [];
      _.forEach(CheckedNodes, node => {
        this.CheckedAllNodes.push(node.iFunID);
        this.nodeparent(node);
      });
      this.CheckedAllNodes = _.union(this.CheckedAllNodes);
      this.CheckedAllNodes = _.filter(this.CheckedAllNodes, item => {
        return !_.isString(item);
      });
      this.$emit("modularDialogSubmit", this.CheckedAllNodes);
    }
  }
};
</script>