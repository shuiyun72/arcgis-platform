using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using GisPlateformV1_0.App_Authorize;
using GisPlateformV1_0.AttributePack;
using GisPlateform.IDAL;
using GisPlateform.Model;
using GisPlateform.Model.BaseEntity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GisPlateformV1_0.Controllers.ApiControllers.InspectionSettings
{
    /// <summary>
    /// 事件类型管理
    /// </summary>
    [WebApiFilterAttribute]
    public class EventTypeController : BaseApiController
    {
        private readonly IEventTypeDAL _eventTypeDAL;

        /// <summary>
        /// 区域点位
        /// </summary>
        public EventTypeController(IEventTypeDAL eventType, ICommonDAL commonDAL) : base(commonDAL)
        {
            _eventTypeDAL = eventType;
        }
        /// <summary>
        ///  获取事件分类
        /// </summary>
        /// <param name="sort">排序(默认EventTypeName)</param>
        /// <param name="ordering">asc/desc</param>
        /// <param name="num">每页多少行</param>
        /// <param name="page">第几页</param>
        /// <returns></returns>
        public MessageEntity Get(string sort, string ordering, int num, int page)
        {
            var messageEntity = _eventTypeDAL.GetEventType(sort, ordering, num, page);
            return messageEntity;
        }
        /// <summary>
        /// 获取事件分类列表
        /// </summary>
        /// <returns>EventTypeId 事件类型eventTypeId EventTypeName 事件类型Name</returns>
        public MessageEntity GetCommboboxList()
        {
            var messageEntity = _eventTypeDAL.GetEventTypeCommboBoxList();
            return messageEntity;
        }

        /// <summary>
        /// 添加事件类型
        /// </summary>
        /// <param name="eventType"> string EventTypeName 事件名称
        /// /int ExecTime 执行时间/int ParentTypeId 上级分类Id(不用传)/</param>
        /// <returns></returns>
        // POST api/<controller>
        public MessageEntity Post([FromBody]M_EventType eventType)
        {
            eventType.ParentTypeId = 0;
            var messageEntity = _eventTypeDAL.AddEventType(eventType);
            return messageEntity;
        }

        /// <summary>
        /// 修改事件类型
        /// </summary>
        /// <param name="eventTypeId">事件类型eventTypeId</param>
        /// <param name="eventType"> string EventTypeName 事件名称/int ExecTime 执行时间/int ParentTypeId 上级分类Id(不用传)/</param>
        public MessageEntity Put(int eventTypeId, [FromBody]M_EventType eventType)
        {
            if (string.IsNullOrEmpty(eventType.EventTypeName))
            {
                return MessageEntityTool.GetMessage(ErrorType.FieldError);
            }
            eventType.ParentTypeId = 0;
            eventType.EventTypeId = eventTypeId;
            var messageEntity = _eventTypeDAL.UpdateEventType(eventType);

            return messageEntity;
        }

        /// <summary>
        /// 删除事件类型
        /// </summary>
        /// <param name="eventTypeId">事件类型eventTypeId</param>
        /// <returns></returns>
        public MessageEntity Delete(int eventTypeId)
        {
            M_EventType eventType = new M_EventType
            {
                EventTypeId = eventTypeId
            };
            var messageEntity = _eventTypeDAL.DeleteEventType(eventType);

            return messageEntity;

        }
    }
}