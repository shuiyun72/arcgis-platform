using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using GisPlateformV1_0.App_Authorize;
using GisPlateformV1_0.AttributePack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using GisPlateform.CommonTools;
using GisPlateform.IDAL;
using GisPlateform.IDAL.EventOperation;
using GisPlateform.Model.BaseEntity;
using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
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
        public MessageEntity GetCount(DateTime startTime, DateTime endTime)
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
        /// <summary>
        /// 新增事件
        /// </summary>
        /// <param name="personId"></param>
        /// <param name="adminName"></param>
        /// <param name="deptId"></param>
        /// <param name="eventFromId"></param>
        /// <param name="urgencyId"></param>
        /// <param name="eventTypeId"></param>
        /// <param name="eventTypeId2"></param>
        /// <param name="linkMan"></param>
        /// <param name="linkCall"></param>
        /// <param name="eventAddress"></param>
        /// <param name="eventX"></param>
        /// <param name="eventY"></param>
        /// <param name="execDetpId"></param>
        /// <param name="execPersonId"></param>
        /// <param name="eventDesc"></param>
        /// <param name="base64Image"></param>
        /// <returns></returns>
        public MessageEntity Post(int personId, string adminName, int deptId, int eventFromId, int urgencyId, int eventTypeId, int eventTypeId2, string linkMan, string linkCall, string eventAddress, string eventX, string eventY, int execDetpId, int execPersonId, string eventDesc, [FromBody]string[] base64Image)
        {
            DateTime dateNow = DateTime.Now;
            M_Event m_Event = new M_Event();
            ImageFactory imageFactory = new ImageFactory();
            //将照片存储到/upload/EventsImg  返回url
            m_Event.EventPictures = imageFactory.getPictureUrl(base64Image);
            if (m_Event.EventPictures !=null && !m_Event.EventPictures.Contains("/"))
            {
                return MessageEntityTool.GetMessage(ErrorType.SystemError, m_Event.EventPictures);
            }

            if (eventFromId == 1)
            {
                m_Event.EventCode = "DH";
            }
            else if (eventFromId == 2)
            {
                m_Event.EventCode = "RX";
            }
            else if (eventFromId == 3)
            {
                m_Event.EventCode = "XJ";
            }
            else
            {
                m_Event.EventCode = "LS";
            }
            m_Event.EventAddress = eventAddress;
            m_Event.UpTime = dateNow;
            m_Event.PersonId = personId;
            m_Event.PName = adminName;
            m_Event.DeptId = deptId;
            m_Event.EventTypeId = eventTypeId;
            m_Event.EventTypeId2 = eventTypeId2;
            m_Event.EventFromId = eventFromId;
            m_Event.UrgencyId = urgencyId;
            m_Event.HandlerLevelId = 1;
            m_Event.EventDesc = eventDesc;
            m_Event.EventX = eventX;
            m_Event.EventY = eventY;
            m_Event.EventUpdateTime = dateNow;
            m_Event.IsValid = 1;
            m_Event.DeleteStatus = "0";
            m_Event.TaskId = -1;
            m_Event.ExecTime =36;
            m_Event.LinkMan = linkMan;
            m_Event.LinkCall = linkCall;

            return _eventManage.PostEvent(m_Event, new M_WorkOrder_Oper_History() {
                OperId = 11,
                OperTime=dateNow,
                ExecPersonId= execPersonId,
                DispatchPersonID=personId,
                ExecDetpID= execDetpId
            });
        }
    }
}