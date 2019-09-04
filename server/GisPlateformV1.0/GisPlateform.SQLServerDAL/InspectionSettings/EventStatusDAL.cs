using Dapper;
using GisPlateform.Database;
using GisPlateform.IDAL.InspectionSettings;
using GisPlateform.Model.BaseEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GisPlateform.SQLServerDAL.InspectionSettings
{
    public class EventStatusDAL : IEventStatusDAL
    {
        public MessageEntity GetStatusForInspection()
        {
            string errorMsg = "";
            string query = " select OperId,OperName2 from M_WorkOrder_Oper where OperId in (1,2,3,4,5,6,7,11) ";
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

        public MessageEntity GetStatusForMantain(DateTime? startTime, DateTime? endTime)
        {
            string errorMsg = "";
            #region 条件
           string  sqlwhere = " ";
            if (startTime != null)
            {
                sqlwhere += " and UpTime>='" + startTime + "' ";
            }
            if (endTime != null)
            {
                endTime = DateTime.Parse(endTime.ToString()).AddDays(1);
                sqlwhere += " and UpTime<='" + endTime + "' ";
            }
            #endregion
            string query =string.Format(@"
 SELECT M_WorkOrder_Oper.OperId,OperName,OperName2,case when mm.sumcount is null then 0 else mm.sumcount end as sumcount ,ROW_NUMBER() OVER(ORDER BY rankorder) [rank]
FROM M_WorkOrder_Oper left join(select mh.OperId, count(0) as sumcount from M_Event m LEFT OUTER JOIN(
                                 SELECT B.OperId, b.EventID
                                    from (SELECT MAX(ExecUpDateTime) AS ExecUpDateTime, h.EventID
                                        FROM dbo.M_WorkOrder_Oper_History h
                                        GROUP BY h.EventID) AS a LEFT OUTER JOIN dbo.M_WorkOrder_Oper_History as B ON a.EventID = B.EventID AND a.ExecUpDateTime = B.ExecUpDateTime) mh on mh.EventID = m.EventID
                                      where m.DeleteStatus=0  and m.IsValid<>0 {0}
                                        group by mh.OperId) mm on mm.OperId = M_WorkOrder_Oper.OperId
where M_WorkOrder_Oper.OperId in (11, 2, 3, 4, 5, 6, 7, 9) 
 ", sqlwhere);
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
    }
}
