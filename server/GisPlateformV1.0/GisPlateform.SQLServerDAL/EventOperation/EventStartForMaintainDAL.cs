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
    public class EventStartForMaintainDAL : BaseDAL, IEventStartForMaintainDAL
    {
        public MessageEntity GetEventFromComboBoxList()
        {
            string errorMsg = "";
            string query = " SELECT EventFromId,EventFromName FROM M_EventFrom";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    List<dynamic> eventType = conn.Query<dynamic>(query).ToList();

                    return MessageEntityTool.GetMessage(eventType.Count(), eventType, true, "", eventType.Count());
                }
            }
            catch (Exception e)
            {
                errorMsg = e.Message;
                return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
            }
        }

        public MessageEntity GetUrgencyComboBoxList()
        {
            string errorMsg = "";
            string query = "SELECT UrgencyId,UrgencyName FROM M_Urgency";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    List<dynamic> eventType = conn.Query<dynamic>(query).ToList();

                    return MessageEntityTool.GetMessage(eventType.Count(), eventType, true, "", eventType.Count());
                }
            }
            catch (Exception e)
            {
                errorMsg = e.Message;
                return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
            }
        }
        public MessageEntity AddEventStart(string iAdminID, string cAdminName, string iDeptID, int? EventFromId, int? UrgencyId, int? EventTypeId, int? EventTypeId2, string EventTypeName, string EventTypeName2, string EventX, string EventY, int? ExecDetpID, int? ExecPersonId,string EventCode, string EventDesc, string LinkMan, string LinkCall, string EventAddress)
        {
            //插入事件具体信息
            string insertSql = @"  INSERT INTO M_Event (EventCode,EventAddress,UpTime,PersonId,PName,EventTypeId,EventTypeId2,EventFromId,UrgencyId,HandlerLevelId,EventDesc,EventX,EventY,EventUpdateTime,IsValid,DeleteStatus,TaskId,ExecTime,LinkMan,LinkCall )  VALUES (@EventCode, @EventAddress,@UpTime,@PersonId,@PName,@EventTypeId,@EventTypeId2,@EventFromId,@UrgencyId,@HandlerLevelId,@EventDesc,@EventX,@EventY,@EventUpdateTime,@IsValid,@DeleteStatus,@TaskId,@ExecTime,@LinkMan,@LinkCall);
; ";
            //插入事件工单记录表
            string insertHissql = @" INSERT INTO M_WorkOrder_Oper_History (EventID,OperId,OperTime,ExecPersonId,DispatchPersonID,ExecDetpID ) VALUES (@@IDENTITY, @OperId,@OperTime,@ExecPersonId,@DispatchPersonID,@ExecDetpID  );";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        var i = conn.Execute(insertSql, new { EventCode = EventCode, EventAddress = EventAddress, UpTime = DateTime.Now.ToString(), PersonId = iAdminID, PName = cAdminName, EventTypeId = EventTypeId, EventTypeId2 = EventTypeId2, EventFromId = EventFromId, UrgencyId = UrgencyId, HandlerLevelId=1, EventDesc = EventDesc, EventX = EventX, EventY = EventY, EventUpdateTime = DateTime.Now.ToString(), IsValid = 1, DeleteStatus = 0, TaskId = -1, ExecTime = 36, LinkMan= LinkMan, LinkCall= LinkCall }, transaction);
                        var ii = conn.Execute(insertHissql, new { OperId = 11, OperTime = DateTime.Now.ToString(), ExecPersonId = ExecPersonId, DispatchPersonID = iAdminID, ExecDetpID = ExecDetpID }, transaction);

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