using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using GisPlateformV1_0.App_Authorize;
using GisPlateformV1_0.AttributePack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using GisPlateform.IDAL;
using GisPlateform.IDAL.EventOperation;
using GisPlateform.Model.BaseEntity;
using Newtonsoft.Json;
using GisPlateform.CommonTools;

namespace GisPlateformV1_0.Controllers.ApiControllers.PipeInspection.EventOperation
{
    /// <summary>
    /// 事件来源统计
    /// </summary>
    [WebApiFilterAttribute]
    public class EventFromController : BaseApiController
    {
        private readonly IEventFromDAL _eventFrom;
        /// <summary>
        /// 
        /// </summary>
        /// <param name="commonDAL"></param>
        /// <param name="eventFrom"></param>
        public EventFromController(ICommonDAL commonDAL, IEventFromDAL eventFrom) : base(commonDAL)
        {
            _eventFrom = eventFrom;
        }
        /// <summary>
        /// 按照事件来源统计数量
        /// </summary>
        /// <param name="startTime">事件上报时间</param>
        /// <param name="endTime">事件上报时间</param>
        /// <returns></returns>
        public MessageEntity GetEventFrom(DateTime? startTime = null, DateTime? endTime = null)
        {
           return _eventFrom.GetEventFrom(startTime, endTime);
        }
    }
}
