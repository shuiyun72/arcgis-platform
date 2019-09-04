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
using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using Newtonsoft.Json;

namespace GisPlateformV1_0.Controllers.ApiControllers.Common
{
    /// <summary>
    /// 部门信息
    /// </summary>
    [WebApiFilterAttribute]
    public class DepartmentController : ApiController
    {
        private readonly IDepartmentDAL _departmentDAL;
        public DepartmentController(IDepartmentDAL departmentDAL)
        {
            _departmentDAL = departmentDAL;
        }

        /// <summary>
        /// 部门列表
        /// </summary>
        /// <returns></returns>
        // GET api/<controller>
        public MessageEntity GetUserComboboxList()
        {
            var result = _departmentDAL.GetDeptInfoList(out string errMsg);
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
        /// 获取所有部门
        /// </summary>
        /// <param name="sort">cDepName</param>
        /// <param name="ordering">desc</param>
        /// <param name="num">20</param>
        /// <param name="page">1</param>
        /// <returns></returns>
        public MessageEntity Get( string sort = "cDepName", string ordering = "desc", int num = 20, int page = 1)
        {
            var result = _departmentDAL.Get( sort, ordering, num, page);

            return result;

        }
        /// <summary>
        /// 新增
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public MessageEntity Post([FromBody]P_Department value)
        {
            if (value == null)
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            return _departmentDAL.Add(value);
        }

        /// <summary>
        /// 修改
        /// </summary>
        /// <param name="iDeptID"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public MessageEntity Put(int iDeptID, [FromBody]P_Department value)
        {
            if (value == null)
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            value.iDeptID = iDeptID;
            return _departmentDAL.Update(value);
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="iDeptID"></param>
        /// <returns></returns>
        public MessageEntity Delete(int iDeptID)
        {
            return _departmentDAL.Delete(new P_Department { iDeptID = iDeptID });
        }

    }
}