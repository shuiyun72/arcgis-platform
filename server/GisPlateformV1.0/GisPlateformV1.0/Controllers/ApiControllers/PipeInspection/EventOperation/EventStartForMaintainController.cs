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
namespace GisPlateformV1_0.Controllers.ApiControllers.PipeInspection.EventOperation
{
    /// <summary>
    /// 事件来源（养护）
    /// </summary>
    [WebApiFilterAttribute]
    public class EventStartForMaintainController : BaseApiController
    {
        private readonly IEventStartForMaintainDAL _eventStart;
        /// <summary>
        /// 
        /// </summary>
        /// <param name="commonDAL"></param>
        /// <param name="eventStart"></param>
        public EventStartForMaintainController(ICommonDAL commonDAL, IEventStartForMaintainDAL eventStart) : base(commonDAL)
        {
            _eventStart = eventStart;
        }
        /// <summary>
        /// 事件来源下拉框
        /// </summary>
        /// <returns></returns>
        public MessageEntity GetEventFromComboBoxList()
        {
            return _eventStart.GetEventFromComboBoxList();
        }
        /// <summary>
        /// 紧急程度下拉框
        /// </summary>
        /// <returns></returns>
        public MessageEntity GetUrgencyComboBoxList()
        {
            return _eventStart.GetUrgencyComboBoxList();
        }
        /// <summary>
        /// 个人处理--发起事件
        /// </summary>
        /// <param name="iAdminID">登陆人员ID</param>
        /// <param name="cAdminName">登陆人员</param>
        /// <param name="iDeptID">部门ID</param>
        /// <param name="EventFromId">事件来源ID</param>
        /// <param name="UrgencyId">紧急程度ID</param>
        /// <param name="EventTypeId">事件类型ID</param>
        /// <param name="EventTypeId2">事件内容ID</param>
        /// <param name="EventTypeName">事件类型</param>
        /// <param name="EventTypeName2">事件内容</param>
        /// <param name="LinkMan">联系人</param>
        /// <param name="LinkCall">联系电话</param>
        /// <param name="EventAddress">事件地址</param>
        /// <param name="EventX">横坐标</param>
        /// <param name="EventY">纵坐标</param>
        /// <param name="ExecDetpID">处理部门ID</param>
        /// <param name="ExecPersonId">处理人</param>
        /// <param name="EventDesc"></param>
        /// <returns></returns>
        public MessageEntity AddEventStart(string iAdminID, string cAdminName, string iDeptID,int? EventFromId, int? UrgencyId , int? EventTypeId , int? EventTypeId2 ,string EventTypeName,string EventTypeName2,string EventX,string EventY,int? ExecDetpID,int? ExecPersonId,string EventDesc=null, string LinkMan = null, string LinkCall = null, string EventAddress = null)
        {
            string EventCode = "";
            if (EventFromId == 1)
            {
                EventCode = "DH";
            }
            else if (EventFromId == 2)
            {
                EventCode = "RX";
            }
            else if (EventFromId == 3)
            {
                EventCode = "XJ";
            }
            else
            {
                EventCode = "LS";
            }
            return _eventStart.AddEventStart(iAdminID,cAdminName,iDeptID,EventFromId, UrgencyId, EventTypeId, EventTypeId2,EventTypeName, EventTypeName2,EventX,EventY, ExecDetpID,ExecPersonId, EventCode,EventDesc, LinkMan, LinkCall, EventAddress);
        }


    }
}
