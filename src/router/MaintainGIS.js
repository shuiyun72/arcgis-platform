import HomeDataMain from "@features/Home/HomeDataMain.vue";
export default {
  path: "/INStwo",
  component: (res) => require(['@features/Home/components/twoCol'], res),
  children: [{
    path: "/MaintainGIS",
    name: "MaintainGIS",
    components: {
      default: HomeDataMain,
      OpenLMap: (res) => require(['@features/InspectionGIS/InsQuery'], res)
    },
    redirect: {
      name: 'MaOverView'
    },
    children: [
      {
        path: "MaOverView",
        name: "MaOverView",
        component: (res) => require(['@features/MaintainGIS/MaOverView'], res)
      },
      {
        path: "MaEventBills",
        name: "MaEventBills",
        component: (res) => require(['@features/MaintainGIS/MaEventBills'], res)
      },
      {
        path: "MaAnalysis",
        name: "MaAnalysis",
        component: (res) => require(['@features/MaintainGIS/MaAnalysis'], res)
      },
      {
        path: "MaSelf",
        name: "MaSelf",
        component: (res) => require(['@features/MaintainGIS/MaSelfDispose'], res),
        children: [{
          path: 'MaSelfDispose',
          name: 'MaSelfDispose',
          //待办处理
          component: (res) => require(['@features/MaintainGIS/MaSelfDispose/MaSelfDispose'], res),
        }, {
          path: 'WorkListEventStart',
          name: 'WorkListEventStart',
          //发起事件
          component: (res) => require(['@features/MaintainGIS/MaSelfDispose/WorkListEventStart'], res),
        }, {
          path: 'OwnWordListExecuted',
          name: 'OwnWordListExecuted',
          //已办工单
          component: (res) => require(['@features/MaintainGIS/MaSelfDispose/OwnWordListExecuted'], res),
        }]
      },
      {
        path: "MaBillsReview",
        name: "MaBillsReview",
        component: (res) => require(['@features/MaintainGIS/MaBillsReview'], res),
      },
      // {
      //   path: "MaBillsDelete",
      //   name: "MaBillsDelete",
      //   component: (res) => require(['@features/MaintainGIS/MaBillsDelete'], res)
      // }
    ]
  }]
}