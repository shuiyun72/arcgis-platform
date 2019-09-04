using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using GisPlateformV1_0.App_Authorize;
using GisPlateformV1_0.AttributePack;
using GisPlateform.IDAL;
using GisPlateform.IDAL.InspectionMonitor;
using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GisPlateformV1_0.Controllers.ApiControllers
{
    /// <summary>
    /// 岗位管理
    /// </summary>
    [WebApiFilterAttribute]
    public class RoleController : ApiController
    {
        private readonly IRoleDAL _roleDAL;
        /// <summary>
        /// 岗位管理
        /// </summary>
        public RoleController(IRoleDAL roleDAL) 
        {
            _roleDAL = roleDAL;
        }

        /// <summary>
        /// 获取所有岗位
        /// </summary>
        /// <param name="roleName">岗位名称 模糊查询</param>
        /// <param name="sort"></param>
        /// <param name="ordering"></param>
        /// <param name="num"></param>
        /// <param name="page"></param>
        /// <returns></returns>
        public MessageEntity Get(string roleName = "", string sort = "cRoleName", string ordering = "desc", int num = 20, int page = 1)
        {
            var result = _roleDAL.Get(roleName, sort, ordering, num, page);

            return result;

        }


       /// <summary>
       /// 新增
       /// </summary>
       /// <param name="value"></param>
       /// <returns></returns>
        public MessageEntity Post([FromBody]P_Role value)
        {
            if (value == null)
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            return _roleDAL.Add(value);
        }

        /// <summary>
        /// 修改
        /// </summary>
        /// <param name="iRoleID"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public MessageEntity Put(int iRoleID, [FromBody]P_Role value)
        {
            if (value == null)
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            value.iRoleID = iRoleID;
            return _roleDAL.Update(value);
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="iRoleID"></param>
        /// <returns></returns>
        public MessageEntity Delete(int iRoleID)
        {
            return _roleDAL.Delete(new P_Role { iRoleID = iRoleID });
        }
    }
}