using Dapper;
using GisPlateform.Database;
using GisPlateform.IDAL.MainTainStatistics;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.SQLServerDAL.MainTain.MainTainStatistics
{
    public class MainTainStatisticsDAL : IMainTainStatisticsDAL
    {
        public MessageEntity Get(DateTime? startTime, DateTime? endTime, string sort, string ordering, int num, int page)
        {
            if (string.IsNullOrEmpty(sort))
            {
                sort = "PersonName";
            }
            if (string.IsNullOrEmpty(ordering))
            {
                ordering = "desc";
            }

            string sql = string.Format(@"SELECT P.PersonName,COUNT(EventID) ECount FROM M_Event E 
left join ( select iAdminID AS PersonId, cAdminName AS PersonName from GisPlateform.dbo.P_Admin p ) P ON E.PersonId=P.PersonId 
where E.DeleteStatus=0 and  1=1 ");
            if (startTime != null)
            {
                sql += $" and UpTime>='{startTime}' ";
            }
            if (endTime != null)
            {
                endTime = DateTime.Parse(endTime.ToString()).AddDays(1);
                sql += $" and UpTime<='{endTime}' ";
            }
            sql += " group by p.PersonName";
            DapperExtentions.EntityForSqlToPager<dynamic>(sql, sort, ordering, num, page, out MessageEntity result, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide);

            return result;
        }
        public MessageEntity EChatEventFromStatistics(DateTime? startTime, DateTime? endTime)
        {
            string errorMsg = "";
            string sql = " SELECT EF.EventFromName,COUNT(EventID) ECount FROM M_Event E left join M_EventFrom EF ON E.EventFromId=EF.EventFromId where E.DeleteStatus=0 and 1=1";
            if (startTime != null)
            {
                sql += $" and UpTime>='{startTime}' ";
            }
            if (endTime != null)
            {
                endTime = DateTime.Parse(endTime.ToString()).AddDays(1);
                sql += $" and UpTime<='{endTime}' ";
            }
            sql += " group by EF.EventFromName ";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    List<dynamic> eventType = conn.Query<dynamic>(sql).ToList();

                    return MessageEntityTool.GetMessage(eventType.Count(), eventType, true, "", eventType.Count());
                }
            }
            catch (Exception e)
            {
                errorMsg = e.Message;
                return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
            }
        }
        /// <summary>
        /// 事件来源统计数量
        /// </summary>
        /// <param name="startTime"></param>
        /// <param name="endTime"></param>
        /// <returns></returns>
        public DataTable EventFromStatisticsbyDate(DateTime? startTime, DateTime? endTime)
        {
            string errorMsg = "";
            string sql = " select CONVERT (varchar(100), UpTime, 23) LineDate,COUNT(DataStatic.DeptId) CCount, EventFromName from (select base.EventFromName,Child.*from  M_EventFrom base left join M_Event Child on base .EventFromId=Child.EventFromId  where Child.DeleteStatus=0 and 1=1";
            if (startTime != null)
            {
                sql += $" and UpTime>='{startTime}' ";
            }
            if (endTime != null)
            {
                endTime = DateTime.Parse(endTime.ToString()).AddDays(1);
                sql += $" and UpTime<='{endTime}' ";
            }
            sql += " )  DataStatic   group by  EventFromId,EventFromName , CONVERT (varchar(100), UpTime, 23) Order by  LineDate asc";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    DataTable dt_sumType = new DataTable();
                    dt_sumType.Load(conn.ExecuteReader(sql)); //此类别下时间段内隐患名称出现的个数

                    return dt_sumType;
                }
            }
            catch (Exception e)
            {
                errorMsg = e.Message;
                return null;
            }
        }
        /// <summary>
        ///  2.查询唯一时间 按照事件来源分组
        /// </summary>
        /// <param name="startTime"></param>
        /// <param name="endTime"></param>
        /// <returns></returns>
        public DataTable DtDateByEventfromStatistics(DateTime? startTime, DateTime? endTime)
        {
            string errorMsg = "";
            string sql = " select CONVERT (varchar(100), UpTime, 23) LineDate from (select base.EventFromName,Child.*from  M_EventFrom base left join M_Event Child on base .EventFromId=Child.EventFromId  where Child.DeleteStatus=0 and 1=1  ";
            if (startTime != null)
            {
                sql += $" and UpTime>='{startTime}' ";
            }
            if (endTime != null)
            {
                endTime = DateTime.Parse(endTime.ToString()).AddDays(1);
                sql += $" and UpTime<='{endTime}' ";
            }
            sql += ")  DataStatic   group by   CONVERT (varchar(100), UpTime, 23) Order by  LineDate asc";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    DataTable dt_sumType = new DataTable();
                    dt_sumType.Load(conn.ExecuteReader(sql)); //此类别下时间段内隐患名称出现的个数

                    return dt_sumType;
                }
            }
            catch (Exception e)
            {
                errorMsg = e.Message;
                return null;
            }
        }

        /// <summary>
        ///  3.查找折线图类型(事件来源名称)
        /// </summary>
        /// <param name="startTime"></param>
        /// <param name="endTime"></param>
        /// <returns></returns>
        public DataTable EventFromNameStatistics(DateTime? startTime, DateTime? endTime)
        {
            string errorMsg = "";
            string sql = "select distinct( EventFromName)  from  ( select CONVERT (varchar(100), UpTime, 23) LineDate,COUNT(DataStatic.DeptId) CCount, EventFromName from (select base.EventFromName,Child.*from  M_EventFrom base left join M_Event Child on base .EventFromId=Child.EventFromId  where Child.DeleteStatus=0 and 1=1";
            if (startTime != null)
            {
                sql += $" and UpTime>='{startTime}' ";
            }
            if (endTime != null)
            {
                endTime = DateTime.Parse(endTime.ToString()).AddDays(1);
                sql += $" and UpTime<='{endTime}' ";
            }
            sql += " )  DataStatic   group by  EventFromId,EventFromName , CONVERT (varchar(100), UpTime, 23) ) Line";
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    DataTable dt_sumType = new DataTable();
                    dt_sumType.Load(conn.ExecuteReader(sql)); //此类别下时间段内隐患名称出现的个数
                 
                    return dt_sumType;
                }
            }
            catch (Exception e)
            {
                errorMsg = e.Message;
                return null;
            }
        }

      
    }
}
