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

namespace GisPlateformV1_0.Controllers.ApiControllers.EventManage
{
    /// <summary>
    /// 事件管理
    /// </summary>
    [WebApiFilterAttribute]
    public class EventManageController : BaseApiController
    {
        private readonly IEventManageDAL _eventManage;
        public EventManageController(ICommonDAL commonDAL, IEventManageDAL eventManage) : base(commonDAL)
        {
            _eventManage = eventManage;
        }

        /// <summary>
        /// 查询所有事件(事件管理-事件总览)
        /// </summary>
        /// <param name="startTime">开始时间</param>
        /// <param name="endTime">结束时间</param>
        /// <param name="eventType">事件类型</param>
        /// <param name="eventStatus">事件状态</param>
        /// <param name="searchCondition">查询条件</param>
        /// <param name="sort">排序字段默认EventID</param>
        /// <param name="ordering">desc/asc</param>
        /// <param name="num">默认20</param>
        /// <param name="page">默认1</param>
        /// <returns></returns>
        public MessageEntity Get(DateTime? startTime = null, DateTime? endTime = null, int? eventType = null, int? eventStatus = null, string searchCondition = "", string sort = "EventID", string ordering = "desc", int num = 20, int page = 1)
        {
            var messageEntity = _eventManage.GetEventListForInspection(startTime, endTime, eventType, eventStatus, searchCondition, sort, ordering, num, page);

            return messageEntity;
        }
        /// <summary>
        /// 获取时间段内时间数量
        /// </summary>
        /// <param name="startTime"></param>
        /// <param name="endTime"></param>
        /// <returns></returns>
        public MessageEntity GetCount(DateTime startTime , DateTime endTime)
        {
            var messageEntity = _eventManage.GetEventListCount(startTime, endTime);

            return messageEntity;
        }

        /// <summary>
        /// 事件选中删除(事件管理-事件删除)(伪删除 修改DeleteStatus为1)
        /// </summary>
        /// <param name="eventId">事件id</param>
        /// <returns></returns>
        public MessageEntity Delete(int eventId)
        {
            return _eventManage.Delete(new { EventID = eventId, });
        }
    }
}