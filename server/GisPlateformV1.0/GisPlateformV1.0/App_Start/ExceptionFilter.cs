using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http.Filters;

namespace GisPlateformV1_0.App_Start
{
    public class ExceptionFilter : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {

            actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(MessageEntityTool.GetMessage(ErrorType.SystemError, actionExecutedContext.Exception.Message));

        }
    }
}