using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using GisPlateformV1_0.App_Authorize;
using GisPlateformV1_0.AttributePack;
using GisPlateform.IDAL;
using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.UI.HtmlControls;
using System.Web;
using GisPlateform.CommonTools;
using System.IO;

namespace GisPlateformV1_0.Controllers.ApiControllers.Common
{
    [WebApiFilterAttribute]
    public class UpLoadFileController : ApiController
    {
        /// <summary>
        /// 上传文件
        /// </summary>
        /// <returns></returns>
        public MessageEntity UpLoad()
        {
            HttpFileCollection files = HttpContext.Current.Request.Files;
            DateTime dateNow = DateTime.Now;
            Random random = new Random();
            if (files.Count > 0)
            {


                for (int i = 0; i < files.Count; i++)
                {
                    HttpPostedFile file = files[i];
                    if (file.ContentLength > 0)
                    {
                        //全路径 
                        string FullFullName = file.FileName;

                        string relativeDir = "/upload/EventsImg/" + dateNow.Year + "/" + dateNow.Month + "/" + dateNow.Day;
                        string imageName = string.Format("{0:yyyyMMddHHmmssfff}", dateNow);
                        string Path = string.Format("{0}", relativeDir);

                        string relativePath = string.Format("{0}/{1}", relativeDir, imageName  + FullFullName);
                        if (!Directory.Exists(System.Web.HttpContext.Current.Server.MapPath(Path)))
                        {
                            Directory.CreateDirectory(System.Web.HttpContext.Current.Server.MapPath(Path));
                        }
                        file.SaveAs(System.Web.HttpContext.Current.Server.MapPath(relativePath));
                        return MessageEntityTool.GetMessage(1, null, true, relativePath);

                    }
                    else
                    {
                        return MessageEntityTool.GetMessage(ErrorType.FieldError, "", "文件内容为空");
                    }
                }
                return MessageEntityTool.GetMessage(ErrorType.FieldError, "", "文件为空");



            }
            else
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError, "", "没有选择文件");
            }

        }
    }
}
