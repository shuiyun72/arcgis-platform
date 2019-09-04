using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using GisPlateform.IDAL;
using GisPlateform.IDAL.InspectionPlan;
using GisPlateform.Model.BaseEntity;
using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using GisPlateformV1_0.App_Authorize;
using GisPlateformV1_0.AttributePack;
using Newtonsoft.Json;

namespace GisPlateformV1_0.Controllers.ApiControllers.InspectionPlan
{
    /// <summary>
    /// 巡检路线 
    /// </summary>
    [WebApiFilterAttribute]
    public class PlanLineController : BaseApiController
    {
        private readonly IPlanLineDAL _planLineDAL;
        public PlanLineController(ICommonDAL commonDAL, IPlanLineDAL planLineDAL) : base(commonDAL)
        {
            _planLineDAL = planLineDAL;
        }

        /// <summary>
        /// 巡检路线列表
        /// </summary>
        /// <param name="sort">排序字段(PlanLineId)</param>
        /// <param name="ordering">asc/desc</param>
        /// <param name="num">默认15</param>
        /// <param name="page">默认1</param>
        /// <returns></returns>
        public MessageEntity Get(string sort = "PlanLineId", string ordering = "desc", int num = 15, int page = 1)
        {
            var messageEntity = _planLineDAL.GetPlanLineInfo(sort, ordering, num, page);
            return messageEntity;
        }

        /// <summary>
        /// 新增巡检路线
        /// </summary>
        /// <param name="value">PlanLineName/PatroGeoText/GeoText不可为空</param>
        /// <returns></returns>
        public MessageEntity Post([FromBody]L_PlanLine value)
        {
            if (string.IsNullOrEmpty(value.PlanLineName) || string.IsNullOrEmpty(value.PatroGeoText) || string.IsNullOrEmpty(value.GeoText))
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            var dTN=DateTime.Now;
            value.AddTime = dTN;
            value.LastOperateTime = dTN;
            value.PlanLintState = 1;
            var messageEntity = _planLineDAL.Add(value);
            return messageEntity;
        }
        /// <summary>
        /// 修改巡检路线
        /// </summary>
        /// <param name="planLineId">巡检路线id</param>
        /// <param name="value">PlanLineName/PatroGeoText/GeoText不可为空</param>
        /// <returns></returns>
        public MessageEntity Put(int planLineId, [FromBody]L_PlanLine value)
        {
            if (string.IsNullOrEmpty(value.PlanLineName) || string.IsNullOrEmpty(value.PatroGeoText) || string.IsNullOrEmpty(value.GeoText))
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            value.PlanLineId = planLineId;
            value.LastOperateTime = DateTime.Now;
            var messageEntity = _planLineDAL.Update(value);
            return messageEntity;
        }

        /// <summary>
        /// 删除巡检路线
        /// </summary>
        /// <param name="planLineId">巡检路线id</param>
        /// <returns></returns>
        public MessageEntity Delete(int planLineId)
        {
            return _planLineDAL.Delete(new { PlanLineId = planLineId });
        }
    }
}