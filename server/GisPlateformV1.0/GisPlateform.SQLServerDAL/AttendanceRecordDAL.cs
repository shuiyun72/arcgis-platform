using GisPlateform.Database;
using GisPlateform.IDAL;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;
namespace GisPlateform.SQLServerDAL
{
    public class AttendanceRecordDAL : IAttendanceRecordDAL
    {


        public MessageEntity Get(DateTime startTime, DateTime endTime, int? deptId,int ? iAdminID, string sort, string ordering, int num, int page)
        {
            var sqlString = @"SELECT * FROM ( SELECT p.DeptId,p.PersonName,d.*,CAST(CONVERT(DECIMAL(10,2),DATEDIFF(MINUTE,d.work_start,d.work_over))/60 AS DECIMAL(10,2)) AS times
                                FROM PipeInspectionBase_Gis_OutSide.dbo.L_Person AS p INNER JOIN
                                (SELECT * FROM(SELECT ss.work_start, ss.PersonId, de.Date FROM(SELECT MIN(UpTime) AS work_start, PersonId
                                FROM dbo.L_AttendanceManage WHERE PersonStatus = '上班正常'  GROUP BY PersonId, Date)AS ss
                                       INNER JOIN L_AttendanceManage AS de ON ss.work_start = de.UpTime AND ss.PersonId = de.PersonId)AS sb
                                LEFT JOIN(
                                SELECT ee.work_over, ee.PersonId AS PersonId2, de2.Date AS Date2
                                FROM(SELECT MAX(UpTime) AS work_over, PersonId  FROM dbo.L_AttendanceManage WHERE PersonStatus = '用户下班'  GROUP BY PersonId, Date)AS ee
                                INNER JOIN L_AttendanceManage AS de2 ON ee.work_over = de2.UpTime AND ee.PersonId = de2.PersonId
                                          )AS xb ON xb.Date2 = sb.Date AND xb.PersonId2 = sb.PersonId)AS d ON d.PersonId = p.PersonId)AS a  where 1=1  ";
            if (iAdminID != null)
            {
                sqlString += $" and PersonId = '{iAdminID}' ";
            }
            if (deptId != null)
            {
                sqlString += $" and DeptId = '{deptId}' ";
            }
            if (startTime != null)
            {
                sqlString += $" and work_start >= '{startTime}' ";
            }
            if (endTime != null)
            {
                sqlString += $" and work_start <= '{endTime}' ";
            }
            DapperExtentions.EntityForSqlToPager<dynamic>(sqlString, sort, ordering, num, page, out MessageEntity result, ConnectionFactory.DBConnNames.GisPlateform);

            return result;

        }
        /// <summary>
        /// 获取当前人员当天开始时间是否有打卡记录
        /// </summary>
        /// <param name="Lwr_PersonId"></param>
        /// <param name="UpTime"></param>
        /// <returns></returns>
        public DataTable GetQianDao(string Lwr_PersonId, string UpTime)
        {
            string errorMsg = "";
            string sql = @"  select Id,PersonId,DeptId,Date,StartTime,EndTime,Hour,BeiZhu,PersonStatus,UpTime,XY from L_AttendanceManage where 1=1 ";
            if (Lwr_PersonId != null)
            {
                sql += $" and PersonId='{Lwr_PersonId}' ";
            }
            if (UpTime != null)
            {
                sql += $" and UpTime>='{UpTime}' ";
            }
            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
                {
                    DataTable dt = new DataTable();
                    dt.Load(conn.ExecuteReader(sql));

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
        /// 签到打卡
        /// </summary>
        /// <param name="Lwr_PersonId">用户id</param>
        /// <param name="Lwr_XY">经纬度</param>
        /// <param name="DeptId">部门id</param>
        /// <param name="Lwr_BeiZhu">备注</param>
        /// <param name="Lwr_UpTime">用户上传时间</param>
        /// <param name="Lwr_Date">用户上传日期(年月日)</param>
        /// <param name="Lwr_StartTime">开始时间(十分秒)</param>
        /// <param name="Lwr_EndTime">下班时间(十分秒)</param>
        /// <param name="Lwr_Hour">上班时间</param>
        /// <param name="Lwr_PersonStatus">签到状态 上班签到  下班签退</param>
        /// <returns></returns>
        public MessageEntity QianDao(string Lwr_PersonId, string Lwr_XY, int DeptId, string Lwr_BeiZhu, string Lwr_UpTime, string Lwr_Date, string Lwr_StartTime, string Lwr_EndTime, string Lwr_Hour, string Lwr_PersonStatus)
        {
            string insertSql = @"insert into L_AttendanceManage(PersonId,DeptId,Date,StartTime,EndTime,Hour,BeiZhu,PersonStatus,UpTime,XY)  VALUES ( @PersonId,@DeptId,@Date,@StartTime,@EndTime,@Hour,@BeiZhu,@PersonStatus,@UpTime,@XY ); ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                using (var transaction = conn.BeginTransaction())
                {

                    try
                    {
                        var i = conn.Execute(insertSql, new { PersonId = Lwr_PersonId, DeptId = DeptId, Date = Lwr_Date, StartTime = Lwr_StartTime, EndTime = Lwr_EndTime, Hour = Lwr_Hour, BeiZhu = Lwr_BeiZhu, PersonStatus = Lwr_PersonStatus, UpTime= Lwr_UpTime, XY=Lwr_XY }, transaction);

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
