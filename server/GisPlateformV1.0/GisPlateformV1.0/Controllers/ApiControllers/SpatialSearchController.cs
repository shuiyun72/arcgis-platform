using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using GisPlateformV1_0.App_Authorize;
using GisPlateformV1_0.AttributePack;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using GisPlateform.IDAL;
using GisPlateform.Model.BaseEntity;
using Newtonsoft.Json;

namespace GisPlateformV1_0.Controllers
{
    /// <summary>
    /// GIS空间查讯接口
    /// </summary>
    [RoutePrefix("api")]
    [WebApiFilterAttribute]
    public class SpatialSearchController : BaseApiController
    {
        private readonly IPipeDAL _pipeDAL;
        private readonly IPOIDAL _pOIDAL;
        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="pipeDAL"></param>
        /// <param name="commonDAL"></param>

        public SpatialSearchController(IPipeDAL pipeDAL, ICommonDAL commonDAL, IPOIDAL pOIDAL) : base(commonDAL)
        {
            _pipeDAL = pipeDAL;
            _pOIDAL = pOIDAL;
        }
        /// <summary>
        /// 根据管网id活得所有关联阀门和管网
        /// </summary>
        /// <param name="pipeId">管网id (','号分割)</param>
        /// <returns></returns>
        [Route("SpatialSearch/GetRealatedValveAndPipeByPipeId")]
        public MessageEntity GetRealatedValveAndPipeByPipeId(string pipeId)
        {
            if (string.IsNullOrEmpty(pipeId))
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            var pipeIdArray = Array.ConvertAll(pipeId.Split(','), int.Parse);
            var result = _pipeDAL.GetRealatedValveAndPipeByPipeId(pipeIdArray, out string errorMsg);

            if (!string.IsNullOrEmpty(errorMsg))
            {
                return MessageEntityTool.GetMessage(ErrorType.SqlError, errorMsg);
            }

            return MessageEntityTool.GetMessage(result.Count, result, true, "完成", result.Count);
        }
        /// <summary>
        /// 获取POI信息
        /// </summary>
        /// <param name="name">模糊查询字段 %name%</param>
        /// <returns></returns>
        [Route("SpatialSearch/GetPOI")]
        public MessageEntity GetPOI(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            return _pOIDAL.Get(name);
        }

        /// <summary>
        /// 获取横断面PNG
        /// </summary>
        /// <param name="value">能够转化为DataTable的Json</param>
        /// <returns></returns>
        [Route("SpatialSearch/GetCurveHeng")]
        [HttpPost]
        public MessageEntity GetCurveHeng(object value)
        {
            try
            {
                DataTable dt = JsonConvert.DeserializeObject<DataTable>(value.ToString());
                DataSet ds = new DataSet();
                ds.Tables.Add(dt);
                var result = _pipeDAL.GetCurveHeng(ds);

                return MessageEntityTool.GetMessage(1, Request.RequestUri.Authority+result);
            }
            catch (Exception e)
            {
                return MessageEntityTool.GetMessage(ErrorType.SystemError, e.Message);
            }


        }
    }
}