using Dapper;
using GisPlateform.Database;
using GisPlateform.IDAL.InspectionPlan;
using GisPlateform.Model.BaseEntity;
using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using System;
using System.Collections.Generic;

namespace GisPlateform.SQLServerDAL.InspectionPlan
{
    public class TaskManageDAL : ITaskManageDAL
    {

        public MessageEntity Delete(string[] taskIds)
        {
            var ids = string.Join(",", taskIds);

            string updateTask = string.Format(@" update L_Task  set TaskState = 0 where TaskId in ({0}) ", ids);
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                var rows = 0;

                try
                {
                    rows = conn.Execute(updateTask);
                    return MessageEntityTool.GetMessage(rows);
                }
                catch (Exception e)
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, "请检查实体类");
                }
            }
        }

        public MessageEntity GetTaskManageInfo(string serachCondition, int? isNomalPlan, int? isAssigned, int? deptId, int? operatorId, DateTime? startTime, DateTime? endTime, string sort, string ordering, int num, int page)
        {
            string sqlwhere = "";
            if (startTime != null)
            { sqlwhere += $" and lt.VisitStarTime>= '{startTime}' "; }
            if (endTime != null)
            { sqlwhere += $" and lt.VisitOverTime<='{endTime}' "; }
            if (isNomalPlan != null)
            { sqlwhere += $" and lp.BoolNormalPlan= {isNomalPlan} "; }
            if (isAssigned != null)
            {
                if (isAssigned == 1)
                {
                    sqlwhere += " and lt.AssignState =1 ";
                }
                else
                {
                    sqlwhere += " and (lt.AssignState <>1 or lt.AssignState is null) ";
                }
            }
            if (deptId != null)
            { sqlwhere += $" and lt.ProraterDeptId={deptId} "; }
            if (operatorId != null)
            { sqlwhere += $" and lt.ProraterId={operatorId} "; }

            //快速查询条件添加
            if (!string.IsNullOrEmpty(serachCondition))
            {
                sqlwhere += string.Format(@" and  ( lt.TaskCode like '%{0}%' or lt.TaskName like '%{0}%' or lt.Remark like '%{0}%' ) ", serachCondition);
            }
            string sql = $@"( select lt.TaskId,lt.TaskName,lt.ProraterId,lt.ProraterName,lt.ProraterDeptId,lt.ProraterDeptName,lt.VisitStarTime,lt.VisitOverTime,lp.BoolNormalPlan,
                                               lpc.PlanCycleName,lpt.PlanTypeName,lp.Operator,lp.OperateDate,'0/19' as CompleteDetail,'0/1' as FeedbackDetail,'反馈定位' as FeedbackOrientation,lt.AssignState,lt.TaskCode,ple.PlanEqCount,lpa.PlanAreaName,lpl.PlanLineName,lt.Remark,lt.Descript
                                                ,lp.PlanTypeId,lpl.PlanLineId,lpa.PlanAreaId  from L_Task lt 
                                               left join L_PLAN lp on lp.PlanId = lt.PlanId
                                               left join L_PlanLine lpl on lpl.PlanLineId = lp.PlanLineId
                                               left join L_PlanArea lpa on lpa.PlanAreaId = lp.PlanAreaId
                                               left join (select COUNT(PlanListId) as PlanEqCount,PlanID from L_PlanEquipmentDetail group by PlanID) ple on ple.PlanID = lt.PlanId
                                               left join L_PLANCYCLE lpc on lpc.PlanCycleId = lp.PlanCycleId
                                               left join L_PLANTYPE lpt on lpt.PlanTypeId = lp.PlanTypeId where 1=1 and lt.TaskState = 1 {sqlwhere} )";

            DapperExtentions.EntityForSqlToPager<dynamic>(sql, sort, ordering, num, page, out MessageEntity result, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide);

            return result;
        }


        public MessageEntity GetPlanListCount(DateTime startTime, DateTime endTime)
        {
            string queryStr = $@"select count(0) [count] from L_Task WHERE TaskState = 1 and  VisitStarTime >='{startTime}' and VisitStarTime <='{endTime}' ";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    dynamic result = conn.Query<dynamic>(queryStr);

                    return MessageEntityTool.GetMessage(1, result);
                }
            }
            catch (Exception e)
            {
                return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
            }
        }


        public MessageEntity AssignTask(string[] taskIds)
        {
            var ids = string.Join(",", taskIds);

            string updateTask = string.Format(@" update L_Task  set AssignState = 1 where TaskId in ({0}) ", ids);
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                var rows = 0;

                try
                {
                    rows = conn.Execute(updateTask);
                    return MessageEntityTool.GetMessage(rows);
                }
                catch (Exception e)
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, "请检查实体类");
                }
            }
        }

        
    }
}
