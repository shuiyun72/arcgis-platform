export const MenusData = {
  GIS: [
    // {
    //   keyName: "EQName",
    //   text: "设施管理",
    //   iconCls: "i_map_79",
    //   target: "DeviceManagement"
    // },
    {
      keyName: "KPIName",
      text: "管网KPI",
      iconCls: "icon-caidan-",
      target: "DataKPI"
    },
    {
      keyName: "SearchName",
      text: "管网查询",
      iconCls: "icon-caidan-4",
      target: "DataSearch",
      children: [{
        keyName: "NormalSearch",
        text: "数据查询",
        target: "NormalSearch",
      }, {
        keyName: "BufferSearch",
        text: "缓冲区查询",
        target: "BufferSearch",
      }, {
        keyName: "SeniorSearch",
        text: "高级查询",
        target: "SeniorSearch",
      }]
    },
    {
      keyName: "CountName",
      text: "管网统计",
      iconCls: "icon-caidan-1",
      target: "DataCount"
    },
    {
      keyName: "EQViewName",
      text: "设备展示",
      iconCls: "icon-caidan-3",
      target: "DeviceShow"
    },
    {
      keyName: "EQAnalysisName",
      text: "管网分析",
      iconCls: "icon-caidan-6",
      target: "PipeAnalysis",
      children: [{
        keyName: "GuanFa",
        text: "关阀分析",
        target: "GuanFa",
      }, {
        keyName: "LianTongXing",
        text: "连通性分析",
        target: "LianTongXing",
      },
      //{
      //  keyName: "HuoZai",
      //  text: "火灾分析",
      //  target: "HuoZai",
      //},
      {
        keyName: "HengDuanMian",
        text: "横断面分析",
        target: "HengDuanMian",
      },
      {
        keyName: "ZongDuanMian",
        text: "纵断面分析",
        target: "ZongDuanMian",
      },
        //{
        //  keyName: "ChaiQian",
        //  text: "拆迁分析",
        //  target: "ChaiQian",
        //}
      ]
    },
    // {
    //   keyName: "EQViewName",
    //   text: "设备展示",
    //   iconCls: "icon-caidan-2",
    //   target: "DeviceShow"
    // },
    // {
    //   keyName: "EQViewName",
    //   text: "设备展示",
    //   iconCls: "icon-caidan-5",
    //   target: "DeviceShow"
    // }
  ],
  InspectionGIS: [{
    keyName: "InsOverView",
    text: "巡检总览",
    iconCls: "icon-caidan_guanwangxunjian-",
    target: "InsOverView"
  },
  {
    keyName: "InsPlan",
    text: "巡检计划",
    iconCls: "icon-caidan_guanwangxunjian-5",
    target: "InsPlan",
    children: [{
      keyName: "PlanManage",
      text: "计划管理",
      target: "PlanManage",
    }, {
      keyName: "PatrolTask",
      text: "巡线任务",
      target: "PatrolTask",
    }, {
      keyName: "RegionalManagement",
      text: "区域管理",
      target: "RegionalManagement",
    }, {
      keyName: "RouteManagement",
      text: "路线管理",
      target: "RouteManagement",
    }
    ]
  },
  {
    keyName: "InsMinitor",
    text: "巡检监控",
    iconCls: "icon-caidan_guanwangxunjian-6",
    target: "InsMinitor"
  },
  {
    keyName: "InsEven",
    text: "事件管理",
    iconCls: "icon-caidan_guanwangxunjian-3",
    target: "InsEven"
  },
  {
    keyName: "InsAnalysis",
    text: "统计分析",
    iconCls: "icon-caidan_guanwangxunjian-4",
    target: "InsAnalysis",
    children: [{
      keyName: "EvenTypeAnalysis",
      text: "事件类型分析",
      target: "EvenTypeAnalysis",
    }, {
      keyName: "EvenTrendAnalysis",
      text: "事件趋势分析",
      target: "EvenTrendAnalysis",
    }, {
      keyName: "ReportAnalysis",
      text: "人员上报分析",
      target: "ReportAnalysis",
    }
    ]
  },
  {
    keyName: "InsTimeCard",
    text: "考勤管理",
    iconCls: "icon-caidan_guanwangxunjian-1",
    target: "InsTimeCard"
  },
  {
    keyName: "InsSet",
    text: "巡检设置",
    iconCls: "icon-caidan_guanwangxunjian-2",
    target: "InsSet",
    children: [{
      keyName: "EvenContent",
      text: "事件内容管理",
      target: "EvenContent",
    }, {
      keyName: "TimeSet",
      text: "工作时间段管理",
      target: "TimeSet",
    }, {
      keyName: "EvenType",
      text: "事件类型管理",
      target: "EvenType",
    }, {
      keyName: "PlanType",
      text: "计划类别管理",
      target: "PlanType",
    },
    ]
  }
  ],
  MaintainGIS: [{
    keyName: "MaOverView",
    text: "事件总览",
    iconCls: "icon-caidan_guanwangxunjian-",
    target: "MaOverView"
  },
  {
    keyName: "MaEventBills",
    text: "事件工单",
    iconCls: "icon-caidan_weixiuyanghu-2",
    target: "MaEventBills"
  },
  {
    keyName: "MaAnalysis",
    text: "统计分析",
    iconCls: "icon-caidan_guanwangxunjian-4",
    target: "MaAnalysis"
  },
  {
    keyName: "MaSelfDispose",
    text: "个人处理",
    iconCls: "icon-caidan_weixiuyanghu-3",
    target: "MaSelfDispose"
  },
  {
    keyName: "MaBillsReview",
    text: "工单审核",
    iconCls: "icon-caidan_weixiuyanghu-",
    target: "MaBillsReview"
  },
  {
    keyName: "MaBillsDelete",
    text: "工单作废",
    iconCls: "icon-caidan_weixiuyanghu-1",
    target: "MaBillsDelete"
  }
  ],
  SystemSetting: [{
    keyName: "Modular",
    text: "模块管理",
    iconCls: "icon-caidan_xitongguanli-mokuaiguanli-",
    target: "Modular"
  },
  {
    keyName: "UserManage",
    text: "用户管理",
    iconCls: "icon-caidan_xitongguanli-yonghuguanli-",
    target: "UserManage"
  },
  {
    keyName: "RoleManage",
    text: "岗位管理",
    iconCls: "icon-caidan_xitongguanli-gangweiguanli-",
    target: "RoleManage"
  }
  ],  
}