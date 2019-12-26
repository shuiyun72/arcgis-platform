export const MenusData = {
  GIS: [
    // {
    //   keyName: "EQName",
    //   cFunName: "设施管理",
    //   cFunIcon: "i_map_79",
    //   cFunUrl: "DeviceManagement"
    // },
    {
      keyName: "DataKPI",
      cFunName: "管网KPI",
      cFunIcon: "icon-caidan-",
      cFunUrl: "DataKPI"
    },
    {
      keyName: "DataSearch",
      cFunName: "管网查询",
      cFunIcon: "icon-caidan-4",
      cFunUrl: "DataSearch",
      children: [{
        keyName: "NormalSearch",
        cFunName: "数据查询",
        cFunUrl: "NormalSearch",
      }, {
        keyName: "BufferSearch",
        cFunName: "缓冲区查询",
        cFunUrl: "BufferSearch",
      }, {
        keyName: "SeniorSearch",
        cFunName: "高级查询",
        cFunUrl: "SeniorSearch",
      }]
    },
    {
      keyName: "DataCount",
      cFunName: "管网统计",
      cFunIcon: "icon-caidan-1",
      cFunUrl: "DataCount"
    },
    {
      keyName: "DeviceShow",
      cFunName: "设备展示",
      cFunIcon: "icon-caidan-3",
      cFunUrl: "DeviceShow"
    },
    {
      keyName: "PipeAnalysis",
      cFunName: "管网分析",
      cFunIcon: "icon-caidan-6",
      cFunUrl: "PipeAnalysis",
      children: [
      //   {
      //   keyName: "GuanFa",
      //   cFunName: "关阀分析",
      //   cFunUrl: "GuanFa",
      // }, {
      //   keyName: "LianTongXing",
      //   cFunName: "连通性分析",
      //   cFunUrl: "LianTongXing",
      // },
      {
        keyName: "HengDuanMian",
        cFunName: "横断面分析",
        cFunUrl: "HengDuanMian",
      },
      // {
      //   keyName: "ZongDuanMian",
      //   cFunName: "纵断面分析",
      //   cFunUrl: "ZongDuanMian",
      // },
      ]
    },
    {
      keyName: "MapGrid",
      cFunName: "网格管理",
      cFunIcon: "icon-guanwangGIS-wanggehuaguanli-",
      cFunUrl: "MapGrid"
    },
    {
      keyName: "DiscardPipe",
      cFunName: "废管处理",
      cFunIcon: "icon-guanwangGIS-",
      cFunUrl: "DiscardPipe",
      children: [{
        keyName: "DiscardPipeSearch",
        cFunName: "废管查询",
        cFunUrl: "DiscardPipeSearch",
      }, {
        keyName: "DiscardPipeCount",
        cFunName: "废管统计",
        cFunUrl: "DiscardPipeCount",
      },
      {
        keyName: "PipeDiscard",
        cFunName: "管网废弃",
        cFunUrl: "PipeDiscard",
      },
      ]
    },
    {
      keyName: "PipeLifeCycle",
      cFunName: "生命周期",
      cFunIcon: "icon-guanwangGIS_guanwangshengmingzhouqi-",
      cFunUrl: "PipeLifeCycle",
      children: [{
        keyName: "AccountsManage",
        cFunName: "台账管理",
        cFunUrl: "AccountsManage",
      },
      // {
      //   keyName: "DiscardPipeCount",
      //   cFunName: "台账统计",
      //   cFunUrl: "DiscardPipeCount",
      // },
      // {
      //   keyName: "PipeDiscard",
      //   cFunName: "管网废弃",
      //   cFunUrl: "PipeDiscard",
      // },
      ]
    }
  ],
  InspectionGIS: [{
    keyName: "InsOverView",
    cFunName: "巡检总览",
    cFunIcon: "icon-caidan_guanwangxunjian-",
    cFunUrl: "InsOverView"
  },
  {
    keyName: "InsPlan",
    cFunName: "巡检计划",
    cFunIcon: "icon-caidan_guanwangxunjian-5",
    cFunUrl: "InsPlan",
    children: [{
      keyName: "PlanManage",
      cFunName: "计划管理",
      cFunUrl: "PlanManage",
    }, {
      keyName: "PatrolTask",
      cFunName: "巡线任务",
      cFunUrl: "PatrolTask",
    }, {
      keyName: "RegionalManagement",
      cFunName: "区域管理",
      cFunUrl: "RegionalManagement",
    }, {
      keyName: "RouteManagement",
      cFunName: "路线管理",
      cFunUrl: "RouteManagement",
    }
    ]
  },
  {
    keyName: "InsMinitor",
    cFunName: "巡检监控",
    cFunIcon: "icon-caidan_guanwangxunjian-6",
    cFunUrl: "InsMinitor"
  },
  {
    keyName: "InsEven",
    cFunName: "事件管理",
    cFunIcon: "icon-caidan_guanwangxunjian-3",
    cFunUrl: "InsEven"
  },
  {
    keyName: "InsAnalysis",
    cFunName: "统计分析",
    cFunIcon: "icon-caidan_guanwangxunjian-4",
    cFunUrl: "InsAnalysis",
    children: [{
      keyName: "EvenTypeAnalysis",
      cFunName: "事件类型分析",
      cFunUrl: "EvenTypeAnalysis",
    }, {
      keyName: "EvenTrendAnalysis",
      cFunName: "事件趋势分析",
      cFunUrl: "EvenTrendAnalysis",
    }, {
      keyName: "ReportAnalysis",
      cFunName: "人员上报分析",
      cFunUrl: "ReportAnalysis",
    }
    ]
  },
  {
    keyName: "InsTimeCard",
    cFunName: "考勤管理",
    cFunIcon: "icon-caidan_guanwangxunjian-1",
    cFunUrl: "InsTimeCard"
  },
  {
    keyName: "InsSet",
    cFunName: "巡检设置",
    cFunIcon: "icon-caidan_guanwangxunjian-2",
    cFunUrl: "InsSet",
    children: [{
      keyName: "EvenContent",
      cFunName: "事件内容管理",
      cFunUrl: "EvenContent",
    }, {
      keyName: "TimeSet",
      cFunName: "工作时间段管理",
      cFunUrl: "TimeSet",
    }, {
      keyName: "EvenType",
      cFunName: "事件类型管理",
      cFunUrl: "EvenType",
    }, {
      keyName: "PlanType",
      cFunName: "计划类别管理",
      cFunUrl: "PlanType",
    },
    ]
  }
  ],
  MaintainGIS: [{
    keyName: "MaOverView",
    cFunName: "事件总览",
    cFunIcon: "icon-caidan_guanwangxunjian-",
    cFunUrl: "MaOverView"
  },
  {
    keyName: "MaEventBills",
    cFunName: "事件工单",
    cFunIcon: "icon-caidan_weixiuyanghu-2",
    cFunUrl: "MaEventBills"
  },
  {
    keyName: "MaAnalysis",
    cFunName: "统计分析",
    cFunIcon: "icon-caidan_guanwangxunjian-4",
    cFunUrl: "MaAnalysis"
  },
  {
    keyName: "MaSelfDispose",
    cFunName: "个人处理",
    cFunIcon: "icon-caidan_weixiuyanghu-3",
    cFunUrl: "MaSelfDispose"
  },
  {
    keyName: "MaBillsReview",
    cFunName: "工单审核",
    cFunIcon: "icon-caidan_weixiuyanghu-",
    cFunUrl: "MaBillsReview"
  },
  {
    keyName: "MaBillsDelete",
    cFunName: "工单作废",
    cFunIcon: "icon-caidan_weixiuyanghu-1",
    cFunUrl: "MaBillsDelete"
  }
  ],
  SystemSetting: [{
    keyName: "Modular",
    cFunName: "模块管理",
    cFunIcon: "icon-caidan_xitongguanli-mokuaiguanli-",
    cFunUrl: "Modular"
  },
  {
    keyName: "UserManage",
    cFunName: "用户管理",
    cFunIcon: "icon-caidan_xitongguanli-yonghuguanli-",
    cFunUrl: "UserManage"
  },
  {
    keyName: "RoleManage",
    cFunName: "岗位管理",
    cFunIcon: "icon-caidan_xitongguanli-gangweiguanli-",
    cFunUrl: "RoleManage"
  }
  ],
}