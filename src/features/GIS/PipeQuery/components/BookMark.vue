<template>
  <div class="Map_Action_Bar_Layer_Win">
    <div class="Win_Title">
      <span class="text">书签管理</span>
      <span @click="closeLayer('bookMark')" class="icon">
        <i class="iconfont icon-shousuo"></i>
      </span>
    </div>

    <div class="bookMark_List">
      <div class="inputWrapper">
        <el-input placeholder="请输入查询" v-model="bookMarkFilter">
          <el-button slot="append" icon="el-icon-search" @click="bookMarkFilterSearch"></el-button>
        </el-input>
      </div>
      <el-row type="flex" justify="end" class="table-btn-control">
        <my-button @click="addBookmark" class="my-tableout">
          <i class="iconfont icon-xinzeng addColor"></i>新增
        </my-button>
        <my-button @click="editBookMark" class="my-tableout">
          <i class="iconfont icon-bianji editColor"></i>编辑
        </my-button>
        <my-button @click="delBookmark" class="my-tableout">
          <i class="iconfont icon-shanchu delColor"></i>删除
        </my-button>
      </el-row>
      <el-scrollbar v-loading="bookMarkLoading">
        <ul class="listWrapper" >
          <!-- {{bookMarkList}} -->
          <li
            v-for=" (item , index) in bookMarkList"
            :key="item.OBJECTID"
            @click="bookMarkCurrentChange(item)"
            :class="{ active: bookMarkCurrent.OBJECTID === item.OBJECTID}"
          >
            <span>{{index + 1+ bookMarkPage.pageSize*(bookMarkPage.pageNumber -1) + '. '+ item.TITLE}}</span>
          </li>
        </ul>
      </el-scrollbar>
      <el-pagination
        layout="total , prev, pager, next, jumper"
        :pager-count="3"
        :total="bookMarkPage.bookMarkTotal"
        :page-size="bookMarkPage.pageSize"
        :current-page.sync="bookMarkPage.pageNumber"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  props: ["searchType"],
  data() {
    return {
      bookMarkLoading:false,//list加载状态
      bookMarkFilter: "", //书签查询的绑定inut的val
      bookMarkFilterVal: "", //书签查询的Val为了配合点击查询，设置两个参数
      bookMarkCurrent: [], //当前选中的书签
      bookMarkListAll: [], //全部书签列表
      bookMarkPage: {
        bookMarkTotal: 10,
        pageNumber: 1,
        pageSize: 10
      } //书签的分页
    };
  },
  computed: {
    // 分页后的当前页数据
    bookMarkList() {
      let bookMarkList;
      if (this.bookMarkFilterVal) {
        bookMarkList = _.filter(this.bookMarkListAll, item => {
          if (
            item.attributes.TITLE &&
            item.attributes.TITLE.indexOf(this.bookMarkFilterVal) !== -1
          ) {
            return true;
          } else {
            return false;
          }
        });
        this.bookMarkPage.bookMarkTotal = bookMarkList.length;

        bookMarkList = _.map(bookMarkList, "attributes");
      } else {
        this.bookMarkPage.bookMarkTotal = this.bookMarkListAll.length;
        bookMarkList = _.map(this.bookMarkListAll, "attributes");
      }

      return _.chunk(bookMarkList, this.bookMarkPage.pageSize)[
        this.bookMarkPage.pageNumber - 1
      ];
    }
  },
  methods: {
    closeLayer(val) {
      this.$emit("closeLayer", val);
    },
    /**
     * 添加、编辑，删除标签
     */
    bookMarkFilterSearch() {
      this.bookMarkFilterVal = this.bookMarkFilter;
    },
    //当前选中的书签
    bookMarkCurrentChange(row) {
      this.bookMarkCurrent = row;
      this.$bus.emit(
        "setMapLocation",
        this.bookMarkCurrent.OBJECTID,
        "bookMarkLayer"
      );
    },
    //新增标签
    addBookmark() {
      this.$bus.emit(
        "getMapPoint",
        true,
        res => {
          this.$bus.emit("mapEditinit", "bookMarkLayer", res, "point");
          this.$bus.emit(
            "editMapForm",
            "bookMarkLayer",
            { geometry: res },
            [
              {
                value: "TITLE",
                label: "标题",
                edit: true
              },
              {
                value: "CONTENT",
                label: "内容",
                edit: true
              },
              {
                value: "CREATEBYID",
                label: "添加人编号",
                edit: false
              },
              {
                value: "CREATEBYNAME",
                label: "添加人名称",
                edit: false
              },
              {
                value: "CREATED",
                label: "添加时间",
                edit: false
              }
            ],
            true,
            res => {
              this.$message({
                type: "success",
                message: "新增成功",
                showClose: true
              });
              this.bookMarkLoadData();
            },
            error => {
              this.$message({
                type: "error",
                message: "新增失败请刷新重试",
                showClose: true
              });
            }
          );
        },
        true
      );
    },
    //删除标签
    delBookmark() {
      let current = _.filter(this.bookMarkListAll, item => {
        return item.attributes.OBJECTID === this.bookMarkCurrent.OBJECTID;
      })[0];
      this.$bus.emit(
        "mapEditDel",
        "bookMarkLayer",
        current,
        res => {
          this.$message({
            type: "success",
            message: "删除成功",
            showClose: true
          });
          this.bookMarkLoadData();
        },
        err => {
          this.$message({
            type: "error",
            message: "删除失败",
            showClose: true
          });
          console.log(err);
        }
      );
    },
    //加载书签信息
    bookMarkLoadData() {
      this.bookMarkLoading = true
      this.$bus.emit(
        "dataSearchByLayerName",
        null,
        "bookMarkLayer",
        "1 = 1",
        res => {
          this.bookMarkListAll = res;
          this.bookMarkLoading = false
        }
      );
    },
    //书签编辑方法
    editBookMark(item) {
      let current = _.filter(this.bookMarkListAll, item => {
        return item.attributes.OBJECTID === this.bookMarkCurrent.OBJECTID;
      })[0];
      this.$bus.emit(
        "setDefinitionExpression",
        "bookMarkLayer",
        "OBJECTID <> " + this.bookMarkCurrent.OBJECTID
      );
      this.$bus.emit("mapEditinit", "bookMarkLayer", current, "point");
      this.$bus.emit(
        "editMapForm",
        "bookMarkLayer",
        current,
        [
          {
            value: "TITLE",
            label: "标题",
            edit: true
          },
          {
            value: "CONTENT",
            label: "内容",
            edit: true
          },
          {
            value: "UPDATED",
            label: "修改时间",
            edit: false
          }
        ],
        false,
        res => {
          this.bookMarkLoadData();
          this.$message({
            type: "success",
            message: "编辑成功",
            showClose: true
          });
          this.$bus.emit("setDefinitionExpression", "bookMarkLayer", "1=1 ");
        },
        error => {
          if (error) {
            this.$message({
              type: "error",
              message: "编辑失败请刷新重试",
              showClose: true
            });
          }
          this.$bus.emit("setDefinitionExpression", "bookMarkLayer", "1=1 ");
        }
      );
    },
    //书签初始化
    initBookMark() {
      this.$bus.emit('onLayerViewAllVisibale',false)
      this.$bus.emit("onLayerViewOrHidden", "bookMarkLayer", true, true);
      this.bookMarkLoadData();
      this.$bus.emit(
        "mapDbClickEditMapForm",
        "bookMarkLayer",
        "point",
        [
          {
            value: "TITLE",
            label: "标题",
            edit: true
          },
          {
            value: "CONTENT",
            label: "内容",
            edit: true
          },
          {
            value: "UPDATED",
            label: "修改时间",
            edit: false
          }
        ],
        res => {
          this.$message({
            type: "success",
            message: "编辑成功",
            showClose: true
          });
          this.bookMarkLoadData();
        },
        err => {
          if (error) {
            this.$message({
              type: "error",
              message: "编辑失败请刷新重试",
              showClose: true
            });
          }
          this.$bus.emit("setDefinitionExpression", "bookMarkLayer", "1=1 ");
        }
      );
    }
    /**
     * 结束标签方法
     */
  }
};
</script>
