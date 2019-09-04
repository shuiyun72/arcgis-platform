using Dapper;
using GisPlateform.CommonTools;
using GisPlateform.Database;
using GisPlateform.IDAL.InspectionPlan;
using GisPlateform.Model.BaseEntity;
using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
namespace GisPlateform.SQLServerDAL.InspectionPlan
{
    public class PlanManageDAL : BaseDAL, IPlanManageDAL
    {
        public MessageEntity Add(string planName, int planTypeId, int planTypeLB, string equipmentIdList, string planPath, int planCycleId, int isFeedBack, int isNomalPlan, string equipmentNameList, string equmentInfo, int moveType, DateTime invalidationDate, int planAreaId, int planLineId, string operatorName, List<Equipment> equipmentList)
        {
            StringBuilder SqlInsertEqu = new StringBuilder();

            using (IDbConnection conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                IDbTransaction transaction = conn.BeginTransaction();
                try
                {
                    if (equipmentList != null && equipmentList.Count > 0)
                    {
                        foreach (Equipment qu in equipmentList)
                        {
                            SqlInsertEqu.AppendFormat("  insert into L_PlanEquipmentDetail(PlanID,SmID,SmX,SmY,EquType) values({0},'{1}','{2}','{3}','{4}')   ;", "(SELECT IDENT_INCR('L_PLAN')+IDENT_CURRENT('L_PLAN'))", qu.SmID, qu.SmX, qu.SmY, qu.EquType);
                        }
                    }

                    //第三步:进行添加巡检计划  
                    SqlInsertEqu.AppendFormat($@"   insert into L_PLAN (PlanName,PlanTypeId,PlanAreaId,EquipmentList,PlanPath,BoolFeedBack,BoolNormalPlan,PlanCycleId,MoveType,Operator,OperateDate,EquipmentListName,InvalidationDate,PlanLineId,PlanTypeLB,PlanState) 
                                                      values('{planName}','{planTypeId}','{planAreaId}','{equipmentIdList}','{planPath}','{isFeedBack}','{isNomalPlan}','{planCycleId}','{moveType}','{operatorName}','{DateTime.Now}','{equipmentNameList}','{invalidationDate}','{planLineId}','{planTypeLB}',1  ) ;");
                    var rows = conn.Execute(SqlInsertEqu.ToString(), null, transaction);

                    transaction.Commit();
                    return MessageEntityTool.GetMessage(rows);
                }
                catch (Exception e)
                {

                    transaction.Rollback();
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                }
            }

        }

        public MessageEntity Delete(int planId)
        {
            string updateTask = string.Format($@"update L_PLAN  set PlanState = 0 where PlanId ={planId} ");
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

        public MessageEntity GetPlanManageInfo(int? planTypeId, string serachCondition, int? isNomalPlan, int? deptId, int? operatorId, DateTime? startTime, DateTime? endTime, string sort, string ordering, int num, int page)
        {
            string sqlwhere = "";
            if (startTime != null)
            { sqlwhere += $" and lp.OperateDate>='{startTime}' "; }
            if (endTime != null)
            { sqlwhere += $" and lp.OperateDate<='{endTime}' "; }
            if (deptId != null)
            { sqlwhere += $" and lpa.DeptId={deptId} "; }
            if (operatorId != null)
            { sqlwhere += $" and lpa.PersonId={operatorId} "; }

            if (!string.IsNullOrEmpty(serachCondition))
            {
                { sqlwhere += " and lp.PlanName like '%" + serachCondition + "%' "; }
            }
            if (planTypeId != null)
            {
                { sqlwhere += $" and lp.PlanTypeId ={planTypeId} "; }
            }
            if (isNomalPlan != null)
            {
                { sqlwhere += $" and lp.BoolNormalPlan ={isNomalPlan} "; }
            }

            string sql = $@"( SELECT   lp.PlanId,lp.PlanName,lp.PlanTypeId,lpt.PlanTypeName,lp.PlanAreaId,lpa.PlanAreaName,lp.EquipmentList,lp.EquipmentListName as EquipmentName
                                                        ,lp.PlanPath,lp.PlanCycleId,lpc.PlanCycleName,'1' as PlanState,
                                                		case lp.MoveType when 2 then '步行'  when 1 then '车巡' end as MoveType,
                                                		case lp.BoolFeedBack when 1 then '需反馈' when 0 then '仅到位' end as BoolFeedBack,
                                                		case lp.BoolNormalPlan when 1 then '常规' when 0 then '临时' end as BoolNormalPlan,
                                                        lp.Operator,lp.OperateDate,lpa.DeptId,lpa.PersonId,lpl.PlanLineName,lp.Remark,lpt2.PlanTypeName as PlanTypeNameLB,
                                                        case  lp.PlanTypeId when 1 then lpa.GeoText else lpl.GeoText end   as GeoText,lpl.PatroGeoText as PatroGeoText
                                                  FROM L_PLAN lp 
                                                  left join L_PLANTYPE lpt on lpt.PlanTypeId = lp.PlanTypeId
                                                  left join L_PlanArea lpa on lpa.PlanAreaId = lp.PlanAreaId                                                 
                                                  left join L_PLANCYCLE lpc on  lpc.PlanCycleId = lp.PlanCycleId 
                                                  left join L_PlanLine lpl on lpl.PlanLineId = lp.PlanLineId 
                                                  left join L_PLANTYPE lpt2 on lpt2.PlanTypeId = lp.PlanTypeLB where 1 =1 and (lp.PlanState =1 or lp.PlanState is null)   {sqlwhere}  )";

            DapperExtentions.EntityForSqlToPager<dynamic>(sql, sort, ordering, num, page, out MessageEntity result, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide);

            return result;
        }

        public MessageEntity Update(L_Plan plan)
        {
            base.UpdateEntity(plan, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide, out MessageEntity messageEntity);
            return messageEntity;
        }

        public MessageEntity AssignTask(L_Task task)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {

                try
                {
                    string strSqlSelect = string.Format(@" select count(0) [count] from  L_Task lt where lt.PlanId = {0} and lt.TaskState = 1 and lt.ProraterId = {1} and ((lt.VisitStarTime >= '{2}' and lt.VisitStarTime <='{3}') or (lt.VisitStarTime <='{2}' and lt.VisitOverTime >='{3}') or (lt.VisitOverTime >= '{2}' and lt.VisitOverTime <='{3}')) ", task.PlanId, task.ProraterId, task.VisitStarTime, task.VisitOverTime);
                    dynamic dtSelect = conn.Query<dynamic>(strSqlSelect).FirstOrDefault();
                    //当该计划已经对某人进行时间段内分派后直接返回
                    if (dtSelect.count > 0)
                    {
                        return MessageEntityTool.GetMessage(ErrorType.OprationError, null, $"该时间段内{task.ProraterName}已经有任务", "提示");
                    }
                    string sqlSelectCycle = string.Format(@" select lpc.PlanCycleTime,lpc.PlanCycleUnit,lpc.PlanCycleHz,lp.StartStopInfo,lp.BoolNormalPlan from L_PLAN lp 
                                                         left join   L_PLANCYCLE lpc on lpc.PlanCycleId = lp.PlanCycleId where 1=1 and lpc.PlanDeleteState=1 and lp.PlanId = '{0}' ", task.PlanId);
                    List<dynamic> dtCycleList = conn.Query<dynamic>(sqlSelectCycle).ToList();
                    if (!(dtCycleList.Count > 0))
                    {
                        return MessageEntityTool.GetMessage(ErrorType.OprationError, null, "获取任务计划周期失败,请重试!", "提示");
                    }
                    var dtCycle = dtCycleList.First();

                    var isNormalPlan = dtCycle.BoolNormalPlan == 1 ? "CGRW" : "LSRW";

                    List<Dictionary<string, string>> taskCycleList = new CalculateCycle().CalculateMainMethod(task.VisitStarTime, task.VisitOverTime, int.Parse(dtCycle.PlanCycleTime), dtCycle.PlanCycleHz, dtCycle.PlanCycleUnit, dtCycle.StartStopInfo);
                    string sqlInsert = string.Empty;
                    foreach (Dictionary<string, string> lis in taskCycleList)
                    {
                        var startTime = string.Empty;
                        var endTime = string.Empty;
                        lis.TryGetValue("StartDay", out startTime);
                        lis.TryGetValue("EndDay", out endTime);
                        sqlInsert += string.Format(@"insert into L_Task (TaskName,ProraterDeptName,ProraterDeptId,ProraterName,ProraterId,VisitStarTime,VisitOverTime,Frequency,Descript,Operator,OperateDate,TaskState,PlanId,PlanName,TaskCode) 
                                                      values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}','{12}','{13}',(select '{14}'+convert(varchar(50),(" + System.DateTime.Now.ToString("yy") + "*10000000+isnull(MAX(TaskId),0)+1)) from L_Task)) ;", task.TaskName, task.ProraterDeptName, task.ProraterDeptId, task.ProraterName, task.ProraterId, startTime, endTime, task.Frequency, task.Descript, task.Operator, System.DateTime.Now, 1, task.PlanId, task.PlanName, isNormalPlan);
                        //第三步:进行添加巡检计划  
                    }
                    var rows = conn.Execute(sqlInsert);
                    return MessageEntityTool.GetMessage(rows);
                }
                catch (Exception e)
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                }
            }


        }
    }
}
