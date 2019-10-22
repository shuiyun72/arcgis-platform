<template>
  <div class="Home_container" :class="{ GISDiv: menusDataList === 'GIS' ,iframe:iframe}">
    <el-row class="top-bar" type="flex" justify="space-between">
      <div>
        <img class="app-logo" src="@assets/hedalogo.png" />
      </div>
      <el-row type="flex" justify="end" class="tag-wraper">
        <el-row
          type="flex"
          class="menu-tag-wraper menuRow"
          ref="menuRow"
          :style="{opacity: menuShow ? 1 :0}"
        >
          <router-link
            :to="{name:item.cFunUrl}"
            class="header_tag"
            active-class="active"
            v-for="item in tagData"
            :key="item.cFunUrl"
            @click.native="topMenueChange(item,item.iFunID)"
          >
            <i class="iconfont top-icon" :class="item.cFunIcon"></i>
            <span>{{item.cFunName}}</span>
          </router-link>
        </el-row>
        <el-dropdown
          class="topUserWraper moreMenu"
          @visible-change="val => this.menuDropdownActive = val"
          v-show="menuMoreState"
          placement="bottom-start"
        >
          <span class="el-dropdown-link">更多</span>
          <el-dropdown-menu slot="dropdown" class="more-menu-tag-wraper">
            <template v-for="item in tagData">
              <el-dropdown-item :key="item.cFunUrl">
                <router-link
                  v-if="item.showMore"
                  :to="{name:item.cFunUrl}"
                  class="header_tag"
                  active-class="active"
                  @click.native="topMenueChange(item,item.iFunID)"
                >
                  <i class="iconfont top-icon" :class="item.cFunIcon"></i>
                  <span>{{item.cFunName}}</span>
                </router-link>
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown
          class="topUserWraper"
          trigger="click"
          @visible-change=" val => this.elDropdownActive = val"
        >
          <span class="el-dropdown-link">
            <i class="icon-yonghu iconfont"></i>
            {{cAdminName}}
            <i
              class="el-icon-caret-bottom el-icon--right"
              :class="{active:elDropdownActive}"
            ></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="topUserMenu">
            <el-dropdown-item @click.native="editUserPassword">
              <i class="icon-unie604 iconfont"></i> 修改密码
            </el-dropdown-item>
            <el-dropdown-item @click.native="longinOut">
              <i class="icon-qiehuanzuhu iconfont"></i> 退出系统
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
    </el-row>
    <el-row
      v-if="menusData && menusData.length"
      class="mian-wrapper"
      :class="{isCollapse:isCollapse, GISClass: menusDataList === 'GIS'}"
    >
      <div class="sidebar-body">
        <el-scrollbar>
          <el-menu class="sidemenu" :class="isCollapse" collapse :menu-trigger="'click'">
            <template v-for="item in menusData">
              <el-submenu
                :index="item.cFunUrl"
                v-if="item.children"
                :key="item.cFunUrl"
                :class="{'active-route': leftMenuDataIndex(item.children)}"
              >
                <template slot="title">
                  <i class="iconfont" :class="item.cFunIcon"></i>
                  <span class="title">{{item.cFunName}}</span>
                </template>
                <router-link
                  :to="{name:item.cFunUrl}"
                  v-for="item in item.children"
                  :key="item.cFunUrl"
                  active-class="active-route"
                >
                  <el-menu-item :index="item.cFunUrl">{{item.cFunName}}</el-menu-item>
                </router-link>
              </el-submenu>
              <router-link
                v-else
                :to="{name:item.cFunUrl}"
                :key="item.cFunUrl"
                active-class="active-route"
              >
                <el-menu-item
                  :index="item.cFunUrl"
                  :data-tooltip="item.cFunName "
                  data-tooltip-positions="right"
                  v-if="!isCollapse"
                >
                  <i class="iconfont" :class="item.cFunIcon"></i>
                </el-menu-item>
                <el-menu-item :index="item.cFunUrl" v-else>
                  <i class="iconfont" :class="item.cFunIcon"></i>
                  <span class="title">{{item.cFunName}}</span>
                </el-menu-item>
              </router-link>
            </template>
          </el-menu>
        </el-scrollbar>
        <el-button class="el-menu-control" @click="leftMenuControl">
          <i class="icon-qiehuan iconfont"></i>
        </el-button>
      </div>
      <div
        class="main-body"
        :class="{fullScreen : fullScreenValue, horizontal: !fullScreenValue,flexible:flexible}"
      >
        <router-view></router-view>
      </div>
    </el-row>
    <el-row
      v-else
      class="mian-wrapper"
      :class="{isCollapse:isCollapse, GISClass: menusDataList === 'GIS'}"
    >
      <router-view></router-view>
    </el-row>
  </div>
