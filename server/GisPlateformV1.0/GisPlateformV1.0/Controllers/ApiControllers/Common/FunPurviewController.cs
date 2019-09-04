using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using GisPlateformV1_0.App_Authorize;
using GisPlateformV1_0.AttributePack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using GisPlateform.IDAL;
using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using Newtonsoft.Json;

namespace GisPlateformV1_0.Controllers
{
    /// <summary>
    /// 权限
    /// </summary>
    [WebApiFilterAttribute]
    public class FunPurviewController : BaseApiController
    {
        private readonly IP_FunPurviewDAL _p_FunPurviewDAL;
        public FunPurviewController(IP_FunPurviewDAL p_FunPurviewDAL, ICommonDAL commonDAL) : base(commonDAL)
        {
            _p_FunPurviewDAL = p_FunPurviewDAL;
        }
       

        /// <summary>
        /// 更新权限
        /// </summary>
        /// <param name="functionIds">权限id数组</param>
        /// <param name="iPurviewID">用户或角色id</param>
        /// <param name="iPurviewType">1用户 2角色</param>
        /// <returns></returns>
        [ActionAttribute(IsCheckAuthority = false)]
        [System.Web.Mvc.HttpPost]
        public MessageEntity RefreshFunPurview(int[] functionIds, int iPurviewID, int iPurviewType)
        {
            if (functionIds == null || functionIds.Length == 0)
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError, "functionIds参数有误");
            }

            List<P_FunPurview> funPurviews = new List<P_FunPurview>();
            foreach (int id in functionIds)
            {
                funPurviews.Add(new P_FunPurview() { iPurviewID = iPurviewID, iPurviewType = iPurviewType, iFunID = id });
            }
            bool result = _p_FunPurviewDAL.RefreshFunPurview(funPurviews, out string msg);
            if (result)
            {
                return MessageEntityTool.GetMessage(1);
            }
            else
            {
                return MessageEntityTool.GetMessage(ErrorType.SystemError, msg);
            }
        }



    }
}