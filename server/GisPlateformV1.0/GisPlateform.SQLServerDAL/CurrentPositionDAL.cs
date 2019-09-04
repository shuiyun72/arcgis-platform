using Dapper;
using GisPlateform.Database;
using GisPlateform.IDAL;
using GisPlateform.Model.BaseEntity;
using System;
using System.Data;
using System.Text;

namespace GisPlateform.SQLServerDAL
{
    public class CurrentPositionDAL : ICurrentPositonDAL
    {
        public MessageEntity Add(string positionX, string positionY, string upTime, int personId, int isOnline)
        {
            string currentDateTime = System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            //2:初始化数据集,同时执行sql
            DataTable dtPoint = new DataTable();
            DataTable dtTaskPoint = new DataTable();
            int SaveResult = 0;
            ////string CurrentDateTime = System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            //string CurrentDateTime =Convert.ToDateTime(UpTime).ToString();
            try
            {
                using (var connOutSide = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    using (var connPlateform = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
                    {
                        //1-1:初始化数据保存语句
                        string sql = string.Empty;
                        //1-2:初始化数据保存结果
                        
                        sql = string.Format(@"insert into P_Position(PositionX,PositionY,UpTime,PersonId,isOnline) 
                                                                 values('{0}','{1}','{2}','{3}','{4}')"
                                                    , positionX, positionY, upTime, personId, isOnline);



                        SaveResult = connPlateform.Execute(sql);
                        //1:查询所有的仅到位的任务点sql语句拼接
                        string sqlSelect = string.Format(@"--巡检设备
                                                  select  '0' as PointType, lt.PlanId,lt.TaskId,lpd.SmID,lt.TaskName,lpd.SmX,lpd.SmY,lpd.EquType as PointName,lp.BoolFeedBack from L_Task lt
                                                  				 inner join L_PLAN lp on lp.PlanId = lt.PlanId
                                                  				 inner join L_PlanEquipmentDetail lpd on lpd.PlanID = lp.PlanId
                                                                 left join L_Task_CompleteDetail ltc on ltc.Devicesmid = lpd.SmID and ltc.PointType = 0 and ltc.TaskId = lt.TaskId
                                                  where 1=1 and ProraterId = {1}  and lt.TaskState !=0 and lt.AssignState = 1  and ltc.Devicesmid is null and  lt.VisitStarTime <='{0}' and lt.VisitOverTime >='{0}'			
                                                  union all
                                                  --路线关键点
                                                  select   '2' as PointType,lt.PlanId,lt.TaskId,lpd.PlanLineDetaiId as SmID,lt.TaskName,lpd.X as SmX,lpd.Y as SmY,lpd.ImportPointName as PointName,lp.BoolFeedBack from L_Task lt
                                                  				 inner join L_PLAN lp on lp.PlanId = lt.PlanId
                                                  				 inner join PlanLineDetail lpd on lp.PlanLineId = lpd.PlanLineId and lpd.ImportPointType = 1
                                                                 left join L_Task_CompleteDetail ltc on ltc.Devicesmid = lpd.PlanLineDetaiId and ltc.PointType = 2 and ltc.TaskId = lt.TaskId
                                                  where 1=1 and ProraterId = {1} and lt.TaskState !=0 and lt.AssignState = 1 and ltc.Devicesmid is null and  lt.VisitStarTime <='{0}' and lt.VisitOverTime >='{0}'	
                                                  --区域关键点
                                                  union all
                                                  select '1' as PointType, lt.PlanId,lt.TaskId,lpd.PointId as SmID,lt.TaskName,lpd.PointX as SmX,lpd.PointY as SmY,lpd.PointName as PointName,lp.BoolFeedBack from L_Task lt
                                                  				 inner join L_PLAN lp on lp.PlanId = lt.PlanId
                                                  				 inner join PointAreaInfo lpd on lp.PlanAreaId = lpd.PlanAreaId
                                                                 left join L_Task_CompleteDetail ltc on ltc.Devicesmid = lpd.PointId and ltc.PointType = 1 and ltc.TaskId = lt.TaskId
                                                  where 1=1 and ProraterId = {1}  and lt.TaskState !=0 and lt.AssignState = 1 and ltc.Devicesmid is null  and  lt.VisitStarTime <='{0}' and lt.VisitOverTime >='{0}'", currentDateTime, personId);
                        dtPoint.Load(connOutSide.ExecuteReader(sqlSelect));

                        ////3:计算上传该点位完成的巡检点
                        DataTable dtResult = CalculateCompletePoint(dtPoint, positionX, positionY);

                        //if (dtResult.Rows.Count > 0)
                        //{
                        //    //4:初始化完成点位插入语句
                        //    StringBuilder SqlInsertLineData = new StringBuilder();
                        //    SqlInsertLineData.AppendFormat(" set xact_abort off begin tran ");
                        //    //4:迭代处理完成的巡检点
                        //    for (int i = 0; i < dtResult.Rows.Count; i++)
                        //    {
                        //        SqlInsertLineData.AppendFormat(@" insert into L_Task_CompleteDetail(TaskId,Devicename,Devicesmid,Uptime,x,y,Peopleid,PointType,IsHidden,IsFeedback ) 
                        //                                                 values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}',0,0) ",
                        //                                                                    dtResult.Rows[i]["TaskId"], dtResult.Rows[i]["PointName"], dtResult.Rows[i]["SmID"], upTime, dtResult.Rows[i]["SmX"], dtResult.Rows[i]["SmY"], personId, dtResult.Rows[i]["PointType"]);
                        //    }
                        //    SqlInsertLineData.AppendFormat(@" commit tran ");
                        //    connOutSide.Execute(sql);
                        //}
                        #region  开始 判断该任务是否完成
                        DataTable dtSourcePoint = SelectDistinctTaskSource(dtPoint);
                        DataTable dtResultPoint = SelectDistinctTaskResult(dtResult);
                        for (int i = 0; i < dtSourcePoint.Rows.Count; i++)
                        {
                            for (int j = 0; j < dtResultPoint.Rows.Count; j++)
                            {
                                if (int.Parse(dtSourcePoint.Rows[i]["TaskId"].ToString()) == int.Parse(dtResultPoint.Rows[j]["TaskId"].ToString()) && int.Parse(dtSourcePoint.Rows[i]["FinishedCount"].ToString()) == int.Parse(dtResultPoint.Rows[j]["FinishedCount"].ToString()))
                                {
                                    //初始化查询条件
                                    string strWhere = string.Empty;
                                    //仅到位
                                    if (dtSourcePoint.Rows[i]["BoolFeedBack"].ToString() == "0")
                                    {
                                        string strSelect = string.Format(@" select * from ({0}) where TaskId = {1} ", sqlSelect, dtResultPoint.Rows[j]["TaskId"]);
                                        dtTaskPoint.Load(connOutSide.ExecuteReader(sqlSelect));
                                        if (dtTaskPoint.Rows.Count <= 0)
                                        {
                                            string strUpdate = string.Format(@" update  L_Task  set Finish = 1 where TaskId = {0} ", dtResultPoint.Rows[j]["TaskId"]);
                                            connOutSide.Execute(strUpdate);
                                        }
                                    }
                                    //需反馈
                                    else if (dtSourcePoint.Rows[i]["BoolFeedBack"].ToString() == "1")
                                    {
                                        sqlSelect = string.Format(@"--巡检设备
                                                  select  '0' as PointType, lt.PlanId,lt.TaskId,lpd.SmID,lt.TaskName,lpd.SmX,lpd.SmY,lpd.EquType as PointName,lp.BoolFeedBack from L_Task lt
                                                  				 inner join L_PLAN lp on lp.PlanId = lt.PlanId
                                                  				 inner join L_PlanEquipmentDetail lpd on lpd.PlanID = lp.PlanId
                                                                 left join L_Task_CompleteDetail ltc on ltc.Devicesmid = lpd.SmID and ltc.PointType = 0 and ltc.TaskId = lt.TaskId
                                                  where 1=1 and ProraterId = {1} and  lt.TaskId = {2}  and lt.TaskState !=0 and lt.AssignState = 1  and ltc.Devicesmid is null and  lt.VisitStarTime <='{0}' and lt.VisitOverTime >='{0}'			
                                                  union all
                                                  --路线关键点
                                                  select   '2' as PointType,lt.PlanId,lt.TaskId,lpd.PlanLineDetaiId as SmID,lt.TaskName,lpd.X as SmX,lpd.Y as SmY,lpd.ImportPointName as PointName,lp.BoolFeedBack from L_Task lt
                                                  				 inner join L_PLAN lp on lp.PlanId = lt.PlanId
                                                  				 inner join PlanLineDetail lpd on lp.PlanLineId = lpd.PlanLineId and lpd.ImportPointType = 1
                                                                 left join L_Task_CompleteDetail ltc on ltc.Devicesmid = lpd.PlanLineDetaiId and ltc.PointType = 2 and ltc.TaskId = lt.TaskId
                                                  where 1=1 and ProraterId = {1} and  lt.TaskId = {2} and lt.TaskState !=0 and lt.AssignState = 1 and (ltc.Devicesmid is null or (ltc.Devicesmid is not null and ltc.IsFeedback = 0)) and  lt.VisitStarTime <='{0}' and lt.VisitOverTime >='{0}'	
                                                  --区域关键点
                                                  union all
                                                  select '1' as PointType, lt.PlanId,lt.TaskId,lpd.PointId as SmID,lt.TaskName,lpd.PointX as SmX,lpd.PointY as SmY,lpd.PointName as PointName,lp.BoolFeedBack from L_Task lt
                                                  				 inner join L_PLAN lp on lp.PlanId = lt.PlanId
                                                  				 inner join PointAreaInfo lpd on lp.PlanAreaId = lpd.PlanAreaId
                                                                 left join L_Task_CompleteDetail ltc on ltc.Devicesmid = lpd.PointId and ltc.PointType = 1 and ltc.TaskId = lt.TaskId
                                                  where 1=1 and ProraterId = {1}  and  lt.TaskId = {2} and lt.TaskState !=0 and lt.AssignState = 1 and (ltc.Devicesmid is null or (ltc.Devicesmid is not null and ltc.IsFeedback = 0))  and  lt.VisitStarTime <='{0}' and lt.VisitOverTime >='{0}'", currentDateTime, personId, dtResultPoint.Rows[i]["TaskId"]);
                                      
                                        dtTaskPoint.Load(connOutSide.ExecuteReader(sqlSelect));
                                        if (dtTaskPoint.Rows.Count <= 0)
                                        {
                                            string strUpdate = string.Format(@" update  L_Task  set Finish = 1 where TaskId = {0} ", dtResultPoint.Rows[i]["TaskId"]);
                                            connOutSide.Execute(strUpdate);
                                        }
                                    }
                                }
                            }
                        }
                        #endregion
                        

                    }

                }

            }
            catch (Exception e)
            {
                return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
            }
            if (SaveResult > 0)
            {
                return MessageEntityTool.GetMessage(1, null, true, "位置上报成功", 1);
            }
            else {
                return MessageEntityTool.GetMessage(ErrorType.OprationError);
            }
        }

        /// <summary>
        /// Selects the distinct task source.
        /// </summary>
        /// <param name="dtPoint">The dt point.</param>
        /// <returns>DataTable.</returns>
        private DataTable SelectDistinctTaskSource(DataTable dtPoint)
        {
            DataTable dtCompletePoint = new DataTable();
            dtCompletePoint.Columns.Add("PlanId", Type.GetType("System.String"));// 计划ID
            dtCompletePoint.Columns.Add("TaskId", Type.GetType("System.String"));// 任务ID    
            dtCompletePoint.Columns.Add("FinishedCount", Type.GetType("System.String"));// 任务ID
            dtCompletePoint.Columns.Add("BoolFeedBack", Type.GetType("System.String"));//点位名称
            try
            {
                //迭代处理所有结果集
                for (int i = 0; i < dtPoint.Rows.Count; i++)
                {
                    //判断处理结果数量是否为0,0认为是空,直接添加行
                    if (dtCompletePoint.Rows.Count <= 0)
                    {
                        DataRow dr = dtCompletePoint.NewRow();
                        dr["PlanId"] = dtPoint.Rows[i]["PlanId"];
                        dr["TaskId"] = dtPoint.Rows[i]["TaskId"];
                        dr["FinishedCount"] = 1;
                        dr["BoolFeedBack"] = dtPoint.Rows[i]["BoolFeedBack"];
                        dtCompletePoint.Rows.Add(dr);
                    }
                    //当行数不为0时认为已经存在数据需要进行判断
                    else
                    {
                        //迭代遍历已经计算完成的结果集
                        for (int j = 0; j < dtCompletePoint.Rows.Count; j++)
                        {
                            //当待处理和已处理数据集的TaskId一致时,将已处理的数量进行+1操作
                            if (int.Parse(dtCompletePoint.Rows[j]["TaskId"].ToString()) == int.Parse(dtPoint.Rows[i]["TaskId"].ToString()))
                            {
                                dtCompletePoint.Rows[j]["FinishedCount"] = int.Parse(dtCompletePoint.Rows[j]["FinishedCount"].ToString()) + 1;
                                break;
                            }
                            //当已经是最后一行数据,但是待处理数据集与已经处理数据集仍未匹配,则添加
                            else if (j == (dtCompletePoint.Rows.Count - 1) && int.Parse(dtCompletePoint.Rows[j]["TaskId"].ToString()) != int.Parse(dtPoint.Rows[i]["TaskId"].ToString()))
                            {
                                DataRow dr = dtCompletePoint.NewRow();
                                dr["PlanId"] = dtPoint.Rows[i]["PlanId"];
                                dr["TaskId"] = dtPoint.Rows[i]["TaskId"];
                                dr["FinishedCount"] = 1;
                                dr["BoolFeedBack"] = dtPoint.Rows[i]["BoolFeedBack"];
                                dtCompletePoint.Rows.Add(dr);
                                break;
                            }
                        }
                    }
                }
                return dtCompletePoint;
            }
            catch
            {
                return dtCompletePoint;
            }
        }
        /// <summary>
        /// 按任务计算完成点位数量
        /// </summary>
        /// <param name="dtResult">The dt result.</param>
        /// <returns>DataTable.</returns>
        private static DataTable SelectDistinctTaskResult(DataTable dtResult)
        {
            DataTable dtCompletePoint = new DataTable();
            dtCompletePoint.Columns.Add("PlanId", Type.GetType("System.String"));// 计划ID
            dtCompletePoint.Columns.Add("TaskId", Type.GetType("System.String"));// 任务ID    
            dtCompletePoint.Columns.Add("FinishedCount", Type.GetType("System.String"));// 任务ID
            dtCompletePoint.Columns.Add("BoolFeedBack", Type.GetType("System.String"));//点位名称
            try
            {
                //迭代处理所有结果集
                for (int i = 0; i < dtResult.Rows.Count; i++)
                {
                    //判断处理结果数量是否为0,0认为是空,直接添加行
                    if (dtCompletePoint.Rows.Count <= 0)
                    {
                        DataRow dr = dtCompletePoint.NewRow();
                        dr["PlanId"] = dtResult.Rows[i]["PlanId"];
                        dr["TaskId"] = dtResult.Rows[i]["TaskId"];
                        dr["FinishedCount"] = 1;
                        dr["BoolFeedBack"] = dtResult.Rows[i]["BoolFeedBack"];
                        dtCompletePoint.Rows.Add(dr);
                    }
                    //当行数不为0时认为已经存在数据需要进行判断
                    else
                    {
                        //迭代遍历已经计算完成的结果集
                        for (int j = 0; j < dtCompletePoint.Rows.Count; j++)
                        {
                            //当待处理和已处理数据集的TaskId一致时,将已处理的数量进行+1操作
                            if (int.Parse(dtCompletePoint.Rows[j]["TaskId"].ToString()) == int.Parse(dtResult.Rows[i]["TaskId"].ToString()))
                            {
                                dtCompletePoint.Rows[j]["FinishedCount"] = int.Parse(dtCompletePoint.Rows[j]["FinishedCount"].ToString()) + 1;
                                break;
                            }
                            //当已经是最后一行数据,但是待处理数据集与已经处理数据集仍未匹配,则添加
                            else if (j == (dtCompletePoint.Rows.Count - 1) && int.Parse(dtCompletePoint.Rows[j]["TaskId"].ToString()) != int.Parse(dtResult.Rows[i]["TaskId"].ToString()))
                            {
                                DataRow dr = dtCompletePoint.NewRow();
                                dr["PlanId"] = dtResult.Rows[i]["PlanId"];
                                dr["TaskId"] = dtResult.Rows[i]["TaskId"];
                                dr["FinishedCount"] = 1;
                                dr["BoolFeedBack"] = dtResult.Rows[i]["BoolFeedBack"];
                                dtCompletePoint.Rows.Add(dr);
                                break;
                            }
                        }
                    }
                }
                return dtCompletePoint;
            }
            catch
            {
                return dtCompletePoint;
            }
        }
        /// <summary>
        /// Calculates the complete point.
        /// </summary>
        /// <param name="dtPoint">仅到位点位集</param>
        /// <param name="PositionX">人员x坐标</param>
        /// <param name="PositionY">人员y坐标</param>
        /// <returns>DataTable.</returns>
        private DataTable CalculateCompletePoint(DataTable dtPoint, string PositionX, string PositionY)
        {
            DataTable dtCompletePoint = new DataTable();
            dtCompletePoint.Columns.Add("PlanId", Type.GetType("System.String"));// 计划ID
            dtCompletePoint.Columns.Add("TaskId", Type.GetType("System.String"));// 任务ID
            dtCompletePoint.Columns.Add("SmID", Type.GetType("System.String"));// 点位ID
            dtCompletePoint.Columns.Add("TaskName", Type.GetType("System.String"));//任务名称
            dtCompletePoint.Columns.Add("SmX", Type.GetType("System.String"));//点位X坐标
            dtCompletePoint.Columns.Add("SmY", Type.GetType("System.String"));//点位X坐标
            dtCompletePoint.Columns.Add("PointName", Type.GetType("System.String"));//点位名称
            dtCompletePoint.Columns.Add("PointType", Type.GetType("System.String"));//点位名称
            dtCompletePoint.Columns.Add("BoolFeedBack", Type.GetType("System.String"));//点位名称
            try
            {
                double BetweenLength = 0;
                //进行迭代计算上传该点位于仅到位点位的距离是否满足完成点位的条件
                for (int i = 0; i < dtPoint.Rows.Count; i++)
                {
                    
                    
                    BetweenLength = CalculateDistance(double.Parse(dtPoint.Rows[i]["SmY"].ToString()), double.Parse(dtPoint.Rows[i]["SmX"].ToString()), double.Parse(PositionY), double.Parse(PositionX));

                    //if (BetweenLength <= 100)
                    if (BetweenLength <= 60)
                    {
                        DataRow dr = dtCompletePoint.NewRow();
                        dr["PlanId"] = dtPoint.Rows[i]["PlanId"];
                        dr["TaskId"] = dtPoint.Rows[i]["TaskId"];
                        dr["SmID"] = dtPoint.Rows[i]["SmID"];
                        dr["TaskName"] = dtPoint.Rows[i]["TaskName"];
                        dr["SmX"] = dtPoint.Rows[i]["SmX"];
                        dr["SmY"] = dtPoint.Rows[i]["SmY"];
                        dr["PointName"] = dtPoint.Rows[i]["PointName"];
                        dr["PointType"] = dtPoint.Rows[i]["PointType"];
                        dr["BoolFeedBack"] = dtPoint.Rows[i]["BoolFeedBack"];
                        dtCompletePoint.Rows.Add(dr);
                    }
                }
                return dtCompletePoint;
            }
            catch (Exception ex)
            {
                return dtCompletePoint;
            }
        }
        /// <summary>
        /// 计算两点之间的距离
        /// </summary>
        /// <param name="latA">第一个点的纬度</param>
        /// <param name="lonA">第一个点的经度</param>
        /// <param name="latB">第二个点的纬度</param>
        /// <param name="lonB">第二个点的纬度</param>
        /// <returns>System.Double.</returns>
        private double CalculateDistance(double x1, double y1, double x2, double y2)
        {
            var radLat1 = y1 * Math.PI / 180.0;
            var radLat2 = y2 * Math.PI / 180.0;
            var a = radLat1 - radLat2;
            var b = x1 * Math.PI / 180.0 - x2 * Math.PI / 180.0;
            var s = 2 * Math.Asin(Math.Sqrt(Math.Pow(Math.Sin(a / 2), 2) + Math.Cos(radLat1) * Math.Cos(radLat2) * Math.Pow(Math.Sin(b / 2), 2)));
            s = s * 6378.137;
            s = Math.Round(s * Math.Pow(10, 9)) / Math.Pow(10, 9);
            return s * 1000;


        }
    }
}
