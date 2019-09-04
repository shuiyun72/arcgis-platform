import HomeDataMain from "@features/Home/HomeDataMain.vue";
export default {
  path: "/INStwo",
  component: (res) => require(['@features/Home/components/twoCol'], res),
  children: [{
    path: "/InspectionGIS",
    name: "InspectionGIS",
    components: {
      default: HomeDataMain,
      OpenLMap: (res) => require(['@features/InspectionGIS/InsQuery'], res)
    },
    redirect: {
      name: 'InsOverView'
    },
    children: [
      {
        path: "InsAnalysis",
        name: "InsAnalysis",
        component: (res) => require(['@features/InspectionGIS/InsAnalysis'], res),
        children: [{
          path: 'EvenTrendAnalysis',
          name: 'EvenTrendAnalysis',
          component: (res) => require(['@features/InspectionGIS/InsAnalysis/EvenTrend/EvenTrend'], res),
        }, {
          path: 'EvenTypeAnalysis',
          name: 'EvenTypeAnalysis',
          component: (res) => require(['@features/InspectionGIS/InsAnalysis/EvenType/EvenType'], res),
        }, {
          path: 'ReportAnalysis',
          name: 'ReportAnalysis',
          component: (res) => require(['@features/InspectionGIS/InsAnalysis/Report/Report'], res),
        }
        ]
      },
      {
        path: "InsEven",
        name: "InsEven",
        component: (res) => require(['@features/InspectionGIS/InsEven'], res)
      },
      {
        path: "InsMinitor",
        name: "InsMinitor",
        component: (res) => require(['@features/InspectionGIS/InsMinitor'], res)
      },
      {
        path: "InsOverView",
        name: "InsOverView",
        component: (res) => require(['@features/InspectionGIS/InsOverView'], res)
      },
      {
        path: "InsPlan",
        name: "InsPlan",
        component: (res) => require(['@features/InspectionGIS/InsPlan'], res),
        children: [{
          path: 'PlanManage',
          name: 'PlanManage',
          component: (res) => require(['@features/InspectionGIS/InsPlan/PlanManage'], res),
        }, {
          path: 'PatrolTask',
          name: 'PatrolTask',
          component: (res) => require(['@features/InspectionGIS/InsPlan/PatrolTask'], res),
        }, {
          path: 'RegionalManagement',
          name: 'RegionalManagement',
          component: (res) => require(['@features/InspectionGIS/InsPlan/RegionalManagement'], res),
        }, {
          path: 'RouteManagement',
          name: 'RouteManagement',
          component: (res) => require(['@features/InspectionGIS/InsPlan/RouteManagement'], res),
        }]
      },
      {
        path: "InsSet",
        name: "InsSet",
        component: (res) => require(['@features/InspectionGIS/InsSet'], res),
        children: [{
          path: 'EvenContent',
          name: 'EvenContent',
          component: (res) => require(['@features/InspectionGIS/InsSet/EvenContent'], res),
        }, {
          path: 'TimeSet',
          name: 'TimeSet',
          component: (res) => require(['@features/InspectionGIS/InsSet/TimeSet'], res),
        }, {
          path: 'EvenType',
          name: 'EvenType',
          component: (res) => require(['@features/InspectionGIS/InsSet/EvenType'], res),
        }, {
          path: 'PlanType',
          name: 'PlanType',
          component: (res) => require(['@features/InspectionGIS/InsSet/PlanType'], res),
        }]
      },
      {
        path: "InsTimeCard",
        name: "InsTimeCard",
        component: (res) => require(['@features/InspectionGIS/InsTimeCard'], res)
      }
    ]
  }]
}
