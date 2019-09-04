using Dapper;
using GisPlateform.Database;
using GisPlateform.IDAL.EventOperation;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
                if (string.IsNullOrEmpty(excSql))
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, "请检查实体类");
                }
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
                                                where a.DeleteStatus=0   and  c.EventFromId=3  AND h.operid IS NOT null and UpTime >='{startTime}' and UpTime <='{endTime}' ";
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

            string sql = string.Format(@"select a.*,b.PersonName,c.EventFromName,d.DeptName,h.OperId,w.OrderId,w.PreEndTime,ET1.EventTypeName  ET1,ET2.EventTypeName ET2,woo.OperName2 AS statusName from M_Event as a 
                                                LEFT JOIN L_Person as b ON a.PersonId=b.PersonId 
                                                LEFT JOIN M_EventFrom as c ON a.EventFromId=c.EventFromId 
                                                LEFT JOIN L_Department as d ON a.DeptId=d.DeptId
                                                LEFT JOIN M_WorkOrder w ON a.EventID=w.EventID
                                                LEFT JOIN (select MAX(OperId) OperId,OrderId from M_WorkOrder_Oper_History Group by OrderId) h ON w.OrderId=h.OrderId 
                                                LEFT JOIN (select EventTypeId,EventTypeName from M_EventType where ParentTypeId=0) ET1 on a.EventTypeId=ET1.EventTypeId
                                                LEFT JOIN (select EventTypeId,EventTypeName from M_EventType where ParentTypeId<>0) ET2 on a.EventTypeId2=ET2.EventTypeId	
												LEFT JOIN dbo.M_WorkOrder_Oper woo ON woo.OperId = h.OperId
                                                where a.DeleteStatus=0   and  c.EventFromId=3  AND h.operid IS NOT null ");
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
                sql += " and (a.EventCode like '%" + searchCondition + "%'or b.PersonName like '%" + searchCondition + "%' or c.EventFromName like '%" + searchCondition + "%')";
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
        public MessageEntity GetEventWorkorderListForMaintain(DateTime? startTime, DateTime? endTime, int? EventFromId, int? eventType, int? EventID, string OperId, int? IsValid, int? DeptId, string EventContenct, string ExecPersonId, string sort, string ordering, int num, int page)
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
               ( select d.cDepName,p.cAdminName AS PersonName,p.iAdminID,p.cAdminTel AS Telephone from GisPlateform.dbo.P_Admin p LEFT OUTER JOIN PipeInspection_Smart_Water.dbo.P_Department d
      ON p.iDeptID =d.iDeptID ) AS E ON A.DispatchPerson = E.iAdminID LEFT OUTER JOIN--指派人员信息 E
               ( select d.cDepName,p.cAdminName AS PersonName,p.iAdminID,r.cRoleName from GisPlateform.dbo.P_Admin p LEFT OUTER JOIN PipeInspection_Smart_Water.dbo.P_Department d
      ON p.iDeptID =d.iDeptID LEFT OUTER JOIN PipeInspection_Smart_Water.dbo.P_Role r  ON p.iRoleID =r.iRoleID )  AS G ON A.PersonId = G.iAdminID LEFT OUTER JOIN--上报人信息 G
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
      CASE dbo.M_WorkOrder_Oper_History.OperId WHEN 3 THEN M_WorkOrder.PersonId WHEN
       4 THEN M_WorkOrder.PersonId WHEN 5 THEN M_WorkOrder.PersonId WHEN 6 THEN
       M_WorkOrder_Oper_History.ExecPersonId ELSE dbo.M_WorkOrder_Oper_History.ExecPersonId
       END AS ExecPersonId, 
      CASE WHEN dbo.M_WorkOrder_Oper_History.EventID IS NULL 
      THEN dbo.M_WorkOrder.EventID ELSE dbo.M_WorkOrder_Oper_History.EventID END AS
       EventID
FROM dbo.M_WorkOrder_Oper_History LEFT OUTER JOIN
      dbo.M_WorkOrder ON 
      dbo.M_WorkOrder_Oper_History.OrderId = dbo.M_WorkOrder.OrderId) as B ON a.EventID = B.EventID AND a.ExecUpDateTime = B.ExecUpDateTime LEFT OUTER JOIN
      dbo.M_WorkOrder_Oper AS C ON B.OperId = C.OperId LEFT OUTER JOIN
      ( select d.cDepName,p.cAdminName AS PersonName,p.iAdminID from GisPlateform.dbo.P_Admin p LEFT OUTER JOIN PipeInspection_Smart_Water.dbo.P_Department d
      ON p.iDeptID =d.iDeptID ) AS D ON B.ExecPersonId = D.iAdminID LEFT OUTER JOIN
       ( select d.cDepName,p.cAdminName AS PersonName,p.iAdminID from GisPlateform.dbo.P_Admin p LEFT OUTER JOIN PipeInspection_Smart_Water.dbo.P_Department d
      ON p.iDeptID =d.iDeptID )  AS E ON B.DispatchPersonID = E.iAdminID
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
                sql += " and UpTime<='" + endTime + "' ";
            }
            if (DeptId !=null)//部门id
            {
                sql += " and DeptId='" + DeptId + "'";
            }
            if (eventType != null)//事件类型
            {
                sql += " and EventTypeId='" + eventType + "' ";
            }
            if (!string.IsNullOrEmpty(EventContenct))//事件查找  编号 上报人  类型
            {
                sql += " and (EventCode like '%" + EventContenct + "%'or PersonName like '%" + EventContenct + "%' or EventFromName like '%" + EventContenct + "%')";
            }
            if (EventFromId !=null)//事件来源
            {
                sql += " and EventFromId=" +EventFromId;
            }
            if (OperId != null && OperId !="")//步骤id  事件处理状态
            {
                if (OperId == "1")
                {
                    sql += " and OperId is null";
                }
                else
                {
                    sql += " and OperId in(" + OperId + ")";
                }
            }
            if (IsValid !=null)//是否有效
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
            if(ExecPersonId != null)
            {
                sql += " and ExecPersonId='" + ExecPersonId + "'";
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
        public MessageEntity GetEventListOwn (int? OwnID, DateTime ? startTime, DateTime? endTime, string sort, string ordering, int num, int page)
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
               ( select d.cDepName,p.cAdminName AS PersonName,p.iAdminID,p.cAdminTel AS Telephone from GisPlateform.dbo.P_Admin p LEFT OUTER JOIN PipeInspection_Smart_Water.dbo.P_Department d
      ON p.iDeptID =d.iDeptID ) AS E ON A.DispatchPerson = E.iAdminID LEFT OUTER JOIN--指派人员信息 E
               ( select d.cDepName,p.cAdminName AS PersonName,p.iAdminID,r.cRoleName from GisPlateform.dbo.P_Admin p LEFT OUTER JOIN PipeInspection_Smart_Water.dbo.P_Department d
      ON p.iDeptID =d.iDeptID LEFT OUTER JOIN PipeInspection_Smart_Water.dbo.P_Role r  ON p.iRoleID =r.iRoleID )  AS G ON A.PersonId = G.iAdminID LEFT OUTER JOIN--上报人信息 G
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
      CASE dbo.M_WorkOrder_Oper_History.OperId WHEN 3 THEN M_WorkOrder.PersonId WHEN
       4 THEN M_WorkOrder.PersonId WHEN 5 THEN M_WorkOrder.PersonId WHEN 6 THEN
       M_WorkOrder_Oper_History.ExecPersonId ELSE dbo.M_WorkOrder_Oper_History.ExecPersonId
       END AS ExecPersonId, 
      CASE WHEN dbo.M_WorkOrder_Oper_History.EventID IS NULL 
      THEN dbo.M_WorkOrder.EventID ELSE dbo.M_WorkOrder_Oper_History.EventID END AS
       EventID
FROM dbo.M_WorkOrder_Oper_History LEFT OUTER JOIN
      dbo.M_WorkOrder ON 
      dbo.M_WorkOrder_Oper_History.OrderId = dbo.M_WorkOrder.OrderId) as B ON a.EventID = B.EventID AND a.ExecUpDateTime = B.ExecUpDateTime LEFT OUTER JOIN
      dbo.M_WorkOrder_Oper AS C ON B.OperId = C.OperId LEFT OUTER JOIN
      ( select d.cDepName,p.cAdminName AS PersonName,p.iAdminID from GisPlateform.dbo.P_Admin p LEFT OUTER JOIN PipeInspection_Smart_Water.dbo.P_Department d
      ON p.iDeptID =d.iDeptID ) AS D ON B.ExecPersonId = D.iAdminID LEFT OUTER JOIN
       ( select d.cDepName,p.cAdminName AS PersonName,p.iAdminID from GisPlateform.dbo.P_Admin p LEFT OUTER JOIN PipeInspection_Smart_Water.dbo.P_Department d
      ON p.iDeptID =d.iDeptID )  AS E ON B.DispatchPersonID = E.iAdminID
)AS H ON H.EventID = A.EventID --处理信息 处理单位 最后一步骤处理人 E
LEFT OUTER JOIN dbo.M_Status AS I ON A.EventStatus = I.StatusID 
LEFT OUTER JOIN dbo.M_IsValidStatus AS J ON A.IsValid = J.IsValidID 
LEFT OUTER JOIN dbo.M_EventLeakInfo AS eli ON eli.OrderId = H.OrderId where a.DeleteStatus=0) v 
right join (SELECT EventID as ID FROM M_WorkOrder_Oper_History WHERE (DispatchPersonID = {0} OR ExecPersonId ={0}) AND EventID IS NOT NULL GROUP BY EventID) AA   ON AA.ID = v.EventID
		 ",OwnID);
            #region 条件
            sql += " where 1=1 ";
            if (startTime != null)
            {
                sql += " and UpTime>='" + startTime + "' ";
            }
            if (endTime != null)
            {
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
            string sql = string.Format(@"SELECT B.HistoryId, B.OrderId, B.OperId, B.ExecUpDateTime, C.OperName, B.Pictures, 
      B.Voices, B.OperRemarks, B.DispatchPersonID, B.ExecPersonId, B.ExecDetpID, 
      D.cDepName AS ExecDetpName, D.PersonName AS ExecPersonName, 
      E.PersonName AS DispatchPersonName, 
      E.cDepName AS DispatchPersonDeptName, C.OperName2, B.IsValid, F.IsValidName, 
      B.EventID,wo.OrderStatus
FROM   (SELECT dbo.M_WorkOrder_Oper_History.HistoryId, 
      dbo.M_WorkOrder_Oper_History.OrderId, dbo.M_WorkOrder_Oper_History.OperId, 
      dbo.M_WorkOrder_Oper_History.OperTime, 
      dbo.M_WorkOrder_Oper_History.Pictures, dbo.M_WorkOrder_Oper_History.Voices, 
      dbo.M_WorkOrder_Oper_History.OperRemarks, 
      dbo.M_WorkOrder_Oper_History.DispatchPersonID, 
      dbo.M_WorkOrder_Oper_History.ExecUpDateTime, 
      dbo.M_WorkOrder_Oper_History.ExecDetpID, 
      dbo.M_WorkOrder_Oper_History.IsValid, 
      CASE dbo.M_WorkOrder_Oper_History.OperId WHEN 3 THEN M_WorkOrder.PersonId WHEN
       4 THEN M_WorkOrder.PersonId WHEN 5 THEN M_WorkOrder.PersonId WHEN 6 THEN
       M_WorkOrder_Oper_History.ExecPersonId ELSE dbo.M_WorkOrder_Oper_History.ExecPersonId
       END AS ExecPersonId, 
      CASE WHEN dbo.M_WorkOrder_Oper_History.EventID IS NULL 
      THEN dbo.M_WorkOrder.EventID ELSE dbo.M_WorkOrder_Oper_History.EventID END AS
       EventID
FROM dbo.M_WorkOrder_Oper_History LEFT OUTER JOIN
      dbo.M_WorkOrder ON 
      dbo.M_WorkOrder_Oper_History.OrderId = dbo.M_WorkOrder.OrderId)B
  LEFT OUTER JOIN    dbo.M_WorkOrder_Oper AS C ON B.OperId = C.OperId
    LEFT OUTER JOIN      ( select d.cDepName,p.cAdminName AS PersonName,p.iAdminID from GisPlateform.dbo.P_Admin p LEFT OUTER JOIN PipeInspection_Smart_Water.dbo.P_Department d
      ON p.iDeptID =d.iDeptID ) AS D ON B.ExecPersonId = D.iAdminID --处理人员信息
    LEFT OUTER JOIN   ( select d.cDepName,p.cAdminName AS PersonName,p.iAdminID from GisPlateform.dbo.P_Admin p LEFT OUTER JOIN PipeInspection_Smart_Water.dbo.P_Department d
      ON p.iDeptID =d.iDeptID )  AS E ON B.DispatchPersonID = E.iAdminID--派发人员信息
    LEFT OUTER JOIN dbo.M_IsValidStatus AS F ON B.IsValid = F.IsValidID
	LEFT JOIN dbo.M_WorkOrder  AS wo ON b.OrderId = wo.OrderId where 1=1 ");
            if (EventID != null)//事件id
            {
                sql += " and B.EventID='" + EventID + "'";
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
        /// <param name="DispatchPersonID">指派人ID</param>
        /// <returns></returns>
        public MessageEntity WorkorderInvalid(string EventID, string OrderId, string OperId, string DispatchPersonID)
        {
            var updateSql = "update  M_Event set IsValid=0 where DeleteStatus=0 and EventID=@EventID";
            string insertSql = @"INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,DispatchPersonID ) VALUES ( @EventID,@OrderId,@OperId,@OperTime,@DispatchPersonID ); ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        conn.Execute(updateSql, new { EventID = EventID }, transaction);
                        var i = conn.Execute(insertSql, new { EventID = EventID, OperId = OperId, OrderId= OrderId, OperTime = DateTime.Now.ToString(), DispatchPersonID = DispatchPersonID }, transaction);

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
        public MessageEntity WorkListAudit(string EventID, string OrderId, string StepNum, string iAdminID, string OperRemarks)
        {
            string insertSql  = @" INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,DispatchPersonID ) VALUES (@EventID,@OrderId,@OperId,@OperTime,@DispatchPersonID   ); ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        var i = conn.Execute(insertSql, new { EventID = EventID, OrderId = OrderId, OperId = StepNum, OperTime = DateTime.Now.ToString(), DispatchPersonID = iAdminID, OperRemarks= OperRemarks }, transaction);

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
        /// <param name="OrderId">工单编号</param>
        /// <param name="StepNum">步骤id（3)</param>
        /// <param name="DispatchPersonID">指派人ID</param>
        /// <param name="OperRemarks">操作意见</param>
        /// <returns></returns>
        public MessageEntity WorkListReceipt(string EventID, string OrderId, string StepNum, string DispatchPersonID, string OperRemarks)
        {
            string insertSql  = @" INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,OperRemarks ) VALUES (@EventID,@OrderId,@OperId,@OperTime,@OperRemarks   ); ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        var i = conn.Execute(insertSql, new { EventID = EventID, OrderId = OrderId, OperId = StepNum, OperTime = DateTime.Now.ToString(), DispatchPersonID = DispatchPersonID, OperRemarks = OperRemarks }, transaction);

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
        /// <param name="OrderId">工单编号</param>
        /// <param name="StepNum">步骤id（4)</param>
        /// <param name="DispatchPersonID">指派人ID</param>
        /// <param name="OperRemarks">操作意见</param>
        ///  <param name="eventPictures">上传照片</param>
        /// <returns></returns>
        public MessageEntity WorkListPresent(string EventID, string OrderId, string StepNum, string DispatchPersonID, string OperRemarks, string eventPictures)
        {
            string insertSql = @" INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,OperRemarks,Pictures ) VALUES (@EventID,@OrderId,@OperId,@OperTime,@OperRemarks,@Pictures   ); ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        var i = conn.Execute(insertSql, new { EventID = EventID, OrderId = OrderId, OperId = StepNum, OperTime = DateTime.Now.ToString(), DispatchPersonID = DispatchPersonID, OperRemarks = OperRemarks, Pictures = eventPictures }, transaction);

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
        /// <param name="OrderId">工单编号</param>
        /// <param name="StepNum">步骤id（5)</param>
        /// <param name="DispatchPersonID">指派人ID</param>
        /// <param name="OperRemarks">操作意见</param>
        ///  <param name="eventPictures">上传照片</param>

        /// <returns></returns>
        public MessageEntity WorkListChuZhi(string EventID, string OrderId, string StepNum, string DispatchPersonID, string OperRemarks, string eventPictures)
        {
            string insertSql = @" INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,OperRemarks,Pictures ) VALUES (@EventID,@OrderId,@OperId,@OperTime,@OperRemarks,@Pictures   ); ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        var i = conn.Execute(insertSql, new { EventID = EventID, OrderId = OrderId, OperId = StepNum, OperTime = DateTime.Now.ToString(), DispatchPersonID = DispatchPersonID, OperRemarks = OperRemarks, Pictures = eventPictures }, transaction);

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

            string insertSql = @" INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,DispatchPersonID,ExecPersonId,ExecDetpID,Pictures ) VALUES (@EventID,@OrderId,@OperId,@OperTime,@DispatchPersonID,(SELECT TOP 1 PersonId  FROM M_Event where EventID=" + EventID + " ORDER BY EventID DESC ),(SELECT TOP 1 DeptId  FROM M_Event where EventID=" + EventID + " ORDER BY EventID DESC ),@Pictures   ); ";
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
            string insertworkorderSql = @"  insert into M_WorkOrder(EventID,DeptId,PersonId,DispatchPerson,OrderTime,PreEndTime) VALUES (@EventID,@DeptId,@PersonId,@DispatchPerson,@OrderTime,@PreEndTime); update M_WorkOrder Set OrderCode='GD' + SUBSTRING(CONVERT(NVARCHAR, YEAR(SYSDATETIME())), 3, 2) + right('0000000' + CONVERT(NVARCHAR, @@IDENTITY ), 7) where OrderId= @@IDENTITY; ";
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
                                             values (( select p.iDeptID from GisPlateform.dbo.P_Admin p where p.iAdminID='{0}'),@PersonId,@OrderId,@BackTime,@BackRemarks); ",iAdminID);
            string insertSql =string.Format( @"INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,OperRemarks,DispatchPersonID,ExecPersonId,ExecDetpID,IsValid ) VALUES ( @EventID,@OrderId,@OperId,@OperTime,@OperRemarks,@DispatchPersonID,(SELECT TOP 1 DispatchPersonID  FROM M_WorkOrder_Oper_History where EventID={0} AND dbo.M_WorkOrder_Oper_History.OperId =11   ORDER BY ExecUpDateTime DESC ),@ExecDetpID,@IsValid ); ",EventID);

            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        conn.Execute(updateeventSql, new { EventID = EventID, Remark_Back = BackDesc }, transaction);
                        conn.Execute(updateSql, new { OrderId = OrderId }, transaction);
                        var i = conn.Execute(insertBackSql, new { PersonId = iAdminID, OrderId = OrderId, BackTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), BackRemarks = BackDesc}, transaction);
                        var ii = conn.Execute(insertSql, new { EventID = EventID, OperId = 11, OrderId = OrderId, OperTime = DateTime.Now.ToString(), OperRemarks = BackDesc, DispatchPersonID = iAdminID, ExecDetpID = iDeptID, IsValid = 4 }, transaction);

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
        /// <param name="PersonId">事件上报人ID</param>
        /// <param name="DeptId">事件所属部门ID</param>
        /// <returns></returns>
        public MessageEntity WordListDelay(string EventID, string OrderId, string OperRemarks, string complishTime, string PersonId, string DeptId, string iAdminID)
        {
            var updateeventSql = "update M_Event Set IsValid=5,Remark_Back = @Remark_Back where EventID=@EventID";
            var updateSql = "update M_WorkOrder Set OrderStatus=1 where OrderId=@OrderId";
            string insertBackSql =@"Insert INTO M_PostponeOrder(EventID,OrderId, Cause, PostponeTime, ApplicationTime) VALUES(@EventID,@OrderId, @Cause, @PostponeTime, @ApplicationTime); ";
            string insertSql = string.Format(@"INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,OperRemarks,DispatchPersonID,ExecPersonId,ExecDetpID,IsValid ) VALUES ( @EventID,@OrderId,(SELECT TOP 1 OperId  FROM M_WorkOrder_Oper_History where OrderId={0} ORDER BY ExecUpDateTime DESC ),@OperTime,@OperRemarks,@DispatchPersonID,@ExecPersonId,@ExecDetpID,@IsValid ); ", OrderId, EventID);

            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        conn.Execute(updateeventSql, new { EventID = EventID, Remark_Back = OperRemarks }, transaction);
                        conn.Execute(updateSql, new { OrderId = OrderId }, transaction);
                        var i = conn.Execute(insertBackSql, new { EventID = EventID, OrderId = OrderId, Cause= OperRemarks.Trim(), PostponeTime = complishTime, ApplicationTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") }, transaction);
                        var ii = conn.Execute(insertSql, new { EventID = EventID, OrderId = OrderId, OperTime = DateTime.Now.ToString(), OperRemarks = OperRemarks, DispatchPersonID =iAdminID, ExecPersonId= PersonId, ExecDetpID = DeptId, IsValid = 5 }, transaction);

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
        /// <returns></returns>
        public MessageEntity WorkListDelayExec(string EventID, string OrderId, string complishTime, string iDeptID, string iAdminID)
        {

            var updateeventSql = "update M_WorkOrder Set PreEndTime=@PreEndTime where OrderId=@OrderId";
            var updateevsql = "update M_PostponeOrder Set AuditStatus=2 where OrderId=@OrderId";
            var updateSql = "update M_Event Set IsValid=1 where EventID=@EventID";
            string insertSql = string.Format(@"INSERT INTO M_WorkOrder_Oper_History (EventID,OrderId,OperId,OperTime,DispatchPersonID,ExecPersonId,ExecDetpID,IsValid ) VALUES ( @EventID,@OrderId,(SELECT TOP 1 OperId  FROM M_WorkOrder_Oper_History where OrderId={0} ORDER BY ExecUpDateTime DESC ),@OperTime,@DispatchPersonID,(SELECT TOP 1 PersonId  FROM M_WorkOrder where OrderId={0} ORDER BY OrderId DESC ),@ExecDetpID,@IsValid ); ", OrderId);

            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        conn.Execute(updateeventSql, new { OrderId = OrderId, PreEndTime= complishTime }, transaction);
                        conn.Execute(updateevsql, new { OrderId = OrderId }, transaction);
                        conn.Execute(updateSql, new { EventID = EventID }, transaction);
                        var ii = conn.Execute(insertSql, new { EventID = EventID, OrderId = OrderId, OperTime = DateTime.Now.ToString(), DispatchPersonID = iAdminID, ExecDetpID = iDeptID, IsValid = 6 }, transaction);

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
                        conn.Execute(updateSql, new { EventID = EventID, Remark_Back=OperRemarks }, transaction);
                        var i = conn.Execute(insertSql, new { EventID = EventID, OrderId = OrderId, OperId = 12, OperTime = DateTime.Now.ToString(), OperRemarks= OperRemarks,DispatchPersonID = DispatchPersonID }, transaction);

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
    }
}
