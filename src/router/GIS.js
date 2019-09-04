import HomeDataMain from "@features/Home/HomeDataMain.vue";
export default {
  path: "/GIStwo",
  component:(res) => require(['@features/Home/components/twoCol'], res),
  children: [{
    path: "/GIS",
    name: "GIS",
    components: {
      default: HomeDataMain,
      HomeMap: (res) => require(['@features/GIS/PipeQuery'], res)
    },
    children: [
      {
        path: "DataCount",
        name: "DataCount",
        component: (res) => require(['@features/GIS/DataCount'], res)
      },
      {
        path: "DeviceShow",
        name: "DeviceShow",
        component: (res) => require(['@features/GIS/DeviceShow'], res)
      },
      {
        path: "DataSearch",
        name: "DataSearch",
        component: (res) => require(['@features/GIS/DataSearch'], res),
        children: [{
          path: 'NormalSearch',
          name: 'NormalSearch',
          component: (res) => require(['@features/GIS/DataSearch/NormalSearch'], res),
        }, {
          path: 'BufferSearch',
          name: 'BufferSearch',
          component: (res) => require(['@features/GIS/DataSearch/BufferSearch'], res),
        }, {
          path: 'SeniorSearch',
          name: 'SeniorSearch',
          component: (res) => require(['@features/GIS/DataSearch/SeniorSearch'], res),
        }]
      },
      {
        path: "DeviceManagement",
        name: "DeviceManagement",
        component: (res) => require(['@features/GIS/DeviceManagement'], res)
      },
      {
        path: "PipeAnalysis",
        name: "PipeAnalysis",
        components: {
          // default: (res) => require(['@features/GIS/PipeAnalysis/GuanFa'], res),
          default: (res) => require(['@features/GIS/PipeAnalysis'], res)
        },
        redirect: {
          name: 'GuanFa'
        },
        children: [{
          path: 'GuanFa',
          name: 'GuanFa',
          component: (res) => require(['@features/GIS/PipeAnalysis/GuanFa'], res)
        }, {
          path: 'LianTongXing',
          name: 'LianTongXing',
          component: (res) => require(['@features/GIS/PipeAnalysis/LianTongXing'], res)
        }, {
          path: 'HuoZai',
          name: 'HuoZai',
          component: (res) => require(['@features/GIS/PipeAnalysis/HuoZai'], res)
        }, {
          path: 'HengDuanMian',
          name: 'HengDuanMian',
          component: (res) => require(['@features/GIS/PipeAnalysis/HengDuanMian'], res)
        }, {
          path: 'ZongDuanMian',
          name: 'ZongDuanMian',
          component: (res) => require(['@features/GIS/PipeAnalysis/ZongDuanMian'], res)
        }, {
          path: 'ChaiQian',
          name: 'ChaiQian',
          component: (res) => require(['@features/GIS/PipeAnalysis/ChaiQian'], res)
        }]
      },
      {
        path: "DataKPI",
        name: "DataKPI",
        component: (res) => require(['@features/GIS/DataKPI'], res)
      }
    ]
  }
  ]
}