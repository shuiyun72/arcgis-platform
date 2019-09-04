using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using GisPlateformV1_0.App_Authorize;
using GisPlateformV1_0.AttributePack;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using GisPlateform.IDAL;
using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using Newtonsoft.Json;

namespace GisPlateformV1_0.Controllers
{
    /// <summary>
    /// 区域下点位
    /// </summary>
    [WebApiFilterAttribute]
    public class PointAreaController : BaseApiController
    {
        private readonly IPointAreaInfoDAL _pointAreaInfoDAL;
        public PointAreaController(ICommonDAL commonDAL, IPointAreaInfoDAL pointAreaInfoDAL) : base(commonDAL)
        {
            _pointAreaInfoDAL = pointAreaInfoDAL;
        }

        /// <summary>
        /// 根据planAreaId获取 PointArea
        /// </summary>
        /// <param name="planAreaId" required="false">planAreaId</param>
        /// <param name="sort">排序(默认PointId)</param>
        /// <param name="ordering">asc/desc</param>
        /// <param name="num">每页多少行</param>
        /// <param name="page">第几页</param>
        /// <returns></returns>
        // GET api/<controller>/5
        public MessageEntity Get(string planAreaId, string sort, string ordering, int num, int page)
        {
            var messageEntity = _pointAreaInfoDAL.GetAllPointAreaInfo(planAreaId, sort, ordering, num, page);

            return messageEntity;
        }

        /// <summary>
        /// 添加区域下点位
        /// </summary>
        /// <param name="value">实体PointX/PointY/PointName/PlanAreaId不可为空</param>
        /// <returns></returns>
        public MessageEntity Post([FromBody]PointAreaInfo value)
        {
            if (string.IsNullOrEmpty(value.PointX) || string.IsNullOrEmpty(value.PointY) || string.IsNullOrEmpty(value.PointName)||value.PlanAreaId==null)
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            value.AddTime = DateTime.Now;
             var messageEntity = _pointAreaInfoDAL.AddPointArea(value);

            return messageEntity;
        }

        /// <summary>
        /// 根据pointId修改pointAreaInfo
        /// </summary>
        /// <param name="pointId">PointId</param>
        /// <param name="pointAreaInfo">实体PointX/PointY/PointName不可为空</param>
        /// <returns></returns>
        // PUT api/<controller>/5
        public MessageEntity Put(int pointId, [FromBody]PointAreaInfo pointAreaInfo)
        {
            if (string.IsNullOrEmpty(pointAreaInfo.PointX) || string.IsNullOrEmpty(pointAreaInfo.PointY) || string.IsNullOrEmpty(pointAreaInfo.PointName))
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            pointAreaInfo.PointId = pointId;
            var messageEntity = _pointAreaInfoDAL.UpdatePointTableByPointId(pointAreaInfo);

            return messageEntity;
        }

        /// <summary>
        /// 删除区域下点位
        /// </summary>
        /// <param name="PointId">点位PointId</param>
        /// <returns></returns>
        public MessageEntity Delete(int PointId)
        {
            PointAreaInfo value = new PointAreaInfo();
            value.PointId = PointId;
            var messageEntity = _pointAreaInfoDAL.DeletePointArea(value);

            return messageEntity;
        }
    }
}