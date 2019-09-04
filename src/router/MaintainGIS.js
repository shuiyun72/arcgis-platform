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
        path: "MaSelfDispose",
        name: "MaSelfDispose",
        component: (res) => require(['@features/MaintainGIS/MaSelfDispose'], res)
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