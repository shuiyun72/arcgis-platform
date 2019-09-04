using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using GisPlateformV1_0.App_Authorize;
using GisPlateformV1_0.AttributePack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using GisPlateform.IDAL;
using GisPlateform.IDAL.InspectionMonitor;
using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using Newtonsoft.Json;

namespace GisPlateformV1_0.Controllers.ApiControllers.Common
{

    /// <summary>
    /// 用户信息
    /// </summary>
    [WebApiFilterAttribute]
    public class UserController : BaseApiController
    {
        private readonly IMonitorDAL _monitorDAL;
        public UserController(ICommonDAL commonDAL, IMonitorDAL monitorDAL) : base(commonDAL)
        {
            _monitorDAL = monitorDAL;
        }

        /// <summary>
        /// 查询用户列表
        /// </summary>
        /// <param name="deptId">部门id</param>
        /// <param name="roleId">角色id</param>
        /// <returns></returns>
        public MessageEntity GetUserComboboxList(string deptId = "", string roleId = "")
        {
            var result = base.CommonDAL.GetUserInfoListByDeptId(deptId, roleId, out string errMsg);

            if (string.IsNullOrEmpty(errMsg))
            {
                return MessageEntityTool.GetMessage(result.Count, result, true, "", result.Count);
            }
            else
            {
                return MessageEntityTool.GetMessage(ErrorType.SqlError);
            }
        }
        /// <summary>
        /// 查询用户列表(排除已删除用户)
        /// </summary>
        /// <param name="deptId">部门id</param>
        /// <param name="roleId">角色id</param>
        /// <returns></returns>
        public MessageEntity GetUserComboboxListNoDelete(string deptId = "", string roleId = "")
        {
            var result = base.CommonDAL.GetUserInfoListByDeptIdNoDelete(deptId, roleId, out string errMsg);

            if (string.IsNullOrEmpty(errMsg))
            {
                return MessageEntityTool.GetMessage(result.Count, result, true, "", result.Count);
            }
            else
            {
                return MessageEntityTool.GetMessage(ErrorType.SqlError);
            }
        }
        /// <summary>
        /// 获取所有用户
        /// </summary>
        /// <param name="userName">用户名 模糊查询</param>
        /// <param name="roleId">角色id</param>
        /// <param name="deptId">部门id</param>
        /// <param name="sort">cAdminName</param>
        /// <param name="ordering">desc</param>
        /// <param name="num">20</param>
        /// <param name="page">1</param>
        /// <returns></returns>
        public MessageEntity Get(string userName = "", int? roleId = null, int? deptId = null, string sort = "cAdminName", string ordering = "desc", int num = 20, int page = 1)
        {
            var result = base.CommonDAL.GetUsers(userName, roleId, deptId, sort, ordering, num, page);

            return result;

        }
        /// <summary>
        /// 添加用户
        /// </summary>
        /// <param name="admin"></param>
        public MessageEntity Post([FromBody]P_Admin admin)
        {
            if (admin == null)
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            var checkAdmin = base.CommonDAL.IsUserExist(admin.cAdminName, admin.CJobNumber, 0, out string errorMsg);
            if (checkAdmin != null && !string.IsNullOrEmpty(checkAdmin.cAdminName))
            {
                if (string.IsNullOrEmpty(errorMsg))
                {
                    if (checkAdmin.cAdminName == admin.cAdminName)
                        return MessageEntityTool.GetMessage(ErrorType.NotUnique, "", "用户名称不能重复");
                    if (checkAdmin.CJobNumber == admin.CJobNumber)
                        return MessageEntityTool.GetMessage(ErrorType.NotUnique, "", "用户工号不能重复");
                }
                else
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, errorMsg);
                }
            }
            admin.cAdminPassWord = "123456";
            return base.CommonDAL.AddUser(admin);
        }

        /// <summary>
        /// 修改用户
        /// </summary>
        /// <param name="iAdminID"></param>
        /// <param name="admin"></param>
        public MessageEntity Put(int iAdminID, [FromBody]P_Admin admin)
        {
            if (admin == null)
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            var checkAdmin = base.CommonDAL.IsUserExist(admin.cAdminName, admin.CJobNumber, iAdminID, out string errorMsg);
            if (checkAdmin != null && !string.IsNullOrEmpty(checkAdmin.cAdminName))
            {
                if (string.IsNullOrEmpty(errorMsg))
                {
                    if (checkAdmin.cAdminName == admin.cAdminName)
                        return MessageEntityTool.GetMessage(ErrorType.NotUnique, "", "用户名称不能重复");
                    if (checkAdmin.CJobNumber == admin.CJobNumber)
                        return MessageEntityTool.GetMessage(ErrorType.NotUnique, "", "用户工号不能重复");
                }
                else
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, errorMsg);
                }
            }
            admin.iAdminID = iAdminID;
            return base.CommonDAL.UpdateUser(admin);
        }
        /// <summary>
        /// 修改用户密码
        /// </summary>
        /// <param name="admin"></param>
        [HttpPut]
        public MessageEntity ChangePassword([FromBody]AdminPassword admin)
        {
            if (admin == null)
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }

            #region   modify by lsl 20190806 增加旧密码验证
            if (string.IsNullOrEmpty(admin.cAdminName))
            {
                return MessageEntityTool.GetMessage(ErrorType.OprationError, "", "用户名不能为空");
            }
            if (string.IsNullOrEmpty(admin.oldcAdminPassWord))
            {
                return MessageEntityTool.GetMessage(ErrorType.OprationError, "", "密码不能为空");
            }
            var adminmodel = base.CommonDAL.GetUserInfo(admin.cAdminName, admin.oldcAdminPassWord, out string errorMsg);
            //旧密码输入错误
            if (adminmodel == null)
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError, "", "旧密码验证错误");
            }
            #endregion

            var entity = base.CommonDAL.UpdateUserPassword(admin, out string errMsg);
            if (entity)
            {
                return MessageEntityTool.GetMessage(1);
            }
            else
            {
                if (string.IsNullOrEmpty(errMsg))
                {
                    return MessageEntityTool.GetMessage(ErrorType.FieldError, "", "没有该用户");
                }
                else
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, errMsg);
                }
            }
        }
        /// <summary>
        /// 重置用户密码
        /// </summary>
        /// <param name="iAdminID">用户id</param>
        [HttpPut]
        public MessageEntity ResetPassword(int iAdminID)
        {
            var entity = base.CommonDAL.UpdateUserPassword(new AdminPassword { cAdminPassWord = "123456", iAdminID = iAdminID }, out string errMsg);
            if (entity)
            {
                return MessageEntityTool.GetMessage(1);
            }
            else
            {
                if (string.IsNullOrEmpty(errMsg))
                {
                    return MessageEntityTool.GetMessage(ErrorType.FieldError, "", "没有该用户");
                }
                else
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, errMsg);
                }
            }
        }

        /// <summary>
        /// 删除用户
        /// </summary>
        /// <param name="iAdminID"></param>
        public MessageEntity Delete(int iAdminID)
        {
            return base.CommonDAL.DeleteUser(iAdminID);
        }


        /// <summary>
        /// 巡检监控(巡检用户在线信息,根据查询出来的部门加载折叠页,不在线的员工头像灰色,在线的随便找一个) {cDepName:部门名称, OnLineCount:在线人数}:[{IsOnline:N不在线 Y在线,UpTime:最后上线时间}]
        /// </summary>
        /// <returns></returns>
        public MessageEntity GetInspectorInfo()
        {
            return _monitorDAL.GetInspectors();
        }

        /// <summary>
        /// 根据巡检员查询行驶路线,有数据返回就行 路线现在不叠加(播放按钮)
        /// </summary>
        /// <param name="iAdminID">人员id 测试可以写 1</param>
        /// <param name="startTime">yyyy-MM-dd HH:mm:ss(测试可以写 2018-09-13 00:00:00)</param>
        /// <param name="endTime">yyyy-MM-dd HH:mm:ss(测试可以写 2018-09-15 00:00:00)</param>
        /// <returns></returns>
        public MessageEntity GetInspectorRoute(int iAdminID, DateTime startTime, DateTime endTime)
        {
            //endTime = endTime.AddDays(1).AddSeconds(-1);
            return _monitorDAL.GetInspectionRoute(iAdminID, startTime, endTime);
        }
    }
}