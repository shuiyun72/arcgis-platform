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

namespace GisPlateformV1_0.Controllers.ApiControllers.Common
{ /// <summary>
  /// APP上传
  /// </summary>
    [WebApiFilterAttribute]
    public class CellphoneManageController: ApiController
    {
        private readonly ICellphoneManageDAL _cellphoneManageDAL;
        /// <summary>
        /// 
        /// </summary>
        /// <param name="CellphoneManageDAL"></param>
        public CellphoneManageController(ICellphoneManageDAL CellphoneManageDAL)
        {
            _cellphoneManageDAL = CellphoneManageDAL;
        }
        /// <summary>
        /// 获取App上传记录
        /// </summary>
        /// <param name="sort">排序字段默认(UploadTime)</param>
        /// <param name="ordering">desc/asc默认降序(desc)</param>
        /// <param name="num">默认20</param>
        /// <param name="page">默认1</param>
        /// <returns></returns>
        public MessageEntity Get( string sort = "UploadTime", string ordering = "desc", int num = 20, int page = 1)
        {
            return _cellphoneManageDAL.Get(sort, ordering, num, page);
        }
        /// <summary>
        /// 获取最新版本号
        /// </summary>
        /// <returns></returns>
        public MessageEntity GetLatestVersionId(){
            return _cellphoneManageDAL.GetLatestVersionId();
        }
        /// <summary>
        /// 上传APP版本信息
        /// </summary>
        /// <param name="VersionId"></param>
        /// <returns></returns>
        public MessageEntity UploadApk(string VersionId)
        {
            HttpFileCollection files = HttpContext.Current.Request.Files;
            if (files.Count > 0)
            {
                if (string.IsNullOrEmpty(VersionId) || string.IsNullOrEmpty(VersionId.Trim()))
                {
                    return MessageEntityTool.GetMessage(ErrorType.FieldError, "", "版本号必须输入");
                }
                else
                {
                    VersionId = VersionId.Trim();
                    MessageEntity ms=  _cellphoneManageDAL.getCount(VersionId);
                  if(ms.Data.Rows > 0)
                    {
                        return MessageEntityTool.GetMessage(ErrorType.FieldError, "", "不能提交重复版本");
                    }
                    for (int i = 0; i < files.Count; i++)
                    {
                        HttpPostedFile file = files[i];
                        if (file.ContentLength > 0)
                        {
                            //全路径 
                            string FullFullName = file.FileName;
                            string filehz = FullFullName.Split('V')[1];
                            string ver = filehz.Remove(filehz.Length - 4, 4);
                            //验证APK名称后缀版本号名必须与版本号是否一致，否则返回
                            if (ver != VersionId)
                            {
                                return MessageEntityTool.GetMessage(ErrorType.FieldError, "", "APK名称后缀版本号名必须与版本号一致");
                            }
                            String fileName = "H5188E903_0425021627.apk";
                            file.SaveAs(AppDomain.CurrentDomain.SetupInformation.ApplicationBase + "\\" + fileName);
                            return _cellphoneManageDAL.UploadApk(file.FileName,VersionId);

                        }
                        else
                        {
                            return MessageEntityTool.GetMessage(ErrorType.FieldError, "", "文件内容为空");
                        }
                    }
                    return MessageEntityTool.GetMessage(ErrorType.FieldError, "", "文件为空");

                }
            }
            else
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError, "", "没有选择文件");
            }
        }
    }
}
