using Dapper;
using GisPlateform.Database;
using GisPlateform.IDAL.InspectionStatistics;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.SQLServerDAL.InspectionStatistics
{
    public class UserReportStatisticsDAL : IUserReportStatisticsDAL
    {
        public MessageEntity GetTable(DateTime? startTime, DateTime? endTime)
        {
            var whereStr = "";
            if (startTime != null && endTime != null)
            {
                whereStr = $" and E.UpTime >='{startTime}'and E.UpTime <= '{endTime}' ";
            }

            var sqlStr = $@"SELECT ISNULL(P.PersonName,'匿名') as PersonName ,COUNT(EventID)as ECount FROM M_Event E  LEFT JOIN M_EventFrom as c ON E.EventFromId=c.EventFromId  left join L_Person P ON E.PersonId=P.PersonId  where E.DeleteStatus=0  and c.EventFromId=3 {whereStr} GROUP BY P.PersonName";

            try
            {
                using (var conn = ConnectionFactory.GetDBConn(ConnectionFactory.DBConnNames.PipeInspectionBase_Gis_OutSide))
                {
                    List<dynamic> eventType = conn.Query<dynamic>(sqlStr).ToList();

                    return MessageEntityTool.GetMessage(eventType.Count(), eventType);
                }
            }
            catch (Exception e)
            {
                return MessageEntityTool.GetMessage(ErrorType.SqlError, e.Message);
            }
        }
    }
}
