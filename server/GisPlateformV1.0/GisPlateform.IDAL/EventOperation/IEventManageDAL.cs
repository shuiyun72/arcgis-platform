using GisPlateform.Model.BaseEntity;
using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;

namespace GisPlateform.IDAL.EventOperation
{
    public interface IEventManageDAL : IDependency
    {
        MessageEntity GetEventListForInspection(DateTime? startTime,DateTime? endTime,int? eventType,int? eventStatus,string searchCondition, string sort, string ordering, int num, int page);
        /// <summary>
        /// 事件工单查询
        /// </summary>
        /// <param name="startTime">开始时间</param>
        /// <param name="endTime">结束时间</param>
        /// <param name="EventFromId">事件来源</param>
        /// <param name="eventType">事件类型</param>
        /// <param name="DeptId">上报部门id</param>
        /// <param name="EventContenct">查询条件(事件来源:类型、上报人、编号)</param>
        /// <param name="OperId">操作记录行id</param>
        /// <param name="IsValid">是否有效</param>
        /// <param name="sort">排序字段默认EventID</param>
        /// <param name="ordering">desc/asc</param>
        /// <param name="num">默认20</param>
        /// <param name="page">默认1</param>
        MessageEntity GetEventWorkorderListForMaintain(DateTime? startTime, DateTime? endTime, int? EventFromId, int? eventType,int? EventID, string OperId, int? IsValid, int? DeptId, string EventContenct,string ExecPersonId, string sort, string ordering, int num, int page);
        /// <summary>
        /// 事件工单处理信息
        /// </summary>
        /// <param name="EventID"></param>
        /// <returns></returns>
        MessageEntity GetEventWorkorderStepForMaintain(int? EventID);
        MessageEntity GetEventListCount(DateTime? startTime, DateTime? endTime);
        MessageEntity Delete(Object planType);
        /// <summary>
        /// 事件工单作废
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="OrderId">工单编号</param>
        /// <param name="OperId">步骤ID 0:无效 1: 待处理 2:待接受  3:待处置 4 5:处置中  5:延期确认  6:待审核  7:审核完成  11:待处理  12:回复完成  null:待分派</param>
        /// <param name="DispatchPersonID">处理人ID</param>
        /// <returns></returns>
        MessageEntity WorkorderInvalid(string EventID, string OrderId, string execPersonId, string idetpID, string OperId);
        /// <summary>
        /// 事件工单（接单）
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="OrderId">工单编号</param>
        /// <param name="OperId">步骤ID 0:无效 1: 待处理 2:待接受  3:待处置 4 5:处置中  5:延期确认  6:待审核  7:审核完成  11:待处理  12:回复完成  null:待分派</param>
        /// <param name="DispatchPersonID">指派人ID</param>
        /// <returns></returns>
        MessageEntity WorkListReceipt(string EventID, string ExecPersonId, string ExecDetpID, string OrderId, string OperId, string DispatchPersonID, string OperRemarks);

        /// <summary>
        /// 事件工单审核
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="OrderId">工单编号</param>
        /// <param name="StepNum">步骤id</param>
        /// <param name="iAdminID">登陆人员ID</param>
        /// <param name="OperRemarks">操作意见</param>
        /// <returns></returns>
        MessageEntity WorkListAudit(string EventID, string OrderId, string iDetpID, string OperRemarks, string satisfaction, string StepNum, string iAdminID);
        /// <summary>
        /// 事件工单到场
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="OrderId">工单编号</param>
        /// <param name="StepNum">步骤id</param>
        /// <param name="DispatchPersonID">指派人ID</param>
        /// <param name="OperRemarks">操作意见</param>
        /// <returns></returns>

        MessageEntity WorkListPresent(string EventID, string ExecPersonId, string ExecDetpID, string OrderId, string StepNum, string DispatchPersonID, string OperRemarks,string eventPictures);
        MessageEntity WorkListChuZhi(string EventID, string ExecPersonId, string ExecDetpID, string OrderId, string StepNum, string DispatchPersonID, string OperRemarks,string eventPictures);
        MessageEntity WorkListFinished(string EventID, string OrderId, string StepNum, string iAdminID, string OperRemarks, string eventPictures);
        MessageEntity WorkListReAssign(string EventID, string ExecDetpID, string ExecPersonId, string DispatchPersonID);
        MessageEntity DelWordList(string EventID);
        MessageEntity WorkListAssign(string EventID, string ExecDetpID, string ExecPersonId, string DispatchPersonI, string ExecTime);
        MessageEntity WorkListBackToOper(string EventID, string iAdminID, string BackDesc, string PersonId, string DeptId);
        MessageEntity WordListBackExec(string EventID, string OrderId, string iAdminID, string BackDesc,string iDeptID);
        MessageEntity WordListDelay(string EventID, string OrderId, string OperRemarks, string complishTime, string DeptId, string iAdminID);
        MessageEntity WorkListDelayExec(string EventID, string OrderId, string complishTime, string iDeptID, string iAdminID, string OperRemarks);
        MessageEntity WorkListDelayReturn(string EventID, string OrderId, string complishTime, string iDeptID, string iAdminID, string OperRemarks);
        MessageEntity WorkListEventReply(string EventID, string OrderId,string DispatchPersonID, string OperRemarks);
        MessageEntity GetEventListOwn(int? OwnID, DateTime? startTime, DateTime? endTime, string sort, string ordering, int num, int page);
        MessageEntity PostEvent(M_Event m_Event, M_WorkOrder_Oper_History workOrder_Oper_History);
        DataTable GetEventExecTime(int eventTypeID);
        DataTable  GetPostponeOrderSQ(string eventId, String orderId);
        DataTable GetPostponeOrderFH(string eventId, String orderId);

    }
}
