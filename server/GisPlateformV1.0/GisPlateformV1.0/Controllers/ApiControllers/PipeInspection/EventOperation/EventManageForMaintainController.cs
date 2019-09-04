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
    /// 事件工单查询（养护）
    /// </summary>
    [WebApiFilterAttribute]
    public class EventManageForMaintainController  : BaseApiController
    {
        private readonly IEventManageDAL _eventManage;
        /// <summary>
        /// 
        /// </summary>
        /// <param name="commonDAL"></param>
        /// <param name="eventManage"></param>
        public EventManageForMaintainController(ICommonDAL commonDAL, IEventManageDAL eventManage) : base(commonDAL)
        {
            _eventManage = eventManage;
        }
        /// <summary>
        /// 事件工单查询(个人处理-待办处理)
        /// </summary>
        /// <param name="startTime">开始时间</param>
        /// <param name="endTime">结束时间</param>
        /// <param name="EventFromId">事件来源</param>
        /// <param name="eventType">事件类型</param>
        /// <param name="DeptId">上报部门id</param>
        /// <param name="EventContenct">查询条件(事件来源:类型、上报人、编号)</param>
        /// <param name="ExecPersonId">执行人ID(个人处理--待办处理传入字段)</param>
        /// <param name="EventID">事件ID</param>
        /// <param name="OperId">事件处理状态步骤ID 0:无效 1: 待处理 2:待接受  3:待处置 4到场 5:处置中  5:延期确认  6:待审核  7:审核完成  11:待处理  12:回复完成  null:待分派</param>
        /// <param name="IsValid">是否有效   1有效   0无效  2 退回  3 回复 4:退单 5延期 6 延期确认</param>
        /// <param name="sort">排序字段默认EventID</param>
        /// <param name="ordering">desc/asc</param>
        /// <param name="num">默认20</param>
        /// <param name="page">默认1</param>
        /// <returns></returns>
        public MessageEntity Get(DateTime? startTime = null, DateTime? endTime = null, int? EventFromId = null, int? eventType = null, int? EventID = null, string OperId = "", int? IsValid = null, int? DeptId = null, string EventContenct = "",string ExecPersonId=null, string sort = "EventID", string ordering = "desc", int num = 20, int page = 1)
        {
            var messageEntity = _eventManage.GetEventWorkorderListForMaintain(startTime, endTime, EventFromId, eventType, EventID, OperId, IsValid,DeptId, EventContenct, ExecPersonId, sort, ordering, num, page);

            return messageEntity;
        }
        /// <summary>
        /// 事件工单处理信息
        /// </summary>
        /// <param name="EventID">事件id</param>
        /// <returns></returns>
        public MessageEntity GetEventWorkorderStepForMaintain(int? EventID)
        {
            return _eventManage.GetEventWorkorderStepForMaintain(EventID);
        }
        /// <summary>
        /// 事件工单作废
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="OrderId">工单编号</param>
        /// <param name="OperId">步骤ID 0:无效 1: 待处理 2:待接受  3:待处置 4 5:处置中  5:延期确认  6:待审核  7:审核完成  11:待处理  12:回复完成  null:待分派</param>
        /// <param name="DispatchPersonID">指派人ID</param>
        /// <returns></returns>
        public MessageEntity WorkorderInvalid(string EventID , string OrderId = "0", string OperId = "", string DispatchPersonID = "")
        {
            return _eventManage.WorkorderInvalid(EventID, OrderId, OperId, DispatchPersonID);
        }
        /// <summary>
        /// 事件工单流转操作（审核)
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="OrderId">工单编号</param>
        /// <param name="StepNum">步骤id(7)</param>
        /// <param name="iAdminID">登陆ID</param>
        /// <param name="OperRemarks">操作意见</param>
        /// <returns></returns>
        public MessageEntity WorkListAudit(string EventID, string OrderId = "0", string StepNum = "7", string iAdminID = "", string OperRemarks="")
        {
            return _eventManage.WorkListAudit(EventID, OrderId,  StepNum, iAdminID, OperRemarks);
        }
        /// <summary>
        /// 事件工单流转操作（接单)
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="OrderId">工单编号</param>
        /// <param name="StepNum">步骤id(3)</param>
        /// <param name="DispatchPersonID">指派人ID</param>
        /// <param name="OperRemarks">操作意见</param>
        /// <returns></returns>
        public MessageEntity WorkListReceipt(string EventID, string OrderId = "0", string StepNum = "3", string DispatchPersonID = "", string OperRemarks = "")
        {
            return _eventManage.WorkListReceipt(EventID, OrderId, StepNum, DispatchPersonID, OperRemarks);
        }
        /// <summary>
        /// 事件工单流转操作（到场)
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="base64Image">上传照片</param>
        /// <param name="OrderId">工单编号</param>
        /// <param name="StepNum">步骤id(4)</param>
        /// <param name="DispatchPersonID">指派人ID</param>
        /// <param name="OperRemarks">操作意见</param>
        /// <returns></returns>
        public MessageEntity WorkListPresent(string EventID, [FromBody]string[] base64Image, string OrderId = "0", string StepNum = "4", string DispatchPersonID = "", string OperRemarks = "")
        {
            string eventPictures = string.Empty;
            ImageFactory imageFactory = new ImageFactory();
            //将照片存储到/upload/EventsImg  返回url
            eventPictures = imageFactory.getPictureUrl(base64Image);
            if (eventPictures != null && !eventPictures.Contains("/"))
            {
                return MessageEntityTool.GetMessage(ErrorType.SystemError, eventPictures);
            }
            return _eventManage.WorkListPresent(EventID, OrderId, StepNum, DispatchPersonID, OperRemarks, eventPictures);
        }
        /// <summary>
        /// 事件工单流转操作（处置)
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="base64Image">上传照片</param>
        /// <param name="OrderId">工单编号</param>
        /// <param name="StepNum">步骤id(5)</param>
        /// <param name="DispatchPersonID">指派人ID</param>
        /// <param name="OperRemarks">操作意见</param>
        /// <returns></returns>
        public MessageEntity WorkListChuZhi(string EventID, [FromBody]string[] base64Image, string OrderId = "0", string StepNum = "5", string DispatchPersonID = "", string OperRemarks = "")
        {
            string eventPictures = string.Empty;
            ImageFactory imageFactory = new ImageFactory();
            //将照片存储到/upload/EventsImg  返回url
            eventPictures = imageFactory.getPictureUrl(base64Image);
            if (eventPictures != null && !eventPictures.Contains("/"))
            {
                return MessageEntityTool.GetMessage(ErrorType.SystemError, eventPictures);
            }
            return _eventManage.WorkListChuZhi(EventID, OrderId, StepNum, DispatchPersonID, OperRemarks, eventPictures);
        }
        /// <summary>
        /// 事件工单流转操作（完工)
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="base64Image">上传照片</param>
        /// <param name="OrderId">工单编号ID</param>
        /// <param name="StepNum">步骤id(6)</param>
        /// <param name="iAdminID">登陆人员ID</param>
        /// <param name="OperRemarks">操作意见</param>
        /// <returns></returns>
        public MessageEntity WorkListFinished(string EventID, [FromBody]string[] base64Image, string OrderId = "0", string StepNum = "6", string iAdminID = "", string OperRemarks = "")
        {
            string eventPictures = string.Empty;
            ImageFactory imageFactory = new ImageFactory();
            //将照片存储到/upload/EventsImg  返回url
            eventPictures = imageFactory.getPictureUrl(base64Image);
            if (eventPictures != null && !eventPictures.Contains("/"))
            {
                return MessageEntityTool.GetMessage(ErrorType.SystemError, eventPictures);
            }
            return _eventManage.WorkListFinished(EventID, OrderId, StepNum, iAdminID, OperRemarks, eventPictures);
        }
        /// <summary>
        ///  事件工单流转操作（转派工单)
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="ExecDetpID">执行人部门ID</param>
        /// <param name="ExecPersonId">执行人ID</param>
        /// <param name="DispatchPersonID">指派人ID</param>
        /// <returns></returns>
        public MessageEntity WorkListReAssign(string EventID, string ExecDetpID, string ExecPersonId, string DispatchPersonID)
        {
            return _eventManage.WorkListReAssign(EventID, ExecDetpID, ExecPersonId, DispatchPersonID);
        }
        /// <summary>
        /// 事件工单流转操作（删除工单）
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <returns></returns>
        public MessageEntity DelWordList(string EventID)
        {
            return _eventManage.DelWordList(EventID);
        }
        /// <summary>
        ///  事件工单流转操作（分派工单)
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="ExecDetpID">执行人部门ID</param>
        /// <param name="ExecPersonId">执行人ID</param>
        /// <param name="DispatchPersonID">指派人ID</param>
        /// <param name="ExecTime">处理时间（单位：小时)</param>
        /// <returns></returns>
        public MessageEntity WorkListAssign(string EventID, string ExecDetpID, string ExecPersonId, string DispatchPersonID, string ExecTime)
        {
            return _eventManage.WorkListAssign(EventID, ExecDetpID, ExecPersonId, DispatchPersonID, ExecTime);
        }
        
        /// <summary>
        ///  事件工单流转操作（退回  热线退单)
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="iAdminID">当前登陆人员id</param>
        /// <param name="BackDesc">退回备注</param>
        /// <param name="PersonId">事件上报人id</param>
        /// <param name="DeptId">事件所属部门ID</param>
        /// <returns></returns>
        public MessageEntity WorkListBackToOper(string EventID, string iAdminID, string BackDesc, string PersonId, string DeptId)
        {
            return _eventManage.WorkListBackToOper(EventID, iAdminID, BackDesc, PersonId, DeptId);
        }
        /// <summary>
        ///  事件工单流转操作(退单)工单生成后，退单
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="OrderId">工单编号ID</param>
        /// <param name="iAdminID">登陆人员id</param>
        /// <param name="BackDesc">退单备注</param>
        /// <param name="iDeptID">登陆人员部门ID</param>
        /// <returns></returns>
        public MessageEntity WordListBackExec(string EventID, string OrderId, string iAdminID, string BackDesc,string iDeptID)
        {
            return _eventManage.WordListBackExec(EventID, OrderId, iAdminID, BackDesc, iDeptID);
        }
        /// <summary>
        /// 事件工单流转操作（延期)
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="OrderId">工单编号ID</param>
        /// <param name="OperRemarks">延期完成说明</param>
        /// <param name="complishTime">延期完成时间</param>
        /// <param name="PersonId">事件上报人ID</param>
        /// <param name="DeptId">事件所属部门ID</param>
        /// <param name="iAdminID">登陆人员ID</param>
        /// <returns></returns>
        public MessageEntity WordListDelay(string EventID, string OrderId, string OperRemarks, string complishTime, string PersonId, string DeptId,string iAdminID)
        {
            return _eventManage.WordListDelay(EventID, OrderId, OperRemarks, complishTime, PersonId, DeptId,iAdminID);
        }
        /// <summary>
        /// 事件工单流转操作（延期确认)
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="OrderId">工单编号ID</param>
        /// <param name="complishTime">延期完成事件</param>
        /// <param name="iDeptID">登陆人员所属部门ID</param>
        /// <param name="iAdminID">登陆人员ID</param>
        /// <returns></returns>
        public MessageEntity WorkListDelayExec(string EventID, string OrderId, string complishTime, string iDeptID, string iAdminID)
        {
            return _eventManage.WorkListDelayExec(EventID, OrderId, complishTime, iDeptID, iAdminID);
        }
        /// <summary>
        /// 事件工单处理(回复)按钮
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="OrderId">工单编号</param>
        /// <param name="DispatchPersonID">指派人ID</param>
        /// <param name="OperRemarks">操作意见</param>
        /// <returns></returns>
        public MessageEntity WorkListEventReply(string EventID, string OrderId = "0",  string DispatchPersonID = "", string OperRemarks = "")
        {
            return _eventManage.WorkListEventReply(EventID, OrderId, DispatchPersonID, OperRemarks);

        }

        /// <summary>
        /// 个人处理-已办处理
        /// </summary>
        /// <param name="startTime">开始时间</param>
        /// <param name="endTime">结束时间</param>
        /// <param name="OwnID">当前登陆人员ID</param>
        /// <param name="sort">排序字段默认EventID</param>
        /// <param name="ordering">desc/asc</param>
        /// <param name="num">默认20</param>
        /// <param name="page">默认1</param>
        /// <returns></returns>
        public MessageEntity GetEventListOwn( int? OwnID,DateTime? startTime = null, DateTime? endTime = null, string sort = "EventID", string ordering = "desc", int num = 20, int page = 1)
        {
            var messageEntity = _eventManage.GetEventListOwn(OwnID, startTime, endTime,  sort, ordering, num, page);

            return messageEntity;
        }

    }
}
