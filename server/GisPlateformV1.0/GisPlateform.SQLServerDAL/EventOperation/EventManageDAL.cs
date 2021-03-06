﻿using Dapper;
using GisPlateform.Database;
using GisPlateform.IDAL.EventOperation;
using GisPlateform.Model.BaseEntity;
using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
namespace GisPlateform.SQLServerDAL.EventOperation
{
    public class EventManageDAL : BaseDAL, IEventManageDAL
    {
        public MessageEntity Delete(object obj)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                var rows = 0;
                var excSql = "update M_Event set  DeleteStatus=1 where  DeleteStatus=0 and EventID=@EventID";

                try
                {
                    rows = conn.Execute(excSql, obj);
                    return MessageEntityTool.GetMessage(rows);
                }
                catch (Exception e)
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                }
            }
        }

        public MessageEntity GetEventListCount(DateTime? startTime, DateTime? endTime)
        {
            string queryStr = $@"select count (0) [count] from M_Event as a 
                                                LEFT JOIN L_Person as b ON a.PersonId=b.PersonId 
                                                LEFT JOIN M_EventFrom as c ON a.EventFromId=c.EventFromId 
                                                LEFT JOIN L_Department as d ON a.DeptId=d.DeptId
                                                LEFT JOIN M_WorkOrder w ON a.EventID=w.EventID
                                                LEFT JOIN (select MAX(OperId) OperId,OrderId from M_WorkOrder_Oper_History Group by OrderId) h ON w.OrderId=h.OrderId 
                                                LEFT JOIN (select EventTypeId,EventTypeName from M_EventType where ParentTypeId=0) ET1 on a.EventTypeId=ET1.EventTypeId
                                                LEFT JOIN (select EventTypeId,EventTypeName from M_EventType where ParentTypeId<>0) ET2 on a.EventTypeId2=ET2.EventTypeId	
												LEFT JOIN dbo.M_WorkOrder_Oper woo ON woo.OperId = h.OperId
                                                where a.DeleteStatus=0   and  c.EventFromId=3  and UpTime >='{startTime}' and UpTime <='{endTime}' ";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    dynamic eventType = conn.Query<dynamic>(queryStr);

                    return MessageEntityTool.GetMessage(1, eventType);
                }
            }
            catch (Exception e)
            {
                return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
            }
        }

        public MessageEntity GetEventListForInspection(DateTime? startTime, DateTime? endTime, int? eventType, int? eventStatus, string searchCondition, string sort, string ordering, int num, int page)
        {
            if (string.IsNullOrEmpty(sort))
            {
                sort = "EventID";
            }

            if (string.IsNullOrEmpty(ordering))
            {
                ordering = "desc";
            }

            string sql = string.Format(@"SELECT w.OrderCode,a.*,
       b.PersonName,
       c.EventFromName,
       d.DeptName,
       h.OperId,
       w.OrderId,
       w.PreEndTime,
       ET1.EventTypeName ET1,
       ET2.EventTypeName ET2,
       case when  woo.OperName2 is null then '待分派' else  woo.OperName2  end AS statusName,
	   hl.HandlerLevelName,
	   lp.PersonName AS DispatchPersonName,
	   u.UrgencyName
	  
FROM M_Event AS a
    LEFT JOIN L_Person AS b
        ON a.PersonId = b.PersonId
    LEFT JOIN M_EventFrom AS c
        ON a.EventFromId = c.EventFromId
    LEFT JOIN L_Department AS d
        ON a.DeptId = d.DeptID
    LEFT JOIN M_WorkOrder w
        ON a.EventID = w.EventID
		AND w.OrderStatus=0
    LEFT JOIN
     (
		SELECT w.OrderId,w.OperId,w.EventID FROM M_WorkOrder_Oper_History w RIGHT JOIN 
      ( SELECT woh.EventID,max(woh.ExecUpDateTime) ExecUpDateTime FROM M_WorkOrder_Oper_History woh GROUP BY woh.EventID) t ON t.EventID = w.EventID AND t.ExecUpDateTime=w.ExecUpDateTime
       
    ) h
        ON a.EventID = h.EventID
    LEFT JOIN
    (
        SELECT EventTypeId,
               EventTypeName
        FROM M_EventType
        WHERE ParentTypeId = 0
    ) ET1
        ON a.EventTypeId = ET1.EventTypeId
    LEFT JOIN
    (
        SELECT EventTypeId,
               EventTypeName
        FROM M_EventType
        WHERE ParentTypeId <> 0
    ) ET2
        ON a.EventTypeId2 = ET2.EventTypeId
    LEFT JOIN dbo.M_WorkOrder_Oper woo
        ON woo.OperId = h.OperId
	LEFT JOIN  dbo.M_HandlerLevel hl ON hl.HandlerLevelId = a.HandlerLevelId
	LEFT JOIN dbo.L_Person lp ON lp.PersonId=a.DispatchPerson
	LEFT JOIN M_Urgency u ON u.UrgencyId = a.UrgencyId
WHERE a.DeleteStatus = 0
      AND c.EventFromId = 3 
      ");
            if (startTime != null)
            {
                sql += " and UpTime>='" + startTime + "' ";
            }
            if (endTime != null)
            {
                sql += " and UpTime<='" + endTime + "' ";
            }
            if (eventType != null)
            {
                sql += " and a.EventTypeId='" + eventType + "' ";
            }
            if (eventStatus != null)
            {
                sql += " and h.operid='" + eventStatus + "' ";
            }
            if (!string.IsNullOrEmpty(searchCondition))
            {
                sql += " and (a.EventCode like '%" + searchCondition + "%'or b.PersonName like '%" + searchCondition + "%' or c.EventFromName like '%" + searchCondition + "%' or w.OrderCode like '%" + searchCondition + "%')";
            }
            DapperExtentions.EntityForSqlToPager<dynamic>(sql, sort, ordering, num, page, out MessageEntity result, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide);

            return result;
        }

        /// <summary>
        /// 事件工单查询
        /// </summary>
        /// <param name="startTime">开始时间</param>
        /// <param name="endTime">结束时间</param>
        /// <param name="EventFromId">事件来源</param>
        /// <param name="eventType">事件类型</param>
        /// <param name="DeptId">上报部门id</param>
        /// <param name="EventContenct">查询条件(事件来源:类型、上报人、编号)</param>
        /// <param name="EventID">事件ID</param>
        /// <param name="OperId">事件处理状态步骤ID 0:无效 1: 待处理 2:待接受  3:待处置 4 :处置中  5:延期确认  6:待审核  7:审核完成  11:待处理  12:回复完成  null:待分派</param>
        /// <param name="IsValid">是否有效   1有效   0无效  2 退回  3 回复 4:退单 5延期 6 延期确认</param>
        /// <param name="sort">排序字段默认EventID</param>
        /// <param name="ordering">desc/asc</param>
        /// <param name="num">默认20</param>
        /// <param name="page">默认1</param>
        /// <returns></returns>
        public MessageEntity GetEventWorkorderListForMaintain(DateTime? startTime, DateTime? endTime, int? EventFromId, int? eventType, int? EventID, string OperId, int? IsValid, int? DeptId, string EventContenct, string ExecPersonId, string iDeptIDs, string sort, string ordering, int num, int page)
        {
            if (string.IsNullOrEmpty(sort))
            {
                sort = "EventID";
            }

            if (string.IsNullOrEmpty(ordering))
            {
                ordering = "desc";
            }

            string sql = string.Format(@"select * from (SELECT   A.EventID, A.EventCode,H.OrderCode, A.EventAddress, A.UpTime, A.DeptId, A.PersonId, G.PersonName, G.cDepName, G.cRoleName, 
                A.EventTypeId, A.EventTypeId2, B.EventTypeName, B1.EventTypeName AS EventTypeName2, A.EventFromId, 
                C.EventFromName, A.UrgencyId, D.UrgencyName, A.DispatchPerson, E.PersonName AS DispatchPersonName, 
                A.EventPictures, A.EventDesc, A.EventX, A.EventY, A.EventUpdateTime, A.IsValid, J.IsValidName, A.Devicesmid, 
                A.DevicesType, A.DeleteStatus, A.TaskId, A.Remark_Back, A.OtherSysEventId, A.ExecTime, 
                H.OrderId, CASE WHEN (H.OperId = 8) THEN 1 WHEN (H.OperId = 12) THEN 1 ELSE 0 END AS IsFinish, A.LinkMan, 
                A.LinkCall, A.EventStatus, I.StatusName, H.ExecPersonId, H.ExecUpDateTime, H.ExecDetpID, H.ExecDetpName, 
                H.ExecPersonName, H.DispatchPersonID, H.DispatchPersonName AS DispatchPersonName2 ,--记录表中被指派人员 
                H.DispatchPersonDeptName,H.OperId, H.OperName,  H.OperName2, H.OperRemarks, E.Telephone AS DispatchPersonTelePhone, 
                eli.LeakPipeCaliber, eli.LeakType,H.iDeptID
FROM            dbo.M_Event AS A LEFT OUTER JOIN
                dbo.M_EventType AS B ON A.EventTypeId = B.EventTypeId LEFT OUTER JOIN
                dbo.M_EventType AS B1 ON A.EventTypeId2 = B1.EventTypeId LEFT OUTER JOIN
                dbo.M_EventFrom AS C ON A.EventFromId = C.EventFromId LEFT OUTER JOIN
                dbo.M_Urgency AS D ON A.UrgencyId = D.UrgencyId LEFT OUTER JOIN L_Person AS E ON A.DispatchPerson = E.iAdminID LEFT OUTER JOIN--指派人员信息 E
               L_Person   AS G ON A.PersonId = G.iAdminID LEFT OUTER JOIN--上报人信息 G
				(SELECT a.EventID, B.HistoryId, B.OrderId, B.OperId, C.OperName, B.Pictures, B.Voices, 
      B.OperRemarks, B.DispatchPersonID, B.ExecPersonId, B.ExecUpDateTime, 
      B.ExecDetpID, D.cDepName AS ExecDetpName, 
      D.PersonName AS ExecPersonName, E.PersonName AS DispatchPersonName, 
      E.cDepName AS DispatchPersonDeptName, C.OperName2,B.OrderCode,D.iDeptID
FROM (SELECT MAX(ExecUpDateTime) AS ExecUpDateTime,h.EventID
        FROM dbo.M_WorkOrder_Oper_History h 
        GROUP BY h.EventID) AS a LEFT OUTER JOIN
        (SELECT dbo.M_WorkOrder_Oper_History.HistoryId, 
      dbo.M_WorkOrder_Oper_History.OrderId, dbo.M_WorkOrder.OrderCode, dbo.M_WorkOrder_Oper_History.OperId, 
      dbo.M_WorkOrder_Oper_History.OperTime, 
      dbo.M_WorkOrder_Oper_History.Pictures, dbo.M_WorkOrder_Oper_History.Voices, 
      dbo.M_WorkOrder_Oper_History.OperRemarks, 
      dbo.M_WorkOrder_Oper_History.DispatchPersonID, 
      dbo.M_WorkOrder_Oper_History.ExecUpDateTime, 
      dbo.M_WorkOrder_Oper_History.ExecDetpID, 
      dbo.M_WorkOrder_Oper_History.IsValid, 
     M_WorkOrder_Oper_History.ExecPersonId, 
      CASE WHEN dbo.M_WorkOrder_Oper_History.EventID IS NULL 
      THEN dbo.M_WorkOrder.EventID ELSE dbo.M_WorkOrder_Oper_History.EventID END AS
       EventID
FROM dbo.M_WorkOrder_Oper_History LEFT OUTER JOIN
      dbo.M_WorkOrder ON 
      dbo.M_WorkOrder_Oper_History.OrderId = dbo.M_WorkOrder.OrderId) as B ON a.EventID = B.EventID AND a.ExecUpDateTime = B.ExecUpDateTime LEFT OUTER JOIN
      dbo.M_WorkOrder_Oper AS C ON B.OperId = C.OperId LEFT OUTER JOIN
      L_Person  AS D ON B.ExecPersonId = D.iAdminID LEFT OUTER JOIN
      L_Person   AS E ON B.DispatchPersonID = E.iAdminID
)AS H ON H.EventID = A.EventID --处理信息 处理单位 最后一步骤处理人 E
LEFT OUTER JOIN dbo.M_Status AS I ON A.EventStatus = I.StatusID 
LEFT OUTER JOIN dbo.M_IsValidStatus AS J ON A.IsValid = J.IsValidID 
LEFT OUTER JOIN dbo.M_EventLeakInfo AS eli ON eli.OrderId = H.OrderId where a.DeleteStatus=0) v  
		  
		  
		 ");
            #region 条件
            sql += " where 1=1 ";
            if (startTime != null)
            {
                sql += " and UpTime>='" + startTime + "' ";
            }
            if (endTime != null)
            {
                endTime = DateTime.Parse(endTime.ToString()).AddDays(1);
                sql += " and UpTime<='" + endTime + "' ";
            }
            if (DeptId != null)//部门id
            {
                sql += " and DeptId='" + DeptId + "'";
            }
            if (eventType != null)//事件类型
            {
                sql += " and EventTypeId='" + eventType + "' ";
            }
            if (!string.IsNullOrEmpty(EventContenct))//事件查找  编号 上报人  类型
            {
                sql += " and (EventCode like '%" + EventContenct + "%'or PersonName like '%" + EventContenct + "%' or EventFromName like '%" + EventContenct + "%' or OrderCode like '%" + EventContenct + "%')";
            }
            if (EventFromId != null)//事件来源
            {
                sql += " and EventFromId=" + EventFromId;
            }
            if (OperId != null && OperId !="")//步骤id  事件处理状态
            {
                if (OperId == "1")
                {
                    sql += " and OperId is null";
                }
                else
                {
                    sql += " and OperId in(" + OperId + ") and IsValid<>0";
                }
            }
            if (IsValid != null)//是否有效
            {
                if (IsValid == 1)
                {
                    sql += " and IsValid>'0'";
                }
                else
                {
                    sql += " and IsValid='" + IsValid + "'";
                }

            }
            if (EventID != null)//事件id
            {
                sql += " and EventID='" + EventID + "'";
            }
            if (ExecPersonId != null)
            {
                
                sql += " and (ExecPersonId='" + ExecPersonId + "' or iDeptID in("+ iDeptIDs + ") ) and OperId not in(7,8)";
            }
            #endregion

            DapperExtentions.EntityForSqlToPager<dynamic>(sql, sort, ordering, num, page, out MessageEntity result, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide);

            return result;
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
        public MessageEntity GetEventListOwn(int? OwnID, DateTime? startTime, DateTime? endTime, string sort, string ordering, int num, int page)
        {
            if (string.IsNullOrEmpty(sort))
            {
                sort = "EventID";
            }

            if (string.IsNullOrEmpty(ordering))
            {
                ordering = "desc";
            }

            string sql = string.Format(@"select * from (SELECT   A.EventID, A.EventCode, A.EventAddress, A.UpTime, A.DeptId, A.PersonId, G.PersonName, G.cDepName, G.cRoleName, 
                A.EventTypeId, A.EventTypeId2, B.EventTypeName, B1.EventTypeName AS EventTypeName2, A.EventFromId, 
                C.EventFromName, A.UrgencyId, D.UrgencyName, A.DispatchPerson, E.PersonName AS DispatchPersonName, 
                A.EventPictures, A.EventDesc, A.EventX, A.EventY, A.EventUpdateTime, A.IsValid, J.IsValidName, A.Devicesmid, 
                A.DevicesType, A.DeleteStatus, A.TaskId, A.Remark_Back, A.OtherSysEventId, A.ExecTime, 
                H.OrderId, CASE WHEN (H.OperId = 7) THEN 1 WHEN (H.OperId = 12) THEN 1 ELSE 0 END AS IsFinish, A.LinkMan, 
                A.LinkCall, A.EventStatus, I.StatusName, H.ExecPersonId, H.ExecUpDateTime, H.ExecDetpID, H.ExecDetpName, 
                H.ExecPersonName, H.DispatchPersonID, H.DispatchPersonName AS DispatchPersonName2 ,--记录表中被指派人员 
                H.DispatchPersonDeptName,H.OperId, H.OperName,  H.OperName2, H.OperRemarks, E.Telephone AS DispatchPersonTelePhone, 
                eli.LeakPipeCaliber, eli.LeakType
FROM            dbo.M_Event AS A LEFT OUTER JOIN
                dbo.M_EventType AS B ON A.EventTypeId = B.EventTypeId LEFT OUTER JOIN
                dbo.M_EventType AS B1 ON A.EventTypeId2 = B1.EventTypeId LEFT OUTER JOIN
                dbo.M_EventFrom AS C ON A.EventFromId = C.EventFromId LEFT OUTER JOIN
                dbo.M_Urgency AS D ON A.UrgencyId = D.UrgencyId LEFT OUTER JOIN
               L_Person  AS E ON A.DispatchPerson = E.iAdminID LEFT OUTER JOIN--指派人员信息 E
               L_Person   AS G ON A.PersonId = G.iAdminID LEFT OUTER JOIN--上报人信息 G
				(SELECT a.EventID, B.HistoryId, B.OrderId, B.OperId, C.OperName, B.Pictures, B.Voices, 
      B.OperRemarks, B.DispatchPersonID, B.ExecPersonId, B.ExecUpDateTime, 
      B.ExecDetpID, D.cDepName AS ExecDetpName, 
      D.PersonName AS ExecPersonName, E.PersonName AS DispatchPersonName, 
      E.cDepName AS DispatchPersonDeptName, C.OperName2
FROM (SELECT MAX(ExecUpDateTime) AS ExecUpDateTime,h.EventID
        FROM dbo.M_WorkOrder_Oper_History h 
        GROUP BY h.EventID) AS a LEFT OUTER JOIN
        (SELECT dbo.M_WorkOrder_Oper_History.HistoryId, 
      dbo.M_WorkOrder_Oper_History.OrderId, dbo.M_WorkOrder_Oper_History.OperId, 
      dbo.M_WorkOrder_Oper_History.OperTime, 
      dbo.M_WorkOrder_Oper_History.Pictures, dbo.M_WorkOrder_Oper_History.Voices, 
      dbo.M_WorkOrder_Oper_History.OperRemarks, 
      dbo.M_WorkOrder_Oper_History.DispatchPersonID, 
      dbo.M_WorkOrder_Oper_History.ExecUpDateTime, 
      dbo.M_WorkOrder_Oper_History.ExecDetpID, 
      dbo.M_WorkOrder_Oper_History.IsValid, 
      dbo.M_WorkOrder_Oper_History.ExecPersonId, 
      CASE WHEN dbo.M_WorkOrder_Oper_History.EventID IS NULL 
      THEN dbo.M_WorkOrder.EventID ELSE dbo.M_WorkOrder_Oper_History.EventID END AS
       EventID
FROM dbo.M_WorkOrder_Oper_History LEFT OUTER JOIN
      dbo.M_WorkOrder ON 
      dbo.M_WorkOrder_Oper_History.OrderId = dbo.M_WorkOrder.OrderId) as B ON a.EventID = B.EventID AND a.ExecUpDateTime = B.ExecUpDateTime LEFT OUTER JOIN
      dbo.M_WorkOrder_Oper AS C ON B.OperId = C.OperId LEFT OUTER JOIN
      L_Person  AS D ON B.ExecPersonId = D.iAdminID LEFT OUTER JOIN
       L_Person   AS E ON B.DispatchPersonID = E.iAdminID
)AS H ON H.EventID = A.EventID --处理信息 处理单位 最后一步骤处理人 E
LEFT OUTER JOIN dbo.M_Status AS I ON A.EventStatus = I.StatusID 
LEFT OUTER JOIN dbo.M_IsValidStatus AS J ON A.IsValid = J.IsValidID 
LEFT OUTER JOIN dbo.M_EventLeakInfo AS eli ON eli.OrderId = H.OrderId where a.DeleteStatus=0) v 
right join (SELECT EventID as ID FROM M_WorkOrder_Oper_History WHERE (DispatchPersonID = {0} OR ExecPersonId ={0}) AND EventID IS NOT NULL GROUP BY EventID) AA   ON AA.ID = v.EventID
		 ", OwnID);
            #region 条件
            sql += " where 1=1 ";
            if (startTime != null)
            {
                sql += " and UpTime>='" + startTime + "' ";
            }
            if (endTime != null)
            {
                endTime = DateTime.Parse(endTime.ToString()).AddDays(1);
                sql += " and UpTime<='" + endTime + "' ";
            }
            #endregion

            DapperExtentions.EntityForSqlToPager<dynamic>(sql, sort, ordering, num, page, out MessageEntity result, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide);

            return result;
        }

        /// <summary>
        /// 事件工单处理信息
        /// </summary>
        /// <param name="EventID"></param>
        /// <returns></returns>
        public MessageEntity GetEventWorkorderStepForMaintain(int? EventID)
        {
            string sql = string.Format(@"SELECT B.HistoryId, B.OrderId, B.OperId, B.ExecUpDateTime,case when B.IsValid in(4,5,6,7) then  F.IsValidName else   C.OperName end as OperName, B.Pictures, 
      B.Voices, B.OperRemarks, B.DispatchPersonID, B.ExecPersonId, B.ExecDetpID, 
      D.cDepName AS ExecDetpName, D.PersonName AS ExecPersonName, 
      E.PersonName AS DispatchPersonName, 
      E.cDepName AS DispatchPersonDeptName, C.OperName2, B.IsValid, F.IsValidName, B.Satisfaction,
      B.EventID,wo.OrderStatus,po.PostponeTime,po.Cause
FROM   (SELECT dbo.M_WorkOrder_Oper_History.HistoryId, 
      dbo.M_WorkOrder_Oper_History.OrderId, dbo.M_WorkOrder_Oper_History.OperId, 
      dbo.M_WorkOrder_Oper_History.OperTime, 
      dbo.M_WorkOrder_Oper_History.Pictures, dbo.M_WorkOrder_Oper_History.Voices, 
      dbo.M_WorkOrder_Oper_History.OperRemarks, 
      dbo.M_WorkOrder_Oper_History.DispatchPersonID, 
      dbo.M_WorkOrder_Oper_History.ExecUpDateTime, 
      dbo.M_WorkOrder_Oper_History.ExecDetpID, 
      dbo.M_WorkOrder_Oper_History.IsValid, 
      dbo.M_WorkOrder_Oper_History.Satisfaction, 
       dbo.M_WorkOrder_Oper_History.ExecPersonId, 
      CASE WHEN dbo.M_WorkOrder_Oper_History.EventID IS NULL 
      THEN dbo.M_WorkOrder.EventID ELSE dbo.M_WorkOrder_Oper_History.EventID END AS
       EventID
FROM dbo.M_WorkOrder_Oper_History LEFT OUTER JOIN
      dbo.M_WorkOrder ON 
      dbo.M_WorkOrder_Oper_History.OrderId = dbo.M_WorkOrder.OrderId)B
  LEFT OUTER JOIN    dbo.M_WorkOrder_Oper AS C ON B.OperId = C.OperId
    LEFT OUTER JOIN      L_Person  AS D ON B.ExecPersonId = D.iAdminID --处理人员信息
    LEFT OUTER JOIN    L_Person  AS E ON B.DispatchPersonID = E.iAdminID--派发人员信息
    LEFT OUTER JOIN dbo.M_IsValidStatus AS F ON B.IsValid = F.IsValidID
	LEFT JOIN dbo.M_WorkOrder  AS wo ON b.OrderId = wo.OrderId
  LEFT JOIN M_PostponeOrder po on po.HistoryId = B.HistoryId  where 1=1 ");
            if (EventID != null)//事件id
            {
                sql += " and B.EventID='" + EventID + "'";
                //过滤处理步骤
                sql += " and B.orderid <> '11'";
            }
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    dynamic result = conn.Query<dynamic>(sql);

                    return MessageEntityTool.GetMessage(1, result);
                }
            }
            catch (Exception e)
            {
                return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
            }
        }
        /// <summary>
        /// 事件工单作废
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="OrderId">工单编号</param>
        /// <param name="OperId">步骤ID 0:无效 1: 待处理 2:待接受  3:待处置 4 5:处置中  5:延期确认  6:待审核  7:审核完成  11:待处理  12:回复完成  null:待分派</param>
        /// <param name="execPersonId">处理人ID</param>
        /// <returns></returns>
        public MessageEntity WorkorderInvalid(string EventID, string OrderId, string execPersonId, string idetpID, string OperId)
        {
            var updateSql = "update  M_Event set IsValid=0 where DeleteStatus=0 and EventID=@EventID";
            string insertSql = @"INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,DispatchPersonID,ExecPersonId,ExecDetpID ) VALUES ( @EventID,@OrderId,@OperId,@OperTime,@DispatchPersonID,@ExecPersonId,@ExecDetpID ); ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        conn.Execute(updateSql, new { EventID = EventID }, transaction);
                        var i = conn.Execute(insertSql, new { EventID = EventID, OperId = OperId, OrderId = OrderId, OperTime = DateTime.Now.ToString(), DispatchPersonID = execPersonId, ExecPersonId=execPersonId, ExecDetpID= idetpID }, transaction);

                        transaction.Commit();
                        return MessageEntityTool.GetMessage(1, null, true);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                    }
                }
            }
        }
        /// <summary>
        /// 事件工单审核
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="OrderId">工单编号</param>
        /// <param name="StepNum">步骤id（7)</param>
        /// <param name="iAdminID">登陆人员ID</param>
        /// <param name="OperRemarks">操作意见</param>
        /// <returns></returns>
        public MessageEntity WorkListAudit(string EventID, string OrderId, string iDetpID, string OperRemarks, string satisfaction, string StepNum, string iAdminID)
        {
            //审核
            string insertSql = @" INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,DispatchPersonID,ExecPersonId,ExecDetpID,Satisfaction,OperRemarks,ExecUpDateTime ) VALUES (@EventID,@OrderId,@OperId,@OperTime,@DispatchPersonID,@ExecPersonId,@ExecDetpID,@Satisfaction,@OperRemarks,@ExecUpDateTime   ); ";
            //完成OperId=8 完成
            string insertSql1 = @" INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,DispatchPersonID,ExecPersonId,ExecDetpID,Satisfaction,OperRemarks,ExecUpDateTime ) VALUES (@EventID,@OrderId,@OperId,@OperTime,@DispatchPersonID,@ExecPersonId,@ExecDetpID,@Satisfaction,@OperRemarks ,@ExecUpDateTime  ); ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        var i = conn.Execute(insertSql, new { EventID = EventID, OrderId = OrderId, OperId = StepNum, OperTime = DateTime.Now.ToString(), ExecUpDateTime = DateTime.Now.ToString(), DispatchPersonID = iAdminID, OperRemarks= OperRemarks, ExecPersonId=iAdminID, ExecDetpID= iDetpID, Satisfaction =satisfaction}, transaction);
                        var i1 = conn.Execute(insertSql1, new { EventID = EventID, OrderId = OrderId, OperId = 8, OperTime = DateTime.Now.AddHours(1).ToString(), ExecUpDateTime = DateTime.Now.AddMinutes(1).ToString(), DispatchPersonID = iAdminID, OperRemarks = OperRemarks, ExecPersonId = iAdminID, ExecDetpID = iDetpID, Satisfaction = satisfaction }, transaction);

                        transaction.Commit();
                        return MessageEntityTool.GetMessage(1, null, true);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                    }
                }
            }
        }


        /// <summary>
        /// 事件工单（接单）
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="ExecPersonId">处理人id</param>
        /// <param name="ExecDetpID">处理人部门id</param>
        /// <param name="OrderId">工单编号</param>
        /// <param name="StepNum">步骤id（3)</param>
        /// <param name="DispatchPersonID">指派人ID</param>
        /// <param name="OperRemarks">操作意见</param>
        /// <returns></returns>
        public MessageEntity WorkListReceipt(string EventID, string ExecPersonId, string ExecDetpID, string OrderId, string StepNum, string DispatchPersonID, string OperRemarks)
        {
            string insertSql = @" INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,OperRemarks,DispatchPersonID,ExecPersonId,ExecDetpID ) VALUES (@EventID,@OrderId,@OperId,@OperTime,@OperRemarks,@DispatchPersonID,@ExecPersonId,@ExecDetpID   ); ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        var i = conn.Execute(insertSql, new { EventID = EventID, ExecPersonId= ExecPersonId, ExecDetpID= ExecDetpID, OrderId = OrderId, OperId = StepNum, OperTime = DateTime.Now.ToString(), DispatchPersonID = DispatchPersonID, OperRemarks = OperRemarks }, transaction);

                        transaction.Commit();
                        return MessageEntityTool.GetMessage(1, null, true);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                    }
                }
            }
        }
        /// <summary>
        /// 事件工单（到场）
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="ExecPersonId">处理人id</param>
        /// <param name="ExecDetpID">处理人部门id</param>
        /// <param name="OrderId">工单编号</param>
        /// <param name="StepNum">步骤id（4)</param>
        /// <param name="DispatchPersonID">指派人ID</param>
        /// <param name="OperRemarks">操作意见</param>
        ///  <param name="eventPictures">上传照片</param>
        /// <returns></returns>
        public MessageEntity WorkListPresent(string EventID, string ExecPersonId, string ExecDetpID, string OrderId, string StepNum, string DispatchPersonID, string OperRemarks, string eventPictures)
        {
            string insertSql = @" INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,OperRemarks,Pictures,ExecPersonId,ExecDetpID ) VALUES (@EventID,@OrderId,@OperId,@OperTime,@OperRemarks,@Pictures ,@ExecPersonId,@ExecDetpID  ); ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        var i = conn.Execute(insertSql, new { EventID = EventID, ExecPersonId = ExecPersonId, ExecDetpID = ExecDetpID, OrderId = OrderId, OperId = StepNum, OperTime = DateTime.Now.ToString(), DispatchPersonID = DispatchPersonID, OperRemarks = OperRemarks, Pictures = eventPictures }, transaction);

                        transaction.Commit();
                        return MessageEntityTool.GetMessage(1, null, true);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                    }
                }
            }
        }

        /// <summary>
        /// 事件工单（处置）
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="ExecPersonId">处理人id</param>
        /// <param name="ExecDetpID">处理人部门id</param>
        /// <param name="OrderId">工单编号</param>
        /// <param name="StepNum">步骤id（5)</param>
        /// <param name="DispatchPersonID">指派人ID</param>
        /// <param name="OperRemarks">操作意见</param>
        ///  <param name="eventPictures">上传照片</param>

        /// <returns></returns>
        public MessageEntity WorkListChuZhi(string EventID, string ExecPersonId, string ExecDetpID, string OrderId, string StepNum, string DispatchPersonID, string OperRemarks, string eventPictures)
        {
            string insertSql = @" INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,OperRemarks,Pictures,ExecPersonId,ExecDetpID ) VALUES (@EventID,@OrderId,@OperId,@OperTime,@OperRemarks,@Pictures,@ExecPersonId,@ExecDetpID   ); ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        var i = conn.Execute(insertSql, new { EventID = EventID, ExecPersonId = ExecPersonId, ExecDetpID = ExecDetpID, OrderId = OrderId, OperId = StepNum, OperTime = DateTime.Now.ToString(), DispatchPersonID = DispatchPersonID, OperRemarks = OperRemarks, Pictures = eventPictures }, transaction);

                        transaction.Commit();
                        return MessageEntityTool.GetMessage(1, null, true);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                    }
                }
            }
        }
        /// <summary>
        /// 事件工单完工
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="OrderId">工单编号</param>
        /// <param name="StepNum">步骤id（6)</param>
        /// <param name="iAdminID">登陆人员id</param>
        /// <param name="OperRemarks">操作意见</param>
        /// <param name="eventPictures">上传照片</param>

        /// <returns></returns>

        public MessageEntity WorkListFinished(string EventID, string OrderId, string StepNum, string iAdminID, string OperRemarks, string eventPictures)
        {
            string insertSql = @" INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,DispatchPersonID,ExecPersonId,ExecDetpID,Pictures,OperRemarks ) VALUES (@EventID,@OrderId,@OperId,@OperTime,@DispatchPersonID,(SELECT TOP 1 ExecPersonId  FROM M_WorkOrder_Oper_History where EventID=" + EventID + " AND dbo.M_WorkOrder_Oper_History.OperId =11   ORDER BY ExecUpDateTime DESC ),(SELECT TOP 1 ExecDetpID  FROM M_WorkOrder_Oper_History where EventID=" + EventID + " AND dbo.M_WorkOrder_Oper_History.OperId =11   ORDER BY ExecUpDateTime DESC ),@Pictures ,@OperRemarks  ); ";

            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        var i = conn.Execute(insertSql, new { EventID = EventID, OrderId = OrderId, OperId = StepNum, OperTime = DateTime.Now.ToString(), DispatchPersonID = iAdminID, OperRemarks = OperRemarks, Pictures = eventPictures }, transaction);

                        transaction.Commit();
                        return MessageEntityTool.GetMessage(1, null, true);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                    }
                }
            }
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
        public MessageEntity WorkListAssign(string EventID, string ExecDetpID, string ExecPersonId, string DispatchPersonID,string ExecTime)
        {
            var updateSql = "update  M_Event set IsValid=1,EventUpdateTime=@EventUpdateTime,DispatchPerson=@DispatchPerson where EventID=@EventID;";
            //插入分派工单记录
            string insertworkorderSql = @"  insert into M_WorkOrder(EventID,DeptId,PersonId,DispatchPerson,OrderTime,PreEndTime) VALUES (@EventID,@DeptId,@PersonId,@DispatchPerson,@OrderTime,@PreEndTime); update M_WorkOrder Set OrderCode='GD' +(select CONVERT(varchar(12) , getdate(), 112 ) + isnull(right('00' + CONVERT(NVARCHAR, MAX( SUBSTRING(OrderCode,11,3) + 1)), 3),'001') FROM M_WorkOrder  where CONVERT(varchar(12), OrderTime, 112) >=  CONVERT(varchar(100), GETDATE(), 111))  where OrderId= @@IDENTITY; ";
           // var updateorderSql = "declare @ID int;set @ID = @@IDENTITY ;update M_WorkOrder Set OrderCode='GD' + SUBSTRING(CONVERT(NVARCHAR, YEAR(SYSDATETIME())), 3, 2) + right('0000000' + CONVERT(NVARCHAR, @@ID ), 7) where OrderId= @@ID; ";

            string insertSql = @"INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,DispatchPersonID,ExecPersonId,ExecDetpID,IsValid ) VALUES ( @EventID,@@IDENTITY,@OperId,@OperTime,@DispatchPersonID,@ExecPersonId,@ExecDetpID,@IsValid ); ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        conn.Execute(updateSql, new { EventID = EventID, EventUpdateTime=DateTime.Now.ToString(), DispatchPerson=DispatchPersonID }, transaction);
                        //插入份派工单记录
                        var i = conn.Execute(insertworkorderSql, new { EventID = EventID, DeptId = ExecDetpID, PersonId = ExecPersonId, DispatchPerson=DispatchPersonID, OrderTime = DateTime.Now.ToString(), PreEndTime = DateTime.Now.AddHours(Convert.ToInt32(ExecTime)).ToString() }, transaction);
                        // conn.Execute(updateorderSql, transaction);
                        //var i1= conn.Execute(updateorderSql, transaction);
                        var ii = conn.Execute(insertSql, new { EventID = EventID, OperId = 2, OperTime = DateTime.Now.ToString(), DispatchPersonID = DispatchPersonID, ExecPersonId = ExecPersonId, ExecDetpID = ExecDetpID, IsValid = 1 }, transaction);

                        transaction.Commit();
                        return MessageEntityTool.GetMessage(1, null, true);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                    }
                }
            }
        }
        /// <summary>
        /// 是否执行过分派2 接单3 到场4 处置5 完工6 审核完成7 8
        /// </summary>
        /// <param name="eventID"></param>
        /// <param name="errorMsg"></param>
        /// <returns></returns>
        public bool IsExecute(string eventID, string StepNum, out string errorMsg)
        {
            errorMsg = "";
            string sql = $@"select top 1 OperId from M_WorkOrder_Oper_History  where EventID={eventID} order by HistoryId desc";

            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                try
                {

                    List<dynamic> list = conn.Query<dynamic>(sql).ToList();

                    if (list.Count > 0 && list[0].OperId == Int32.Parse( StepNum))
                    {
                        return true;
                    }

                    else
                    {
                        return false;
                    }
                }
                catch (Exception e)
                {

                    errorMsg = e.Message;
                    return false;
                }
            }
        }

        /// <summary>
        /// 是否执行过 退单4  延期 5  延期确认6 延期确认退回7 
        /// </summary>
        /// <param name="eventID"></param>
        /// <param name="errorMsg"></param>
        /// <returns></returns>
        public bool IsValid(string eventID, string isValid, out string errorMsg)
        {
            errorMsg = "";
            string sql = $@"select top 1 IsValid from M_WorkOrder_Oper_History  where EventID={eventID} order by HistoryId desc";

            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                try
                {

                    List<dynamic> list = conn.Query<dynamic>(sql).ToList();

                    if (list.Count > 0 && list[0].IsValid == Int32.Parse(isValid))
                    {
                        return true;
                    }

                    else
                    {
                        return false;
                    }
                }
                catch (Exception e)
                {

                    errorMsg = e.Message;
                    return false;
                }
            }
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
            var updateSql = "update  M_Event set IsValid=1,EventUpdateTime=@EventUpdateTime,DispatchPerson=@DispatchPerson where EventID=@EventID";
            string insertSql = @"INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,DispatchPersonID,ExecPersonId,ExecDetpID,IsValid ) VALUES ( @EventID,@OrderId,@OperId,@OperTime,@DispatchPersonID,@ExecPersonId,@ExecDetpID,@IsValid ); ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        conn.Execute(updateSql, new { EventID = EventID, EventUpdateTime = DateTime.Now.ToString(), DispatchPerson = DispatchPersonID }, transaction);
                        var i = conn.Execute(insertSql, new { EventID = EventID, OperId = 11, OrderId = "", OperTime = DateTime.Now.ToString(), DispatchPersonID = DispatchPersonID, ExecPersonId = ExecPersonId, ExecDetpID = ExecDetpID, IsValid = 1 }, transaction);

                        transaction.Commit();
                        return MessageEntityTool.GetMessage(1, null, true);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                    }
                }
            }
        }
        /// <summary>
        /// 删除工单
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <returns></returns>
        public MessageEntity DelWordList(string EventID)
        {
            var updateSql = " update M_Event set DeleteStatus = 1 where DeleteStatus = 0 and EventID = @EventID;";
              using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                      
                        var i = conn.Execute(updateSql, new { EventID = EventID }, transaction);
                        transaction.Commit();
                        return MessageEntityTool.GetMessage(1, null, true);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                    }
                }
            }
        }
        /// <summary>
        ///  事件工单流转操作(退单)工单生成后，退单
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="OrderId">工单编号ID</param>
        /// <param name="iAdminID">登陆人员id</param>
        /// <param name="BackDesc">退单备注</param>
        /// <param name="iDeptID">登陆人员部门ID</param>
        /// /// <returns></returns>
        public MessageEntity WordListBackExec(string EventID, string OrderId, string iAdminID, string BackDesc,string iDeptID)
        {
            var updateeventSql = "update M_Event Set IsValid=4,Remark_Back = @Remark_Back where EventID=@EventID";
            var updateSql = "update M_WorkOrder Set OrderStatus=1 where OrderId=@OrderId";
            string insertBackSql = string.Format(@"insert into M_WorkOrder_Back (DeptId,PersonId,OrderId,BackTime,BackRemarks)
                                             values (( select p.iDeptID from  L_Person  p where p.iAdminID='{0}'),@PersonId,@OrderId,@BackTime,@BackRemarks); ", iAdminID);
            string insertSql =string.Format(@"INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,OperRemarks,DispatchPersonID,ExecPersonId,ExecDetpID,IsValid ) VALUES ( @EventID,@OrderId,@OperId,@OperTime,@OperRemarks,@DispatchPersonID,(SELECT TOP 1 ExecPersonId  FROM M_WorkOrder_Oper_History where EventID={0} AND dbo.M_WorkOrder_Oper_History.OperId =11   ORDER BY ExecUpDateTime DESC ),(SELECT TOP 1 ExecDetpID  FROM M_WorkOrder_Oper_History where EventID={0} AND dbo.M_WorkOrder_Oper_History.OperId =11   ORDER BY ExecUpDateTime DESC ),@IsValid ); ", EventID);

            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        conn.Execute(updateeventSql, new { EventID = EventID, Remark_Back = BackDesc }, transaction);
                        conn.Execute(updateSql, new { OrderId = OrderId }, transaction);
                        var i = conn.Execute(insertBackSql, new { PersonId = iAdminID, OrderId = OrderId, BackTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), BackRemarks = BackDesc}, transaction);
                        var ii = conn.Execute(insertSql, new { EventID = EventID, OperId = 11, OrderId = OrderId, OperTime = DateTime.Now.ToString(), OperRemarks = BackDesc, DispatchPersonID = iAdminID, IsValid = 4 }, transaction);

                        transaction.Commit();
                        return MessageEntityTool.GetMessage(1, null, true);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                    }
                }
            }
        }
        public MessageEntity WorkListBackToOper(string EventID, string iAdminID, string BackDesc, string PersonId, string DeptId)
        {
            var updateSql = "update M_Event Set IsValid=2,Remark_Back = @Remark_Back where EventID=@EventID";
            string insertSql = @"INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,OperRemarks,DispatchPersonID,ExecPersonId,ExecDetpID,IsValid ) VALUES ( @EventID,@OrderId,@OperId,@OperTime,@OperRemarks,@DispatchPersonID,@ExecPersonId,@ExecDetpID,@IsValid ); ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        conn.Execute(updateSql, new { EventID = EventID, Remark_Back = BackDesc }, transaction);
                        var i = conn.Execute(insertSql, new { EventID = EventID, OperId = 1, OrderId = "", OperTime = DateTime.Now.ToString(), OperRemarks= BackDesc, DispatchPersonID = iAdminID, ExecPersonId = PersonId, ExecDetpID = DeptId, IsValid = 2 }, transaction);

                        transaction.Commit();
                        return MessageEntityTool.GetMessage(1, null, true);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                    }
                }
            }
        }
        /// <summary>
        /// 事件工单流转操作（延期)
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="OrderId">工单编号ID</param>
        /// <param name="OperRemarks">延期完成说明</param>
        /// <param name="complishTime">延期完成事件</param>
        /// <param name="DeptId">事件所属部门ID</param>
        /// <returns></returns>
        public MessageEntity WordListDelay(string EventID, string OrderId, string OperRemarks, string complishTime, string DeptId, string iAdminID)
        {
            var updateeventSql = "update M_Event Set IsValid=5,Remark_Back = @Remark_Back where EventID=@EventID";
         //   var updateSql = "update M_WorkOrder Set OrderStatus=1 where OrderId=@OrderId";
            //string insertBackSql =@"Insert INTO M_PostponeOrder(EventID,OrderId, Cause, PostponeTime, ApplicationTime) VALUES(@EventID,@OrderId, @Cause, @PostponeTime, @ApplicationTime); ";
            string insertSql = string.Format(@"INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,OperRemarks,DispatchPersonID,ExecPersonId,ExecDetpID,IsValid ) VALUES ( @EventID,@OrderId,(SELECT TOP 1 OperId  FROM M_WorkOrder_Oper_History where OrderId={0} ORDER BY ExecUpDateTime DESC ),@OperTime,@OperRemarks,@DispatchPersonID,(SELECT TOP 1 ExecPersonId  FROM M_WorkOrder_Oper_History where EventID={1} AND dbo.M_WorkOrder_Oper_History.OperId =11   ORDER BY ExecUpDateTime DESC ),(SELECT TOP 1 ExecDetpID  FROM M_WorkOrder_Oper_History where EventID={1} AND dbo.M_WorkOrder_Oper_History.OperId =11   ORDER BY ExecUpDateTime DESC ),@IsValid ); Insert INTO M_PostponeOrder(EventID,OrderId, Cause, PostponeTime, ApplicationTime,HistoryId) VALUES(@EventID,@OrderId, @Cause, @PostponeTime, @ApplicationTime,@@IDENTITY); ", OrderId, EventID);

            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        conn.Execute(updateeventSql, new { EventID = EventID, Remark_Back = OperRemarks }, transaction);
                     //   conn.Execute(updateSql, new { OrderId = OrderId }, transaction);
                        //var i = conn.Execute(insertBackSql, new { EventID = EventID, OrderId = OrderId, Cause= OperRemarks.Trim(), PostponeTime = complishTime, ApplicationTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") }, transaction);
                        var ii = conn.Execute(insertSql, new { EventID = EventID, OrderId = OrderId, OperTime = DateTime.Now.ToString(), OperRemarks = OperRemarks, DispatchPersonID =iAdminID, IsValid = 5, Cause = OperRemarks.Trim(), PostponeTime = complishTime, ApplicationTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") }, transaction);

                        transaction.Commit();
                        return MessageEntityTool.GetMessage(1, null, true);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                    }
                }
            }
        }
        /// <summary>
        /// 事件工单流转操作（延期确认)
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="OrderId">工单编号ID</param>
        /// <param name="complishTime">延期完成事件</param>
        /// <param name="iDeptID">登陆人员所属部门ID</param>
        /// <param name="iAdminID">登陆人员ID</param>
        /// <param name="OperRemarks">操作意见</param>
        /// <returns></returns>
        public MessageEntity WorkListDelayExec(string EventID, string OrderId, string complishTime, string iDeptID, string iAdminID, string OperRemarks)
        {

            var updateeventSql = "update M_WorkOrder Set PreEndTime=@PreEndTime where OrderId=@OrderId";
            var updateevsql = "update M_PostponeOrder Set AuditStatus=2 where OrderId=@OrderId";
            var updateSql = "update M_Event Set IsValid=1 where EventID=@EventID";
            string insertSql = string.Format(@"INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,DispatchPersonID,ExecPersonId,ExecDetpID,IsValid,OperRemarks ) VALUES ( @EventID,@OrderId,(SELECT TOP 1 OperId  FROM M_WorkOrder_Oper_History where OrderId={0} ORDER BY ExecUpDateTime DESC ),@OperTime,@DispatchPersonID,(SELECT TOP 1 PersonId  FROM M_WorkOrder where OrderId={0} ORDER BY OrderId DESC ),@ExecDetpID,@IsValid,@OperRemarks ); ", OrderId);

            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        conn.Execute(updateeventSql, new { OrderId = OrderId, PreEndTime= complishTime }, transaction);
                        conn.Execute(updateevsql, new { OrderId = OrderId }, transaction);
                        conn.Execute(updateSql, new { EventID = EventID }, transaction);
                        var ii = conn.Execute(insertSql, new { EventID = EventID, OrderId = OrderId, OperTime = DateTime.Now.ToString(), DispatchPersonID = iAdminID, ExecDetpID = iDeptID, IsValid = 6, OperRemarks= OperRemarks }, transaction);

                        transaction.Commit();
                        return MessageEntityTool.GetMessage(1, null, true);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                    }
                }
            }
        }
        /// <summary>
        /// 事件工单流转操作（延期确认退回)
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="OrderId">工单编号ID</param>
        /// <param name="complishTime">延期完成事件</param>
        /// <param name="iDeptID">登陆人员所属部门ID</param>
        /// <param name="iAdminID">登陆人员ID</param>
        /// <param name="OperRemarks">操作意见</param>
        /// <returns></returns>
        public MessageEntity WorkListDelayReturn(string EventID, string OrderId, string complishTime, string iDeptID, string iAdminID, string OperRemarks)
        {

            var updateeventSql = "update M_WorkOrder Set PreEndTime=@PreEndTime where OrderId=@OrderId";
            var updateevsql = "update M_PostponeOrder Set AuditStatus=2 where OrderId=@OrderId";
            var updateSql = "update M_Event Set IsValid=7 where EventID=@EventID";
            string insertSql = string.Format(@"INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,DispatchPersonID,ExecPersonId,ExecDetpID,IsValid,OperRemarks ) VALUES ( @EventID,@OrderId,(SELECT TOP 1 OperId  FROM M_WorkOrder_Oper_History where OrderId={0} ORDER BY ExecUpDateTime DESC ),@OperTime,@DispatchPersonID,(SELECT TOP 1 PersonId  FROM M_WorkOrder where OrderId={0} ORDER BY OrderId DESC ),@ExecDetpID,@IsValid,@OperRemarks ); ", OrderId);

            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        conn.Execute(updateeventSql, new { OrderId = OrderId, PreEndTime = complishTime }, transaction);
                        conn.Execute(updateevsql, new { OrderId = OrderId }, transaction);
                        conn.Execute(updateSql, new { EventID = EventID }, transaction);
                        var ii = conn.Execute(insertSql, new { EventID = EventID, OrderId = OrderId, OperTime = DateTime.Now.ToString(), DispatchPersonID = iAdminID, ExecDetpID = iDeptID, IsValid = 7, OperRemarks = OperRemarks }, transaction);

                        transaction.Commit();
                        return MessageEntityTool.GetMessage(1, null, true);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                    }
                }
            }
        }
        /// <summary>
        /// 事件工单处理(回复)按钮
        /// </summary>
        /// <param name="EventID">事件ID</param>
        /// <param name="OrderId">工单编号</param>
        /// <param name="DispatchPersonID">指派人ID</param>
        /// <param name="OperRemarks">操作意见</param>
        /// <returns></returns>
        public MessageEntity WorkListEventReply(string EventID, string OrderId, string DispatchPersonID, string OperRemarks)
        {
            var updateSql = "  update M_Event Set Remark_Back = @Remark_Back,IsValid = '3' where EventID=@EventID";
            string insertSql = @"INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,OperRemarks,DispatchPersonID ) VALUES ( @EventID,@OrderId,@OperId,@OperTime,@OperRemarks,@DispatchPersonID ); ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        conn.Execute(updateSql, new { EventID = EventID, Remark_Back = OperRemarks }, transaction);
                        var i = conn.Execute(insertSql, new { EventID = EventID, OrderId = OrderId, OperId = 12, OperTime = DateTime.Now.ToString(), OperRemarks = OperRemarks, DispatchPersonID = DispatchPersonID }, transaction);

                        transaction.Commit();
                        return MessageEntityTool.GetMessage(1, null, true);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                    }
                }
            }
        }
        public DataTable GetEventExecTime(int eventTypeID)
        {
            string errorMsg = "";
            string sql = " select * from M_EventType where ParentTypeId=0 and EventTypeId=@EventTypeId";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    DataTable dt_Type = new DataTable();
                    dt_Type.Load(conn.ExecuteReader(sql,new { EventTypeId = eventTypeID })); 

                    return dt_Type;
                }
            }
            catch (Exception e)
            {
                errorMsg = e.Message;
                return null;
            }
        }
        public MessageEntity PostEvent(M_Event m_Event, M_WorkOrder_Oper_History workOrder_Oper_History)
        {
            string m_eventInsertSQL = $@"INSERT INTO M_Event
           (EventCode,
            EventAddress,
            UpTime,
            PersonId,
            PName,
            DeptId,
            EventTypeId,
            EventTypeId2,
            EventFromId,
            UrgencyId,
            HandlerLevelId,
            EventDesc,
            EventX,
            EventY,
            EventUpdateTime,
            IsValid,
            DeleteStatus,
            TaskId,
            ExecTime,
            LinkMan,
            LinkCall,
            EventPictures)
     VALUES
           ((SELECT '{m_Event.EventCode}' +CONVERT(varchar(12) , getdate(), 112 ) + isnull(right('00' + CONVERT(NVARCHAR, MAX( SUBSTRING(EventCode,11,3) + 1)), 3),'001') FROM M_Event  where UpTime>=  CONVERT(varchar(100), GETDATE(), 23))
           ,'{m_Event.EventAddress}'
           ,'{m_Event.UpTime}'
           ,{m_Event.PersonId}
           ,'{m_Event.PName}'
           ,{m_Event.DeptId}
           ,{m_Event.EventTypeId}
           ,{m_Event.EventTypeId2}
           ,{m_Event.EventFromId}
           ,{m_Event.UrgencyId}
           ,{m_Event.HandlerLevelId}
           ,'{m_Event.EventDesc}'
           ,'{m_Event.EventX}'
           ,'{m_Event.EventY}'
           ,'{m_Event.EventUpdateTime}'
           ,{m_Event.IsValid}
           ,'{m_Event.DeleteStatus}'
           ,{m_Event.TaskId}
           ,{m_Event.ExecTime}
           ,'{m_Event.LinkMan}'
           ,'{m_Event.LinkCall}'
           ,'{m_Event.EventPictures}');";


            string workOrder_Oper_HistoryInsertSQL = $@"INSERT INTO M_WorkOrder_Oper_History
           (EventID,
            OperId,
            OperTime,
            ExecPersonId,
            DispatchPersonID,
            ExecDetpID)
     VALUES
           (@@IDENTITY
           ,11
           ,'{workOrder_Oper_History.OperTime}'
           ,{workOrder_Oper_History.ExecPersonId}
           ,{workOrder_Oper_History.DispatchPersonID}
           ,{workOrder_Oper_History.ExecDetpID}
           );";

            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                int rows = 0;
                try
                {
                    rows = conn.Execute(m_eventInsertSQL + workOrder_Oper_HistoryInsertSQL);
                    return MessageEntityTool.GetMessage(rows);
                }
                catch (Exception e)
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                }
            }
        }

        /// <summary>
        /// 获取延期申请数据
        /// </summary>
        /// <param name="eventId">事件id</param>
        /// <param name="orderId">工单id</param>
        /// <returns>{“result”:true，”message “:”成功！”}</returns>
        public DataTable GetPostponeOrderSQ(string eventId, String orderId)
        {
            string errorMsg = "";
            #region 条件
            string strWhere = " ";
            if (!string.IsNullOrEmpty(eventId))
            {
                strWhere = string.Format(@"and h.eventId = {0}", eventId);
            }
            #endregion
            //延期申请数据
            string query = string.Format(@"   SELECT DISTINCT PostponeID,p.PostponeTime,p.Cause,h.EventID FROM M_WorkOrder_Oper_History h  JOIN M_PostponeOrder p ON p.EventID=h.EventID 
            WHERE h.IsValid=7 {0} ORDER BY p.PostponeID desc", strWhere);
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    DataTable dt = new DataTable();
                    dt.Load(conn.ExecuteReader(query)); //此类别下时间段内隐患名称出现的个数

                    return dt;
                }
            }
            catch (Exception e)
            {
                errorMsg = e.Message;
                return null;
            }
        }
        /// <summary>
        /// 获取延期退回数据
        /// </summary>
        /// <param name="eventId">事件id</param>
        /// <param name="orderId">工单id</param>
        /// <returns>{“result”:true，”message “:”成功！”}</returns>
        public DataTable GetPostponeOrderFH(string eventId, String orderId)
        {
            string errorMsg = "";
            #region 条件
            string strWhere = " ";
            if (!string.IsNullOrEmpty(eventId))
            {
                strWhere = string.Format(@"and h.eventId = {0}", eventId);
            }
            #endregion
            //延期申请数据
            string query = string.Format(@"  SELECT h.EventID,h.HistoryId,h.OperRemarks as Cause,h.IsValid  FROM M_WorkOrder_Oper_History h  
            WHERE h.IsValid in(7,6) {0} ORDER BY h.HistoryId desc", strWhere);
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    DataTable dt = new DataTable();
                    dt.Load(conn.ExecuteReader(query)); //此类别下时间段内隐患名称出现的个数

                    return dt;
                }
            }
            catch (Exception e)
            {
                errorMsg = e.Message;
                return null;
            }
        }
        /// <summary>
        /// 获取分派员分派的工单超期未接单总数统计
        /// </summary>
        /// <param name="iAdminID"></param>
        /// <returns></returns>
        public MessageEntity GetOvertimeNoReceipt(string iAdminID)
        {
            string errorMsg = "";

            string query = $@" SELECT COUNT(0) AS CScount FROM (
select   DATEDIFF(hh,  h1.ExecUpDateTime, GETDATE())-A.ExecTime AS timeDiff,A.* from  dbo.M_Event AS A 	 
          JOIN (SELECT max(HistoryId) HistoryId,EventID FROM dbo.M_WorkOrder_Oper_History   group by EventID) H on H.EventID=A.EventID
		  LEFT OUTER JOIN dbo.M_WorkOrder_Oper_History  h1 on h1.HistoryId=h.HistoryId 
		    LEFT OUTER JOIN dbo.M_WorkOrder O ON A.EventID=O.EventID
		  where  O.DispatchPerson={iAdminID} and h1.OperId=2) W WHERE W.timeDiff>0";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    List<dynamic> sumcount = conn.Query<dynamic>(query).ToList();

                    return MessageEntityTool.GetMessage(sumcount.Count(), sumcount, true, "", sumcount.Count());
                }
            }
            catch (Exception e)
            {
                errorMsg = e.Message;
                return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
            }
        }
        /// <summary>
        /// 获取分派员分派的工单超期未接单信息
        /// </summary>
        /// <param name="iAdminID"></param>
        /// <returns></returns>
        public MessageEntity GetOvertimeNoReceiptInfo(string iAdminID)
        {
            string errorMsg = "";

            string query = $@" select * from (SELECT   A.EventID, A.EventCode,H.OrderCode, A.EventAddress, A.UpTime, A.DeptId, A.PersonId, G.PersonName, G.cDepName, G.cRoleName, 
                A.EventTypeId, A.EventTypeId2, B.EventTypeName, B1.EventTypeName AS EventTypeName2, A.EventFromId, 
                C.EventFromName, A.UrgencyId, D.UrgencyName, A.DispatchPerson, E.PersonName AS DispatchPersonName, 
                A.EventPictures, A.EventDesc, A.EventX, A.EventY, A.EventUpdateTime, A.IsValid, J.IsValidName, A.Devicesmid, 
                A.DevicesType, A.DeleteStatus, A.TaskId, A.Remark_Back, A.OtherSysEventId, A.ExecTime, 
                H.OrderId, CASE WHEN (H.OperId = 8) THEN 1 WHEN (H.OperId = 12) THEN 1 ELSE 0 END AS IsFinish, A.LinkMan, 
                A.LinkCall, A.EventStatus, I.StatusName, H.ExecPersonId, H.ExecUpDateTime, H.ExecDetpID, H.ExecDetpName, 
                H.ExecPersonName, H.DispatchPersonID, H.DispatchPersonName AS DispatchPersonName2 ,--记录表中被指派人员 
                H.DispatchPersonDeptName,H.OperId, H.OperName,  H.OperName2, H.OperRemarks, E.Telephone AS DispatchPersonTelePhone, 
                eli.LeakPipeCaliber, eli.LeakType
FROM            dbo.M_Event AS A LEFT OUTER JOIN
                dbo.M_EventType AS B ON A.EventTypeId = B.EventTypeId LEFT OUTER JOIN
                dbo.M_EventType AS B1 ON A.EventTypeId2 = B1.EventTypeId LEFT OUTER JOIN
                dbo.M_EventFrom AS C ON A.EventFromId = C.EventFromId LEFT OUTER JOIN
                dbo.M_Urgency AS D ON A.UrgencyId = D.UrgencyId LEFT OUTER JOIN
               L_Person  AS E ON A.DispatchPerson = E.iAdminID LEFT OUTER JOIN--指派人员信息 E
                L_Person  AS G ON A.PersonId = G.iAdminID LEFT OUTER JOIN--上报人信息 G
				(SELECT a.EventID, B.HistoryId, B.OrderId, B.OperId, C.OperName, B.Pictures, B.Voices, 
      B.OperRemarks, B.DispatchPersonID, B.ExecPersonId, B.ExecUpDateTime, 
      B.ExecDetpID, D.cDepName AS ExecDetpName, 
      D.PersonName AS ExecPersonName, E.PersonName AS DispatchPersonName, 
      E.cDepName AS DispatchPersonDeptName, C.OperName2,wo.OrderCode
FROM (SELECT MAX(ExecUpDateTime) AS ExecUpDateTime,h.EventID
        FROM dbo.M_WorkOrder_Oper_History h 
        GROUP BY h.EventID) AS a LEFT OUTER JOIN
        dbo.M_WorkOrder_Oper_History  B ON a.EventID = B.EventID AND a.ExecUpDateTime = B.ExecUpDateTime
		LEFT OUTER JOIN dbo.M_WorkOrder wo on wo.OrderId=B.OrderId
		LEFT OUTER JOIN
      dbo.M_WorkOrder_Oper AS C ON B.OperId = C.OperId LEFT OUTER JOIN
      L_Person  AS D ON B.ExecPersonId = D.iAdminID LEFT OUTER JOIN
       L_Person   AS E ON B.DispatchPersonID = E.iAdminID
)AS H ON H.EventID = A.EventID --处理信息 处理单位 最后一步骤处理人 E
LEFT OUTER JOIN dbo.M_Status AS I ON A.EventStatus = I.StatusID 
LEFT OUTER JOIN dbo.M_IsValidStatus AS J ON A.IsValid = J.IsValidID 
LEFT OUTER JOIN dbo.M_EventLeakInfo AS eli ON eli.OrderId = H.OrderId where a.DeleteStatus=0) v  
INNER JOIN (SELECT EventID FROM (
select   DATEDIFF(hh,  h1.ExecUpDateTime, GETDATE())-A.ExecTime AS timeDiff,A.* from  dbo.M_Event AS A 	 
          JOIN (SELECT max(HistoryId) HistoryId,EventID FROM dbo.M_WorkOrder_Oper_History   group by EventID) H on H.EventID=A.EventID
		  LEFT OUTER JOIN dbo.M_WorkOrder_Oper_History  h1 on h1.HistoryId=h.HistoryId 
		   LEFT OUTER JOIN (SELECT max(HistoryId) HistoryId,EventID FROM dbo.M_WorkOrder_Oper_History where OperId=11  group by EventID) HH on HH.EventID=A.EventID
		  LEFT OUTER JOIN dbo.M_WorkOrder_Oper_History  HH1 on HH1.HistoryId=HH.HistoryId
		  where  HH1.ExecPersonId={iAdminID} and h1.OperId=2) W WHERE W.timeDiff>0) CS on CS.EventID=v.EventID";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    List<dynamic> sumcount = conn.Query<dynamic>(query).ToList();

                    return MessageEntityTool.GetMessage(sumcount.Count(), sumcount, true, "", sumcount.Count());
                }
            }
            catch (Exception e)
            {
                errorMsg = e.Message;
                return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
            }
        }

    }

}