</template>
 
<script>
import _ from "lodash";
import { MenusData } from "@features/Home/config.js";
import { mapState, mapGetters } from "vuex";
import { POINT_CONVERSION_COMPRESSED } from "constants";
export default {
  data() {
    return {
      elDropdownActive: false, //顶部登陆drap
      menuMoreState: true, //顶部是否显示更多
      menuShow: true, //顶部menu是否展示
      menuDropdownActive: false, //顶部更多drap
      flexible: false, //是否左侧收缩
      menusDataList: "", //当前所处的大类
      leftMenuData: "", //左侧侧边栏高亮 active
      isCollapse: false,
      title: "浙江和达科技股份有限公司",
      width: 60,
      collapsed: true,
      selectedMenu: null,
      fullScreenList: ["DataKPI", "GIS", "InsOverView", "MaOverView"],
      fullScreenValue: false,
      //一级导航
      tagData: []
    };
  },
  computed: {
    //左侧菜单数据
    menusData() {
      let num = this.$route.fullPath.split("/")[1];
      num = num.split("?")[0];
      if (this.$route.name == "GIS" || this.$route.name == "InsMinitor") {
        this.flexible = true;
      } else {
        this.flexible = false;
      }
      this.menusDataList = num;
      this.leftMenuData = this.$route.name;
      return this.iframe ? MenusData[num] :this.MenusTreeData[num] ;
    },
    ...mapState("login", [ "iframe" ,"cAdminName"]),
    ...mapGetters("login", ["routeTree", "MenusTreeData"])
  },
  created() {
    this.flexibleControl();
    this.fullScreenValue =
      _.indexOf(this.fullScreenList, this.$route.name) != -1;
    this.$bus.on("FullScren", this.fullScren); //是否全屏
    this.$bus.on("flexibleControl", this.flexibleControl); //是否左侧收缩
    this.lodaMenu();
  },
  updated() {
    this.fullScreenValue =
      _.indexOf(this.fullScreenList, this.$route.name) != -1;
    this.lodaMenu();
  },
  mounted() {
    this.menuMoreControl();
    window.addEventListener("resize", _.debounce(() => {
      this.$nextTick(() => {
        this.menuMoreControl();
      });
    }))
  },
  beforeDestroy() {
    this.$bus.off("FullScren", this.fullScren); //是否全屏
    this.$bus.off("flexibleControl", this.flexibleControl); //是否左侧收缩
  },
  methods: {
    lodaMenu() {
      this.tagData = this.routeTree[0];
    },

    flexibleControl(val) {
      this.flexible = val;
      if (this.$route.name == "InsMinitor") {
        this.flexible = true;
      }
    },
    //是否展示mune更多选项
    menuMoreControl() {
      if(this.iframe){
        return
      }
      this.menuMoreState = false;
      this.menuShow = true;
      if (
        document.querySelector("div .menuRow").offsetWidth <
        document.querySelector("div .menuRow").children[0].clientWidth
      ) {
        this.menuShow = false;
        this.menuMoreState = true;
        _.forEach(
          document.querySelector("div .menuRow").children,
          (ele, index) => {
            this.tagData[index].showMore = true;
          }
        );
        return;
      }

      _.forEach(
        document.querySelector("div .menuRow").children,
        (ele, index) => {
          if (ele.offsetTop > 0) {
            this.tagData[index].showMore = true;
            this.menuMoreState = true;
          } else {
            this.tagData[index].showMore = false;
          }
        }
      );
    },
    //左侧导航伸展方法
    leftMenuControl() {
      this.isCollapse = !this.isCollapse;
      if (this.$route.fullPath.split("/")[1] == "InspectionGIS") {
        this.$bus.emit("resizeMapNavigate");
      }
    },
    leftMenuDataIndex(list) {
      return _.findIndex(list, { cFunUrl: this.leftMenuData }) >= 0;
    },
    editUserPassword() {
      this.$router.push({ name: "ChangePassword" });
    },
    longinOut() {
      this.$confirm("确定退出系统么？", "提示信息").then(res => {
        localStorage.clear();
        sessionStorage.clear();
        // this.$store.dispatch("login/userStatus", undefined);
        if (this.$store.state.system.hashMode) {
          location.replace("/#/Login");
        } else {
          location.replace("/Login");
        }
      });
    },
    //是否全屏幕展示地图
    fullScren(value) {
      this.fullScreenValue = value;
    },
    //点击左侧侧边栏时操作
    changeLayer() {},
    //顶部菜单选择
    topMenueChange(item, indexNum) {
      // this.menusData = MenusData[item.value];
    }
  }
};
</script>
