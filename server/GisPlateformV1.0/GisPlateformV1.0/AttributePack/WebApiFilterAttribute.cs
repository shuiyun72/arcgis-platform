using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Filters;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Http.Controllers;
using GisPlateform.Model.BaseEntity;
using GisPlateformV1_0.App_Authorize;
using System.Net.Http;
using System.Net;
using System.Text;
using System.Web.Helpers;
using Newtonsoft.Json;

namespace GisPlateformV1_0.AttributePack
{
    public class WebApiFilterAttribute : System.Web.Http.Filters.ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext filterContext)
        {
            RequestCheck requestCheck = new RequestCheck();

            filterContext.Request.Headers.TryGetValues("Token", out IEnumerable<string> token);

            var loginState = requestCheck.RequestLoginStateCheck(token == null ? "" : token.First(), filterContext.Request.RequestUri.LocalPath);

            if (ErrorType.Success == loginState)
            {
            }
            else
            {
                var response = filterContext.Response = filterContext.Response ?? new HttpResponseMessage();
                response.Content = new StringContent(JsonConvert.SerializeObject(MessageEntityTool.GetMessage(loginState)), Encoding.UTF8, "application/json");
                return;

            }

        }
    }
}