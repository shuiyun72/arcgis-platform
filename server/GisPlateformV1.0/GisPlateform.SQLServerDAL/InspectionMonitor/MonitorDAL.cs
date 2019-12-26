using Dapper;
using GisPlateform.Database;
using GisPlateform.IDAL.InspectionMonitor;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.SQLServerDAL.InspectionMonitor
{
    public class MonitorDAL : IMonitorDAL
    {
        public MessageEntity GetInspectionRoute(int iAdminID, DateTime startTime, DateTime endTime)
        {
            string queryStr = $@"SELECT b.cAdminName,
                           b.cAdminTel ,
                           a.*
                    FROM P_Position AS a
                        LEFT JOIN dbo.P_Admin AS b
                            ON a.PersonId = b.iAdminID
                    WHERE  a.PersonId={iAdminID}  and a.UpTime>='{startTime}' and a.UpTime<='{endTime}' ";
            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                try
                {
                    List<dynamic> result = conn.Query<dynamic>(queryStr).ToList();

                    return MessageEntityTool.GetMessage(result.Count(), result);
                }
                catch (Exception e)
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                }
            }
        }

        public MessageEntity GetInspectors()
        {
            string sqlDep = @"SELECT d.iDeptID ,
                               MAX(d.cDepName) AS cDepName
                        FROM dbo.P_Department d
                            RIGHT JOIN dbo.P_Admin a
                                ON a.iDeptID = d.iDeptID
                            LEFT JOIN dbo.P_Role r
                                ON r.iRoleID = a.iRoleID
                        WHERE r.IsInspector = 1 AND d.iDeptID IS NOT NULL
                        GROUP BY d.iDeptID;";


            string sqlPerson = @"SELECT *,
                                   CASE
                                       WHEN t.MinuteDiff IS NULL
                                            OR t.MinuteDiff > 5 THEN
                                           'N'
                                       ELSE
                                           'Y'
                                   END AS IsOnline
                            FROM
                            (
                                SELECT a.iDeptID,
                                       a.iAdminID,
                                       a.cAdminName,
                                       a.Smid,
                                       p.UpTime,
                                       DATEDIFF(MINUTE, p.UpTime, SYSDATETIME()) AS MinuteDiff
                                FROM dbo.P_Admin a
                                    LEFT JOIN dbo.P_Role r
                                        ON r.iRoleID = a.iRoleID
                                    LEFT JOIN
                                    (
                                        SELECT PersonId,
                                               MAX(UpTime) AS UpTime
                                        FROM P_Position
                                        GROUP BY PersonId
                                    ) p
                                        ON p.PersonId = a.iAdminID
                                WHERE r.IsInspector = 1 and a.IsDelete!=1 ) t;";

            using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.GisPlateform))
            {
                try
                {
                    DataTable depdt = new DataTable();
                    DataTable perdt = new DataTable();
                    depdt.Load(conn.ExecuteReader(sqlDep));
                    perdt.Load(conn.ExecuteReader(sqlPerson));

                    List<DeptInfo> keyValuePairs = new List<DeptInfo>();
                    foreach (DataRow row in depdt.Rows)
                    {
                        DataRow[] personRows = perdt.Select($"iDeptID={row["iDeptID"]}");
                        List<object> persons = new List<object>();
                        //在线人数
                        int i = 0;
                        foreach (DataRow pRow in personRows)
                        {
                            if (pRow["IsOnline"].ToString() == "Y")
                            {
                                i++;
                            }
                            persons.Add(new
                            {
                                iAdminID = pRow["iAdminID"],
                                cAdminName = pRow["cAdminName"],
                                Smid = pRow["Smid"],
                                UpTime = pRow["UpTime"],
                                IsOnline = pRow["IsOnline"]
                            });
                        }


                        //keyValuePairs.Add(new
                        //{
                        //    cDepName = row["cDepName"],
                        //    OnLineCount = i
                        //}, persons);

                        keyValuePairs.Add(new DeptInfo { DepName = row["cDepName"].ToString(), OnLineCount = i ,Persons= persons });

                    }
                    return MessageEntityTool.GetMessage(keyValuePairs.Count, keyValuePairs);
                }
                catch (Exception e)
                {
                    return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
                }
            }

        }

    }
    public class DeptInfo
    {
        public string DepName { set; get; }
        public int OnLineCount { set; get; }
        public List<object> Persons { set; get; }
    }
}
