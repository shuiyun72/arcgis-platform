using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using GisPlateform.IDAL;
using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using GisPlateformV1_0.AttributePack;
using Newtonsoft.Json;

namespace GisPlateformV1_0.Controllers
{
    /// <summary>
    /// BaseController
    /// </summary>
    public class BaseController : Controller
    {
        /// <summary>
        /// 公共方法接口
        /// </summary>
        public readonly ICommonDAL CommonDAL;
        /// <summary>
        /// BaseController构造函数
        /// </summary>
        /// <param name="commonDAL"></param>
        public BaseController(ICommonDAL commonDAL)
        {
            CommonDAL = commonDAL;
        }

        ///// <summary>
        ///// 用户缓存
        ///// </summary>
        //public p_Admin UserInfo
        //{
        //    get
        //    {
        //        if (string.IsNullOrEmpty(User.Identity.Name))
        //            return null;

        //        return JsonConvert.DeserializeObject<p_Admin>(User.Identity.Name);
        //    }
        //}

        ///// <summary>
        ///// 权限缓存
        ///// </summary>
        //public List<P_Function> Functions
        //{
        //    get
        //    {
        //        //if (MvcApplication.Authoritys == null || MvcApplication.Authoritys.Count == 0)
        //        //{
                     
        //        //}

        //        return CommonDAL.GetUserAuthority(UserInfo.iAdminID.ToString(), out string errorMsg);
        //    }
        //}


        #region 所有Action执行之前执行，验证是否登陆、权限
        ///<summary>
        ///权限验证
        ///</summary>
        ///<param name="filterContext"></param>
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            //bool isLogined = CheckUserLoginState();

            //base.OnActionExecuting(filterContext);

            //string rawUrl = filterContext.HttpContext.Request.FilePath.ToLower();

            //#region 是否登陆
            //if (isLogined || rawUrl == "/system/login" || rawUrl == "/system/logout" || rawUrl == "/home/index" || rawUrl == "/")
            //{
            //}
            //else
            //{
            //    //Response.Write(JsonConvert.SerializeObject(MessageEntityTool.GetMessage(ErrorType.NoLogin)));
            //    //Response.End();
            //    //return;
            //}
            //#endregion


            //#region 是否有权限
            //if (!CheckUserAuthority(rawUrl, filterContext))
            //{
            //    //Response.Write(JsonConvert.SerializeObject(MessageEntityTool.GetMessage(ErrorType.NoAuthority)));
            //    //Response.End();
            //    //return;
            //}
            //Response.Headers.Add("Ticket", "");
            //#endregion
        }
        #endregion

        /// <summary>
        /// 验证用户是否有权限访问
        /// </summary>
        /// <returns></returns>
        //private bool CheckUserAuthority(string rawUrl, ActionExecutingContext filterContext)
        //{
        //    //首页不需要验证
        //    if (rawUrl.Contains("home/index") || rawUrl.Contains("/system/") || rawUrl == "/")
        //        return true;

        //    //如果是不需要验证的action 返回true
        //    if (filterContext.ActionDescriptor.GetCustomAttributes(true).Length > 0 && !((ActionAttribute)filterContext.ActionDescriptor.GetCustomAttributes(true)[0]).IsCheckAuthority)
        //    {
        //        return true;
        //    }

        //    //循环验证权限集合
        //    foreach (P_Function item in Functions)
        //    {
        //        if (item.cFunUrl == null)
        //            continue;
        //        if (item.cFunUrl.Contains(rawUrl))
        //            return true;
        //    }

        //    return false;
        //}
        ///// <summary>
        ///// 验证是否登陆
        ///// </summary>
        ///// <returns></returns>
        //public bool CheckUserLoginState()
        //{
        //    if (UserInfo != null)
        //    {
        //        return true;
        //    }
        //    return false;
        //}
    }
}