using Dapper;
using GisPlateform.Database;
using GisPlateform.IDAL.InspectionPlan;
using GisPlateform.Model.BaseEntity;
using GisPlateform.Model.PipeInspectionBase_Gis_OutSide;
using System;
using System.Collections.Generic;
using System.Data;

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
            string sql = $@"SELECT *,
       t.PlanEqCount + t.planAreaPointCount + t.planLinePointCount AS allEquCount
FROM
(
    SELECT lt.TaskId,
           lt.TaskName,
           lt.ProraterId,
           lt.ProraterName,
           lt.ProraterDeptId,
           lt.ProraterDeptName,
           lt.VisitStarTime,
           lt.VisitOverTime,
           CASE lp.MoveType
               WHEN 2 THEN
                   '步行'
               WHEN 1 THEN
                   '车巡'
           END AS MoveType,
           CASE lp.BoolFeedBack
               WHEN 1 THEN
                   '需反馈'
               WHEN 0 THEN
                   '仅到位'
           END AS BoolFeedBack,
           CASE lp.BoolNormalPlan
               WHEN 1 THEN
                   '常规'
               WHEN 0 THEN
                   '临时'
           END AS BoolNormalPlan,
           lpc.PlanCycleName,
           lpt.PlanTypeName,
           lp.Operator,
           lp.OperateDate,
           CASE
               WHEN tcd.CompletedCount IS NULL THEN
                   0
               ELSE
                   tcd.CompletedCount
           END AS CompleteDetail,
           '' AS FeedbackDetail,
           '反馈定位' AS FeedbackOrientation,
           lt.AssignState,
           lt.TaskCode,
           CASE
               WHEN ple.PlanEqCount IS NULL THEN
                   0
               ELSE
                   ple.PlanEqCount
           END PlanEqCount,
           CASE
               WHEN pai.planAreaPointCount IS NULL THEN
                   0
               ELSE
                   pai.planAreaPointCount
           END planAreaPointCount,
           CASE
               WHEN pld.planLinePointCount IS NULL THEN
                   0
               ELSE
                   pld.planLinePointCount
           END planLinePointCount,
           lpa.PlanAreaName,
           lpl.PlanLineName,
           lt.Remark,
           lt.Descript,
           lp.PlanTypeId,
           lpl.PlanLineId,
           lpa.PlanAreaId,
           CASE
               WHEN lpl.GeoText IS NULL THEN
                   lpa.GeoText
               ELSE
                   lpl.GeoText
           END AS GeoText,
           lpl.PatroGeoText
    FROM L_Task lt
        LEFT JOIN L_PLAN lp
            ON lp.PlanId = lt.PlanId
        LEFT JOIN L_PlanLine lpl
            ON lpl.PlanLineId = lp.PlanLineId
        LEFT JOIN L_PlanArea lpa
            ON lpa.PlanAreaId = lp.PlanAreaId
        LEFT JOIN
        (
            SELECT COUNT(PlanListId) AS PlanEqCount,
                   PlanID
            FROM L_PlanEquipmentDetail
            GROUP BY PlanID
        ) ple
            ON ple.PlanID = lt.PlanId
        LEFT JOIN L_PLANCYCLE lpc
            ON lpc.PlanCycleId = lp.PlanCycleId
        LEFT JOIN L_PLANTYPE lpt
            ON lpt.PlanTypeId = lp.PlanTypeId
        LEFT JOIN
        (
            SELECT PlanLineId,
                   COUNT(0) planLinePointCount
            FROM PlanLineDetail pld
            GROUP BY PlanLineId
        ) pld
            ON pld.PlanLineId = lpl.PlanLineId
        LEFT JOIN
        (
            SELECT PlanAreaId,
                   COUNT(0) planAreaPointCount
            FROM PointAreaInfo pai
            GROUP BY PlanAreaId
        ) pai
            ON pai.PlanAreaId = lpa.PlanAreaId
        LEFT JOIN
        (
            SELECT TaskId,
                   COUNT(0) AS CompletedCount
            FROM dbo.L_Task_CompleteDetail
            GROUP BY TaskId
        ) tcd
            ON tcd.TaskId = lt.TaskId
    WHERE 1 = 1
          AND lt.TaskState = 1 {sqlwhere}) t";

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

        public MessageEntity GetTaskPlanInfo(int taskId)
        {
            //初始化返回结果集对象
            Results_TaskInfo result = new Results_TaskInfo();
            //关键点队列对象创建
            List<Data_TaskInfo_ImportPoint> ImportPoint = new List<Data_TaskInfo_ImportPoint>();
            //设备实体队列对象创建
            List<Data_TaskInfo_EquPoint> EquPoint = new List<Data_TaskInfo_EquPoint>();
            //巡检任务详情
            List<Data_TaskInfo> TaskInfo = new List<Data_TaskInfo>();

            try
            {
                using (var connOutSide = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    //第一步:获取到该计划的计划类别
                    //1-1:查询任务计划类别的sql拼接
                    string sqlPlanType = string.Format(@" select lp.PlanTypeId,lp.BoolFeedBack from L_Task lt 
                                                  left join L_PLAN lp on lp.PlanId = lt.PlanId  where 1=1 and  lt.taskId = '{0}' ", taskId);
                    //1-2:初始化计划类别结果集
                    DataTable dtPlanType = new DataTable();
                    //1-3:查询计划类别结果集
                    dtPlanType.Load(connOutSide.ExecuteReader(sqlPlanType));
                    //1-4:判断是否查询到计划类别ID
                    if (dtPlanType.Rows.Count <= 0)
                    {
                        result.result = false;
                        result.message = "未查询到任务的计划类别!";
                    }
                    else
                    {
                        //第二步按照计划类别查询关键点数据集,设备数据集
                        string PlanType = dtPlanType.Rows[0]["PlanTypeId"].ToString();
                        string BoolFeedBack = dtPlanType.Rows[0]["BoolFeedBack"].ToString();//该巡检任务是否需要反馈 0:不需要反馈 1:需要反馈
                                                                                            //2-1:路线巡检查询关键点
                        Data_TaskInfo_ImportPoint ImportData;
                        if (PlanType == "2")
                        {
                            string strWhereLuXian = string.Empty;//路线关键点查询条件
                                                                 //需要反馈
                            if (BoolFeedBack == "1")
                            {
                                strWhereLuXian = string.Format(@" and (ltc.IsFeedback is null or ltc.IsFeedback = '0') ");
                            }
                            DataTable dtPlanLine = new DataTable();
                            string sqlSelectImport_Plan = string.Format(@" select pl.X,pl.Y,ltc.ID,pl.ImportPointName,pl.PlanLineDetaiId,1 as PointType  from PlanLineDetail pl
                                                                       left join L_PlanLine lp on pl.PlanLineId = lp.PlanLineId
                                                                       left join L_PLAN lpl on lpl.PlanLineId = lp.PlanLineId
                                                                       left join L_Task lt on lt.PlanId = lpl.PlanId
                                                                       left join L_Task_CompleteDetail ltc on ltc.Devicesmid = pl.PlanLineDetaiId and ltc.PointType = 2 and ltc.taskId = lt.taskId 
                                                                       where 1=1 and lt.taskId = '{0}'  and pl.ImportPointType = 1 {1} ", taskId, strWhereLuXian);
                            dtPlanLine.Load(connOutSide.ExecuteReader(sqlSelectImport_Plan));

                            if (dtPlanLine.Rows.Count > 0)
                            {

                                foreach (DataRow drow in dtPlanLine.Rows)
                                {
                                    ImportData = new Data_TaskInfo_ImportPoint();
                                    ImportData.ImportPointId = int.Parse(drow["PlanLineDetaiId"].ToString());
                                    ImportData.ImportPointName = drow["ImportPointName"].ToString();
                                    if (BoolFeedBack == "1")
                                    {
                                        //ImportData.PatroState = 0;
                                        ImportData.PatroState = string.IsNullOrEmpty(drow["ID"].ToString()) ? 0 : 1;
                                    }
                                    else
                                    {
                                        ImportData.PatroState = string.IsNullOrEmpty(drow["ID"].ToString()) ? 0 : 1;
                                    }
                                    ImportData.PointType = 2;
                                    ImportData.X = drow["X"].ToString();
                                    ImportData.Y = drow["Y"].ToString();
                                    ImportPoint.Add(ImportData);
                                }
                            }
                        }
                        //2-2:区域巡检查询关键点
                        else if (PlanType == "1")
                        {
                            string strWhereQuYu = string.Empty;//路线关键点查询条件
                                                               //需要反馈
                            if (BoolFeedBack == "1")
                            {
                                strWhereQuYu = string.Format(@" and (ltc.IsFeedback is null or ltc.IsFeedback = '0') ");
                            }
                            DataTable dtPlanArea = new DataTable();
                            string sqlSelectImport_Area = string.Format(@" select pl.PointX,pl.PointY,ltc.ID,pl.PointName,pl.PointId from PointAreaInfo pl
                                                                       left join L_PlanArea lp on pl.PlanAreaId = lp.PlanAreaId
                                                                       left join L_PLAN lpl on lpl.PlanAreaId = lp.PlanAreaId
                                                                       left join L_Task lt on lt.PlanId = lpl.PlanId
                                                                       left join L_Task_CompleteDetail ltc on ltc.Devicesmid = pl.PointId and ltc.PointType = 1 and ltc.taskId = lt.taskId 
                                                                       where 1=1 and lt.taskId = '{0}' {1} ", taskId, strWhereQuYu);
                            dtPlanArea.Load(connOutSide.ExecuteReader(sqlSelectImport_Area));

                            if (dtPlanArea.Rows.Count > 0)
                            {

                                foreach (DataRow drow in dtPlanArea.Rows)
                                {
                                    ImportData = new Data_TaskInfo_ImportPoint();
                                    ImportData.ImportPointId = int.Parse(drow["PointId"].ToString());
                                    ImportData.ImportPointName = drow["PointName"].ToString();
                                    ImportData.PatroState = drow["ID"] == DBNull.Value ? 0 : 1;
                                    ImportData.PointType = 1;
                                    ImportData.X = drow["PointX"].ToString();
                                    ImportData.Y = drow["PointY"].ToString();
                                    ImportPoint.Add(ImportData);
                                }
                            }
                        }
                        string strWhereEqu = string.Empty;//路线关键点查询条件
                                                          //需要反馈
                        if (BoolFeedBack == "1")
                        {
                            strWhereEqu = string.Format(@" and (ltc.IsFeedback is null or ltc.IsFeedback = '0') ");
                        }
                        //2-3:设备实体查询
                        Data_TaskInfo_EquPoint EquData;
                        DataTable dtSelectEqu = new DataTable();
                        string sqlSelectEqu_Task = string.Format(@"   select lp.SmX,lp.SmY,lp.SmID,lp.EquType, 0 as PointType,ltc.ID from  L_PlanEquipmentDetail lp
                                                                        left join  L_PLAN pl on pl.PlanId = lp.PlanID
                                                                        left join L_Task lt on lt.PlanId = pl.PlanId
                                                                        left join L_Task_CompleteDetail ltc on ltc.Devicesmid = lp.SmID and ltc.PointType = 0 and ltc.taskId = lt.taskId AND ltc.EquType=lp.EquType
                                                                        where 1=1 and lt.taskId = '{0}' {1} ", taskId, strWhereEqu);
                        dtSelectEqu.Load(connOutSide.ExecuteReader(sqlSelectEqu_Task));
                        if (dtSelectEqu.Rows.Count > 0)
                        {

                            foreach (DataRow drow in dtSelectEqu.Rows)
                            {
                                EquData = new Data_TaskInfo_EquPoint();
                                EquData.EquType = drow["EquType"].ToString();
                                EquData.PatroState = drow["ID"] == DBNull.Value ? 0 : 1;
                                EquData.PointType = 0;
                                EquData.Smid = int.Parse(drow["SmID"].ToString());
                                EquData.X = drow["SmX"].ToString();
                                EquData.Y = drow["SmY"].ToString();
                                EquData.EquType = drow["EquType"].ToString();
                                EquPoint.Add(EquData);
                            }
                        }
                        //2-4:巡检区域任务主体查询
                        Data_TaskInfo TaskInfoData;
                        if (PlanType == "1")
                        {
                            DataTable dtSelectTaskInfo = new DataTable();
                            string sqlSelectTaskInfo = string.Format(@"select lpa.GeoText,lpa.PlanAreaName,lp.PlanPath,'' as PlanPathName  from L_Task lt 
                                                                   left join L_PLAN lp on lp.PlanId = lt.PlanId 
                                                                   left join L_PlanArea lpa on lpa.PlanAreaId = lp.PlanAreaId
                                                                   where 1=1 and lt.taskId = '{0}' ", taskId);
                            dtSelectTaskInfo.Load(connOutSide.ExecuteReader(sqlSelectTaskInfo));
                            if (dtSelectTaskInfo.Rows.Count > 0)
                            {

                                foreach (DataRow drow in dtSelectTaskInfo.Rows)
                                {
                                    TaskInfoData = new Data_TaskInfo();
                                    TaskInfoData.PlanAreaGeoText = drow["GeoText"].ToString();
                                    TaskInfoData.PlanAreaName = drow["PlanAreaName"].ToString();
                                    TaskInfoData.PlanPathGeoText = drow["PlanPath"].ToString();
                                    TaskInfoData.PlanPathName = string.Empty;
                                    TaskInfo.Add(TaskInfoData);
                                }
                            }
                        }
                        //2-5:巡检路线任务主体查询
                        else if (PlanType == "2")
                        {
                            DataTable dtSelectTaskInfo = new DataTable();
                            string sqlSelectTaskInfo = string.Format(@" select lpl.PatroGeoText,'' as PlanAreaName ,lpl.PlanLineName,lpl.GeoText  from L_Task lt 
                                                                    left join  L_PLAN pl on pl.PlanId = lt.PlanID
                                                                    left join L_PlanLine lpl on lpl.PlanLineId = pl.PlanLineId
                                                                    where 1=1 and lt.taskId = '{0}' ", taskId);
                            dtSelectTaskInfo.Load(connOutSide.ExecuteReader(sqlSelectTaskInfo));
                            if (dtSelectTaskInfo.Rows.Count > 0)
                            {

                                foreach (DataRow drow in dtSelectTaskInfo.Rows)
                                {
                                    TaskInfoData = new Data_TaskInfo();
                                    TaskInfoData.PlanAreaGeoText = drow["PatroGeoText"].ToString();
                                    TaskInfoData.PlanAreaName = string.Empty;
                                    TaskInfoData.PlanPathGeoText = drow["GeoText"].ToString();
                                    TaskInfoData.PlanPathName = drow["PlanLineName"].ToString();
                                    TaskInfo.Add(TaskInfoData);
                                }
                            }
                        }

                    }
                    result.result = true;
                    result.message = "查询成功!";
                    result.Data = TaskInfo;
                    result.EquPointData = EquPoint;
                    result.ImportPointData = ImportPoint;
                }

            }
            catch (Exception e)
            {
                return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
            }


            return MessageEntityTool.GetMessage(3, result);
        }

        public MessageEntity PostTaskEqument(L_Task_CompleteDetail task_CompleteDetail)
        {
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
            {
                var rows = 0;
                int recordNum = 0;
                var insertSql = DapperExtentions.MakeInsertSql(task_CompleteDetail);
                if (string.IsNullOrEmpty(insertSql))
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, "请检查实体类");
                }
                if (task_CompleteDetail.EquType != null)
                {
                    recordNum = conn.ExecuteScalar<int>("select count(0) from L_Task_CompleteDetail where TaskId=@TaskId and Devicesmid=@Devicesmid and EquType=@EquType", task_CompleteDetail);
                }
                else
                {
                    recordNum = conn.ExecuteScalar<int>("select count(0) from L_Task_CompleteDetail where TaskId=@TaskId and Devicesmid=@Devicesmid", task_CompleteDetail);
                }
                if (recordNum > 0)
                {
                    return MessageEntityTool.GetMessage(ErrorType.NotUnique, null, "同一任务不能重复巡检设备");
                }


                try
                {
                    rows = conn.Execute(insertSql, task_CompleteDetail);
                    return MessageEntityTool.GetMessage(rows);
                }
                catch (Exception e)
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                }
            }
        }


        #region 任务明细内部类
        internal class Results_TaskInfo
        {
            public Boolean result = false;
            public String message = "失败";
            public List<Data_TaskInfo_ImportPoint> ImportPointData = new List<Data_TaskInfo_ImportPoint>();
            public List<Data_TaskInfo_EquPoint> EquPointData = new List<Data_TaskInfo_EquPoint>();
            public List<Data_TaskInfo> Data = new List<Data_TaskInfo>();
        }
        /// <summary>
        /// 任务主体信息
        /// </summary>
        internal class Data_TaskInfo
        {
            public String PlanAreaGeoText;//1:巡检区域GeoText
            public String PlanAreaName;//2:巡检区域名称
            public String PlanPathGeoText;//3:巡检路线GeoText
            public String PlanPathName;//4:巡检路线名称
        }
        /// <summary>
        /// 关键点内部类
        /// </summary>
        internal class Data_TaskInfo_ImportPoint
        {
            public String X;//1:X坐标
            public String Y;//2:Y坐标
            public int PatroState; //3:完成情况 0:未完成 1:已完成
            public String ImportPointName; //4:关键点名称        
            public int ImportPointId;//5:关键点id
            public int PointType;//6:关键点类别 1:关键点 2:设备实体
        }
        /// <summary>
        /// 设备实体内部类
        /// </summary>
        internal class Data_TaskInfo_EquPoint
        {
            public String X;//1:X坐标
            public String Y;//2:Y坐标
            public String EquType; //3:设备类别
            public int PatroState; //4:完成情况  0:未完成 1:已完成
            public int Smid;//5:设备实体ID
            public int PointType;//6:关键点类别 1:关键点 2:设备实体
        }
        #endregion
    }
}
