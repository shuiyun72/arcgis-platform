using GisPlateform.Database;
using GisPlateform.IDAL;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.SQLServerDAL
{
    public class AttendanceRecordDAL : IAttendanceRecordDAL
    {


        public MessageEntity Get(DateTime startTime, DateTime endTime, int? deptId, string sort, string ordering, int num, int page)
        {
            var sqlString = $"SELECT * FROM ( SELECT p.DeptId,p.PersonName,d.*,CAST(CONVERT(DECIMAL(10,2),DATEDIFF(MINUTE,d.work_start,d.work_over))/60 AS DECIMAL(10,2)) AS times FROM L_Person AS p INNER JOIN (SELECT * FROM (SELECT ss.work_start,ss.PersonId ,de.Date FROM( SELECT MIN(UpTime) AS work_start,PersonId  FROM dbo.L_DeviceStatus WHERE PersonStatus='上班正常'  GROUP BY PersonId,Date)AS ss INNER JOIN L_DeviceStatus AS de ON ss.work_start=de.UpTime AND ss.PersonId=de.PersonId)AS sb LEFT JOIN (SELECT ee.work_over,ee.PersonId AS PersonId2,de2.Date AS Date2 FROM( SELECT MAX(UpTime) AS work_over,PersonId  FROM dbo.L_DeviceStatus WHERE PersonStatus='用户下班'  GROUP BY PersonId,Date)AS ee INNER JOIN L_DeviceStatus AS de2 ON ee.work_over=de2.UpTime AND ee.PersonId=de2.PersonId )AS xb ON xb.Date2 = sb.Date AND xb.PersonId2 = sb.PersonId )AS d ON d.PersonId = p.PersonId)AS a where 1=1 and work_start>='{startTime}' and work_start<='{endTime}' ";

            if (deptId != null)
            {
                sqlString += $" and DeptId = '{deptId}' ";
            }

            DapperExtentions.EntityForSqlToPager<dynamic>(sqlString, sort, ordering, num, page, out MessageEntity result, ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide);

            return result;

        }

    }
}
