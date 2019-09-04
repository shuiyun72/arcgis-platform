using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection.Emit;
using System.Web;
using System.Web.Http.ExceptionHandling;
using System.Web.Http.Results;

namespace GisPlateformV1_0.App_Start
{
    public class APIExceptionHandler : System.Web.Http.ExceptionHandling.ExceptionHandler
    {
        public override void Handle(ExceptionHandlerContext context)
        {
            context.Result = new ResponseMessageResult(
            context.Request.CreateResponse(MessageEntityTool.GetMessage(ErrorType.SystemError)));
        }
    }
}