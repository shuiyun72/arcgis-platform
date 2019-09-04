using GisPlateform.IDAL.InspectionPlan;
using GisPlateform.Model.BaseEntity;
using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using GisPlateformV1_0.App_Authorize;
using GisPlateformV1_0.AttributePack;

namespace GisPlateformV1_0.Controllers.ApiControllers.InspectionPlan
{
    /// <summary>
    /// 巡检线路下的点位
    /// </summary>
    [WebApiFilterAttribute]
    public class PlanLineDetailController : ApiController
    {
        private readonly IPlanLineDetailDAL _planLineDetailDAL;
        public PlanLineDetailController(IPlanLineDetailDAL planLineDetailDAL)
        {
            _planLineDetailDAL = planLineDetailDAL;
        }

        /// <summary>
        /// 查询线路下的点位
        /// </summary>
        /// <param name="planLineId">线路id 默认空查询全部线路点位</param>
        /// <param name="sort">排序 默认PlanLineDetaiId</param>
        /// <param name="ordering">desc</param>
        /// <param name="num">15</param>
        /// <param name="page">1</param>
        /// <returns></returns>
        public MessageEntity Get(string planLineId = "", string sort = "PlanLineDetaiId", string ordering = "desc", int num = 15, int page = 1)
        {
            var messageEntity = _planLineDetailDAL.GetPlanLineDetailInfo(planLineId, sort, ordering, num, page);

            return messageEntity;
        }

        /// <summary>
        /// 添加线路下的点位
        /// </summary>
        /// <param name="planLineDetail">ImportPointType默认null;X/Y/PlanLineId必须填写;ImportPointType!=null时要填写ImportPointName</param>
        /// <returns></returns>
        public MessageEntity Post([FromBody]PlanLineDetail planLineDetail)
        {
            if (string.IsNullOrEmpty(planLineDetail.X) || string.IsNullOrEmpty(planLineDetail.Y) || planLineDetail.PlanLineId == null)
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }

            if (planLineDetail.ImportPointType == null)
            {
                planLineDetail.ImportPointType = 0;
                planLineDetail.ImportPointName = "自动点位";
            }
            else
            {
                if (string.IsNullOrEmpty(planLineDetail.ImportPointName))
                {
                    return MessageEntityTool.GetMessage(ErrorType.FieldError);
                }
                planLineDetail.ImportPointType = 1;
            }
            planLineDetail.AddTime = DateTime.Now;
            planLineDetail.State = 1;

            var messageEntity = _planLineDetailDAL.Add(planLineDetail);
            return messageEntity;
        }

        /// <summary>
        /// 修改线路下的点位
        /// </summary>
        /// <param name="planLineDetailId">线路下的点位Id</param>
        /// <param name="planLineDetail">ImportPointType默认1;X/Y/ImportPointName必须填写</param>
        /// <returns></returns>
        public MessageEntity Put(int planLineDetailId, [FromBody]PlanLineDetail planLineDetail)
        {
            if (string.IsNullOrEmpty(planLineDetail.X) || string.IsNullOrEmpty(planLineDetail.Y) || string.IsNullOrEmpty(planLineDetail.ImportPointName))
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            planLineDetail.ImportPointType = 1;
            planLineDetail.PlanLineDetaiId = planLineDetailId;
            var messageEntity = _planLineDetailDAL.Update(planLineDetail);
            return messageEntity;
        }

        /// <summary>
        /// 删除点位
        /// </summary>
        /// <param name="planLineId">点位id</param>
        /// <returns></returns>
        public MessageEntity Delete(int planLineId)
        {
            PlanLineDetail planType = new PlanLineDetail
            {
                PlanLineDetaiId = planLineId
            };
            var messageEntity = _planLineDetailDAL.Delete(planType);

            return messageEntity;
        }
    }
}