import HomeDataMain from "@features/Home/HomeDataMain.vue";
export default {
    path: "/SystemSetting",
    name: "SystemSetting",
    component:  HomeDataMain ,
    redirect: {
      name: 'Modular'
    },
    children: [
      {
        path: "Modular",
        name: "Modular",
        component: (res) => require(['@features/SystemSetting/Modular'], res)
      },
      {
        path: "UserManage",
        name: "UserManage",
        component: (res) => require(['@features/SystemSetting/UserManage'], res)
      },
      {
        path: "RoleManage",
        name: "RoleManage",
        component: (res) => require(['@features/SystemSetting/RoleManage'], res),
      }, 
      {
        path: "DeptManage",
        name: "DeptManage",
        component: (res) => require(['@features/SystemSetting/DeptManage'], res),
      },
    ]
}