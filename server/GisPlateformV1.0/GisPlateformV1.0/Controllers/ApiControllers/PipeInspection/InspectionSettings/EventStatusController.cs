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
using GisPlateform.IDAL.InspectionSettings;
using GisPlateform.Model.BaseEntity;
using Newtonsoft.Json;

namespace GisPlateformV1_0.Controllers.ApiControllers.InspectionSettings
{
    /// <summary>
    /// 事件状态
    /// </summary>
    [WebApiFilterAttribute]
    public class EventStatusController : BaseApiController
    {
        private readonly IEventStatusDAL _eventStatusDAL;
        public EventStatusController(ICommonDAL commonDAL, IEventStatusDAL eventStatusDAL) : base(commonDAL)
        {
            _eventStatusDAL = eventStatusDAL;
        }

        /// <summary>
        /// 事件状态列表(巡检)
        /// </summary>
        /// <returns></returns>
        public MessageEntity GetStatusForInspection()
        {
            return _eventStatusDAL.GetStatusForInspection();
        }

        /// <summary>
        /// 事件状态列表(维修养护)
        /// </summary>
        /// <returns></returns>
        public MessageEntity GetStatusForMantain(DateTime? startTime = null, DateTime? endTime = null)
        {
            return _eventStatusDAL.GetStatusForMantain(startTime, endTime);
        }
    }
}